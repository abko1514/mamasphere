// lib/hooks/useCareerProfile.ts
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface ProfileStats {
  profileCompletion: number;
  availableJobs: number;
  savedJobs: number;
  applications: number;
  lastUpdated: Date;
  memberSince: Date;
}

export interface UseCareerProfileReturn {
  profile: any | null;
  stats: ProfileStats | null;
  loading: boolean;
  error: string | null;
  hasProfile: boolean;
  completionPercentage: number;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<any>) => Promise<boolean>;
  createProfile: (data: any) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;
  exportProfile: () => Promise<void>;
}

export function useCareerProfile(): UseCareerProfileReturn {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any | null>(null);
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
    async (data: Partial<any>): Promise<boolean> => {
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
    async (data: any): Promise<boolean> => {
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
  const [insights, setInsights] = useState(null);
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
  const [tips, setTips] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [freelanceOps, setFreelanceOps] = useState([]);
  const [businesses, setBusinesses] = useState([]);
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

  const fetchJobs = useCallback(async (filters = {}, limit = 20) => {
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
  }, []);

  const fetchFreelanceOps = useCallback(async (filters = {}, limit = 15) => {
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
  }, []);

  const fetchBusinesses = useCallback(async (filters = {}, limit = 25) => {
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
  }, []);

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
    async (jobId: string, applicationData: any) => {
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
export function useProfileForm(initialData: any = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(
    (field: string, value: any) => {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);

      // Clear error for this field if it exists
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const updateNestedField = useCallback((path: string, value: any) => {
    const keys = path.split(".");
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setIsDirty(true);
  }, []);

  const addArrayItem = useCallback((field: string, item: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), item],
    }));
    setIsDirty(true);
  }, []);

  const removeArrayItem = useCallback((field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, i: number) => i !== index),
    }));
    setIsDirty(true);
  }, []);

  const updateArrayItem = useCallback(
    (field: string, index: number, item: any) => {
      setFormData((prev: any) => ({
        ...prev,
        [field]: (prev[field] || []).map((existingItem: any, i: number) =>
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
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
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
      const years = parseInt(formData.yearsOfExperience);
      if (isNaN(years) || years < 0 || years > 50) {
        newErrors.yearsOfExperience =
          "Years of experience must be between 0 and 50";
      }
    }

    // Children ages validation
    if (formData.childrenAges && Array.isArray(formData.childrenAges)) {
      const invalidAges = formData.childrenAges.some((age: any) => {
        const ageNum = parseInt(age);
        return isNaN(ageNum) || ageNum < 0 || ageNum > 25;
      });
      if (invalidAges) {
        newErrors.childrenAges = "Children ages must be between 0 and 25";
      }
    }

    // Salary range validation
    if (formData.desiredSalaryRange) {
      const { min, max } = formData.desiredSalaryRange;
      if (min && max && parseInt(min) > parseInt(max)) {
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
