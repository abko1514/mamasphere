"use client";
import Footer from "@/components/Footer";
import Navbar from "@/app/core component/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Users,
  Calendar,
  Baby,
  Home,
  Bell,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";

export default function Family() {
  const upcomingFeatures = [
    {
      icon: Users,
      title: "Family Activity Planning",
      description: "Discover and plan engaging activities for quality family time",
      status: "In Development"
    },
    {
      icon: Calendar,
      title: "Shared Family Calendar",
      description: "Coordinate schedules and never miss important family events",
      status: "Coming Soon"
    },
    {
      icon: Baby,
      title: "Child Development Tracking",
      description: "Monitor milestones and celebrate your child's growth journey",
      status: "Planned"
    },
    {
      icon: Heart,
      title: "Family Memory Book",
      description: "Capture and preserve precious family moments and memories",
      status: "Planned"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          {/* Main Coming Soon Card */}
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-sm mb-16">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Heart className="h-12 w-12 text-white" />
              </div>
              
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Coming Soon
              </Badge>
              
              <h1 className="text-5xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Family Features
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                We&apos;re crafting beautiful tools to help you strengthen family bonds, 
                organize your household, and create lasting memories together.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-slate-500 mb-8">
                <Clock className="h-5 w-5" />
                <span className="text-lg">Expected Launch: Q2 2025</span>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg px-8 py-3 text-lg">
                  <Bell className="h-5 w-5 mr-2" />
                  Get Notified
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent px-8 py-3 text-lg"
                  onClick={() => window.history.back()}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Features Preview */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What&apos;s Coming
              </h2>
              <p className="text-lg text-slate-600">
                A sneak peek at the family-focused features we&apos;re building for you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingFeatures.map((feature, index) => (
                <Card 
                  key={index} 
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/60 backdrop-blur-sm hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 rounded-xl">
                          <feature.icon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-slate-900">
                            {feature.title}
                          </CardTitle>
                          <Badge 
                            variant="secondary" 
                            className={`mt-2 ${
                              feature.status === "In Development" 
                                ? "bg-green-100 text-green-700" 
                                : feature.status === "Coming Soon"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {feature.status}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup 
          <Card className="max-w-2xl mx-auto mt-16 border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600">
            <CardContent className="p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                Stay in the Loop
              </h3>
              <p className="text-indigo-100 mb-6">
                Be the first to know when our family features go live. 
                Get exclusive early access and updates.
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 border-0 focus:ring-2 focus:ring-white/20"
                />
                <Button className="bg-white text-indigo-600 hover:bg-slate-100 px-6">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
      <Footer />
    </>
  );
}