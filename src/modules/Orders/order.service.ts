import { prisma } from "../../lib/prisma";

type OrderInput = {
  customerId: string;
  shippingAddress: string;
  paymentMethod?: "COD";
  items: {
    medicineId: string;
    quantity: number;
  }[];
};

const createOrder = async (data: OrderInput) => {
  // Step 1: Prepare order items and validate stock
  const orderItems = [];
  const medicineUpdates = [];
  let totalAmount = 0;

  for (const item of data.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId },
    });

    if (!medicine) {
      throw new Error(`Medicine with ID ${item.medicineId} not found`);
    }

    if (medicine.stock < item.quantity) {
      throw new Error(`${medicine.name} out of stock`);
    }

    totalAmount += medicine.price * item.quantity;

    // Prepare order item
    orderItems.push({
      medicineId: medicine.id,
      quantity: item.quantity,
      price: medicine.price,
    });

    // Prepare stock update
    medicineUpdates.push(
      prisma.medicine.update({
        where: { id: medicine.id },
        data: { stock: { decrement: item.quantity } },
      }),
    );
  }

  // Step 2: Run all updates + order creation in a single transaction
  const results = await prisma.$transaction([
    ...medicineUpdates,
    prisma.order.create({
      data: {
        customerId: data.customerId,
        shippingAddress: data.shippingAddress,
        totalAmount,
        paymentMethod: data.paymentMethod ?? "COD",
        items: {
          create: orderItems,
        },
      },
    }),
  ]);

  const order = results[results.length - 1];

  return order;
};

export const orderService = {
  createOrder,
};
