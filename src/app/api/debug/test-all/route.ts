// ===== 2. Fix api/debug/test-all/route.ts =====
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { EmailService } from "@/lib/services/emailService";

interface DebugResults {
  timestamp: string;
  tests: Record<string, unknown>;
  error?: string;
}

export async function POST(request: Request) {
  const results: DebugResults = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // Test 1: Environment Variables
    results.tests.environment = {
      brevoApiKey: !!process.env.BREVO_API_KEY,
      mongodbUri: !!process.env.MONGODB_URI,
      senderEmail: !!process.env.SENDER_EMAIL,
      allConfigured: !!(
        process.env.BREVO_API_KEY &&
        process.env.MONGODB_URI &&
        process.env.SENDER_EMAIL
      ),
    };

    // Test 2: MongoDB Connection
    try {
      const client = await clientPromise;
      const db = client.db("mamasphere");
      await db.collection("test").findOne({});
      results.tests.mongodb = { connected: true };
    } catch (error) {
      results.tests.mongodb = {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Test 3: Email Service
    if (process.env.BREVO_API_KEY) {
      const { email } = await request.json();
      if (email) {
        try {
          const testTask = {
            _id: "debug-test",
            title: "🧪 Debug Test Email",
            description:
              "This email was sent from the debug endpoint to verify everything is working!",
            priority: 3,
            category: "general",
            userId: "debug-user",
          };

          const success = await EmailService.sendTaskReminder(testTask, {
            email,
            name: "Debug Tester",
          });

          results.tests.email = { sent: success };
        } catch (error) {
          results.tests.email = {
            sent: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      } else {
        results.tests.email = {
          sent: false,
          error: "No email provided in request body",
        };
      }
    } else {
      results.tests.email = {
        sent: false,
        error: "BREVO_API_KEY not configured",
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      {
        ...results,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
