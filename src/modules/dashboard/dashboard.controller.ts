import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

const adminOverview = async (req: Request, res: Response) => {
  try {
    const result = await dashboardService.adminOverview();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: "Admin dashboard failed",
      error: error.message,
    });
  }
};


const sellerOverview = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id as string;

    const result = await dashboardService.sellerOverview(sellerId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: "Seller dashboard failed",
      error: error.message,
    });
  }
};


const customerOverview = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    console.log(req.user);
    console.log("customer id" ,customerId);
    const result = await dashboardService.customerOverview(customerId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: "Customer dashboard failed",
      error: error.message,
    });
  }
};



export const dashboardController = {
  adminOverview,
  sellerOverview,
  customerOverview
};
