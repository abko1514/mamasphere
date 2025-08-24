// app/childcare/page.tsx (Real-time Data Only)
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Filter,
  List,
  Map as MapIcon,
  ShoppingBag,
  Shirt,
  Loader2,
  Baby,
  GraduationCap,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  realTimeChildcareService,
  ChildcarePlace,
} from "../../services/realTimeChildcareService";
import LeafletMap from "../../components/childcare/LeafletMap";
import PlaceCard from "../../components/childcare/PlaceCard";
import FilterSidebar from "../../components/childcare/FilterSidebar";
import Navbar from "../core component/Navbar";

type ViewMode = "map" | "list" | "products" | "clothing";
type PlaceTypeFilter =
  | "all"
  | "school"
  | "nursery"
  | "playschool"
  | "toystore"
  | "clothing";

interface Filters {
  placeType: string;
  radius: number;
  minRating: number;
  priceLevel: number;
  openNow: boolean;
}

const ChildcarePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [places, setPlaces] = useState<ChildcarePlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<ChildcarePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<ChildcarePlace | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    placeType: "all",
    radius: 5000,
    minRating: 0,
    priceLevel: 0,
    openNow: false,
  });

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🚀 Initializing childcare data...");

        // Get user location
        const location = await realTimeChildcareService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          console.log(
            `📍 Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(
              4
            )}`
          );

          // Load places from OpenStreetMap
          const allPlaces = await realTimeChildcareService.getNearbyPlaces(
            location.lat,
            location.lng,
            filters.radius
          );

          console.log(`📊 Found ${allPlaces.length} places total`);
          setPlaces(allPlaces);
          setFilteredPlaces(allPlaces);
        }
      } catch (err) {
        console.error("❌ Error initializing data:", err);
        setError(
          "Failed to load childcare data. Please check your connection and try refreshing."
        );
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Refresh places data
  const refreshPlaces = async () => {
    if (!userLocation) return;

    setRefreshing(true);
    setError(null);

    try {
      console.log("🔄 Refreshing places data...");
      const newPlaces = await realTimeChildcareService.getNearbyPlaces(
        userLocation.lat,
        userLocation.lng,
        filters.radius,
        filters.placeType === "all"
          ? "all"
          : (filters.placeType as PlaceTypeFilter)
      );

      setPlaces(newPlaces);
      console.log(`✅ Refreshed with ${newPlaces.length} places`);
    } catch (err) {
      console.error("❌ Error refreshing places:", err);
      setError("Failed to refresh places data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = places;

    // Filter by place type
    if (filters.placeType !== "all") {
      filtered = filtered.filter(
        (place) => place.placeType === filters.placeType
      );
    }

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter((place) => place.rating >= filters.minRating);
    }

    // Filter by open now
    if (filters.openNow) {
      filtered = filtered.filter((place) => place.openNow === true);
    }

    setFilteredPlaces(filtered);
  }, [places, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFiltersChange = async (newFilters: Filters) => {
    setFilters(newFilters);

    // If radius or place type changed, fetch new places
    if (
      (newFilters.radius !== filters.radius ||
        newFilters.placeType !== filters.placeType) &&
      userLocation
    ) {
      setLoading(true);
      try {
        const newPlaces = await realTimeChildcareService.getNearbyPlaces(
          userLocation.lat,
          userLocation.lng,
          newFilters.radius,
          newFilters.placeType === "all"
            ? "all"
            : (newFilters.placeType as PlaceTypeFilter)
        );
        setPlaces(newPlaces);
      } catch (err) {
        console.error("❌ Error fetching places with new filters:", err);
        setError("Failed to apply new filters. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle view mode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setError(null);
  };

  // Get counts for each category
  const getCounts = () => {
    const schoolCount = places.filter((p) => p.placeType === "school").length;
    const nurseryCount = places.filter((p) => p.placeType === "nursery").length;
    const playschoolCount = places.filter(
      (p) => p.placeType === "playschool"
    ).length;
    const toystoreCount = places.filter(
      (p) => p.placeType === "toystore"
    ).length;
    const clothingCount = places.filter(
      (p) => p.placeType === "clothing"
    ).length;

    return {
      schoolCount,
      nurseryCount,
      playschoolCount,
      toystoreCount,
      clothingCount,
    };
  };

  const {
    schoolCount,
    nurseryCount,
    playschoolCount,
    toystoreCount,
    clothingCount,
  } = getCounts();

  if (loading && !userLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">
              Finding real childcare options near you...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Using OpenStreetMap real-time data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                  <Baby className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    MamaSphere Childcare
                  </h1>
                  
                </div>
              </div>

              {/* View Mode Toggles with real counts */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleViewModeChange("map")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "map"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                  Map
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                    {filteredPlaces.length}
                  </span>
                </button>

                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                    {filteredPlaces.length}
                  </span>
                </button>

                <button
                  onClick={() => handleViewModeChange("products")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "products"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Toy Stores
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                    {toystoreCount}
                  </span>
                </button>

                <button
                  onClick={() => handleViewModeChange("clothing")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "clothing"
                      ? "bg-white text-pink-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Shirt className="h-4 w-4" />
                  Clothing Stores
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                    {clothingCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            {(viewMode === "map" || viewMode === "list") && (
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 relative"></div>

                <button
                  onClick={refreshPlaces}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800 font-medium"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar - Filters */}
            {(viewMode === "map" || viewMode === "list") && (
              <div className="hidden md:block w-80">
                <FilterSidebar
                  isOpen={true}
                  onClose={() => setIsFilterOpen(false)}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            )}

            {/* Mobile Filter Sidebar */}
            {(viewMode === "map" || viewMode === "list") && (
              <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            )}

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Stats Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-wrap">
                    {viewMode === "map" || viewMode === "list" ? (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {filteredPlaces.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Real Places Found
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {schoolCount}
                          </div>
                          <div className="text-xs text-gray-500">Schools</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600">
                            {nurseryCount}
                          </div>
                          <div className="text-xs text-gray-500">Nurseries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-pink-600">
                            {playschoolCount}
                          </div>
                          <div className="text-xs text-gray-500">
                            Playschools
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">
                            {toystoreCount}
                          </div>
                          <div className="text-xs text-gray-500">
                            Toy Stores
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {clothingCount}
                          </div>
                          <div className="text-xs text-gray-500">Clothing</div>
                        </div>
                      </>
                    ) : viewMode === "products" ? (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {toystoreCount}
                          </div>
                          <div className="text-sm text-gray-600">
                            Toy Stores Found
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-600">
                            {clothingCount}
                          </div>
                          <div className="text-sm text-gray-600">
                            Clothing Stores Found
                          </div>
                        </div>
                      </>
                    )}

                    {userLocation && (
                      <div className="text-center">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Real-time OSM data
                        </div>
                      </div>
                    )}
                  </div>

                  {(loading || refreshing) && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        {refreshing ? "Refreshing..." : "Loading..."}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Based on View Mode */}
              {viewMode === "map" && userLocation && (
                <div className="space-y-6">
                  <LeafletMap
                    places={filteredPlaces}
                    selectedPlace={selectedPlace}
                    onPlaceSelect={setSelectedPlace}
                    center={userLocation}
                  />

                  {/* Selected Place Details */}
                  {selectedPlace && (
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <h3 className="font-semibold text-lg mb-4">
                        Selected Place
                      </h3>
                      <PlaceCard
                        place={selectedPlace}
                        onClick={() => {}}
                        isSelected={true}
                      />
                    </div>
                  )}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredPlaces.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <GraduationCap className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No real places found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try expanding your search radius or adjusting filters.
                        We only show real places from OpenStreetMap.
                      </p>
                      <button
                        onClick={refreshPlaces}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Refresh Places
                      </button>
                    </div>
                  ) : (
                    filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        onClick={() => setSelectedPlace(place)}
                        isSelected={selectedPlace?.id === place.id}
                      />
                    ))
                  )}
                </div>
              )}

              {viewMode === "products" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Toy Stores Near You
                    </h2>
                    <div className="text-sm text-gray-600">
                      {toystoreCount} toy stores found
                    </div>
                  </div>

                  {toystoreCount === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <ShoppingBag className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No toy stores found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        No toy stores found in your area. Try expanding your
                        search radius or refreshing.
                      </p>
                      <button
                        onClick={refreshPlaces}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Refresh Search
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {places
                        .filter((place) => place.placeType === "toystore")
                        .map((store) => (
                          <PlaceCard
                            key={store.id}
                            place={store}
                            onClick={() => setSelectedPlace(store)}
                            isSelected={selectedPlace?.id === store.id}
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}

              {viewMode === "clothing" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Children&apos;s Clothing Stores Near You
                    </h2>
                    <div className="text-sm text-gray-600">
                      {clothingCount} clothing stores found
                    </div>
                  </div>

                  {clothingCount === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Shirt className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No clothing stores found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        No children&apos;s clothing stores found in your area.
                        Try expanding your search radius or refreshing.
                      </p>
                      <button
                        onClick={refreshPlaces}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        Refresh Search
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {places
                        .filter((place) => place.placeType === "clothing")
                        .map((store) => (
                          <PlaceCard
                            key={store.id}
                            place={store}
                            onClick={() => setSelectedPlace(store)}
                            isSelected={selectedPlace?.id === store.id}
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => userLocation && refreshPlaces()}
            disabled={refreshing}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            title="Refresh real data"
          >
            {refreshing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Baby className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildcarePage;
