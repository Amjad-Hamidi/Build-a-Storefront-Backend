// src/models/ProductModel.ts

import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductModel {
  
  async index(): Promise<Product[]> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM products";
      const result = await conn.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async show(id: number): Promise<Product | undefined> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM products WHERE id=$1";
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async create(p: Product): Promise<Product> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "INSERT INTO products (name, price, category) VALUES($1,$2,$3) RETURNING *";
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create product ${p.name}. Error: ${err}`);
    } finally {
      if (conn) conn.release();
    }
  }

 // src/models/ProductModel.ts

  async topFive(): Promise<Product[]> {
    let conn;
    try {
      conn = await client.connect();
      
      // 🔑 الحل السحري: استخدام Subquery لتجنب مشاكل GROUP BY تماماً
      // هذا الاستعلام يقول: هات كل المنتجات، واحسب مجموع الكميات لكل واحد، ورتبهم.
      const sql = `
        SELECT products.*, 
        (SELECT SUM(quantity) FROM order_products WHERE product_id = products.id) as total_sold
        FROM products
        ORDER BY total_sold DESC
        LIMIT 5
      `;
      
      const result = await conn.query(sql);
      return result.rows;
    } catch (err) {
      // 🛑 هذا السطر سيطبع لك الخطأ الحقيقي في التيرمينال (مهم جداً)
      console.error("___________________ ERROR IN TOP FIVE ___________________");
      console.error(err);
      console.error("_________________________________________________________");
      throw new Error(`Could not get top products. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async byCategory(category: string): Promise<Product[]> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM products WHERE category=$1";
      const result = await conn.query(sql, [category]);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products by category ${category}. Error: ${err}`);
    } finally {
      if (conn) conn.release();
    }
  }
}