import express, { Request, Response } from "express";
import { OrderProductModel } from "../models/OrderProductModel";
import jwt from "../middleware/auth";

const router = express.Router();
const opModel = new OrderProductModel();

router.post("/", jwt, async (req: Request, res: Response) => {
  try {
    const op = await opModel.addProduct(req.body);
    res.json(op);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:order_id", jwt, async (req: Request, res: Response) => {
  try {
    const list = await opModel.show(parseInt(req.params.order_id));
    res.json(list);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
