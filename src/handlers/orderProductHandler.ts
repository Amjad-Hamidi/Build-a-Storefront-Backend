// src/handlers/orderProductHandler.ts

import express, { Router, Request, Response } from 'express';
import { OrderProductModel } from "../models/OrderProductModel";
import verifyAuthToken from '../middleware/auth'; // يجب استيراد الـ middleware الخاص بك

const orderProductModel = new OrderProductModel();

// 1. تعريف الـ Router
const orderProductRouter: Router = express.Router();

// 2. 🔑 Handler لإضافة منتج للطلب (POST /order-products)
const addProduct = async (req: Request, res: Response) => {
    try {
        const orderProduct = await orderProductModel.addProduct({
            order_id: parseInt(req.body.order_id),
            product_id: parseInt(req.body.product_id),
            quantity: parseInt(req.body.quantity)
        });
        res.status(200).json(orderProduct); // 🔑 يجب أن تعيد 200 عند النجاح
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// 3. 🔑 Handler لعرض منتجات طلب معين (GET /order-products/:order_id)
const productsInOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.order_id);
        const products = await orderProductModel.show(orderId);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// 4. ربط المسارات بالـ Router
orderProductRouter.post('/', verifyAuthToken, addProduct);
orderProductRouter.get('/:order_id', verifyAuthToken, productsInOrder); 

// 5. التصدير الافتراضي
export default orderProductRouter;