// components/career/sections/FreelanceSection.tsx
import React, { useEffect, useState } from "react";
import { FreelanceOpportunity } from "@/models/Career";
import {
  Target,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { careerService } from "@/lib/careerService";

interface FreelanceSectionProps {
  opportunities: FreelanceOpportunity[];
  loading: boolean;
  userId: string;
}

export function FreelanceSection({
  opportunities: initialOpportunities,
  loading: initialLoading,
  userId,
}: FreelanceSectionProps) {
  const [opportunities, setOpportunities] =
    useState<FreelanceOpportunity[]>(initialOpportunities);
  const [loading, setLoading] = useState(initialLoading);
  const [filters, setFilters] = useState({
    projectType: "",
    budgetMin: 0,
    experienceLevel: "",
  });

  useEffect(() => {
    loadFreelanceOpportunities();
  }, [userId]);

  const loadFreelanceOpportunities = async () => {
    setLoading(true);
    try {
      const data = await careerService.getFreelanceOpportunities(
        userId,
        filters
      );
      // Map the data to ensure it matches the expected FreelanceOpportunity shape
      const mappedData = data
        .filter(
          (item) =>
            item.experienceLevel === "beginner" ||
            item.experienceLevel === "intermediate" ||
            item.experienceLevel === "expert"
        )
        .map((item) => ({
          _id: item._id,
          clientName: item.clientName,
          projectType: item.projectType,
          budget: {
            min: item.budget?.min ?? 0,
            max: item.budget?.max ?? 0,
            currency: item.budget?.currency ?? "USD",
            type:
              item.budget?.type === "hourly"
                ? "hourly"
                : "fixed", // Map any other value to "fixed"
          } as { min: number; max: number; currency: string; type: "hourly" | "fixed" },
          experienceLevel: item.experienceLevel as "beginner" | "intermediate" | "expert",
          duration: item.duration,
          isRemote: item.isRemote,
          description: item.description,
          skillsRequired: item.skillsRequired,
          applicationDeadline: item.applicationDeadline
            ? new Date(item.applicationDeadline)
            : new Date(), // fallback to current date if missing
          postedDate: new Date(item.postedDate),
          title: item.title ?? "", // Provide a default if missing
          matchScore: item.matchScore ?? 0, // Provide a default if missing
        }));
      setOpportunities(mappedData);
    } catch (error) {
      console.error("Error loading freelance opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    loadFreelanceOpportunities();
  };

  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "expert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // const getMatchScoreColor = (score: number) => {
  //   if (score >= 80) return "text-green-600 bg-green-100";
  //   if (score >= 60) return "text-yellow-600 bg-yellow-100";
  //   return "text-orange-600 bg-orange-100";
  // };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Freelance Opportunities
        </h2>
        <p className="text-gray-600">
          Flexible projects perfect for working mothers seeking independence
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-4 gap-4">
          <select
            value={filters.projectType}
            onChange={(e) =>
              setFilters({ ...filters, projectType: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Project Types</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
            <option value="consulting">Consulting</option>
          </select>

          <select
            value={filters.experienceLevel}
            onChange={(e) =>
              setFilters({ ...filters, experienceLevel: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Any Experience</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>

          <input
            type="number"
            placeholder="Min Budget ($)"
            value={filters.budgetMin || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                budgetMin: parseInt(e.target.value) || 0,
              })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <button
            onClick={applyFilters}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {opportunities?.map((opp) => (
          <div
            key={opp._id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <User size={16} />
                    {opp.clientName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={16} />
                    {opp.projectType}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} />${opp?.budget?.min.toLocaleString()} -
                    ${opp?.budget?.max.toLocaleString()} ({opp?.budget?.type})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {opp.duration}
                  </span>
                  {opp.isRemote && (
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      Remote
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceBadgeColor(
                  opp.experienceLevel
                )}`}
              >
                {opp.experienceLevel}
              </span>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {opp.description}
            </p>

            {/* Skills Required */}
            {opp.skillsRequired && opp.skillsRequired.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Skills Required:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opp.skillsRequired.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Apply by:{" "}
                  {new Date(opp.applicationDeadline).toLocaleDateString()}
                </span>
                <span>
                  Posted: {new Date(opp.postedDate).toLocaleDateString()}
                </span>
              </div>

              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {opportunities.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No freelance opportunities found
          </h3>
          <p className="text-gray-600">
            Check back later or adjust your filters for more results
          </p>
        </div>
      )}
    </div>
  );
}
