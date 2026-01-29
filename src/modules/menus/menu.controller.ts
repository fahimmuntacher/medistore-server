import { Request, Response } from "express";
import { menuService } from "./menu.service";
import { MenuPosition, Role } from "../../../generated/prisma/enums";

// create menu (admin)
const createMenu = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = await menuService.createMenu(name);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Menu creation failed",
      error: error.message,
    });
  }
};

// create menu item (admin)
const createMenuItem = async (req: Request, res: Response) => {
  try {
    const result = await menuService.createMenuItem(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Menu item creation failed",
      error: error.message,
    });
  }
};

// get menu
const getMenus = async (req: Request, res: Response) => {
  try {
    const position = req.query.position as MenuPosition;
    const role = req.user?.role as Role;
    const result = await menuService.getMenusByPosition(
      position,
      role
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Menu fetch failed",
      error: error.message,
    });
  }
};

// update menu item
const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await menuService.updateMenuItem(id as string, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Menu item update failed",
      error: error.message,
    });
  }
};

// delete menu item
const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await menuService.deleteMenuItem(id as string);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Menu item delete failed",
      error: error.message,
    });
  }
};

// delete menu 
const delteMenu = async(req : Request, res : Response) => {
    try {
        const {id } = req.params;
        await menuService.deleteMenu(id as string);
        res.status(200).json({success : true})
    } catch (error : any) {
        res.status(400).json({
      success: false,
      message: "Menu  delete failed",
      error: error.message,
    });
    }
}

export const menuControllers = {
  createMenu,
  createMenuItem,
  getMenus,
  updateMenuItem,
  deleteMenuItem,
  delteMenu
};
