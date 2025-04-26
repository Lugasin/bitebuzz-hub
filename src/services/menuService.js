import { query } from '@/lib/db';

export const getPopularItems = async (limit = 10) => {
  const sql = `
    SELECT 
      mi.*,
      r.name as restaurant_name,
      r.rating as restaurant_rating,
      mc.name as category_name
    FROM menu_items mi
    JOIN restaurants r ON mi.restaurant_id = r.id
    JOIN menu_categories mc ON mi.category_id = mc.id
    WHERE mi.is_popular = true AND mi.is_available = true
    ORDER BY mi.rating DESC
    LIMIT ?
  `;
  return await query(sql, [limit]);
};

export const getTopRatedRestaurants = async (limit = 5) => {
  const sql = `
    SELECT 
      r.*,
      COUNT(DISTINCT mi.id) as menu_item_count,
      AVG(mi.rating) as average_item_rating
    FROM restaurants r
    LEFT JOIN menu_items mi ON r.id = mi.restaurant_id
    WHERE r.is_active = true
    GROUP BY r.id
    ORDER BY r.rating DESC, average_item_rating DESC
    LIMIT ?
  `;
  return await query(sql, [limit]);
};

export const getTrendingItems = async (limit = 10) => {
  const sql = `
    SELECT 
      mi.*,
      r.name as restaurant_name,
      r.rating as restaurant_rating,
      mc.name as category_name
    FROM menu_items mi
    JOIN restaurants r ON mi.restaurant_id = r.id
    JOIN menu_categories mc ON mi.category_id = mc.id
    WHERE mi.is_available = true
    ORDER BY mi.rating_count DESC, mi.rating DESC
    LIMIT ?
  `;
  return await query(sql, [limit]);
};

export const getRecommendedItems = async (userId, limit = 10) => {
  const sql = `
    SELECT 
      mi.*,
      r.name as restaurant_name,
      r.rating as restaurant_rating,
      mc.name as category_name
    FROM menu_items mi
    JOIN restaurants r ON mi.restaurant_id = r.id
    JOIN menu_categories mc ON mi.category_id = mc.id
    WHERE mi.is_available = true
    ORDER BY mi.rating DESC
    LIMIT ?
  `;
  return await query(sql, [limit]);
};

export const getItemsByCategory = async (categoryId) => {
  const sql = `
    SELECT 
      mi.*,
      r.name as restaurant_name,
      r.rating as restaurant_rating,
      mc.name as category_name
    FROM menu_items mi
    JOIN restaurants r ON mi.restaurant_id = r.id
    JOIN menu_categories mc ON mi.category_id = mc.id
    WHERE mi.category_id = ? AND mi.is_available = true
    ORDER BY mi.rating DESC
  `;
  return await query(sql, [categoryId]);
};

export const searchMenuItems = async (searchTerm) => {
  const sql = `
    SELECT 
      mi.*,
      r.name as restaurant_name,
      r.rating as restaurant_rating,
      mc.name as category_name
    FROM menu_items mi
    JOIN restaurants r ON mi.restaurant_id = r.id
    JOIN menu_categories mc ON mi.category_id = mc.id
    WHERE mi.is_available = true
    AND (
      mi.name LIKE ? OR
      mi.description LIKE ? OR
      r.name LIKE ?
    )
    ORDER BY mi.rating DESC
  `;
  const searchPattern = `%${searchTerm}%`;
  return await query(sql, [searchPattern, searchPattern, searchPattern]);
};

export const ZAMBIAN_CATEGORIES = [
  {
    id: 1,
    name: 'Main Dishes',
    description: 'Traditional Zambian main courses',
    imageUrl: '/images/categories/main-dishes.jpg',
    subcategories: ['Nshima', 'Ifisashi', 'Kapenta', 'Chikanda', 'Biltong']
  },
  {
    id: 2,
    name: 'Side Dishes',
    description: 'Perfect accompaniments to your main meal',
    imageUrl: '/images/categories/side-dishes.jpg',
    subcategories: ['Vegetables', 'Relishes', 'Sauces', 'Salads']
  },
  {
    id: 3,
    name: 'Drinks',
    description: 'Refreshing beverages',
    imageUrl: '/images/categories/drinks.jpg',
    subcategories: ['Soft Drinks', 'Juices', 'Traditional Drinks', 'Hot Beverages']
  },
  {
    id: 4,
    name: 'Alcohol',
    description: 'Local and imported alcoholic beverages',
    imageUrl: '/images/categories/alcohol.jpg',
    subcategories: ['Beer', 'Wine', 'Spirits', 'Traditional Brews']
  },
  {
    id: 5,
    name: 'Snacks',
    description: 'Quick bites and street food',
    imageUrl: '/images/categories/snacks.jpg',
    subcategories: ['Street Food', 'Pastries', 'Fruits', 'Nuts']
  },
  {
    id: 6,
    name: 'Desserts',
    description: 'Sweet treats and traditional desserts',
    imageUrl: '/images/categories/desserts.jpg',
    subcategories: ['Cakes', 'Traditional Sweets', 'Ice Cream', 'Fruits']
  }
]; 