// ===== 7. Fix components/notifications/EmailSetup.tsx =====
import { useState } from "react";
import { Mail, Bell, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface NotificationPreferences {
  email: string;
  name?: string;
  dailyDigest?: boolean;
  overdueReminders?: boolean;
  taskReminders?: boolean;
}

interface EmailSetupProps {
  onSetupComplete: (preferences: NotificationPreferences) => Promise<boolean>;
  onSendTest: (email: string, name?: string) => Promise<boolean>;
}

export default function EmailSetup({
  onSetupComplete,
  onSendTest,
}: EmailSetupProps) {
  const [formData, setFormData] = useState<NotificationPreferences>({
    email: "",
    name: "",
    dailyDigest: true,
    overdueReminders: true,
    taskReminders: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email?.trim()) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const success = await onSetupComplete(formData);

      if (success) {
        setStatus({
          type: "success",
          message: "Email notifications setup successfully! 🎉",
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to setup email notifications. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestEmail = async () => {
    if (!formData.email?.trim()) return;

    setIsTesting(true);
    setStatus({ type: null, message: "" });

    try {
      const success = await onSendTest(formData.email, formData.name);

      if (success) {
        setStatus({
          type: "success",
          message: "Test email sent! Check your inbox. 📧",
        });
      } else {
        setStatus({
          type: "error",
          message:
            "Failed to send test email. Please check your email address.",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to send test email." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Mail className="text-blue-500" size={20} />
          Email Notifications Setup
          <Bell className="text-indigo-400 ml-auto" size={16} />
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Get email reminders for your tasks and never miss anything important!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Email and Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Super Mom"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Notification Preferences
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.taskReminders}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    taskReminders: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={isSubmitting}
              />
              <div>
                <div className="font-medium text-gray-700">
                  ⏰ Task Reminders
                </div>
                <div className="text-sm text-gray-500">
                  Get notified when your task reminders are due
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.overdueReminders}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    overdueReminders: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={isSubmitting}
              />
              <div>
                <div className="font-medium text-gray-700">
                  📅 Overdue Alerts
                </div>
                <div className="text-sm text-gray-500">
                  Get daily emails about overdue tasks
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dailyDigest}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dailyDigest: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={isSubmitting}
              />
              <div>
                <div className="font-medium text-gray-700">🌅 Daily Digest</div>
                <div className="text-sm text-gray-500">
                  Morning summary of today&apos;s and tomorrow&apos;s tasks
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Status Message */}
        {status.type && (
          <div
            className={`p-4 rounded-lg flex items-center gap-2 ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={!formData.email?.trim() || isTesting || isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={16} />
                Test Email
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={!formData.email?.trim() || isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Bell size={16} />
                Enable Notifications
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-blue-800 mb-2">
            📧 How Email Notifications Work:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>Task Reminders:</strong> Sent at the exact time you set
              for each task
            </li>
            <li>
              • <strong>Daily Digest:</strong> Morning summary sent at 8:00 AM
              every day
            </li>
            <li>
              • <strong>Overdue Alerts:</strong> Daily check at 6:00 PM for
              overdue tasks
            </li>
            <li>
              • <strong>Free Service:</strong> Using Brevo&apos;s free tier (300
              emails/day)
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}