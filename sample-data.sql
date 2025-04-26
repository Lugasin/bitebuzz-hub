-- Insert sample restaurants
INSERT INTO restaurants (name, description, image_url, rating, rating_count, address, phone, email) VALUES
('Chicken King', 'Best chicken in town!', '/images/restaurants/chicken-king.jpg', 4.8, 120, '123 Main St, Lusaka', '0977123456', 'info@chickenking.com'),
('Pizza Palace', 'Authentic Italian pizza', '/images/restaurants/pizza-palace.jpg', 4.7, 95, '456 Market St, Lusaka', '0977654321', 'info@pizzapalace.com'),
('Fresh Fries', 'Quick bites and snacks', '/images/restaurants/fresh-fries.jpg', 4.6, 80, '789 Food Court, Lusaka', '0977789456', 'info@freshfries.com');

-- Insert sample menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, rating, rating_count, preparation_time, is_popular, is_available) VALUES
(1, 1, 'Crispy Chicken Burger', 'Juicy chicken breast with special sauce', 70.00, '/images/menu/crispy-chicken.jpg', 4.8, 50, 15, true, true),
(1, 1, 'Spicy Wings (6 pcs)', 'Hot and crispy chicken wings', 55.00, '/images/menu/spicy-wings.jpg', 4.6, 30, 12, true, true),
(2, 1, 'Pepperoni Pizza', 'Classic pepperoni with mozzarella', 95.00, '/images/menu/pepperoni-pizza.jpg', 4.9, 45, 20, true, true),
(2, 1, 'Margherita Pizza', 'Traditional Margherita with fresh basil', 85.00, '/images/menu/margherita-pizza.jpg', 4.7, 35, 20, true, true),
(3, 5, 'Loaded Fries', 'Crispy fries with cheese and bacon', 50.00, '/images/menu/loaded-fries.jpg', 4.5, 25, 10, true, true); 