// services/BatchCookingService.ts
import { BatchCookingSuggestion, NutritionInfo, UserProfile } from '@/types';

export class BatchCookingService {
  private static readonly BATCH_COOKING_DATABASE: BatchCookingSuggestion[] = [
    {
      id: '1',
      name: 'Weekly Dal Batch',
      prepTime: 45,
      servings: 12,
      storageTime: '5 days refrigerated',
      difficulty: 'Easy',
      ingredients: [
        '2 cups mixed dal (moong, masoor, toor)',
        '1 large onion, chopped',
        '3 tomatoes, chopped',
        '1 tsp each: turmeric, cumin, coriander powder',
        '2 tbsp oil',
        'Salt to taste',
        'Curry leaves and mustard seeds for tempering'
      ],
      instructions: [
        'Wash and soak dal mixture for 30 minutes',
        'Pressure cook dal with turmeric and salt (3-4 whistles)',
        'Heat oil, add mustard seeds and curry leaves',
        'Add onions, cook until golden brown',
        'Add tomatoes and spices, cook until soft',
        'Mix cooked dal with tempering',
        'Simmer for 10 minutes, adjust consistency',
        'Cool completely before storing in portions'
      ],
      category: 'Indian Staples',
      nutritionPerServing: {
        calories: 180,
        protein: 12,
        carbs: 28,
        fat: 4,
        fiber: 8
      },
      costPerServing: 15
    },
    {
      id: '2',
      name: 'Chicken Meal Prep Batch',
      prepTime: 60,
      servings: 8,
      storageTime: '4 days refrigerated, 3 months frozen',
      difficulty: 'Medium',
      ingredients: [
        '1.5 kg chicken (mixed pieces)',
        '4 cups mixed vegetables (beans, carrots, potatoes)',
        '2 large onions',
        '4 tomatoes',
        '2 tbsp ginger-garlic paste',
        'Spice mix: red chili, turmeric, garam masala',
        '3 tbsp cooking oil'
      ],
      instructions: [
        'Clean and cut chicken into medium pieces',
        'Marinate with half the spice mix for 30 minutes',
        'Heat oil in large heavy-bottom pot',
        'Cook chicken pieces until 70% done, set aside',
        'In same pot, sauté onions until golden',
        'Add ginger-garlic paste, cook for 2 minutes',
        'Add tomatoes and remaining spices',
        'Return chicken to pot, add vegetables',
        'Cover and cook on low heat for 25 minutes',
        'Cool and portion into meal containers'
      ],
      category: 'Protein Meals',
      nutritionPerServing: {
        calories: 320,
        protein: 28,
        carbs: 15,
        fat: 18,
        fiber: 4
      },
      costPerServing: 45
    },
    {
      id: '3',
      name: 'Overnight Oats Batch',
      prepTime: 20,
      servings: 7,
      storageTime: '1 week refrigerated',
      difficulty: 'Easy',
      ingredients: [
        '3.5 cups rolled oats',
        '3.5 cups milk (dairy or plant-based)',
        '7 tbsp chia seeds',
        '7 tbsp honey or maple syrup',
        '2 tsp vanilla extract',
        'Mixed fruits for topping',
        '7 mason jars or containers'
      ],
      instructions: [
        'In each jar, add 1/2 cup oats',
        'Add 1/2 cup milk to each jar',
        'Add 1 tbsp chia seeds per jar',
        'Add 1 tbsp sweetener per jar',
        'Add few drops of vanilla to each',
        'Stir well and seal jars',
        'Refrigerate overnight',
        'Add fresh fruits before serving each morning'
      ],
      category: 'Breakfast',
      nutritionPerServing: {
        calories: 280,
        protein: 12,
        carbs: 45,
        fat: 8,
        fiber: 10
      },
      costPerServing: 25
    },
    {
      id: '4',
      name: 'Vegetable Curry Base',
      prepTime: 40,
      servings: 10,
      storageTime: '1 week refrigerated, 6 months frozen',
      difficulty: 'Easy',
      ingredients: [
        '6 large onions, sliced',
        '8 tomatoes, chopped',
        '4 tbsp ginger-garlic paste',
        '2 tbsp each: cumin powder, coriander powder',
        '1 tbsp each: turmeric, red chili powder',
        '1 tbsp garam masala',
        '1/2 cup cooking oil',
        'Salt to taste'
      ],
      instructions: [
        'Heat oil in large heavy-bottom pan',
        'Add sliced onions, cook until deep golden brown',
        'Add ginger-garlic paste, cook for 3 minutes',
        'Add all dry spices, cook for 1 minute',
        'Add chopped tomatoes, cook until completely soft',
        'Cook on medium heat until oil separates (15-20 minutes)',
        'Cool completely and store in portions',
        'Use as base for any vegetable curry by adding vegetables and water'
      ],
      category: 'Curry Base',
      nutritionPerServing: {
        calories: 120,
        protein: 3,
        carbs: 12,
        fat: 8,
        fiber: 3
      },
      costPerServing: 12
    },
    {
      id: '5',
      name: 'Freezer Smoothie Packs',
      prepTime: 30,
      servings: 14,
      storageTime: '3 months frozen',
      difficulty: 'Easy',
      ingredients: [
        '4 bananas, sliced',
        '2 cups mixed berries',
        '2 cups spinach leaves',
        '1 cup mango chunks',
        '14 freezer bags',
        'Optional: protein powder portions'
      ],
      instructions: [
        'Wash and prepare all fruits and vegetables',
        'Create different combinations in freezer bags:',
        '- Banana + Berry combo (5 packs)',
        '- Mango + Spinach combo (4 packs)', 
        '- Mixed fruit combo (5 packs)',
        'Add 1 portion fruit mix per bag',
        'Add handful of spinach to each bag',
        'Seal bags removing excess air',
        'Label with date and ingredients',
        'To use: Add liquid + 1 frozen pack + blend'
      ],
      category: 'Smoothies',
      nutritionPerServing: {
        calories: 90,
        protein: 2,
        carbs: 22,
        fat: 0.5,
        fiber: 4
      },
      costPerServing: 18
    },
    {
      id: '6',
      name: 'Masala Spice Mix Batch',
      prepTime: 25,
      servings: 50,
      storageTime: '1 year in airtight container',
      difficulty: 'Easy',
      ingredients: [
        '1/2 cup coriander seeds',
        '1/4 cup cumin seeds',
        '2 tbsp black peppercorns',
        '1 tbsp cloves',
        '4 black cardamom pods',
        '10 green cardamom pods',
        '4 inch cinnamon stick',
        '2 bay leaves',
        '1 tbsp fennel seeds'
      ],
      instructions: [
        'Dry roast coriander and cumin seeds until fragrant',
        'Roast other whole spices lightly (30 seconds each)',
        'Cool all roasted spices completely',
        'Grind all spices together to fine powder',
        'Sieve the powder to remove any coarse pieces',
        'Store in airtight container',
        'Use 1 tsp per dish for authentic flavor',
        'Make fresh batch every 6 months for best flavor'
      ],
      category: 'Spices',
      nutritionPerServing: {
        calories: 5,
        protein: 0.2,
        carbs: 1,
        fat: 0.2,
        fiber: 0.3
      },
      costPerServing: 2
    }
  ];

