import { Router } from "express";
import { menuControllers } from "./menu.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

// admin controlled
router.post("/", authMiddleWare(Role.ADMIN), menuControllers.createMenu);
router.post(
  "/item",
  authMiddleWare(Role.ADMIN),
  menuControllers.createMenuItem,
);

router.put(
  "/item/:id",
  authMiddleWare(Role.ADMIN),
  menuControllers.updateMenuItem,
);

router.delete(
  "/item/:id",
  authMiddleWare(Role.ADMIN),
  menuControllers.deleteMenuItem,
);
router.delete("/:id", authMiddleWare(Role.ADMIN), menuControllers.delteMenu);

// public
router.get("/", menuControllers.getMenus);
export const menuRotuer = router;
