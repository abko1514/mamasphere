// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { getSession } from "next-auth/react";
// import Head from "next/head";
// import { useRouter, useSearchParams } from "next/navigation";
// import { SmallBusiness } from "@/models/Career"; // Make sure this is correct!
// import {
//   Briefcase,
//   TrendingUp,
//   Target,
//   Star,
//   Lightbulb,
//   Heart,
//   Building2,
//   Zap,
//   ArrowRight,
//   CheckCircle,
//   Award,
//   Globe,
//   Sparkles,
// } from "lucide-react";
// import { careerService, JobRecommendation } from "@/lib/careerService";
// import {
//   FreelanceOpportunity,
//   AICareerInsight,
//   CareerTip,
// } from "@/models/Career";
// import { UserProfile } from "@/models/UserDetails";
// import { TipsSection } from "@/components/Career/TipsSection";
// import { JobsSection } from "@/components/Career/JobsSection";
// import { FreelanceSection } from "@/components/Career/FreelanceSection";
// import { BusinessSection } from "@/components/Career/BusinessSection";
// import ProfileButton from "@/components/Career/ProfileButton";
// import Navbar from "../core component/Navbar";

// interface CareerSupportPageProps {
//   user: {
//     id: string;
//     email: string;
//     name: string;
//     profile?: UserProfile;
//   };
// }

// export default function CareerSupportPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const tab = searchParams.get("tab") || "overview";

//   const [activeTab, setActiveTab] = useState<string>(tab);
//   const [loading, setLoading] = useState(false);
//   const [tips, setTips] = useState<CareerTip[]>([]);
//   const [jobs, setJobs] = useState<JobRecommendation[]>([]);
//   const [freelanceOps] = useState<FreelanceOpportunity[]>([]);
//   const [businesses, setBusinesses] = useState<SmallBusiness[]>([]);
//   const [aiInsights, setAiInsights] = useState<AICareerInsight | null>(null);
//   const [stats, setStats] = useState({
//     totalJobs: 0,
//     savedJobs: 0,
//     applications: 0,
//     profileCompletion: 0,
//   });

//   const [user, setUser] = useState<CareerSupportPageProps["user"] | null>(null);

//   // Filters state
//   const [jobFilters, setJobFilters] = useState({
//     type: "",
//     workArrangement: "",
//     location: "",
//     salaryMin: 0,
//   });
//   const [businessFilters, setBusinessFilters] = useState({
//     category: "all",
//     location: "",
//     momOwned: false,
//     searchQuery: "",
//   });

//   // Function to handle tab changes
//   const handleTabChange = useCallback(
//     (tabId: string): void => {
//       const params = new URLSearchParams(Array.from(searchParams.entries()));
//       params.set("tab", tabId);
//       router.push(`?${params.toString()}`);
//     },
//     [router, searchParams]
//   );

//   // Function to generate AI insights
//   const generateAIInsights = async () => {
//     if (!user?.id) return;

//     setLoading(true);
//     try {
//       const insights = await careerService.generateAICareerInsights(user.id);
//       // Ensure required properties are present
//       setAiInsights({
//         _id: insights._id,
//         userId: insights.userId,
//         generatedAt: insights.generatedAt,
//         nextUpdateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
//         personalizedTips: (insights.personalizedTips ?? []).map((tip: string, index: number) => ({
//           _id: `ai-tip-${index}`,
//           title: `AI Tip ${index + 1}`,
//           content: tip,
//           category: "career_growth",
//           targetAudience: [],
//           aiGenerated: true,
//           isPersonalized: true,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           tags: [],
//         })),
//         insights: {
//           strengthsAnalysis: insights.insights.strengthsAnalysis ?? [],
//           improvementAreas: insights.insights.improvementAreas ?? [],
//           careerPathSuggestions: insights.insights.careerPathSuggestions ?? [],
//           skillGapAnalysis: insights.insights.skillGapAnalysis ?? [],
//           marketTrends: insights.insights.marketTrends ?? [],
//           salaryInsights: insights.insights.salaryInsights ?? {
//             currentMarketRate: "",
//             growthPotential: "",
//             recommendations: [],
//           },
//           workLifeBalanceRecommendations:
//             insights.insights.workLifeBalanceRecommendations ?? [],
//           networkingOpportunities:
//             insights.insights.networkingOpportunities ?? [],
//           personalizedAdvice: insights.insights.personalizedAdvice ?? [],
//           nextUpdateDue: insights.insights.nextUpdateDue
//             ? new Date(insights.insights.nextUpdateDue)
//             : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         },
//       });
//     } catch (error) {
//       console.error("Error generating AI insights:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadInitialData = useCallback(async () => {
//     if (!user) return;
//     setLoading(true);
//     try {
//       const [tipsData, jobsData, businessData] = await Promise.all([
//         careerService.getPersonalizedTips(user.id),
//         careerService.getJobRecommendations(user.id),
//         careerService.getSmallBusinesses(),
//       ]);

