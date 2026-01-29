import express, { Application } from "express";
import { MedicineRouter } from "./modules/medicine/medicine.routes";
import { CategoryRouter } from "./modules/category/category.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { OrderRouter } from "./modules/Orders/orders.routes";
import { reviewsRouter } from "./modules/Reviews/reviews.routes";
import { settingsRoutes } from "./modules/settings/settings.routes";
import { menuRotuer } from "./modules/menus/menu.routes";
const app: Application = express();
app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

// medicine
app.use("/api/v1/medicines", MedicineRouter);
// categories
app.use("/api/v1/categories", CategoryRouter);
// orders
app.use("/api/v1/orders", OrderRouter);
// reviews
app.use("/api/v1/reviews", reviewsRouter);
// site setting
app.use("/api/v1/site-settings", settingsRoutes);
// menus router
app.use("/api/v1/menus", menuRotuer);

app.get("/", (req, res) => {
  res.send("Hello from medistore");
});

export default app;
