DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  descrition TEXT,
  price INTEGER  NOT NULL DEFAULT 0,
  thumbnail_url VARCHAR(255),
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);
