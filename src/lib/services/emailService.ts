// lib/services/emailService.ts - Complete email service implementation
import nodemailer from "nodemailer";

interface UserData {
  email: string;
  name?: string;
  timezone?: string;
}

interface TaskForEmail {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  dueDate: Date;
  priority?: number;
  category?: string;
  completed: boolean;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static initializeTransporter() {
    if (!this.transporter) {
      // Configure based on your email provider
      // Example for Gmail (you can also use SendGrid, Mailgun, etc.)
      this.transporter = nodemailer.createTransport({
        service: "gmail", // or your email service
        auth: {
          user: process.env.EMAIL_USER, // your email
          pass: process.env.EMAIL_PASS, // your app password
        },
        // For production, consider using:
        // host: process.env.SMTP_HOST,
        // port: parseInt(process.env.SMTP_PORT || '587'),
        // secure: false,
        // auth: {
        //   user: process.env.SMTP_USER,
        //   pass: process.env.SMTP_PASS,
        // },
      });
    }
    return this.transporter;
  }

  static async sendTaskReminder(
    task: TaskForEmail,
    user: UserData
  ): Promise<boolean> {
    try {
      const transporter = this.initializeTransporter();

      const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      const priorityEmoji =
        task.priority === 1 ? "🔴" : task.priority === 2 ? "🟡" : "🟢";
      const categoryEmoji = this.getCategoryEmoji(task.category);

      const mailOptions = {
        from: `"Task Reminder" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `⏰ Task Reminder: ${task.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Task Reminder</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">⏰ Task Reminder</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Don't forget about this important task!</p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px;">
                <div style="background-color: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">
                    ${categoryEmoji} ${task.title}
                  </h2>
                  
                  ${
                    task.description
                      ? `
                    <p style="color: #666; margin: 0 0 15px 0; font-size: 16px;">
                      ${task.description}
                    </p>
                  `
                      : ""
                  }
                  
                  <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
                    <div style="background-color: white; padding: 10px 15px; border-radius: 5px; border: 1px solid #e0e0e0;">
                      <strong>Priority:</strong> ${priorityEmoji} ${this.getPriorityText(
          task.priority
        )}
                    </div>
                    
                    ${
                      task.dueDate
                        ? `
                      <div style="background-color: white; padding: 10px 15px; border-radius: 5px; border: 1px solid #e0e0e0;">
                        <strong>Due:</strong> 📅 ${formatDate(task.dueDate)}
                      </div>
                    `
                        : ""
                    }
                    
                    ${
                      task.category
                        ? `
                      <div style="background-color: white; padding: 10px 15px; border-radius: 5px; border: 1px solid #e0e0e0;">
                        <strong>Category:</strong> ${categoryEmoji} ${task.category}
                      </div>
                    `
                        : ""
                    }
                  </div>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                    View in Dashboard →
                  </a>
                </div>

                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; text-align: center;">
                  <p style="margin: 0; color: #856404; font-size: 14px;">
                    💡 <strong>Pro Tip:</strong> Complete this task and feel the satisfaction of crossing it off your list!
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  You're receiving this because you have email reminders enabled.
                  <br>
                  <a href="${
                    process.env.NEXTAUTH_URL
                  }/dashboard" style="color: #667eea;">Update your notification preferences</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Task Reminder: ${task.title}

${task.description ? task.description + "\n" : ""}

Priority: ${this.getPriorityText(task.priority)}
${task.dueDate ? "Due: " + formatDate(task.dueDate) : ""}
${task.category ? "Category: " + task.category : ""}

View your dashboard: ${process.env.NEXTAUTH_URL}/dashboard

You're receiving this because you have email reminders enabled.
        `.trim(),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Task reminder email sent:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Failed to send task reminder email:", error);
      return false;
    }
  }

  static async sendOverdueNotification(
    tasks: TaskForEmail[],
    user: UserData
  ): Promise<boolean> {
    try {
      const transporter = this.initializeTransporter();

      // const formatDate = (date: Date) => {
      //   return date.toLocaleDateString("en-US", {
      //     weekday: "short",
      //     month: "short",
      //     day: "numeric",
      //   });
      // };

      const tasksList = tasks
        .map((task) => {
          const priorityEmoji =
            task.priority === 1 ? "🔴" : task.priority === 2 ? "🟡" : "🟢";
          const categoryEmoji = this.getCategoryEmoji(task.category);
          const overdueDays = Math.floor(
            (new Date().getTime() - task.dueDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return `
          <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
            <h3 style="margin: 0 0 8px 0; color: #c53030; font-size: 16px;">
              ${categoryEmoji} ${task.title}
            </h3>
            ${
              task.description
                ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${task.description}</p>`
                : ""
            }
            <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 12px;">
              <span style="background-color: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #e0e0e0;">
                ${priorityEmoji} ${this.getPriorityText(task.priority)}
              </span>
              <span style="background-color: #fed7d7; padding: 4px 8px; border-radius: 4px; color: #c53030;">
                📅 ${overdueDays} day${overdueDays !== 1 ? "s" : ""} overdue
              </span>
            </div>
          </div>
        `;
        })
        .join("");

      const mailOptions = {
        from: `"Task Manager" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `🚨 ${tasks.length} Overdue Task${
          tasks.length !== 1 ? "s" : ""
        } - Action Required`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Overdue Tasks</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: white; padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">🚨 Overdue Tasks</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">
                  You have ${tasks.length} task${
          tasks.length !== 1 ? "s" : ""
        } that need${tasks.length === 1 ? "s" : ""} attention
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px;">
                <p style="color: #666; margin: 0 0 20px 0; font-size: 16px;">
                  Hi ${
                    user.name || "there"
                  }! 👋 These tasks are past their due date and need your attention:
                </p>

                ${tasksList}

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                    Complete Tasks Now →
                  </a>
                </div>

                <div style="background-color: #f0f8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 15px; text-align: center;">
                  <p style="margin: 0; color: #2b6cb0; font-size: 14px;">
                    💪 <strong>You've got this!</strong> Breaking down big tasks into smaller steps can make them more manageable.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  You're receiving this because you have overdue reminders enabled.
                  <br>
                  <a href="${
                    process.env.NEXTAUTH_URL
                  }/dashboard" style="color: #667eea;">Update your notification preferences</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Overdue Tasks - Action Required

Hi ${user.name || "there"}! You have ${tasks.length} overdue task${
          tasks.length !== 1 ? "s" : ""
        }:

${tasks
  .map((task) => {
    const overdueDays = Math.floor(
      (new Date().getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `• ${task.title} - ${overdueDays} day${
      overdueDays !== 1 ? "s" : ""
    } overdue`;
  })
  .join("\n")}

Complete your tasks: ${process.env.NEXTAUTH_URL}/dashboard

You're receiving this because you have overdue reminders enabled.
        `.trim(),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Overdue notification email sent:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Failed to send overdue notification email:", error);
      return false;
    }
  }

  static async sendDailyDigest(
    tasks: TaskForEmail[],
    user: UserData
  ): Promise<boolean> {
    try {
      const transporter = this.initializeTransporter();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });

      const tomorrowTasks = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === tomorrow.getTime();
      });

      const formatTaskList = (taskList: TaskForEmail[]) => {
        return taskList
          .map((task) => {
            const priorityEmoji =
              task.priority === 1 ? "🔴" : task.priority === 2 ? "🟡" : "🟢";
            const categoryEmoji = this.getCategoryEmoji(task.category);

            return `
            <div style="background-color: #f8f9ff; border: 1px solid #e6f3ff; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
              <h4 style="margin: 0 0 5px 0; color: #333; font-size: 14px;">
                ${categoryEmoji} ${task.title}
              </h4>
              ${
                task.description
                  ? `<p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">${task.description}</p>`
                  : ""
              }
              <span style="background-color: white; padding: 2px 6px; border-radius: 3px; border: 1px solid #e0e0e0; font-size: 11px;">
                ${priorityEmoji} ${this.getPriorityText(task.priority)}
              </span>
            </div>
          `;
          })
          .join("");
      };

      const mailOptions = {
        from: `"Daily Task Digest" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `📋 Your Daily Task Digest - ${today.toLocaleDateString(
          "en-US",
          { weekday: "long", month: "long", day: "numeric" }
        )}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Daily Task Digest</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">📋 Daily Task Digest</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">
                  ${today.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px;">
                <p style="color: #666; margin: 0 0 25px 0; font-size: 16px;">
                  Good morning, ${
                    user.name || "there"
                  }! ☀️ Here's what's on your agenda:
                </p>

                ${
                  todayTasks.length > 0
                    ? `
                  <div style="margin-bottom: 25px;">
                    <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #667eea;">
                      📅 Due Today (${todayTasks.length})
                    </h2>
                    ${formatTaskList(todayTasks)}
                  </div>
                `
                    : ""
                }

                ${
                  tomorrowTasks.length > 0
                    ? `
                  <div style="margin-bottom: 25px;">
                    <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #9f7aea;">
                      📆 Due Tomorrow (${tomorrowTasks.length})
                    </h2>
                    ${formatTaskList(tomorrowTasks)}
                  </div>
                `
                    : ""
                }

                ${
                  todayTasks.length === 0 && tomorrowTasks.length === 0
                    ? `
                  <div style="text-align: center; padding: 40px 20px;">
                    <h2 style="color: #48bb78; font-size: 20px; margin: 0 0 10px 0;">🎉 All Clear!</h2>
                    <p style="color: #666; font-size: 16px; margin: 0;">
                      You have no tasks due today or tomorrow. Great job staying on top of things!
                    </p>
                  </div>
                `
                    : ""
                }

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                    Open Dashboard →
                  </a>
                </div>

                <div style="background-color: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 15px; text-align: center;">
                  <p style="margin: 0; color: #276749; font-size: 14px;">
                    🌟 <strong>Daily Motivation:</strong> Every completed task is a step closer to your goals!
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  You're receiving this daily digest because you have it enabled in your preferences.
                  <br>
                  <a href="${
                    process.env.NEXTAUTH_URL
                  }/dashboard" style="color: #667eea;">Update your notification preferences</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Daily Task Digest - ${today.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}

Good morning, ${user.name || "there"}!

${
  todayTasks.length > 0
    ? `
Due Today (${todayTasks.length}):
${todayTasks.map((task) => `• ${task.title}`).join("\n")}
`
    : ""
}

${
  tomorrowTasks.length > 0
    ? `
Due Tomorrow (${tomorrowTasks.length}):
${tomorrowTasks.map((task) => `• ${task.title}`).join("\n")}
`
    : ""
}

${
  todayTasks.length === 0 && tomorrowTasks.length === 0
    ? "All clear! No tasks due today or tomorrow."
    : ""
}

Open your dashboard: ${process.env.NEXTAUTH_URL}/dashboard

You're receiving this daily digest because you have it enabled in your preferences.
        `.trim(),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Daily digest email sent:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Failed to send daily digest email:", error);
      return false;
    }
  }

  static async sendTestEmail(email: string, name?: string): Promise<boolean> {
    try {
      const transporter = this.initializeTransporter();

      const mailOptions = {
        from: `"Task Manager" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "✅ Email Setup Test - Task Manager",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Test</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">✅ Email Setup Successful!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your email notifications are now configured</p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px; text-align: center;">
                <div style="background-color: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 10px 0; color: #276749; font-size: 18px;">🎉 Great news!</h2>
                  <p style="margin: 0; color: #276749; font-size: 16px;">
                    Hi ${
                      name || "there"
                    }! Your email is successfully configured for task reminders.
                  </p>
                </div>

                <div style="background-color: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: left;">
                  <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📧 You'll now receive:</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #666;">
                    <li style="margin-bottom: 8px;">Individual task reminders when they're due</li>
                    <li style="margin-bottom: 8px;">Daily digest of upcoming tasks</li>
                    <li style="margin-bottom: 8px;">Overdue task notifications</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                     style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                    Go to Dashboard →
                  </a>
                </div>

                <p style="color: #666; font-size: 14px; margin: 20px 0 0 0;">
                  You can update your notification preferences anytime from your dashboard.
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  Welcome to smart task management! 🚀
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Email Setup Successful!

Hi ${name || "there"}! Your email is successfully configured for task reminders.

You'll now receive:
• Individual task reminders when they're due
• Daily digest of upcoming tasks  
• Overdue task notifications

Go to your dashboard: ${process.env.NEXTAUTH_URL}/dashboard

You can update your notification preferences anytime from your dashboard.

Welcome to smart task management!
        `.trim(),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Test email sent:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ Failed to send test email:", error);
      return false;
    }
  }

  private static getCategoryEmoji(category?: string): string {
    const emojiMap: { [key: string]: string } = {
      household: "🏠",
      kids: "👶",
      health: "🏥",
      work: "💼",
      personal: "👤",
      general: "📋",
    };
    return emojiMap[category || "general"] || "📋";
  }

  private static getPriorityText(priority?: number): string {
    const priorityMap: { [key: number]: string } = {
      1: "High",
      2: "Medium",
      3: "Low",
      4: "Low",
      5: "Low",
    };
    return priorityMap[priority || 3] || "Low";
  }
}
