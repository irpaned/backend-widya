import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
import cors from "cors";
import AuthController from "./controllers/Auth";
// import { authenticate } from "./middleware/authenticate";

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
// routerv1.post("/auth/login", AuthController.login);
routerv1.post("/auth/register", AuthController.register);
// routerv1.get("/auth/check", authenticate, AuthController.check);
// routerv1.post("/auth/reset-password", AuthController.resetPassword);
// routerv1.patch("/auth/resetpassword", AuthController.ResetPassword);
// routerv1.get("/auth/verify-email", AuthController.verifyEmail);
// routerv1.get(
//   "/auth/verify-email-reset-password",
//   AuthController.verifyEmailForForgotPassword
// );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
