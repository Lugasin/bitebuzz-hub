
import React from 'react';
import MainLayout from "@/layouts/MainLayout";
import MealPlanningModule from "@/components/mealPlanning/MealPlanningModule";

const MealPlanningPage = () => {
  return (
    <MainLayout>
      <div className="pb-16">
        <div className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Meal Planning</h1>
            <p className="text-lg text-muted-foreground">
              Plan your meals with Eeats to save time and money while eating better
            </p>
          </div>
        </div>
        
        <MealPlanningModule />
      </div>
    </MainLayout>
  );
};

export default MealPlanningPage;
