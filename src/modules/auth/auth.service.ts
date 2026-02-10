import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { Role } from "../../middlewares/auth.middlware";

export type IGetAllUserParams = {
  page: number;
  limit: number;
  skip: number;
  search?: string | undefined;
  role?: Role | undefined;
};

const getAllUser = async ({
  page,
  limit,
  skip,
  search,
  role,
}: IGetAllUserParams) => {
  const andConditions: Prisma.UserWhereInput[] = [];

  /* Search by email only */
  if (search) {
    andConditions.push({
      email: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  /*  Role filter (SELLER / CUSTOMER) */
  if (role) {
    andConditions.push({
      role,
    });
  } else {
    // default → only seller & customer
    andConditions.push({
      role: {
        in: [Role.SELLER, Role.CUSTOMER],
      },
    });
  }

  const users = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      emailVerified: true,
      isBanned: true,
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let extraInfo: Record<string, number> = {};

  /* 👤 Customer → total orders */
  if (user.role === Role.CUSTOMER) {
    const totalOrders = await prisma.order.count({
      where: {
        customerId: user.id,
      },
    });

    const totalReviews = await prisma.review.count({
        where: {
            customerId: user.id
        }
    })

    extraInfo.totalOrders = totalOrders;
    extraInfo.totalReviews = totalReviews;
  }

  /* 🏪 Seller → total active medicines */
  if (user.role === Role.SELLER) {
    const totalActiveMedicines = await prisma.medicine.count({
      where: {
        sellerId: user.id,
      },

    });
    

    extraInfo.totalActiveMedicines = totalActiveMedicines;
  }

  return {
    ...user,
    ...extraInfo,
  };
};

const editUser = async (
  userId: string,
  data: Partial<Prisma.UserUpdateInput>,
) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
  return result;
};

export const AuthServices = {
  getAllUser,
  editUser,
  getSingleUser,
};
