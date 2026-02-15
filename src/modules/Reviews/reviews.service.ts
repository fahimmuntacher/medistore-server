import { paginationsSortingHelper } from "../../helpers/paginationsSortingHelper";
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

export type GetAllReviewOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  rating?: number | undefined; 
};

const getAllReview = async (options: GetAllReviewOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "rating",
    sortOrder = "desc",
    rating,
  } = options;

  const skip = (page - 1) * limit;

  // Grouped rating counts
  const groupedRating = await prisma.review.groupBy({
    by: ["rating"],
    _count: { id: true },
    orderBy: { rating: sortOrder },
  });

  // Find reviews (with optional rating filter)
  const where: any = {};
  if (rating !== undefined) where.rating = rating;

  const reviews = await prisma.review.findMany({
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    where,
  });

  const total = await prisma.review.count({ where });

  return {
    data: reviews,
    groupedRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const reviewService = {
  addReview,
  getAllReview,
};
