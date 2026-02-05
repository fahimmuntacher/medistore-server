import { Router } from "express";
import { medicineController } from "./medicine.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post(
  "/",
  authMiddleWare(Role.SELLER),
  medicineController.createMedicine,
);
router.get("/", medicineController.getMedicine);

router.get("/:id", medicineController.getSingleMedine);

router.put(
  "/:id",
  authMiddleWare(Role.SELLER),
  medicineController.editMedicine,
);

export const MedicineRouter = router;
