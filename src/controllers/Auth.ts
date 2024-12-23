import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../services/Auth";

async function Register(req: Request, res: Response) {
  try {
    const user = await AuthService.RegisterService(req.body);
    const token = jwt.sign(
      user.id.toString(),
      process.env.JWT_SECRET as string
    );

    await AuthService.createVerification(token, "EMAIL");

    res.status(201).json(user);
  } catch (error) {
    if (error) {
      res.status(500).json({
        message: "Email is already used",
      });
    }
  }
}

async function Login(req: Request, res: Response) {
  try {
    const user = await AuthService.LoginService(req.body);

    res.json(user);
  } catch (error) {
    if (error) {
      res.status(500).json({
        message: "Email or password is incorrect",
      });
    }
  }
}

async function ResetPassword(req: Request, res: Response) {
  try {
    const reset = await AuthService.ResetPasswordService(req.body);

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

async function RemoveAccount(req: Request, res: Response) {
  try {
    const { email } = res.locals.user;
    console.log("email remove", email);
    const remove = await AuthService.RemoveService(email);

    res.status(200).json(remove);
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

async function Check(req: Request, res: Response) {
  try {
    res.json(res.locals.user);
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

export default { Register, Login, ResetPassword, RemoveAccount, Check };
