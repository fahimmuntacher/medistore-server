import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.get("/", AuthController.getAllUser);

export const authRouter = router;