//       setTips(
//         tipsData.map((tip) => ({
//           ...tip,
//           targetAudience: Array.isArray(tip.targetAudience)
//             ? tip.targetAudience
//             : typeof tip.targetAudience === "string"
//             ? [tip.targetAudience]
//             : [],
//           aiGenerated: tip.aiGenerated ?? false,
//           isPersonalized: tip.isPersonalized ?? false,
//           createdAt: tip.createdAt ? new Date(tip.createdAt) : new Date(),
//           updatedAt: tip.updatedAt ? new Date(tip.updatedAt) : new Date(),
//           tags: tip.tags ?? [],
//           relevanceScore: tip.relevanceScore,
//         })) as CareerTip[]
//       );

//       setJobs(jobsData);
//       setBusinesses(
//         businessData.map(
//           (biz): SmallBusiness => ({
//             _id: biz._id ?? "",
//             businessName: biz.businessName ?? "",
//             ownerName: biz.ownerName ?? "",
//             ownerId: biz.ownerId ?? "",
//             category: biz.category ?? "",
//             description: biz.description ?? "",
//             services: biz.services ?? [],
//             location: biz.location ?? "",
//             contactInfo: {
//               email: biz.contact?.email ?? "",
//               phone: biz.contact?.phone ?? "",
//               socialMedia: {
//                 instagram: biz.contact?.social?.instagram ?? "",
//                 facebook: biz.contact?.social?.facebook ?? "",
//                 linkedin: biz.contact?.social?.linkedin ?? "",
//               },
//             },
//             images: biz.images ?? [],
//             isVerified: biz.isVerified ?? false,
//             rating: biz.rating ?? 0,
//             reviewCount: biz.reviewCount ?? 0,
//             isMomOwned: biz.isMomOwned ?? false,
//             createdAt: biz.createdAt ? new Date(biz.createdAt) : new Date(),
//             tags: biz.tags ?? [],
//           })
//         )
//       );
//     } catch (error) {
//       console.error("Error loading career data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   const calculateStats = useCallback(() => {
//     // Calculate profile completion percentage
//     if (!user) return;
//     const profile = user.profile;
//     if (profile) {
//       let completionScore = 0;
//       const fields = [
//         "name",
//         "email",
//         "location",
//         "currentRole",
//         "industry",
//         "yearsOfExperience",
//         "skillsAndExperience",
//         "workPreference",
//       ];

//       fields.forEach((field) => {
//         if (profile[field as keyof UserProfile]) completionScore += 12.5;
//       });

//       setStats((prev) => ({
//         ...prev,
//         profileCompletion: Math.round(completionScore),
//         totalJobs: jobs.length,
//       }));
//     }
//   }, [user, jobs.length]);

//   useEffect(() => {
//     if (tab !== activeTab) {
//       setActiveTab(tab);
//     }
//   }, [tab, activeTab]);

//   useEffect(() => {
//     // Fetch user session and profile data client-side
//     const fetchUser = async () => {
//       setLoading(true);
//       try {
//         const session = await getSession();
//         if (!session) {
//           setUser(null);
//           setLoading(false);
//           return;
//         }
//         // Replace with actual API call to fetch user profile if needed
//         const userProfile: UserProfile = {
//           _id: "mock_id_123",
//           name: session.user?.name || "",
//           email: session.user?.email || "",
//           location: "New York, NY",
//           currentRole: "Marketing Manager",
//           industry: "Technology",
//           yearsOfExperience: 5,
//           skillsAndExperience: [
//             "Digital Marketing",
//             "Project Management",
//             "Data Analysis",
//           ],
//           workPreference: "hybrid",
//           availabilityStatus: "actively_working",
//           isPregnant: false,
//           childrenAges: [3, 6],
//           familyStatus: "married",
//           educationLevel: "masters",
//           flexibilityNeeds: ["School pickup/dropoff", "Doctor appointments"],
//           workExperience: [],
//           jobAlerts: false,
//           newsletter: false,
//           phone: "",
//           bio: "",
//           certifications: [],
//           languages: [],
//           communityUpdates: false,
//           mentorshipInterested: false,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           resumeUrl: "",
//           avatar: "",
//           profileVisibility: "public",
//           showContactInfo: true,
//           allowMessages: true,
//         };
//         setUser({
//           id: session.user?.email || "user_123",
//           email: session.user?.email || "",
//           name: session.user?.name || "",
//           profile: userProfile,
//         });
//       } catch (error) {
//         setUser(null);
//         console.error("Error fetching user session:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user && user.id) {
//       loadInitialData();
//       calculateStats();
//     }
//   }, [user?.id, loadInitialData, calculateStats]);

//   // TabButton component for tab navigation
//   const TabButton = ({
//     tabId,
//     label,
//     icon: Icon,
//     count,
//   }: {
//     tabId: string;
//     label: string;
//     icon: React.ComponentType<{ size?: number | string }>;
//     count?: number;
//   }) => (
//     <button
//       onClick={() => handleTabChange(tabId)}
//       className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all relative ${
//         activeTab === tabId
//           ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
//           : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-purple-200"
//       }`}
//     >
//       <Icon size={20} />
//       <span>{label}</span>
//       {count !== undefined && (
//         <span
//           className={`text-xs px-2 py-1 rounded-full ${
//             activeTab === tabId
//               ? "bg-white/20"
//               : "bg-purple-100 text-purple-600"
//           }`}
//         >
//           {count}
//         </span>
//       )}
//     </button>
//   );

