import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post(
  "/",
  authMiddleWare(Role.CUSTOMER),
  categoryController.createCategory,
);

export const CategoryRouter = router;
