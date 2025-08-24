//  app/api/test-email/route.ts 
import { NextResponse } from "next/server";
import { EmailService } from "@/lib/services/emailService";

interface TestEmailRequest {
  email: string;
  name?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email, name }: TestEmailRequest = await request.json();

    console.log("Sending test email to:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if required environment variables are set
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY not configured");
      return NextResponse.json(
        {
          error: "Email service not configured. Please contact administrator.",
        },
        { status: 500 }
      );
    }

    // Create a test task
    const testTask = {
      _id: "test-task-id",
      title: "✅ Email Setup Test",
      description:
        "This is a test email to verify your notification setup is working correctly! If you received this, your email notifications are ready to go. 🎉",
      dueDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      priority: 4,
      category: "general",
      userId: "test-user",
    };

    const testUser = {
      email,
      name: name || "Super Mom",
    };

    console.log("Attempting to send test email with Brevo...");
    const success = await EmailService.sendTaskReminder(testTask, testUser);

    if (success) {
      console.log("✅ Test email sent successfully to:", email);
      return NextResponse.json({
        success: true,
        message:
          "Test email sent successfully! Check your inbox (and spam folder).",
        email,
      });
    } else {
      console.error("❌ Failed to send test email via Brevo");
      return NextResponse.json(
        {
          error:
            "Failed to send test email. Please check your email service configuration or try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in test email endpoint:", error);
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
