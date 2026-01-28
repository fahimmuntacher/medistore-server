import { Router } from "express";
import { medicineController } from "./medicine.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post(
  "/",
  authMiddleWare(Role.SELLER),
  medicineController.createMedicine,
);
router.get(
  "/",
  medicineController.getMedicine,
);

export const MedicineRouter = router;
