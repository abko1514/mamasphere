"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Utensils,
  Shield,
  Play,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";


const Hero = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Calendar,
      title: "AI-Powered Scheduling",
      description:
        "Intelligent time management that adapts to your unique family and work life. Our AI creates personalized schedules that maximize productivity and reduce stress.",
      color: "from-pink-400 to-pink-500",
      img: "images/hero-ai.jpeg",
    },
    {
      icon: Users,
      title: "Childcare Co-Op Network",
      description:
        "Connect with local mothers to share childcare responsibilities. Find trusted support for pickups, babysitting, and emergency care.",
      color: "from-pink-400 to-pink-500",
      img: "images/hero-child.jpeg",
    },
    {
      icon: Utensils,
      title: "Smart Meal Planning",
      description:
        "Customized meal plans that consider your dietary preferences, allergies, and time constraints. Healthy eating made simple for busy moms.",
      color: "from-pink-400 to-pink-500",
      img: "images/hero-meal.jpeg",
    },
    {
      icon: Shield,
      title: "Wellness Tracking",
      description:
        "Comprehensive wellness monitoring that tracks your physical and mental health. Get personalized insights and support.",
      color: "from-pink-400 to-pink-500",
      img: "images/hero-wellness.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
            Empowering
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
              Working Mothers
            </span>
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            MamaSphere combines AI-powered tools to help you balance work,
            family, and personal wellness. Your all-in-one support platform.
          </p>
          <div className="flex space-x-4">
            <Link href="/features">
              <button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
                Get Started
              </button>
            </Link>
            <Link href="/about">
              <button className="flex items-center text-gray-700 dark:text-gray-300 px-6 py-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <Play className="mr-2" />
                Know More
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="  max-w-2xl">
            <img
              src="https://img.freepik.com/premium-vector/african-american-mother-with-child-working-laptop-from-home_590052-445.jpg?semt=ais_hybrid"
              alt="MamaSphere Dashboard"
              className="rounded-2xl w-full"
            />
            {/* <img
              src="images/image.png"
              alt="MamaSphere Dashboard"
              className="rounded-2xl shadow-lg"
            /> */}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white dark:bg-gray-800 rounded-t-[3rem]">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Features That Support You
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Designed by daughters, for mothers. Our comprehensive platform
            addresses the unique challenges of balancing work and family life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Feature Buttons */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`
                  w-full text-left p-6 rounded-xl transition-all duration-300 
                  ${
                    activeFeature === index
                      ? `bg-gradient-to-r ${feature.color} text-white`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
              >
                <div className="flex items-center">
                  <feature.icon className="mr-4 h-8 w-8" />
                  <span className="text-2xl font-semibold">
                    {feature.title}
                  </span>
                  <ChevronRight className="ml-auto opacity-50" />
                </div>
                {activeFeature === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 text-lg"
                  >
                    {feature.description}
                  </motion.p>
                )}
              </motion.button>
            ))}
          </div>

          {/* Feature Illustration */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center bg-gradient-to-br from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-12"
          >
            <img
              src={`${features[activeFeature].img}`}
              alt={features[activeFeature].title}
              className="rounded-2xl shadow-xl w-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-5xl font-bold mb-6">Your Journey, Our Mission</h3>
          <p className="text-2xl mb-12 max-w-2xl mx-auto">
            Join thousands of mothers who are reclaiming their time, advancing
            their careers, and enjoying family life with MamaSphere.
          </p>
          <div className="flex justify-center space-x-6">
            <button className="bg-white text-pink-600 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
              Start Your Free Trial
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-pink-600 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
