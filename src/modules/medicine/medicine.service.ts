import { Medicine, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// create medicine
const createMedicine = async (
  data: Omit<Medicine, "id" | "createdAt |updatedAt ">,
) => {
  const result = await prisma.medicine.create({
    data,
  });

  return result;
};

// get all medicine

const getAllMedicine = async ({
  search,
  category,
  manufacturer,
  minPrice,
  maxPrice,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string | undefined;
  category?: string | undefined;
  manufacturer?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) => {
  const andConditions: Prisma.MedicineWhereInput[] = [];

  /* Search */
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                slug: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
    });
  }

  /*Category filter */
  if (category) {
    andConditions.push({
      category: {
        slug: category,
      },
    });
  }

  /*Manufacturer filter */
  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive",
      },
    });
  }

  /*  Price range */
  if (minPrice !== undefined || maxPrice !== undefined) {
    const price: Prisma.IntFilter = {};

    if (minPrice !== undefined) price.gte = minPrice;
    if (maxPrice !== undefined) price.lte = maxPrice;

    andConditions.push({ price });
  }

  /*  Query */
  const medicines = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    include: {
      category: true,
      reviews: {
        select: { rating: true },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  /* Count */
  const total = await prisma.medicine.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    medicines,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// get single medicine
const getSingleMedine = async (id: string) => {
  const result = await prisma.medicine.findUnique({
    where: {
      id,
    },
    include: {
      category : {
        select : {
          name : true,
          slug : true
        }
      },
      seller: {
        select: {
          email: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return result;
};

// edit medicine

const editMedicine = async (data: any, id: string) => {
  const result = await prisma.medicine.update({
    where: {
      id: id,
    },
    data,
  });
  return result;
};

export const medicineService = {
  createMedicine,
  getAllMedicine,
  getSingleMedine,
  editMedicine,
};
