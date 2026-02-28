// src/app.ts
import express2 from "express";

// src/modules/medicine/medicine.routes.ts
import { Router } from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  email    String  @unique\n  name     String?\n  role     Role    @default(CUSTOMER)\n  isBanned Boolean @default(false)\n\n  medicines Medicine[]\n  orders    Order[]\n  reviews   Review[]\n\n  createdAt     DateTime  @default(now())\n  emailVerified Boolean   @default(false)\n  image         String?\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  cart          Cart?\n\n  @@map("user")\n}\n\nmodel Medicine {\n  id          String @id @default(uuid())\n  name        String @db.VarChar(100)\n  description String @db.Text\n\n  price         Float\n  discountPrice Float @default(0)\n  stock         Int\n\n  manufacturer String\n  image        String\n  isActive     Boolean @default(true)\n\n  sellerId String\n  seller   User   @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  reviews Review[]\n\n  createdAt  DateTime    @default(now())\n  updatedAt  DateTime    @updatedAt\n  orderItems OrderItem[]\n  cartItems  CartItem[]\n}\n\nmodel Category {\n  id        String     @id @default(uuid())\n  name      String\n  slug      String     @unique\n  icon      String?\n  medicines Medicine[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n// order schema \nmodel Order {\n  id         String @id @default(uuid())\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id])\n\n  items           OrderItem[]\n  totalAmount     Float\n  status          OrderStatus   @default(PLACED)\n  paymentMethod   PaymentMethod @default(COD)\n  shippingAddress Json\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  reviews   Review[]\n}\n\n// order item schema\nmodel OrderItem {\n  id      String @id @default(uuid())\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id])\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  quantity Int\n  price    Float\n\n  createdAt DateTime @default(now())\n}\n\n// review schema\nmodel Review {\n  id String @id @default(uuid())\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now())\n\n  @@unique([medicineId, customerId, orderId])\n}\n\nmodel Cart {\n  id         String @id @default(uuid())\n  customerId String @unique\n  customer   User   @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  items CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CartItem {\n  id String @id @default(uuid())\n\n  cartId String\n  cart   Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  quantity Int   @default(1)\n  price    Float // snapshot price\n\n  @@unique([cartId, medicineId])\n}\n\n// site setting model\nmodel SiteSetting {\n  id        String   @id @default(uuid())\n  siteName  String\n  logoUrl   String\n  slogan    String?\n  address   String?\n  email     String?\n  phone     String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Menu {\n  id        String     @id @default(uuid())\n  name      String\n  items     MenuItem[]\n  createdAt DateTime   @default(now())\n}\n\nmodel MenuItem {\n  id           String       @id @default(uuid())\n  label        String\n  url          String\n  order        Int\n  position     MenuPosition\n  menuId       String\n  allowedRoles Role[]\n  menu         Menu         @relation(fields: [menuId], references: [id], onDelete: Cascade)\n  createdAt    DateTime     @default(now())\n}\n\nenum MenuPosition {\n  HEADER\n  FOOTER\n  BOTH\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  COD\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"}],"dbName":"user"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"discountPrice","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicine"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"shippingAddress","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"reviews","kind":"object","type":"Review","relationName":"OrderToReview"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"CartItemToMedicine"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"}],"dbName":null},"SiteSetting":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"siteName","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"slogan","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Menu":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"MenuItem","relationName":"MenuToMenuItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MenuItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"position","kind":"enum","type":"MenuPosition"},{"name":"menuId","kind":"scalar","type":"String"},{"name":"allowedRoles","kind":"enum","type":"Role"},{"name":"menu","kind":"object","type":"Menu","relationName":"MenuToMenuItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/medicine/medicine.service.ts
var createMedicine = async (data) => {
  const result = await prisma.medicine.create({
    data
  });
  return result;
};
var getAllMedicine = async ({
  search,
  category,
  manufacturer,
  minPrice,
  maxPrice,
  sellerId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
        {
          category: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } }
            ]
          }
        }
      ]
    });
  }
  if (sellerId) {
    andConditions.push({
      sellerId
    });
  }
  if (category) {
    andConditions.push({
      category: { slug: category }
    });
  }
  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive"
      }
    });
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    const price = {};
    if (minPrice !== void 0) price.gte = minPrice;
    if (maxPrice !== void 0) price.lte = maxPrice;
    andConditions.push({ price });
  }
  const medicines = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    include: {
      category: true,
      reviews: {
        select: { rating: true }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.medicine.count({
    where: {
      AND: andConditions
    }
  });
  return {
    medicines,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getSingleMedine = async (id) => {
  const result = await prisma.medicine.findUnique({
    where: {
      id
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true
        }
      },
      seller: {
        select: {
          email: true,
          name: true,
          image: true
        }
      },
      reviews: true
    }
  });
  return result;
};
var editMedicine = async (data, id) => {
  const result = await prisma.medicine.update({
    where: {
      id
    },
    data
  });
  return result;
};
var deleteMedicine = async (id, sellerId) => {
  const medicine = await prisma.medicine.findFirst({
    where: {
      id,
      sellerId
    }
  });
  if (!medicine) {
    throw new Error("Medicine not found or you are not authorized");
  }
  const result = await prisma.medicine.delete({
    where: {
      id
    }
  });
  return result;
};
var medicineService = {
  createMedicine,
  getAllMedicine,
  getSingleMedine,
  editMedicine,
  deleteMedicine
};

// src/helpers/paginationsSortingHelper.ts
var paginationsSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: `${process.env.API_URL}`,
  trustedOrigins: ["http://localhost:3000", `${process.env.PROD_APP_URL}`],
  user: {
    additionalFields: {
      role: {
        type: "string"
      }
    }
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/middlewares/auth.middlware.ts
var authMiddleWare = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verfiy your email!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resources!"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/medicine/medicine.controller.ts
var createMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "SELLER" /* SELLER */) {
      return res.status(403).json({
        error: "Only sellers can create medicine"
      });
    }
    const result = await medicineService.createMedicine({
      ...req.body,
      sellerId: user.id
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine Create failed",
      details: error.message
    });
  }
};
var getMedicine = async (req, res) => {
  try {
    const user = req.user;
    const search = typeof req.query.search === "string" ? req.query.search : void 0;
    const category = typeof req.query.category === "string" ? req.query.category : void 0;
    const manufacturer = typeof req.query.manufacturer === "string" ? req.query.manufacturer : void 0;
    const minPrice = typeof req.query.minPrice === "string" ? Number(req.query.minPrice) : void 0;
    const maxPrice = typeof req.query.maxPrice === "string" ? Number(req.query.maxPrice) : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationsSortingHelper(
      req.query
    );
    const result = await medicineService.getAllMedicine({
      search,
      category,
      manufacturer,
      minPrice,
      maxPrice,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      sellerId: user?.role === "SELLER" /* SELLER */ ? user.id : void 0
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine retrieve failed",
      details: error.message
    });
  }
};
var getSingleMedine2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await medicineService.getSingleMedine(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine retrive failed",
      details: error.message
    });
  }
};
var editMedicine2 = async (req, res) => {
  try {
    const editedData = req.body;
    const { id } = req.params;
    const result = await medicineService.editMedicine(editedData, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine edit failed",
      details: error.message
    });
  }
};
var deleMedicine = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    console.log("seller ID for delte", sellerId);
    const { id } = req.params;
    const result = await medicineService.deleteMedicine(
      id,
      sellerId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine retrive failed",
      details: error.message
    });
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getMedicine,
  getSingleMedine: getSingleMedine2,
  editMedicine: editMedicine2,
  deleMedicine
};

