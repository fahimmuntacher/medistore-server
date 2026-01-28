import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { paginationsSortingHelper } from "../../helpers/paginationsSortingHelper";

// create medicine
const createMedicine = async (req: Request, res: Response) => {
  try {
    const result = await medicineService.createMedicine(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Medicine Create failed",
      details: error.message,
    });
  }
};

const getMedicine = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;

    const manufacturer =
      typeof req.query.manufacturer === "string"
        ? req.query.manufacturer
        : undefined;

    const minPrice =
      typeof req.query.minPrice === "string"
        ? Number(req.query.minPrice)
        : undefined;

    const maxPrice =
      typeof req.query.maxPrice === "string"
        ? Number(req.query.maxPrice)
        : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationsSortingHelper(
      req.query,
    );

    const result = await medicineService.getAllMedicine({
      search,
      category,
      manufacturer,
      minPrice,
      maxPrice,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Medicine retrieve failed",
      details: error.message,
    });
  }
};

export const medicineController = {
  createMedicine,
  getMedicine,
};
