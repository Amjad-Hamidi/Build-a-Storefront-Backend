// spec/tests/orderHandlerSpec.ts (الكود المصحح)

import supertest from "supertest";
import app from "../../src/server";
import { UserModel, User } from "../../src/models/UserModel"; // 🔑 استيراد User
import { OrderModel, Order } from "../../src/models/OrderModel"; // 🔑 استيراد Order
import createTables from "../helpers/databaseCleanup";

const request = supertest(app);
const userModel = new UserModel();
const orderModel = new OrderModel(); // 🔑 تعريف OrderModel

let token = "";
let createdUser: User;
let createdOrder: Order;
let completedOrder: Order;

describe("Order Handler Endpoints", () => {
    beforeAll(async () => {
        await createTables();
        
        // 1. إنشاء المستخدم والحصول على بياناته
        createdUser = await userModel.create({ firstname: "Order", lastname: "Test", password: "orderpassword" });
        
        // 2. إنشاء طلب نشط مباشرة باستخدام الـ Model (يحل مشكلة Current Order)
        createdOrder = await orderModel.create({ 
            user_id: createdUser.id as number, 
            status: "active" 
        });
        
        // 3. إنشاء طلب مكتمل (يحل مشكلة Completed Orders)
        completedOrder = await orderModel.create({ 
            user_id: createdUser.id as number, 
            status: "complete" 
        });

        // 4. الحصول على التوكن
        const authRes = await request
            .post("/users/login")
            .send({ firstname: "Order", password: "orderpassword" });
        token = authRes.body.token;
    });

    // 🔑 الآن يمكن استخدام createdOrder.id
    // Endpoint: POST /orders (Create) - Protected (يستخدم الآن ID مُنشأ مسبقاً)
    it("should create an order on POST /orders (protected)", async () => {
        const res = await request
            .post("/orders")
            // ننشئ طلباً جديداً (للتأكد من أن الـ Handler يعمل)
            .send({ user_id: createdUser.id as number, status: "active" }) 
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("active");
    });

    // Endpoint: GET /orders (Index)
    it("should return a list of orders on GET /orders (public)", async () => {
        const res = await request.get("/orders");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2); // نتوقع 2 طلبات أو أكثر
    });

    // Endpoint: GET /orders/:id (Show) 
    it("should return the correct order on GET /orders/:id (public)", async () => {
        const res = await request.get(`/orders/${createdOrder.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdOrder.id);
    });
    
    // Endpoint: GET /orders/current/:user_id (Current Order) - Protected
    it("should return current order on GET /orders/current/:user_id", async () => {
        const res = await request
            .get(`/orders/current/${createdUser.id}`)
            .set("Authorization", `Bearer ${token}`);
            
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("active");
        expect(res.body.id).toBe(createdOrder.id); // 🔑 تأكيد ID الطلب
    });

    // Endpoint: GET /orders/completed/:user_id (Completed Orders) - Protected
    it("should return completed orders on GET /orders/completed/:user_id", async () => {
        const res = await request
            .get(`/orders/completed/${createdUser.id}`)
            .set("Authorization", `Bearer ${token}`);
            
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
    
    // اختبار الفشل (غير مصرح به) لـ POST
    it("should return 401 for unauthorized POST /orders", async () => {
        const res = await request.post("/orders").send({ user_id: createdUser.id as number, status: "active" });
        expect(res.status).toBe(401);
    });
});