//   if (!user && !loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto">
//           <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Briefcase className="text-white" size={32} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             Career Support Hub
//           </h1>
//           <p className="text-gray-600 mb-8">
//             Please log in to access personalized career guidance and
//             opportunities
//           </p>
//           <button
//             onClick={() => router.push("/auth/signin")}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all"
//           >
//             Sign In to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading && !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
//         <Navbar/>
//         <div className="text-center max-w-md mx-auto">
//           <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Briefcase className="text-white" size={32} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             Career Support Hub
//           </h1>
//           <p className="text-gray-600 mb-8">
//             Please log in to access personalized career guidance and
//             opportunities
//           </p>
//           <button
//             onClick={() => router.push("/auth/signin")}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all"
//           >
//             Sign In to Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//     <Navbar/>
//       <Head>
//         <title>Career Support - Mamasphere</title>
//         <meta
//           name="description"
//           content="AI-powered career guidance for working mothers. Get personalized tips, job recommendations, and discover opportunities that fit your lifestyle."
//         />
//       </Head>

//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 py-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   Career Support Hub
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   AI-powered career guidance designed specifically for working
//                   mothers
//                 </p>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="text-right">
//                   <div className="text-sm text-gray-500">
//                     Profile Completion
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-24 h-2 bg-gray-200 rounded-full">
//                       <div
//                         className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
//                         style={{ width: `${stats.profileCompletion}%` }}
//                       ></div>
//                     </div>
//                     <span className="text-sm font-medium">
//                       {stats.profileCompletion}%
//                     </span>
//                   </div>
//                 </div>

//                 <ProfileButton />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 py-8">
//           {/* Tab Navigation - Only show when not on overview */}
//           {activeTab !== "overview" && (
//             <div className="flex flex-wrap justify-center gap-4 mb-8">
//               <TabButton tabId="overview" label="Overview" icon={TrendingUp} />
//               <TabButton
//                 tabId="tips"
//                 label="Career Tips"
//                 icon={Lightbulb}
//                 count={tips.length}
//               />
//               <TabButton
//                 tabId="jobs"
//                 label="Job Matches"
//                 icon={Briefcase}
//                 count={jobs.length}
//               />
//               <TabButton
//                 tabId="freelance"
//                 label="Freelance"
//                 icon={Target}
//                 count={freelanceOps.length}
//               />
//               <TabButton
//                 tabId="business"
//                 label="Small Business"
//                 icon={Building2}
//                 count={businesses.length}
//               />
//             </div>
//           )}

//           {/* Overview Tab - Dashboard */}
//           {activeTab === "overview" && (
//             <div className="space-y-8">
//               {/* Welcome Section */}
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4">
//                   Welcome back, {user.name}! 👋
//                 </h2>
//                 <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                   Let&apos;s advance your career while maintaining the work-life
//                   balance that matters to you.
//                 </p>
//               </div>

//               {/* Quick Stats */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
//                   <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <Briefcase className="text-purple-600" size={24} />
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     {stats.totalJobs}
//                   </div>
//                   <div className="text-sm text-gray-600">Available Jobs</div>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
//                   <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <Heart className="text-green-600" size={24} />
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     {stats.savedJobs}
//                   </div>
//                   <div className="text-sm text-gray-600">Saved Jobs</div>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <Target className="text-blue-600" size={24} />
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     {stats.applications}
//                   </div>
//                   <div className="text-sm text-gray-600">Applications</div>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
//                   <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <Award className="text-yellow-600" size={24} />
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     {tips.length}
//                   </div>
//                   <div className="text-sm text-gray-600">Personalized Tips</div>
//                 </div>
//               </div>

//               {/* AI Insights CTA */}
//               {!aiInsights && (
//                 <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
//                   <div className="max-w-2xl mx-auto">
//                     <Sparkles
//                       size={48}
//                       className="mx-auto mb-4 text-yellow-300"
//                     />
//                     <h3 className="text-2xl font-bold mb-4">
//                       Get Your AI Career Insights
//                     </h3>
//                     <p className="text-lg opacity-90 mb-6">
//                       Our AI analyzes your profile to provide personalized
//                       career guidance, skill recommendations, and market
//                       insights tailored just for you.
//                     </p>
//                     <button
//                       onClick={generateAIInsights}
//                       disabled={loading}
//                       className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 inline-flex items-center gap-2"
//                     >
//                       <Zap size={20} />
//                       {loading
//                         ? "Generating Insights..."
//                         : "Generate My Insights"}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* AI Insights Display */}
//               {aiInsights && (
//                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
//                   <div className="flex items-center gap-3 mb-6">
//                     <Zap className="text-yellow-300" size={28} />
//                     <div>
//                       <h3 className="text-xl font-semibold">
//                         Your AI Career Insights
//                       </h3>
//                       <p className="opacity-90 text-sm">
//                         Generated on{" "}
//                         {new Date(aiInsights.generatedAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-3 gap-6">
//                     <div className="bg-white/10 rounded-lg p-4">
//                       <h4 className="font-semibold mb-3 flex items-center gap-2">
//                         <Star size={16} className="text-yellow-300" />
//                         Key Strengths
//                       </h4>
//                       <ul className="text-sm space-y-2">
//                         {aiInsights.insights.strengthsAnalysis
//                           .slice(0, 3)
//                           .map((strength, idx) => (
//                             <li key={idx} className="flex items-start gap-2">
//                               <CheckCircle
//                                 size={14}
//                                 className="text-green-300 mt-0.5 flex-shrink-0"
//                               />
//                               <span>{strength}</span>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>

