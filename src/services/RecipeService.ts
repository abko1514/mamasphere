// services/RecipeService.ts
import { Recipe, NutritionInfo } from '@/types';

export class RecipeService {
  private static recipeCache: Map<string, Recipe[]> = new Map();
  private static readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  /**
   * Search recipes using Hugging Face API with health requirements
   */
  static async searchRecipesByHealth(healthRequirements: string): Promise<Recipe[]> {
    const cacheKey = healthRequirements.toLowerCase().trim();
    
    // Check cache first
    const cached = this.recipeCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
      if (!apiKey) {
        throw new Error('Hugging Face API key not found');
      }

      // Create a detailed prompt for recipe generation
      const prompt = this.createRecipePrompt(healthRequirements);

      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Hugging Face API failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data[0]?.generated_text || '';

      // Parse the generated recipes and enhance with our database
      const recipes = this.parseAndEnhanceRecipes(generatedText, healthRequirements);
      
      // Cache the results
      this.recipeCache.set(cacheKey, recipes);
      
      return recipes;

    } catch (error) {
      console.error('Error searching recipes:', error);
      
      // Fallback to filtered database recipes
      return this.searchFromDatabase(healthRequirements);
    }
  }

  /**
   * Create a detailed prompt for Hugging Face
   */
  private static createRecipePrompt(healthRequirements: string): string {
    const requirements = healthRequirements.toLowerCase();
    
    let prompt = `I need healthy recipes that are ${healthRequirements}. `;
    
    // Add context based on requirements
    if (requirements.includes('low-carb')) {
      prompt += 'Focus on vegetables, proteins, and healthy fats. Avoid rice, bread, and pasta. ';
    }
    if (requirements.includes('high-protein')) {
      prompt += 'Include chicken, fish, eggs, lentils, or paneer as main ingredients. ';
    }
    if (requirements.includes('vegetarian')) {
      prompt += 'Use only vegetarian ingredients - no meat, fish, or eggs. ';
    }
    if (requirements.includes('vegan')) {
      prompt += 'Use only plant-based ingredients - no dairy, meat, fish, or eggs. ';
    }
    if (requirements.includes('gluten-free')) {
      prompt += 'Avoid wheat, flour, and any gluten-containing ingredients. ';
    }
    
    prompt += `Please suggest Indian-friendly recipes with:
    - Recipe name
    - Cooking time in minutes
    - Number of servings
    - Approximate calories per serving
    - Main ingredients list
    - Simple cooking steps
    
    Make them practical for busy working mothers with limited time.`;

    return prompt;
  }

  /**
   * Parse Hugging Face response and enhance with database
   */
  private static parseAndEnhanceRecipes(generatedText: string, healthRequirements: string): Recipe[] {
    // Get base recipes from our curated database
    const dbRecipes = this.searchFromDatabase(healthRequirements);
    
    // Try to extract any new recipe ideas from the generated text
    const extractedRecipes = this.extractRecipesFromText(generatedText);
    
    // Combine and deduplicate
    const allRecipes = [...dbRecipes, ...extractedRecipes];
    const uniqueRecipes = this.deduplicateRecipes(allRecipes);
    
    return uniqueRecipes.slice(0, 8); // Return top 8 recipes
  }

  /**
   * Extract recipe information from generated text
   */
  private static extractRecipesFromText(text: string): Recipe[] {
    const recipes: Recipe[] = [];
    
    // Simple pattern matching for recipe extraction
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let currentRecipe: Partial<Recipe> | null = null;
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Look for recipe names (lines that might be titles)
      if (line.includes('Recipe') || line.includes('Bowl') || line.includes('Curry') || line.includes('Salad')) {
        if (currentRecipe && currentRecipe.name) {
          recipes.push(this.completeRecipe(currentRecipe));
        }
        currentRecipe = {
          id: `extracted-${Date.now()}-${recipes.length}`,
          name: this.cleanRecipeName(line),
          ingredients: [],
          instructions: []
        };
      }
      
      // Look for time mentions
      if (lowerLine.includes('minute') || lowerLine.includes('min')) {
        const timeMatch = line.match(/(\d+)\s*(minutes?|mins?)/i);
        if (timeMatch && currentRecipe) {
          currentRecipe.cookTime = parseInt(timeMatch[1]);
        }
      }
      
      // Look for calorie mentions
      if (lowerLine.includes('calorie') || lowerLine.includes('kcal')) {
        const calorieMatch = line.match(/(\d+)\s*(calories?|kcal)/i);
        if (calorieMatch && currentRecipe) {
          currentRecipe.calories = parseInt(calorieMatch[1]);
        }
      }
    }
    
    // Don't forget the last recipe
    if (currentRecipe && currentRecipe.name) {
      recipes.push(this.completeRecipe(currentRecipe));
    }
    
    return recipes;
  }

  /**
   * Complete a partial recipe with defaults
   */
  private static completeRecipe(partial: Partial<Recipe>): Recipe {
    return {
      id: partial.id || `recipe-${Date.now()}`,
      name: partial.name || 'Healthy Recipe',
      ingredients: partial.ingredients || ['Mixed vegetables', 'Spices', 'Oil'],
      cookTime: partial.cookTime || 30,
      servings: partial.servings || 2,
      calories: partial.calories || 300,
      healthTags: this.generateHealthTags(partial.name || ''),
      difficulty: 'Medium',
      instructions: partial.instructions || [
        'Prepare all ingredients',
        'Cook according to recipe',
        'Season to taste',
        'Serve hot'
      ]
    };
  }

  /**
   * Generate health tags based on recipe name and ingredients
   */
  private static generateHealthTags(recipeName: string): string[] {
    const name = recipeName.toLowerCase();
    const tags: string[] = [];
    
    if (name.includes('quinoa') || name.includes('protein')) tags.push('High-Protein');
    if (name.includes('salad') || name.includes('vegetable')) tags.push('Low-Calorie');
    if (!name.includes('rice') && !name.includes('bread')) tags.push('Low-Carb');
    if (name.includes('lentil') || name.includes('dal') || !name.includes('meat')) tags.push('Vegetarian');
    if (name.includes('gluten-free') || name.includes('quinoa')) tags.push('Gluten-Free');
    if (name.includes('bowl') || name.includes('healthy')) tags.push('Nutritious');
    if (name.includes('quick') || name.includes('easy')) tags.push('Quick');
    
    return tags.length > 0 ? tags : ['Healthy'];
  }

  /**
   * Clean and format recipe names
   */
  private static cleanRecipeName(name: string): string {
    return name
      .replace(/Recipe:?/gi, '')
      .replace(/^\d+\.?\s*/, '') // Remove numbering
      .replace(/[^\w\s&-]/g, '') // Remove special chars except &, -
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Search from our curated database
   */
  private static searchFromDatabase(healthRequirements: string): Recipe[] {
    const requirements = healthRequirements.toLowerCase().split(/[\s,]+/);
    
    return this.getRecipeDatabase()
      .filter(recipe => {
        // Match health requirements with recipe tags
        return requirements.some(req => 
          recipe.healthTags.some(tag => 
            tag.toLowerCase().includes(req) || req.includes(tag.toLowerCase())
          ) || 
          recipe.name.toLowerCase().includes(req)
        );
      })
      .sort((a, b) => {
        // Sort by relevance (number of matching tags)
        const aMatches = requirements.filter(req => 
          a.healthTags.some(tag => tag.toLowerCase().includes(req))
        ).length;
        const bMatches = requirements.filter(req => 
          b.healthTags.some(tag => tag.toLowerCase().includes(req))
        ).length;
        return bMatches - aMatches;
      });
  }

  /**
   * Curated recipe database with Indian-friendly recipes
   */
  private static getRecipeDatabase(): Recipe[] {
    return [
      {
        id: '1',
        name: 'Quinoa Vegetable Bowl',
        ingredients: ['Quinoa', 'Mixed vegetables', 'Olive oil', 'Lemon', 'Herbs'],
        cookTime: 25,
        servings: 2,
        calories: 380,
        healthTags: ['High-Protein', 'Gluten-Free', 'Vegetarian', 'Nutritious'],
        difficulty: 'Easy',
        instructions: [
          'Wash and cook quinoa in salted water for 15 minutes',
          'Steam mixed vegetables (broccoli, carrots, bell peppers)',
          'Make dressing with olive oil, lemon juice, and herbs',
          'Combine quinoa and vegetables, drizzle with dressing',
          'Garnish with fresh herbs and serve'
        ],
        nutrition: { calories: 380, protein: 14, carbs: 58, fat: 12, fiber: 8 }
      },
      {
        id: '2',
        name: 'Moong Dal Protein Bowl',
        ingredients: ['Moong dal', 'Spinach', 'Tomatoes', 'Onions', 'Turmeric', 'Cumin'],
        cookTime: 30,
        servings: 3,
        calories: 280,
        healthTags: ['High-Protein', 'Vegetarian', 'Indian', 'Low-Calorie'],
        difficulty: 'Easy',
        instructions: [
          'Wash and soak moong dal for 30 minutes',
          'Cook dal with turmeric and salt until soft',
          'Sauté onions, add tomatoes and spices',
          'Mix cooked dal with the tempering',
          'Add chopped spinach and cook for 5 minutes'
        ],
        nutrition: { calories: 280, protein: 18, carbs: 45, fat: 3, fiber: 12 }
      },
      {
        id: '3',
        name: 'Grilled Chicken Salad',
        ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Yogurt'],
        cookTime: 20,
        servings: 1,
        calories: 320,
        healthTags: ['High-Protein', 'Low-Carb', 'Keto-Friendly'],
        difficulty: 'Medium',
        instructions: [
          'Season chicken breast with herbs and spices',
          'Grill chicken for 6-7 minutes each side',
          'Prepare salad with mixed greens and vegetables',
          'Make yogurt-based dressing with herbs',
          'Slice chicken and serve over salad'
        ],
        nutrition: { calories: 320, protein: 35, carbs: 8, fat: 15, fiber: 4 }
      },
      {
        id: '4',
        name: 'Vegetable Stir-Fry',
        ingredients: ['Mixed vegetables', 'Ginger-garlic', 'Soy sauce', 'Sesame oil', 'Spring onions'],
        cookTime: 15,
        servings: 2,
        calories: 180,
        healthTags: ['Vegetarian', 'Low-Calorie', 'Quick', 'Asian'],
        difficulty: 'Easy',
        instructions: [
          'Heat oil in a wok or large pan',
          'Add ginger-garlic paste and sauté',
          'Add hard vegetables first, then soft ones',
          'Stir-fry on high heat for 5-7 minutes',
          'Season with soy sauce and garnish with spring onions'
        ],
        nutrition: { calories: 180, protein: 6, carbs: 20, fat: 8, fiber: 6 }
      },
      {
        id: '5',
        name: 'Chia Seed Pudding',
        ingredients: ['Chia seeds', 'Almond milk', 'Honey', 'Vanilla', 'Fresh berries'],
        cookTime: 5,
        servings: 2,
        calories: 250,
        healthTags: ['Vegan', 'High-Fiber', 'Make-Ahead', 'Gluten-Free'],
        difficulty: 'Easy',
        instructions: [
          'Mix chia seeds with almond milk in a bowl',
          'Add honey and vanilla extract',
          'Whisk well to prevent clumping',
          'Refrigerate for at least 4 hours or overnight',
          'Top with fresh berries before serving'
        ],
        nutrition: { calories: 250, protein: 8, carbs: 25, fat: 12, fiber: 15 }
      },
      {
        id: '6',
        name: 'Paneer Tikka Bowl',
        ingredients: ['Paneer', 'Bell peppers', 'Onions', 'Yogurt', 'Spices', 'Mint chutney'],
        cookTime: 25,
        servings: 2,
        calories: 420,
        healthTags: ['High-Protein', 'Vegetarian', 'Indian', 'Low-Carb'],
        difficulty: 'Medium',
        instructions: [
          'Cut paneer and vegetables into cubes',
          'Marinate in yogurt and spices for 15 minutes',
          'Thread onto skewers and grill until golden',
          'Prepare mint chutney with yogurt',
          'Serve hot with chutney and salad'
        ],
        nutrition: { calories: 420, protein: 25, carbs: 15, fat: 28, fiber: 5 }
      },
      {
        id: '7',
        name: 'Oats Upma',
        ingredients: ['Rolled oats', 'Mixed vegetables', 'Mustard seeds', 'Curry leaves', 'Lemon'],
        cookTime: 20,
        servings: 2,
        calories: 280,
        healthTags: ['High-Fiber', 'Vegetarian', 'Indian', 'Heart-Healthy'],
        difficulty: 'Easy',
        instructions: [
          'Dry roast oats until fragrant, set aside',
          'Heat oil, add mustard seeds and curry leaves',
          'Add vegetables and sauté until tender',
          'Add roasted oats and water, cook until thick',
          'Finish with lemon juice and serve hot'
        ],
        nutrition: { calories: 280, protein: 8, carbs: 45, fat: 8, fiber: 10 }
      },
      {
        id: '8',
        name: 'Fish Curry Light',
        ingredients: ['Fish fillets', 'Coconut milk', 'Tomatoes', 'Onions', 'Curry spices'],
        cookTime: 35,
        servings: 3,
        calories: 350,
        healthTags: ['High-Protein', 'Omega-3', 'Indian', 'Low-Carb'],
        difficulty: 'Medium',
        instructions: [
          'Marinate fish with turmeric and salt',
          'Sauté onions until golden brown',
          'Add tomatoes and cook until soft',
          'Add curry spices and coconut milk',
          'Gently add fish and simmer for 10 minutes'
        ],
        nutrition: { calories: 350, protein: 30, carbs: 10, fat: 22, fiber: 3 }
      }
    ];
  }

  /**
   * Remove duplicate recipes
   */
  private static deduplicateRecipes(recipes: Recipe[]): Recipe[] {
    const seen = new Set<string>();
    return recipes.filter(recipe => {
      const key = recipe.name.toLowerCase().replace(/\s+/g, '');
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: string): Promise<Recipe | null> {
    const allRecipes = this.getRecipeDatabase();
    return allRecipes.find(recipe => recipe.id === id) || null;
  }

  /**
   * Get nutrition analysis for a recipe
   */
  static async analyzeRecipeNutrition(recipe: Recipe): Promise<NutritionInfo> {
    // If recipe already has nutrition info, return it
    if (recipe.nutrition) {
      return recipe.nutrition;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
      if (!apiKey) {
        return this.estimateNutrition(recipe);
      }

      const prompt = `Analyze the nutrition content for this recipe: ${recipe.name}
      Ingredients: ${recipe.ingredients.join(', ')}
      Servings: ${recipe.servings}
      
      Provide approximate nutrition per serving:
      - Calories
      - Protein (grams)
      - Carbohydrates (grams)  
      - Fat (grams)
      - Fiber (grams)`;

      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.3,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Nutrition analysis failed');
      }

      const data = await response.json();
      return this.parseNutritionFromText(data[0]?.generated_text || '') || this.estimateNutrition(recipe);

    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      return this.estimateNutrition(recipe);
    }
  }

  /**
   * Parse nutrition information from text
   */
  private static parseNutritionFromText(text: string): NutritionInfo | null {
    const calorieMatch = text.match(/calories?:?\s*(\d+)/i);
    const proteinMatch = text.match(/protein:?\s*(\d+(?:\.\d+)?)/i);
    const carbMatch = text.match(/carb(?:ohydrate)?s?:?\s*(\d+(?:\.\d+)?)/i);
    const fatMatch = text.match(/fat:?\s*(\d+(?:\.\d+)?)/i);
    const fiberMatch = text.match(/fiber:?\s*(\d+(?:\.\d+)?)/i);

    if (calorieMatch) {
      return {
        calories: parseInt(calorieMatch[1]),
        protein: proteinMatch ? parseFloat(proteinMatch[1]) : 15,
        carbs: carbMatch ? parseFloat(carbMatch[1]) : 30,
        fat: fatMatch ? parseFloat(fatMatch[1]) : 10,
        fiber: fiberMatch ? parseFloat(fiberMatch[1]) : 5
      };
    }

    return null;
  }

  /**
   * Estimate nutrition based on ingredients and recipe type
   */
  private static estimateNutrition(recipe: Recipe): NutritionInfo {
    const ingredientNutrition: Record<string, NutritionInfo> = {
      'quinoa': { calories: 110, protein: 4, carbs: 20, fat: 2, fiber: 3 },
      'chicken': { calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0 },
      'paneer': { calories: 265, protein: 18, carbs: 4, fat: 20, fiber: 0 },
      'dal': { calories: 115, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
      'vegetables': { calories: 25, protein: 1, carbs: 5, fat: 0.2, fiber: 2 },
      'oil': { calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0 },
      'rice': { calories: 130, protein: 3, carbs: 28, fat: 0.3, fiber: 0.4 }
    };

    let totalNutrition: NutritionInfo = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    // Estimate based on ingredients
    recipe.ingredients.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      for (const [key, nutrition] of Object.entries(ingredientNutrition)) {
        if (lowerIngredient.includes(key)) {
          totalNutrition.calories += nutrition.calories * 0.5; // Rough portion estimate
          totalNutrition.protein += nutrition.protein * 0.5;
          totalNutrition.carbs += nutrition.carbs * 0.5;
          totalNutrition.fat += nutrition.fat * 0.5;
          totalNutrition.fiber += nutrition.fiber * 0.5;
          break;
        }
      }
    });

    // Adjust for servings
    const perServing = {
      calories: Math.round(totalNutrition.calories / recipe.servings),
      protein: Math.round(totalNutrition.protein / recipe.servings),
      carbs: Math.round(totalNutrition.carbs / recipe.servings),
      fat: Math.round(totalNutrition.fat / recipe.servings),
      fiber: Math.round(totalNutrition.fiber / recipe.servings)
    };

    // Fallback to recipe's stated calories if available
    if (recipe.calories && recipe.calories > perServing.calories) {
      perServing.calories = recipe.calories;
    }

    return perServing;
  }

  /**
   * Get trending recipes
   */
  static getTrendingRecipes(): Recipe[] {
    return this.getRecipeDatabase()
      .filter(recipe => recipe.healthTags.includes('Quick') || recipe.healthTags.includes('High-Protein'))
      .slice(0, 6);
  }

  /**
   * Clear recipe cache
   */
  static clearCache(): void {
    this.recipeCache.clear();
  }
}