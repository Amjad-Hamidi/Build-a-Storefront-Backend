import express, { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";
import { verifyAuthToken } from "../middleware/auth";

const router = express.Router();
const productModel = new ProductModel();

router.get("/", async (_req: Request, res: Response) => {
  const products = await productModel.index();
  res.json(products);
});

router.get("/:id", async (req: Request, res: Response) => {
  const product = await productModel.show(parseInt(req.params.id));
  res.json(product);
});

router.post("/", verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const product = await productModel.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/top", async (_req: Request, res: Response) => {
  const products = await productModel.topFive();
  res.json(products);
});

router.get("/category", async (req: Request, res: Response) => {
  const category = req.query.name as string;
  const products = await productModel.byCategory(category);
  res.json(products);
});


export default router;
