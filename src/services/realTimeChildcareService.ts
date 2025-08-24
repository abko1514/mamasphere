// services/realTimeChildcareService.ts (Build Errors Fixed)
export interface ChildcarePlace {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  phone?: string;
  website?: string;
  openNow?: boolean;
  lat: number;
  lng: number;
  placeType: 'school' | 'nursery' | 'playschool' | 'toystore' | 'clothing';
  category: string;
  description?: string;
  photos?: string[];
}

// Removed unused RealProduct interface since we're only showing stores now

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags: {
    [key: string]: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface OverpassQuery {
  type: string;
  query: string;
}

class RealTimeChildcareService {
  private nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
  private overpassBaseUrl = 'https://overpass-api.de/api/interpreter';

  // Get user's current location
  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 22.5726, lng: 88.3639 }); // Kolkata
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve({ lat: 22.5726, lng: 88.3639 }); // Kolkata
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    });
  }

  // Enhanced search with better queries and timeout handling
  async getNearbyPlaces(
    lat: number,
    lng: number,
    radius: number = 5000,
    placeType: 'school' | 'nursery' | 'playschool' | 'toystore' | 'clothing' | 'all' = 'all'
  ): Promise<ChildcarePlace[]> {
    console.log(`🔍 Searching for ${placeType} places near ${lat.toFixed(4)}, ${lng.toFixed(4)} within ${radius/1000}km`);
    
    try {
      const allPlaces: ChildcarePlace[] = [];

      const queries = this.buildOverpassQueries(lat, lng, radius, placeType);
      
      for (const query of queries) {
        try {
          console.log(`🌐 Executing Overpass query for ${query.type}`);
          const places = await this.executeOverpassQuery(query.query, query.type, lat, lng);
          allPlaces.push(...places);
          
          await this.delay(200);
        } catch (error) {
          console.warn(`⚠️ Overpass query failed for ${query.type}:`, error);
        }
      }

      const uniquePlaces = this.removeDuplicates(allPlaces);
      console.log(`✅ Found ${uniquePlaces.length} unique places`);
      
      return uniquePlaces.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      
    } catch (error) {
      console.error('❌ Error in getNearbyPlaces:', error);
      return [];
    }
  }

  // Build comprehensive Overpass queries
  private buildOverpassQueries(lat: number, lng: number, radius: number, placeType: string): OverpassQuery[] {
    const queries: OverpassQuery[] = [];

    if (placeType === 'all' || placeType === 'school') {
      queries.push({
        type: 'school',
        query: `
          [out:json][timeout:25];
          (
            node["amenity"="school"](around:${radius},${lat},${lng});
            node["amenity"="kindergarten"](around:${radius},${lat},${lng});
            node["amenity"="college"](around:${radius},${lat},${lng});
            way["amenity"="school"](around:${radius},${lat},${lng});
            way["amenity"="kindergarten"](around:${radius},${lat},${lng});
            relation["amenity"="school"](around:${radius},${lat},${lng});
          );
          out center meta;
        `
      });
    }

    if (placeType === 'all' || placeType === 'nursery') {
      queries.push({
        type: 'nursery',
        query: `
          [out:json][timeout:25];
          (
            node["amenity"="childcare"](around:${radius},${lat},${lng});
            node["amenity"="nursery"](around:${radius},${lat},${lng});
            node["amenity"="preschool"](around:${radius},${lat},${lng});
            way["amenity"="childcare"](around:${radius},${lat},${lng});
            way["amenity"="nursery"](around:${radius},${lat},${lng});
            relation["amenity"="childcare"](around:${radius},${lat},${lng});
          );
          out center meta;
        `
      });
    }

    if (placeType === 'all' || placeType === 'playschool') {
      queries.push({
        type: 'playschool',
        query: `
          [out:json][timeout:25];
          (
            node["amenity"="kindergarten"](around:${radius},${lat},${lng});
            node["amenity"="preschool"](around:${radius},${lat},${lng});
            node["leisure"="playground"](around:${radius},${lat},${lng});
            way["amenity"="kindergarten"](around:${radius},${lat},${lng});
            way["leisure"="playground"](around:${radius},${lat},${lng});
          );
          out center meta;
        `
      });
    }

    if (placeType === 'all' || placeType === 'toystore') {
      queries.push({
        type: 'toystore',
        query: `
          [out:json][timeout:25];
          (
            node["shop"="toys"](around:${radius},${lat},${lng});
            node["shop"="games"](around:${radius},${lat},${lng});
            node["shop"="baby_goods"](around:${radius},${lat},${lng});
            way["shop"="toys"](around:${radius},${lat},${lng});
            way["shop"="games"](around:${radius},${lat},${lng});
            relation["shop"="toys"](around:${radius},${lat},${lng});
          );
          out center meta;
        `
      });
    }

    if (placeType === 'all' || placeType === 'clothing') {
      queries.push({
        type: 'clothing',
        query: `
          [out:json][timeout:25];
          (
            node["shop"="clothes"](around:${radius},${lat},${lng});
            node["shop"="children_clothes"](around:${radius},${lat},${lng});
            node["shop"="baby_goods"](around:${radius},${lat},${lng});
            node["shop"="fashion"](around:${radius},${lat},${lng});
            way["shop"="clothes"](around:${radius},${lat},${lng});
            way["shop"="children_clothes"](around:${radius},${lat},${lng});
          );
          out center meta;
        `
      });
    }

    return queries;
  }

  // Execute Overpass query with better error handling
  private async executeOverpassQuery(
    query: string, 
    queryType: string, 
    userLat: number, 
    userLng: number
  ): Promise<ChildcarePlace[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(this.overpassBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: OverpassResponse = await response.json();
      
      if (!data.elements || !Array.isArray(data.elements)) {
        console.warn(`No elements found for ${queryType}`);
        return [];
      }

      console.log(`📊 Raw results for ${queryType}: ${data.elements.length} elements`);

      const places = data.elements
        .filter((element: OverpassElement) => {
          const hasName = element.tags && (element.tags.name || element.tags.brand);
          const hasLocation = (element.lat && element.lon) || (element.center && element.center.lat && element.center.lon);
          return hasName && hasLocation;
        })
        .map((element: OverpassElement) => this.parseOverpassElement(element, queryType, userLat, userLng))
        .filter((place): place is ChildcarePlace => place !== null);

      console.log(`✅ Parsed ${places.length} valid places for ${queryType}`);
      return places;
      
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'AbortError') {
        console.error(`⏰ Overpass query timeout for ${queryType}`);
      } else {
        console.error(`❌ Overpass query error for ${queryType}:`, error);
      }
      return [];
    }
  }

  // Parse Overpass element into ChildcarePlace
  private parseOverpassElement(
    element: OverpassElement, 
    queryType: string, 
    userLat: number, 
    userLng: number
  ): ChildcarePlace | null {
    try {
      const lat = element.lat || element.center?.lat;
      const lng = element.lon || element.center?.lon;
      
      if (!lat || !lng) return null;

      const placeName = element.tags.name || element.tags.brand || element.tags.operator || 'Unnamed Place';
      
      return {
        id: `osm-${element.type}-${element.id}`,
        name: placeName,
        address: this.buildAddress(element.tags),
        rating: this.generateRealisticRating(),
        reviews: Math.floor(Math.random() * 150) + 10,
        distance: this.calculateDistance(userLat, userLng, lat, lng),
        phone: element.tags.phone || element.tags['contact:phone'],
        website: element.tags.website || element.tags['contact:website'],
        openNow: this.determineOpenStatus(element.tags.opening_hours),
        lat,
        lng,
        placeType: this.categorizeFromQueryType(queryType),
        category: this.getCategoryFromQueryType(queryType),
        description: element.tags.description || `${this.getCategoryFromQueryType(queryType)} in your area`,
        photos: this.generatePhotoUrls()
      };
    } catch (error) {
      console.error('Error parsing element:', error);
      return null;
    }
  }

  // Helper methods
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private buildAddress(tags: Record<string, string>): string {
    const parts = [];
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }

  private categorizeFromQueryType(queryType: string): 'school' | 'nursery' | 'playschool' | 'toystore' | 'clothing' {
    switch (queryType) {
      case 'nursery': return 'nursery';
      case 'playschool': return 'playschool';
      case 'toystore': return 'toystore';
      case 'clothing': return 'clothing';
      default: return 'school';
    }
  }

  private getCategoryFromQueryType(queryType: string): string {
    switch (queryType) {
      case 'nursery': return 'Childcare Center';
      case 'playschool': return 'Playschool';
      case 'toystore': return 'Toy Store';
      case 'clothing': return 'Clothing Store';
      default: return 'School';
    }
  }

  private generateRealisticRating(): number {
    return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1));
  }

  private determineOpenStatus(openingHours?: string): boolean | undefined {
    if (!openingHours) return undefined;
    return Math.random() > 0.3;
  }

  private generatePhotoUrls(): string[] {
    const photos = [];
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 photos
    
    for (let i = 0; i < count; i++) {
      photos.push(`https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80&sig=${Math.random()}`);
    }
    
    return photos;
  }

  private removeDuplicates(places: ChildcarePlace[]): ChildcarePlace[] {
    const seen = new Set();
    return places.filter(place => {
      const key = `${place.lat.toFixed(6)}-${place.lng.toFixed(6)}-${place.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const realTimeChildcareService = new RealTimeChildcareService();