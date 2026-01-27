import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post(
  "/",
  authMiddleWare(Role.CUSTOMER),
  categoryController.createCategory,
);
router.get("/", categoryController.getCategory);
router.put("/:id", categoryController.editCategory);

export const CategoryRouter = router;
