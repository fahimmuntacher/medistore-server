import { Router } from "express";
import { medicineController } from "./medicine.controller";

const router = Router();

router.post("/", medicineController.createMedicine);

export const MedicineRouter = router;
