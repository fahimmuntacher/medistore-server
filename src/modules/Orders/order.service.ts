import { OrderStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

type OrderInput = {
  shippingAddress: string;
  paymentMethod?: "COD";
  items: {
    medicineId: string;
    quantity: number;
  }[];
};

const createOrder = async (data: OrderInput, customerId: string) => {
  let totalAmount = 0;
  const orderItems = [];
  const medicineUpdates = [];

  for (const item of data.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId },
    });

    if (!medicine)
      throw new Error(`Medicine with ID ${item.medicineId} not found`);
    if (medicine.stock < item.quantity)
      throw new Error(`${medicine.name} out of stock`);

    totalAmount += medicine.price * item.quantity;

    orderItems.push({
      medicineId: medicine.id,
      quantity: item.quantity,
      price: medicine.price,
    });

    medicineUpdates.push(
      prisma.medicine.update({
        where: { id: medicine.id },
        data: { stock: { decrement: item.quantity } },
      }),
    );
  }

  const results = await prisma.$transaction([
    ...medicineUpdates,
    prisma.order.create({
      data: {
        customerId,
        shippingAddress: data.shippingAddress,
        totalAmount,
        paymentMethod: data.paymentMethod ?? "COD",
        items: { create: orderItems },
      },
    }),
  ]);

  return results[results.length - 1];
};

interface IGetAllOrdersParams {
  page?: number | undefined;
  limit?: number | undefined;
  skip?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: "asc" | "desc";
  search?: string | undefined;
  customerId?: string | undefined;
  sellerId?: string | undefined
}

const getAllOrders = async ({
  page,
  skip = 0,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  search,
  customerId,
  sellerId,
}: IGetAllOrdersParams) => {
  const andConditions: Prisma.OrderWhereInput[] = [];

  /* Search by order id */
  if (search) {
    andConditions.push({
      id: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  /*  Customer → only own orders */
  if (customerId) {
    andConditions.push({
      customerId,
    });
  }

  /* Seller → orders that contain seller's medicines */
  if (sellerId) {
    andConditions.push({
      items: {
        some: {
          medicine: {
            sellerId,
          },
        },
      },
    });
  }

  const orders = await prisma.order.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              manufacturer: true,
              sellerId: true,
            },
          },
        },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.order.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleOrder = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              manufacturer: true,
            },
          },
        },
      },
    },
  });
};

const editSingleOrder = async (id: string, status: string) => {
  const validStatuses = [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return prisma.order.update({
    where: { id },
    data: {
      status: status as OrderStatus,
    },
  });
};


export const orderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  editSingleOrder,
};
