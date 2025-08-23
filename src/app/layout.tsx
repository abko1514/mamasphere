import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/lib/SessionProvider";
import { getServerSession } from "next-auth";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "MamaSphere",
  description: "All in one solution for working mothers",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <main>
          <AuthProvider session={session}>
            <ToastContainer position="top-center" />
            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}