//                     <div className="bg-white/10 rounded-lg p-4">
//                       <h4 className="font-semibold mb-3 flex items-center gap-2">
//                         <TrendingUp size={16} className="text-blue-300" />
//                         Growth Opportunities
//                       </h4>
//                       <ul className="text-sm space-y-2">
//                         {aiInsights.insights.careerPathSuggestions
//                           .slice(0, 3)
//                           .map((suggestion, idx) => (
//                             <li key={idx} className="flex items-start gap-2">
//                               <ArrowRight
//                                 size={14}
//                                 className="text-blue-300 mt-0.5 flex-shrink-0"
//                               />
//                               <span>{suggestion}</span>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>

//                     <div className="bg-white/10 rounded-lg p-4">
//                       <h4 className="font-semibold mb-3 flex items-center gap-2">
//                         <Globe size={16} className="text-pink-300" />
//                         Market Trends
//                       </h4>
//                       <ul className="text-sm space-y-2">
//                         {aiInsights.insights.marketTrends
//                           .slice(0, 3)
//                           .map((trend, idx) => (
//                             <li key={idx} className="flex items-start gap-2">
//                               <Sparkles
//                                 size={14}
//                                 className="text-pink-300 mt-0.5 flex-shrink-0"
//                               />
//                               <span>{trend}</span>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   </div>

//                   <div className="mt-6 text-center">
//                     <button
//                       onClick={() => handleTabChange("tips")}
//                       className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
//                     >
//                       View All Personalized Tips
//                       <ArrowRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Quick Access Cards */}
//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div
//                   onClick={() => handleTabChange("tips")}
//                   className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
//                 >
//                   <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                     <Lightbulb className="text-white" size={24} />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">
//                     Career Tips
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-3">
//                     Get personalized advice for your career journey
//                   </p>
//                   <div className="flex items-center text-purple-600 text-sm font-medium">
//                     <span>View Tips</span>
//                     <ArrowRight size={14} className="ml-1" />
//                   </div>
//                 </div>

//                 <div
//                   onClick={() => handleTabChange("jobs")}
//                   className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
//                 >
//                   <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                     <Briefcase className="text-white" size={24} />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">
//                     Job Matches
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-3">
//                     Discover jobs that fit your lifestyle and goals
//                   </p>
//                   <div className="flex items-center text-green-600 text-sm font-medium">
//                     <span>Browse Jobs</span>
//                     <ArrowRight size={14} className="ml-1" />
//                   </div>
//                 </div>

//                 <div
//                   onClick={() => handleTabChange("freelance")}
//                   className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
//                 >
//                   <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                     <Target className="text-white" size={24} />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">
//                     Freelance Work
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-3">
//                     Find flexible project-based opportunities
//                   </p>
//                   <div className="flex items-center text-blue-600 text-sm font-medium">
//                     <span>Explore Projects</span>
//                     <ArrowRight size={14} className="ml-1" />
//                   </div>
//                 </div>

//                 <div
//                   onClick={() => handleTabChange("business")}
//                   className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
//                 >
//                   <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                     <Building2 className="text-white" size={24} />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">
//                     Small Business
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-3">
//                     Support and discover mom-owned businesses
//                   </p>
//                   <div className="flex items-center text-orange-600 text-sm font-medium">
//                     <span>Discover Businesses</span>
//                     <ArrowRight size={14} className="ml-1" />
//                   </div>
//                 </div>
//               </div>

//               {/* Latest Content Preview */}
//               <div className="grid lg:grid-cols-2 gap-8">
//                 {/* Latest Tips */}
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       Latest Tips for You
//                     </h3>
//                     <button
//                       onClick={() => handleTabChange("tips")}
//                       className="text-purple-600 text-sm font-medium hover:text-purple-700"
//                     >
//                       View All
//                     </button>
//                   </div>

//                   {tips.slice(0, 3).map((tip) => (
//                     <div
//                       key={tip._id}
//                       className="border-l-4 border-purple-200 pl-4 py-3"
//                     >
//                       <h4 className="font-medium text-gray-900 mb-1">
//                         {tip.title}
//                       </h4>
//                       <p className="text-gray-600 text-sm line-clamp-2">
//                         {tip.content}
//                       </p>
//                       {tip.isPersonalized && (
//                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mt-2">
//                           <Sparkles size={10} />
//                           AI Personalized
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Top Job Matches */}
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       Top Job Matches
//                     </h3>
//                     <button
//                       onClick={() => handleTabChange("jobs")}
//                       className="text-green-600 text-sm font-medium hover:text-green-700"
//                     >
//                       View All
//                     </button>
//                   </div>

