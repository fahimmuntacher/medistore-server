import express, { Application } from "express";
import { MedicineRouter } from "./modules/medicine/medicine.routes";
import { CategoryRouter } from "./modules/category/category.routes";
const app: Application = express();
app.use(express.json());

app.use("/api/v1/medicine", MedicineRouter);
app.use("/api/v1/category", CategoryRouter);

app.get("/", (req, res) => {
  res.send("Hello from medistore");
});

export default app;
