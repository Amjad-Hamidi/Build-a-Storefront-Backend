import express, { Request, Response } from "express";
import { OrderModel } from "../models/OrderModel";
import jwt from "../middleware/auth"; // يُفضل تغيير الاسم إلى verifyAuthToken للمساق، لكن سنبقيه كما هو لعدم تغيير الكود الأصلي في auth.ts

const router = express.Router();
const orderModel = new OrderModel();

router.get("/", async (_req: Request, res: Response) => {
  try { // 🆕 تمت الإضافة
    const orders = await orderModel.index();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve orders. ${err}` });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try { // 🆕 تمت الإضافة
    const order = await orderModel.show(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve order. ${err}` });
  }
});

router.post("/", jwt, async (req: Request, res: Response) => {
  try {
    const order = await orderModel.create(req.body);
    res.json(order);
  } catch (err) {
    // هذه الكتلة كانت موجودة بالفعل للتعامل مع أخطاء الإدخال
    res.status(400).json(err);
  }
});

router.get("/current/:user_id", jwt, async (req: Request, res: Response) => {
  try { // 🆕 تمت الإضافة
    const order = await orderModel.currentOrder(parseInt(req.params.user_id));
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve current order. ${err}` });
  }
});

router.get("/completed/:user_id", jwt, async (req: Request, res: Response) => {
  try { // 🆕 تمت الإضافة
    const orders = await orderModel.completedOrders(parseInt(req.params.user_id));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve completed orders. ${err}` });
  }
});

export default router;