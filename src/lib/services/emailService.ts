interface BrevoEmailRequest {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
  tags?: string[];
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string | Date;
  reminder?: string | Date;
  priority?: number;
  category?: string;
  userId: string;
}

interface User {
  email: string;
  name?: string;
  timezone?: string;
}

export class EmailService {
  private static readonly BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
  private static readonly SENDER_EMAIL =
    process.env.SENDER_EMAIL || "noreply@mamasphere.com";
  private static readonly SENDER_NAME = process.env.SENDER_NAME || "MamaSphere";

  static async sendEmail(request: BrevoEmailRequest): Promise<boolean> {
    try {
      if (!process.env.BREVO_API_KEY) {
        console.error("❌ BREVO_API_KEY not found in environment variables");
        return false;
      }

      console.log(
        "📧 Sending email to:",
        request.to[0].email,
        "Subject:",
        request.subject
      );

      const response = await fetch(this.BREVO_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "❌ Brevo API error:",
          response.status,
          response.statusText
        );
        console.error("Error details:", errorText);
        return false;
      }

      const result = await response.json();
      console.log("✅ Email sent successfully! Message ID:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return false;
    }
  }

  static generateTaskReminderEmail(task: Task, user: User): BrevoEmailRequest {
    const priorityEmojis = {
      1: "📋",
      2: "📝",
      3: "⚡",
      4: "🔥",
      5: "🚨",
    };

    const categoryEmojis = {
      household: "🏠",
      kids: "👶",
      health: "🏥",
      work: "💼",
      personal: "✨",
      general: "📌",
    };

    const priorityEmoji =
      priorityEmojis[task.priority as keyof typeof priorityEmojis] || "📝";
    const categoryEmoji =
      categoryEmojis[task.category as keyof typeof categoryEmojis] || "📌";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Task Reminder</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8f9fa; 
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .content { padding: 30px 20px; }
          .task-card { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            border-left: 4px solid #ec4899; 
          }
          .priority-badge { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
            margin-bottom: 10px; 
          }
          .priority-high { background: #fee2e2; color: #dc2626; }
          .priority-medium { background: #fef3c7; color: #d97706; }
          .priority-low { background: #dcfce7; color: #16a34a; }
          .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            margin: 20px 0; 
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 12px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">⏰ Task Reminder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Hey ${
              user.name || "Super Mom"
            }! You have a task coming up.</p>
          </div>
          
          <div class="content">
            <div class="task-card">
              <div class="priority-badge priority-${
                task.priority && task.priority >= 4
                  ? "high"
                  : task.priority && task.priority >= 3
                  ? "medium"
                  : "low"
              }">
                ${priorityEmoji} Priority ${task.priority || 3}
              </div>
              
              <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px;">
                ${categoryEmoji} ${task.title}
              </h2>
              
              ${
                task.description
                  ? `<p style="color: #6b7280; margin: 10px 0; line-height: 1.5;">${task.description}</p>`
                  : ""
              }
              
              ${
                task.dueDate
                  ? `<p style="color: #dc2626; font-weight: bold; margin: 15px 0 0 0;">📅 Due: ${new Date(
                      task.dueDate
                    ).toLocaleString()}</p>`
                  : ""
              }
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              This is a friendly reminder about your upcoming task. You've got this! 💪
            </p>
            
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/dashboard" class="cta-button">
              View in MamaSphere →
            </a>
          </div>
          
          <div class="footer">
            <p>You're receiving this because you set a reminder for this task.</p>
            <p>MamaSphere - Empowering busy moms, one task at a time! 🌟</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Task Reminder: ${task.title}

${task.description || ""}

${task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleString()}` : ""}

Priority: ${task.priority || 3}/5 ${priorityEmoji}
Category: ${task.category || "general"} ${categoryEmoji}

View your tasks: ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/dashboard

You're receiving this because you set a reminder for this task.
MamaSphere - Empowering busy moms! 🌟
    `;

    return {
      sender: {
        email: this.SENDER_EMAIL,
        name: this.SENDER_NAME,
      },
      to: [
        {
          email: user.email,
          name: user.name || "Super Mom",
        },
      ],
      subject: `⏰ Reminder: ${task.title}`,
      htmlContent,
      textContent,
      tags: ["task-reminder", "automated"],
    };
  }

  static async sendTaskReminder(task: Task, user: User): Promise<boolean> {
    const emailData = this.generateTaskReminderEmail(task, user);
    return await this.sendEmail(emailData);
  }

  static async sendOverdueNotification(
    tasks: Task[],
    user: User
  ): Promise<boolean> {
    const emailData = this.generateOverdueEmail(tasks, user);
    return await this.sendEmail(emailData);
  }

    static async sendDailyDigest(tasks: Task[], user: User): Promise<boolean> {
      const emailData = this.generateDailyDigestEmail(tasks, user);
      return await this.sendEmail(emailData);
    }
  
    static generateDailyDigestEmail(tasks: Task[], user: User): BrevoEmailRequest {
      const tasksHtml = tasks
        .map(
          (task) => `
            <li style="margin-bottom: 10px;">
              <strong>${task.title}</strong>
              ${task.dueDate ? `<span style="color: #2563eb;"> (Due: ${new Date(task.dueDate).toLocaleString()})</span>` : ""}
              ${task.description ? `<br/><span style="color: #6b7280;">${task.description}</span>` : ""}
            </li>
          `
        )
        .join("");
  
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Daily Task Digest</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🌞 Daily Task Digest</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${user.name || "Super Mom"}, here are your tasks for today!</p>
            </div>
            <div class="content">
              <ul style="padding-left: 20px;">
                ${tasksHtml}
              </ul>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#38bdf8 0%,#6366f1 100%);color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;margin:20px 0;">
                View in MamaSphere →
              </a>
            </div>
            <div class="footer">
              <p>MamaSphere - Empowering busy moms, one task at a time! 🌟</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
      const textContent = `
  Daily Task Digest
  
  ${tasks
        .map(
          (task) =>
            `- ${task.title}${task.dueDate ? ` (Due: ${new Date(task.dueDate).toLocaleString()})` : ""}${
              task.description ? `\n  ${task.description}` : ""
            }`
        )
        .join("\n")}
  
  View your tasks: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard
  
  MamaSphere - Empowering busy moms! 🌟
      `;
  
      return {
        sender: {
          email: this.SENDER_EMAIL,
          name: this.SENDER_NAME,
        },
        to: [
          {
            email: user.email,
            name: user.name || "Super Mom",
          },
        ],
        subject: `🌞 Daily Task Digest`,
        htmlContent,
        textContent,
        tags: ["daily-digest", "automated"],
      };
    }

  static generateOverdueEmail(tasks: Task[], user: User): BrevoEmailRequest {
    const overdueTasksHtml = tasks
      .map(
        (task) => `
          <li style="margin-bottom: 10px;">
            <strong>${task.title}</strong>
            ${task.dueDate ? `<span style="color: #dc2626;"> (Due: ${new Date(task.dueDate).toLocaleString()})</span>` : ""}
            ${task.description ? `<br/><span style="color: #6b7280;">${task.description}</span>` : ""}
          </li>
        `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Overdue Tasks Notification</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ef4444 0%, #f59e42 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🚨 Overdue Tasks Alert</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${user.name || "Super Mom"}, you have overdue tasks!</p>
          </div>
          <div class="content">
            <p style="color: #dc2626; font-weight: bold;">The following tasks are overdue:</p>
            <ul style="padding-left: 20px;">
              ${overdueTasksHtml}
            </ul>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#ef4444 0%,#f59e42 100%);color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;margin:20px 0;">
              View in MamaSphere →
            </a>
          </div>
          <div class="footer">
            <p>MamaSphere - Empowering busy moms, one task at a time! 🌟</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Overdue Tasks Alert

${tasks
      .map(
        (task) =>
          `- ${task.title}${task.dueDate ? ` (Due: ${new Date(task.dueDate).toLocaleString()})` : ""}${
            task.description ? `\n  ${task.description}` : ""
          }`
      )
      .join("\n")}

View your tasks: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard

MamaSphere - Empowering busy moms! 🌟
    `;

    return {
      sender: {
        email: this.SENDER_EMAIL,
        name: this.SENDER_NAME,
      },
      to: [
        {
          email: user.email,
          name: user.name || "Super Mom",
        },
      ],
      subject: `🚨 Overdue Tasks Notification`,
      htmlContent,
      textContent,
      tags: ["overdue-tasks", "automated"],
    };
  }
}
