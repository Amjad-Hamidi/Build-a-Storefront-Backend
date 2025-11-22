DROP TABLE IF EXISTS users CASCADE; -- 🔑 أضف هذه العبارة
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  password_digest VARCHAR(255)
);
