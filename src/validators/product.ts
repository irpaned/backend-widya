import j from "joi";

export const productSchema = j.object({
  productName: j.string().required().min(3).max(50),
  price: j.number().required().min(1),
  discount: j.number().min(0).max(100),
  photoProduct: j.required(),
  description: j.required(),
  stock: j.number().min(1),
});
