// lib/hooks/useCareerProfile.ts
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

// Define proper interfaces for type safety
export interface CareerProfile {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  industry: string;
  yearsOfExperience: number;
  skills: string[];
  education: EducationItem[];
  workExperience: WorkExperienceItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  desiredSalaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  workPreferences: {
    remote: boolean;
    hybrid: boolean;
    onSite: boolean;
    partTime: boolean;
    fullTime: boolean;
    contract: boolean;
  };
  availability: {
    startDate: Date;
    hoursPerWeek: number;
  };
  personalInfo?: {
    maritalStatus?: string;
    hasChildren?: boolean;
    childrenAges?: number[];
    disabilities?: string[];
  };
  bio?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  gpa?: number;
  achievements?: string[];
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  dateObtained: Date;
  expiryDate?: Date;
  credentialId?: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface ProfileStats {
  profileCompletion: number;
  availableJobs: number;
  savedJobs: number;
  applications: number;
  lastUpdated: Date;
  memberSince: Date;
}

export interface AIInsights {
  id: string;
  profileStrengths: string[];
  improvementSuggestions: string[];
  careerRecommendations: string[];
  skillGaps: string[];
  marketDemand: {
    score: number;
    explanation: string;
  };
  salaryInsights: {
    suggestedRange: {
      min: number;
      max: number;
      currency: string;
    };
    marketComparison: string;
  };
  generatedAt: Date;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: "full-time" | "part-time" | "contract" | "freelance";
  remote: boolean;
  description: string;
  requirements: string[];
  skills: string[];
  matchScore: number;
  postedDate: Date;
  applicationDeadline?: Date;
  url?: string;
}

export interface FreelanceOpportunity {
  id: string;
  title: string;
  client: string;
  budget: {
    min: number;
    max: number;
    currency: string;
    type: "fixed" | "hourly";
  };
  duration: string;
  description: string;
  skills: string[];
  experience: string;
  remote: boolean;
  matchScore: number;
  postedDate: Date;
  proposalDeadline?: Date;
  url?: string;
}

export interface BusinessOpportunity {
  id: string;
  name: string;
  industry: string;
  type: "startup" | "franchise" | "partnership" | "acquisition";
  investment: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  location: string;
  remote: boolean;
  roi: {
    estimated: number;
    timeframe: string;
  };
  riskLevel: "low" | "medium" | "high";
  matchScore: number;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  listedDate: Date;
}

export interface CareerTip {
  id: string;
  title: string;
  category:
    | "resume"
    | "interview"
    | "networking"
    | "skills"
    | "career-change"
    | "salary";
  content: string;
  tags: string[];
  readTime: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
}

export interface JobApplication {
  jobId: string;
  coverLetter: string;
  resume?: File;
  additionalDocuments?: File[];
  expectedSalary?: number;
  startDate?: Date;
  message?: string;
}

export interface UseCareerProfileReturn {
  profile: CareerProfile | null;
  stats: ProfileStats | null;
  loading: boolean;
  error: string | null;
  hasProfile: boolean;
  completionPercentage: number;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<CareerProfile>) => Promise<boolean>;
  createProfile: (
    data: Omit<CareerProfile, "id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;
  exportProfile: () => Promise<void>;
}

export function useCareerProfile(): UseCareerProfileReturn {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (status === "loading") return;
    if (!session?.user?.email) {
      setLoading(false);
      setHasProfile(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        setHasProfile(false);
        setProfile(null);
        setStats(null);
        setCompletionPercentage(0);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      setProfile(data.profile);
      setStats(data.stats);
      setHasProfile(data.hasProfile);
      setCompletionPercentage(data.completionPercentage || 0);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Update profile
  const updateProfile = useCallback(
    async (data: Partial<CareerProfile>): Promise<boolean> => {
      if (!session?.user?.email) {
        setError("User not authenticated");
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update profile");
        }

        const result = await response.json();
        setProfile(result.profile);

        // Refresh to get updated stats and completion percentage
        await fetchProfile();

        return true;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update profile"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session, fetchProfile]
  );

  // Create profile
  const createProfile = useCallback(
    async (
      data: Omit<CareerProfile, "id" | "userId" | "createdAt" | "updatedAt">
    ): Promise<boolean> => {
      if (!session?.user?.email) {
        setError("User not authenticated");
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create profile");
        }

        const result = await response.json();
        setProfile(result.profile);
        setHasProfile(true);

        // Refresh to get stats and completion percentage
        await fetchProfile();

        return true;
      } catch (err) {
        console.error("Error creating profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create profile"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session, fetchProfile]
  );

  // Delete profile
  const deleteProfile = useCallback(async (): Promise<boolean> => {
    if (!session?.user?.email) {
      setError("User not authenticated");
      return false;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete profile");
      }

      setProfile(null);
      setStats(null);
      setHasProfile(false);
      setCompletionPercentage(0);

      return true;
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError(err instanceof Error ? err.message : "Failed to delete profile");
      return false;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Export profile data
  const exportProfile = useCallback(async (): Promise<void> => {
    if (!session?.user?.email || !hasProfile) {
      setError("No profile to export");
      return;
    }

    try {
      const response = await fetch("/api/profile/export", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to export profile");
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `profile-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting profile:", err);
      setError(err instanceof Error ? err.message : "Failed to export profile");
    }
  }, [session, hasProfile]);

  // Fetch profile on mount and when session changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    stats,
    loading,
    error,
    hasProfile,
    completionPercentage,
    refreshProfile,
    updateProfile,
    createProfile,
    deleteProfile,
    exportProfile,
  };
}

// Additional hook for AI insights
export function useAIInsights() {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const generateInsights = useCallback(
    async (forceRegenerate = false) => {
      if (!session?.user?.email) {
        setError("User not authenticated");
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/profile/insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ forceRegenerate }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate insights");
        }

        const data = await response.json();
        setInsights(data);
        return data;
      } catch (err) {
        console.error("Error generating insights:", err);
        setError(
          err instanceof Error ? err.message : "Failed to generate insights"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return {
    insights,
    loading,
    error,
    generateInsights,
  };
}

// Hook for career data (jobs, tips, etc.)
export function useCareerData() {
  const [tips, setTips] = useState<CareerTip[]>([]);
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [freelanceOps, setFreelanceOps] = useState<FreelanceOpportunity[]>([]);
  const [businesses, setBusinesses] = useState<BusinessOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTips = useCallback(async (limit = 20) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/career/tips?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch career tips");
      }

      const data = await response.json();
      setTips(data.tips || []);
      return data.tips;
    } catch (err) {
      console.error("Error fetching tips:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tips");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobs = useCallback(
    async (filters: Record<string, string> = {}, limit = 20) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          ...filters,
        });

        const response = await fetch(`/api/career/jobs?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job recommendations");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
        return data.jobs;
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchFreelanceOps = useCallback(
    async (filters: Record<string, string> = {}, limit = 15) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          ...filters,
        });

        const response = await fetch(`/api/career/freelance?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch freelance opportunities");
        }

        const data = await response.json();
        setFreelanceOps(data.opportunities || []);
        return data.opportunities;
      } catch (err) {
        console.error("Error fetching freelance opportunities:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch freelance opportunities"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchBusinesses = useCallback(
    async (filters: Record<string, string> = {}, limit = 25) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          ...filters,
        });

        const response = await fetch(`/api/career/businesses?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch businesses");
        }

        const data = await response.json();
        setBusinesses(data.businesses || []);
        return data.businesses;
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch businesses"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const saveJob = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/career/jobs/${jobId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      return true;
    } catch (err) {
      console.error("Error saving job:", err);
      setError(err instanceof Error ? err.message : "Failed to save job");
      return false;
    }
  }, []);

  const applyToJob = useCallback(
    async (jobId: string, applicationData: JobApplication) => {
      try {
        const response = await fetch(`/api/career/jobs/${jobId}/apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        });

        if (!response.ok) {
          throw new Error("Failed to apply to job");
        }

        return true;
      } catch (err) {
        console.error("Error applying to job:", err);
        setError(err instanceof Error ? err.message : "Failed to apply to job");
        return false;
      }
    },
    []
  );

  const contactBusiness = useCallback(
    async (businessId: string, message: string) => {
      try {
        const response = await fetch(
          `/api/career/businesses/${businessId}/contact`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to contact business");
        }

        return true;
      } catch (err) {
        console.error("Error contacting business:", err);
        setError(
          err instanceof Error ? err.message : "Failed to contact business"
        );
        return false;
      }
    },
    []
  );

  return {
    tips,
    jobs,
    freelanceOps,
    businesses,
    loading,
    error,
    fetchTips,
    fetchJobs,
    fetchFreelanceOps,
    fetchBusinesses,
    saveJob,
    applyToJob,
    contactBusiness,
  };
}

// Hook for profile form management
export function useProfileForm(initialData: Partial<CareerProfile> = {}) {
  const [formData, setFormData] = useState<Partial<CareerProfile>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(
    <K extends keyof CareerProfile>(field: K, value: CareerProfile[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);

      // Clear error for this field if it exists
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const updateNestedField = useCallback((path: string, value: unknown) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData as Record<string, unknown>;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Record<string, unknown>;
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setIsDirty(true);
  }, []);

  const addArrayItem = useCallback(<T>(field: keyof CareerProfile, item: T) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...((prev[field] as T[]) || []), item],
    }));
    setIsDirty(true);
  }, []);

  const removeArrayItem = useCallback(
    (field: keyof CareerProfile, index: number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: ((prev[field] as unknown[]) || []).filter(
          (_, i) => i !== index
        ),
      }));
      setIsDirty(true);
    },
    []
  );

  const updateArrayItem = useCallback(
    <T>(field: keyof CareerProfile, index: number, item: T) => {
      setFormData((prev) => ({
        ...prev,
        [field]: ((prev[field] as T[]) || []).map((existingItem, i) =>
          i === index ? item : existingItem
        ),
      }));
      setIsDirty(true);
    },
    []
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      { field: "name", message: "Name is required" },
      { field: "location", message: "Location is required" },
      { field: "industry", message: "Industry is required" },
      {
        field: "yearsOfExperience",
        message: "Years of experience is required",
      },
    ];

    requiredFields.forEach(({ field, message }) => {
      const value = formData[field as keyof CareerProfile];
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = message;
      }
    });

    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Years of experience validation
    if (formData.yearsOfExperience !== undefined) {
      const years = formData.yearsOfExperience;
      if (years < 0 || years > 50) {
        newErrors.yearsOfExperience =
          "Years of experience must be between 0 and 50";
      }
    }

    // Children ages validation
    if (
      formData.personalInfo?.childrenAges &&
      Array.isArray(formData.personalInfo.childrenAges)
    ) {
      const invalidAges = formData.personalInfo.childrenAges.some((age) => {
        return age < 0 || age > 25;
      });
      if (invalidAges) {
        newErrors.childrenAges = "Children ages must be between 0 and 25";
      }
    }

    // Salary range validation
    if (formData.desiredSalaryRange) {
      const { min, max } = formData.desiredSalaryRange;
      if (min && max && min > max) {
        newErrors["desiredSalaryRange.min"] =
          "Minimum salary cannot be greater than maximum salary";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  const getFieldError = useCallback(
    (field: string) => {
      return errors[field];
    },
    [errors]
  );

  const hasErrors = Object.keys(errors).length > 0;

  return {
    formData,
    errors,
    isDirty,
    hasErrors,
    updateField,
    updateNestedField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    validateForm,
    resetForm,
    getFieldError,
  };
}