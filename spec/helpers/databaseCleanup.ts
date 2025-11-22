// spec/helpers/databaseCleanup.ts

import client from '../../src/database'; // تأكد من المسار الصحيح
// استيراد ملفات الـ SQL كمحتوى نصي (قد تحتاج إلى قراءة الملفات باستخدام fs إذا لم تكن تستخدم طريقة استيراد)
// في مشاريع Udacity، عادةً ما يتم تنفيذ هذا التنظيف داخل دالة واحدة

export async function createTables() {
  const connection = await client.connect();
  try {
    // 1. المسح (Clean Up)
    // المسح يجب أن يتم بترتيب عكسي لتجنب مشاكل Foreign Key
    await connection.query('DROP TABLE IF EXISTS order_products CASCADE;');
    await connection.query('DROP TABLE IF EXISTS orders CASCADE;');
    await connection.query('DROP TABLE IF EXISTS products CASCADE;');
    await connection.query('DROP TABLE IF EXISTS users CASCADE;');

    // 2. الإنشاء (Setup)
    // هذا الكود يجب أن يقرأ محتوى ملفات الـ SQL ويعيد إنشاء الجداول
    // بما أننا لا نستطيع قراءة نظام الملفات هنا، سأقدم لك مثالاً مباشراً لـ SQL
    
    // **إنشاء جدول المستخدمين (users)**
    await connection.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(50),
            lastname VARCHAR(50),
            password_digest VARCHAR(255)
        );
    `);

    // **إنشاء جدول المنتجات (products)**
    await connection.query(`
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            price DECIMAL(10, 2),
            category VARCHAR(100)
        );
    `);

    // **إنشاء جدول الطلبات (orders)**
    await connection.query(`
        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(20)
        );
    `);

    // **إنشاء جدول المنتجات في الطلبات (order_products)**
    await connection.query(`
        CREATE TABLE order_products (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER
        );
    `);

  } catch (error) {
    console.error("Database setup failed:", error);
    throw error;
  } finally {
    connection.release();
  }
}

export default createTables;