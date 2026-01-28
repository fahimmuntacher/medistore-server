import { prisma } from "../../lib/prisma";

const addReview = async ({
  medicineId,
  customerId,
  orderId,
  rating,
  comment,
}: {
  medicineId: string;
  customerId: string;
  orderId: string;
  rating: number;
  comment?: string;
}) => {
  // Check order exists, belongs to user & delivered
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId,
      status: "DELIVERED",
    },
  });

  if (!order) {
    throw new Error("You can only review delivered orders");
  }

  // Check medicine exists in that order
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      orderId,
      medicineId,
    },
  });

  if (!orderItem) {
    throw new Error("This medicine was not part of the order");
  }

  // Prevent duplicate review
  const existingReview = await prisma.review.findUnique({
    where: {
      medicineId_customerId_orderId: {
        medicineId,
        customerId,
        orderId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You already reviewed this medicine for this order");
  }

  // Create review
  return prisma.review.create({
    data: {
      medicineId,
      customerId,
      orderId,
      rating,
      comment: comment ?? null,
    },
  });
};


const getAllReview = async() =>{
    const result = await prisma.review.findMany();
    return result
}

export const reviewService = {
  addReview,
  getAllReview
};
