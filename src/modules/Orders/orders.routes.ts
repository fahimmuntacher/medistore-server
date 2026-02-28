import { Router } from "express";
import { orderController } from "./orders.controller";
import authMiddleWare, {  Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post("/", authMiddleWare(Role.CUSTOMER), orderController.createOrder);

router.get(
  "/",
  authMiddleWare(Role.ADMIN, Role.CUSTOMER, Role.SELLER),
  orderController.getAllOrders,
);

router.get(
  "/:id",
  orderController.getSingleOrder,
);
router.put(
  "/:id",
  authMiddleWare(Role.SELLER, Role.CUSTOMER),
  orderController.editSingleOrder,
);

export const OrderRouter = router;
