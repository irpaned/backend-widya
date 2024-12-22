import { Request, Response } from "express";
import UserService from "../services/User";

async function FindProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await UserService.FindAllDataProfile(Number(id));
    if (!user)
      res.status(404).json({
        message: "User not found!",
      });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}

async function FindAllProfile(req: Request, res: Response) {
  try {
    const user = await UserService.FindAllUsersService();
    if (!user)
      res.status(404).json({
        message: "User not found!",
      });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}

async function UpdateProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const body = {
      ...req.body,
      photoProfile: files?.["photoProfile"]?.[0]?.path,
      coverImage: files?.["coverImage"]?.[0]?.path,
    };

    const user = await UserService.FindProfile(Number(id));
    if (!user)
      res.status(404).json({
        message: "User not found!",
      });

    const editedProfile = await UserService.UpdateProfile(Number(id), body);
    res.json(editedProfile);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}

export default { UpdateProfile, FindProfile, FindAllProfile };
