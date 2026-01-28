import { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

export const orderController = {
  createOrder,
};