// src/modules/medicine/medicine.routes.ts
var router = Router();
router.post(
  "/",
  authMiddleWare("SELLER" /* SELLER */),
  medicineController.createMedicine
);
router.get("/", medicineController.getMedicine);
router.get("/seller", authMiddleWare("SELLER" /* SELLER */), medicineController.getMedicine);
router.get("/:id", medicineController.getSingleMedine);
router.put(
  "/:id",
  authMiddleWare("SELLER" /* SELLER */),
  medicineController.editMedicine
);
router.delete("/:id", authMiddleWare("SELLER" /* SELLER */), medicineController.deleMedicine);
var MedicineRouter = router;

// src/modules/category/category.routes.ts
import { Router as Router2 } from "express";

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  const result = await prisma.category.create({
    data
  });
  return result;
};
var getCategory = async ({
  search,
  page = 1,
  limit = 10
}) => {
  const skip = (page - 1) * limit;
  const where = search ? { name: { contains: search, mode: "insensitive" } } : {};
  const total = await prisma.category.count({ where });
  const categories = await prisma.category.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" }
  });
  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var editCategory = async (data, categoryId) => {
  const result = await prisma.category.update({
    where: {
      id: categoryId
    },
    data
  });
  return result;
};
var deleteCategory = async (id) => {
  const result = await prisma.category.delete({
    where: {
      id
    }
  });
  return result;
};
var categoryService = {
  createCategory,
  getCategory,
  editCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Category creation failed",
      details: error.message
    });
  }
};
var getCategory2 = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const result = await categoryService.getCategory({
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Category retrieval failed",
      details: error.message
    });
  }
};
var editCategory2 = async (req, res) => {
  try {
    const editedData = req.body;
    const { id } = req.params;
    const result = await categoryService.editCategory(editedData, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Category update failed",
      details: error.message
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.status(200).json({
      result
    });
  } catch (error) {
    res.status(400).json({
      error: "Category delte failed",
      details: error.message
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getCategory: getCategory2,
  editCategory: editCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.routes.ts
var router2 = Router2();
router2.post("/", authMiddleWare("ADMIN" /* ADMIN */), categoryController.createCategory);
router2.get("/", categoryController.getCategory);
router2.put("/:id", authMiddleWare("ADMIN" /* ADMIN */), categoryController.editCategory);
router2.delete(
  "/:id",
  authMiddleWare("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var CategoryRouter = router2;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/modules/Orders/orders.routes.ts
import { Router as Router3 } from "express";

// src/modules/Orders/order.service.ts
var createOrder = async (data, customerId) => {
  let totalAmount = 0;
  const orderItems = [];
  const medicineUpdates = [];
  for (const item of data.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId }
    });
    if (!medicine)
      throw new Error(`Medicine with ID ${item.medicineId} not found`);
    if (medicine.stock < item.quantity)
      throw new Error(`${medicine.name} out of stock`);
    totalAmount += medicine.price * item.quantity;
    orderItems.push({
      medicineId: medicine.id,
      quantity: item.quantity,
      price: medicine.price
    });
    medicineUpdates.push(
      prisma.medicine.update({
        where: { id: medicine.id },
        data: { stock: { decrement: item.quantity } }
      })
    );
  }
  const results = await prisma.$transaction([
    ...medicineUpdates,
    prisma.order.create({
      data: {
        customerId,
        shippingAddress: data.shippingAddress,
        totalAmount,
        paymentMethod: data.paymentMethod ?? "COD",
        items: { create: orderItems }
      }
    })
  ]);
  return results[results.length - 1];
};
var getAllOrders = async ({
  page,
  skip = 0,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  search,
  customerId,
  sellerId
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      id: {
        contains: search,
        mode: "insensitive"
      }
    });
  }
  if (customerId) {
    andConditions.push({
      customerId
    });
  }
  if (sellerId) {
    andConditions.push({
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      }
    });
  }
  const orders = await prisma.order.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              manufacturer: true,
              sellerId: true
            }
          }
        }
      },
      reviews: true
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.order.count({
    where: {
      AND: andConditions
    }
  });
  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getSingleOrder = async (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              manufacturer: true,
              reviews: true
            }
          }
        }
      }
    }
  });
};
var editSingleOrder = async (id, status) => {
  const validStatuses = [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  return prisma.order.update({
    where: { id },
    data: {
      status
    }
  });
};
var orderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  editSingleOrder
};

