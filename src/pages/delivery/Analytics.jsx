
import React, { useEffect, useState } from 'react';
import DeliveryLayout from "@/layouts/DeliveryLayout";
import DeliveryAnalytics from "@/components/analytics/DeliveryAnalytics";
import { useAuth } from '@/context/AuthContext';

const DeliveryAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const data = await User.getUserById(currentUser.uid);
          setUserData(data);
          console.log("User data fetched:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <DeliveryLayout>
      {isLoading ? <p>Loading...</p> : <DeliveryAnalytics userData={userData} />}
    </DeliveryLayout>
  );
};

export default DeliveryAnalyticsPage;
