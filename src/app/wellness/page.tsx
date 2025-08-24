"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/app/core component/Navbar";
import {
  Heart,
  Calculator,
  BookOpen,
  MessageCircle,
  Dumbbell,
} from "lucide-react";
import MiniTools from "@/components/wellness/MiniTools";
import BooksBlogs from "@/components/wellness/BooksBlogs";
import WellnessChatbot from "@/components/wellness/WellnessChatbot";
import FitnessYoga from "@/components/wellness/FitnessYoga";

export default function WellnessPage() {
  const [activeTab, setActiveTab] = useState("tools");

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-12 w-12 text-pink-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Wellness Hub
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your comprehensive wellness companion designed for the modern
              working mother. Track your health, discover resources, and
              prioritize your well-being.
            </p>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/70 backdrop-blur-sm">
              <TabsTrigger
                value="tools"
                className="flex items-center gap-2 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700"
              >
                <Calculator className="h-4 w-4" />
                Mini Tools
              </TabsTrigger>
              <TabsTrigger
                value="books"
                className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
              >
                <BookOpen className="h-4 w-4" />
                Books & Blogs
              </TabsTrigger>
              <TabsTrigger
                value="chatbot"
                className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
              >
                <MessageCircle className="h-4 w-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger
                value="fitness"
                className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
              >
                <Dumbbell className="h-4 w-4" />
                Fitness & Yoga
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="tools">
              <MiniTools />
            </TabsContent>

            <TabsContent value="books">
              <BooksBlogs />
            </TabsContent>

            <TabsContent value="chatbot">
              <WellnessChatbot />
            </TabsContent>

            <TabsContent value="fitness">
              <FitnessYoga />
            </TabsContent>
          </Tabs>

          {/* Quick Stats Overview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-pink-800">
                  Health Trackers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-pink-900">4+</p>
                <p className="text-xs text-pink-700">Active Tools</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-800">
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-900">100+</p>
                <p className="text-xs text-purple-700">Books & Articles</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-indigo-800">
                  AI Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-indigo-900">24/7</p>
                <p className="text-xs text-indigo-700">Available</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-800">
                  Fitness Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-900">50+</p>
                <p className="text-xs text-green-700">Video Guides</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
