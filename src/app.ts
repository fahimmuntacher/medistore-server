import express, { Application } from "express";
import { MedicineRouter } from "./modules/medicine/medicine.routes";
import { CategoryRouter } from "./modules/category/category.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { OrderRouter } from "./modules/Orders/orders.routes";
import { reviewsRouter } from "./modules/Reviews/reviews.routes";
import { settingsRoutes } from "./modules/settings/settings.routes";
import { menuRotuer } from "./modules/menus/menu.routes";
import { CartRoutes } from "./modules/cart/cart.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000", // client side url
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

// medicine
app.use("/api/v1/medicines", MedicineRouter);
// categories
app.use("/api/v1/categories", CategoryRouter);
// cart
app.use("/api/v1/cart", CartRoutes);

// orders
app.use("/api/v1/orders", OrderRouter);
// reviews
app.use("/api/v1/reviews", reviewsRouter);
// site setting
app.use("/api/v1/site-settings", settingsRoutes);
// menus router
app.use("/api/v1/menus", menuRotuer);
// dashboard router
app.use("/api/v1/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("Hello from medistore");
});

export default app;
