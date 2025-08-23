// services/fitnessService.ts

interface WorkoutVideo {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  rating: number;
  views: string;
  equipment: string[];
  tags: string[];
  specialFocus: string[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  workouts: WorkoutVideo[];
  goals: string[];
}

interface FitnessFilters {
  category?: string;
  difficulty?: string;
  duration?: string;
}

class FitnessService {
  private readonly YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  private readonly YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

  // Sample workout videos database
  private sampleVideos: WorkoutVideo[] = [
    {
      id: '1',
      title: 'Morning Yoga Flow for Busy Moms',
      instructor: 'Adriene Mishler',
      duration: '15 min',
      difficulty: 'Beginner',
      category: 'yoga',
      description: 'A gentle morning yoga routine designed to energize and center you for the day ahead.',
      thumbnailUrl: '/api/placeholder/320/180',
      youtubeUrl: 'https://youtube.com/watch?v=morning-yoga-flow',
      rating: 4.8,
      views: '2.1M',
      equipment: ['Yoga mat'],
      tags: ['morning routine', 'flexibility', 'mindfulness'],
      specialFocus: ['Back pain relief', 'Energy boost', 'Stress relief']
    },
    {
      id: '2',
      title: 'HIIT Workout for Working Mothers',
      instructor: 'Fitness Blender',
      duration: '20 min',
      difficulty: 'Intermediate',
      category: 'cardio',
      description: 'High-intensity interval training perfect for busy schedules. Burn calories and build strength quickly.',
      thumbnailUrl: '/api/placeholder/320/180',
      youtubeUrl: 'https://youtube.com/watch?v=hiit-working-moms',
      rating: 4.6,
      views: '1.5M',
      equipment: ['None required'],
      tags: ['fat burning', 'time-efficient', 'full body'],
      specialFocus: ['Calorie burn', 'Cardiovascular health', 'Time-efficient']
    },
    {
      id: '3',
      title: 'Postnatal Core Recovery',
      instructor: 'Sarah Beth Yoga',
      duration: '25 min',
      difficulty: 'Beginner',
      category: 'postnatal',
      description: 'Gentle core strengthening exercises designed for postpartum recovery and healing.',
      thumbnailUrl: '/api/placeholder/320/180',
      youtubeUrl: 'https://youtube.com/watch?v=postnatal-core',
      rating: 4.9,
      views: '890K',
      equipment: ['Exercise ball (optional)'],
      tags: ['postpartum', 'core strength', 'recovery'],
      specialFocus: ['Diastasis recti', 'Pelvic floor', 'Gentle recovery']
    },
    {
      id: '4',
      title: 'Prenatal Pilates - Second Trimester',
      instructor: 'Lottie Murphy',
      duration: '30 min',
      difficulty: 'Beginner',
      category: 'prenatal',
      description: 'Safe and effective Pilates exercises for expectant mothers in their second trimester.',
      thumbnailUrl: '/api/placeholder/320/180',
      youtubeUrl: 'https://youtube.com/watch?v=prenatal-pilates',
      rating: 4.7,
      views: '650K',
      equipment: ['Pilates ball', 'Light weights (optional)'],
      tags: ['pregnancy safe', 'strength', 'flexibility'],
      specialFocus: ['Pregnancy fitness', 'Core stability', 'Back support']
    },
    {
      id: '5',
      title: '10-Minute Meditation for Overwhelmed Moms',
      instructor: 'Headspace',
      duration: '10 min',
      difficulty: 'Beginner',
      category: 'meditation',
      description: 'A calming meditation specifically designed for mothers feeling overwhelmed and stressed.',
      thumbnailUrl: '/api/placeholder/320/180',
      youtubeUrl: 'https://youtube.com/watch?v=meditation-moms',
      rating: 4.8,
      views: '1.2M',
      equipment: ['None required'],
      tags: ['mindfulness', 'stress relief', 'mental health'],
      specialFocus: ['Anxiety reduction', 'Mental clarity', 'Emotional balance']
    },
    {
      id: '6',
      title: 'Strength Training for Busy Women',
      instructor: 'Natacha Oceane',
      duration: '35 min',
      difficulty: 'Intermediate',
      category: 'strength',
      description: 'Full-body strength training routine that can be done at home with minimal equipment.',
      thumbnailUrl: '/api/placeholder/320/180',
      youtubeUrl: 'https://youtube.com/watch?v=strength-busy-women',
      rating: 4.5,
      views: '980K',
      equipment: ['Dumbbells', 'Resistance bands'],
      tags: ['muscle building', 'functional fitness', 'home workout'],
      specialFocus: ['Muscle toning', 'Functional strength', 'Bone health']
    }
  ];

