// components/childcare/LeafletMap.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChildcarePlace } from "../../services/realTimeChildcareService";
import { Navigation } from "lucide-react";

interface LeafletMapProps {
  places: ChildcarePlace[];
  selectedPlace: ChildcarePlace | null;
  onPlaceSelect: (place: ChildcarePlace) => void;
  center: { lat: number; lng: number };
}

// Declare Leaflet types
declare global {
  interface Window {
    L: {
      map: (
        element: HTMLElement,
        options?: Record<string, unknown>
      ) => LeafletMap;
      tileLayer: (
        urlTemplate: string,
        options?: Record<string, unknown>
      ) => TileLayer;
      divIcon: (options: Record<string, unknown>) => Icon;
      marker: (latlng: [number, number], options?: { icon?: Icon }) => Marker;
      featureGroup: (layers: Marker[]) => FeatureGroup;
    };
  }
}

interface LeafletMap {
  remove: () => void;
  fitBounds: (bounds: LatLngBounds) => void;
  setView: (latlng: [number, number], zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface TileLayer {
  addTo: (map: LeafletMap) => TileLayer;
}

interface Icon {
  options?: Record<string, unknown>;
  _getIconUrl?: string;
}

interface Marker {
  addTo: (map: LeafletMap) => Marker;
  bindPopup: (content: string) => Marker;
  openPopup: () => Marker;
  on: (event: string, callback: () => void) => Marker;
  remove: () => void;
  getLatLng: () => { lat: number; lng: number };
}

interface FeatureGroup {
  getBounds: () => LatLngBounds;
}

interface LatLngBounds {
  pad: (padding: number) => LatLngBounds;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  places,
  selectedPlace,
  onPlaceSelect,
  center,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        // Dynamically import Leaflet CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Dynamically import Leaflet JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else if (window.L) {
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.L || isLoading) return;

    const L = window.L;

    // Create map instance
    const mapInstance = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add tile layer (free OpenStreetMap tiles)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Add user location marker
    const userIcon = L.divIcon({
      html: `
        <div style="
          width: 20px; 
          height: 20px; 
          background: #3b82f6; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      className: "user-location-marker",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([center.lat, center.lng], { icon: userIcon })
      .addTo(mapInstance)
      .bindPopup("Your Location")
      .openPopup();

    setMap(mapInstance);

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, [center, isLoading]);

  // Update markers when places change
  useEffect(() => {
    if (!map || !window.L || !places) return;

    const L = window.L;

    // Clear existing markers
    markers.forEach((marker) => marker.remove());

    // Create new markers
    const newMarkers = places.map((place) => {
      const icon = createCustomIcon(place.placeType);

      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(createPopupContent(place))
        .on("click", () => {
          onPlaceSelect(place);
        });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const allMarkers = [...newMarkers, L.marker([center.lat, center.lng])];
      const group = L.featureGroup(allMarkers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, places, onPlaceSelect, center, markers]);

  // Highlight selected place
  useEffect(() => {
    if (!map || !selectedPlace || !window.L) return;

    const selectedMarker = markers.find((marker) => {
      const pos = marker.getLatLng();
      return pos.lat === selectedPlace.lat && pos.lng === selectedPlace.lng;
    });

    if (selectedMarker) {
      selectedMarker.openPopup();
      map.setView([selectedPlace.lat, selectedPlace.lng], 15);
    }
  }, [selectedPlace, map, markers]);

  const createCustomIcon = (type: string): Icon => {
    const L = window.L;
    const iconMap = {
      school: { emoji: "🏫", color: "#22c55e" },
      nursery: { emoji: "🍼", color: "#f97316" },
      playschool: { emoji: "🎨", color: "#ec4899" },
      toystore: { emoji: "🧸", color: "#a855f7" },
      clothing: { emoji: "👕", color: "#3b82f6" },
    };

    const config = iconMap[type as keyof typeof iconMap] || iconMap.school;

    return L.divIcon({
      html: `
        <div style="
          width: 40px; 
          height: 40px; 
          background: ${config.color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          ${config.emoji}
        </div>
      `,
      className: "custom-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  const createPopupContent = (place: ChildcarePlace): string => {
    return `
      <div style="min-width: 200px; font-family: system-ui, sans-serif;">
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1f2937;">
          ${place.name}
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 6px; color: #6b7280; font-size: 14px;">
          <span style="margin-right: 4px;">📍</span>
          ${place.address}
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
          <span style="color: #fbbf24; margin-right: 4px;">⭐</span>
          <span style="font-weight: 500;">${place.rating}</span>
          <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">(${
            place.reviews
          } reviews)</span>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 8px; color: #6b7280; font-size: 12px;">
          <span style="margin-right: 4px;">📏</span>
          ${place.distance} away
        </div>
        
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 4px 8px; 
          border-radius: 12px; 
          font-size: 11px; 
          display: inline-block;
          margin-bottom: 8px;
        ">
          ${place.category}
        </div>
        
        ${
          place.openNow !== undefined
            ? `
          <div style="
            margin-top: 6px;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 500;
            ${
              place.openNow
                ? "background: #dcfce7; color: #166534;"
                : "background: #fef2f2; color: #dc2626;"
            }
          ">
            ${place.openNow ? "Open Now" : "Closed"}
          </div>
        `
            : ""
        }
        
        <div style="margin-top: 10px; display: flex; gap: 6px;">
          ${
            place.phone
              ? `
            <a href="tel:${place.phone}" style="
              background: #22c55e; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 4px; 
              text-decoration: none; 
              font-size: 11px;
              font-weight: 500;
            ">📞 Call</a>
          `
              : ""
          }
          
          <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            place.address
          )}" 
             target="_blank" 
             style="
              background: #3b82f6; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 4px; 
              text-decoration: none; 
              font-size: 11px;
              font-weight: 500;
            ">🧭 Directions</a>
          
          ${
            place.website
              ? `
            <a href="${place.website}" target="_blank" style="
              background: #6b7280; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 4px; 
              text-decoration: none; 
              font-size: 11px;
              font-weight: 500;
            ">🌐 Website</a>
          `
              : ""
          }
        </div>
      </div>
    `;
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg shadow-lg z-10"
        style={{ minHeight: "400px" }}
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        {/* Legend */}
        <div className="bg-white p-3 rounded-lg shadow-lg max-w-48">
          <h4 className="font-semibold text-sm mb-2 text-gray-800">
            Map Legend
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                🏫
              </div>
              <span className="text-gray-700">Schools</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                🍼
              </div>
              <span className="text-gray-700">Nurseries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">
                🎨
              </div>
              <span className="text-gray-700">Playschools</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                🧸
              </div>
              <span className="text-gray-700">Toy Stores</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                👕
              </div>
              <span className="text-gray-700">Clothing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>
              <span className="text-gray-700">Your Location</span>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg">
          <button
            onClick={() => map && map.zoomIn()}
            className="block w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg border-b border-gray-200"
          >
            +
          </button>
          <button
            onClick={() => map && map.zoomOut()}
            className="block w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-b-lg"
          >
            −
          </button>
        </div>

        {/* Recenter Button */}
        <button
          onClick={() => map && map.setView([center.lat, center.lng], 13)}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Recenter map"
        >
          <Navigation className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 z-20 bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-gray-600">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          className="hover:underline"
        >
          OpenStreetMap
        </a>
      </div>

      {/* Places Count */}
      <div className="absolute bottom-2 right-2 z-20 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
        {places.length} places found
      </div>
    </div>
  );
};

export default LeafletMap;
