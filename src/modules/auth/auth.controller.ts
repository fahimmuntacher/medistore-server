import { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import { paginationsSortingHelper } from "../../helpers/paginationsSortingHelper";
import { Role } from "../../middlewares/auth.middlware";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const role =
      req.query.role === "SELLER" || req.query.role === "CUSTOMER"
        ? (req.query.role as Role)
        : undefined;

    const { page, limit, skip } = paginationsSortingHelper(req.query);

    const result = await AuthServices.getAllUser({
      page,
      limit,
      skip,
      search,
      role,
    });

    res.status(200).json({
      success: true,
      message: "User retrieve successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: "User retrieval failed",
      details: error.message,
    });
  }
};

export const AuthController = {
  getAllUser,
};
