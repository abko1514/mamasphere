"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  Target,
  Zap,
  Shield,
  Sunrise,
  Feather,
  Rocket,
} from "lucide-react";
import Footer from "@/components/Footer";
import Team from "@/components/Team";

const MamaSphereAbout = () => {
  const [activeSection, setActiveSection] = useState<keyof typeof sections>("mission");

  const sections = {
    mission: {
      icon: Target,
      title: "Our Mission",
      description:
        "Transforming the working mother's journey through holistic, technology-driven support.",
      details: [
        "Empowering mothers to seamlessly balance professional aspirations and family responsibilities",
        "Creating an ecosystem that recognizes and addresses the unique challenges of working mothers",
        "Leveraging AI and community support to provide personalized, comprehensive solutions",
      ],
    },
    vision: {
      icon: Sunrise,
      title: "Our Vision",
      description:
        "A world where every mother can thrive professionally and personally without compromise.",
      details: [
        "Redefining workplace support and family integration",
        "Building a global network that celebrates and supports maternal potential",
        "Creating technological solutions that adapt to the evolving needs of modern mothers",
      ],
    },
    values: {
      icon: Heart,
      title: "Core Values",
      description:
        "The fundamental principles that drive MamaSphere's approach.",
      details: [
        "Empathy: Deep understanding of mothers' multifaceted challenges",
        "Innovation: Personalized approaches that recognize individual journeys",
        "Community: Strength through collective support and shared experiences",
      ],
    },
  };

  const whyMamaSphere = [
    {
      icon: Shield,
      title: "Comprehensive Support",
      description:
        "Unlike fragmented solutions, MamaSphere offers an all-in-one platform addressing professional, personal, and family needs.",
    },
    {
      icon: Zap,
      title: "AI-Powered Personalization",
      description:
        "Advanced algorithms that learn and adapt to each mother's unique lifestyle and challenges.",
    },
    {
      icon: Users,
      title: "Community-Driven Approach",
      description:
        "More than a tool—a supportive ecosystem connecting mothers with similar experiences and challenges.",
    },
    {
      icon: Rocket,
      title: "Continuous Innovation",
      description:
        "Constantly evolving features that anticipate and solve emerging challenges for working mothers.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
              MamaSphere:
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                Empowering Mothers, Transforming Lives
              </span>
            </h1>
            <p className="max-w-4xl mx-auto text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              A revolutionary platform designed to support, empower, and
              celebrate working mothers by providing innovative technological
              solutions that bridge professional ambitions and family
              responsibilities.
            </p>
          </motion.div>

          {/* Mission, Vision, Values Selector */}
          <div className="mb-16">
            <div className="flex justify-center space-x-4 mb-8">
              {Object.keys(sections).map((key) => {
                const sectionKey = key as keyof typeof sections;
                const Section = sections[sectionKey];
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(sectionKey)}
                    className={`
                    flex items-center px-6 py-3 rounded-full transition-all duration-300
                    ${
                      activeSection === key
                        ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }
                  `}
                  >
                    <Section.icon className="mr-2 h-5 w-5" />
                    {Section.title}
                  </button>
                );
              })}
            </div>

            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center"
            >
              {(() => {
                const ActiveIcon = sections[activeSection].icon;
                return (
                  <>
                    <ActiveIcon className="mx-auto h-16 w-16 text-pink-500 mb-6" />
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                      {sections[activeSection].title}
                    </h2>
                    <p className="text-2xl text-gray-600 dark:text-gray-300 mb-6">
                      {sections[activeSection].description}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {sections[activeSection].details.map((detail, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl"
                        >
                          <p className="text-gray-700 dark:text-gray-300">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>

          {/* Why MamaSphere */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
              Why MamaSphere? Our Unique Approach
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {whyMamaSphere.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl hover:shadow-lg transition-all"
                >
                  <div className="bg-gradient-to-br from-pink-600 to-rose-800 rounded-full w-16 h-16 flex items-center justify-center p-2 shadow-md transform transition-transform group-hover:rotate-3 mx-auto mb-3 text-center">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Motto and Inspiration */}
          <div className="text-center bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-3xl p-16">
            <Feather className="mx-auto h-16 w-16 mb-8 text-white" />
            <h2 className="text-4xl font-bold mb-6">
              Our Motto: Empowerment Through Understanding
            </h2>
            <p className="max-w-4xl mx-auto text-2xl mb-8">
              Not all heroes wear capes. Some juggle careers, raise families,
              and change the world—one moment at a time. MamaSphere is here to
              lighten that load and amplify every mother&apos;s potential.
            </p>
          </div>
              <div className="flex justify-center items-center">
          <Team/>
              </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MamaSphereAbout;
