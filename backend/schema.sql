-- ============================================================
-- Linces'CKF E-Commerce Database Schema
-- Full DDL + Seed Data for all tables
-- ============================================================

-- Create and use the database
CREATE DATABASE IF NOT EXISTS lincesckf_db;
USE lincesckf_db;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  account_type ENUM('customer', 'brand') DEFAULT 'customer',
  preferences JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- ============================================================
-- 3. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(200) NOT NULL,
  name_es VARCHAR(200) NOT NULL,
  description_en TEXT,
  description_es TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT NOT NULL,
  image VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  sizes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  product_id INT NOT NULL,
  author VARCHAR(100) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. CART TABLE (one cart per user)
-- ============================================================
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. CART ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  selected_size VARCHAR(10),
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- 7. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  shipping_address VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_zip VARCHAR(20),
  status ENUM('processing', 'shipped', 'delivered') DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  selected_size VARCHAR(10),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- 9. MESSAGES TABLE (Socket.IO Chat)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT DEFAULT NULL,
  sender_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 10. CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  type ENUM('contact', 'custom_order') DEFAULT 'contact',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert categories
INSERT INTO categories (id, name) VALUES
  (1, 'blouses'),
  (2, 'dresses'),
  (3, 'scarves'),
  (4, 'shirts');

-- Insert products (matches frontend products.js exactly)
INSERT INTO products (id, name_en, name_es, description_en, description_es, price, category_id, image, featured, sizes) VALUES
  (1, 'Golden Silk Blouse', 'Blusa de Seda Dorada', 'Luxurious golden silk blouse with elegant V-neckline and flowing sleeves.', 'Lujosa blusa de seda dorada con elegante escote en V y mangas fluidas.', 189.00, 1, '/images/silk_blouse_gold.png', TRUE, '["XS","S","M","L","XL"]'),
  (2, 'Crimson Evening Dress', 'Vestido de Noche Carmesí', 'Stunning red silk evening dress with flowing silhouette and spaghetti straps.', 'Impresionante vestido de noche de seda roja con silueta fluida y tirantes finos.', 349.00, 2, '/images/silk_dress_red.png', TRUE, '["XS","S","M","L","XL"]'),
  (3, 'Emerald Silk Scarf', 'Pañuelo de Seda Esmeralda', 'Elegant emerald green silk scarf, perfect for any occasion.', 'Elegante pañuelo de seda esmeralda, perfecto para cualquier ocasión.', 89.00, 3, '/images/silk_scarf_green.png', TRUE, '["One Size"]'),
  (4, 'Navy Silk Shirt', 'Camisa de Seda Azul Marino', 'Premium navy blue silk shirt with a crisp tailored fit.', 'Camisa de seda azul marino premium con corte impecable.', 159.00, 4, '/images/silk_shirt_navy.png', TRUE, '["XS","S","M","L","XL"]'),
  (5, 'Pearl White Blouse', 'Blusa Blanca Perla', 'Classic white silk blouse with delicate button details and bishop sleeves.', 'Blusa clásica de seda blanca con detalles de botones delicados y mangas abullonadas.', 169.00, 1, '/images/silk_blouse_white.png', FALSE, '["XS","S","M","L","XL"]'),
  (6, 'Midnight Silk Gown', 'Vestido de Seda Medianoche', 'Sophisticated navy silk evening gown with elegant draping.', 'Sofisticado vestido de noche de seda azul marino con drapeado elegante.', 429.00, 2, '/images/silk_dress_navy.png', FALSE, '["XS","S","M","L","XL"]'),
  (7, 'Burgundy Silk Scarf', 'Pañuelo de Seda Burdeos', 'Rich burgundy silk scarf with a luxurious hand feel.', 'Rico pañuelo de seda burdeos con un tacto lujoso.', 79.00, 3, '/images/silk_scarf_burgundy.png', FALSE, '["One Size"]'),
  (8, 'Ivory Silk Shirt', 'Camisa de Seda Marfil', 'Elegant ivory silk shirt with mandarin collar and refined finish.', 'Elegante camisa de seda marfil con cuello mandarín y acabado refinado.', 149.00, 4, '/images/silk_shirt_ivory.png', FALSE, '["XS","S","M","L","XL"]');

