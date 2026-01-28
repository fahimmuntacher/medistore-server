import { Router } from "express";
import { orderController } from "./orders.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post("/", authMiddleWare(Role.CUSTOMER), orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get(
  "/:id",
  authMiddleWare(Role.ADMIN, Role.CUSTOMER),
  orderController.getSingleOrder,
);
router.put("/:id", authMiddleWare(Role.ADMIN), orderController.editSingleOrder);

export const OrderRouter = router;
