import { OrderProductModel } from "../../src/models/OrderProductModel";

const orderProductModel = new OrderProductModel();

describe("OrderProduct Model", () => {
  it("should add product to an order", async () => {
    const result = await orderProductModel.addProduct({order_id: 1, product_id: 1, quantity: 2});
    expect(result.quantity).toBe(2);
  });

  it("should return list of products in order", async () => {
    const result = await orderProductModel.show(1);
    expect(result.length).toBeGreaterThan(0);
  });
});
