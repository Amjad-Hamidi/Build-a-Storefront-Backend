import express, { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";
import { verifyAuthToken } from "../middleware/auth";

const router = express.Router();
const productModel = new ProductModel();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await productModel.index();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve products. ${err}` });
  }
});

router.get("/top", async (_req: Request, res: Response) => {
  try {
    const products = await productModel.topFive();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve top products. ${err}` });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try { 
    const product = await productModel.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve product. ${err}` });
  }
});

router.post("/", verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const product = await productModel.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.get("/category", async (req: Request, res: Response) => {
  try { 
    const category = req.query.name as string;
    const products = await productModel.byCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve products by category. ${err}` });
  }
});

export default router;