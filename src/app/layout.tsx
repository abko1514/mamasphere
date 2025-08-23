import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";
//import ClientLayout from "./ClientLayout";
//import { CronBackgroundService } from "@/lib/services/cronBackgroundService";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MamaSphere",
  description: "All in one solution for working mothers",
  manifest: "/manifest.json",
};

// Initialize cron on server startup
//if (typeof window === "undefined") {
  //CronBackgroundService.ensureCronIsRunning().catch(console.error);
//}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
          <Navbar />
          <main>
            {children}
            {/* Register Service Worker */}
            <Script id="register-sw" strategy="afterInteractive">
              {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    }, function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `}
            </Script>
          </main>
        
      </body>
    </html>
  );
}