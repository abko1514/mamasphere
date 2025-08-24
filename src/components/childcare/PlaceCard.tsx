// components/childcare/PlaceCard.tsx (Updated for Real Data)
"use client";

import React from "react";
import { ChildcarePlace } from "../../services/realTimeChildcareService";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Navigation,
} from "lucide-react";

interface PlaceCardProps {
  place: ChildcarePlace;
  onClick: () => void;
  isSelected?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onClick,
  isSelected = false,
}) => {
  const getPlaceTypeIcon = (type: string) => {
    const icons = {
      school: "🏫",
      nursery: "🍼",
      playschool: "🎨",
      toystore: "🧸",
      clothing: "👕",
    };
    return icons[type as keyof typeof icons] || "🏫";
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  const handleWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place.website) {
      window.open(place.website, "_blank");
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place.phone) {
      window.location.href = `tel:${place.phone}`;
    }
  };

  const getDataSource = () => {
    if (place.id.startsWith("osm-")) {
      return "OpenStreetMap";
    }
    return "Real-time Data";
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
        isSelected ? "border-l-blue-500 bg-blue-50" : "border-l-transparent"
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getPlaceTypeIcon(place.placeType)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {place.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 flex-wrap">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                  {place.category}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {getDataSource()}
                </span>
              </div>
            </div>
          </div>

          {place.openNow !== undefined && (
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                place.openNow
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {place.openNow ? "Open" : "Closed"}
            </div>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">{place.rating}</span>
          </div>
          <span className="text-gray-500 text-sm">
            ({place.reviews} reviews)
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-3 text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm line-clamp-2">{place.address}</p>
            <p className="text-xs text-gray-500 mt-1">{place.distance} away</p>
            <p className="text-xs text-blue-600 mt-1">
              📍 {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Description */}
        {place.description && (
          <div className="mb-3 text-sm text-gray-600">
            <p className="line-clamp-2">{place.description}</p>
          </div>
        )}

        {/* Photos */}
        {place.photos && place.photos.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-3 gap-2">
              {place.photos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${place.name} photo ${index + 1}`}
                  className="w-full h-16 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {(place.phone || place.website) && (
          <div className="mb-3 space-y-1">
            {place.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span className="text-blue-600">{place.phone}</span>
              </div>
            )}
            {place.website && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-3 w-3" />
                <span className="text-blue-600 truncate">{place.website}</span>
              </div>
            )}
          </div>
        )}

        {/* Real-time Data Badge */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Data
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={handleDirections}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            <Navigation className="h-4 w-4" />
            Directions
          </button>

          {place.phone && (
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call
            </button>
          )}

          {place.website && (
            <button
              onClick={handleWebsite}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
            >
              <Globe className="h-4 w-4" />
              Website
            </button>
          )}
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500 border-l-2 border-gray-300">
            <strong>Debug:</strong> ID: {place.id} | Type: {place.placeType} |
            Coords: {place.lat.toFixed(6)}, {place.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
