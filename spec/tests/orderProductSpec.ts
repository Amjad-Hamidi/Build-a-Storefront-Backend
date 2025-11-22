import { OrderProductModel, OrderProductWithInfo } from "../../src/models/OrderProductModel";
import { OrderModel, Order } from "../../src/models/OrderModel";
import { ProductModel, Product } from "../../src/models/ProductModel";
import { UserModel, User } from "../../src/models/UserModel";
import { createTables } from '../helpers/databaseCleanup';

const orderProductModel = new OrderProductModel(); 
const userModel = new UserModel();
const productModel = new ProductModel();
const orderModel = new OrderModel();

let testUser: User;
let testProduct: Product;
let testOrder: Order;

describe("OrderProduct Model", () => {
    beforeAll(async () => {
        await createTables();

        // 1. إنشاء المستخدم
        testUser = await userModel.create({ firstname: "OP", lastname: "User", password: "pwd" });

        // 2. إنشاء المنتج
        testProduct = await productModel.create({ name: "OP Item", price: 50, category: "Test" });

        // 3. إنشاء الطلب
        testOrder = await orderModel.create({ 
            user_id: testUser.id as number, 
            status: "active" 
        });

        // 🔑 الحل الجذري: إضافة منتج للطلب هنا لضمان وجوده لاختبار show
        await orderProductModel.addProduct({
            order_id: testOrder.id as number,
            product_id: testProduct.id as number,
            quantity: 5
        });
    });

    it("should add product to an order (addProduct)", async () => {
        // نختبر إضافة منتج *جديد* أو كمية مختلفة للتأكد من أن الوظيفة تعمل
        const result = await orderProductModel.addProduct({ 
            order_id: testOrder.id as number, 
            product_id: testProduct.id as number, 
            quantity: 2 
        });
        expect(result.quantity).toBe(2);
    });

    it("should return list of products in order (show method)", async () => {
        // الآن نحن متأكدون أن البيانات موجودة بفضل beforeAll
        const result: OrderProductWithInfo[] = await orderProductModel.show(testOrder.id as number); 
        
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].name).toBe(testProduct.name); 
    });
});