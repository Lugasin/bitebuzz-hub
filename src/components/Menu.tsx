import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Input, Select, Rate, Tag, Carousel, Image, Space } from 'antd';
import { ShoppingCartOutlined, ClockCircleOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { MenuItem, MenuCategory, ZAMBIAN_CATEGORIES, getPopularItems, getItemsByCategory, getTopRatedRestaurants } from '../services/menuService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Menu: React.FC = () => {
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [popular, topRated] = await Promise.all([
        getPopularItems(),
        getTopRatedRestaurants()
      ]);
      setPopularItems(popular);
      setTopRestaurants(topRated);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setLoading(true);
    try {
      const items = await getItemsByCategory(category);
      setCategoryItems(items);
    } catch (error) {
      console.error('Error loading category items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategorySelect = async (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setLoading(true);
    try {
      const items = await getItemsByCategory(selectedCategory, subcategory);
      setCategoryItems(items);
    } catch (error) {
      console.error('Error loading subcategory items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItemCard = (item: MenuItem) => (
    <Card
      key={item.id}
      hoverable
      cover={
        <div style={{ height: 200, overflow: 'hidden' }}>
          <Image
            src={item.imageUrl}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            preview={false}
          />
        </div>
      }
      actions={[
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => {/* Add to cart logic */}}
        >
          Add to Cart
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <Space direction="vertical" size="small">
            <Text strong>{item.name}</Text>
            <Rate disabled defaultValue={item.rating} />
            <Text type="secondary">({item.ratingCount} reviews)</Text>
          </Space>
        }
        description={
          <Space direction="vertical" size="small">
            <Text>{item.description}</Text>
            <Text strong>K{item.price.toFixed(2)}</Text>
            <Space>
              <Tag icon={<ClockCircleOutlined />}>{item.preparationTime} min</Tag>
              {item.dietaryInfo.isVegetarian && <Tag color="green">Vegetarian</Tag>}
              {item.dietaryInfo.isVegan && <Tag color="green">Vegan</Tag>}
              {item.dietaryInfo.isGlutenFree && <Tag color="blue">Gluten Free</Tag>}
              {item.dietaryInfo.isSpicy && <Tag color="red">Spicy</Tag>}
            </Space>
          </Space>
        }
      />
    </Card>
  );

  return (
    <div className="menu-container">
      {/* Hero Carousel */}
      <Carousel autoplay className="hero-carousel">
        {popularItems.map(item => (
          <div key={item.id} className="hero-slide">
            <Image
              src={item.imageUrl}
              alt={item.name}
              preview={false}
              className="hero-image"
            />
            <div className="hero-content">
              <Title level={2}>{item.name}</Title>
              <Text>{item.description}</Text>
              <Button type="primary" size="large">
                Order Now
              </Button>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Search and Filters */}
      <div className="search-section">
        <Search
          placeholder="Search for food, restaurants..."
          enterButton
          size="large"
          style={{ width: '100%', maxWidth: 600 }}
        />
        <Select
          placeholder="Filter by Category"
          style={{ width: 200 }}
          onChange={handleCategorySelect}
          value={selectedCategory}
        >
          {ZAMBIAN_CATEGORIES.map(category => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        {selectedCategory && (
          <Select
            placeholder="Filter by Subcategory"
            style={{ width: 200 }}
            onChange={handleSubcategorySelect}
            value={selectedSubcategory}
          >
            {ZAMBIAN_CATEGORIES
              .find(c => c.id === selectedCategory)
              ?.subcategories.map(sub => (
                <Option key={sub} value={sub}>
                  {sub}
                </Option>
              ))}
          </Select>
        )}
      </div>

      {/* Popular Items */}
      <div className="section">
        <Title level={3}>
          <FireOutlined /> Popular Items
        </Title>
        <Row gutter={[16, 16]}>
          {popularItems.map(renderItemCard)}
        </Row>
      </div>

      {/* Top Restaurants */}
      <div className="section">
        <Title level={3}>
          <StarOutlined /> Top Restaurants
        </Title>
        <Row gutter={[16, 16]}>
          {topRestaurants.map(renderItemCard)}
        </Row>
      </div>

      {/* Category Items */}
      {selectedCategory && (
        <div className="section">
          <Title level={3}>
            {ZAMBIAN_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            {selectedSubcategory && ` - ${selectedSubcategory}`}
          </Title>
          <Row gutter={[16, 16]}>
            {categoryItems.map(renderItemCard)}
          </Row>
        </div>
      )}

      <style jsx>{`
        .menu-container {
          padding: 24px;
        }
        .hero-carousel {
          margin-bottom: 24px;
        }
        .hero-slide {
          position: relative;
          height: 400px;
        }
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
        }
        .search-section {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .section {
          margin-bottom: 32px;
        }
      `}</style>
    </div>
  );
};

export default Menu; 