//                   {jobs.slice(0, 3).map((job) => (
//                     <div
//                       key={job._id}
//                       className="border-l-4 border-green-200 pl-4 py-3"
//                     >
//                       <div className="flex items-start justify-between mb-1">
//                         <h4 className="font-medium text-gray-900">
//                           {job.title}
//                         </h4>
//                         <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                           {job.matchScore}%
//                         </span>
//                       </div>
//                       <p className="text-gray-600 text-sm">
//                         {job.company} • {job.workArrangement}
//                       </p>
//                       {job.isMaternityFriendly && (
//                         <span className="inline-block text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full mt-1">
//                           Family-friendly
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Other Tab Content */}
//           {activeTab === "tips" && (
//             <TipsSection tips={tips} loading={loading} />
//           )}

//           {activeTab === "jobs" && (
//             <JobsSection
//               jobs={jobs.map((job: JobRecommendation) => ({
//                 ...job,
//                 workArrangement:
//                   job.workArrangement === "flexible"
//                     ? "remote"
//                     : job.workArrangement ?? "remote",
//                 type: job.jobType ?? "",
//                 requirements: job.requiredSkills ?? [],
//                 benefits: job.benefitsHighlights ?? [],
//                 flexibleHours: job.flexibleHours ?? false,
//                 maternityFriendly: job.isMaternityFriendly ?? false,
//                 parentingSupport: job.parentingSupport ?? [],
//                 applicationUrl: job.applicationUrl ?? "",
//                 reasonsForMatch: job.reasonsForMatch ?? [],
//               }))}
//               loading={loading}
//               filters={jobFilters}
//               setFilters={(filters) => setJobFilters(prev => ({ ...prev, ...filters }))}
//               onApplyFilters={loadInitialData}
//               userId={user.id}
//             />
//           )}

//           {activeTab === "freelance" && (
//             <FreelanceSection
//               opportunities={freelanceOps}
//               loading={loading}
//               userId={user.id}
//             />
//           )}

//           {activeTab === "business" && (
//             <BusinessSection
//               businesses={businesses}
//               loading={loading}
//               filters={businessFilters}
//               setFilters={setBusinessFilters}
//               onApplyFilters={loadInitialData}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


// career/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  TrendingUp,
  Target,
  Star,
  Lightbulb,
  Heart,
  Building2,
  Zap,
  ArrowRight,
  CheckCircle,
  Award,
  Globe,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  LightbulbIcon,
} from "lucide-react";

// Types
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  currentRole?: string;
  industry?: string;
  skillsAndExperience?: string[];
  workPreference?: "remote" | "hybrid" | "onsite" | "flexible";
  availabilityStatus?: string;
  location?: string;
  yearsOfExperience?: number;
  isPregnant?: boolean;
  childrenAges?: number[];
  desiredSalaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface JobRecommendation {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  workArrangement: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  isMaternityFriendly: boolean;
  flexibleHours: boolean;
  applicationUrl: string;
  postedDate: Date;
  matchScore: number;
  reasonsForMatch: string[];
}

interface CareerTip {
  _id: string;
  title: string;
  content: string;
  category: string;
  targetAudience: string[];
  isPersonalized: boolean;
  createdAt: Date;
  tags: string[];
  aiGenerated: boolean;
  relevanceScore?: number;
}

interface AICareerInsight {
  _id: string;
  userId: string;
  insights: {
    strengthsAnalysis: string[];
    improvementAreas: string[];
    careerPathSuggestions: string[];
    skillGapAnalysis: string[];
    marketTrends: string[];
    salaryInsights: {
      currentMarketRate: string;
      growthPotential: string;
      recommendations: string[];
    };
    workLifeBalanceRecommendations: string[];
    networkingOpportunities: string[];
    personalizedAdvice: string[];
    nextUpdateDue: Date;
  };
  personalizedTips: CareerTip[];
  generatedAt: Date;
  nextUpdateDue: Date;
}

interface DataStatus {
  isOnline: boolean;
  usingRealData: boolean;
  lastUpdate: Date | null;
  apiHealth: {
    jobs: boolean;
    tips: boolean;
    insights: boolean;
  };
}

