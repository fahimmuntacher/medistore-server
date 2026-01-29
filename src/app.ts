import express, { Application } from "express";
import { MedicineRouter } from "./modules/medicine/medicine.routes";
import { CategoryRouter } from "./modules/category/category.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { OrderRouter } from "./modules/Orders/orders.routes";
import { reviewsRouter } from "./modules/Reviews/reviews.routes";
import { settingsRoutes } from "./modules/settings/settings.routes";
const app: Application = express();
app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api/v1/medicines", MedicineRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/orders", OrderRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/site-settings", settingsRoutes);

app.get("/", (req, res) => {
  res.send("Hello from medistore");
});

export default app;
