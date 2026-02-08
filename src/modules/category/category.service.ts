import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface GetCategoryParams {
  search?: string;
  page?: number;
  limit?: number;
}

// create category
const createCategory = async (data: Category) => {
  const result = await prisma.category.create({
    data,
  });

  return result;
};

// get all category


const getCategory = async ({
  search,
  page = 1,
  limit = 10,
}: GetCategoryParams) => {
  const skip = (page - 1) * limit;

  const where: any = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  const total = await prisma.category.count({ where });

  const categories = await prisma.category.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// edit category
const editCategory = async (data: any, categoryId: string) => {
  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: data,
  });
  return result;
};

// delete category
const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id: id,
    },
  });
  return result;
};

export const categoryService = {
  createCategory,
  getCategory,
  editCategory,
  deleteCategory,
};
