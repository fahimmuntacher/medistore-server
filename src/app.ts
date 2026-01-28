import express, { Application } from "express";
import { MedicineRouter } from "./modules/medicine/medicine.routes";
import { CategoryRouter } from "./modules/category/category.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app: Application = express();
app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api/v1/medicines", MedicineRouter);
app.use("/api/v1/categories", CategoryRouter);

app.get("/", (req, res) => {
  res.send("Hello from medistore");
});

export default app;
