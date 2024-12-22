import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../services/Auth";
import { transporter } from "../libs/nodemailer";

async function register(req: Request, res: Response) {
  try {
    const user = await AuthService.register(req.body);
    const token = jwt.sign(
      user.id.toString(),
      process.env.JWT_SECRET as string
    );
    const fullUrl = req.protocol + "://" + req.get("host");

    await transporter.sendMail({
      from: '"PT WIDYA INFORMASI NUSANTARA" <muhammadirfan2823@gmail.com>',
      to: user.email,
      subject: "Verification Link",
      html: `
        <div style="background-color: #FFF; margin: auto; width: 50%; text-align: center; padding: 1rem; border-radius: 12px; font-family: Arial, Helvetica, sans-serif; color: black;">
            <H1 style="color: #1B5184; font-weight: bold;">PT WIDYA INFORMASI NUSANTARA</H1>
            <p style="font-size: 0.8rem;">Welcome!<br> Click the button below to verify your account</p>
            <Button style="background-color: #1B5184; border: none; border-radius: 12px; height: 40px; margin: 1rem;"><a style="text-decoration: none; color: white; margin: 0.5rem; font-size: 1rem;" href="${fullUrl}/api/v1/auth/verify-email?token=${token}">Verify</a></Button>
            <p style="font-size: 0.8rem;">Please ignore this message if you feel that you are not registering to our services.</p>
            <p style="font-size: 0.8rem; margin-top: 0.33rem;"> Thank you for using our services.</p>
        </div>
        `,
    });

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

async function verifyEmail(req: Request, res: Response) {
  try {
    const token = req.query.token as string;
    await AuthService.verify(token);
    // const frontendUrl = process.env.FRONTEND_URL;
    // res.redirect(`${frontendUrl}/auth/login`);
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

async function login(req: Request, res: Response) {
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

export default { register, verifyEmail, login };
