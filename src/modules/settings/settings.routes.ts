import express from "express";
import { getSettings, upsertSettings } from "./settings.controller";
import authMiddleWare, {  Role } from "../../middlewares/auth.middlware";

const router = express.Router();

// public
router.get("/", getSettings);

// admin
router.put("/", authMiddleWare(Role.ADMIN), upsertSettings);

export const settingsRoutes = router;
