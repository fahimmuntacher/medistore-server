import { Router } from "express";
import authMiddleWare, {Role } from "../../middlewares/auth.middlware";
import { cartControllers } from "./cart.controller";

const router = Router();

router.get("/", authMiddleWare(Role.CUSTOMER), cartControllers.getCart);

router.post("/", authMiddleWare(Role.CUSTOMER), cartControllers.addToCart);

router.patch(
  "/:itemId",
  authMiddleWare(Role.CUSTOMER),
  cartControllers.updateQuantity,
);

router.delete(
  "/clear",
  authMiddleWare(Role.CUSTOMER),
  cartControllers.clearCart,
);

router.delete(
  "/:itemId",
  authMiddleWare(Role.CUSTOMER),
  cartControllers.removeItem,
);

export const CartRoutes = router;
