import { Request, Response } from "express";
import { CartServices } from "./cart.service";

const getCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  try {
    const cart = await CartServices.getCart(customerId as string);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      data: error,
    });
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { medicineId, price, quantity = 1 } = req.body;

    const item = await CartServices.addToCart(
      customerId as string,
      medicineId,
      price,
      quantity,
    );

    res.status(201).json({
      success: true,
      message: "Added to cart",
      data: item,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateQuantity = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const result = await CartServices.updateQuantity(
      customerId as string,
      itemId as string,
      Number(quantity),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeItem = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { itemId } = req.params;

    await CartServices.removeItem(customerId as string, itemId as string);

    res.status(200).json({
      success: true,
      message: "Item removed",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error,
    });
  }
};

const clearCart = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    // console.log("Attempting to clear cart for customerId:", customerId);

    if (!customerId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    await CartServices.clearCart(customerId as string);

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error: any) {
    // console.error("DETAILED CLEAR CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const cartControllers = {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
};
