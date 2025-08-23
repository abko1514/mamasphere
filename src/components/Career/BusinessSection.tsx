// components/career/sections/BusinessSection.tsx
import React, { useState } from "react";
import { SmallBusiness } from "@/models/Career";
import {
  Building2,
  MapPin,
  Star,
  Phone,
  Mail,
  ExternalLink,
  Heart,
  Instagram,
  Facebook,
  Linkedin,
  Filter,
  Plus,
  Verified,
  Crown,
  Eye,
  Share2,
  MessageCircle,
  Calendar,
  Globe,
  Award,
  Users,
  TrendingUp,
  Search,
} from "lucide-react";
import { careerService } from "@/lib/careerService";

interface BusinessSectionProps {
  businesses: SmallBusiness[];
  loading: boolean;
  filters: {
    category: string;
    location: string;
    momOwned: boolean;
    searchQuery: string;
  };
  setFilters: (filters: any) => void;
  onApplyFilters: () => void;
  userId: string;
}

export function BusinessSection({
  businesses,
  loading,
  filters,
  setFilters,
  onApplyFilters,
  userId,
}: BusinessSectionProps) {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] =
    useState<SmallBusiness | null>(null);
  const [savedBusinesses, setSavedBusinesses] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const businessCategories = [
    { value: "all", label: "All Categories", icon: "🏢" },
    { value: "retail", label: "Retail & Shopping", icon: "🛍️" },
    { value: "food", label: "Food & Beverage", icon: "🍽️" },
    { value: "services", label: "Professional Services", icon: "💼" },
    { value: "health", label: "Health & Wellness", icon: "🏥" },
    { value: "beauty", label: "Beauty & Personal Care", icon: "💄" },
    { value: "education", label: "Education & Training", icon: "📚" },
    { value: "technology", label: "Technology & Digital", icon: "💻" },
    { value: "consulting", label: "Consulting", icon: "🤝" },
    { value: "handmade", label: "Handmade & Crafts", icon: "🎨" },
    { value: "fitness", label: "Fitness & Sports", icon: "💪" },
    { value: "childcare", label: "Childcare & Family", icon: "👶" },
    { value: "other", label: "Other", icon: "📦" },
  ];

  const handleSaveBusiness = async (businessId: string) => {
    try {
      // Add to saved businesses logic here
      const newSaved = new Set(savedBusinesses);
      if (newSaved.has(businessId)) {
        newSaved.delete(businessId);
      } else {
        newSaved.add(businessId);
      }
      setSavedBusinesses(newSaved);
    } catch (error) {
      console.error("Error saving business:", error);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return Instagram;
      case "facebook":
        return Facebook;
      case "linkedin":
        return Linkedin;
      case "twitter":
        return ExternalLink;
      default:
        return Globe;
    }
  };

  const getCategoryInfo = (category: string) => {
    return (
      businessCategories.find((cat) => cat.value === category) || {
        value: category,
        label: category,
        icon: "🏢",
      }
    );
  };

  const handleContactBusiness = (business: SmallBusiness) => {
    // Logic for contacting business
    if (business.contactInfo.email) {
      window.open(
        `mailto:${business.contactInfo.email}?subject=Inquiry from Mamasphere`
      );
    }
  };

  const BusinessCard = ({ business }: { business: SmallBusiness }) => {
    const categoryInfo = getCategoryInfo(business.category);
    const isSaved = savedBusinesses.has(business._id);

    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
        {/* Business Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
          {business.images && business.images.length > 0 ? (
            <img
              src={business.images[0]}
              alt={business.businessName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {categoryInfo.icon}
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {business.isMomOwned && (
              <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                <Crown size={12} />
                Mom-Owned
              </span>
            )}
            {business.isVerified && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                <Verified size={12} />
                Verified
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={() => handleSaveBusiness(business._id)}
              className={`p-2 rounded-full shadow-lg transition-all ${
                isSaved
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:text-red-500"
              }`}
            >
              <Heart size={16} className={isSaved ? "fill-current" : ""} />
            </button>
            <button className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-lg transition-all">
              <Share2 size={16} />
            </button>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <span>{categoryInfo.icon}</span>
              {categoryInfo.label}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Business Info */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                {business.businessName}
              </h3>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <Users size={14} />
                by {business.ownerName}
              </p>
            </div>
          </div>

          {/* Rating and Reviews */}
          {business.rating > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(business.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {business.rating.toFixed(1)} ({business.reviewCount} reviews)
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <TrendingUp size={10} className="inline mr-1" />
                Trending
              </span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <MapPin size={14} />
            <span className="text-sm">{business.location}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
            {business.description}
          </p>

          {/* Services/Products */}
          {business.services && business.services.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">
                Services Offered:
              </h4>
              <div className="flex flex-wrap gap-2">
                {business.services.slice(0, 3).map((service, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                  >
                    {service}
                  </span>
                ))}
                {business.services.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                    +{business.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contact Actions */}
          <div className="flex gap-2 mb-4">
            {business.contactInfo.email && (
              <button
                onClick={() => handleContactBusiness(business)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Contact
              </button>
            )}

            {business.contactInfo.website && (
              <a
                href={business.contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Globe size={16} />
                Website
              </a>
            )}
          </div>

          {/* Social Media Links */}
          {business.contactInfo.socialMedia && (
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {Object.entries(business.contactInfo.socialMedia).map(
                  ([platform, url]) => {
                    if (!url) return null;
                    const Icon = getSocialIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                        title={`Visit on ${platform}`}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => setSelectedBusiness(business)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
              >
                <Eye size={14} />
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Small Business Directory
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover and support amazing mom-owned businesses and local
          entrepreneurs in our community
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">
            {businesses.length}
          </div>
          <div className="text-sm text-gray-600">Total Businesses</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div className="text-2xl font-bold text-pink-600">
            {businesses.filter((b) => b.isMomOwned).length}
          </div>
          <div className="text-sm text-gray-600">Mom-Owned</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {businesses.filter((b) => b.isVerified).length}
          </div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(
              (businesses.reduce((sum, b) => sum + b.rating, 0) /
                businesses.length) *
                10
            ) / 10 || 0}
          </div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">
            Find the Perfect Business
          </h3>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {businessCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>

          {/* Location */}
          <input
            type="text"
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          {/* Mom-owned filter */}
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.momOwned}
              onChange={(e) =>
                setFilters({ ...filters, momOwned: e.target.checked })
              }
              className="text-purple-500 focus:ring-purple-500 rounded"
            />
            <Crown size={16} className="text-pink-500" />
            <span className="text-sm font-medium">Mom-owned only</span>
          </label>

          {/* Apply filters */}
          <button
            onClick={onApplyFilters}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Search
          </button>
        </div>

        {/* Quick filter tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Quick filters:</span>
          {["health", "food", "beauty", "education"].map((cat) => {
            const categoryInfo = getCategoryInfo(cat);
            return (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, category: cat })}
                className="px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-sm transition-colors"
              >
                {categoryInfo.icon} {categoryInfo.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Register Business CTA */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Own a Business?</h3>
        <p className="mb-4 opacity-90">
          Join our directory and connect with thousands of potential customers
        </p>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Register Your Business
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {businesses.length} businesses
          {filters.momOwned && ` • Mom-owned only`}
          {filters.category !== "all" &&
            ` • ${getCategoryInfo(filters.category).label}`}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View:</span>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-purple-100 text-purple-600"
                : "text-gray-400"
            }`}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-purple-100 text-purple-600"
                : "text-gray-400"
            }`}
          >
            <div className="w-4 h-4 flex flex-col gap-1">
              <div className="bg-current h-0.5 rounded"></div>
              <div className="bg-current h-0.5 rounded"></div>
              <div className="bg-current h-0.5 rounded"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Business Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "space-y-6"
        }
      >
        {businesses.map((business) => (
          <BusinessCard key={business._id} business={business} />
        ))}
      </div>

      {/* Empty State */}
      {businesses.length === 0 && !loading && (
        <div className="text-center py-16">
          <Building2 size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No businesses found
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.category !== "all" ||
            filters.location ||
            filters.momOwned ||
            filters.searchQuery
              ? "Try adjusting your filters to see more results"
              : "Be the first to add a business to our directory!"}
          </p>
          <button
            onClick={() => {
              setFilters({
                category: "all",
                location: "",
                momOwned: false,
                searchQuery: "",
              });
              onApplyFilters();
            }}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