-- Insert reviews (matches frontend products.js exactly)
INSERT INTO reviews (product_id, author, rating, comment) VALUES
  -- Product 1: Golden Silk Blouse
  (1, 'Sophia M.', 5, 'Absolutely stunning! The fabric feels incredibly luxurious. I wore it to a gala and received so many compliments.'),
  (1, 'Claire D.', 4, 'Beautiful blouse — the color is even richer in person. Sizing runs slightly slim, I''d recommend going up one size.'),
  (1, 'Natasha R.', 5, 'Worth every penny. The craftsmanship is impeccable and it drapes so elegantly.'),
  -- Product 2: Crimson Evening Dress
  (2, 'Isabella C.', 5, 'This dress is showstopping. Wore it to my sister''s wedding and felt like royalty all night.'),
  (2, 'Mia T.', 5, 'The silk is buttery smooth and the color is a gorgeous, deep crimson. True to size.'),
  (2, 'Amelia B.', 4, 'Elegant and timeless. The straps are delicate but secure. A must-have for any formal occasion.'),
  -- Product 3: Emerald Silk Scarf
  (3, 'Olivia P.', 5, 'The color is absolutely vibrant and the silk is so soft. I use it as a headscarf, around my neck, and even tied to my bag.'),
  (3, 'Emma L.', 4, 'Great quality for the price. Very versatile — I''ve styled it a dozen different ways.'),
  (3, 'Sarah K.', 5, 'A perfect gift. Came beautifully packaged and the recipient was overjoyed.'),
  -- Product 4: Navy Silk Shirt
  (4, 'James W.', 5, 'Sharp, sophisticated, and incredibly comfortable. This shirt elevates any outfit instantly.'),
  (4, 'Daniel F.', 4, 'Beautiful fabric and construction. I wore it to a business dinner and got several compliments.'),
  (4, 'Michael H.', 5, 'The tailored fit is perfect. Not too slim, not boxy. The navy is a rich, deep hue — very classy.'),
  -- Product 5: Pearl White Blouse
  (5, 'Grace Y.', 5, 'A wardrobe staple. The bishop sleeves give it such a romantic, editorial feel.'),
  (5, 'Hannah V.', 4, 'Really lovely blouse. The pearl-white silk has a beautiful sheen. I style it with wide-leg trousers.'),
  (5, 'Zoe A.', 5, 'Timeless and elegant. The button detail is subtle but adds so much character.'),
  -- Product 6: Midnight Silk Gown
  (6, 'Victoria N.', 5, 'Breathtaking. The draping is masterful and the silk flows beautifully when you walk.'),
  (6, 'Charlotte E.', 5, 'Worthy of a red carpet. I wore it to a formal gala and felt absolutely radiant.'),
  (6, 'Luna S.', 4, 'Stunning gown with impeccable finishing. Arrived quickly and was packaged with real care.'),
  -- Product 7: Burgundy Silk Scarf
  (7, 'Rose T.', 5, 'The burgundy is so rich and deep. I layer it over a camel coat in winter and it''s the perfect pop of color.'),
  (7, 'Anna G.', 4, 'Soft, smooth, and the color doesn''t fade. Very impressed with the quality at this price point.'),
  (7, 'Lily M.', 5, 'Bought this as a gift and my friend absolutely loved it. Gorgeous color and quality.'),
  -- Product 8: Ivory Silk Shirt
  (8, 'Lucas B.', 5, 'The mandarin collar is a brilliant design choice. Sleek, modern, and effortlessly refined.'),
  (8, 'Noah C.', 4, 'Excellent quality. The ivory is a warm, creamy tone — not stark white. Very versatile piece.'),
  (8, 'Ethan R.', 5, 'Wore this to a gallery opening and it was a talking point all evening. Simply beautiful.');

-- Insert a demo user (password: password123)
-- bcrypt hash for 'password123'
INSERT INTO users (name, email, password, account_type) VALUES
  ('Demo User', 'demo@lincesckf.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');
