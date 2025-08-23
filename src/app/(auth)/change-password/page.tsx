"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

const ChangePassword = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Client-side validations
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        setLoading(false);
        return;
      }

      if (formData.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters long");
        setLoading(false);
        return;
      }

      // API request
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          toast.error("Current password is incorrect");
          setLoading(false);
          return;
        }
        if (response.status === 401) {
          toast.error("You must be logged in");
          setLoading(false);
          return;
        }
        if (response.status === 404) {
          toast.error("User not found");
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to change password");
      }

      // Success case
      toast.success("Password changed successfully. Redirecting to login...");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Delay logout for toast to be visible
      setTimeout(async () => {
        try {
          await signOut({
            redirect: true,
            callbackUrl: "/login",
          });
        } catch (signOutError) {
          console.error("Error signing out:", signOutError);
          router.push("/login");
        }
      }, 2000);
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    sessionStatus === "authenticated" && (
      <>
        <Link href="/dashboard" passHref>
          <div className="flex gap-2 m-5">
            <ArrowLeftCircle />
            <p className="text-md">Back to feed</p>
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="relative m-[2rem] px-10 py-14 rounded-lg bg-white dark:bg-neutral-950 w-full max-w-[520px] mt-[0]"
          >
            <div className="space-y-4 relative z-10">
              <h1 className="mb-2 text-center text-[1.35rem] font-medium">
                Change Password
              </h1>
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium mb-1 text-[#999]"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 px-4 py-3 border-[2px] rounded-md outline-black text-gray-800 dark:text-white border-slate-300 dark:border-none"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-1 text-[#999]"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 px-4 py-3 border-[2px] rounded-md outline-black text-gray-800 dark:text-white border-slate-300 dark:border-none"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1 text-[#999]"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 px-4 py-3 border-[2px] rounded-md outline-black text-gray-800 dark:text-white border-slate-300 dark:border-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-teal-500 dark:bg-neutral-700 text-white rounded-md hover:bg-teal-700 dark:hover:bg-neutral-600 transition-colors cursor-pointer w-full"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </>
    )
  );
};

export default ChangePassword;