// src/modules/Orders/orders.controller.ts
var createOrder2 = async (req, res) => {
  try {
    console.log("customer id order make:", req.user?.id);
    const result = await orderService.createOrder(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Order creation failed",
      error: error.message
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationsSortingHelper(req.query);
    const user = req.user;
    const result = await orderService.getAllOrders({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      search,
      customerId: user?.role === "CUSTOMER" ? user.id : void 0,
      sellerId: user?.role === "SELLER" ? user.id : void 0
    });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Orders retrieve failed",
      error: error.message
    });
  }
};
var getSingleOrder2 = async (req, res) => {
  const { id } = req.params;
  const result = await orderService.getSingleOrder(id);
  res.status(200).json(result);
};
var editSingleOrder2 = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const result = await orderService.editSingleOrder(id, status);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var orderController = {
  createOrder: createOrder2,
  getAllOrders: getAllOrders2,
  getSingleOrder: getSingleOrder2,
  editSingleOrder: editSingleOrder2
};

// src/modules/Orders/orders.routes.ts
var router3 = Router3();
router3.post("/", authMiddleWare("CUSTOMER" /* CUSTOMER */), orderController.createOrder);
router3.get(
  "/",
  authMiddleWare("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  orderController.getAllOrders
);
router3.get(
  "/:id",
  orderController.getSingleOrder
);
router3.put(
  "/:id",
  authMiddleWare("SELLER" /* SELLER */, "CUSTOMER" /* CUSTOMER */),
  orderController.editSingleOrder
);
var OrderRouter = router3;

// src/modules/Reviews/reviews.routes.ts
import { Router as Router4 } from "express";

// src/modules/Reviews/reviews.service.ts
var addReview = async ({
  medicineId,
  customerId,
  orderId,
  rating,
  comment
}) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId,
      status: "DELIVERED"
    }
  });
  if (!order) {
    throw new Error("You can only review delivered orders");
  }
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      orderId,
      medicineId
    }
  });
  if (!orderItem) {
    throw new Error("This medicine was not part of the order");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      medicineId_customerId_orderId: {
        medicineId,
        customerId,
        orderId
      }
    }
  });
  if (existingReview) {
    throw new Error("You already reviewed this medicine for this order");
  }
  return prisma.review.create({
    data: {
      medicineId,
      customerId,
      orderId,
      rating,
      comment: comment ?? null
    }
  });
};
var getAllReview = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "rating",
    sortOrder = "desc",
    rating
  } = options;
  const skip = (page - 1) * limit;
  const groupedRating = await prisma.review.groupBy({
    by: ["rating"],
    _count: { id: true },
    orderBy: { rating: sortOrder }
  });
  const where = {};
  if (rating !== void 0) where.rating = rating;
  const reviews = await prisma.review.findMany({
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    where
  });
  const total = await prisma.review.count({ where });
  return {
    data: reviews,
    groupedRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var reviewService = {
  addReview,
  getAllReview
};

// src/modules/Reviews/reviews.controller.ts
var addReview2 = async (req, res) => {
  try {
    const { medicineId, orderId, rating, comment } = req.body;
    const customerId = req.user?.id;
    const review = await reviewService.addReview({
      medicineId,
      customerId,
      orderId,
      rating,
      comment
    });
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getAllReview2 = async (req, res) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const sortBy = req.query.sortBy || "rating";
    const sortOrder = req.query.sortOrder || "desc";
    const ratingFilter = req.query.rating ? Number(req.query.rating) : void 0;
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
      rating: ratingFilter
    };
    const result = await reviewService.getAllReview(options);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var reviewController = {
  addReview: addReview2,
  getAllReview: getAllReview2
};

// src/modules/Reviews/reviews.routes.ts
var router4 = Router4();
router4.post("/", authMiddleWare("CUSTOMER" /* CUSTOMER */), reviewController.addReview);
router4.get("/", reviewController.getAllReview);
var reviewsRouter = router4;

// src/modules/settings/settings.routes.ts
import express from "express";

// src/modules/settings/settings.service.ts
var getSettings = async () => {
  return prisma.siteSetting.findFirst();
};
var upsertSettings = async (data) => {
  const existing = await prisma.siteSetting.findFirst();
  if (existing) {
    return prisma.siteSetting.update({
      where: { id: existing.id },
      data
    });
  }
  return prisma.siteSetting.create({
    data
  });
};
var settingsService = {
  getSettings,
  upsertSettings
};

// src/modules/settings/settings.controller.ts
var getSettings2 = async (req, res) => {
  try {
    const result = await settingsService.getSettings();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch settings",
      details: error.message
    });
  }
};
var upsertSettings2 = async (req, res) => {
  try {
    const result = await settingsService.upsertSettings(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Settings update failed",
      details: error.message
    });
  }
};

