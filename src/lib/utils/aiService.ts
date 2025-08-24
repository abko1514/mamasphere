interface PrioritizeTaskRequest {
  title: string;
  description?: string;
  dueDate?: string | null;
}

interface PrioritizeTaskResponse {
  priority: number;
  aiProcessed: boolean;
}

export class AIService {
  static fallbackPrioritization(
    title: string,
    description: string = "",
    dueDate: string | null = null
  ): number {
    let priority: number = 3; // Default medium priority

    const urgentKeywords: string[] = [
      // Existing...
      "urgent",
      "asap",
      "emergency",
      "immediate",
      "critical",
      "now",
      "today",
      // ADD THESE MOM-SPECIFIC:
      "kids sick",
      "child sick",
      "fever",
      "injury",
      "bleeding",
      "crying nonstop",
      "pediatrician",
      "school pickup",
      "diaper emergency",
      "out of diapers",
      "no milk",
      "broken",
      "leaking",
      "overflow",
    ];

    const importantKeywords: string[] = [
      // Existing...
      "important",
      "meeting",
      "deadline",
      "appointment",
      "doctor",
      "school",
      "work",
      // ADD THESE:
      "permission slip",
      "school event",
      "teacher meeting",
      "parent conference",
      "before nap",
      "bedtime routine",
      "feeding time",
      "medication time",
      "pickup time",
    ];

    const lowPriorityKeywords: string[] = [
      // Existing...
      "sometime",
      "eventually",
      "when possible",
      "low priority",
      "maybe",
      "later",
      // ADD THESE:
      "when free",
      "spare time",
      "weekend project",
      "nice to have",
    ];

    const text: string = `${title} ${description}`.toLowerCase();

    // Check for urgent keywords
    if (urgentKeywords.some((keyword: string) => text.includes(keyword))) {
      priority = Math.min(priority + 2, 5);
    }

    // Check for important keywords
    if (importantKeywords.some((keyword: string) => text.includes(keyword))) {
      priority = Math.min(priority + 1, 5);
    }

    // Check for low priority keywords
    if (lowPriorityKeywords.some((keyword: string) => text.includes(keyword))) {
      priority = Math.max(priority - 1, 1);
    }

    // Due date impact
    if (dueDate) {
      const daysUntilDue: number = Math.ceil(
        (new Date(dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysUntilDue <= 0) {
        priority = 5; // Overdue = urgent
      } else if (daysUntilDue <= 1) {
        priority = Math.min(priority + 2, 5);
      } else if (daysUntilDue <= 3) {
        priority = Math.min(priority + 1, 5);
      }
    }

    // Time context adjustments
    const now = new Date();
    const currentHour = now.getHours();

    // Morning urgency (6-9 AM)
    if (currentHour >= 6 && currentHour <= 9 && text.includes("morning")) {
      priority = Math.min(priority + 1, 5);
    }

    // Evening routine urgency (6-8 PM)
    if (
      currentHour >= 18 &&
      currentHour <= 20 &&
      (text.includes("bedtime") ||
        text.includes("dinner") ||
        text.includes("bath"))
    ) {
      priority = Math.min(priority + 1, 5);
    }

    // Friday prep tasks
    if (now.getDay() === 5 && text.includes("weekend")) {
      priority = Math.min(priority + 1, 5);
    }

    // ADD THIS LINE HERE - Apply mom priority boost
    priority = Math.min(
      priority + AIService.getMomPriorityBoost(title, description),
      5
    );

    return Math.max(1, Math.min(5, priority));
  }

  static async prioritizeTask(
    title: string,
    description: string = "",
    dueDate: string | null = null
  ): Promise<number> {
    try {
      const requestBody: PrioritizeTaskRequest = {
        title,
        description,
        dueDate,
      };

      const response = await fetch("/api/ai/prioritize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.warn("AI service unavailable, using fallback");
        return AIService.fallbackPrioritization(title, description, dueDate);
      }

      const data: PrioritizeTaskResponse = await response.json();

      // If AI processing failed, use fallback
      if (!data.aiProcessed) {
        return AIService.fallbackPrioritization(title, description, dueDate);
      }
      return data.priority;
    } catch (error) {
      console.error("AI prioritization failed:", error);
      // Fallback to rule-based prioritization
      return AIService.fallbackPrioritization(title, description, dueDate);
    }
  }

  static categorizeTask(title: string, description: string = ""): string {
    const text = `${title} ${description}`.toLowerCase();

    const categories: { [key: string]: string[] } = {
      household: [
        "clean",
        "cleaning",
        "cook",
        "cooking",
        "kitchen",
        "laundry",
        "dishes",
        "vacuum",
        "organize",
        "organizing",
        "grocery",
        "groceries",
        "shopping",
        "tidying",
        "tidy",
        "sweep",
        "mop",
        "dust",
        "bathroom",
        "bedroom",
        "declutter",
        "meal prep",
        "pantry",
        "fridge",
        "toys",
        "playroom",
        "nursery",
        "dishwasher",
        "washer",
        "dryer",
        "microwave",
        "repair",
        "fix",
        "broken",
        "maintenance",
      ],
      kids: [
        "school",
        "homework",
        "pickup",
        "pick up",
        "drop off",
        "dropoff",
        "playdate",
        "bedtime",
        "bath",
        "diaper",
        "feeding",
        "nap",
        "story",
        "children",
        "child",
        "kid",
        "kids",
        "daycare",
        "preschool",
        "kindergarten",
        "baby",
        "toddler",
        "teenager",
        "backpack",
        "lunchbox",
        "sports practice",
        "recital",
        "field trip",
        "potty training",
        "sleep training",
        "homework help",
        "parent conference",
        "school event",
        "permission slip",
      ],
      health: [
        "pediatrician",
        "fever",
        "sick",
        "injury",
        "allergy",
        "vaccine",
        "immunization",
        "emergency",
        "urgent care",
        "specialist",
        "doctor",
        "dr",
        "appointment",
        "appt",
        "medicine",
        "medication",
        "exercise",
        "workout",
        "gym",
        "dentist",
        "dental",
        "checkup",
        "check up",
        "therapy",
        "physical",
        "mental",
        "vitamins",
        "prescription",
        "hospital",
        "clinic",
      ],
      work: [
        "meeting",
        "me time",
        "bubble bath",
        "hair",
        "nails",
        "alone time",
        "project",
        "deadline",
        "call",
        "email",
        "presentation",
        "report",
        "office",
        "boss",
        "client",
        "conference",
        "zoom",
        "teams",
        "slack",
        "review",
        "proposal",
        "budget",
        "planning",
      ],
      personal: [
        "hobby",
        "hobbies",
        "friend",
        "friends",
        "relax",
        "relaxing",
        "read",
        "reading",
        "book",
        "movie",
        "movies",
        "tv",
        "self-care",
        "self care",
        "spa",
        "massage",
        "meditation",
        "yoga",
        "journal",
        "journaling",
        "craft",
        "crafting",
      ],
      finances: [
        "budget",
        "bills",
        "insurance",
        "savings",
        "taxes",
        "bank",
        "mortgage",
        "credit card",
        "payment",
        "invoice",
        "expense",
        "money",
        "financial",
        "loan",
      ],
    };

    // Calculate category scores
    const categoryScores: { [key: string]: number } = {};

    // REPLACE the simple keyword counting with:
    for (const [category, keywords] of Object.entries(categories)) {
      let score = 0;
      keywords.forEach((keyword) => {
        const matches = (text.match(new RegExp(keyword, "g")) || []).length;
        score += matches;
        // Bonus for exact word matches
        if (
          text.includes(` ${keyword} `) ||
          text.startsWith(keyword) ||
          text.endsWith(keyword)
        ) {
          score += 0.5;
        }
      });
      categoryScores[category] = score;
    }

    // Find category with highest score
    const bestCategory = Object.entries(categoryScores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );

    return bestCategory[1] > 0 ? bestCategory[0] : "general";
  }

  static getMotivationalMessage(priority: number): string {
    const messages: { [key: number]: string[] } = {
      5: [
        "🚨 This is urgent! You've got this, mama!",
        "⚡ Time to tackle this high-priority task!",
        "🔥 This one's important - let's get it done!",
      ],
      4: [
        "💪 High priority task - you're amazing!",
        "⭐ This is important for your day!",
        "🎯 Focus time - you can handle this!",
      ],
      3: [
        "📋 Medium priority - steady progress!",
        "✨ Another step towards your goals!",
        "🌟 You're doing great, keep going!",
      ],
      2: [
        "📝 Nice and easy does it!",
        "🌸 Take your time with this one!",
        "💖 Every little step counts!",
      ],
      1: [
        "🌺 Low pressure, high love!",
        "🦋 When you have a moment...",
        "💕 No rush on this one, mama!",
      ],
    };

    const priorityMessages = messages[priority] || messages[3];
    return priorityMessages[
      Math.floor(Math.random() * priorityMessages.length)
    ];
  }

  static getMomPriorityBoost(title: string, description: string = ""): number {
    const text = `${title} ${description}`.toLowerCase();
    let boost = 0;

    // Health/safety gets highest boost
    if (
      text.match(/\b(sick|fever|injury|doctor|emergency|medicine|medication)\b/)
    ) {
      boost += 2;
    }

    // School/childcare time-sensitive
    if (text.match(/\b(school|pickup|drop off|teacher|parent conference)\b/)) {
      boost += 1;
    }

    // Essential supplies
    if (text.match(/\b(out of|no |need |buy )(diapers|milk|food|medicine)\b/)) {
      boost += 2;
    }

    return Math.min(boost, 2); // Cap at +2
  }
}