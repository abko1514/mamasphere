import MealPlanningMain from "@/components/meal-planning/MealPlanningMain";
import Navbar from "@/app/core component/Navbar";
export default function MealPage() {
  return (
    <>
      <Navbar />
      <MealPlanningMain />
    </>
  );
}

export const metadata = {
  title: "Smart Meal Planning - MamaSphere",
  description: "AI-powered meal planning with location-based pricing",
};
