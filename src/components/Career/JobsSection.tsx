// components/career/sections/JobsSection.tsx
import React from "react";
import { JobRecommendation } from "@/models/Career";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Heart,
  Filter,
} from "lucide-react";
import { careerService } from "@/lib/careerService";

interface JobsSectionProps {
  jobs: JobRecommendation[];
  loading: boolean;
  filters: any;
  setFilters: (filters: any) => void;
  onApplyFilters: () => void;
  userId: string;
}

export function JobsSection({
  jobs,
  loading,
  filters,
  setFilters,
  onApplyFilters,
  userId,
}: JobsSectionProps) {
  const handleSaveJob = async (jobId: string) => {
    try {
      await careerService.saveJobApplication(jobId, userId);
      // Show success message
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Job Recommendations
        </h2>
        <p className="text-gray-600">
          AI-matched opportunities that fit your profile and lifestyle
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter Jobs</h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>

          <select
            value={filters.workArrangement}
            onChange={(e) =>
              setFilters({ ...filters, workArrangement: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Any Location</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <button
            onClick={onApplyFilters}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
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
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(
                        job.matchScore
                      )}`}
                    >
                      {job.matchScore}% match
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 mb-2">{job.company}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location} • {job.workArrangement}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} />
                      {job.type}
                    </span>
                    {job.salaryRange && (
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} />$
                        {job.salaryRange.min.toLocaleString()} - $
                        {job.salaryRange.max.toLocaleString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSaveJob(job._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {job.description}
              </p>

              {/* Special badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.isMaternityFriendly && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    🤱 Maternity Friendly
                  </span>
                )}
                {job.flexibleHours && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    ⏰ Flexible Hours
                  </span>
                )}
              </div>

              {/* Match reasons */}
              {job.reasonsForMatch && job.reasonsForMatch.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Why this matches you:
                  </h4>
                  <ul className="space-y-1">
                    {job.reasonsForMatch.map((reason, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {job.requirements?.slice(0, 3).map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                </div>

                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Apply Now
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or update your profile for better matches
          </p>
        </div>
      )}
    </div>
  );
}
