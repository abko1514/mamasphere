"use client";
import React, { useState, useEffect } from "react";
import {
  Briefcase,
  TrendingUp,
  Users,
  Target,
  Star,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  BookOpen,
  Lightbulb,
  Heart,
  Building2,
  Zap,
} from "lucide-react";
import { careerService } from "@/lib/careerService";
import {
  CareerTip,
  JobRecommendation,
  SmallBusiness,
  FreelanceOpportunity,
  AICareerInsight,
} from "@/models/Career";
import { TipsSection } from "./TipsSection";
import { JobsSection } from "./JobsSection";
import { FreelanceSection } from "./FreelanceSection";
import { BusinessSection } from "./BusinessSection";

interface CareerSupportProps {
  userId: string;
}

export default function CareerSupport({ userId }: CareerSupportProps) {
  const [activeTab, setActiveTab] = useState<
    "tips" | "jobs" | "freelance" | "business"
  >("tips");
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<CareerTip[]>([]);
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [freelanceOps, setFreelanceOps] = useState<FreelanceOpportunity[]>([]);
  const [businesses, setBusinesses] = useState<SmallBusiness[]>([]);
  const [aiInsights, setAiInsights] = useState<AICareerInsight | null>(null);
  const [jobFilters, setJobFilters] = useState({
    type: "",
    workArrangement: "",
    location: "",
    salaryMin: 0,
  });
  const [businessFilters, setBusinessFilters] = useState({
    category: "all",
    location: "",
    momOwned: false,
    searchQuery: "",
  });

  useEffect(() => {
    loadInitialData();
  }, [userId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [tipsData, jobsData, businessData] = await Promise.all([
        careerService.getPersonalizedTips(userId),
        careerService.getJobRecommendations(userId),
        careerService.getSmallBusinesses(),
      ]);

      setTips(tipsData);
      setJobs(jobsData);
      setBusinesses(businessData);
    } catch (error) {
      console.error("Error loading career data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    setLoading(true);
    try {
      const insights = await careerService.generateAICareerInsights(userId);
      setAiInsights(insights);
      setTips(insights.personalizedTips);
    } catch (error) {
      console.error("Error generating AI insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyJobFilters = async () => {
    setLoading(true);
    try {
      const filteredJobs = await careerService.getJobRecommendations(
        userId,
        jobFilters
      );
      setJobs(filteredJobs);
    } catch (error) {
      console.error("Error applying job filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyBusinessFilters = async () => {
    setLoading(true);
    try {
      const filteredBusinesses = await careerService.getSmallBusinesses(
        businessFilters
      );
      setBusinesses(filteredBusinesses);
    } catch (error) {
      console.error("Error applying business filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({
    tab,
    label,
    icon: Icon,
  }: {
    tab: string;
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        activeTab === tab
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Support Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered career guidance designed for working mothers. Get
            personalized tips, job recommendations, and discover opportunities
            that fit your lifestyle.
          </p>
        </div>

        {/* AI Insights Banner */}
        {aiInsights && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-yellow-300" size={24} />
              <h3 className="text-xl font-semibold">AI Career Insights</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Key Strengths</h4>
                <ul className="text-sm space-y-1">
                  {aiInsights.insights.strengthsAnalysis
                    .slice(0, 2)
                    .map((strength, idx) => (
                      <li key={idx}>• {strength}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Growth Areas</h4>
                <ul className="text-sm space-y-1">
                  {aiInsights.insights.improvementAreas
                    .slice(0, 2)
                    .map((area, idx) => (
                      <li key={idx}>• {area}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Trending Skills</h4>
                <ul className="text-sm space-y-1">
                  {aiInsights.insights.skillGapAnalysis
                    .slice(0, 2)
                    .map((skill, idx) => (
                      <li key={idx}>• {skill}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Generate AI Insights Button */}
        {!aiInsights && (
          <div className="text-center mb-8">
            <button
              onClick={generateAIInsights}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Generating..." : "Get AI Career Insights"}
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TabButton tab="tips" label="Tips & Guidance" icon={Lightbulb} />
          <TabButton tab="jobs" label="Job Recommendations" icon={Briefcase} />
          <TabButton
            tab="freelance"
            label="Freelance Opportunities"
            icon={Target}
          />
          <TabButton tab="business" label="Small Businesses" icon={Building2} />
        </div>

        {/* Content based on active tab */}
        {activeTab === "tips" && <TipsSection tips={tips} loading={loading} />}

        {activeTab === "jobs" && (
          <JobsSection
            jobs={jobs}
            loading={loading}
            filters={jobFilters}
            setFilters={setJobFilters}
            onApplyFilters={applyJobFilters}
            userId={userId}
          />
        )}

        {activeTab === "freelance" && (
          <FreelanceSection
            opportunities={freelanceOps}
            loading={loading}
            userId={userId}
          />
        )}

        {activeTab === "business" && (
          <BusinessSection
            businesses={businesses}
            loading={loading}
            filters={businessFilters}
            setFilters={setBusinessFilters}
            onApplyFilters={applyBusinessFilters}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}
