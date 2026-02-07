import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { paginationsSortingHelper } from "../../helpers/paginationsSortingHelper";
import { Role } from "../../middlewares/auth.middlware";

const createMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user || user.role !== Role.SELLER) {
      return res.status(403).json({
        error: "Only sellers can create medicine",
      });
    }

    const result = await medicineService.createMedicine({
      ...req.body,
      sellerId: user.id, 
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Medicine Create failed",
      details: error.message,
    });
  }
};


// get all medicine controller
const getMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    // console.log("seller id", user);
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
      sellerId: user?.role === Role.SELLER ? user.id : undefined,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Medicine retrieve failed",
      details: error.message,
    });
  }
};

const getSingleMedine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await medicineService.getSingleMedine(id as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Medicine retrive failed",
      details: error.message,
    });
  }
};

const editMedicine = async (req: Request, res: Response) => {
  try {
    const editedData = req.body;
    const { id } = req.params;
    const result = await medicineService.editMedicine(editedData, id as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Medicine edit failed",
      details: error.message,
    });
  }
};

const deleMedicine = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    console.log("seller ID for delte", sellerId);
    const { id } = req.params;
    const result = await medicineService.deleteMedicine(
      id as string,
      sellerId as string,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Medicine retrive failed",
      details: error.message,
    });
  }
};

export const medicineController = {
  createMedicine,
  getMedicine,
  getSingleMedine,
  editMedicine,
  deleMedicine,
};
