// services/NutritionTrackerService.ts
import { MealEntry, NutritionInfo, UserProfile, Recipe } from '@/types';

export class NutritionTrackerService {
  private static mealEntries: MealEntry[] = [];
  private static readonly NUTRITION_DATABASE: Record<string, NutritionInfo> = {
    // Common Indian foods nutrition per 100g
    'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    'dal': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
    'roti': { calories: 297, protein: 11, carbs: 61, fat: 3.7, fiber: 11 },
    'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    'paneer': { calories: 265, protein: 18, carbs: 4, fat: 20, fiber: 0 },
    'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
    'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
    'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
    'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
    'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    'oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 }
  };

  /**
   * Calculate BMR using Mifflin-St Jeor Equation
   */
  static calculateBMR(userProfile: UserProfile): number {
    const { weight, height, age, gender } = userProfile;
    
    // Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    
    return Math.round(bmr);
  }

  /**
   * Calculate daily calorie needs based on activity level
   */
  static calculateDailyCalorieNeeds(userProfile: UserProfile): number {
    const bmr = this.calculateBMR(userProfile);
    
    const activityMultipliers = {
      'sedentary': 1.2,        // Little/no exercise
      'light': 1.375,          // Light exercise/sports 1-3 days/week  
      'moderate': 1.55,        // Moderate exercise/sports 3-5 days/week
      'active': 1.725,         // Hard exercise/sports 6-7 days a week
      'very-active': 1.9       // Very hard exercise/sports, physical job
    };
    
    const multiplier = activityMultipliers[userProfile.activityLevel] || 1.55;
    return Math.round(bmr * multiplier);
  }

  /**
   * Calculate macronutrient targets based on profile and goals
   */
  static calculateMacroTargets(userProfile: UserProfile): {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
    fiber: { grams: number };
  } {
    const dailyCalories = userProfile.dailyCalorieGoal || this.calculateDailyCalorieNeeds(userProfile);
    
    // Default macro ratios (can be customized based on health goals)
    let proteinPercent = 0.25;  // 25% protein
    let carbsPercent = 0.45;    // 45% carbs
    let fatPercent = 0.30;      // 30% fat
    
    // Adjust for health goals
    if (userProfile.healthGoals?.includes('weight-loss')) {
      proteinPercent = 0.30;
      carbsPercent = 0.35;
      fatPercent = 0.35;
    } else if (userProfile.healthGoals?.includes('muscle-gain')) {
      proteinPercent = 0.35;
      carbsPercent = 0.40;
      fatPercent = 0.25;
    }
    
    // Calculate grams (protein = 4 cal/g, carbs = 4 cal/g, fat = 9 cal/g)
    const proteinCalories = dailyCalories * proteinPercent;
    const carbsCalories = dailyCalories * carbsPercent;
    const fatCalories = dailyCalories * fatPercent;
    
    const proteinGrams = Math.round(proteinCalories / 4);
    const carbsGrams = Math.round(carbsCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);
    
    // Fiber target: 14g per 1000 calories
    const fiberGrams = Math.round((dailyCalories / 1000) * 14);
    
    return {
      protein: {
        grams: proteinGrams,
        calories: proteinCalories,
        percentage: Math.round(proteinPercent * 100)
      },
      carbs: {
        grams: carbsGrams,
        calories: carbsCalories,
        percentage: Math.round(carbsPercent * 100)
      },
      fat: {
        grams: fatGrams,
        calories: fatCalories,
        percentage: Math.round(fatPercent * 100)
      },
      fiber: {
        grams: fiberGrams
      }
    };
  }

  /**
   * Add meal entry to tracker
   */
  static addMealEntry(
    recipeName: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    servings: number = 1,
    customNutrition?: NutritionInfo
  ): MealEntry {
    const nutrition = customNutrition || this.estimateNutritionFromName(recipeName);
    
    // Adjust nutrition for servings
    const adjustedNutrition: NutritionInfo = {
      calories: Math.round(nutrition.calories * servings),
      protein: Math.round(nutrition.protein * servings * 10) / 10,
      carbs: Math.round(nutrition.carbs * servings * 10) / 10,
      fat: Math.round(nutrition.fat * servings * 10) / 10,
      fiber: Math.round(nutrition.fiber * servings * 10) / 10
    };

    const mealEntry: MealEntry = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      mealType,
      recipeName,
      calories: adjustedNutrition.calories,
      nutrition: adjustedNutrition,
      timestamp: Date.now()
    };

    this.mealEntries.unshift(mealEntry); // Add to beginning
    
    // Keep only last 30 days of entries
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.mealEntries = this.mealEntries.filter(entry => entry.timestamp > thirtyDaysAgo);
    
    return mealEntry;
  }

  /**
   * Get meal entries for a specific date
   */
  static getMealEntriesForDate(date: string): MealEntry[] {
    return this.mealEntries.filter(entry => entry.date === date);
  }

  /**
   * Get nutrition totals for a specific date
   */
  static getDailyNutritionTotals(date: string): NutritionInfo {
    const dayEntries = this.getMealEntriesForDate(date);
    
    return dayEntries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.nutrition.calories,
        protein: Math.round((totals.protein + entry.nutrition.protein) * 10) / 10,
        carbs: Math.round((totals.carbs + entry.nutrition.carbs) * 10) / 10,
        fat: Math.round((totals.fat + entry.nutrition.fat) * 10) / 10,
        fiber: Math.round((totals.fiber + entry.nutrition.fiber) * 10) / 10
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }

  /**
   * Get weekly nutrition summary
   */
  static getWeeklyNutritionSummary(endDate?: string): {
    averageDaily: NutritionInfo;
    totalWeek: NutritionInfo;
    dailyBreakdown: { date: string; nutrition: NutritionInfo }[];
  } {
    const end = endDate ? new Date(endDate) : new Date();
    const dates: string[] = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(end);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const dailyBreakdown = dates.map(date => ({
      date,
      nutrition: this.getDailyNutritionTotals(date)
    }));

    const totalWeek = dailyBreakdown.reduce(
      (total, day) => ({
        calories: total.calories + day.nutrition.calories,
        protein: total.protein + day.nutrition.protein,
        carbs: total.carbs + day.nutrition.carbs,
        fat: total.fat + day.nutrition.fat,
        fiber: total.fiber + day.nutrition.fiber
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    const averageDaily: NutritionInfo = {
      calories: Math.round(totalWeek.calories / 7),
      protein: Math.round(totalWeek.protein / 7 * 10) / 10,
      carbs: Math.round(totalWeek.carbs / 7 * 10) / 10,
      fat: Math.round(totalWeek.fat / 7 * 10) / 10,
      fiber: Math.round(totalWeek.fiber / 7 * 10) / 10
    };

    return {
      averageDaily,
      totalWeek,
      dailyBreakdown
    };
  }

  /**
   * Estimate nutrition from food name using database
   */
  private static estimateNutritionFromName(foodName: string): NutritionInfo {
    const lowerName = foodName.toLowerCase();
    
    // Try direct match first
    for (const [food, nutrition] of Object.entries(this.NUTRITION_DATABASE)) {
      if (lowerName.includes(food)) {
        return { ...nutrition };
      }
    }

    // Try ingredient-based estimation
    let estimatedNutrition: NutritionInfo = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    let matchCount = 0;

    // Look for multiple ingredients
    for (const [food, nutrition] of Object.entries(this.NUTRITION_DATABASE)) {
      if (lowerName.includes(food)) {
        estimatedNutrition.calories += nutrition.calories * 0.3; // Rough portion
        estimatedNutrition.protein += nutrition.protein * 0.3;
        estimatedNutrition.carbs += nutrition.carbs * 0.3;
        estimatedNutrition.fat += nutrition.fat * 0.3;
        estimatedNutrition.fiber += nutrition.fiber * 0.3;
        matchCount++;
      }
    }

    if (matchCount > 0) {
      return {
        calories: Math.round(estimatedNutrition.calories),
        protein: Math.round(estimatedNutrition.protein * 10) / 10,
        carbs: Math.round(estimatedNutrition.carbs * 10) / 10,
        fat: Math.round(estimatedNutrition.fat * 10) / 10,
        fiber: Math.round(estimatedNutrition.fiber * 10) / 10
      };
    }

    // Fallback estimation based on food type
    return this.getFallbackNutrition(lowerName);
  }

  /**
   * Fallback nutrition estimation
   */
  private static getFallbackNutrition(foodName: string): NutritionInfo {
    // Categorize food and provide reasonable estimates
    if (foodName.includes('salad') || foodName.includes('vegetable')) {
      return { calories: 150, protein: 5, carbs: 25, fat: 3, fiber: 8 };
    } else if (foodName.includes('curry') || foodName.includes('dal')) {
      return { calories: 200, protein: 12, carbs: 25, fat: 6, fiber: 6 };
    } else if (foodName.includes('chicken') || foodName.includes('meat')) {
      return { calories: 250, protein: 25, carbs: 10, fat: 12, fiber: 2 };
    } else if (foodName.includes('rice') || foodName.includes('grain')) {
      return { calories: 180, protein: 4, carbs: 35, fat: 1, fiber: 2 };
    } else if (foodName.includes('smoothie') || foodName.includes('juice')) {
      return { calories: 120, protein: 3, carbs: 28, fat: 1, fiber: 4 };
    }
    
    // Default balanced meal
    return { calories: 300, protein: 15, carbs: 35, fat: 10, fiber: 5 };
  }

  /**
   * Analyze nutrition trends over time
   */
  static getNutritionTrends(days: number = 14): {
    caloriesTrend: number[];
    proteinTrend: number[];
    averageCalories: number;
    averageProtein: number;
    consistency: 'Good' | 'Moderate' | 'Needs Improvement';
  } {
    const endDate = new Date();
    const dates: string[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const caloriesTrend = dates.map(date => this.getDailyNutritionTotals(date).calories);
    const proteinTrend = dates.map(date => this.getDailyNutritionTotals(date).protein);
    
    const averageCalories = caloriesTrend.reduce((a, b) => a + b, 0) / caloriesTrend.length;
    const averageProtein = proteinTrend.reduce((a, b) => a + b, 0) / proteinTrend.length;
    
    // Calculate consistency based on standard deviation
    const caloriesStdDev = this.calculateStandardDeviation(caloriesTrend);
    const consistencyRatio = caloriesStdDev / averageCalories;
    
    let consistency: 'Good' | 'Moderate' | 'Needs Improvement';
    if (consistencyRatio < 0.2) {
      consistency = 'Good';
    } else if (consistencyRatio < 0.4) {
      consistency = 'Moderate';
    } else {
      consistency = 'Needs Improvement';
    }

    return {
      caloriesTrend,
      proteinTrend,
      averageCalories: Math.round(averageCalories),
      averageProtein: Math.round(averageProtein * 10) / 10,
      consistency
    };
  }

  /**
   * Get personalized nutrition recommendations
   */
  static getNutritionRecommendations(userProfile: UserProfile): {
    category: string;
    recommendations: string[];
    priority: 'High' | 'Medium' | 'Low';
  }[] {
    const recommendations: {
      category: string;
      recommendations: string[];
      priority: 'High' | 'Medium' | 'Low';
    }[] = [];
    const currentDate = new Date().toISOString().split('T')[0];
    const dailyTotals = this.getDailyNutritionTotals(currentDate);
    const targets = this.calculateMacroTargets(userProfile);

    // Calorie recommendations
    const calorieDeficit = userProfile.dailyCalorieGoal - dailyTotals.calories;
    if (Math.abs(calorieDeficit) > 200) {
      recommendations.push({
        category: 'Calorie Balance',
        recommendations: calorieDeficit > 0 
          ? [`Add ${calorieDeficit} more calories to meet your daily goal`, 'Consider healthy snacks like nuts or fruits']
          : [`You're ${Math.abs(calorieDeficit)} calories over your goal`, 'Focus on portion control for remaining meals'],
        priority: 'High'
      });
    }

    // Protein recommendations
    const proteinDeficit = targets.protein.grams - dailyTotals.protein;
    if (proteinDeficit > 10) {
      recommendations.push({
        category: 'Protein Intake',
        recommendations: [
          `Increase protein by ${Math.round(proteinDeficit)}g`,
          'Add protein-rich foods like dal, paneer, or chicken',
          'Consider having a protein-rich snack'
        ],
        priority: 'High'
      });
    }

    // Fiber recommendations
    const fiberDeficit = targets.fiber.grams - dailyTotals.fiber;
    if (fiberDeficit > 5) {
      recommendations.push({
        category: 'Fiber Intake',
        recommendations: [
          `Increase fiber by ${Math.round(fiberDeficit)}g`,
          'Add more vegetables and whole grains',
          'Include fruits with skin when possible'
        ],
        priority: 'Medium'
      });
    }

    // Hydration (general recommendation)
    recommendations.push({
      category: 'Hydration',
      recommendations: [
        'Drink 8-10 glasses of water daily',
        'Include herbal teas and coconut water',
        'Monitor urine color for hydration status'
      ],
      priority: 'Medium'
    });

    // Activity-specific recommendations
    if (userProfile.activityLevel === 'sedentary') {
      recommendations.push({
        category: 'Activity Level',
        recommendations: [
          'Add 30 minutes of light exercise daily',
          'Take walking breaks every 2 hours',
          'Consider yoga or stretching routines'
        ],
        priority: 'Medium'
      });
    }

    return recommendations;
  }

  /**
   * Suggest next meal based on remaining daily targets
   */
  static suggestNextMeal(
    userProfile: UserProfile,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): {
    suggestedRecipes: string[];
    targetCalories: number;
    targetProtein: number;
    reasoning: string;
  } {
    const currentDate = new Date().toISOString().split('T')[0];
    const dailyTotals = this.getDailyNutritionTotals(currentDate);
    const targets = this.calculateMacroTargets(userProfile);

    const remainingCalories = userProfile.dailyCalorieGoal - dailyTotals.calories;
    const remainingProtein = targets.protein.grams - dailyTotals.protein;

    // Estimate calories for this meal type
    const mealCalorieRatios = {
      'breakfast': 0.25,
      'lunch': 0.35,
      'dinner': 0.30,
      'snack': 0.10
    };

    let targetCalories = Math.max(remainingCalories * mealCalorieRatios[mealType], 100);
    let targetProtein = Math.max(remainingProtein * mealCalorieRatios[mealType], 5);

    // Adjust if too much remaining
    if (remainingCalories > userProfile.dailyCalorieGoal * 0.7) {
      targetCalories = userProfile.dailyCalorieGoal * mealCalorieRatios[mealType];
      targetProtein = targets.protein.grams * mealCalorieRatios[mealType];
    }

    // Meal suggestions based on targets
    const suggestedRecipes = this.getRecipeSuggestionsByTargets(
      targetCalories,
      targetProtein,
      mealType,
      userProfile.dietaryRestrictions
    );

    const reasoning = `Based on your remaining daily targets: ${Math.round(remainingCalories)} calories and ${Math.round(remainingProtein)}g protein needed.`;

    return {
      suggestedRecipes,
      targetCalories: Math.round(targetCalories),
      targetProtein: Math.round(targetProtein),
      reasoning
    };
  }

  /**
   * Get recipe suggestions based on nutritional targets
   */
  private static getRecipeSuggestionsByTargets(
    targetCalories: number,
    targetProtein: number,
    mealType: string,
    dietaryRestrictions: string[] = []
  ): string[] {
    const mealSuggestions: Record<string, string[]> = {
      'breakfast': [
        'Vegetable Omelette with Toast',
        'Moong Dal Cheela',
        'Oats Upma with Vegetables',
        'Paneer Paratha',
        'Smoothie Bowl with Nuts'
      ],
      'lunch': [
        'Dal Rice with Vegetables',
        'Chicken Curry with Roti',
        'Quinoa Vegetable Bowl',
        'Rajma Rice',
        'Mixed Vegetable Curry'
      ],
      'dinner': [
        'Grilled Fish with Salad',
        'Palak Paneer with Roti',
        'Chicken Tikka with Vegetables',
        'Lentil Soup with Bread',
        'Vegetable Stir-fry'
      ],
      'snack': [
        'Roasted Chickpeas',
        'Fruit with Yogurt',
        'Nuts and Seeds Mix',
        'Vegetable Sandwich',
        'Protein Smoothie'
      ]
    };

    let suggestions = mealSuggestions[mealType] || mealSuggestions['lunch'];

    // Filter based on dietary restrictions
    if (dietaryRestrictions.includes('vegetarian')) {
      suggestions = suggestions.filter(meal => 
        !meal.toLowerCase().includes('chicken') && 
        !meal.toLowerCase().includes('fish')
      );
    }

    if (dietaryRestrictions.includes('vegan')) {
      suggestions = suggestions.filter(meal => 
        !meal.toLowerCase().includes('paneer') && 
        !meal.toLowerCase().includes('yogurt') &&
        !meal.toLowerCase().includes('omelette')
      );
    }

    // Prioritize high-protein options if protein target is high
    if (targetProtein > 20) {
      suggestions = suggestions.filter(meal =>
        meal.toLowerCase().includes('dal') ||
        meal.toLowerCase().includes('paneer') ||
        meal.toLowerCase().includes('chicken') ||
        meal.toLowerCase().includes('protein')
      );
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Calculate standard deviation for consistency analysis
   */
  private static calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Get nutrition insights and achievements
   */
  static getNutritionInsights(userProfile: UserProfile): {
    achievements: { title: string; description: string; icon: string }[];
    streaks: { name: string; count: number; target: number }[];
    improvements: string[];
  } {
    const weeklyData = this.getWeeklyNutritionSummary();
    const trends = this.getNutritionTrends(7);
    
    const achievements = [];
    const streaks = [];
    const improvements = [];

    // Check achievements
    if (trends.consistency === 'Good') {
      achievements.push({
        title: 'Consistency Champion',
        description: 'Maintained consistent daily nutrition for a week',
        icon: '🏆'
      });
    }

    if (trends.averageProtein >= this.calculateMacroTargets(userProfile).protein.grams * 0.9) {
      achievements.push({
        title: 'Protein Power',
        description: 'Meeting protein targets regularly',
        icon: '💪'
      });
    }

    // Calculate streaks (simplified)
    const proteinTarget = this.calculateMacroTargets(userProfile).protein.grams;
    let proteinStreak = 0;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayTotal = this.getDailyNutritionTotals(dateStr);
      
      if (dayTotal.protein >= proteinTarget * 0.8) {
        proteinStreak++;
      } else {
        break;
      }
    }

    streaks.push({
      name: 'Protein Goals',
      count: proteinStreak,
      target: 7
    });

    // Generate improvements
    if (trends.averageProtein < proteinTarget * 0.8) {
      improvements.push('Focus on adding more protein-rich foods to each meal');
    }

    if (weeklyData.averageDaily.fiber < 25) {
      improvements.push('Increase fiber intake with more vegetables and whole grains');
    }

    if (trends.consistency === 'Needs Improvement') {
      improvements.push('Try to maintain more consistent eating patterns');
    }

    return {
      achievements,
      streaks,
      improvements
    };
  }

  /**
   * Get hydration tracking (simplified implementation)
   */
  static getHydrationTracking(): {
    dailyGoal: number;
    current: number;
    percentage: number;
    reminders: string[];
  } {
    // This would be connected to a real hydration tracking system
    const dailyGoal = 8; // 8 glasses
    const current = Math.floor(Math.random() * 8); // Mock current intake
    
    return {
      dailyGoal,
      current,
      percentage: Math.round((current / dailyGoal) * 100),
      reminders: [
        'Drink a glass of water when you wake up',
        'Have water with each meal',
        'Keep a water bottle at your workspace',
        'Set hourly hydration reminders'
      ]
    };
  }

  /**
   * Export nutrition data for analysis
   */
  static exportNutritionData(startDate: string, endDate: string): {
    summary: {
      totalEntries: number;
      averageCalories: number;
      averageProtein: number;
      dateRange: string;
    };
    entries: MealEntry[];
  } {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredEntries = this.mealEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });

    const averageCalories = filteredEntries.reduce((sum, entry) => sum + entry.calories, 0) / filteredEntries.length || 0;
    const averageProtein = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.protein, 0) / filteredEntries.length || 0;

    return {
      summary: {
        totalEntries: filteredEntries.length,
        averageCalories: Math.round(averageCalories),
        averageProtein: Math.round(averageProtein * 10) / 10,
        dateRange: `${startDate} to ${endDate}`
      },
      entries: filteredEntries
    };
  }

  /**
   * Initialize with sample data for demo
   */
  static initializeSampleData(): void {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Add sample entries for today
    this.addMealEntry('Oats Upma with Vegetables', 'breakfast', 1);
    this.addMealEntry('Dal Rice with Curry', 'lunch', 1);
    this.addMealEntry('Mixed Fruit Salad', 'snack', 0.5);

    // Add sample entries for yesterday
    this.mealEntries.push(
      {
        id: 'sample-1',
        date: yesterday,
        mealType: 'breakfast',
        recipeName: 'Vegetable Omelette',
        calories: 280,
        nutrition: { calories: 280, protein: 18, carbs: 8, fat: 20, fiber: 3 },
        timestamp: Date.now() - 24 * 60 * 60 * 1000
      },
      {
        id: 'sample-2',
        date: yesterday,
        mealType: 'lunch',
        recipeName: 'Chicken Curry with Rice',
        calories: 450,
        nutrition: { calories: 450, protein: 25, carbs: 55, fat: 12, fiber: 4 },
        timestamp: Date.now() - 20 * 60 * 60 * 1000
      }
    );
  }

  /**
   * Clear all meal entries (useful for testing)
   */
  static clearAllEntries(): void {
    this.mealEntries = [];
  }

  /**
   * Remove specific meal entry
   */
  static removeMealEntry(id: string): boolean {
    const initialLength = this.mealEntries.length;
    this.mealEntries = this.mealEntries.filter(entry => entry.id !== id);
    return this.mealEntries.length < initialLength;
  }
}