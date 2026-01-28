import { Request, Response } from "express";
import { orderService } from "./order.service";
import { paginationsSortingHelper } from "../../helpers/paginationsSortingHelper";

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

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const { page, limit, skip, sortBy, sortOrder } = paginationsSortingHelper(
      req.query,
    );

    const result = await orderService.getAllOrders({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      search,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      error: "Orders retrieve failed",
      details: error.message,
    });
  }
};

export const orderController = {
  createOrder,
  getAllOrders,
};
