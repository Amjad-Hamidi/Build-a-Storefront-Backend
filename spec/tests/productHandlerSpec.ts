import supertest from "supertest";
import app from "../../src/server";
import { ProductModel, Product } from "../../src/models/ProductModel";
import { UserModel, User } from "../../src/models/UserModel";
import { OrderModel, Order } from "../../src/models/OrderModel"; // 🔑 استيراد OrderModel
import { OrderProductModel } from "../../src/models/OrderProductModel"; // 🔑 استيراد OrderProductModel
import createTables from "../helpers/databaseCleanup";

const request = supertest(app);

const userModel = new UserModel();
const productModel = new ProductModel();
const orderModel = new OrderModel(); // 🔑 تعريف OrderModel
const orderProductModel = new OrderProductModel(); // 🔑 تعريف OrderProductModel

let token = "";
let testProduct: Product;
let testUser: User;
let testOrder: Order;

describe("Product Handler Endpoints", () => {
    // إعداد: إنشاء مستخدم، منتج، طلب، وربطهم
    beforeAll(async () => {
        await createTables();
        
        // 1. إنشاء المستخدم
        testUser = await userModel.create({ firstname: "Prod", lastname: "Admin", password: "adminpassword" });

        // 2. إنشاء الطلب
        testOrder = await orderModel.create({ user_id: testUser.id as number, status: "active" });

        // 3. إنشاء المنتج (بدلاً من الاعتماد على POST)
        testProduct = await productModel.create({ name: "SetupProduct", price: 50, category: "TestCat" });
        
        // 🔑 4. الجديد: ربط المنتج بالطلب لتمكين topFive
        await orderProductModel.addProduct({
            order_id: testOrder.id as number,
            product_id: testProduct.id as number,
            quantity: 10 // كمية كبيرة لجعله "Top"
        });

        // 5. الحصول على التوكن
        const authRes = await request
            .post("/users/login")
            .send({ firstname: "Prod", password: "adminpassword" });
        token = authRes.body.token;
    });

    // Endpoint: POST /products (Create) - Protected
    it("should create a product on POST /products (protected)", async () => {
        const res = await request
            .post("/products")
            .send({ name: "NewTestProduct", price: 100, category: "NewCat" })
            .set("Authorization", `Bearer ${token}`);

        // 🔑 تحديث productId لاستخدامه في اختبار show
        testProduct.id = res.body.id; 
        
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("NewTestProduct");
    });

    // Endpoint: GET /products (Index) - Public
    it("should return a list of products on GET /products (public)", async () => {
        const res = await request.get("/products");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    // Endpoint: GET /products/:id (Show) - Public
    it("should return the correct product on GET /products/:id (public)", async () => {
        const res = await request.get(`/products/${testProduct.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(testProduct.id);
    });

// Endpoint: GET /products/top (Top Five) - Public
  it("should return top five products on GET /products/top", async () => {
    const res = await request.get("/products/top");
    
    // 🚨 هذا السطر سيطبع الخطأ في التيرمينال إذا فشل الطلب
    if (res.status === 500) {
        console.log("_________________ SERVER ERROR RESPONSE _________________");
        console.log(res.body); // هذا سيخبرنا بالسبب الحقيقي
        console.log("_________________________________________________________");
    }

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeLessThanOrEqual(5);
    if (res.body.length > 0) {
        expect(res.body[0].name).toBeDefined();
    }
  });

    // اختبار الفشل (غير مصرح به) لـ POST
    it("should return 401 for unauthorized POST /products", async () => {
        const res = await request
            .post("/products")
            .send({ name: "Fail", price: 1, category: "Fail" });
        expect(res.status).toBe(401);
    });
});