  // Sample workout plans
  private samplePlans: WorkoutPlan[] = [
    {
      id: 'plan_1',
      name: '30-Day Postnatal Recovery Program',
      description: 'A comprehensive 30-day program designed to help new mothers safely return to fitness after childbirth.',
      duration: '30 days',
      difficulty: 'Beginner',
      goals: ['Core recovery', 'Energy boost', 'Mental wellness', 'Gradual strength building'],
      workouts: [
        {
          id: 'p1_w1',
          title: 'Week 1: Gentle Breathing & Walking',
          instructor: 'Dr. Sarah Duvall',
          duration: '10 min',
          difficulty: 'Beginner',
          category: 'postnatal',
          description: 'Focus on diaphragmatic breathing and gentle walking.',
          thumbnailUrl: '/api/placeholder/320/180',
          youtubeUrl: 'https://youtube.com/watch?v=postnatal-week1',
          rating: 4.8,
          views: '450K',
          equipment: ['None required'],
          tags: ['breathing', 'recovery'],
          specialFocus: ['Healing', 'Foundation']
        },
        {
          id: 'p1_w2',
          title: 'Week 2: Core Connection',
          instructor: 'Dr. Sarah Duvall',
          duration: '15 min',
          difficulty: 'Beginner',
          category: 'postnatal',
          description: 'Gentle core activation and pelvic floor exercises.',
          thumbnailUrl: '/api/placeholder/320/180',
          youtubeUrl: 'https://youtube.com/watch?v=postnatal-week2',
          rating: 4.7,
          views: '380K',
          equipment: ['Exercise mat'],
          tags: ['core', 'pelvic floor'],
          specialFocus: ['Core recovery', 'Stability']
        }
      ]
    },
    {
      id: 'plan_2',
      name: 'Quick & Effective: 15-Minute Daily Workouts',
      description: 'Perfect for busy mothers who want to stay fit with just 15 minutes a day.',
      duration: '21 days',
      difficulty: 'Intermediate',
      goals: ['Time efficiency', 'Full body fitness', 'Energy increase', 'Stress relief'],
      workouts: [
        {
          id: 'p2_w1',
          title: 'HIIT Cardio Blast',
          instructor: 'PopSugar Fitness',
          duration: '15 min',
          difficulty: 'Intermediate',
          category: 'cardio',
          description: 'High-intensity cardio to maximize calorie burn in minimal time.',
          thumbnailUrl: '/api/placeholder/320/180',
          youtubeUrl: 'https://youtube.com/watch?v=15min-hiit',
          rating: 4.6,
          views: '1.1M',
          equipment: ['None required'],
          tags: ['HIIT', 'cardio'],
          specialFocus: ['Fat burning', 'Cardiovascular health']
        }
      ]
    }
  ];

  async fetchWorkoutVideos(filters: FitnessFilters): Promise<WorkoutVideo[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredVideos = [...this.sampleVideos];
      
      // Apply filters
      if (filters.category && filters.category !== 'all') {
        filteredVideos = filteredVideos.filter(video => video.category === filters.category);
      }
      
      if (filters.difficulty && filters.difficulty !== 'all') {
        filteredVideos = filteredVideos.filter(video => video.difficulty === filters.difficulty);
      }
      
      if (filters.duration && filters.duration !== 'all') {
        filteredVideos = this.filterByDuration(filteredVideos, filters.duration);
      }
      
      // Fetch additional videos from YouTube API
      const additionalVideos = await this.fetchYouTubeVideos(filters);
      
      return [...filteredVideos, ...additionalVideos].slice(0, 12);
    } catch (error) {
      console.error('Error fetching workout videos:', error);
      return this.sampleVideos;
    }
  }

