import { PrismaClient } from "@prisma/client";
import { ProductDTO } from "../dto/ProductDTO";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinaryHandler";
import { productSchema } from "../validators/product";

const prisma = new PrismaClient();

async function findMany() {
  return await prisma.productPackage.findMany();
}

async function findMyProducts(id: number) {
  return await prisma.productPackage.findMany({
    where: {
      userId: Number(id),
    },
  });
}

async function create(dto: ProductDTO, userId: number) {
  try {
    const photoProductData = productSchema.validate(dto);
    if (photoProductData.error) throw new Error(photoProductData.error.message);

    if (dto.photoProduct) {
      const upload = await cloudinaryUpload(dto.photoProduct);
      dto.photoProduct = upload.secure_url;
    }

    if (dto.discount > 0) {
      const result = dto.price * (dto.discount / 100);
      dto.priceAfterDiscount = dto.price - result;
    }

    console.log(
      "discount",
      dto.priceAfterDiscount,
      "price",
      dto.price,
      "discount",

      dto.discount
    );

    return await prisma.productPackage.create({
      data: {
        ...dto,
        userId: userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function remove(id: number) {
  try {
    const product = await prisma.productPackage.findFirst({
      where: { id: Number(id) },
    });

    if (product) {
      return await prisma.productPackage.delete({
        where: {
          id: Number(id),
        },
      });
    } else {
      throw new Error("You can't delete product");
    }
  } catch (error) {
    throw new String(error);
  }
}

async function edit(id: number, dto: ProductDTO, userId: number) {
  try {
    const product = await prisma.productPackage.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (dto.photoProduct) {
      if (product.photoProduct) {
        await cloudinaryDelete(product.photoProduct);
      }
      const photoProduct = await cloudinaryUpload(dto.photoProduct);
      dto.photoProduct = photoProduct?.secure_url;
    }

    if (dto.price) {
      product.price = dto.price;
    }

    if (dto.productName) {
      product.productName = dto.productName;
    }

    if (dto.discount !== undefined) {
      if (dto.discount < 0 || dto.discount > 100) {
        throw new Error("Discount must be between 0 and 100");
      }
      const discountValue = product.price * (dto.discount / 100);
      dto.priceAfterDiscount = product.price - discountValue;
    }

    return await prisma.productPackage.update({
      where: {
        id: Number(id),
      },
      data: { ...dto },
    });
  } catch (error) {
    throw new Error(
      "Failed to edit product: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

async function RemoveAll() {
  try {
    return await prisma.productPackage.deleteMany();
  } catch (error) {
    throw new String(error);
  }
}

async function findProduct(id: number) {
  try {
    return await prisma.productPackage.findFirst({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw new String(error);
  }
}

export default {
  findMany,
  create,
  remove,
  edit,
  RemoveAll,
  findProduct,
  findMyProducts,
};
