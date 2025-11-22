DROP TABLE IF EXISTS order_products CASCADE; -- 🔑 أضف هذه العبارة
CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  UNIQUE(order_id, product_id)
);
