import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductModel {
  async index(): Promise<Product[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM products";
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async show(id: number): Promise<Product> {
    const conn = await client.connect();
    const sql = "SELECT * FROM products WHERE id=$1";
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }

  async create(p: Product): Promise<Product> {
    const conn = await client.connect();
    const sql = "INSERT INTO products (name, price) VALUES($1,$2) RETURNING *";
    const result = await conn.query(sql, [p.name, p.price]);
    conn.release();
    return result.rows[0];
  }

  async topFive(): Promise<Product[]> {
    const conn = await client.connect();
    const sql = `
      SELECT p.*, SUM(op.quantity) AS total_sold
      FROM products p
      JOIN order_products op ON p.id = op.product_id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `;
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async byCategory(category: string): Promise<Product[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM products WHERE category=$1";
    const result = await conn.query(sql, [category]);
    conn.release();
    return result.rows;
  }

}
