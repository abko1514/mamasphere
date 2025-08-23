"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { CheckCircle, Zap, Users, Calendar, Brain, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

const features = [
  {
    title: "AI-Powered Scheduling",
    description:
      "Our intelligent assistant helps you prioritize tasks, set deadlines, and achieve personal goals with ease.",
    icon: Brain,
  },
  {
    title: "Meal Planning",
    description:
      "Get customized meal plans, grocery lists, and batch cooking suggestions to save time and reduce stress.",
    icon: Calendar,
  },
  {
    title: "Childcare Co-Op Network",
    description:
      "Connect with local mothers to share childcare responsibilities, with AI-suggested optimal matches.",
    icon: Users,
  },
  {
    title: "Career Support",
    description:
      "Access tailored resources and guidance for navigating maternity leave, returning to work, or advancing your career.",
    icon: Zap,
  },
  {
    title: "Family Activity Planning",
    description:
      "Discover and schedule quality family time with personalized activity suggestions that fit your busy life.",
    icon: Heart,
  },
  {
    title: "Wellness Tracking",
    description:
      "Monitor your mental and physical well-being with AI-powered fitness plans and mindfulness resources.",
    icon: CheckCircle,
  },
];

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  }, [controls]);

  return (
    <>
      <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-500 dark:from-gray-200 dark:via-gray-100 dark:to-white">
                Empower Your Day
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 sm:mt-8">
              Discover how MamaSphere&apos;s features can transform your daily life
              as a working mother.
            </p>
          </motion.div>

          <div className="mt-24 grid gap-10 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg p-8 transition-all duration-300 ease-in-out",
                  "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                  hoveredIndex === index ? "scale-105 z-10" : ""
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                custom={index}
              >
                <div className="bg-gradient-to-br from-pink-600 to-rose-800 rounded-full w-16 h-16 flex items-center justify-center p-2 shadow-md transform transition-transform group-hover:rotate-3 mx-auto absolute -top-7 text-center left-0 right-0">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {feature.description}
                  </p>
                </div>
                {/* <motion.div
                className="mt-6 flex items-center text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  Included in all plans
                </span>
              </motion.div> */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full opacity-50 blur-2xl group-hover:opacity-75 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
