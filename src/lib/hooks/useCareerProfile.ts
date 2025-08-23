// hooks/useCareerProfile.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface UseCareerProfileReturn {
  profile: any | null;
  stats: any | null;
  loading: boolean;
  error: string | null;
  hasProfile: boolean;
  completionPercentage: number;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<boolean>;
  createProfile: (data: any) => Promise<boolean>;
}

export const useCareerProfile = (): UseCareerProfileReturn => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const fetchProfile = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if profile exists and get basic info
      const checkResponse = await fetch("/api/career/profile/check");
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        setHasProfile(checkData.hasProfile);
        setCompletionPercentage(checkData.completionPercentage);

        if (checkData.hasProfile) {
          // Fetch full profile
          const profileResponse = await fetch("/api/career/profile");
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setProfile(profileData);

            // Fetch stats
            const statsResponse = await fetch("/api/career/profile/stats");
            if (statsResponse.ok) {
              const statsData = await statsResponse.json();
              setStats(statsData);
            }
          }
        }
      }
    } catch (err) {
      setError("Failed to fetch profile");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: any): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch("/api/career/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchProfile(); // Refresh data
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        return false;
      }
    } catch (err) {
      setError("Failed to create profile");
      console.error("Profile creation error:", err);
      return false;
    }
  };

  const updateProfile = async (data: any): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch("/api/career/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchProfile(); // Refresh data
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        return false;
      }
    } catch (err) {
      setError("Failed to update profile");
      console.error("Profile update error:", err);
      return false;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

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
  };
};