// src/modules/settings/settings.routes.ts
var router5 = express.Router();
router5.get("/", getSettings2);
router5.put("/", authMiddleWare("ADMIN" /* ADMIN */), upsertSettings2);
var settingsRoutes = router5;

// src/modules/menus/menu.routes.ts
import { Router as Router5 } from "express";

// src/modules/menus/menu.service.ts
var createMenu = async (name) => {
  return prisma.menu.create({
    data: { name }
  });
};
var createMenuItem = async (data) => {
  const isMatchUrl = await prisma.menuItem.findFirst({
    where: { url: data.url }
  });
  if (isMatchUrl) {
    throw new Error("Url must be unique");
  }
  return await prisma.menuItem.create({
    data
  });
};
var getMenusByPosition = async (position, role) => {
  return prisma.menu.findMany({
    include: {
      items: {
        select: {
          id: true,
          label: true,
          url: true
        }
      }
    }
  });
};
var updateMenuItem = async (id, data) => {
  return prisma.menuItem.update({
    where: { id },
    data
  });
};
var deleteMenuItem = async (id) => {
  return prisma.menuItem.delete({
    where: { id }
  });
};
var deleteMenu = async (id) => {
  return prisma.menu.delete({
    where: { id }
  });
};
var menuService = {
  createMenu,
  createMenuItem,
  getMenusByPosition,
  updateMenuItem,
  deleteMenuItem,
  deleteMenu
};

