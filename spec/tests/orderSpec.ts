// spec/tests/orderSpec.ts

import { OrderModel, Order } from "../../src/models/OrderModel";
import { UserModel, User } from "../../src/models/UserModel"; // 🔑 استيراد UserModel
import { OrderProductModel } from "../../src/models/OrderProductModel";
import { createTables } from "../helpers/databaseCleanup";

const orderModel = new OrderModel();
const opModel = new OrderProductModel();

let createdUser: User; // 🔑 لتخزين بيانات المستخدم
let createdOrder: Order;

describe("Order Model", () => {
    beforeAll(async () => {
        await createTables();
        
        // 1. إنشاء مستخدم (يحل مشكلة orders_user_id_fkey)
        const userModel = new UserModel();
        createdUser = await userModel.create({ firstname: "Order", lastname: "Test", password: "pwd" });

        // 2. إنشاء الطلب الآن (Order) باستخدام ID المستخدم
        createdOrder = await orderModel.create({ 
            user_id: createdUser.id as number, // 🔑 استخدام createdUser.id
            status: "active" 
        });

        // 3. إنشاء طلب مكتمل (لإرضاء اختبار completedOrders)
        await orderModel.create({
            user_id: createdUser.id as number,
            status: "complete"
        });
    });

    it("should create an order (redundant check)", async () => {
        const tempOrder = await orderModel.create({ user_id: createdUser.id as number, status: "complete" });
        expect(tempOrder.status).toBe("complete");
    });

    it("should return a list of orders (index method)", async () => {
        const orders = await orderModel.index();
        expect(orders.length).toBeGreaterThanOrEqual(2); // نتوقع على الأقل 2
    });

    it("should return the correct order when show is called", async () => {
        // 🔑 استخدام createdOrder.id
        const order = await orderModel.show(createdOrder.id as number);
        expect(order?.id).toBe(createdOrder.id);
        expect(order?.status).toBe("active");
    });

    it("should return the current active order for a user (currentOrder)", async () => {
        // 🔑 استخدام createdUser.id
        const order = await orderModel.currentOrder(createdUser.id as number);
        expect(order).not.toBeNull();
        expect(order?.status).toBe("active");
    });

    it("should return a list of completed orders for a user (completedOrders)", async () => {
        const orders = await orderModel.completedOrders(createdUser.id as number);
        expect(orders).toBeInstanceOf(Array);
        expect(orders.length).toBeGreaterThanOrEqual(1); // نتوقع وجود طلب واحد
        expect(orders[0].status).toBe("complete");
    });
});