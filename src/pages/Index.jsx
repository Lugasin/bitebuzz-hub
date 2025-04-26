import React, { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Utensils, ShoppingBag, Clock, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Typography, Carousel, Card, Row, Col, Space, Rate, Tag, Input, message } from 'antd';
import { 
  getPopularItems, 
  getTopRatedRestaurants, 
  getTrendingItems,
  getRecommendedItems,
  searchMenuItems,
  ZAMBIAN_CATEGORIES
} from "@/services/menuService";

const { Title, Text } = Typography;
const { Search: SearchInput } = Input;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Index = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [popular, restaurants, trending] = await Promise.all([
          getPopularItems(5),
          getTopRatedRestaurants(4),
          getTrendingItems(4)
        ]);
        
        setFeaturedItems(popular);
        setTopRestaurants(restaurants);
        setTrendingItems(trending);

        if (currentUser) {
          const recommended = await getRecommendedItems(currentUser.uid, 4);
          setRecommendedItems(recommended);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMenuItems(value);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      message.error('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    message.success(`${item.name} added to cart!`);
  };

  const renderItemCard = (item) => (
    <Card
      hoverable
      cover={
        <img
          alt={item.name}
          src={item.imageUrl}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      actions={[
        <Button
          type="text" 
          icon={<ShoppingBag />} 
          key="add-to-cart"
          onClick={() => handleAddToCart(item)}
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
          </Space>
        }
        description={
          <Space direction="vertical" size="small">
            <Text>{item.description}</Text>
            <Text strong>K{item.price.toFixed(2)}</Text>
            <Space>
              <Tag icon={<Clock />}>{item.preparationTime} min</Tag>
              {item.dietaryInfo?.isVegetarian && <Tag color="green">Vegetarian</Tag>}
              {item.dietaryInfo?.isVegan && <Tag color="green">Vegan</Tag>}
              {item.dietaryInfo?.isGlutenFree && <Tag color="blue">Gluten Free</Tag>}
              {item.dietaryInfo?.isSpicy && <Tag color="red">Spicy</Tag>}
            </Space>
          </Space>
        }
      />
    </Card>
  );

  return (
    <MainLayout>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
        animate="visible"
        className="landing-page"
      >
        {/* Search Bar */}
        <section className="search-section">
          <SearchInput
            placeholder="Search for food, restaurants..."
            allowClear
            enterButton={<Search />}
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            loading={isSearching}
            style={{ maxWidth: 600, margin: '0 auto' }}
          />
      </section>
      
        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="section search-results-section">
            <Title level={2}>Search Results</Title>
            <Row gutter={[24, 24]}>
              {searchResults.map(item => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  {renderItemCard(item)}
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Hero Section */}
        <section className="hero-section">
          <Carousel autoplay className="hero-carousel">
            {featuredItems.map(item => (
              <div key={item.id} className="hero-slide">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="hero-image"
                />
                <div className="hero-content">
                  <Title level={1}>{item.name}</Title>
                  <Text className="hero-description">{item.description}</Text>
                  <Button type="primary" size="large">
                    Order Now
                  </Button>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Categories Section */}
        <section className="section categories-section">
          <Title level={2}>
            <Utensils /> Explore Zambian Cuisine
          </Title>
          <Row gutter={[24, 24]}>
            {ZAMBIAN_CATEGORIES.map(category => (
              <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                >
                  <Card.Meta
                    title={category.name}
                    description={category.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Featured Items */}
        <section className="section featured-section">
          <Title level={2}>
            <Star /> Popular Items
          </Title>
          <Row gutter={[24, 24]}>
            {featuredItems.map(item => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                {renderItemCard(item)}
              </Col>
            ))}
          </Row>
      </section>
      
        {/* Trending Items */}
        {trendingItems.length > 0 && (
          <section className="section trending-section">
            <Title level={2}>
              <Star /> Trending Now
            </Title>
            <Row gutter={[24, 24]}>
              {trendingItems.map(item => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  {renderItemCard(item)}
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Recommended Items */}
        {recommendedItems.length > 0 && (
          <section className="section recommended-section">
            <Title level={2}>
              <Heart /> Recommended for You
            </Title>
            <Row gutter={[24, 24]}>
              {recommendedItems.map(item => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  {renderItemCard(item)}
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Top Restaurants */}
        <section className="section restaurants-section">
          <Title level={2}>
            <Heart /> Top Restaurants
          </Title>
          <Row gutter={[24, 24]}>
            {topRestaurants.map(restaurant => (
              <Col key={restaurant.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.restaurantName}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                >
                  <Card.Meta
                    title={
                      <Space direction="vertical" size="small">
                        <Text strong>{restaurant.restaurantName}</Text>
                        <Rate disabled defaultValue={restaurant.restaurantRating} />
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text>{restaurant.description}</Text>
                        <Text type="secondary">Average delivery time: {restaurant.preparationTime} min</Text>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Call to Action */}
        <section className="section cta-section">
          <Card className="cta-card">
            <Title level={2}>Ready to Order?</Title>
            <Text>Discover the best of Zambian cuisine at your fingertips</Text>
            <Button type="primary" size="large">
              Browse Menu
            </Button>
          </Card>
      </section>
      
        <style jsx>{`
          .landing-page {
            padding: 0;
          }
          .search-section {
            padding: 24px 0;
            background: #f5f5f5;
          }
          .search-results-section {
            background: #fff;
          }
          .hero-section {
            position: relative;
            height: 600px;
            margin-bottom: 48px;
          }
          .hero-carousel {
            height: 100%;
          }
          .hero-slide {
            position: relative;
            height: 600px;
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
          .hero-description {
            font-size: 18px;
            margin: 16px 0;
            display: block;
          }
          .section {
            padding: 48px 0;
          }
          .cta-card {
            text-align: center;
            padding: 48px;
          }
        `}</style>
      </motion.div>
    </MainLayout>
  );
};

export default Index;