export default function EnhancedCareerSupportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  // State management
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; profile: UserProfile } | null>(
    null
  );

  // Data states
  const [tips, setTips] = useState<CareerTip[]>([]);
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [aiInsights, setAiInsights] = useState<AICareerInsight | null>(null);
  const [dataStatus, setDataStatus] = useState<DataStatus>({
    isOnline: navigator.onLine,
    usingRealData: false,
    lastUpdate: null,
    apiHealth: {
      jobs: false,
      tips: false,
      insights: false,
    },
  });

  // Error and notification states
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "warning" | "error" | "info";
      message: string;
    }>
  >([]);

  // Stats
  const [stats, setStats] = useState({
    totalJobs: 0,
    savedJobs: 0,
    applications: 0,
    profileCompletion: 0,
  });

  // Filter states
  const [jobFilters, setJobFilters] = useState({
    type: "",
    workArrangement: "",
    location: "",
    salaryMin: 0,
  });

  // Enhanced API calling with error handling and fallback
  const apiCall = async <T,>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  };

  // Add notification
  const addNotification = (
    type: "success" | "warning" | "error" | "info",
    message: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // Load user data
  const loadUser = useCallback(async () => {
    try {
      const session = await getSession();
      if (!session?.user?.email) {
        setUser(null);
        return;
      }

      // Mock user profile for demo - replace with actual API call
      const mockProfile: UserProfile = {
        _id: "user_123",
        name: session.user.name || "",
        email: session.user.email,
        currentRole: "Marketing Manager",
        industry: "Technology",
        yearsOfExperience: 5,
        skillsAndExperience: [
          "Digital Marketing",
          "Project Management",
          "Data Analysis",
        ],
        workPreference: "remote",
        availabilityStatus: "actively_working",
        location: "New York, NY",
        childrenAges: [3, 6],
        desiredSalaryRange: {
          min: 80000,
          max: 120000,
          currency: "USD",
        },
      };

      setUser({
        id: session.user.email,
        profile: mockProfile,
      });
    } catch (error) {
      console.error("Error loading user:", error);
      setError("Failed to load user profile");
    }
  }, []);

  // Load jobs with real-time data
  const loadJobs = useCallback(
    async (forceRefresh = false) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          userId: user.id,
          type: jobFilters.type,
          workArrangement: jobFilters.workArrangement,
          location: jobFilters.location,
          salaryMin: jobFilters.salaryMin.toString(),
        });

        if (forceRefresh) {
          params.append("forceRefresh", "true");
        }

        const data = await apiCall<{
          jobs: JobRecommendation[];
          usingRealData: boolean;
        }>(`/api/career/jobs?${params}`);

        setJobs(data.jobs || []);
        setDataStatus((prev) => ({
          ...prev,
          usingRealData: data.usingRealData || false,
          lastUpdate: new Date(),
          apiHealth: { ...prev.apiHealth, jobs: true },
        }));

        if (data.usingRealData) {
          addNotification(
            "success",
            `Found ${data.jobs.length} real-time job matches!`
          );
        } else {
          addNotification(
            "info",
            "Using cached job data. Refresh for latest opportunities."
          );
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
        setError("Failed to load job recommendations");
        setDataStatus((prev) => ({
          ...prev,
          apiHealth: { ...prev.apiHealth, jobs: false },
        }));
        addNotification(
          "error",
          "Unable to load latest jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [user, jobFilters]
  );

  // Load tips with AI generation
  const loadTips = useCallback(
    async (forceRegenerate = false) => {
      if (!user) return;

      try {
        setLoading(true);

        const params = new URLSearchParams({
          userId: user.id,
          limit: "10",
        });

        if (forceRegenerate) {
          params.append("forceRegenerate", "true");
        }

        const data = await apiCall<{ tips: CareerTip[]; aiGenerated: boolean }>(
          `/api/career/tips?${params}`
        );

        setTips(data.tips || []);
        setDataStatus((prev) => ({
          ...prev,
          lastUpdate: new Date(),
          apiHealth: { ...prev.apiHealth, tips: true },
        }));

        if (data.aiGenerated) {
          addNotification(
            "success",
            "Generated personalized AI tips based on your profile!"
          );
        }
      } catch (error) {
        console.error("Error loading tips:", error);
        setDataStatus((prev) => ({
          ...prev,
          apiHealth: { ...prev.apiHealth, tips: false },
        }));
        addNotification(
          "warning",
          "Using cached tips. AI generation temporarily unavailable."
        );
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Generate AI insights
  const generateAIInsights = useCallback(
    async (forceRegenerate = false) => {
      if (!user) return;

      try {
        setLoading(true);
        addNotification("info", "Analyzing your profile with AI...");

        const data = await apiCall<AICareerInsight>("/api/career/insights", {
          method: "POST",
          body: JSON.stringify({
            userId: user.id,
            forceRegenerate,
          }),
        });

        setAiInsights(data);
        setDataStatus((prev) => ({
          ...prev,
          lastUpdate: new Date(),
          apiHealth: { ...prev.apiHealth, insights: true },
        }));

        addNotification("success", "AI insights generated successfully!");
      } catch (error) {
        console.error("Error generating insights:", error);
        setDataStatus((prev) => ({
          ...prev,
          apiHealth: { ...prev.apiHealth, insights: false },
        }));
        addNotification(
          "error",
          "AI insights temporarily unavailable. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Tab change handler
  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("tab", tabId);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Calculate profile completion
  const calculateProfileCompletion = useCallback(() => {
    if (!user?.profile) return;

    const fields = [
      "name",
      "currentRole",
      "industry",
      "yearsOfExperience",
      "skillsAndExperience",
      "workPreference",
      "location",
    ];

    const completedFields = fields.filter((field) => {
      const value = user.profile[field as keyof UserProfile];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });

    const completion = Math.round(
      (completedFields.length / fields.length) * 100
    );
    setStats((prev) => ({ ...prev, profileCompletion: completion }));
  }, [user]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () =>
      setDataStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setDataStatus((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Initialize data loading
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (user) {
      calculateProfileCompletion();
      loadJobs();
      loadTips();
    }
  }, [user, calculateProfileCompletion, loadJobs, loadTips]);

  useEffect(() => {
    setStats((prev) => ({ ...prev, totalJobs: jobs.length }));
  }, [jobs]);

  // UI Components
  const TabButton = ({
    tabId,
    label,
    icon: Icon,
    count,
  }: {
    tabId: string;
    label: string;
    icon: React.ComponentType<{ size?: number | string }>;
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

  const StatusIndicator = () => (
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border">
      <div
        className={`w-2 h-2 rounded-full ${
          dataStatus.isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-sm text-gray-600">
        {dataStatus.isOnline ? "Online" : "Offline"}
      </span>
      {dataStatus.usingRealData && (
        <div className="flex items-center gap-1 text-green-600">
          <Wifi size={12} />
          <span className="text-xs">Real-time</span>
        </div>
      )}
    </div>
  );

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "warning"
              ? "bg-yellow-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {notification.type === "success" && <CheckCircle size={16} />}
          {notification.type === "warning" && <AlertCircle size={16} />}
          {notification.type === "error" && <AlertCircle size={16} />}
          {notification.type === "info" && <Sparkles size={16} />}
          <span className="text-sm">{notification.message}</span>
        </div>
      ))}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Career Hub
          </h1>
          <p className="text-gray-600 mb-8">
            Get personalized career guidance with real-time job matching and AI
            insights
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
        <title>AI Career Support - Real-time Opportunities</title>
        <meta
          name="description"
          content="AI-powered career platform with real-time job matching, personalized insights, and opportunities for working mothers."
        />
      </Head>

      <NotificationContainer />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Career Hub
                </h1>
                <p className="text-gray-600 mt-1">
                  Real-time opportunities powered by AI
                </p>
              </div>

              <div className="flex items-center gap-4">
                <StatusIndicator />

                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Profile Completion
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${stats.profileCompletion}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {stats.profileCompletion}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    loadJobs(true);
                    loadTips(true);
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <TabButton tabId="overview" label="Overview" icon={TrendingUp} />
            <TabButton
              tabId="tips"
              label="AI Tips"
              icon={Lightbulb}
              count={tips.length}
            />
            <TabButton
              tabId="jobs"
              label="Live Jobs"
              icon={Briefcase}
              count={jobs.length}
            />
          </div>

          {/* Overview Dashboard */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome back, {user.profile.name}!
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your personalized career dashboard with real-time
                  opportunities
                </p>
              </div>

              {/* Data Status Alert */}
              {!dataStatus.isOnline && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <WifiOff className="text-yellow-600" size={20} />
                    <div>
                      <h3 className="font-semibold text-yellow-800">
                        Offline Mode
                      </h3>
                      <p className="text-sm text-yellow-700">
                        Showing cached data. Connect to internet for latest
                        opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="text-purple-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalJobs}
                  </div>
                  <div className="text-sm text-gray-600">Live Jobs</div>
                  {dataStatus.usingRealData && (
                    <div className="mt-1 text-xs text-green-600 flex items-center justify-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                      Real-time
                    </div>
                  )}
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
                    <Sparkles className="text-yellow-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {tips.length}
                  </div>
                  <div className="text-sm text-gray-600">AI Tips</div>
                </div>
              </div>

              {/* AI Insights Section */}
              {!aiInsights ? (
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
                  <div className="max-w-2xl mx-auto">
                    <Sparkles
                      size={48}
                      className="mx-auto mb-4 text-yellow-300"
                    />
                    <h3 className="text-2xl font-bold mb-4">
                      Get Your AI Career Analysis
                    </h3>
                    <p className="text-lg opacity-90 mb-6">
                      Our AI analyzes your profile against real market data to
                      provide personalized insights, salary recommendations, and
                      career path suggestions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => generateAIInsights(false)}
                        disabled={loading}
                        className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                      >
                        <Zap size={20} />
                        {loading ? "Analyzing..." : "Generate AI Insights"}
                      </button>
                      {dataStatus.apiHealth.insights && (
                        <button
                          onClick={() => generateAIInsights(true)}
                          disabled={loading}
                          className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all disabled:opacity-50"
                        >
                          Force Refresh
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Zap className="text-yellow-300" size={28} />
                      <div>
                        <h3 className="text-xl font-semibold">
                          Your AI Career Insights
                        </h3>
                        <p className="opacity-90 text-sm">
                          Generated{" "}
                          {new Date(
                            aiInsights.generatedAt
                          ).toLocaleDateString()}
                          {dataStatus.lastUpdate && (
                            <span className="ml-2">
                              • Updated{" "}
                              {dataStatus.lastUpdate.toLocaleTimeString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => generateAIInsights(true)}
                      disabled={loading}
                      className="text-white hover:text-yellow-300 transition-colors"
                    >
                      <RefreshCw
                        size={20}
                        className={loading ? "animate-spin" : ""}
                      />
                    </button>
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

                  {aiInsights.insights.salaryInsights && (
                    <div className="mt-6 bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Salary Insights</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="opacity-75">Market Rate:</span>
                          <p className="font-medium">
                            {
                              aiInsights.insights.salaryInsights
                                .currentMarketRate
                            }
                          </p>
                        </div>
                        <div>
                          <span className="opacity-75">Growth Potential:</span>
                          <p className="font-medium">
                            {aiInsights.insights.salaryInsights.growthPotential}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Latest Content Preview */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Latest AI Tips */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Lightbulb className="text-purple-500" size={20} />
                      Latest AI Tips
                    </h3>
                    <button
                      onClick={() => handleTabChange("tips")}
                      className="text-purple-600 text-sm font-medium hover:text-purple-700"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tips.slice(0, 3).map((tip) => (
                      <div
                        key={tip._id}
                        className="border-l-4 border-purple-200 pl-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-1">
                          {tip.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {tip.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {tip.aiGenerated && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              <Sparkles size={10} />
                              AI Generated
                            </span>
                          )}
                          {tip.relevanceScore && (
                            <span className="text-xs text-gray-500">
                              {Math.round(tip.relevanceScore)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {tips.length === 0 && (
                    <div className="text-center py-8">
                      <Lightbulb
                        className="text-gray-300 mx-auto mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">
                        No tips available. Generate AI insights to get
                        personalized recommendations.
                      </p>
                    </div>
                  )}
                </div>

                {/* Top Job Matches */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Briefcase className="text-green-500" size={20} />
                      Top Job Matches
                    </h3>
                    <button
                      onClick={() => handleTabChange("jobs")}
                      className="text-green-600 text-sm font-medium hover:text-green-700"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {jobs.slice(0, 3).map((job) => (
                      <div
                        key={job._id}
                        className="border-l-4 border-green-200 pl-4"
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
                        <div className="flex items-center gap-2 mt-2">
                          {job.isMaternityFriendly && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                              Family-friendly
                            </span>
                          )}
                          {job.flexibleHours && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Flexible hours
                            </span>
                          )}
                          {dataStatus.usingRealData && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                              Live
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {jobs.length === 0 && (
                    <div className="text-center py-8">
                      <Briefcase
                        className="text-gray-300 mx-auto mb-4"
                        size={48}
                      />
                      <p className="text-gray-500">
                        No jobs loaded. Check your connection and try
                        refreshing.
                      </p>
                      <button
                        onClick={() => loadJobs(true)}
                        disabled={loading}
                        className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Retry Loading Jobs
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === "tips" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  AI-Powered Career Tips
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadTips(true)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      size={16}
                      className={loading ? "animate-spin" : ""}
                    />
                    Regenerate Tips
                  </button>
                </div>
              </div>

              <div className="grid gap-6">
                {tips.map((tip) => (
                  <div
                    key={tip._id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tip.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {tip.aiGenerated && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                            <Sparkles size={12} />
                            AI Generated
                          </span>
                        )}
                        {tip.relevanceScore && (
                          <span className="text-sm text-gray-500">
                            {Math.round(tip.relevanceScore)}% relevance
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {tip.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {tip.category.replace("_", " ")}
                      </span>
                      {tip.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {tips.length === 0 && (
                <div className="text-center py-12">
                  <Lightbulb className="text-gray-300 mx-auto mb-6" size={64} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Tips Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Generate AI insights first to get personalized career tips.
                  </p>
                  <button
                    onClick={() => generateAIInsights()}
                    disabled={loading}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    Generate AI Insights
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Live Job Opportunities
                  </h2>
                  {dataStatus.usingRealData && dataStatus.lastUpdate && (
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                      Updated {dataStatus.lastUpdate.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => loadJobs(true)}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh Jobs
                </button>
              </div>

              {/* Job Filters */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={jobFilters.type}
                    onChange={(e) =>
                      setJobFilters((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>

                  <select
                    value={jobFilters.workArrangement}
                    onChange={(e) =>
                      setJobFilters((prev) => ({
                        ...prev,
                        workArrangement: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Arrangements</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Location"
                    value={jobFilters.location}
                    onChange={(e) =>
                      setJobFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />

                  <button
                    onClick={() => loadJobs()}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Job Listings */}
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <p className="text-gray-600">
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {job.matchScore}%
                        </div>
                        <div className="text-sm text-gray-500">match</div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {job.workArrangement}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {job.type}
                      </span>
                      {job.isMaternityFriendly && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          Family-friendly
                        </span>
                      )}
                      {job.flexibleHours && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          Flexible hours
                        </span>
                      )}
                      {dataStatus.usingRealData && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                          Live posting
                        </span>
                      )}
                    </div>

                    {job.salaryRange && (
                      <div className="text-gray-600 mb-4">
                        <strong>Salary:</strong> {job.salaryRange.currency}{" "}
                        {job.salaryRange.min.toLocaleString()} -{" "}
                        {job.salaryRange.max.toLocaleString()}
                      </div>
                    )}

                    {job.reasonsForMatch && job.reasonsForMatch.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Why this matches you:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.reasonsForMatch.map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-500 flex-shrink-0"
                              />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-purple-500 text-white text-center py-3 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Apply Now
                      </a>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="text-gray-300 mx-auto mb-6" size={64} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Jobs Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {!dataStatus.isOnline
                      ? "You're offline. Connect to internet to load live job opportunities."
                      : "No jobs match your current filters. Try adjusting your search criteria."}
                  </p>
                  <button
                    onClick={() => loadJobs(true)}
                    disabled={loading || !dataStatus.isOnline}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Retry"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
