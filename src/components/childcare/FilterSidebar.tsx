// components/childcare/FilterSidebar.tsx
"use client";

import React from "react";
import { Filter, X, MapPin, Star, DollarSign } from "lucide-react";

interface Filters {
  placeType: string;
  radius: number;
  minRating: number;
  priceLevel: number;
  openNow: boolean;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (
    key: keyof Filters,
    value: string | number | boolean
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      placeType: "all",
      radius: 5000,
      minRating: 0,
      priceLevel: 0,
      openNow: false,
    });
  };

  const placeTypes = [
    { value: "all", label: "All Places", icon: "📍" },
    { value: "school", label: "Schools", icon: "🏫" },
    { value: "nursery", label: "Nurseries", icon: "🍼" },
    { value: "playschool", label: "Playschools", icon: "🎨" },
    { value: "toystore", label: "Toy Stores", icon: "🧸" },
    { value: "clothing", label: "Clothing Stores", icon: "👕" },
  ];

  const radiusOptions = [
    { value: 1000, label: "1 km" },
    { value: 2000, label: "2 km" },
    { value: 5000, label: "5 km" },
    { value: 10000, label: "10 km" },
    { value: 20000, label: "20 km" },
  ];

  const ratingOptions = [
    { value: 0, label: "Any Rating" },
    { value: 3, label: "3+ Stars" },
    { value: 4, label: "4+ Stars" },
    { value: 4.5, label: "4.5+ Stars" },
  ];

  const priceLevels = [
    { value: 0, label: "Any Price", display: "" },
    { value: 1, label: "Budget", display: "💰" },
    { value: 2, label: "Moderate", display: "💰💰" },
    { value: 3, label: "Expensive", display: "💰💰💰" },
    { value: 4, label: "Very Expensive", display: "💰💰💰💰" },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`
        fixed md:sticky top-0 right-0 md:right-auto h-full md:h-auto
        w-80 md:w-full bg-white shadow-xl md:shadow-md rounded-l-lg md:rounded-lg
        z-50 md:z-auto transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        overflow-y-auto
      `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="md:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Place Type Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <span>📍</span>
              Place Type
            </h4>
            <div className="space-y-2">
              {placeTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="placeType"
                    value={type.value}
                    checked={filters.placeType === type.value}
                    onChange={(e) =>
                      handleFilterChange("placeType", e.target.value)
                    }
                    className="text-blue-600"
                  />
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Distance
            </h4>
            <div className="space-y-2">
              {radiusOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="radius"
                    value={option.value}
                    checked={filters.radius === option.value}
                    onChange={(e) =>
                      handleFilterChange("radius", parseInt(e.target.value))
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Minimum Rating
            </h4>
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="minRating"
                    value={option.value}
                    checked={filters.minRating === option.value}
                    onChange={(e) =>
                      handleFilterChange(
                        "minRating",
                        parseFloat(e.target.value)
                      )
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Level Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Level
            </h4>
            <div className="space-y-2">
              {priceLevels.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priceLevel"
                    value={level.value}
                    checked={filters.priceLevel === level.value}
                    onChange={(e) =>
                      handleFilterChange("priceLevel", parseInt(e.target.value))
                    }
                    className="text-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{level.label}</span>
                    {level.display && (
                      <span className="text-xs">{level.display}</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Open Now Filter */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.openNow}
                onChange={(e) =>
                  handleFilterChange("openNow", e.target.checked)
                }
                className="text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Open now only</span>
            </label>
          </div>

          {/* Active Filters Summary */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Active Filters:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {filters.placeType !== "all" && (
                <div>
                  • Type:{" "}
                  {placeTypes.find((t) => t.value === filters.placeType)?.label}
                </div>
              )}
              {filters.radius !== 5000 && (
                <div>
                  • Distance:{" "}
                  {radiusOptions.find((r) => r.value === filters.radius)?.label}
                </div>
              )}
              {filters.minRating > 0 && (
                <div>• Rating: {filters.minRating}+ stars</div>
              )}
              {filters.priceLevel > 0 && (
                <div>
                  • Price:{" "}
                  {
                    priceLevels.find((p) => p.value === filters.priceLevel)
                      ?.label
                  }
                </div>
              )}
              {filters.openNow && <div>• Open now</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
