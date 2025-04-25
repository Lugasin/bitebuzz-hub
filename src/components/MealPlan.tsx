import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Spin, message } from 'antd';
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { DietPreference, MealPlan } from '../services/mealPlanningService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

interface MealPlanProps {
  initialDietPreference?: DietPreference;
  onMealPlanGenerated?: (mealPlan: MealPlan) => void;
}

const MealPlan: React.FC<MealPlanProps> = ({ initialDietPreference, onMealPlanGenerated }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [dietPreference, setDietPreference] = useState<DietPreference>(
    initialDietPreference || {
      type: 'CUSTOM',
      restrictions: [],
      allergies: [],
      preferredCuisines: [],
      calorieTarget: 2000,
      proteinTarget: 50,
      carbTarget: 250,
      fatTarget: 70
    }
  );
  const { user } = useAuth();

  const generateMealPlan = async (duration: number) => {
    if (!user) {
      message.error('Please log in to generate a meal plan');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          dietPreference,
          duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      setMealPlan(data);
      if (onMealPlanGenerated) {
        onMealPlanGenerated(data);
      }
      message.success('Meal plan generated successfully');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      message.error('Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (mealId: string) => {
    if (!user) {
      message.error('Please log in to add items to cart');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          mealId,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      message.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Failed to add to cart');
    }
  };

  return (
    <div className="meal-plan-container">
      <Title level={2}>Your Meal Plan</Title>
      
      <div className="diet-preferences">
        <Title level={4}>Diet Preferences</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text strong>Diet Type:</Text>
            <Tag color="blue">{dietPreference.type}</Tag>
          </Col>
          <Col span={8}>
            <Text strong>Calorie Target:</Text>
            <Text>{dietPreference.calorieTarget} kcal</Text>
          </Col>
          <Col span={8}>
            <Text strong>Macros:</Text>
            <Text>P: {dietPreference.proteinTarget}g C: {dietPreference.carbTarget}g F: {dietPreference.fatTarget}g</Text>
          </Col>
        </Row>
      </div>

      <div className="meal-plan-actions">
        <Button type="primary" onClick={() => generateMealPlan(7)}>
          Generate 7-Day Plan
        </Button>
        <Button type="primary" onClick={() => generateMealPlan(14)}>
          Generate 14-Day Plan
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <Text>Generating your personalized meal plan...</Text>
        </div>
      ) : mealPlan ? (
        <div className="meal-plan-details">
          <Row gutter={[16, 16]}>
            {mealPlan.meals.map((meal, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={meal.name}
                  extra={
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => addToCart(meal.id)}
                    >
                      Add to Cart
                    </Button>
                  }
                >
                  <div className="meal-info">
                    <Text strong>Calories:</Text>
                    <Text>{meal.calories} kcal</Text>
                    <br />
                    <Text strong>Macros:</Text>
                    <Text>P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g</Text>
                    <br />
                    <Text strong>Ingredients:</Text>
                    <ul>
                      {meal.ingredients.map((ingredient, i) => (
                        <li key={i}>
                          {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div className="empty-state">
          <Text>No meal plan generated yet. Click the buttons above to create one!</Text>
        </div>
      )}

      <style jsx>{`
        .meal-plan-container {
          padding: 24px;
        }
        .diet-preferences {
          margin-bottom: 24px;
        }
        .meal-plan-actions {
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }
        .meal-info {
          margin-top: 16px;
        }
        .empty-state {
          text-align: center;
          padding: 48px;
          background: #f5f5f5;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default MealPlan; 