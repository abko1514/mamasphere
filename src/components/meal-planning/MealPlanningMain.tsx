'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, ChefHat, Clock, Target, Plus, Trash2, Search, DollarSign,
  Utensils, TrendingUp, Award, AlertCircle, CheckCircle, Star,
   MapPin, RefreshCw, Info
} from 'lucide-react';

// Import all our services and types
import { LocationPricingService } from '../../services/LocationPricingService';
import { RecipeService } from '../../services/RecipeService';
import { BatchCookingService } from '../../services/BatchCookingService';
import { NutritionTrackerService } from '../../services/NutritionTrackerService';

import { 
  LocationData, GroceryItem, Recipe, MarketInsights, BatchCookingSuggestion,
  MealEntry,  UserProfile 
} from '../../types';

const MealPlanningMain: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<
    "grocery" | "recipes" | "batch" | "tracker"
  >("grocery");

  // Grocery states
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, unit: "kg" });
  const [budget, setBudget] = useState(8000);
  const [showPriceComparison, setShowPriceComparison] = useState(false);

  // Recipe states
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [healthRequirements, setHealthRequirements] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Batch cooking states
  const [batchSuggestions, setBatchSuggestions] = useState<
    BatchCookingSuggestion[]
  >([]);
  const [selectedDietaryRestrictions] = useState<string[]>([]);

  // Nutrition tracker states
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  type MealType = "breakfast" | "lunch" | "dinner" | "snack";
  const [newMealEntry, setNewMealEntry] = useState<{
    recipeName: string;
    mealType: MealType;
  }>({
    recipeName: "",
    mealType: "breakfast",
  });

  // Location and loading states
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // User profile (in real app, this would come from user settings)
  const [userProfile] = useState<UserProfile>({
    weight: 65,
    height: 165,
    age: 30,
    gender: "female",
    activityLevel: "moderate",
    dailyCalorieGoal: 1800,
    dietaryRestrictions: [],
    healthGoals: ["weight-maintenance"],
  });

  // Initialize data on mount
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);

    try {
      // Load user location
      await loadUserLocation();

      // Initialize nutrition tracker with sample data
      NutritionTrackerService.initializeSampleData();
      loadTodaysMeals();

      // Load batch cooking suggestions
      loadBatchSuggestions();
    } catch (error) {
      console.error("Error initializing app:", error);
    }

    setIsLoading(false);
  };

  // Location functions
  const loadUserLocation = async () => {
    setLocationError(null);

    try {
      const location = await LocationPricingService.getUserLocation();
      setUserLocation(location);
      console.log("Location detected:", location);

      // Load market insights
      const insights = await LocationPricingService.getMarketInsights(location);
      setMarketInsights(insights);
    } catch (error) {
      console.error("Failed to get location:", error);
      setLocationError("Unable to detect location. Using default pricing.");

      // Set default location
      setUserLocation({
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        coordinates: { latitude: 19.076, longitude: 72.8777 },
      });
    }
  };

  // Grocery functions
  const addGroceryItem = async () => {
    if (!newItem.name.trim() || !userLocation) return;

    setIsPriceLoading(true);

    try {
      const priceComparison = await LocationPricingService.fetchRealTimePrices(
        newItem.name,
        userLocation
      );

      const item: GroceryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity,
        unit: newItem.unit,
        estimatedPrice: priceComparison.averagePrice * newItem.quantity,
        category: getCategoryFromName(newItem.name),
        priceSource: "API",
        priceComparison,
        location: userLocation.city,
      };

      setGroceryList([...groceryList, item]);
      setNewItem({ name: "", quantity: 1, unit: "kg" });
    } catch (error) {
      console.error("Error fetching price:", error);

      // Fallback pricing
      const fallbackPrice = LocationPricingService.getLocationAdjustedPrice(
        newItem.name,
        userLocation
      );
      const item: GroceryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity,
        unit: newItem.unit,
        estimatedPrice: fallbackPrice * newItem.quantity,
        category: getCategoryFromName(newItem.name),
        priceSource: "Estimated",
        location: userLocation.city,
      };

      setGroceryList([...groceryList, item]);
      setNewItem({ name: "", quantity: 1, unit: "kg" });
    }

    setIsPriceLoading(false);
  };

  const getCategoryFromName = (itemName: string): string => {
    const categories = {
      Vegetables: [
        "onion",
        "potato",
        "tomato",
        "carrot",
        "broccoli",
        "spinach",
        "cabbage",
      ],
      Fruits: ["apple", "banana", "orange", "mango", "grapes"],
      Dairy: ["milk", "cheese", "yogurt", "butter", "eggs"],
      Pantry: ["rice", "wheat", "flour", "dal", "oil", "salt", "sugar", "oats"],
      Meat: ["chicken", "fish", "mutton"],
    };

    const lowerName = itemName.toLowerCase();
    for (const [category, items] of Object.entries(categories)) {
      if (items.some((item) => lowerName.includes(item))) {
        return category;
      }
    }
    return "Other";
  };

  const removeGroceryItem = (id: string) => {
    setGroceryList(groceryList.filter((item) => item.id !== id));
  };

  const refreshPrices = async () => {
    if (!userLocation) return;

    setIsPriceLoading(true);

    try {
      LocationPricingService.clearCache();

      const updatedItems = await Promise.all(
        groceryList.map(async (item) => {
          const priceComparison =
            await LocationPricingService.fetchRealTimePrices(
              item.name,
              userLocation
            );
          return {
            ...item,
            estimatedPrice: priceComparison.averagePrice * item.quantity,
            priceComparison,
            priceSource: "API (Refreshed)",
          };
        })
      );

      setGroceryList(updatedItems);

      // Refresh market insights
      const insights = await LocationPricingService.getMarketInsights(
        userLocation
      );
      setMarketInsights(insights);
    } catch (error) {
      console.error("Error refreshing prices:", error);
    }

    setIsPriceLoading(false);
  };

  // Recipe functions
  const searchRecipes = async () => {
    if (!healthRequirements.trim()) return;

    setIsLoading(true);
    try {
      const foundRecipes = await RecipeService.searchRecipesByHealth(
        healthRequirements
      );
      setRecipes(foundRecipes);
    } catch (error) {
      console.error("Error searching recipes:", error);
      // Fallback to database recipes
      setRecipes(RecipeService.getTrendingRecipes());
    }
    setIsLoading(false);
  };

  // Batch cooking functions
  const loadBatchSuggestions = () => {
    const suggestions = BatchCookingService.getBatchCookingSuggestions(
      userProfile,
      selectedDietaryRestrictions,
      120, // 2 hours available
      14 // 2 weeks worth of meals
    );
    setBatchSuggestions(suggestions);
  };

  // Nutrition tracker functions
  const loadTodaysMeals = () => {
    const today = new Date().toISOString().split("T")[0];
    const entries = NutritionTrackerService.getMealEntriesForDate(today);
    setMealEntries(entries);
  };

  const addMealEntry = () => {
    if (!newMealEntry.recipeName.trim()) return;

    const entry = NutritionTrackerService.addMealEntry(
      newMealEntry.recipeName,
      newMealEntry.mealType,
      1 // servings
    );

    setMealEntries([entry, ...mealEntries]);
    setNewMealEntry({ recipeName: "", mealType: "breakfast" });
  };

  const removeMealEntry = (id: string) => {
    NutritionTrackerService.removeMealEntry(id);
    loadTodaysMeals();
  };

  // Utility functions
  const calculateTotalCost = () => {
    return groceryList.reduce((sum, item) => sum + item.estimatedPrice, 0);
  };

  const getBudgetStatus = () => {
    const total = calculateTotalCost();
    const percentage = (total / budget) * 100;

    if (percentage <= 80)
      return {
        status: "good",
        color: "text-green-600",
        bgColor: "bg-green-500",
      };
    if (percentage <= 100)
      return {
        status: "warning",
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
      };
    return { status: "over", color: "text-red-600", bgColor: "bg-red-500" };
  };

  const getTodaysCalories = () => {
    return mealEntries.reduce((sum, entry) => sum + entry.calories, 0);
  };

  const getTodaysNutrition = () => {
    const today = new Date().toISOString().split("T")[0];
    return NutritionTrackerService.getDailyNutritionTotals(today);
  };

  // Component state
  const totalCost = calculateTotalCost();
  const budgetStatus = getBudgetStatus();
  const todaysCalories = getTodaysCalories();
  const todaysNutrition = getTodaysNutrition();

  const tabVariants = {
    inactive: { opacity: 0, y: 10 },
    active: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl">
              <Utensils className="text-white" size={32} />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Smart Meal Planning
            </h1>
          </div>

          {/* Location Display */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="text-purple-600" size={20} />
            {userLocation ? (
              <span className="text-lg text-gray-700">
                Prices for{" "}
                <strong>
                  {userLocation.city}, {userLocation.state}
                </strong>
              </span>
            ) : (
              <span className="text-lg text-gray-500">
                Detecting location...
              </span>
            )}
            <button
              onClick={loadUserLocation}
              className="ml-2 p-1 text-purple-600 hover:bg-purple-100 rounded-full transition-colors"
              title="Refresh location"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {locationError && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm">
              <Info className="inline mr-2" size={16} />
              {locationError}
            </div>
          )}

          <p className="text-gray-600 text-lg mb-6">
            AI-powered meal planning with real-time local pricing
          </p>

          {/* Market Insights Banner */}
          {marketInsights && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200"
            >
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-blue-600" />
                  Price Level:{" "}
                  <strong
                    className={`${
                      marketInsights.averagePriceLevel === "High"
                        ? "text-red-600"
                        : marketInsights.averagePriceLevel === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {marketInsights.averagePriceLevel}
                  </strong>
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-700">
                  {marketInsights.priceAlert}
                </span>
              </div>
            </motion.div>
          )}

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-xl">
                  <ShoppingCart className="text-pink-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {groceryList.length}
                  </div>
                  <div className="text-sm text-gray-600">Items</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-4 shadow-lg border border-green-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${budgetStatus.color}`}>
                    ₹{totalCost.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-4 shadow-lg border border-purple-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Target className="text-purple-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {todaysCalories}
                  </div>
                  <div className="text-sm text-gray-600">Calories Today</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-4 shadow-lg border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <ChefHat className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {recipes.length}
                  </div>
                  <div className="text-sm text-gray-600">Recipes</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap justify-center mb-8 bg-white rounded-3xl p-3 shadow-xl border border-pink-100"
        >
          {[
            {
              key: "grocery",
              label: "Smart Grocery",
              icon: ShoppingCart,
              color: "from-pink-500 to-rose-500",
            },
            {
              key: "recipes",
              label: "Recipe Discovery",
              icon: ChefHat,
              color: "from-purple-500 to-indigo-500",
            },
            {
              key: "batch",
              label: "Batch Cooking",
              icon: Clock,
              color: "from-blue-500 to-cyan-500",
            },
            {
              key: "tracker",
              label: "Nutrition Track",
              icon: Target,
              color: "from-green-500 to-emerald-500",
            },
          ].map(({ key, label, icon: Icon, color }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(key as "grocery" | "recipes" | "batch" | "tracker")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === key
                  ? `bg-gradient-to-r ${color} text-white shadow-lg transform`
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon size={22} />
              <span className="font-medium">{label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Grocery Tab */}
          {activeTab === "grocery" && (
            <motion.div
              key="grocery"
              variants={tabVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Add New Item */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-pink-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl">
                      <Plus className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Add Item
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="e.g., Rice, Tomatoes, Milk"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500"
                      onKeyPress={(e) => e.key === "Enter" && addGroceryItem()}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                        className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500"
                      />
                      <select
                        value={newItem.unit}
                        onChange={(e) =>
                          setNewItem({ ...newItem, unit: e.target.value })
                        }
                        className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="kg">Kg</option>
                        <option value="pieces">Pieces</option>
                        <option value="liters">Liters</option>
                        <option value="grams">Grams</option>
                        <option value="dozen">Dozen</option>
                      </select>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={addGroceryItem}
                      disabled={isPriceLoading || !userLocation}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isPriceLoading ? "Fetching Price..." : "Add to List"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Budget Control */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-green-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                        <DollarSign className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Budget Control
                      </h3>
                    </div>
                    <button
                      onClick={refreshPrices}
                      disabled={isPriceLoading}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                    >
                      <RefreshCw
                        className={isPriceLoading ? "animate-spin" : ""}
                        size={18}
                      />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Budget: ₹{budget.toLocaleString("en-IN")}
                      </label>
                      <input
                        type="range"
                        min="2000"
                        max="20000"
                        step="500"
                        value={budget}
                        onChange={(e) => setBudget(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <div className="flex justify-between mb-2">
                        <span>Total: ₹{totalCost.toLocaleString("en-IN")}</span>
                        <span className={budgetStatus.color}>
                          ₹
                          {Math.max(0, budget - totalCost).toLocaleString(
                            "en-IN"
                          )}{" "}
                          left
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${budgetStatus.bgColor}`}
                          style={{
                            width: `${Math.min(
                              (totalCost / budget) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Market Insights */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Market Insights
                    </h3>
                  </div>

                  {marketInsights ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-2xl">
                        <h4 className="font-medium text-purple-900">
                          Price Level: {marketInsights.averagePriceLevel}
                        </h4>
                        <p className="text-sm text-purple-700">
                          {marketInsights.priceAlert}
                        </p>
                      </div>

                      {marketInsights.bestDeals.length > 0 && (
                        <div className="p-4 bg-green-50 rounded-2xl">
                          <h4 className="font-medium text-green-900">
                            Best Deals
                          </h4>
                          {marketInsights.bestDeals
                            .slice(0, 2)
                            .map((deal, index) => (
                              <p key={index} className="text-sm text-green-700">
                                {deal.item}: ₹{deal.price} at {deal.store}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Grocery List */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Your Grocery List
                  </h3>
                  <button
                    onClick={() => setShowPriceComparison(!showPriceComparison)}
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
                  >
                    {showPriceComparison ? "Hide" : "Show"} Price Comparison
                  </button>
                </div>

                <div className="space-y-4">
                  {groceryList.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group border-2 border-gray-200 rounded-2xl hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-center p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              item.category === "Vegetables"
                                ? "bg-green-400"
                                : item.category === "Fruits"
                                ? "bg-orange-400"
                                : item.category === "Dairy"
                                ? "bg-blue-400"
                                : "bg-gray-400"
                            }`}
                          />
                          <div>
                            <h4 className="font-semibold text-lg">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>
                                {item.quantity} {item.unit}
                              </span>
                              <span>•</span>
                              <span className="font-medium">
                                ₹{item.estimatedPrice}
                              </span>
                              <span>•</span>
                              <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeGroceryItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {showPriceComparison && item.priceComparison && (
                        <div className="border-t p-4 bg-gray-50">
                          <h5 className="font-medium text-sm mb-2">
                            Price Comparison:
                          </h5>
                          <div className="grid md:grid-cols-3 gap-2">
                            {item.priceComparison.prices
                              .slice(0, 3)
                              .map((price, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs p-2 bg-white rounded border"
                                >
                                  <div className="font-medium">
                                    {price.source}
                                  </div>
                                  <div>
                                    ₹{price.price}/{price.unit}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {groceryList.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart
                        className="mx-auto text-gray-300 mb-4"
                        size={48}
                      />
                      <p className="text-gray-600">
                        Your list is empty. Add items to see live pricing!
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Recipe Tab */}
          {activeTab === "recipes" && (
            <motion.div
              key="recipes"
              variants={tabVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
              className="space-y-8"
            >
              {/* Search Interface */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl">
                    <Search className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Recipe Discovery
                  </h3>
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="e.g., low-carb, high-protein, gluten-free"
                    value={healthRequirements}
                    onChange={(e) => setHealthRequirements(e.target.value)}
                    className="flex-1 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => e.key === "Enter" && searchRecipes()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={searchRecipes}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-medium hover:shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? "Searching..." : "Find Recipes"}
                  </motion.button>
                </div>
              </motion.div>

              {/* Recipe Results */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl cursor-pointer"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold leading-tight">
                        {recipe.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star
                          className="text-yellow-500 fill-current"
                          size={16}
                        />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-purple-500" />
                        <span>{recipe.cookTime} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Utensils size={16} className="text-blue-500" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={16} className="text-green-500" />
                        <span>{recipe.calories} cal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-orange-500" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.healthTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-2xl text-sm font-medium hover:shadow-lg">
                      View Full Recipe
                    </button>
                  </motion.div>
                ))}
              </div>

              {recipes.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <ChefHat className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-600">
                    Search for recipes by health requirements above!
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Batch Cooking Tab */}
          {activeTab === "batch" && (
            <motion.div
              key="batch"
              variants={tabVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
              className="space-y-8"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                    <Clock className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Batch Cooking Planner
                  </h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Batch Suggestions */}
                  <div>
                    <h4 className="text-xl font-semibold mb-4">
                      This Week&apos;s Suggestions
                    </h4>
                    <div className="space-y-4">
                      {batchSuggestions.slice(0, 3).map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="p-4 bg-blue-50 rounded-2xl border border-blue-200"
                        >
                          <h5 className="font-bold text-lg">
                            {suggestion.name}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {suggestion.prepTime} mins • {suggestion.servings}{" "}
                            servings • {suggestion.difficulty}
                          </p>
                          <p className="text-sm text-blue-700">
                            ₹{suggestion.costPerServing * suggestion.servings}{" "}
                            total cost
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Storage Guidelines */}
                  <div>
                    <h4 className="text-xl font-semibold mb-4">
                      Storage Guidelines
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          type: "Cooked Dal",
                          time: "5 days refrigerated",
                          color: "bg-green-50 text-green-800",
                        },
                        {
                          type: "Chicken Curry",
                          time: "4 days refrigerated",
                          color: "bg-orange-50 text-orange-800",
                        },
                        {
                          type: "Cooked Rice",
                          time: "4 days refrigerated",
                          color: "bg-blue-50 text-blue-800",
                        },
                        {
                          type: "Smoothie Packs",
                          time: "3 months frozen",
                          color: "bg-purple-50 text-purple-800",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-2xl ${item.color}`}
                        >
                          <h6 className="font-semibold">{item.type}</h6>
                          <p className="text-sm">{item.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Nutrition Tracker Tab */}
          {activeTab === "tracker" && (
            <motion.div
              key="tracker"
              variants={tabVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
              className="space-y-8"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                    <Target className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Nutrition Tracker
                  </h3>
                </div>

                {/* Calorie Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-green-50 rounded-2xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {todaysCalories}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Calories Consumed
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (todaysCalories / userProfile.dailyCalorieGoal) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {userProfile.dailyCalorieGoal}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Daily Goal</div>
                    <Target className="mx-auto text-blue-500" size={24} />
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-2xl">
                    <div
                      className={`text-3xl font-bold mb-2 ${
                        userProfile.dailyCalorieGoal - todaysCalories >= 0
                          ? "text-purple-600"
                          : "text-red-600"
                      }`}
                    >
                      {Math.abs(userProfile.dailyCalorieGoal - todaysCalories)}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {userProfile.dailyCalorieGoal - todaysCalories >= 0
                        ? "Remaining"
                        : "Over Goal"}
                    </div>
                    {userProfile.dailyCalorieGoal - todaysCalories >= 0 ? (
                      <CheckCircle
                        className="mx-auto text-green-500"
                        size={24}
                      />
                    ) : (
                      <AlertCircle className="mx-auto text-red-500" size={24} />
                    )}
                  </div>
                </div>

                {/* Add Meal Entry */}
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                  <h4 className="font-semibold mb-3">Add Meal Entry</h4>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Recipe name (e.g., Dal Rice)"
                      value={newMealEntry.recipeName}
                      onChange={(e) =>
                        setNewMealEntry({
                          ...newMealEntry,
                          recipeName: e.target.value,
                        })
                      }
                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                    <select
                      value={newMealEntry.mealType}
                      onChange={(e) =>
                        setNewMealEntry({
                          ...newMealEntry,
                          mealType: e.target.value as "breakfast" | "lunch" | "dinner" | "snack",
                        })
                      }
                      className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                    <button
                      onClick={addMealEntry}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Today's Meals */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">Today&apos;s Meals</h4>
                  <div className="space-y-3">
                    {mealEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-purple-600 capitalize">
                              {entry.mealType}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="font-medium">{entry.recipeName}</p>
                          <p className="text-sm text-gray-600">
                            {entry.calories} cal • {entry.nutrition.protein}g
                            protein
                          </p>
                        </div>
                        <button
                          onClick={() => removeMealEntry(entry.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {mealEntries.length === 0 && (
                      <div className="text-center py-8 text-gray-600">
                        <Target className="mx-auto mb-2" size={32} />
                        <p>No meals logged today. Add your first meal above!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Macro Breakdown */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Protein",
                      value: todaysNutrition.protein,
                      goal: 120,
                      unit: "g",
                      color: "from-red-500 to-pink-500",
                    },
                    {
                      label: "Carbs",
                      value: todaysNutrition.carbs,
                      goal: 200,
                      unit: "g",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      label: "Fat",
                      value: todaysNutrition.fat,
                      goal: 60,
                      unit: "g",
                      color: "from-yellow-500 to-orange-500",
                    },
                    {
                      label: "Fiber",
                      value: todaysNutrition.fiber,
                      goal: 25,
                      unit: "g",
                      color: "from-green-500 to-emerald-500",
                    },
                  ].map((macro, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-2xl border shadow-sm"
                    >
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold bg-gradient-to-r ${macro.color} bg-clip-text text-transparent`}
                        >
                          {macro.value}
                          {macro.unit}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {macro.label}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${macro.color} h-2 rounded-full transition-all duration-500`}
                            style={{
                              width: `${Math.min(
                                (macro.value / macro.goal) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Goal: {macro.goal}
                          {macro.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe Detail Modal */}
        <AnimatePresence>
          {selectedRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedRecipe(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {selectedRecipe.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {selectedRecipe.cookTime} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Utensils size={16} />
                        {selectedRecipe.servings} servings
                      </span>
                      <span className="flex items-center gap-1">
                        <Target size={16} />
                        {selectedRecipe.calories} cal
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Health Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.healthTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <CheckCircle size={16} className="text-green-500" />
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedRecipe.instructions && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">
                        Instructions
                      </h3>
                      <ol className="space-y-3">
                        {selectedRecipe.instructions.map((step, index) => (
                          <li
                            key={index}
                            className="flex gap-4 p-4 bg-blue-50 rounded-xl"
                          >
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Add to meal tracker
                        const entry = NutritionTrackerService.addMealEntry(
                          selectedRecipe.name,
                          "lunch",
                          1,
                          selectedRecipe.nutrition
                        );
                        setMealEntries([entry, ...mealEntries]);
                        setSelectedRecipe(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-2xl font-medium"
                    >
                      Add to Meal Tracker
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-2xl font-medium"
                    >
                      Save Recipe
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MealPlanningMain;