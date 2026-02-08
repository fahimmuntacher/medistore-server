import { Request, Response } from "express";
import { categoryService } from "./category.service";

// create category
const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Category creation failed",
      details: error.message,
    });
  }
};

// get all category
const getCategory = async (req: Request, res: Response) => {
  try {
    const { search, page, limit } = req.query;

    const result = await categoryService.getCategory({
      search: search as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Category retrieval failed",
      details: error.message,
    });
  }
};
// delete category
const editCategory = async (req: Request, res: Response) => {
  try {
    const editedData = req.body;
    const { id } = req.params;
    const result = await categoryService.editCategory(editedData, id as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Category update failed",
      details: error.message,
    });
  }
};

// delete category
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // console.log("categoryId:", id);
    const result = await categoryService.deleteCategory(id as string);
    res.status(200).json({
      result,
    });
  } catch (error: any) {
    res.status(400).json({
      error: "Category delte failed",
      details: error.message,
    });
  }
};

export const categoryController = {
  createCategory,
  getCategory,
  editCategory,
  deleteCategory,
};
