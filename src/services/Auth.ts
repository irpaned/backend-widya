import bcrypt from "bcrypt";
import { registerDTO } from "../dto/AuthDTO";
import { PrismaClient, VerificationType } from "@prisma/client";
import { registerSchema } from "../validators/auth";

const prisma = new PrismaClient();

async function register(dto: registerDTO) {
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
export default { register, createVerification };