// src/modules/menus/menu.controller.ts
var createMenu2 = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await menuService.createMenu(name);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Menu creation failed",
      error: error.message
    });
  }
};
var createMenuItem2 = async (req, res) => {
  try {
    const result = await menuService.createMenuItem(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Menu item creation failed",
      error: error.message
    });
  }
};
var getMenus = async (req, res) => {
  try {
    const position = req.query.position;
    const role = req.user?.role;
    const result = await menuService.getMenusByPosition(
      position,
      role
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Menu fetch failed",
      error: error.message
    });
  }
};
var updateMenuItem2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await menuService.updateMenuItem(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Menu item update failed",
      error: error.message
    });
  }
};
var deleteMenuItem2 = async (req, res) => {
  try {
    const { id } = req.params;
    await menuService.deleteMenuItem(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Menu item delete failed",
      error: error.message
    });
  }
};
var delteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await menuService.deleteMenu(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Menu  delete failed",
      error: error.message
    });
  }
};
var menuControllers = {
  createMenu: createMenu2,
  createMenuItem: createMenuItem2,
  getMenus,
  updateMenuItem: updateMenuItem2,
  deleteMenuItem: deleteMenuItem2,
  delteMenu
};

// src/modules/menus/menu.routes.ts
var router6 = Router5();
router6.post("/", authMiddleWare("ADMIN" /* ADMIN */), menuControllers.createMenu);
router6.post(
  "/item",
  authMiddleWare("ADMIN" /* ADMIN */),
  menuControllers.createMenuItem
);
router6.put(
  "/item/:id",
  authMiddleWare("ADMIN" /* ADMIN */),
  menuControllers.updateMenuItem
);
router6.delete(
  "/item/:id",
  authMiddleWare("ADMIN" /* ADMIN */),
  menuControllers.deleteMenuItem
);
router6.delete("/:id", authMiddleWare("ADMIN" /* ADMIN */), menuControllers.delteMenu);
router6.get("/", menuControllers.getMenus);
var menuRotuer = router6;

// src/modules/cart/cart.routes.ts
import { Router as Router6 } from "express";

// src/modules/cart/cart.service.ts
var getCart = async (customerId) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      }
    }
  });
  if (!cart) {
    return {
      items: [],
      total: 0
    };
  }
  const items = cart.items.map((item) => ({
    id: item.id,
    medicineId: item.medicineId,
    name: item.medicine.name,
    image: item.medicine.image,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity
  }));
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  return { id: cart.id, items, total };
};
var addToCart = async (customerId, medicineId, price, quantity) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  if (medicine.stock < quantity) {
    throw new Error("Not enough stock");
  }
  const cart = await prisma.cart.upsert({
    where: { customerId },
    create: { customerId },
    update: {}
  });
  const item = await prisma.cartItem.upsert({
    where: {
      cartId_medicineId: {
        cartId: cart.id,
        medicineId
      }
    },
    update: {
      quantity: { increment: quantity },
      price
    },
    create: {
      cartId: cart.id,
      medicineId,
      quantity,
      price
    }
  });
  return item;
};
var updateQuantity = async (customerId, itemId, quantity) => {
  if (!itemId || itemId === "undefined") {
    throw new Error("Cart Item ID is required");
  }
  if (quantity < 1) {
    return removeItem(customerId, itemId);
  }
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { customerId }
    }
  });
  if (!item) {
    throw new Error("Cart item not found or you are not authorized");
  }
  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: Math.floor(quantity) }
  });
};
var removeItem = async (customerId, itemId) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { customerId }
    }
  });
  if (!item) {
    throw new Error("Cart item not found");
  }
  await prisma.cartItem.delete({
    where: { id: itemId }
  });
  return true;
};
var clearCart = async (customerId) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId }
  });
  if (!cart) return true;
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });
  return true;
};
var CartServices = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart
};

