"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function VerifyEmailSent() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-gray-600 dark:text-gray-300">
          We&apos;ve sent you a verification link. Please check your email and
          click the link to verify your account.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If you don&apos;t see the email, check your spam folder.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="mt-4 inline-block text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-500"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
