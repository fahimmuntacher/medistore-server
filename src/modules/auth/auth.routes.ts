import { Router } from "express";
import { AuthController } from "./auth.controller";
import authMiddleWare, {  Role } from "../../middlewares/auth.middlware";

const router = Router();

router.get("/", authMiddleWare(Role.ADMIN), AuthController.getAllUser);
router.get("/:id",authMiddleWare(Role.ADMIN), AuthController.getSingleUser);
router.put("/:id",authMiddleWare(Role.ADMIN), AuthController.editSingleUser);

export const authRouter = router;
