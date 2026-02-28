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
import { authRouter } from "./modules/auth/auth.routes";
const app: Application = express();

app.set("trust proxy", true);

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (mobile apps, Postman, etc.)
//       if (!origin) return callback(null, true);

//       // Check if origin is in allowedOrigins or matches Vercel preview pattern
//       const isAllowed =
//         allowedOrigins.includes(origin) ||
//         /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
//         /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

//       if (isAllowed) {
//         callback(null, true);
//       } else {
//         callback(new Error(`Origin ${origin} not allowed by CORS`));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//     exposedHeaders: ["Set-Cookie"],
//   }),
// );

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
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

// auth router
app.use("/api/v1/users", authRouter);

app.get("/", (req, res) => {
  res.send("Hello from medistore");
});

export default app;
