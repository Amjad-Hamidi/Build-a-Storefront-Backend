import client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export class OrderModel {
  async index(): Promise<Order[]> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async show(id: number): Promise<Order> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=$1";
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async create(o: Order): Promise<Order> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "INSERT INTO orders (user_id, status) VALUES($1,$2) RETURNING *";
      const result = await conn.query(sql, [o.user_id, o.status]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order for user ${o.user_id}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async currentOrder(user_id: number): Promise<Order | null> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=$1 AND status='active' LIMIT 1";
      const result = await conn.query(sql, [user_id]);
      return result.rows[0] || null;
    } catch (err) {
      throw new Error(`Could not get current order for user ${user_id}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async completedOrders(user_id: number): Promise<Order[]> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=$1 AND status='complete'";
      const result = await conn.query(sql, [user_id]);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get completed orders for user ${user_id}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}