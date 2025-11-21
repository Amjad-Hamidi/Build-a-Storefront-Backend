import express, { Request, Response } from "express";
import { OrderModel } from "../models/OrderModel";
import jwt from "../middleware/auth";

const router = express.Router();
const orderModel = new OrderModel();

router.get("/", async (_req: Request, res: Response) => {
  const orders = await orderModel.index();
  res.json(orders);
});

router.get("/:id", async (req: Request, res: Response) => {
  const order = await orderModel.show(parseInt(req.params.id));
  res.json(order);
});

router.post("/", jwt, async (req: Request, res: Response) => {
  try {
    const order = await orderModel.create(req.body);
    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.get("/current/:user_id", jwt, async (req: Request, res: Response) => {
  const order = await orderModel.currentOrder(parseInt(req.params.user_id));
  res.json(order);
});

router.get("/completed/:user_id", jwt, async (req: Request, res: Response) => {
  const orders = await orderModel.completedOrders(parseInt(req.params.user_id));
  res.json(orders);
});


export default router;