  async fetchWorkoutPlans(filters: FitnessFilters): Promise<WorkoutPlan[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let filteredPlans = [...this.samplePlans];
      
      // Apply filters
      if (filters.category && filters.category !== 'all') {
        filteredPlans = filteredPlans.filter(plan => 
          plan.workouts.some(workout => workout.category === filters.category)
        );
      }
      
      if (filters.difficulty && filters.difficulty !== 'all') {
        filteredPlans = filteredPlans.filter(plan => plan.difficulty === filters.difficulty);
      }
      
      return filteredPlans;
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      return this.samplePlans;
    }
  }

  private async fetchYouTubeVideos(filters: FitnessFilters): Promise<WorkoutVideo[]> {
    if (!this.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const searchTerms = this.buildSearchQuery(filters);
      const response = await fetch(
        `${this.YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(searchTerms)}&maxResults=6&key=${this.YOUTUBE_API_KEY}&videoEmbeddable=true&videoDuration=short`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items?.map((item: any, index: number) => ({
        id: `youtube_${item.id.videoId}`,
        title: item.snippet.title,
        instructor: item.snippet.channelTitle,
        duration: this.estimateDuration(item.snippet.title),
        difficulty: this.estimateDifficulty(item.snippet.title, item.snippet.description),
        category: filters.category || 'fitness',
        description: item.snippet.description?.substring(0, 150) + '...' || 'No description available',
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || '/api/placeholder/320/180',
        youtubeUrl: `https://youtube.com/watch?v=${item.id.videoId}`,
        rating: 4.0 + Math.random() * 1, // Simulated rating
        views: this.generateViewCount(),
        equipment: this.extractEquipment(item.snippet.title, item.snippet.description),
        tags: this.extractTags(item.snippet.title),
        specialFocus: this.extractSpecialFocus(item.snippet.title, item.snippet.description)
      })).slice(0, 3) || [];
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }

  private buildSearchQuery(filters: FitnessFilters): string {
    let query = 'working mothers fitness workout';
    
    if (filters.category && filters.category !== 'all') {
      const categoryQueries = {
        'yoga': 'yoga for moms working mothers',
        'cardio': 'cardio workout busy mothers',
        'strength': 'strength training working moms',
        'pilates': 'pilates for mothers',
        'prenatal': 'prenatal pregnancy workout',
        'postnatal': 'postnatal postpartum fitness',
        'meditation': 'meditation for stressed mothers'
      };
      query = categoryQueries[filters.category as keyof typeof categoryQueries] || query;
    }
    
    if (filters.difficulty && filters.difficulty !== 'all') {
      query += ` ${filters.difficulty.toLowerCase()}`;
    }
    
    return query;
  }

  private filterByDuration(videos: WorkoutVideo[], duration: string): WorkoutVideo[] {
    return videos.filter(video => {
      const mins = parseInt(video.duration);
      switch (duration) {
        case '0-15':
          return mins <= 15;
        case '15-30':
          return mins > 15 && mins <= 30;
        case '30-45':
          return mins > 30 && mins <= 45;
        case '45+':
          return mins > 45;
        default:
          return true;
      }
    });
  }

  private estimateDuration(title: string): string {
    // Look for duration indicators in title
    const durationMatch = title.match(/(\d+)\s*min/i);
    if (durationMatch) {
      return `${durationMatch[1]} min`;
    }
    
    // Estimate based on workout type
    if (title.toLowerCase().includes('quick') || title.toLowerCase().includes('hiit')) {
      return '15 min';
    }
    if (title.toLowerCase().includes('full') || title.toLowerCase().includes('complete')) {
      return '45 min';
    }
    
    return '20 min'; // Default
  }

  private estimateDifficulty(title: string, description: string): 'Beginner' | 'Intermediate' | 'Advanced' {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('beginner') || text.includes('gentle') || text.includes('easy') || text.includes('basic')) {
      return 'Beginner';
    }
    if (text.includes('advanced') || text.includes('intense') || text.includes('challenging')) {
      return 'Advanced';
    }
    
    return 'Intermediate'; // Default
  }

  private extractEquipment(title: string, description: string): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const equipment = [];
    
    const equipmentKeywords = {
      'dumbbells': ['dumbbell', 'weight'],
      'yoga mat': ['yoga', 'mat'],
      'resistance bands': ['resistance', 'band'],
      'kettlebell': ['kettlebell'],
      'exercise ball': ['ball', 'stability ball'],
      'none required': ['no equipment', 'bodyweight', 'no weights']
    };
    
    for (const [item, keywords] of Object.entries(equipmentKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        equipment.push(item);
      }
    }
    
    return equipment.length > 0 ? equipment : ['Minimal equipment'];
  }

  private extractTags(title: string): string[] {
    const tags = [];
    const lowerTitle = title.toLowerCase();
    
    const tagKeywords = {
      'fat burning': ['fat burn', 'weight loss', 'calories'],
      'strength': ['strength', 'muscle', 'toning'],
      'flexibility': ['stretch', 'flexibility', 'yoga'],
      'cardio': ['cardio', 'aerobic', 'heart'],
      'full body': ['full body', 'total body'],
      'core': ['core', 'abs', 'abdominal'],
      'low impact': ['low impact', 'joint friendly'],
      'high intensity': ['hiit', 'high intensity', 'intense']
    };
    
    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        tags.push(tag);
      }
    }
    
    return tags.length > 0 ? tags : ['fitness'];
  }

  private extractSpecialFocus(title: string, description: string): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const focus = [];
    
    const focusAreas = {
      'Back pain relief': ['back pain', 'posture', 'spine'],
      'Energy boost': ['energy', 'energizing', 'morning'],
      'Stress relief': ['stress', 'calming', 'relaxation'],
      'Weight loss': ['weight loss', 'fat burn', 'slim'],
      'Muscle toning': ['toning', 'sculpt', 'define'],
      'Flexibility': ['flexibility', 'mobility', 'stretch'],
      'Mental health': ['mental health', 'mood', 'anxiety'],
      'Time-efficient': ['quick', 'busy', 'time-efficient']
    };
    
    for (const [area, keywords] of Object.entries(focusAreas)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        focus.push(area);
      }
    }
    
    return focus.length > 0 ? focus.slice(0, 3) : ['General fitness'];
  }

  private generateViewCount(): string {
    const counts = ['1.2M', '890K', '2.1M', '650K', '1.5M', '780K', '920K', '1.8M'];
    return counts[Math.floor(Math.random() * counts.length)];
  }

  async getFeaturedWorkout(): Promise<WorkoutVideo> {
    // Return a featured workout of the day
    const featured = {
      id: 'featured_daily',
      title: 'Morning Energy Boost for Working Moms',
      instructor: 'Yoga with Adriene',
      duration: '15 min',
      difficulty: 'Beginner' as const,
      category: 'yoga',
      description: 'Start your day with this energizing yoga flow designed specifically for busy working mothers.',
      thumbnailUrl: '/api/placeholder/320/180',
      youtubeUrl: 'https://youtube.com/watch?v=morning-energy-boost',
      rating: 4.9,
      views: '3.2M',
      equipment: ['Yoga mat'],
      tags: ['morning routine', 'energy', 'mindfulness'],
      specialFocus: ['Energy boost', 'Mental clarity', 'Stress prevention']
    };
    
    return featured;
  }

  async getWorkoutsByCategory(category: string): Promise<WorkoutVideo[]> {
    return this.fetchWorkoutVideos({ category });
  }

  async searchWorkouts(query: string): Promise<WorkoutVideo[]> {
    const filteredVideos = this.sampleVideos.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.instructor.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      video.specialFocus.some(focus => focus.toLowerCase().includes(query.toLowerCase()))
    );
    
    return filteredVideos;
  }

  async getPersonalizedRecommendations(userPreferences: {
    fitnessLevel?: string;
    timeAvailable?: number;
    goals?: string[];
    equipment?: string[];
  }): Promise<WorkoutVideo[]> {
    let recommendations = [...this.sampleVideos];
    
    // Filter by fitness level
    if (userPreferences.fitnessLevel) {
      recommendations = recommendations.filter(video => 
        video.difficulty === userPreferences.fitnessLevel
      );
    }
    
    // Filter by time available
    if (userPreferences.timeAvailable) {
      recommendations = recommendations.filter(video => {
        const duration = parseInt(video.duration);
        return userPreferences.timeAvailable !== undefined && duration <= userPreferences.timeAvailable;
      });
    }
    
    // Filter by goals
    if (Array.isArray(userPreferences.goals) && userPreferences.goals.length > 0) {
      recommendations = recommendations.filter(video =>
        userPreferences.goals!.some(goal =>
          video.specialFocus.some(focus => 
            focus.toLowerCase().includes(goal.toLowerCase())
          )
        )
      );
    }
    
    // Filter by available equipment
    if (userPreferences.equipment && userPreferences.equipment.length > 0) {
      recommendations = recommendations.filter(video =>
        video.equipment.some(equipment =>
          (userPreferences.equipment && userPreferences.equipment.includes(equipment)) || 
          equipment === 'None required'
        )
      );
    }
    
    return recommendations.slice(0, 6);
  }
}

export const fitnessService = new FitnessService();