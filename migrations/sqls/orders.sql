DROP TABLE IF EXISTS orders CASCADE; -- 🔑 أضف هذه العبارة
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(20) -- active, complete
);
