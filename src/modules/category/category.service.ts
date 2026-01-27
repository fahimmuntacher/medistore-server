import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Category) => {
  const result = await prisma.category.create({
    data,
  });

  return result;
};

const getCategory = async (search?: string) => {
  return await prisma.category.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
  });
};

const editCategory = async (data: any, categoryId: string) => {
  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: data,
  });
  return result;
};

export const categoryService = {
  createCategory,
  getCategory,
  editCategory,
};
