// types/index.ts - Centralized type definitions

export interface LocationData {
  city: string;
  state: string;
  country: string;
  pincode?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  category: string;
  isPredicted?: boolean;
  priceSource?: string;
  priceComparison?: PriceComparisonResult;
  location?: string;
}

export interface PriceComparisonResult {
  item: string;
  prices: Array<{
    source: string;
    price: number;
    unit: string;
    location: string;
  }>;
  averagePrice: number;
  bestPrice: number;
  priceRange: string;
}

export interface MarketInsights {
  averagePriceLevel: string;
  trendingItems: string[];
  bestDeals: Array<{ item: string; price: number; store: string }>;
  priceAlert: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  cookTime: number;
  servings: number;
  calories: number;
  healthTags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions?: string[];
  nutrition?: NutritionInfo;
  image?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeName: string;
  calories: number;
  nutrition: NutritionInfo;
  timestamp: number;
}

export interface BatchCookingSuggestion {
  id: string;
  name: string;
  prepTime: number;
  servings: number;
  storageTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  category: string;
  nutritionPerServing: NutritionInfo;
  costPerServing: number;
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dailyCalorieGoal: number;
  dietaryRestrictions: string[];
  healthGoals: string[];
}