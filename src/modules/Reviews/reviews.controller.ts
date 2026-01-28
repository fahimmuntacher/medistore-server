import { Request, Response } from "express";
import { GetAllReviewOptions, reviewService } from "./reviews.service";

const addReview = async (req: Request, res: Response) => {
  try {
    const { medicineId, orderId, rating, comment } = req.body;
    const customerId = req.user?.id as string;
    const review = await reviewService.addReview({
      medicineId,
      customerId,
      orderId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllReview = async (req: Request, res: Response) => {
  try {
    // Cast query params properly
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const sortBy = (req.query.sortBy as string) || "rating"; 
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc"; 

    const ratingFilter = req.query.rating ? Number(req.query.rating) : undefined;

    const options: GetAllReviewOptions = {
      page,
      limit,
      sortBy,
      sortOrder,
      rating: ratingFilter,
      
    };

    const result = await reviewService.getAllReview(options);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const reviewController = {
  addReview,
  getAllReview,
};
