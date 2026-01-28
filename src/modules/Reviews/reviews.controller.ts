import { Request, Response } from "express";
import { reviewService } from "./reviews.service";

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
    const result = await reviewService.getAllReview();
    res.status(200).json({
      success: true,
      data: result,
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
