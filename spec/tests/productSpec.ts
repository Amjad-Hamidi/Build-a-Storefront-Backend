// spec/tests/productSpec.ts

import { ProductModel, Product } from "../../src/models/ProductModel";
import { createTables } from '../helpers/databaseCleanup';

const productModel = new ProductModel();
let createdProduct: Product;
const testCategory = "electronics"; // 🔑 تعريف فئة الاختبار

describe("Product Model", () => {
    beforeAll(async () => {
        await createTables();
        
        // 🔑 الحل: إنشاء المنتج في beforeAll مع Category
        createdProduct = await productModel.create({ 
            name: "Laptop", 
            price: 1200,
            category: testCategory // إضافة الفئة هنا
        });
    });

    it("should create a product (redundant check)", async () => {
        const tempProduct = await productModel.create({ name: "Monitor", price: 300, category: "PC" });
        expect(tempProduct.name).toBe("Monitor");
    });

    it("should return a list of products (index method)", async () => {
        const products = await productModel.index();
        expect(products.length).toBeGreaterThanOrEqual(1);
    });

    it("should return the correct product when show is called", async () => {
        const product = await productModel.show(createdProduct.id as number);
        expect(product?.id).toBe(createdProduct.id);
    });

    it("should return the top five selling products (topFive)", async () => {
        // هذا الاختبار سيفشل حتى يتم إعداد OrderProduct في ملف OrderProductSpec!
        const products = await productModel.topFive();
        expect(products).toBeInstanceOf(Array);
        expect(products.length).toBeLessThanOrEqual(5);
    });

    it("should return products by category (byCategory)", async () => {
        // 🔑 استخدام testCategory
        const products = await productModel.byCategory(testCategory);
        expect(products).toBeInstanceOf(Array);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].category).toBe(testCategory);
    });
});