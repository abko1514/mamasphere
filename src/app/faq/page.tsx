"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  Globe,
  Shield,
  CreditCard,
} from "lucide-react";
import Footer from "@/components/Footer";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const faqCategories: FAQCategories = {
    general: {
      icon: HelpCircle,
      title: "General Questions",
      questions: [
        {
          question: "What is MamaSphere?",
          answer:
            "MamaSphere is a comprehensive platform designed to support working mothers by providing AI-powered tools for scheduling, meal planning, childcare coordination, career support, and wellness tracking.",
        },
        {
          question: "Who can use MamaSphere?",
          answer:
            "MamaSphere is primarily designed for working mothers aged 25-45, including professionals returning from maternity leave, mothers managing school-age children, and homemakers seeking better organization tools.",
        },
        {
          question: "Is MamaSphere free?",
          answer:
            "We offer tiered pricing plans starting from ₹199/month. Each plan provides different levels of features to suit various needs and budgets.",
        },
      ],
    },
    platform: {
      icon: Globe,
      title: "Platform Features",
      questions: [
        {
          question: "How does the AI scheduling work?",
          answer:
            "Our AI analyzes your daily routines, work commitments, and family responsibilities to create personalized schedules that optimize your time and reduce stress.",
        },
        {
          question: "What is the Childcare Co-Op Network?",
          answer:
            "The Childcare Co-Op Network connects local mothers to share childcare responsibilities, from babysitting to school pickups, using AI to find optimal matches.",
        },
        {
          question: "Can I customize meal plans?",
          answer:
            "Yes! Our meal planning feature allows you to set dietary preferences, allergies, family size, and cooking time availability to generate personalized meal plans.",
        },
      ],
    },
    privacy: {
      icon: Shield,
      title: "Privacy & Security",
      questions: [
        {
          question: "How secure is my data?",
          answer:
            "We use state-of-the-art encryption and follow strict data protection guidelines. Your personal and family information is always kept confidential and secure.",
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes, you can delete your account at any time. We provide a simple account deletion process that allows you to remove all your personal data from our system.",
        },
      ],
    },
    billing: {
      icon: CreditCard,
      title: "Billing & Subscriptions",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept major credit cards, debit cards, and digital payment platforms like Google Pay and PayPal.",
        },
        {
          question: "Can I change my subscription plan?",
          answer:
            "Absolutely! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately at the start of your next billing cycle.",
        },
      ],
    },
  };

interface Question {
    question: string;
    answer: string;
}

interface Category {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    questions: Question[];
}

interface FAQCategories {
    [key: string]: Category;
}

const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
};

  const filteredQuestions = Object.keys(faqCategories).reduce<Question[]>(
    (acc, category) => {
      const filtered = faqCategories[category].questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return [...acc, ...filtered];
    },
    []
  );

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
              Frequently Asked
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                Questions
              </span>
            </h1>
            <p className="max-w-4xl mx-auto text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Find answers to the most common questions about MamaSphere. Can&apos;t
              find what you&apos;re looking for? Reach out to our support team.
            </p>
          </motion.div>

          {/* Search and Category Navigation */}
          <div className="mb-12">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              {Object.keys(faqCategories).map((category) => {
                const Category = faqCategories[category];
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`
                    flex items-center px-6 py-3 rounded-full transition-all duration-300
                    ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    }
                  `}
                  >
                    <Category.icon className="mr-2 h-5 w-5" />
                    {Category.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12">
            {searchTerm ? (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
                  Search Results ({filteredQuestions.length})
                </h2>
                <AnimatePresence>
                  {filteredQuestions.map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mb-4"
                    >
                      <div
                        onClick={() => toggleQuestion(index)}
                        className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {q.question}
                        </h3>
                        <ChevronDown
                          className={`transform transition-transform duration-300 ${
                            openQuestions.includes(index) ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {openQuestions.includes(index) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-white dark:bg-gray-900 rounded-b-lg text-gray-600 dark:text-gray-300"
                        >
                          {q.answer}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
                  {faqCategories[activeCategory].title}
                </h2>
                <AnimatePresence>
                  {faqCategories[activeCategory].questions.map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mb-4"
                    >
                      <div
                        onClick={() => toggleQuestion(index)}
                        className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {q.question}
                        </h3>
                        <ChevronDown
                          className={`transform transition-transform duration-300 ${
                            openQuestions.includes(index) ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {openQuestions.includes(index) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-white dark:bg-gray-900 rounded-b-lg text-gray-600 dark:text-gray-300"
                        >
                          {q.answer}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default FAQ;
