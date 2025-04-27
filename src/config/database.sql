-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    driver_id BIGINT,
    items JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    status ENUM(
        'pending',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'picked_up',
        'in_transit',
        'delivered',
        'cancelled'
    ) NOT NULL DEFAULT 'pending',
    delivery_address JSON NOT NULL,
    restaurant_location POINT NOT NULL,
    special_instructions TEXT,
    payment_method ENUM('cash', 'card', 'mobile_money') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    currency ENUM('ZMW', 'USD') NOT NULL DEFAULT 'ZMW',
    exchange_rate DECIMAL(10,4),
    estimated_distance DECIMAL(10,2) COMMENT 'Distance in kilometers',
    estimated_duration INT COMMENT 'Duration in minutes',
    tracking_points JSON COMMENT 'Array of {latitude, longitude, timestamp}',
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (driver_id) REFERENCES users(id),
    SPATIAL INDEX (restaurant_location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    changed_by BIGINT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order tracking table
CREATE TABLE IF NOT EXISTS order_tracking (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    speed DECIMAL(5,2) COMMENT 'Speed in km/h',
    accuracy DECIMAL(5,2) COMMENT 'Accuracy in meters',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX (order_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order notifications table
CREATE TABLE IF NOT EXISTS order_notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    type ENUM('status_change', 'location_update', 'payment_update', 'rating') NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add commission_rate to restaurants table
ALTER TABLE restaurants
ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 15.00 COMMENT 'Default commission rate in percentage';

-- Create commission rules table
CREATE TABLE IF NOT EXISTS commission_rules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    currency ENUM('ZMW', 'USD') NOT NULL DEFAULT 'ZMW',
    status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency ENUM('ZMW', 'USD') NOT NULL DEFAULT 'ZMW',
    payment_method ENUM('cash', 'card', 'mobile_money') NOT NULL,
    provider ENUM('stripe', 'mtn', 'airtel', 'zamtel') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    provider_transaction_id VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create cart table
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    items JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency ENUM('ZMW', 'USD') NOT NULL DEFAULT 'ZMW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT NOT NULL,
    date DATE NOT NULL,
    total_orders INT NOT NULL DEFAULT 0,
    total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
    average_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    UNIQUE KEY unique_restaurant_date (restaurant_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 