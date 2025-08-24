"use client";
import { useEffect } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      console.log("Email notification system ready");
    }
  }, []);

  return <>{children}</>;
}
