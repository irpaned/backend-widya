import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
import cors from "cors";
import AuthController from "./controllers/Auth";
import ProductController from "./controllers/Product";
import UserController from "./controllers/User";

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
routerv1.get("/auth/check", authenticate, AuthController.Check);
routerv1.post("/auth/register", AuthController.Register);
routerv1.patch("/auth/resetpassword", AuthController.ResetPassword);
routerv1.delete("/auth/delete", authenticate, AuthController.RemoveAccount);

//USER
routerv1.patch(
  "/user/:id",
  authenticate,
  upload.fields([
    { name: "photoProfile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  UserController.UpdateProfile
);
routerv1.get("/user/:id", authenticate, UserController.FindProfile);
routerv1.get("/user", authenticate, UserController.FindAllProfile);

//PRODUCT
routerv1.post(
  "/product",
  authenticate,
  upload.single("photoProduct"),
  ProductController.Create
);
routerv1.get("/product", ProductController.FindMany);
routerv1.get("/product/:id", ProductController.findProduct);
routerv1.get("/my-product", authenticate, ProductController.findMyProducts);
routerv1.delete("/product/:id", authenticate, ProductController.Remove);
routerv1.delete("/product", ProductController.RemoveAll);
routerv1.patch(
  "/product/:id",
  authenticate,
  upload.fields([{ name: "photoProduct", maxCount: 1 }]),
  ProductController.Update
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
