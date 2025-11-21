import client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export class OrderModel {
  async index(): Promise<Order[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM orders";
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async show(id: number): Promise<Order> {
    const conn = await client.connect();
    const sql = "SELECT * FROM orders WHERE id=$1";
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }

  async create(o: Order): Promise<Order> {
    const conn = await client.connect();
    const sql = "INSERT INTO orders (user_id, status) VALUES($1,$2) RETURNING *";
    const result = await conn.query(sql, [o.user_id, o.status]);
    conn.release();
    return result.rows[0];
  }

    async currentOrder(user_id: number): Promise<Order | null> {
    const conn = await client.connect();
    const sql = "SELECT * FROM orders WHERE user_id=$1 AND status='active' LIMIT 1";
    const result = await conn.query(sql, [user_id]);
    conn.release();
    return result.rows[0] || null;
  }

    async completedOrders(user_id: number): Promise<Order[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM orders WHERE user_id=$1 AND status='complete'";
    const result = await conn.query(sql, [user_id]);
    conn.release();
    return result.rows;
  }
  
}
