import React from 'react';
import { Typography, Button, Row, Col, Card, Carousel, Image, Space, Rate } from 'antd';
import { ArrowRightOutlined, FireOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { MenuItem, ZAMBIAN_CATEGORIES } from '../services/menuService';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

interface LandingPageProps {
  featuredItems: MenuItem[];
  topRestaurants: MenuItem[];
}

const LandingPage: React.FC<LandingPageProps> = ({ featuredItems, topRestaurants }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/menu?category=${categoryId}`);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Carousel autoplay className="hero-carousel">
          {featuredItems.map(item => (
            <div key={item.id} className="hero-slide">
              <Image
                src={item.imageUrl}
                alt={item.name}
                preview={false}
                className="hero-image"
              />
              <div className="hero-content">
                <Title level={1}>{item.name}</Title>
                <Text className="hero-description">{item.description}</Text>
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                  Order Now
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Categories Section */}
      <div className="section categories-section">
        <Title level={2}>Explore Zambian Cuisine</Title>
        <Row gutter={[24, 24]}>
          {ZAMBIAN_CATEGORIES.map(category => (
            <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    height={200}
                    preview={false}
                  />
                }
                onClick={() => handleCategoryClick(category.id)}
              >
                <Card.Meta
                  title={category.name}
                  description={category.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Featured Items */}
      <div className="section featured-section">
        <Title level={2}>
          <FireOutlined /> Popular Items
        </Title>
        <Row gutter={[24, 24]}>
          {featuredItems.map(item => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    height={200}
                    preview={false}
                  />
                }
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
            </Col>
          ))}
        </Row>
      </div>

      {/* Top Restaurants */}
      <div className="section restaurants-section">
        <Title level={2}>
          <StarOutlined /> Top Restaurants
        </Title>
        <Row gutter={[24, 24]}>
          {topRestaurants.map(restaurant => (
            <Col key={restaurant.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <Image
                    src={restaurant.imageUrl}
                    alt={restaurant.restaurantName}
                    height={200}
                    preview={false}
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
      </div>

      {/* Call to Action */}
      <div className="section cta-section">
        <Card className="cta-card">
          <Title level={2}>Ready to Order?</Title>
          <Text>Discover the best of Zambian cuisine at your fingertips</Text>
          <Button type="primary" size="large" onClick={() => router.push('/menu')}>
            Browse Menu
          </Button>
        </Card>
      </div>

      <style jsx>{`
        .landing-page {
          padding: 0;
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
          padding: 48px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
        }
        .hero-description {
          font-size: 18px;
          margin: 16px 0;
          display: block;
        }
        .section {
          padding: 48px 24px;
        }
        .categories-section {
          background: #f5f5f5;
        }
        .cta-section {
          text-align: center;
        }
        .cta-card {
          max-width: 600px;
          margin: 0 auto;
          padding: 48px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 