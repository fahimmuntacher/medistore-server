import { Request, Response } from "express";
import { orderService } from "./order.service";
import { paginationsSortingHelper } from "../../helpers/paginationsSortingHelper";

const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.user?.id as any;
    console.log("customer id order make:", req.user?.id);
    const result = await orderService.createOrder(req.body, req.user?.id as string);
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

const getSingleOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await orderService.getSingleOrder(id as string);
  res.status(200).json(result);
};

const editSingleOrder = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const result = await orderService.editSingleOrder(id as string, status);

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




export const orderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  editSingleOrder,
};
