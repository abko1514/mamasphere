import { NextResponse } from "next/server";

interface PrioritizeRequestBody {
  title: string;
  description?: string;
  dueDate?: string | null;
}

interface HuggingFaceResult {
  label: string;
  score: number;
}

interface HuggingFaceResponse {
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const {
      title,
      description = "",
      dueDate,
    }: PrioritizeRequestBody = await request.json();

    console.log("Processing AI prioritization for:", {
      title,
      description,
      dueDate,
    });

    let priority: number = 3; // Default
    let aiProcessed = false;

    // Try Hugging Face API first
    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
          {
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: `${title}. ${description}`,
            }),
          }
        );

        if (response.ok) {
          const result: HuggingFaceResult[] | HuggingFaceResponse =
            await response.json();

          // Check if it's an error response
          if (!Array.isArray(result) && (result as HuggingFaceResponse).error) {
            console.log(
              "Hugging Face model loading:",
              (result as HuggingFaceResponse).error
            );
          } else if (Array.isArray(result) && result.length > 0) {
            // Process sentiment result
            const sentiment = result[0];

            // LABEL_0 = Negative, LABEL_1 = Neutral, LABEL_2 = Positive
            if (sentiment.label === "LABEL_0" && sentiment.score > 0.6) {
              priority = 4; // Negative sentiment might indicate urgency
            } else if (sentiment.label === "LABEL_2" && sentiment.score > 0.6) {
              priority = 2; // Positive sentiment might be less urgent
            } else {
              priority = 3; // Neutral
            }

            aiProcessed = true;
            console.log("AI sentiment analysis result:", sentiment);
          }
        } else {
          console.log(
            "Hugging Face API error:",
            response.status,
            response.statusText
          );
        }
      } catch (hfError) {
        console.log("Hugging Face API failed:", hfError);
      }
    } else {
      console.log("HUGGINGFACE_API_KEY not found in environment variables");
    }

    // Apply rule-based adjustments (this always runs)
    const text: string = `${title} ${description}`.toLowerCase();

    // Urgent keywords boost priority significantly
    const urgentKeywords = [
      "urgent",
      "asap",
      "emergency",
      "immediate",
      "critical",
      "now",
      // ADD MOM-SPECIFIC:
      "kids sick",
      "child sick",
      "fever",
      "pediatrician",
      "school pickup",
      "diaper emergency",
      "crying",
      "injury",
      "bleeding",
      "out of diapers",
      "no milk",
    ];
    if (urgentKeywords.some((keyword) => text.includes(keyword))) {
      priority = 5;
    }

    // Important keywords boost priority moderately
    const importantKeywords = [
      "important",
      "deadline",
      "meeting",
      "appointment",
      "doctor",
      // ADD MOM-SPECIFIC:
      "permission slip",
      "school event",
      "teacher meeting",
      "parent conference",
      "medication",
      "pickup",
      "drop off",
      "before nap",
      "bedtime",
    ];
    if (importantKeywords.some((keyword) => text.includes(keyword))) {
      priority = Math.min(priority + 1, 5);
    }

    // Low priority keywords reduce priority
    const lowPriorityKeywords = [
      "sometime",
      "eventually",
      "when possible",
      "maybe",
      "later",
    ];
    if (lowPriorityKeywords.some((keyword) => text.includes(keyword))) {
      priority = Math.max(priority - 1, 1);
    }

    // Due date consideration
    if (dueDate) {
      try {
        const daysUntilDue: number = Math.ceil(
          (new Date(dueDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        console.log("Days until due:", daysUntilDue);

        if (daysUntilDue <= 0) {
          priority = 5; // Overdue = urgent
        } else if (daysUntilDue <= 1) {
          priority = Math.min(priority + 2, 5);
        } else if (daysUntilDue <= 3) {
          priority = Math.min(priority + 1, 5);
        }
      } catch (dateError) {
        console.log("Error processing due date:", dateError);
      }
    }

    // Time of day context
    const now = new Date();
    const currentHour = now.getHours();

    // Morning tasks (6-9 AM)
    if (currentHour >= 6 && currentHour <= 9) {
      if (
        text.includes("school") ||
        text.includes("breakfast") ||
        text.includes("morning")
      ) {
        priority = Math.min(priority + 1, 5);
      }
    }

    // Evening tasks (5-8 PM)
    if (currentHour >= 17 && currentHour <= 20) {
      if (
        text.includes("dinner") ||
        text.includes("bedtime") ||
        text.includes("bath")
      ) {
        priority = Math.min(priority + 1, 5);
      }
    }

    const finalPriority = Math.max(1, Math.min(5, priority));

    console.log("Final priority:", finalPriority, "AI processed:", aiProcessed);

    return NextResponse.json({
      priority: finalPriority,
      aiProcessed,
      message: aiProcessed
        ? "Priority set using AI analysis"
        : "Priority set using smart rules",
    });
  } catch (error: unknown) {
    console.error("AI prioritization error:", error);

    // Return fallback priority
    return NextResponse.json(
      {
        priority: 3,
        aiProcessed: false,
        error: "AI service temporarily unavailable",
        message: "Using default priority",
      },
      { status: 200 }
    );
  }
}