// src/modules/cart/cart.controller.ts
var getCart2 = async (req, res) => {
  const customerId = req.user?.id;
  try {
    const cart = await CartServices.getCart(customerId);
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      data: error
    });
  }
};
var addToCart2 = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const { medicineId, price, quantity = 1 } = req.body;
    const item = await CartServices.addToCart(
      customerId,
      medicineId,
      price,
      quantity
    );
    res.status(201).json({
      success: true,
      message: "Added to cart",
      data: item
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
var updateQuantity2 = async (req, res) => {
  const customerId = req.user?.id;
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    const result = await CartServices.updateQuantity(
      customerId,
      itemId,
      Number(quantity)
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var removeItem2 = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const { itemId } = req.params;
    await CartServices.removeItem(customerId, itemId);
    res.status(200).json({
      success: true,
      message: "Item removed"
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error
    });
  }
};
var clearCart2 = async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    await CartServices.clearCart(customerId);
    res.status(200).json({
      success: true,
      message: "Cart cleared"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};
var cartControllers = {
  addToCart: addToCart2,
  getCart: getCart2,
  updateQuantity: updateQuantity2,
  removeItem: removeItem2,
  clearCart: clearCart2
};

// src/modules/cart/cart.routes.ts
var router7 = Router6();
router7.get("/", authMiddleWare("CUSTOMER" /* CUSTOMER */), cartControllers.getCart);
router7.post("/", authMiddleWare("CUSTOMER" /* CUSTOMER */), cartControllers.addToCart);
router7.patch(
  "/:itemId",
  authMiddleWare("CUSTOMER" /* CUSTOMER */),
  cartControllers.updateQuantity
);
router7.delete(
  "/clear",
  authMiddleWare("CUSTOMER" /* CUSTOMER */),
  cartControllers.clearCart
);
router7.delete(
  "/:itemId",
  authMiddleWare("CUSTOMER" /* CUSTOMER */),
  cartControllers.removeItem
);
var CartRoutes = router7;

// src/modules/dashboard/dashboard.routes.ts
import { Router as Router7 } from "express";

// src/modules/dashboard/dashboard.service.ts
var adminOverview = async () => {
  const [
    totalUsers,
    totalSellers,
    totalMedicines,
    totalOrders,
    revenue,
    recentOrders
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.medicine.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: {
        status: "DELIVERED"
      },
      _sum: { totalAmount: true }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { name: true, email: true }
        }
      }
    })
  ]);
  return {
    stats: {
      totalUsers,
      totalSellers,
      totalMedicines,
      totalOrders,
      totalRevenue: revenue._sum.totalAmount || 0
    },
    recentOrders
  };
};
var sellerOverview = async (sellerId) => {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      medicine: {
        sellerId
      }
    },
    include: {
      order: true,
      medicine: true
    }
  });
  const totalMedicines = await prisma.medicine.count({ where: { sellerId } });
  const totalRevenue = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItemsSold = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const ordersMap = /* @__PURE__ */ new Map();
  orderItems.forEach((item) => {
    ordersMap.set(item.orderId, item.order);
  });
  return {
    totalOrders: ordersMap.size,
    totalItemsSold,
    totalMedicines,
    totalRevenue,
    recentOrders: Array.from(ordersMap.values()).slice(0, 5)
  };
};
var customerOverview = async (customerId) => {
  const [totalOrders, spent, recentOrders] = await Promise.all([
    prisma.order.count({ where: { customerId } }),
    prisma.order.aggregate({
      where: { customerId, status: "DELIVERED" },
      _sum: { totalAmount: true }
    }),
    prisma.order.findMany({
      where: { customerId },
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ]);
  return {
    stats: {
      totalOrders,
      totalSpent: spent._sum.totalAmount || 0
    },
    recentOrders
  };
};
var dashboardService = {
  adminOverview,
  sellerOverview,
  customerOverview
};

// src/modules/dashboard/dashboard.controller.ts
var adminOverview2 = async (req, res) => {
  try {
    const result = await dashboardService.adminOverview();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Admin dashboard failed",
      error: error.message
    });
  }
};
var sellerOverview2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    const result = await dashboardService.sellerOverview(sellerId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Seller dashboard failed",
      error: error.message
    });
  }
};
var customerOverview2 = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const result = await dashboardService.customerOverview(customerId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Customer dashboard failed",
      error: error.message
    });
  }
};
var dashboardController = {
  adminOverview: adminOverview2,
  sellerOverview: sellerOverview2,
  customerOverview: customerOverview2
};

