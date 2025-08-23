// services/pregnancyTrackerService.ts

export interface PregnancyResult {
  weeks: number;
  days: number;
  trimester: string;
  dueDate: string;
  milestone: string;
  babySize: string;
  symptoms: string[];
  tips: string[];
}

class PregnancyTrackerService {
  private readonly PREGNANCY_DURATION = 280; // 40 weeks in days

  private milestones: Record<number, string> = {
    4: "Baby's heart begins to beat",
    8: "All major organs start forming",
    12: "End of first trimester - morning sickness may improve",
    16: "You might feel baby's first movements",
    20: "Anatomy scan - you can find out baby's gender",
    24: "Baby can hear sounds from outside",
    28: "Third trimester begins - baby's survival rate increases significantly",
    32: "Baby's bones are hardening",
    36: "Baby is considered full-term soon",
    40: "Your due date - baby is ready to meet you!"
  };

  private babySizes: Record<number, string> = {
    4: "poppy seed",
    6: "lentil",
    8: "raspberry",
    10: "strawberry",
    12: "lime",
    14: "lemon",
    16: "avocado",
    18: "bell pepper",
    20: "banana",
    22: "papaya",
    24: "corn",
    26: "scallion",
    28: "eggplant",
    30: "cabbage",
    32: "coconut",
    34: "cantaloupe",
    36: "papaya",
    38: "pumpkin",
    40: "watermelon"
  };

  async calculatePregnancyWeeks(lastPeriodDate: string): Promise<PregnancyResult> {
    const lmp = new Date(lastPeriodDate);
    const today = new Date();
    const diffTime = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    // Calculate due date (280 days from LMP)
    const dueDate = new Date(lmp);
    dueDate.setDate(lmp.getDate() + this.PREGNANCY_DURATION);
    
    // Determine trimester
    let trimester: string;
    if (weeks < 13) {
      trimester = "First Trimester";
    } else if (weeks < 27) {
      trimester = "Second Trimester";
    } else {
      trimester = "Third Trimester";
    }
    
    // Get milestone for current week
    const milestoneWeek = this.findClosestMilestone(weeks);
    const milestone = this.milestones[milestoneWeek] || "Your baby continues to grow and develop";
    
    // Get baby size
    const sizeWeek = this.findClosestBabySize(weeks);
    const babySize = this.babySizes[sizeWeek] || "growing strong";
    
    // Get symptoms and tips based on trimester
    const { symptoms, tips } = this.getSymptomsAndTipsForWeek(weeks);
    
    return {
      weeks,
      days,
      trimester,
      dueDate: dueDate.toISOString().split('T')[0],
      milestone,
      babySize,
      symptoms,
      tips
    };
  }

  private findClosestMilestone(currentWeek: number): number {
    const milestoneWeeks = Object.keys(this.milestones).map(Number).sort((a, b) => a - b);
    
    for (let i = milestoneWeeks.length - 1; i >= 0; i--) {
      if (currentWeek >= milestoneWeeks[i]) {
        return milestoneWeeks[i];
      }
    }
    
    return milestoneWeeks[0];
  }

  private findClosestBabySize(currentWeek: number): number {
    const sizeWeeks = Object.keys(this.babySizes).map(Number).sort((a, b) => a - b);
    
    for (let i = sizeWeeks.length - 1; i >= 0; i--) {
      if (currentWeek >= sizeWeeks[i]) {
        return sizeWeeks[i];
      }
    }
    
    return sizeWeeks[0];
  }

  private getSymptomsAndTipsForWeek(weeks: number): { symptoms: string[]; tips: string[] } {
    if (weeks < 13) {
      // First Trimester
      return {
        symptoms: [
          "Morning sickness or nausea",
          "Breast tenderness",
          "Fatigue and tiredness",
          "Frequent urination",
          "Food aversions or cravings"
        ],
        tips: [
          "Take prenatal vitamins with folic acid",
          "Eat small, frequent meals to combat nausea",
          "Stay hydrated and get plenty of rest",
          "Avoid alcohol, smoking, and raw foods",
          "Schedule your first prenatal appointment"
        ]
      };
    } else if (weeks < 27) {
      // Second Trimester
      return {
        symptoms: [
          "Increased energy levels",
          "Growing belly and weight gain",
          "Possible back pain",
          "Stretch marks may appear",
          "Baby movements (quickening)"
        ],
        tips: [
          "Start prenatal exercises and stretches",
          "Use moisturizer to prevent stretch marks",
          "Sleep on your side with a pregnancy pillow",
          "Continue regular prenatal checkups",
          "Consider maternity clothes for comfort"
        ]
      };
    } else {
      // Third Trimester
      return {
        symptoms: [
          "Increased discomfort and pressure",
          "Braxton Hicks contractions",
          "Shortness of breath",
          "Swelling in hands and feet",
          "Difficulty sleeping"
        ],
        tips: [
          "Practice breathing and relaxation techniques",
          "Prepare your hospital bag",
          "Take childbirth classes",
          "Monitor baby's movements daily",
          "Discuss birth plan with your healthcare provider"
        ]
      };
    }
  }

