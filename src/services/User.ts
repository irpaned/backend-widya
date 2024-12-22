import { PrismaClient } from "@prisma/client";
import { UserProfileDto } from "../dto/AuthDTO";
import { updateProfileSchema } from "../validators/user";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinaryHandler";

const prisma = new PrismaClient();

async function FindProfile(id: number) {
  try {
    const profile = await prisma.user.findFirst({
      where: { id },
    });

    if (!profile) {
      throw new Error("User not found!");
    }

    return {
      ...profile,
    };
  } catch (error) {
    throw new String(error);
  }
}

async function FindAllDataProfile(id: number) {
  try {
    const profile = await prisma.user.findFirst({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!profile) {
      throw new Error("User not found!");
    }

    return {
      ...profile,
    };
  } catch (error) {
    throw new String(error);
  }
}

async function FindAllUsersService() {
  try {
    return await prisma.user.findMany({});
  } catch (error) {
    throw new String(error);
  }
}

async function UpdateProfile(userId: number, dto: UserProfileDto) {
  try {
    const userValidate = updateProfileSchema.validate(dto);
    if (userValidate.error) throw new Error(userValidate.error.message);

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    if (dto.photoProfile) {
      if (user.photoProfile) {
        await cloudinaryDelete(user.photoProfile);
      }
      const photoProfile = await cloudinaryUpload(dto.photoProfile);
      dto.photoProfile = photoProfile?.secure_url;
    }

    if (dto.coverImage) {
      if (user.coverImage) {
        await cloudinaryDelete(user.coverImage);
      }
      const coverImage = await cloudinaryUpload(dto.coverImage);
      dto.coverImage = coverImage?.secure_url;
    }

    if (dto.fullName) {
      user!.fullName = dto.fullName;
    }

    if (dto.sex) {
      user!.sex = dto.sex;
    }

    if (dto.bio) {
      user!.bio = dto.bio;
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
  } catch (error) {
    throw new String(error);
  }
}

export default {
  UpdateProfile,
  FindProfile,
  FindAllDataProfile,
  FindAllUsersService,
};
