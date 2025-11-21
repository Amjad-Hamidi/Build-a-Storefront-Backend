import { ProductModel, Product } from "../../src/models/ProductModel";

const productModel = new ProductModel();

describe("Product Model", () => {
  it("should create a product", async () => {
    const result = await productModel.create({ name: "Laptop", price: 1200 });
    expect(result.name).toBe("Laptop");
  });

  it("should return a list of products", async () => {
    const products = await productModel.index();
    expect(products.length).toBeGreaterThan(0);
  });
});
