import { OrderModel, Order } from "../../src/models/OrderModel";

const orderModel = new OrderModel();

describe("Order Model", () => {
  it("should create an order", async () => {
    const result = await orderModel.create({ user_id: 1, status: "active" });
    expect(result.status).toBe("active");
  });

  it("should return a list of orders", async () => {
    const orders = await orderModel.index();
    expect(orders.length).toBeGreaterThan(0);
  });
});
