import supertest from "supertest";
import app from "../../src/server";
import { UserModel, User } from "../../src/models/UserModel";
import { ProductModel, Product } from "../../src/models/ProductModel";
import { OrderModel, Order } from "../../src/models/OrderModel";
import { OrderProductModel } from "../../src/models/OrderProductModel"; // 🔑 استيراد OrderProductModel
import createTables from "../helpers/databaseCleanup";

const request = supertest(app);

// 🔑 تعريف الـ Models في النطاق الأعلى
const userModel = new UserModel();
const productModel = new ProductModel();
const orderModel = new OrderModel();
const orderProductModel = new OrderProductModel(); // 🔑 الجديد

let token = "";
let testUser: User;
let testProduct: Product;
let testOrder: Order;

describe("OrderProduct Handler Endpoints", () => {
    beforeAll(async () => {
        await createTables();

        // 1. إنشاء المستخدم والحصول على بياناته
        testUser = await userModel.create({ firstname: "OP", lastname: "User", password: "pwd" });

        // 2. إنشاء المنتج
        testProduct = await productModel.create({ name: "OP Item", price: 50, category: "Test" });

        // 3. إنشاء الطلب
        testOrder = await orderModel.create({ 
            user_id: testUser.id as number, 
            status: "active" 
        });

        // 🔑 4. الجديد: ربط المنتج بالطلب مباشرةً باستخدام الـ Model (يحل فشل GET)
        await orderProductModel.addProduct({
            order_id: testOrder.id as number,
            product_id: testProduct.id as number,
            quantity: 2
        });
        
        // 5. الحصول على التوكن
        const authRes = await request
            .post("/users/login")
            .send({ firstname: "OP", password: "pwd" });
        token = authRes.body.token;
    });

    // Endpoint: POST /order-products (Add Product to Order) - Protected
    it("should add a product to an order on POST /order-products (protected)", async () => {
        const res = await request
            .post("/order-products")
            .send({ order_id: testOrder.id, product_id: testProduct.id, quantity: 5 })
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.product_id).toBe(testProduct.id);
        expect(res.body.quantity).toBe(5);
    });
    
    // Endpoint: GET /order-products/:order_id (Products in Order) - Protected
    it("should return a list of products in the specified order on GET /order-products/:order_id (protected)", async () => {
        const res = await request
            .get(`/order-products/${testOrder.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0); // 🔑 هذا الاختبار سينجح الآن
        expect(res.body[0].product_id).toBe(testProduct.id);
    });
    
    // Endpoint: 401 Unauthorized for POST
    it("should return 401 for unauthorized POST /order-products", async () => {
        const res = await request
            .post("/order-products")
            .send({ order_id: testOrder.id, product_id: testProduct.id, quantity: 1 });
        expect(res.status).toBe(401);
    });
});