DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    price INTEGER,
    category VARCHAR(100)
);