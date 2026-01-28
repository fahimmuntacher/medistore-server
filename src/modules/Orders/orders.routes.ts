import { Request, Response, Router } from "express";

const router = Router()


router.get("/", async(req : Request, res : Response) => {
    res.send("hello from order api")
})

export const OrderRouter = router;