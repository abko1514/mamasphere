import React, { useState, useEffect } from "react";
import {
  User,
  Edit3,
  BarChart3,
  Briefcase,
  MapPin,
  Calendar,
  Award,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Settings,
  Heart,
  Baby,
  Clock,
  Globe,
  Sparkles,
  Zap,
  ArrowRight,
  Star,
  Building2,
  DollarSign,
  GraduationCap,
  Languages,
  X,
  Camera,
  Phone,
  Mail,
  Users,
  BookOpen,
  Eye,
  MessageSquare,
} from "lucide-react";

// Mock data and types based on your schema
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  location: string;
  bio?: string;
  avatar?: string;
  isPregnant: boolean;
  dueDate?: Date;
  pregnancyWeek?: number;
  childrenAges: number[];
  partnerName?: string;
  familyStatus: string;
  currentRole?: string;
  company?: string;
  industry: string;
  workExperience: {
    id: string;
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    achievements: string[];
    skills: string[];
    location: string;
    employmentType: string;
  }[];
  skillsAndExperience: string[];
  educationLevel: string;
  educationDetails: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date;
    gpa?: number;
    achievements?: string[];
    description?: string;
  }[];
  careerGoals?: string;
  workPreference: string;
  availabilityStatus: string;
  desiredSalaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  certifications: { id: string; name: string; issuer: string; issueDate: Date; expiryDate: Date | null; credentialUrl?: string; skills?: string[] }[];
  languages: { language: string; proficiency: string }[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  interests: string[];
  supportGroups: string[];
  mentorStatus: string;
  jobAlerts: boolean;
  newsletter: boolean;
  communityUpdates: boolean;
  mentorshipInterested: boolean;
  profileVisibility: string;
  showContactInfo: boolean;
  allowMessages: boolean;
  yearsOfExperience: number;
  careerBreakDuration: number;
  returnToWorkDate?: Date;
  flexibilityNeeds: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

interface AICareerInsight {
  _id: string;
  userId: string;
  insights: {
    strengthsAnalysis: string[];
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
  };
  confidenceScore: number;
  generatedAt: Date;
}

const CareerProfileManagement = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [aiInsights, setAiInsights] = useState<AICareerInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<UserProfile>>(
    {}
  );
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock profile data
  const mockProfile: UserProfile = {
    _id: "profile_123",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: new Date("1990-05-15"),
    location: "San Francisco, CA",
    bio: "Experienced marketing professional passionate about digital transformation and work-life balance. Currently seeking opportunities that offer flexibility while advancing my career in tech marketing.",
    avatar: "/api/placeholder/150/150",
    isPregnant: false,
    childrenAges: [3, 6],
    partnerName: "Michael Johnson",
    familyStatus: "married",
    currentRole: "Senior Marketing Manager",
    company: "TechCorp Solutions",
    industry: "Technology",
    workExperience: [
      {
        id: "1",
        company: "TechCorp Solutions",
        position: "Senior Marketing Manager",
        startDate: new Date("2021-01-01"),
        endDate: null,
        isCurrent: true,
        description:
          "Lead digital marketing campaigns for B2B SaaS products, managing a team of 5 marketing specialists.",
        achievements: [
          "Increased lead generation by 150%",
          "Reduced customer acquisition cost by 30%",
        ],
        skills: ["Digital Marketing", "Team Leadership", "Analytics"],
        location: "San Francisco, CA",
        employmentType: "full-time",
      },
      {
        id: "2",
        company: "StartupXYZ",
        position: "Marketing Specialist",
        startDate: new Date("2018-06-01"),
        endDate: new Date("2020-12-31"),
        isCurrent: false,
        description:
          "Developed and executed content marketing strategies for early-stage startup.",
        achievements: [
          "Built brand from scratch",
          "Created content strategy that drove 200% traffic growth",
        ],
        skills: ["Content Marketing", "SEO", "Social Media"],
        location: "San Francisco, CA",
        employmentType: "full-time",
      },
    ],
    skillsAndExperience: [
      "Digital Marketing",
      "Content Strategy",
      "Team Leadership",
      "Analytics",
      "SEO",
      "Social Media Marketing",
      "Project Management",
      "Data Analysis",
      "Campaign Management",
      "Brand Strategy",
    ],
    educationLevel: "masters",
    educationDetails: [
      {
        id: "1",
        institution: "Stanford University",
        degree: "Master of Business Administration",
        field: "Marketing",
        startDate: new Date("2016-09-01"),
        endDate: new Date("2018-05-15"),
        gpa: 3.8,
        achievements: ["Dean's List", "Marketing Excellence Award"],
        description: "Focused on digital marketing and consumer behavior",
      },
      {
        id: "2",
        institution: "UC Berkeley",
        degree: "Bachelor of Arts",
        field: "Communications",
        startDate: new Date("2012-08-01"),
        endDate: new Date("2016-05-15"),
        gpa: 3.6,
        achievements: ["Summa Cum Laude", "Communications Honor Society"],
        description:
          "Concentration in digital media and marketing communications",
      },
    ],
    careerGoals:
      "I aspire to become a VP of Marketing at a mission-driven tech company where I can leverage my expertise in digital marketing to drive meaningful growth while maintaining work-life balance. I'm particularly interested in companies that support working mothers and offer flexible arrangements.",
    workPreference: "hybrid",
    availabilityStatus: "actively_working",
    desiredSalaryRange: {
      min: 120000,
      max: 160000,
      currency: "USD",
    },
    certifications: [
      {
        id: "1",
        name: "Google Analytics Certified",
        issuer: "Google",
        issueDate: new Date("2023-01-15"),
        expiryDate: new Date("2024-01-15"),
        credentialUrl: "https://google.com/cert/123",
        skills: ["Analytics", "Data Analysis"],
      },
      {
        id: "2",
        name: "HubSpot Content Marketing Certification",
        issuer: "HubSpot Academy",
        issueDate: new Date("2022-08-10"),
        expiryDate: null,
        skills: ["Content Marketing", "Inbound Marketing"],
      },
    ],
    languages: [
      { language: "English", proficiency: "native" },
      { language: "Spanish", proficiency: "intermediate" },
      { language: "French", proficiency: "basic" },
    ],
    portfolioUrl: "https://sarahjohnson.portfolio.com",
    linkedinUrl: "https://linkedin.com/in/sarahjohnson",
    githubUrl: "",
    interests: [
      "Digital Innovation",
      "Working Parents Network",
      "Sustainable Business",
      "Women in Tech",
    ],
    supportGroups: ["Working Mothers in Tech", "Marketing Leaders Circle"],
    mentorStatus: "both",
    jobAlerts: true,
    newsletter: true,
    communityUpdates: true,
    mentorshipInterested: true,
    profileVisibility: "community",
    showContactInfo: false,
    allowMessages: true,
    yearsOfExperience: 6,
    careerBreakDuration: 0,
    flexibilityNeeds: [
      "School pickup/dropoff flexibility",
      "Work from home options",
      "Flexible meeting hours",
      "Childcare emergency support",
    ],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };

  // Mock AI insights
  const mockAIInsights: AICareerInsight = {
    _id: "insight_123",
    userId: "profile_123",
    insights: {
      strengthsAnalysis: [
        "Strong leadership skills with proven team management experience",
        "Excellent track record in digital marketing and campaign performance",
        "Data-driven approach with strong analytical capabilities",
        "Proven ability to drive growth and reduce costs simultaneously",
        "Strong educational background with practical application",
      ],
      careerPathSuggestions: [
        "Director of Digital Marketing at mid-size tech company",
        "VP of Marketing at early-stage startup",
        "Marketing Consultant specializing in B2B SaaS",
        "Head of Growth Marketing at established tech firm",
        "Chief Marketing Officer at mission-driven organization",
      ],
      skillGapAnalysis: [
        "Advanced data science and machine learning for marketing",
        "International marketing and global expansion strategies",
        "Product marketing and go-to-market strategy development",
        "Marketing automation and MarTech stack optimization",
        "Customer success and retention marketing strategies",
      ],
      marketTrends: [
        "70% increase in demand for flexible marketing roles post-pandemic",
        "B2B marketing salaries have grown 15% in the past year",
        "Remote-first companies offering 20-30% salary premiums",
        "AI-powered marketing tools becoming standard requirement",
        "Sustainability-focused companies prioritizing experienced mothers",
        "Marketing leadership roles increasingly requiring data science skills",
      ],
      salaryInsights: {
        currentMarketRate:
          "$135,000 - $170,000 for Senior Marketing Manager in SF Bay Area",
        growthPotential:
          "25-40% salary increase potential with director-level promotion",
        recommendations: [
          "Consider negotiating for equity in addition to base salary",
          "Remote work premium could add $10-15k to total compensation",
          "Your experience level commands top 25% of market rates",
          "Certifications in marketing automation could add $5-10k value",
        ],
      },
      workLifeBalanceRecommendations: [
        "Target companies with established parental leave policies",
        "Look for organizations with childcare support or stipends",
        "Consider B-corp certified companies that prioritize work-life balance",
        "Explore roles with outcome-based rather than time-based performance metrics",
        "Research companies with other working parent employees in leadership",
      ],
      networkingOpportunities: [
        "Women in Marketing Leadership SF Chapter",
        "Tech Moms Professional Network",
        "B2B Marketing Leaders Meetup",
        "Stanford Alumni Marketing Group",
        "Working Parents in Tech Slack Community",
      ],
    },
    confidenceScore: 87,
    generatedAt: new Date(),
  };

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfile(mockProfile);
      setAiInsights(mockAIInsights);
      calculateCompletionPercentage(mockProfile);
      setLoading(false);
    }, 1500);
  }, []);

  const calculateCompletionPercentage = (profileData: UserProfile) => {
    const requiredFields = [
      "name",
      "email",
      "location",
      "industry",
      "yearsOfExperience",
      "workPreference",
      "availabilityStatus",
    ];

    const optionalFields = [
      "bio",
      "currentRole",
      "company",
      "careerGoals",
      "phone",
      "skillsAndExperience",
      "workExperience",
      "educationDetails",
      "certifications",
      "languages",
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    requiredFields.forEach((field) => {
      if (
        profileData[field as keyof UserProfile] &&
        String(profileData[field as keyof UserProfile]).trim()
      ) {
        completedRequired++;
      }
    });

    optionalFields.forEach((field) => {
      const value = profileData[field as keyof UserProfile];
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          completedOptional++;
        } else if (typeof value === "string" && value.trim()) {
          completedOptional++;
        } else if (typeof value === "object" && Object.keys(value).length > 0) {
          completedOptional++;
        }
      }
    });

    const requiredWeight = 70;
    const optionalWeight = 30;

    const requiredPercentage =
      (completedRequired / requiredFields.length) * requiredWeight;
    const optionalPercentage =
      (completedOptional / optionalFields.length) * optionalWeight;

    setCompletionPercentage(
      Math.round(requiredPercentage + optionalPercentage)
    );
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAvailabilityStatusInfo = (status: string) => {
    const statusMap = {
      maternity_leave: {
        label: "On Maternity Leave",
        icon: Baby,
        color: "bg-pink-100 text-pink-700",
      },
      returning_to_work: {
        label: "Returning to Work",
        icon: Clock,
        color: "bg-blue-100 text-blue-700",
      },
      actively_working: {
        label: "Actively Working",
        icon: Briefcase,
        color: "bg-green-100 text-green-700",
      },
      seeking_opportunities: {
        label: "Seeking Opportunities",
        icon: Target,
        color: "bg-yellow-100 text-yellow-700",
      },
      career_break: {
        label: "Career Break",
        icon: Heart,
        color: "bg-purple-100 text-purple-700",
      },
    };
    return (
      statusMap[status as keyof typeof statusMap] || {
        label: status,
        icon: User,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  const ProfileEditForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={() => setShowEditForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingProfile.name || profile?.name || ""}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editingProfile.phone || profile?.phone || ""}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editingProfile.location || profile?.location || ""}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role
                </label>
                <input
                  type="text"
                  value={
                    editingProfile.currentRole || profile?.currentRole || ""
                  }
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      currentRole: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                value={editingProfile.bio || profile?.bio || ""}
                onChange={(e) =>
                  setEditingProfile({ ...editingProfile, bio: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
              />
            </div>
          </div>

          {/* Career Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Career Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={editingProfile.industry || profile?.industry || ""}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      industry: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={
                    editingProfile.yearsOfExperience ||
                    profile?.yearsOfExperience ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      yearsOfExperience: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Preference
                </label>
                <select
                  value={
                    editingProfile.workPreference ||
                    profile?.workPreference ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      workPreference: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowEditForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Here you would save the profile
                setShowEditForm(false);
                // Update the profile with edited data
                if (profile) {
                  setProfile({ ...profile, ...editingProfile });
                  calculateCompletionPercentage({
                    ...profile,
                    ...editingProfile,
                  });
                }
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const TabButton = ({
    tabId,
    label,
    icon: Icon,
    isActive,
  }: {
    tabId: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
        isActive
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <User size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Profile Found
          </h2>
          <p className="text-gray-600 mb-4">
            Create your profile to get started
          </p>
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getAvailabilityStatusInfo(profile.availabilityStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {showEditForm && <ProfileEditForm />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                  <Camera size={14} className="text-gray-600" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                  {profile.currentRole && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} />
                      {profile.currentRole}
                      {profile.company && ` at ${profile.company}`}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {profile.yearsOfExperience} years experience
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                  >
                    <StatusIcon size={14} />
                    {statusInfo.label}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    <Globe size={14} />
                    {profile.workPreference}
                  </span>
                  {profile.childrenAges.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                      <Heart size={14} />
                      {profile.childrenAges.length} child
                      {profile.childrenAges.length !== 1 ? "ren" : ""}
                    </span>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-gray-600 leading-relaxed max-w-2xl">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => setShowEditForm(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                <BarChart3 size={16} />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {completionPercentage < 80 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <AlertCircle
                className="text-yellow-600 flex-shrink-0"
                size={24}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Complete Your Profile ({completionPercentage}%)
                </h3>
                <p className="text-yellow-800 mb-4">
                  A complete profile helps us provide better job matches and
                  career recommendations.
                </p>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Complete Now
                </button>
              </div>
              <div className="flex-shrink-0">
                <div className="w-16 h-16 relative">
                  <svg
                    className="w-16 h-16 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-yellow-500"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${completionPercentage}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-yellow-700">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TabButton
            tabId="overview"
            label="Overview"
            icon={User}
            isActive={activeTab === "overview"}
          />
          <TabButton
            tabId="experience"
            label="Experience"
            icon={Briefcase}
            isActive={activeTab === "experience"}
          />
          <TabButton
            tabId="insights"
            label="AI Insights"
            icon={Zap}
            isActive={activeTab === "insights"}
          />
          <TabButton
            tabId="goals"
            label="Goals"
            icon={Target}
            isActive={activeTab === "goals"}
          />
          <TabButton
            tabId="settings"
            label="Settings"
            icon={Settings}
            isActive={activeTab === "settings"}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills & Expertise */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Skills & Expertise
                  </h3>
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsAndExperience.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {completionPercentage}%
                  </div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>

                <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Award className="text-blue-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.certifications.length}
                  </div>
                  <div className="text-sm text-gray-600">Certifications</div>
                </div>

                <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Languages className="text-purple-600" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.languages.length}
                  </div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Work Experience
                  </h3>
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-6">
                  {profile.workExperience.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {index < profile.workExperience.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-purple-200"></div>
                      )}
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="text-purple-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {exp.position}
                              </h4>
                              <p className="text-purple-600 font-medium">
                                {exp.company}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {formatDate(exp.startDate)} -{" "}
                              {exp.isCurrent
                                ? "Present"
                                : exp.endDate
                                ? formatDate(exp.endDate)
                                : ""}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-gray-600 text-sm mb-3">
                              {exp.description}
                            </p>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="space-y-1 mb-3">
                              {exp.achievements.map(
                                (achievement: string, achIndex: number) => (
                                  <div
                                    key={achIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <Star
                                      size={12}
                                      className="text-yellow-500 mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {achievement}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                          {exp.skills && exp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {exp.skills.map(
                                (skill: string, skillIndex: number) => (
                                  <span
                                    key={skillIndex}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Education
                  </h3>
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-4">
                  {profile.educationDetails.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {edu.degree}
                            </h4>
                            <p className="text-blue-600 font-medium">
                              {edu.institution}
                            </p>
                            <p className="text-gray-600 text-sm">{edu.field}</p>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {formatDate(edu.startDate)} -{" "}
                            {formatDate(edu.endDate)}
                          </span>
                        </div>
                        {edu.gpa && (
                          <p className="text-sm text-gray-600 mb-2">
                            GPA: {edu.gpa}
                          </p>
                        )}
                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {edu.achievements.map(
                              (achievement: string, achIndex: number) => (
                                <span
                                  key={achIndex}
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                >
                                  {achievement}
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Goals */}
              {profile.careerGoals && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Career Goals
                    </h3>
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {profile.careerGoals}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Side Info */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-gray-700">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-gray-700">{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-700">{profile.location}</span>
                  </div>
                </div>
              </div>

              {/* Professional Links */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Professional Links
                </h3>
                <div className="space-y-3">
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                    >
                      <Globe size={16} />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {profile.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-purple-600 hover:text-purple-700"
                    >
                      <Globe size={16} />
                      <span>Portfolio Website</span>
                    </a>
                  )}
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-700"
                    >
                      <Globe size={16} />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Salary Expectations */}
              {profile.desiredSalaryRange && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Salary Expectations
                  </h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {profile.desiredSalaryRange.currency}{" "}
                      {profile.desiredSalaryRange.min.toLocaleString()} -{" "}
                      {profile.desiredSalaryRange.max.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Annual salary range
                    </div>
                  </div>
                </div>
              )}

              {/* Certifications */}
              {profile.certifications.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Certifications
                  </h3>
                  <div className="space-y-4">
                    {profile.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="border-l-2 border-purple-200 pl-3"
                      >
                        <h4 className="font-medium text-gray-900">
                          {cert.name}
                        </h4>
                        <p className="text-sm text-purple-600">{cert.issuer}</p>
                        <p className="text-xs text-gray-500">
                          Issued: {formatDate(cert.issueDate)}
                          {cert.expiryDate &&
                            ` • Expires: ${formatDate(cert.expiryDate)}`}
                        </p>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1"
                          >
                            View Certificate
                            <Globe size={10} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {profile.languages.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Languages
                  </h3>
                  <div className="space-y-2">
                    {profile.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700">{lang.language}</span>
                        <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Family & Personal */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Family Status</span>
                    <span className="font-medium capitalize">
                      {profile.familyStatus}
                    </span>
                  </div>
                  {profile.childrenAges.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Children Ages</span>
                      <span className="font-medium">
                        {profile.childrenAges.join(", ")}
                      </span>
                    </div>
                  )}
                  {profile.isPregnant && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expecting</span>
                      <span className="font-medium">
                        {profile.dueDate
                          ? `Due ${formatDate(profile.dueDate)}`
                          : "Yes"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Flexibility Needs */}
              {profile.flexibilityNeeds.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Flexibility Needs
                  </h3>
                  <div className="space-y-2">
                    {profile.flexibilityNeeds.map((need, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle
                          size={14}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700">{need}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === "insights" && aiInsights && (
          <div className="space-y-8">
            {/* AI Insights Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Zap className="text-yellow-300" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    AI Career Insights
                  </h2>
                  <p className="opacity-90">
                    Personalized career guidance powered by AI • Generated on{" "}
                    {formatDate(aiInsights.generatedAt)} • Confidence:{" "}
                    {aiInsights.confidenceScore}%
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star size={16} className="text-yellow-300" />
                    Key Strengths
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.insights.strengthsAnalysis
                      .slice(0, 3)
                      .map((strength, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle
                            size={14}
                            className="text-green-300 mt-0.5 flex-shrink-0"
                          />
                          <span>{strength}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-300" />
                    Growth Areas
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.insights.careerPathSuggestions
                      .slice(0, 3)
                      .map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <ArrowRight
                            size={14}
                            className="text-blue-300 mt-0.5 flex-shrink-0"
                          />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe size={16} className="text-pink-300" />
                    Market Insights
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.insights.marketTrends
                      .slice(0, 3)
                      .map((trend, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Sparkles
                            size={14}
                            className="text-pink-300 mt-0.5 flex-shrink-0"
                          />
                          <span>{trend}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Detailed Insights */}
              <div className="space-y-6">
                {/* Strengths Analysis */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="text-yellow-500" size={20} />
                    Strengths Analysis
                  </h3>
                  <div className="space-y-3">
                    {aiInsights.insights.strengthsAnalysis.map(
                      (strength, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                        >
                          <CheckCircle
                            size={16}
                            className="text-green-500 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-gray-700">{strength}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Career Path Suggestions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={20} />
                    Career Path Suggestions
                  </h3>
                  <div className="space-y-3">
                    {aiInsights.insights.careerPathSuggestions.map(
                      (suggestion, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                        >
                          <ArrowRight
                            size={16}
                            className="text-blue-500 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-gray-700">{suggestion}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Skill Gap Analysis */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="text-orange-500" size={20} />
                    Skills to Develop
                  </h3>
                  <div className="space-y-3">
                    {aiInsights.insights.skillGapAnalysis.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"
                      >
                        <Plus
                          size={16}
                          className="text-orange-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Salary Insights */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="text-green-500" size={20} />
                    Salary Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Current Market Rate
                      </h4>
                      <p className="text-gray-700">
                        {aiInsights.insights.salaryInsights.currentMarketRate}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Growth Potential
                      </h4>
                      <p className="text-gray-700">
                        {aiInsights.insights.salaryInsights.growthPotential}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">
                        Recommendations
                      </h4>
                      {aiInsights.insights.salaryInsights.recommendations.map(
                        (rec, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Sparkles
                              size={14}
                              className="text-purple-500 mt-1 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Work-Life Balance */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="text-pink-500" size={20} />
                    Work-Life Balance
                  </h3>
                  <div className="space-y-3">
                    {aiInsights.insights.workLifeBalanceRecommendations.map(
                      (rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg"
                        >
                          <Heart
                            size={16}
                            className="text-pink-500 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-gray-700">{rec}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Networking Opportunities */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="text-indigo-500" size={20} />
                    Networking Opportunities
                  </h3>
                  <div className="space-y-3">
                    {aiInsights.insights.networkingOpportunities.map(
                      (opportunity, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg"
                        >
                          <Users
                            size={16}
                            className="text-indigo-500 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-gray-700">{opportunity}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="text-purple-500" size={20} />
                Market Trends & Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {aiInsights.insights.marketTrends.map((trend, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <TrendingUp
                      size={16}
                      className="text-purple-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-700">{trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="space-y-8">
            {/* Experience Overview */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Professional Experience
                </h2>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Plus size={16} />
                  Add Experience
                </button>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-200"></div>

                {profile.workExperience.map((exp) => (
                  <div key={exp.id} className="relative mb-12 last:mb-0">
                    <div className="absolute left-6 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-sm"></div>

                    <div className="ml-20 bg-gray-50 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-lg text-purple-600 font-medium">
                            {exp.company}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {exp.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {exp.employmentType}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-white px-3 py-1 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                            {formatDate(exp.startDate)} -{" "}
                            {exp.isCurrent
                              ? "Present"
                              : exp.endDate
                              ? formatDate(exp.endDate)
                              : ""}
                          </span>
                          {exp.isCurrent && (
                            <div className="mt-2">
                              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                Current Position
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Key Achievements
                          </h4>
                          <div className="space-y-2">
                            {exp.achievements.map(
                              (achievement: string, achIndex: number) => (
                                <div
                                  key={achIndex}
                                  className="flex items-start gap-2"
                                >
                                  <Star
                                    size={14}
                                    className="text-yellow-500 mt-1 flex-shrink-0"
                                  />
                                  <span className="text-gray-700">
                                    {achievement}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {exp.skills && exp.skills.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Skills Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map(
                              (skill: string, skillIndex: number) => (
                                <span
                                  key={skillIndex}
                                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus size={16} />
                  Add Education
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {profile.educationDetails.map((edu) => (
                  <div key={edu.id} className="bg-blue-50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {edu.institution}
                        </p>
                        <p className="text-gray-600 mb-2">{edu.field}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>
                            {formatDate(edu.startDate)} -{" "}
                            {formatDate(edu.endDate)}
                          </span>
                          {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        </div>

                        {edu.description && (
                          <p className="text-gray-700 text-sm mb-3">
                            {edu.description}
                          </p>
                        )}

                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {edu.achievements.map(
                              (achievement: string, achIndex: number) => (
                                <span
                                  key={achIndex}
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                                >
                                  {achievement}
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Certifications & Training
                </h2>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} />
                  Add Certification
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="bg-green-50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="text-green-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cert.name}
                        </h3>
                        <p className="text-green-600 font-medium">
                          {cert.issuer}
                        </p>

                        <div className="text-sm text-gray-600 mb-3">
                          <span>Issued: {formatDate(cert.issueDate)}</span>
                          {cert.expiryDate && (
                            <span className="block">
                              Expires: {formatDate(cert.expiryDate)}
                            </span>
                          )}
                        </div>

                        {cert.skills && cert.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {cert.skills.map(
                              (skill: string, skillIndex: number) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        )}

                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            View Certificate
                            <Globe size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="space-y-8">
            {/* Career Goals */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Career Goals & Aspirations
                </h2>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Edit3 size={16} />
                  Edit Goals
                </button>
              </div>

              {profile.careerGoals && (
                <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="text-purple-600" size={20} />
                    Long-term Career Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {profile.careerGoals}
                  </p>
                </div>
              )}

              {/* Goal Categories */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Professional Objectives
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <TrendingUp
                        className="text-blue-600 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Career Advancement
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Seeking leadership roles in marketing at
                          mission-driven companies
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                      <BookOpen
                        className="text-green-600 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Skill Development
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Expand expertise in data science and AI-powered
                          marketing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                      <Users
                        className="text-orange-600 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Network Growth
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Build connections with other working mothers in
                          leadership
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Work-Life Integration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                      <Heart
                        className="text-pink-600 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Family Balance
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Maintain flexibility for family commitments while
                          advancing career
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                      <Clock
                        className="text-indigo-600 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Flexible Schedule
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Find roles with outcome-based performance rather than
                          time-based
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl">
                      <Globe
                        className="text-teal-600 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Remote Opportunities
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Explore remote-first companies that value work-life
                          balance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Action Plan
              </h2>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Short-term (3-6 months)
                    </h3>
                    <span className="text-sm text-gray-500">In Progress</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-gray-700">
                        Complete advanced analytics certification
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Join Women in Marketing Leadership group
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Update portfolio with recent campaign results
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Medium-term (6-12 months)
                    </h3>
                    <span className="text-sm text-gray-500">Planned</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Apply for Director-level positions at target companies
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Develop data science skills through online courses
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Attend 3 industry conferences with childcare support
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Long-term (1-3 years)
                    </h3>
                    <span className="text-sm text-gray-500">Vision</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Secure VP of Marketing role at mission-driven company
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Mentor other working mothers in tech
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">
                        Establish thought leadership in marketing automation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Privacy Settings */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Privacy & Visibility Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Eye className="text-gray-600" size={20} />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Profile Visibility
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Control who can see your profile
                      </p>
                    </div>
                  </div>
                  <select
                    value={profile.profileVisibility}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="public">Public</option>
                    <option value="community">Community Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-600" size={20} />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Show Contact Information
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Display phone and email to other users
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.showContactInfo}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-gray-600" size={20} />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Allow Messages
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Let other users send you direct messages
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.allowMessages}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Job Alerts</h3>
                    <p className="text-gray-600 text-sm">
                      Receive notifications about new job matches
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.jobAlerts}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Newsletter</h3>
                    <p className="text-gray-600 text-sm">
                      Weekly career tips and industry insights
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.newsletter}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Community Updates
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Updates about community events and networking
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.communityUpdates}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Mentorship Opportunities
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Notifications about mentoring and being mentored
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.mentorshipInterested}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Account Management
              </h2>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-2 p-4 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors">
                  <Settings size={20} />
                  Export My Data
                </button>

                <button className="w-full flex items-center justify-center gap-2 p-4 border border-yellow-300 text-yellow-600 rounded-xl hover:bg-yellow-50 transition-colors">
                  <AlertCircle size={20} />
                  Deactivate Account
                </button>

                <button className="w-full flex items-center justify-center gap-2 p-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                  <X size={20} />
                  Delete Account
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-4 text-center">
                Last updated: {formatDate(profile.updatedAt)} • Member since:{" "}
                {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerProfileManagement;