  async getWeeklyDevelopment(weeks: number): Promise<{
    week: number;
    development: string;
    motherChanges: string;
    appointments: string[];
    tests: string[];
  }> {
    // This would typically fetch from a pregnancy API
    // Return detailed weekly development information
    const developmentInfo = this.getWeeklyDevelopmentInfo(weeks);
    const motherChanges = this.getMotherChangesInfo(weeks);
    
    return {
      week: weeks,
      development: developmentInfo,
      motherChanges: motherChanges,
      appointments: weeks % 4 === 0 ? ["Regular prenatal checkup"] : [],
      tests: this.getRecommendedTests(weeks)
    };
  }

  private getWeeklyDevelopmentInfo(weeks: number): string {
    if (weeks <= 4) {
      return "Baby is just a tiny cluster of cells, but major development is beginning.";
    } else if (weeks <= 8) {
      return "Baby's major organs and body systems are forming rapidly.";
    } else if (weeks <= 12) {
      return "Baby's features are becoming more defined, and organs are developing.";
    } else if (weeks <= 16) {
      return "Baby is growing quickly and may start moving, though you might not feel it yet.";
    } else if (weeks <= 20) {
      return "Baby's movements are becoming stronger and you may start to feel them.";
    } else if (weeks <= 24) {
      return "Baby's senses are developing and they can hear sounds from outside.";
    } else if (weeks <= 28) {
      return "Baby's brain is developing rapidly and they have a good chance of survival if born now.";
    } else if (weeks <= 32) {
      return "Baby's bones are hardening and they're gaining weight steadily.";
    } else if (weeks <= 36) {
      return "Baby's organs are maturing and they're getting ready for birth.";
    } else {
      return "Baby is fully developed and ready to be born at any time.";
    }
  }

  private getMotherChangesInfo(weeks: number): string {
    if (weeks <= 12) {
      return "Your body is adapting to pregnancy with hormonal changes that may cause fatigue and nausea.";
    } else if (weeks <= 24) {
      return "Many women feel more energetic during this period as morning sickness often improves.";
    } else if (weeks <= 32) {
      return "Your growing belly may cause some discomfort, and you might experience new symptoms.";
    } else {
      return "Your body is preparing for labor and delivery. Rest and prepare for your baby's arrival.";
    }
  }

  private getRecommendedTests(weeks: number): string[] {
    const tests = [];
    
    if (weeks >= 11 && weeks <= 14) {
      tests.push("First trimester screening");
      tests.push("NT scan (nuchal translucency)");
    }
    if (weeks >= 15 && weeks <= 20) {
      tests.push("Maternal serum screening");
    }
    if (weeks >= 18 && weeks <= 22) {
      tests.push("Anatomy scan (20-week ultrasound)");
    }
    if (weeks >= 24 && weeks <= 28) {
      tests.push("Glucose screening test");
    }
    if (weeks >= 28 && weeks <= 32) {
      tests.push("Rh antibody screen (if Rh-negative)");
    }
    if (weeks >= 35 && weeks <= 37) {
      tests.push("Group B Strep test");
    }
    if (weeks >= 36) {
      tests.push("Cervical exam to check for dilation");
    }
    
    return tests;
  }

  // Helper method to get pregnancy progress percentage
  getPregnancyProgress(weeks: number): number {
    return Math.min(Math.round((weeks / 40) * 100), 100);
  }

  // Helper method to get days remaining
  getDaysRemaining(weeks: number, days: number): number {
    const totalDaysPregnant = (weeks * 7) + days;
    return Math.max(0, 280 - totalDaysPregnant);
  }

  // Helper method to get trimester progress
  getTrimesterProgress(weeks: number): { trimester: number; progress: number } {
    if (weeks < 13) {
      return { trimester: 1, progress: Math.round((weeks / 12) * 100) };
    } else if (weeks < 27) {
      return { trimester: 2, progress: Math.round(((weeks - 12) / 14) * 100) };
    } else {
      return { trimester: 3, progress: Math.round(((weeks - 26) / 14) * 100) };
    }
  }

  // Method to get nutritional recommendations based on week
  getNutritionalRecommendations(weeks: number): string[] {
    const baseRecommendations = [
      "Take prenatal vitamins daily",
      "Eat plenty of fruits and vegetables",
      "Include lean proteins in your diet",
      "Stay hydrated with 8-10 glasses of water daily"
    ];

    if (weeks < 13) {
      return [
        ...baseRecommendations,
        "Focus on folic acid-rich foods",
        "Eat small, frequent meals to combat nausea",
        "Avoid raw or undercooked foods"
      ];
    } else if (weeks < 27) {
      return [
        ...baseRecommendations,
        "Increase iron intake to prevent anemia",
        "Include calcium-rich foods for baby's bone development",
        "Add omega-3 fatty acids for brain development"
      ];
    } else {
      return [
        ...baseRecommendations,
        "Focus on protein for baby's rapid growth",
        "Limit caffeine intake",
        "Eat smaller, more frequent meals as space becomes limited"
      ];
    }
  }
}

export const pregnancyTrackerService = new PregnancyTrackerService();