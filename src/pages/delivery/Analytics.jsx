
import React, { useEffect, useState } from 'react';
import DeliveryLayout from "@/layouts/DeliveryLayout";
import DeliveryAnalytics from "@/components/analytics/DeliveryAnalytics";
import { useAuth } from '@/context/AuthContext';
import { getDeliveryDriverByFirebaseUid } from '@/functions/src/models/deliveryDriver';

const DeliveryAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const [deliveryDriverData, setDeliveryDriverData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryDriverData = async () => {
      try {
        if (currentUser) {
          const driverData = await getDeliveryDriverByFirebaseUid(currentUser.uid);
          setDeliveryDriverData(driverData);
          console.log("Delivery driver data fetched:", driverData);
        }
      } catch (error) {
        console.error("Error fetching delivery driver data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryDriverData();
  }, [currentUser]);

  return (
    <DeliveryLayout>
      {isLoading ? <p>Loading...</p> : <DeliveryAnalytics deliveryDriverData={deliveryDriverData} />}
    </DeliveryLayout>
  );
};

export default DeliveryAnalyticsPage;
