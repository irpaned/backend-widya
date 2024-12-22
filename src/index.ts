import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
import cors from "cors";
import AuthController from "./controllers/Auth";
import ProductController from "./controllers/Product";

import { authenticate } from "./middleware/authenticate";
import { upload } from "./libs/upload-file";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const routerv1 = express.Router();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routerv1);
app.use("/uploads", express.static("uploads"));

routerv1.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to v1");
});

//AUTH
routerv1.post("/auth/login", AuthController.Login);
routerv1.post("/auth/register", AuthController.Register);
routerv1.patch("/auth/resetpassword", AuthController.ResetPassword);

//PRODUCT
routerv1.post(
  "/product",
  authenticate,
  upload.single("photoProduct"),
  ProductController.create
);
routerv1.get("/product", authenticate, ProductController.findMany);
routerv1.delete("/product/:id", authenticate, ProductController.remove);
routerv1.patch(
  "/product/:id",
  authenticate,
  upload.fields([{ name: "photoProduct", maxCount: 1 }]),
  ProductController.update
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
