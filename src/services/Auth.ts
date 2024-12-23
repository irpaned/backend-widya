import bcrypt from "bcrypt";
import { LoginDTO, registerDTO, ResetDTO } from "../dto/AuthDTO";
import { PrismaClient, VerificationType } from "@prisma/client";
import { loginSchema, registerSchema } from "../validators/auth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function RegisterService(dto: registerDTO) {
  try {
    const validate = registerSchema.validate(dto);

    const salt = 10;
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    dto.password = hashedPassword;

    if (validate.error) {
      throw new String("User not found!");
    }

    return await prisma.user.create({
      data: { ...dto },
    });
  } catch (error) {
    throw new String(error);
  }
}
async function createVerification(token: string, type: VerificationType) {
  try {
    return await prisma.verification.create({
      data: {
        token,
        type,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to create verification");
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

async function LoginService(dto: LoginDTO) {
  try {
    const validate = loginSchema.validate(dto);

    if (validate.error) {
      throw new String(validate.error.message);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new String("User not found!");

    const isValidPassword = await bcrypt.compare(dto.password, user.password!);

    if (!isValidPassword) throw new Error("User not found!");

    const { password, ...restUser } = user;

    const jwtSecret = process.env.JWT_SECRET as string;

    const token = jwt.sign(restUser, jwtSecret);

    return { token, restUser, isLogin: true };
  } catch (error) {
    throw new String(error);
  }
}

async function ResetPasswordService(dto: ResetDTO) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: String(dto.email),
      },
    });

    if (dto.password) {
      const salt = 10;
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      user!.password = hashedPassword;
    }

    if (user?.email == String(dto.email)) {
      return await prisma.user.update({
        where: { email: String(dto.email) },
        data: {
          password: user!.password,
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to reset password");
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

async function RemoveService(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: String(email),
      },
    });

    if (user) {
      const DeleteProducts = await prisma.productPackage.deleteMany({
        where: {
          userId: user.id,
        },
      });
      const DeleteUser = await prisma.user.delete({
        where: {
          email: String(email),
        },
      });

      return { DeleteUser, DeleteProducts };
    }
  } catch (error) {}
}

export default {
  RegisterService,
  LoginService,
  createVerification,
  ResetPasswordService,
  RemoveService,
};
