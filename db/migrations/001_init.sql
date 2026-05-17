-- FreshCart Market initial schema and demo seed data
-- Run with: psql $DATABASE_URL < db/migrations/001_init.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  accent TEXT NOT NULL DEFAULT '#22c55e',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'PACKING', 'DELIVERED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'PENDING',
  total DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

INSERT INTO users (id, email, password, name, role)
VALUES ('user_demo_admin', 'demo@example.com', 'demo123', 'Demo Admin', 'admin')
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = NOW();

INSERT INTO products (id, name, category, price, unit, stock, status, accent)
VALUES
  ('prod_bananas', 'Organic Bananas', 'Fruit', 2.49, 'lb', 84, 'active', '#facc15'),
  ('prod_spinach', 'Baby Spinach', 'Vegetable', 3.99, 'bag', 18, 'active', '#22c55e'),
  ('prod_tomatoes', 'Roma Tomatoes', 'Vegetable', 1.89, 'lb', 9, 'low', '#ef4444'),
  ('prod_apples', 'Honeycrisp Apples', 'Fruit', 4.29, 'lb', 41, 'active', '#f97316'),
  ('prod_strawberries', 'Strawberries', 'Fruit', 5.49, 'box', 32, 'active', '#ec4899'),
  ('prod_avocados', 'Avocados', 'Fruit', 1.75, 'each', 55, 'active', '#84cc16'),
  ('prod_carrots', 'Carrots', 'Vegetable', 2.25, 'bag', 46, 'active', '#fb923c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  unit = EXCLUDED.unit,
  stock = EXCLUDED.stock,
  status = EXCLUDED.status,
  accent = EXCLUDED.accent,
  updated_at = NOW();

INSERT INTO cart_items (id, user_id, product_id, quantity)
VALUES
  ('cart_demo_strawberries', 'user_demo_admin', 'prod_strawberries', 3),
  ('cart_demo_avocados', 'user_demo_admin', 'prod_avocados', 6),
  ('cart_demo_carrots', 'user_demo_admin', 'prod_carrots', 2)
ON CONFLICT (user_id, product_id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  updated_at = NOW();

INSERT INTO orders (id, order_number, user_id, status, total)
VALUES
  ('order_1042', 'ORD-1042', 'user_demo_admin', 'PACKING', 48.20),
  ('order_1041', 'ORD-1041', 'user_demo_admin', 'PAID', 32.75),
  ('order_1040', 'ORD-1040', 'user_demo_admin', 'DELIVERED', 61.10),
  ('order_1039', 'ORD-1039', 'user_demo_admin', 'PENDING', 24.40)
ON CONFLICT (order_number) DO UPDATE SET
  status = EXCLUDED.status,
  total = EXCLUDED.total,
  updated_at = NOW();
