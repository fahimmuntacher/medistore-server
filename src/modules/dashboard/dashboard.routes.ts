import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.get(
  "/admin",
  authMiddleWare(Role.ADMIN),
  dashboardController.adminOverview,
);
router.get(
  "/seller",
  authMiddleWare(Role.SELLER),
  dashboardController.sellerOverview,
);
router.get(
  "/customer",
  authMiddleWare(Role.CUSTOMER),
  dashboardController.customerOverview,
);

export const dashboardRouter = router;
