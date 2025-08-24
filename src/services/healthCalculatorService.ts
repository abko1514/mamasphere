// services/healthCalculatorService.ts

export interface BMIResult {
  bmi: number;
  category: string;
  advice: string;
}

export interface OvulationResult {
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
  cycleData: { day: number; fertility: number }[];
}

export interface PeriodHistory {
  date: string;
  intensity: number;
  nextPeriod: string;
  daysUntil: number;
}

export interface HealthMetrics {
  heartRate: number;
  steps: number;
  sleep: number;
  water: number;
}

class HealthCalculatorService {
  async calculateBMI(weight: number, height: number): Promise<BMIResult> {
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    const bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
    
    let category: string;
    let advice: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Consider consulting with a healthcare provider about healthy weight gain strategies.';
    } else if (bmi < 25) {
      category = 'Normal weight';
      advice = 'Great! Maintain your healthy weight with balanced nutrition and regular exercise.';
    } else if (bmi < 30) {
      category = 'Overweight';
      advice = 'Consider incorporating more physical activity and mindful eating habits.';
    } else {
      category = 'Obese';
      advice = 'Consult with a healthcare provider for personalized weight management guidance.';
    }

    return {
      bmi,
      category,
      advice
    };
  }

  async calculateOvulation(lastPeriodDate: string, cycleLength: number): Promise<OvulationResult> {
    const lastPeriod = new Date(lastPeriodDate);
    const ovulationDay = cycleLength - 14; // Ovulation typically occurs 14 days before next period
    
    const ovulationDate = new Date(lastPeriod);
    ovulationDate.setDate(lastPeriod.getDate() + ovulationDay);
    
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);
    
    // Generate cycle data for visualization
    const cycleData = Array.from({ length: cycleLength }, (_, i) => {
      const day = i + 1;
      let fertility = 0;
      
      // Fertile window (5 days before to 1 day after ovulation)
      const daysSinceLastPeriod = day;
      const daysToOvulation = Math.abs(daysSinceLastPeriod - ovulationDay);
      
      if (daysToOvulation <= 1) {
        fertility = 100; // Peak fertility
      } else if (daysToOvulation <= 3) {
        fertility = 80; // High fertility
      } else if (daysToOvulation <= 5) {
        fertility = 60; // Moderate fertility
      } else {
        fertility = 20; // Low fertility
      }
      
      return { day, fertility };
    });

    return {
      ovulationDate: ovulationDate.toISOString().split('T')[0],
      fertileStart: fertileStart.toISOString().split('T')[0],
      fertileEnd: fertileEnd.toISOString().split('T')[0],
      cycleData
    };
  }

  async generatePeriodHistory(lastPeriodDate: string, cycleLength: number): Promise<PeriodHistory[]> {
    const lastPeriod = new Date(lastPeriodDate);
    const today = new Date();
    const history: PeriodHistory[] = [];
    
    // Calculate next period
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + cycleLength);
    
    const daysUntilNext = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate historical data for the last 3 cycles
    for (let i = 0; i < 3; i++) {
      const cycleStart = new Date(lastPeriod);
      cycleStart.setDate(lastPeriod.getDate() - (cycleLength * i));
      
      // Generate 5 days of period data per cycle
      for (let day = 0; day < 5; day++) {
        const date = new Date(cycleStart);
        date.setDate(cycleStart.getDate() + day);
        
        // Simulate period intensity (heaviest on days 2-3)
        let intensity = 1;
        if (day === 1 || day === 2) intensity = 3;
        else if (day === 0 || day === 3) intensity = 2;
        
        history.push({
          date: date.toISOString().split('T')[0],
          intensity,
          nextPeriod: nextPeriod.toISOString().split('T')[0],
          daysUntil: daysUntilNext
        });
      }
    }
    
    return history.reverse(); // Most recent first
  }

  async fetchHealthMetrics(): Promise<HealthMetrics> {
    // This would typically fetch from a health API
    // For demo purposes, return mock data
    return {
      heartRate: Math.floor(Math.random() * 30) + 70,
      steps: Math.floor(Math.random() * 5000) + 5000,
      sleep: Math.floor(Math.random() * 3) + 7,
      water: Math.floor(Math.random() * 4) + 6
    };
  }
}

export const healthCalculatorService = new HealthCalculatorService();