import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, List, Tag, Rate, Space, Tabs } from 'antd';
import { HeartOutlined, HistoryOutlined, StarOutlined } from '@ant-design/icons';
import { MenuItem } from '../services/menuService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserPreferences: React.FC = () => {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/preferences', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      setFavorites(data.favorites);
      setRecentOrders(data.recentOrders);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemId: string) => {
    try {
      await fetch('/api/user/favorites', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId })
      });
      setFavorites(favorites.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderItem = (item: MenuItem) => (
    <List.Item
      key={item.id}
      actions={[
        <Button type="primary" icon={<HeartOutlined />} onClick={() => handleRemoveFavorite(item.id)}>
          Remove
        </Button>,
        <Button type="primary" icon={<StarOutlined />}>
          Reorder
        </Button>
      ]}
    >
      <List.Item.Meta
        avatar={
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
          />
        }
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
    </List.Item>
  );

  return (
    <Card className="preferences-container">
      <Tabs defaultActiveKey="favorites">
        <TabPane
          tab={
            <span>
              <HeartOutlined />
              Favorites
            </span>
          }
          key="favorites"
        >
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={favorites}
            renderItem={renderItem}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Recent Orders
            </span>
          }
          key="recent"
        >
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={recentOrders}
            renderItem={renderItem}
          />
        </TabPane>
      </Tabs>

      <style jsx>{`
        .preferences-container {
          margin: 24px;
        }
      `}</style>
    </Card>
  );
};

export default UserPreferences; 