// src/modules/dashboard/dashboard.routes.ts
var router8 = Router7();
router8.get(
  "/admin",
  authMiddleWare("ADMIN" /* ADMIN */),
  dashboardController.adminOverview
);
router8.get(
  "/seller",
  authMiddleWare("SELLER" /* SELLER */),
  dashboardController.sellerOverview
);
router8.get(
  "/customer",
  dashboardController.customerOverview
);
var dashboardRouter = router8;

// src/modules/auth/auth.routes.ts
import { Router as Router8 } from "express";

// src/modules/auth/auth.service.ts
var getAllUser = async ({
  page,
  limit,
  skip,
  search,
  role
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      email: {
        contains: search,
        mode: "insensitive"
      }
    });
  }
  if (role) {
    andConditions.push({
      role
    });
  } else {
    andConditions.push({
      role: {
        in: ["SELLER" /* SELLER */, "CUSTOMER" /* CUSTOMER */]
      }
    });
  }
  const users = await prisma.user.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      emailVerified: true,
      isBanned: true
    }
  });
  const total = await prisma.user.count({
    where: {
      AND: andConditions
    }
  });
  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getSingleUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  let extraInfo = {};
  if (user.role === "CUSTOMER" /* CUSTOMER */) {
    const totalOrders = await prisma.order.count({
      where: {
        customerId: user.id
      }
    });
    const totalReviews = await prisma.review.count({
      where: {
        customerId: user.id
      }
    });
    extraInfo.totalOrders = totalOrders;
    extraInfo.totalReviews = totalReviews;
  }
  if (user.role === "SELLER" /* SELLER */) {
    const totalActiveMedicines = await prisma.medicine.count({
      where: {
        sellerId: user.id
      }
    });
    extraInfo.totalActiveMedicines = totalActiveMedicines;
  }
  return {
    ...user,
    ...extraInfo
  };
};
var editUser = async (userId, data) => {
  const result = await prisma.user.update({
    where: {
      id: userId
    },
    data
  });
  return result;
};
var AuthServices = {
  getAllUser,
  editUser,
  getSingleUser
};

// src/modules/auth/auth.controller.ts
var getAllUser2 = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : void 0;
    const role = req.query.role === "SELLER" || req.query.role === "CUSTOMER" ? req.query.role : void 0;
    const { page, limit, skip } = paginationsSortingHelper(req.query);
    const result = await AuthServices.getAllUser({
      page,
      limit,
      skip,
      search,
      role
    });
    res.status(200).json({
      success: true,
      message: "User retrieve successful",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "User retrieval failed",
      details: error.message
    });
  }
};
var getSingleUser2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AuthServices.getSingleUser(id);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "User retrieval failed",
      details: error.message
    });
  }
};
var editSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await AuthServices.editUser(id, data);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "User update failed",
      details: error.message
    });
  }
};
var AuthController = {
  getAllUser: getAllUser2,
  editSingleUser,
  getSingleUser: getSingleUser2
};

// src/modules/auth/auth.routes.ts
var router9 = Router8();
router9.get("/", authMiddleWare("ADMIN" /* ADMIN */), AuthController.getAllUser);
router9.get("/:id", authMiddleWare("ADMIN" /* ADMIN */), AuthController.getSingleUser);
router9.put("/:id", authMiddleWare("ADMIN" /* ADMIN */), AuthController.editSingleUser);
var authRouter = router9;

// src/app.ts
var app = express2();
app.use(
  cors({
    origin: ["https://medistore-client-eight.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Private-Network"]
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});
app.use(express2.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/v1/medicines", MedicineRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/cart", CartRoutes);
app.use("/api/v1/orders", OrderRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/site-settings", settingsRoutes);
app.use("/api/v1/menus", menuRotuer);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/users", authRouter);
app.get("/", (req, res) => {
  res.send("Hello from medistore");
});
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("\u2705 Connected to the database");
    app_default.listen(PORT, () => {
      console.log(`\u{1F525} Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("An error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
