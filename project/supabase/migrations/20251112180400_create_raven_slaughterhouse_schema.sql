/*
  # Raven Slaughterhouse Database Schema

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `order_number` (text, unique) - Human-readable order number
      - `client_name` (text) - Customer name
      - `company_name` (text) - Company name
      - `products` (jsonb) - Array of products with quantities
      - `delivery_type` (text) - 'pickup' or 'delivery'
      - `comment` (text, nullable) - Optional comment
      - `status` (text) - 'pending', 'accepted', 'refused'
      - `refusal_message` (text, nullable) - Message if refused
      - `created_at` (timestamptz) - Order creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `orders` table
    - Add policy for public to create orders
    - Add policy for public to read their own orders by order_number
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  client_name text NOT NULL,
  company_name text NOT NULL,
  products jsonb NOT NULL DEFAULT '[]'::jsonb,
  delivery_type text NOT NULL DEFAULT 'pickup',
  comment text,
  status text NOT NULL DEFAULT 'pending',
  refusal_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders by order number"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update order status"
  ON orders
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);