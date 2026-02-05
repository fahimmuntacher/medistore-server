import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post("/", authMiddleWare(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getCategory);
router.put("/:id", authMiddleWare(Role.ADMIN), categoryController.editCategory);
router.delete(
  "/:id",
  authMiddleWare(Role.ADMIN),
  categoryController.deleteCategory,
);

export const CategoryRouter = router;
