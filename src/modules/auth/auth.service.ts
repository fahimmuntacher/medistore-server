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

export const AuthServices = {
  getAllUser,
};
