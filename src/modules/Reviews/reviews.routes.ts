import { Router } from "express";
import { reviewController } from "./reviews.controller";
import { authMiddleWare, Role } from "../../middlewares/auth.middlware";

const router = Router();

router.post("/", authMiddleWare(Role.CUSTOMER), reviewController.addReview);
router.get("/",  reviewController.getAllReview);
export const reviewsRouter = router;
