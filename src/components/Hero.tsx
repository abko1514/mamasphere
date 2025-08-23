"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Utensils,
  Shield,
  Play,
  ChevronRight,
  Heart,
  Star,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Hero = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "AI-Powered Scheduling",
      description:
        "Intelligent time management that adapts to your unique family and work life. Our AI creates personalized schedules that maximize productivity and reduce stress.",
      color: "from-pink-300 via-pink-400 to-rose-400",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      img: "images/hero-ai.jpeg",
    },
    {
      icon: Users,
      title: "Childcare Co-Op Network",
      description:
        "Connect with local mothers to share childcare responsibilities. Find trusted support for pickups, babysitting, and emergency care.",
      color: "from-purple-300 via-purple-400 to-indigo-400",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
      img: "images/hero-child.jpeg",
    },
    {
      icon: Utensils,
      title: "Smart Meal Planning",
      description:
        "Customized meal plans that consider your dietary preferences, allergies, and time constraints. Healthy eating made simple for busy moms.",
      color: "from-emerald-300 via-emerald-400 to-teal-400",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      img: "images/hero-meal.jpeg",
    },
    {
      icon: Shield,
      title: "Wellness Tracking",
      description:
        "Comprehensive wellness monitoring that tracks your physical and mental health. Get personalized insights and support.",
      color: "from-blue-400 via-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      img: "images/hero-wellness.jpeg",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Mothers", icon: Heart },
    { number: "95%", label: "Success Rate", icon: Star },
    { number: "24/7", label: "AI Support", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden relative">


      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`space-y-8 transform transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-2 border border-pink-200">
              <Sparkles className="w-4 h-4 text-pink-500 mr-2" />
              <span className="text-sm font-medium text-pink-700">
                Trusted by 10,000+ Working Mothers
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-800">Empowering</span>
                <span className="block bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Working Mothers
                </span>
                <span className="block text-gray-600 text-2xl lg:text-4xl font-semibold mt-2">
                  Every Single Day
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
              MamaSphere combines <span className="font-semibold text-pink-600">AI-powered tools</span> and 
              <span className="font-semibold text-purple-600"> AI support</span> to help you balance work, 
              family, and personal wellness with confidence and ease.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 py-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <stat.icon className="w-6 h-6 text-pink-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group flex items-center justify-center text-gray-700 px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold">Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 rounded-3xl opacity-20 blur-2xl"></div>
              
              {/* Main image container */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-2xl">
                <img
                  src="https://img.freepik.com/premium-vector/african-american-mother-with-child-working-laptop-from-home_590052-445.jpg?semt=ais_hybrid"
                  alt="Working mother with child"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-2 border border-pink-200 mb-6">
              <Star className="w-4 h-4 text-pink-500 mr-2" />
              <span className="text-sm font-medium text-pink-700">Comprehensive Support System</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Features That
              <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Transform Lives
              </span>
            </h2>
            
            <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              Designed by daughters, for mothers. Our comprehensive platform addresses 
              the unique challenges of balancing work and family life with intelligent, 
              personalized solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Interactive Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`group cursor-pointer transition-all duration-500 transform hover:scale-102 ${
                    activeFeature === index ? "scale-102" : ""
                  }`}
                >
                  <div
                    className={`p-8 rounded-3xl border transition-all duration-500 ${
                      activeFeature === index
                        ? `bg-gradient-to-r ${feature.color} text-white shadow-2xl border-transparent`
                        : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50 border-gray-200 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div
                        className={`p-3 rounded-2xl mr-4 transition-all duration-300 ${
                          activeFeature === index
                            ? "bg-white/20"
                            : "bg-gradient-to-r from-pink-100 to-purple-100"
                        }`}
                      >
                        <feature.icon
                          className={`w-8 h-8 ${
                            activeFeature === index ? "text-white" : "text-pink-600"
                          }`}
                        />
                      </div>
                      <h3 className="text-2xl font-bold flex-1">{feature.title}</h3>
                      <ChevronRight
                        className={`w-6 h-6 transition-transform duration-300 ${
                          activeFeature === index ? "rotate-90 text-white" : "text-gray-400 group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                    
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        activeFeature === index ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Visualization */}
            <div className="relative">
              <div
                key={activeFeature}
                className={`${features[activeFeature].bgColor} rounded-3xl p-12 transition-all duration-700 transform`}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-white/20 to-transparent rounded-3xl"></div>
                  <img
                    src={features[activeFeature].img}
                    alt={features[activeFeature].title}
                    className="relative w-full h-80 object-cover rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-105"
                  />
                  
                  {/* Feature indicator */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                    {React.createElement(
                      features[activeFeature].icon,
                      {
                        className: `w-6 h-6 bg-gradient-to-r ${features[activeFeature].color} bg-clip-text text-transparent`
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative bg-gradient-to-r from-pink-400 to-rose-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center px-4 py-24">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30 mb-6">
              <Heart className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">Join Our Growing Community</span>
            </div>
          </div>

          <h3 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Your Journey,
            <span className="block">Our Mission</span>
          </h3>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of mothers who are reclaiming their time, advancing their careers, 
            and enjoying family life with MamaSphere's intelligent support system.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="group bg-white text-rose-500 px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="group border-2 border-white text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white hover:text-rose-600 transition-all duration-300 flex items-center justify-center">
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Watch Success Stories
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;