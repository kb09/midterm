DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  place_order_time TIMESTAMP,
  estimated_time TIMESTAMP,
  completed_time TIMESTAMP
);
