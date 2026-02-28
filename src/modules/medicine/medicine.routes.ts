import { Router } from "express";
import { medicineController } from "./medicine.controller";
import authMiddleWare, { Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post(
  "/",
  authMiddleWare(Role.SELLER),
  medicineController.createMedicine,
);
router.get("/", medicineController.getMedicine);
router.get(
  "/seller",
  authMiddleWare(Role.SELLER),
  medicineController.getMedicine,
);

router.get("/:id", medicineController.getSingleMedine);

router.put(
  "/:id",
  authMiddleWare(Role.SELLER),
  medicineController.editMedicine,
);

router.delete(
  "/:id",
  authMiddleWare(Role.SELLER),
  medicineController.deleMedicine,
);

export const MedicineRouter = router;