  /**
   * Get batch cooking suggestions based on user profile and dietary restrictions
   */
  static getBatchCookingSuggestions(
    userProfile?: UserProfile,
    dietaryRestrictions: string[] = [],
    timeAvailable: number = 60, // minutes
    servingsNeeded: number = 7
  ): BatchCookingSuggestion[] {
    
    let suggestions = this.BATCH_COOKING_DATABASE.filter(suggestion => {
      // Filter by time available
      if (suggestion.prepTime > timeAvailable) return false;
      
      // Filter by dietary restrictions
      if (!this.isCompatibleWithDiet(suggestion, dietaryRestrictions)) return false;
      
      // Filter by servings (suggestions should provide at least half the needed servings)
      if (suggestion.servings < servingsNeeded * 0.5) return false;
      
      return true;
    });

    // Sort by relevance
    suggestions = suggestions.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Prefer suggestions that match servings needed
      if (Math.abs(a.servings - servingsNeeded) < Math.abs(b.servings - servingsNeeded)) scoreA += 2;
      else if (Math.abs(b.servings - servingsNeeded) < Math.abs(a.servings - servingsNeeded)) scoreB += 2;
      
      // Prefer easier recipes
      if (a.difficulty === 'Easy') scoreA += 1;
      if (b.difficulty === 'Easy') scoreB += 1;
      
      // Prefer longer storage time
      if (a.storageTime.includes('week') || a.storageTime.includes('month')) scoreA += 1;
      if (b.storageTime.includes('week') || b.storageTime.includes('month')) scoreB += 1;
      
      return scoreB - scoreA;
    });

    return suggestions;
  }

  /**
   * Check if recipe is compatible with dietary restrictions
   */
  private static isCompatibleWithDiet(suggestion: BatchCookingSuggestion, restrictions: string[]): boolean {
    const restrictionMap: Record<string, string[]> = {
      'vegetarian': ['chicken', 'meat', 'fish', 'mutton', 'egg'],
      'vegan': ['chicken', 'meat', 'fish', 'mutton', 'egg', 'milk', 'cheese', 'butter', 'ghee', 'yogurt', 'honey'],
      'gluten-free': ['wheat', 'flour', 'bread', 'pasta', 'oats'],
      'dairy-free': ['milk', 'cheese', 'butter', 'ghee', 'yogurt', 'cream'],
      'low-carb': ['rice', 'potato', 'bread', 'oats', 'pasta'],
      'keto': ['rice', 'potato', 'bread', 'oats', 'pasta', 'banana', 'mango']
    };

    return restrictions.every(restriction => {
      const forbiddenItems = restrictionMap[restriction.toLowerCase()] || [];
      const ingredientText = suggestion.ingredients.join(' ').toLowerCase();
      const nameText = suggestion.name.toLowerCase();
      
      return !forbiddenItems.some(item => 
        ingredientText.includes(item) || nameText.includes(item)
      );
    });
  }

  /**
   * Get meal prep schedule for the week
   */
  static getWeeklyMealPrepSchedule(
    userProfile?: UserProfile,
    dietaryRestrictions: string[] = []
  ): { day: string; tasks: { time: string; task: string; duration: number }[] }[] {
    
    const schedule = [
      {
        day: 'Sunday',
        tasks: [
          { time: '10:00 AM', task: 'Prepare Weekly Dal Batch', duration: 45 },
          { time: '11:00 AM', task: 'Make Overnight Oats for the Week', duration: 20 },
          { time: '11:30 AM', task: 'Prepare Vegetable Curry Base', duration: 40 },
          { time: '12:30 PM', task: 'Wash and Store Vegetables', duration: 30 }
        ]
      },
      {
        day: 'Wednesday', 
        tasks: [
          { time: '7:00 PM', task: 'Quick Protein Batch Cook', duration: 30 },
          { time: '7:30 PM', task: 'Prep Smoothie Packs', duration: 15 }
        ]
      },
      {
        day: 'Saturday',
        tasks: [
          { time: '9:00 AM', task: 'Weekly Grocery Shopping', duration: 60 },
          { time: '10:30 AM', task: 'Spice Mix Preparation', duration: 25 }
        ]
      }
    ];

    return schedule;
  }

  /**
   * Calculate total cost for batch cooking
   */
  static calculateBatchCookingCost(suggestions: BatchCookingSuggestion[]): {
    totalCost: number;
    costPerMeal: number;
    totalServings: number;
    breakdown: { name: string; cost: number; servings: number }[];
  } {
    let totalCost = 0;
    let totalServings = 0;
    const breakdown: { name: string; cost: number; servings: number }[] = [];

    suggestions.forEach(suggestion => {
      const cost = suggestion.costPerServing * suggestion.servings;
      totalCost += cost;
      totalServings += suggestion.servings;
      
      breakdown.push({
        name: suggestion.name,
        cost,
        servings: suggestion.servings
      });
    });

    return {
      totalCost: Math.round(totalCost),
      costPerMeal: totalServings > 0 ? Math.round(totalCost / totalServings) : 0,
      totalServings,
      breakdown
    };
  }

  /**
   * Get storage guidelines for different food types
   */
  static getStorageGuidelines(): { category: string; guidelines: string[]; maxDays: number; tips: string[] }[] {
    return [
      {
        category: 'Cooked Dal/Lentils',
        guidelines: [
          'Store in airtight containers',
          'Cool completely before refrigerating',
          'Can be frozen for up to 3 months'
        ],
        maxDays: 5,
        tips: [
          'Add water while reheating if too thick',
          'Always reheat thoroughly before eating',
          'Freeze in portion-sized containers'
        ]
      },
      {
        category: 'Cooked Rice/Grains',
        guidelines: [
          'Store in refrigerator within 2 hours of cooking',
          'Use shallow containers for quick cooling',
          'Can be frozen for up to 6 months'
        ],
        maxDays: 4,
        tips: [
          'Sprinkle water while reheating',
          'Perfect for making fried rice',
          'Portion into meal-sized containers'
        ]
      },
      {
        category: 'Cooked Chicken/Meat',
        guidelines: [
          'Store in refrigerator at 40°F or below',
          'Use within 3-4 days of cooking',
          'Freeze for longer storage (up to 4 months)'
        ],
        maxDays: 4,
        tips: [
          'Reheat to internal temperature of 165°F',
          'Add a splash of broth when reheating',
          'Great for quick curry additions'
        ]
      },
      {
        category: 'Cooked Vegetables',
        guidelines: [
          'Best consumed within 3-5 days',
          'Store in glass containers when possible',
          'Some vegetables freeze better than others'
        ],
        maxDays: 5,
        tips: [
          'Leafy vegetables don\'t freeze well',
          'Root vegetables freeze excellently',
          'Add to soups and stews easily'
        ]
      },
      {
        category: 'Curry/Gravy Base',
        guidelines: [
          'Can be refrigerated for up to 1 week',
          'Freezes very well for up to 6 months',
          'Store in ice cube trays for portion control'
        ],
        maxDays: 7,
        tips: [
          'Use as base for any vegetable curry',
          'Add protein and vegetables as needed',
          'Perfect for quick weeknight dinners'
        ]
      },
      {
        category: 'Smoothie Packs',
        guidelines: [
          'Store in freezer bags with air removed',
          'Label with date and ingredients',
          'Use within 3 months for best quality'
        ],
        maxDays: 90,
        tips: [
          'Add liquid and blend directly from frozen',
          'Pre-portion protein powder separately',
          'Great for busy mornings'
        ]
      }
    ];
  }

  /**
   * Generate batch cooking shopping list
   */
  static generateShoppingList(suggestions: BatchCookingSuggestion[]): {
    category: string;
    items: { name: string; quantity: string; estimatedCost: number }[];
  }[] {
    const consolidatedIngredients: Record<string, { quantity: number; unit: string; cost: number }> = {};
    
    // Consolidate all ingredients
    suggestions.forEach(suggestion => {
      suggestion.ingredients.forEach(ingredient => {
        const parsed = this.parseIngredient(ingredient);
        const key = parsed.name;
        
        if (consolidatedIngredients[key]) {
          consolidatedIngredients[key].quantity += parsed.quantity;
          consolidatedIngredients[key].cost += parsed.estimatedCost;
        } else {
          consolidatedIngredients[key] = {
            quantity: parsed.quantity,
            unit: parsed.unit,
            cost: parsed.estimatedCost
          };
        }
      });
    });

    // Categorize ingredients
    const categorizedList: Record<string, { name: string; quantity: string; estimatedCost: number }[]> = {
      'Vegetables': [],
      'Fruits': [],
      'Dairy & Eggs': [],
      'Meat & Protein': [],
      'Pantry Staples': [],
      'Spices & Condiments': [],
      'Others': []
    };

    Object.entries(consolidatedIngredients).forEach(([name, details]) => {
      const category = this.categorizeIngredient(name);
      const quantityText = details.quantity > 1 ? `${details.quantity} ${details.unit}` : `${details.quantity} ${details.unit}`;
      
      categorizedList[category].push({
        name,
        quantity: quantityText,
        estimatedCost: Math.round(details.cost)
      });
    });

    // Convert to array format and filter empty categories
    return Object.entries(categorizedList)
      .filter(([, items]) => items.length > 0)
      .map(([category, items]) => ({ category, items }));
  }

  /**
   * Parse ingredient string to extract quantity and name
   */
  private static parseIngredient(ingredient: string): {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
  } {
    // Simple parsing - in production, use more sophisticated NLP
    const matches = ingredient.match(/^(\d+(?:\.\d+)?)\s*(\w+)\s+(.+)/) || 
                   ingredient.match(/^(\d+)\s+(.+)/) ||
                   [null, '1', 'item', ingredient];

    const quantity = parseFloat(matches[1]) || 1;
    const name = matches[3] || matches[2] || ingredient;
    const unit = matches[3] ? matches[2] : 'item';

    // Estimate cost based on ingredient name
    const estimatedCost = this.estimateIngredientCost(name, quantity);

    return {
      name: name.replace(/,.*$/, '').trim(), // Remove descriptions after comma
      quantity,
      unit,
      estimatedCost
    };
  }

  /**
   * Categorize ingredient for shopping list
   */
  private static categorizeIngredient(ingredient: string): string {
    const lowerIngredient = ingredient.toLowerCase();
    
    const categories = {
      'Vegetables': ['onion', 'tomato', 'potato', 'carrot', 'beans', 'spinach', 'vegetable'],
      'Fruits': ['banana', 'apple', 'berry', 'mango', 'fruit'],
      'Dairy & Eggs': ['milk', 'cheese', 'yogurt', 'butter', 'egg', 'cream'],
      'Meat & Protein': ['chicken', 'meat', 'fish', 'mutton', 'dal', 'lentil'],
      'Pantry Staples': ['rice', 'oil', 'flour', 'oats', 'sugar', 'salt'],
      'Spices & Condiments': ['turmeric', 'cumin', 'coriander', 'masala', 'spice', 'seed']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerIngredient.includes(keyword))) {
        return category;
      }
    }

    return 'Others';
  }

  /**
   * Estimate ingredient cost (simplified)
   */
  private static estimateIngredientCost(ingredient: string, quantity: number): number {
    const baseCosts: Record<string, number> = {
      'onion': 30, 'tomato': 45, 'potato': 25, 'chicken': 180,
      'oil': 140, 'rice': 60, 'dal': 120, 'milk': 60,
      'spices': 20, 'vegetables': 50
    };

    const lowerIngredient = ingredient.toLowerCase();
    let baseCost = 50; // Default cost per kg

    for (const [key, cost] of Object.entries(baseCosts)) {
      if (lowerIngredient.includes(key)) {
        baseCost = cost;
        break;
      }
    }

    return Math.round(baseCost * quantity * 0.1); // Rough estimation
  }

  /**
   * Get nutrition summary for batch cooking plan
   */
  static getNutritionSummary(suggestions: BatchCookingSuggestion[]): {
    totalServings: number;
    averageNutritionPerServing: NutritionInfo;
    nutritionBreakdown: { name: string; nutrition: NutritionInfo; servings: number }[];
  } {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalServings = 0;

    const nutritionBreakdown: { name: string; nutrition: NutritionInfo; servings: number }[] = [];

    suggestions.forEach(suggestion => {
      const servings = suggestion.servings;
      const nutrition = suggestion.nutritionPerServing;

      totalCalories += nutrition.calories * servings;
      totalProtein += nutrition.protein * servings;
      totalCarbs += nutrition.carbs * servings;
      totalFat += nutrition.fat * servings;
      totalFiber += nutrition.fiber * servings;
      totalServings += servings;

      nutritionBreakdown.push({
        name: suggestion.name,
        nutrition,
        servings
      });
    });

    const averageNutritionPerServing: NutritionInfo = {
      calories: totalServings > 0 ? Math.round(totalCalories / totalServings) : 0,
      protein: totalServings > 0 ? Math.round(totalProtein / totalServings) : 0,
      carbs: totalServings > 0 ? Math.round(totalCarbs / totalServings) : 0,
      fat: totalServings > 0 ? Math.round(totalFat / totalServings) : 0,
      fiber: totalServings > 0 ? Math.round(totalFiber / totalServings) : 0
    };

    return {
      totalServings,
      averageNutritionPerServing,
      nutritionBreakdown
    };
  }

  /**
   * Get time-saving tips for batch cooking
   */
  static getTimeSavingTips(): string[] {
    return [
      'Prep all ingredients before you start cooking anything',
      'Use a pressure cooker to reduce cooking time for lentils and tough vegetables',
      'Cook similar items together - like all your grains at once',
      'Invest in good quality storage containers that stack well',
      'Label everything with contents and date',
      'Keep a rotation system - use oldest items first',
      'Prep vegetables right after grocery shopping',
      'Use slow cooker or instant pot for hands-off cooking',
      'Double recipes when you cook - freeze half for later',
      'Keep basic spice mixes ready to speed up seasoning'
    ];
  }

  /**
   * Get equipment recommendations for batch cooking
   */
  static getEquipmentRecommendations(): {
    category: string;
    items: { name: string; importance: 'Essential' | 'Helpful' | 'Nice to Have'; reason: string }[];
  }[] {
    return [
      {
        category: 'Cooking Equipment',
        items: [
          {
            name: 'Large Heavy-Bottom Pot/Dutch Oven',
            importance: 'Essential',
            reason: 'Perfect for cooking large batches of curry, dal, and stews'
          },
          {
            name: 'Pressure Cooker (3-5L)',
            importance: 'Essential',
            reason: 'Reduces cooking time for lentils, rice, and tough vegetables'
          },
          {
            name: 'Large Non-Stick Pan',
            importance: 'Helpful',
            reason: 'Great for sautéing large quantities of vegetables'
          }
        ]
      },
      {
        category: 'Storage Solutions',
        items: [
          {
            name: 'Glass Storage Containers (Various Sizes)',
            importance: 'Essential',
            reason: 'Microwave and freezer safe, easy to see contents'
          },
          {
            name: 'Freezer Bags',
            importance: 'Essential',
            reason: 'Space-efficient for smoothie packs and flat storage'
          },
          {
            name: 'Mason Jars',
            importance: 'Helpful',
            reason: 'Perfect for overnight oats and individual portions'
          }
        ]
      },
      {
        category: 'Time-Savers',
        items: [
          {
            name: 'Food Processor',
            importance: 'Helpful',
            reason: 'Quick chopping of large quantities of vegetables'
          },
          {
            name: 'Digital Kitchen Scale',
            importance: 'Nice to Have',
            reason: 'Accurate portioning for consistent nutrition and costs'
          },
          {
            name: 'Slow Cooker/Instant Pot',
            importance: 'Nice to Have',
            reason: 'Set-and-forget cooking for busy schedules'
          }
        ]
      }
    ];
  }
}