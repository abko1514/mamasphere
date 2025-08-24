// app/career/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
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
  ArrowRight,
  Play,
  CheckCircle,
  Award,
  Globe,
  Sparkles,
  User,
  Settings,
} from "lucide-react";
import { careerService, JobRecommendation } from "@/lib/careerService";
import {
  FreelanceOpportunity,
  AICareerInsight,
  CareerTip,
  SmallBusiness,
} from "@/models/Career";
import { UserProfile } from "@/models/UserDetails";
import { TipsSection } from "@/components/Career/TipsSection";
import { JobsSection } from "@/components/Career/JobsSection";
import { FreelanceSection } from "@/components/Career/FreelanceSection";
import { BusinessSection } from "@/components/Career/BusinessSection";
import ProfileButton from "@/components/Career/ProfileButton";

interface CareerSupportPageProps {
  user: {
    id: string;
    email: string;
    name: string;
    profile?: UserProfile;
  };
}

export default function CareerSupportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState<string>(tab as string);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<CareerTip[]>([]);
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [freelanceOps, setFreelanceOps] = useState<FreelanceOpportunity[]>([]);
  const [businesses, setBusinesses] = useState<SmallBusiness[]>([]);
  const [aiInsights, setAiInsights] = useState<AICareerInsight | null>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    savedJobs: 0,
    applications: 0,
    profileCompletion: 0,
  });

  const [user, setUser] = useState<CareerSupportPageProps["user"] | null>(null);

  // Filters state
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

  // Function to handle tab changes
  function handleTabChange(tabId: string): void {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", tabId);
    router.push(`?${params.toString()}`);
  }

  // Function to generate AI insights
  const generateAIInsights = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const insights = await careerService.generateAICareerInsights(user.id);
      // Ensure required properties are present
      setAiInsights({
        _id: insights._id,
        userId: insights.userId,
        generatedAt: insights.generatedAt,
        nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
        personalizedTips: insights.personalizedTips ?? [],
        insights: {
          strengthsAnalysis: insights.insights.strengthsAnalysis ?? [],
          improvementAreas: insights.insights.improvementAreas ?? [],
          careerPathSuggestions: insights.insights.careerPathSuggestions ?? [],
          skillGapAnalysis: insights.insights.skillGapAnalysis ?? [],
          marketTrends: insights.insights.marketTrends ?? [],
          salaryInsights: insights.insights.salaryInsights ?? {
            currentMarketRate: "",
            growthPotential: "",
            recommendations: [],
          },
          workLifeBalanceRecommendations:
            insights.insights.workLifeBalanceRecommendations ?? [],
          networkingOpportunities:
            insights.insights.networkingOpportunities ?? [],
          personalizedAdvice: insights.insights.personalizedAdvice ?? [],
        },
      });
    } catch (error) {
      console.error("Error generating AI insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== activeTab) {
      setActiveTab(tab as string);
    }
  }, [tab, activeTab]);

  useEffect(() => {
    // Fetch user session and profile data client-side
    const fetchUser = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }
        // Replace with actual API call to fetch user profile if needed
        const userProfile: UserProfile = {
          _id: "mock_id_123",
          name: session.user?.name || "",
          email: session.user?.email || "",
          location: "New York, NY",
          currentRole: "Marketing Manager",
          industry: "Technology",
          yearsOfExperience: 5,
          skillsAndExperience: [
            "Digital Marketing",
            "Project Management",
            "Data Analysis",
          ],
          workPreference: "hybrid",
          availabilityStatus: "actively_working",
          isPregnant: false,
          childrenAges: [3, 6],
          familyStatus: "married",
          educationLevel: "masters",
          flexibilityNeeds: ["School pickup/dropoff", "Doctor appointments"],
          workExperience: [],
          jobAlerts: false,
          newsletter: false,
          phone: "",
          bio: "",
          certifications: [],
          languages: [],
          communityUpdates: false,
          mentorshipInterested: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          resumeUrl: "",
          avatar: "",
          profileVisibility: "public", // or "private" depending on your app logic
          showContactInfo: true, // or false depending on your app logic
          allowMessages: true, // or false depending on your app logic
        };
        setUser({
          id: session.user?.email || "user_123",
          email: session.user?.email || "",
          name: session.user?.name || "",
          profile: userProfile,
        });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      loadInitialData();
      calculateStats();
    }
  }, [user?.id]);

  const loadInitialData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [tipsData, jobsData, businessData] = await Promise.all([
        careerService.getPersonalizedTips(user.id),
        careerService.getJobRecommendations(user.id),
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

  const calculateStats = () => {
    // Calculate profile completion percentage
    if (!user) return;
    const profile = user.profile;
    if (profile) {
      let completionScore = 0;
      const fields = [
        "name",
        "email",
        "location",
        "currentRole",
        "industry",
        "yearsOfExperience",
        "skillsAndExperience",
        "workPreference",
      ];

      fields.forEach((field) => {
        if (profile[field as keyof UserProfile]) completionScore += 12.5;
      });

      setStats((prev) => ({
        ...prev,
        profileCompletion: Math.round(completionScore),
        totalJobs: jobs.length,
      }));
    }
  };

  // TabButton component for tab navigation
  const TabButton = ({
    tabId,
    label,
    icon: Icon,
    count,
  }: {
    tabId: string;
    label: string;
    icon: any;
    count?: number;
  }) => (
    <button
      onClick={() => handleTabChange(tabId)}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all relative ${
        activeTab === tabId
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-purple-200"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            activeTab === tabId
              ? "bg-white/20"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Career Support Hub
          </h1>
          <p className="text-gray-600 mb-8">
            Please log in to access personalized career guidance and
            opportunities
          </p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Career Support Hub
          </h1>
          <p className="text-gray-600 mb-8">
            Please log in to access personalized career guidance and
            opportunities
          </p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Career Support - Mamasphere</title>
        <meta
          name="description"
          content="AI-powered career guidance for working mothers. Get personalized tips, job recommendations, and discover opportunities that fit your lifestyle."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Career Support Hub
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-powered career guidance designed specifically for working
                  mothers
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Profile Completion
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${stats.profileCompletion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {stats.profileCompletion}%
                    </span>
                  </div>
                </div>

                {/* <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Settings size={16} />
                  Profile
                </button> */}
                <ProfileButton />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tab Navigation - Only show when not on overview */}
          {activeTab !== "overview" && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <TabButton tabId="overview" label="Overview" icon={TrendingUp} />
              <TabButton
                tabId="tips"
                label="Career Tips"
                icon={Lightbulb}
                count={tips.length}
              />
              <TabButton
                tabId="jobs"
                label="Job Matches"
                icon={Briefcase}
                count={jobs.length}
              />
              <TabButton
                tabId="freelance"
                label="Freelance"
                icon={Target}
                count={freelanceOps.length}
              />
              <TabButton
                tabId="business"
                label="Small Business"
                icon={Building2}
                count={businesses.length}
              />
            </div>
          )}

          {/* Overview Tab - Dashboard */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome back, {user.name}! 👋
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Let's advance your career while maintaining the work-life
                  balance that matters to you.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="text-purple-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalJobs}
                  </div>
                  <div className="text-sm text-gray-600">Available Jobs</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Heart className="text-green-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.savedJobs}
                  </div>
                  <div className="text-sm text-gray-600">Saved Jobs</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="text-blue-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.applications}
                  </div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Award className="text-yellow-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {tips.length}
                  </div>
                  <div className="text-sm text-gray-600">Personalized Tips</div>
                </div>
              </div>

              {/* AI Insights CTA */}
              {!aiInsights && (
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
                  <div className="max-w-2xl mx-auto">
                    <Sparkles
                      size={48}
                      className="mx-auto mb-4 text-yellow-300"
                    />
                    <h3 className="text-2xl font-bold mb-4">
                      Get Your AI Career Insights
                    </h3>
                    <p className="text-lg opacity-90 mb-6">
                      Our AI analyzes your profile to provide personalized
                      career guidance, skill recommendations, and market
                      insights tailored just for you.
                    </p>
                    <button
                      onClick={generateAIInsights}
                      disabled={loading}
                      className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      <Zap size={20} />
                      {loading
                        ? "Generating Insights..."
                        : "Generate My Insights"}
                    </button>
                  </div>
                </div>
              )}

              {/* AI Insights Display */}
              {aiInsights && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="text-yellow-300" size={28} />
                    <div>
                      <h3 className="text-xl font-semibold">
                        Your AI Career Insights
                      </h3>
                      <p className="opacity-90 text-sm">
                        Generated on{" "}
                        {new Date(aiInsights.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Star size={16} className="text-yellow-300" />
                        Key Strengths
                      </h4>
                      <ul className="text-sm space-y-2">
                        {aiInsights.insights.strengthsAnalysis
                          .slice(0, 3)
                          .map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-300 mt-0.5 flex-shrink-0"
                              />
                              <span>{strength}</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-300" />
                        Growth Opportunities
                      </h4>
                      <ul className="text-sm space-y-2">
                        {aiInsights.insights.careerPathSuggestions
                          .slice(0, 3)
                          .map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ArrowRight
                                size={14}
                                className="text-blue-300 mt-0.5 flex-shrink-0"
                              />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Globe size={16} className="text-pink-300" />
                        Market Trends
                      </h4>
                      <ul className="text-sm space-y-2">
                        {aiInsights.insights.marketTrends
                          .slice(0, 3)
                          .map((trend, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Sparkles
                                size={14}
                                className="text-pink-300 mt-0.5 flex-shrink-0"
                              />
                              <span>{trend}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => handleTabChange("tips")}
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      View All Personalized Tips
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Access Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  onClick={() => handleTabChange("tips")}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Career Tips
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Get personalized advice for your career journey
                  </p>
                  <div className="flex items-center text-purple-600 text-sm font-medium">
                    <span>View Tips</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>

                <div
                  onClick={() => handleTabChange("jobs")}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Job Matches
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Discover jobs that fit your lifestyle and goals
                  </p>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <span>Browse Jobs</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>

                <div
                  onClick={() => handleTabChange("freelance")}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Freelance Work
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Find flexible project-based opportunities
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Explore Projects</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>

                <div
                  onClick={() => handleTabChange("business")}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Small Business
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Support and discover mom-owned businesses
                  </p>
                  <div className="flex items-center text-orange-600 text-sm font-medium">
                    <span>Discover Businesses</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>

              {/* Latest Content Preview */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Latest Tips */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Latest Tips for You
                    </h3>
                    <button
                      onClick={() => handleTabChange("tips")}
                      className="text-purple-600 text-sm font-medium hover:text-purple-700"
                    >
                      View All
                    </button>
                  </div>

                  {tips.slice(0, 3).map((tip) => (
                    <div
                      key={tip._id}
                      className="border-l-4 border-purple-200 pl-4 py-3"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {tip.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {tip.content}
                      </p>
                      {tip.isPersonalized && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mt-2">
                          <Sparkles size={10} />
                          AI Personalized
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Top Job Matches */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Top Job Matches
                    </h3>
                    <button
                      onClick={() => handleTabChange("jobs")}
                      className="text-green-600 text-sm font-medium hover:text-green-700"
                    >
                      View All
                    </button>
                  </div>

                  {jobs.slice(0, 3).map((job) => (
                    <div
                      key={job._id}
                      className="border-l-4 border-green-200 pl-4 py-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-gray-900">
                          {job.title}
                        </h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {job.matchScore}%
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {job.company} • {job.workArrangement}
                      </p>
                      {job.isMaternityFriendly && (
                        <span className="inline-block text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full mt-1">
                          Family-friendly
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other Tab Content */}
          {activeTab === "tips" && (
            <TipsSection tips={tips} loading={loading} />
          )}

          {activeTab === "jobs" && (
            <JobsSection
              jobs={jobs}
              loading={loading}
              filters={jobFilters}
              setFilters={setJobFilters}
              onApplyFilters={loadInitialData}
              userId={user.id}
            />
          )}

          {activeTab === "freelance" && (
            <FreelanceSection
              opportunities={freelanceOps}
              loading={loading}
              userId={user.id}
            />
          )}

          {activeTab === "business" && (
            <BusinessSection
              businesses={businesses}
              loading={loading}
              filters={businessFilters}
              setFilters={setBusinessFilters}
              onApplyFilters={loadInitialData}
              userId={user.id}
            />
          )}
        </div>
      </div>
    </>
  );
}

// components/CareerProfileDashboard.tsx
// "use client"
// import React, { useState } from 'react';
// import {
//   User,
//   Edit3,
//   BarChart3,
//   Briefcase,
//   MapPin,
//   Calendar,
//   Award,
//   Target,
//   TrendingUp,
//   AlertCircle,
//   CheckCircle,
//   Plus,
//   Settings,
//   Heart,
//   Baby,
//   Clock,
//   Globe,
// } from 'lucide-react';
// import { useCareerProfile } from '@/lib/hooks/useCareerProfile';

// const CareerProfileDashboard = () => {
//   const {
//     profile,
//     stats,
//     loading,
//     error,
//     hasProfile,
//     completionPercentage,
//     refreshProfile,
//   } = useCareerProfile();

//   const [showEditForm, setShowEditForm] = useState(false);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Error Loading Profile
//           </h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={refreshProfile}
//             className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!hasProfile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
//         <div className="max-w-4xl mx-auto px-4 py-16">
//           <div className="text-center">
//             <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
//               <User className="text-white" size={40} />
//             </div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">
//               Complete Your Career Profile
//             </h1>
//             <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//               Help us provide personalized career guidance, job recommendations,
//               and opportunities tailored specifically for working mothers.
//             </p>
//             <button
//               onClick={() => setShowEditForm(true)}
//               className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-3"
//             >
//               <Plus size={24} />
//               Create My Profile
//             </button>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 mt-16">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Target className="text-purple-600" size={24} />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Personalized Recommendations
//               </h3>
//               <p className="text-gray-600">
//                 Get AI-powered job matches and career advice based on your
//                 unique situation
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Briefcase className="text-pink-600" size={24} />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Career Opportunities
//               </h3>
//               <p className="text-gray-600">
//                 Discover family-friendly jobs, freelance work, and small
//                 businesses
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <TrendingUp className="text-indigo-600" size={24} />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Growth Tracking
//               </h3>
//               <p className="text-gray-600">
//                 Monitor your career progress and get insights for professional
//                 development
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const formatDate = (date: string | Date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getAvailabilityStatusInfo = (status: string) => {
//     switch (status) {
//       case "maternity_leave":
//         return {
//           label: "On Maternity Leave",
//           icon: Baby,
//           color: "bg-pink-100 text-pink-700",
//         };
//       case "returning_to_work":
//         return {
//           label: "Returning to Work",
//           icon: Clock,
//           color: "bg-blue-100 text-blue-700",
//         };
//       case "actively_working":
//         return {
//           label: "Actively Working",
//           icon: Briefcase,
//           color: "bg-green-100 text-green-700",
//         };
//       case "seeking_opportunities":
//         return {
//           label: "Seeking Opportunities",
//           icon: Target,
//           color: "bg-yellow-100 text-yellow-700",
//         };
//       case "career_break":
//         return {
//           label: "Career Break",
//           icon: Heart,
//           color: "bg-purple-100 text-purple-700",
//         };
//       default:
//         return {
//           label: status,
//           icon: User,
//           color: "bg-gray-100 text-gray-700",
//         };
//     }
//   };

//   const statusInfo = getAvailabilityStatusInfo(
//     profile?.availabilityStatus || ""
//   );
//   const StatusIcon = statusInfo.icon;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="flex items-center gap-6 mb-6 md:mb-0">
//               <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-2xl font-bold">
//                   {profile?.name?.charAt(0)?.toUpperCase() || "U"}
//                 </span>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                   {profile?.name}
//                 </h1>
//                 <div className="flex flex-wrap items-center gap-4 text-gray-600">
//                   {profile?.currentRole && (
//                     <span className="flex items-center gap-1">
//                       <Briefcase size={16} />
//                       {profile.currentRole}
//                       {profile?.company && ` at ${profile.company}`}
//                     </span>
//                   )}
//                   {profile?.location && (
//                     <span className="flex items-center gap-1">
//                       <MapPin size={16} />
//                       {profile.location}
//                     </span>
//                   )}
//                   <span className="flex items-center gap-1">
//                     <Calendar size={16} />
//                     {profile?.yearsOfExperience} years experience
//                   </span>
//                 </div>
//                 <div className="mt-2">
//                   <span
//                     className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
//                   >
//                     <StatusIcon size={14} />
//                     {statusInfo.label}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={() => setShowEditForm(true)}
//                 className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//               >
//                 <Edit3 size={16} />
//                 Edit Profile
//               </button>
//               <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
//                 <BarChart3 size={16} />
//                 View Analytics
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Profile Completion Alert */}
//         {completionPercentage < 80 && (
//           <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8">
//             <div className="flex items-start gap-4">
//               <AlertCircle
//                 className="text-yellow-600 flex-shrink-0"
//                 size={24}
//               />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-yellow-900 mb-2">
//                   Complete Your Profile ({completionPercentage}%)
//                 </h3>
//                 <p className="text-yellow-800 mb-4">
//                   A complete profile helps us provide better job matches and
//                   career recommendations.
//                 </p>
//                 <button
//                   onClick={() => setShowEditForm(true)}
//                   className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
//                 >
//                   Complete Now
//                 </button>
//               </div>
//               <div className="flex-shrink-0">
//                 <div className="w-16 h-16 relative">
//                   <svg
//                     className="w-16 h-16 transform -rotate-90"
//                     viewBox="0 0 36 36"
//                   >
//                     <path
//                       className="text-gray-200"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       fill="none"
//                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                     />
//                     <path
//                       className="text-yellow-500"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeDasharray={`${completionPercentage}, 100`}
//                       strokeLinecap="round"
//                       fill="none"
//                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                     />
//                   </svg>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-sm font-semibold text-yellow-700">
//                       {completionPercentage}%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats Grid */}
//         {stats && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <Briefcase className="text-purple-600" size={24} />
//               </div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {stats.availableJobs}
//               </div>
//               <div className="text-sm text-gray-600">Available Jobs</div>
//             </div>

//             <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <Heart className="text-green-600" size={24} />
//               </div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {stats.savedJobs}
//               </div>
//               <div className="text-sm text-gray-600">Saved Jobs</div>
//             </div>

//             <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <Target className="text-blue-600" size={24} />
//               </div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {stats.applications}
//               </div>
//               <div className="text-sm text-gray-600">Applications</div>
//             </div>

//             <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
//               <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                 <Award className="text-yellow-600" size={24} />
//               </div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {stats.profileCompletion}%
//               </div>
//               <div className="text-sm text-gray-600">Profile Complete</div>
//             </div>
//           </div>
//         )}

//         {/* Main Content Grid */}
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - Profile Info */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* About */}
//             {profile?.bio && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                   About
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
//               </div>
//             )}

//             {/* Skills & Experience */}
//             {profile?.skillsAndExperience &&
//               profile.skillsAndExperience.length > 0 && (
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Skills & Expertise
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {profile.skillsAndExperience.map(
//                       (skill: string, index: number) => (
//                         <span
//                           key={index}
//                           className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
//                         >
//                           {skill}
//                         </span>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )}

//             {/* Work Experience */}
//             {profile?.workExperience && profile.workExperience.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Work Experience
//                 </h3>
//                 <div className="space-y-4">
//                   {profile.workExperience.map((exp: any) => (
//                     <div
//                       key={exp.id}
//                       className="border-l-4 border-purple-200 pl-4"
//                     >
//                       <div className="flex justify-between items-start mb-1">
//                         <h4 className="font-semibold text-gray-900">
//                           {exp.position}
//                         </h4>
//                         <span className="text-sm text-gray-500">
//                           {formatDate(exp.startDate)} -{" "}
//                           {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
//                         </span>
//                       </div>
//                       <p className="text-purple-600 font-medium mb-2">
//                         {exp.company}
//                       </p>
//                       {exp.description && (
//                         <p className="text-gray-600 text-sm">
//                           {exp.description}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Career Goals */}
//             {profile?.careerGoals && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                   Career Goals
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {profile.careerGoals}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Side Info */}
//           <div className="space-y-6">
//             {/* Quick Info */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Profile Details
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Industry</span>
//                   <span className="font-medium">{profile?.industry}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Work Preference</span>
//                   <span className="font-medium capitalize">
//                     {profile?.workPreference}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Education</span>
//                   <span className="font-medium capitalize">
//                     {profile?.educationLevel?.replace("_", " ")}
//                   </span>
//                 </div>
//                 {profile?.isPregnant && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Due Date</span>
//                     <span className="font-medium">
//                       {formatDate(profile.dueDate)}
//                     </span>
//                   </div>
//                 )}
//                 {profile?.childrenAges && profile.childrenAges.length > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Children</span>
//                     <span className="font-medium">
//                       {profile.childrenAges.length} child
//                       {profile.childrenAges.length !== 1 ? "ren" : ""}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Flexibility Needs */}
//             {profile?.flexibilityNeeds &&
//               profile.flexibilityNeeds.length > 0 && (
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Flexibility Needs
//                   </h3>
//                   <div className="space-y-2">
//                     {profile.flexibilityNeeds.map(
//                       (need: string, index: number) => (
//                         <div key={index} className="flex items-center gap-2">
//                           <CheckCircle size={14} className="text-green-500" />
//                           <span className="text-sm text-gray-700">{need}</span>
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )}

//             {/* Salary Range */}
//             {profile?.desiredSalaryRange && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                   Salary Expectations
//                 </h3>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">
//                     {profile.desiredSalaryRange.currency}{" "}
//                     {profile.desiredSalaryRange.min.toLocaleString()} -{" "}
//                     {profile.desiredSalaryRange.max.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Annual salary range
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Certifications */}
//             {profile?.certifications && profile.certifications.length > 0 && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Certifications
//                 </h3>
//                 <div className="space-y-3">
//                   {profile.certifications.map((cert: any) => (
//                     <div
//                       key={cert.id}
//                       className="border-l-2 border-purple-200 pl-3"
//                     >
//                       <h4 className="font-medium text-gray-900">{cert.name}</h4>
//                       <p className="text-sm text-purple-600">{cert.issuer}</p>
//                       <p className="text-xs text-gray-500">
//                         {formatDate(cert.issueDate)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CareerProfileDashboard;
