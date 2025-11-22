// src/models/OrderProductModel.ts

import client from "../database";

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

// 🔑 الواجهة الجديدة التي تشمل معلومات المنتج (التي سيتم جلبها عبر JOIN)
export type OrderProductWithInfo = OrderProduct & {
    name: string;
    price: number;
};

export class OrderProductModel {
// ... دالة addProduct تبقى كما هي ...
  async addProduct(op: OrderProduct): Promise<OrderProduct> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "INSERT INTO order_products (order_id, product_id, quantity) VALUES($1,$2,$3) RETURNING *";
      const result = await conn.query(sql, [op.order_id, op.product_id, op.quantity]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add product ${op.product_id} to order ${op.order_id}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

 // src/models/OrderProductModel.ts (داخل كلاس OrderProductModel)

// يجب أن تكون دالة show مُعدة لجلب تفاصيل المنتج
async show(orderId: number): Promise<OrderProductWithInfo[]> {
    let conn;
    try {
        conn = await client.connect();
        const sql = `
            SELECT 
                op.quantity,
                op.order_id,
                op.product_id,
                p.name,      -- 🔑 يجب إرجاع حقل الاسم (name)
                p.price
            FROM order_products op
            INNER JOIN products p ON op.product_id = p.id
            WHERE op.order_id = $1
        `;
        const result = await conn.query(sql, [orderId]);
        return result.rows;
    } catch (err) {
        throw new Error(`Could not get products for order ${orderId}. Error: ${err}`);
    } finally {
        if (conn) {
            conn.release();
        }
    }
}
}