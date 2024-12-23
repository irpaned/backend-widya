import { Request, Response } from "express";
import ProductService from "../services/Product";

async function FindMany(req: Request, res: Response) {
  try {
    const data = await ProductService.findMany();
    res.status(200).json(data);
  } catch (error) {}
}

async function Create(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const body = {
      ...req.body,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
      stock: Number(req.body.stock),
      photoProduct: req.file?.path,
    };
    const createProduct = await ProductService.create(body, user.id);
    res.status(201).json(createProduct);
  } catch (error) {
    res.status(500).json({
      message: "An unknown error occurred",
    });
  }
}

async function Remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await ProductService.remove(Number(id));
    res.status(200).json(data);
  } catch (error) {}
}

async function Update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = res.locals.user;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const body = {
      ...req.body,
      photoProduct: files?.["photoProduct"]?.[0]?.path,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
      stock: Number(req.body.stock),
    };

    const data = await ProductService.edit(Number(id), body, user.id);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

async function RemoveAll(req: Request, res: Response) {
  try {
    const data = await ProductService.RemoveAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "An unknown error occurred",
    });
  }
}

async function findProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await ProductService.findProduct(Number(id));
    res.status(200).json(data);
  } catch (error) {
    throw new String(error);
  }
}
async function findMyProducts(req: Request, res: Response) {
  try {
    const { id } = res.locals.user;
    console.log("id", id);
    const data = await ProductService.findMyProducts(Number(id));
    res.status(200).json(data);
  } catch (error) {
    throw new String(error);
  }
}

export default {
  FindMany,
  Create,
  Remove,
  Update,
  RemoveAll,
  findProduct,
  findMyProducts,
};
