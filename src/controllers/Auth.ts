import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../services/Auth";
import { transporter } from "../libs/nodemailer";

async function Register(req: Request, res: Response) {
  try {
    const user = await AuthService.register(req.body);
    const token = jwt.sign(
      user.id.toString(),
      process.env.JWT_SECRET as string
    );

    await AuthService.createVerification(token, "EMAIL");

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  }
}

async function Login(req: Request, res: Response) {
  try {
    const user = await AuthService.login(req.body);

    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  }
}

async function ResetPassword(req: Request, res: Response) {
  try {
    const reset = await AuthService.reset(req.body);

    res.status(200).json(reset);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  }
}

export default { Register, Login, ResetPassword };
