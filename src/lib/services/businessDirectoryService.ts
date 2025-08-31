// lib/services/businessDirectoryService.ts
// Free alternatives to Yelp that work in India

export interface BusinessFilters {
  category?: string;
  location?: string;
  momOwned?: boolean;
  searchQuery?: string;
  hiringStatus?: string;
}

export interface BusinessResult {
  _id: string;
  name: string;
  businessName: string;
  description: string;
  industry: string;
  location: string;
  category: string;
  website?: string;
  contact: {
    email: string;
    phone?: string;
    social?: Record<string, string>;
  };
  ownerInfo: {
    name: string;
    isMother: boolean;
    story?: string;
    yearsInBusiness: number;
  };
  ownerName: string;
  ownerId: string;
  services: string[];
  specializations: string[];
  supportingMoms: boolean;
  lookingForCollaborators: boolean;
  hiringStatus: "not-hiring" | "open-to-opportunities" | "actively-hiring";
  workArrangements: ("remote" | "onsite" | "hybrid" | "flexible")[];
  tags: string[];
  verified: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  isMomOwned: boolean;
  images: string[];
  createdAt: Date;
}

export class BusinessDirectoryService {
  private foursquareApiKey: string;
  private cache: Map<string, { data: any; expires: number }>;

  constructor() {
    this.foursquareApiKey = process.env.FOURSQUARE_API_KEY || "";
    this.cache = new Map();
  }

  // Main method to get businesses (replaces Yelp)
  async getBusinesses(filters?: BusinessFilters): Promise<BusinessResult[]> {
    const cacheKey = `businesses_${JSON.stringify(filters)}`;
    const cached = this.getFromCache(cacheKey, 120);
    if (cached) return cached;

    try {
      let businesses: BusinessResult[] = [];

      // Try Foursquare Places API first (free tier available)
      if (this.foursquareApiKey) {
        console.log("Fetching from Foursquare Places API...");
        businesses = await this.fetchFoursquareBusinesses(filters);
      }

      // If no Foursquare key or insufficient results, try OpenStreetMap
      if (businesses.length < 5) {
        console.log("Fetching from OpenStreetMap API...");
        const osmBusinesses = await this.fetchOpenStreetMapBusinesses(filters);
        businesses.push(...osmBusinesses);
      }

      // If still no results, try Google My Business (free tier)
      if (businesses.length < 5 && process.env.GOOGLE_PLACES_API_KEY) {
        console.log("Fetching from Google Places API...");
        const googleBusinesses = await this.fetchGoogleBusinesses(filters);
        businesses.push(...googleBusinesses);
      }

      // Fallback to India-specific mock data
      if (businesses.length === 0) {
        console.log("Using India-specific mock business data...");
        businesses = this.getIndianMockBusinesses(filters);
      }

      const result = this.filterAndSortBusinesses(businesses, filters).slice(
        0,
        25
      );
      this.setCache(cacheKey, result, 120);
      return result;
    } catch (error) {
      console.error("Error fetching businesses:", error);
      return this.getIndianMockBusinesses(filters);
    }
  }

  // Foursquare Places API (Free: 100k requests/month)
  private async fetchFoursquareBusinesses(
    filters?: BusinessFilters
  ): Promise<BusinessResult[]> {
    try {
      const location = filters?.location || "India";
      const query = filters?.searchQuery || filters?.category || "business";
      const limit = 20;

      // Foursquare Places API v3 (new version)
      const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(
        query
      )}&near=${encodeURIComponent(location)}&limit=${limit}`;

      const response = await fetch(url, {
        headers: {
          Authorization: this.foursquareApiKey,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(`Foursquare API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log(
        `Foursquare returned ${data.results?.length || 0} businesses`
      );

      return (data.results || []).map((place: any) =>
        this.transformFoursquarePlace(place)
      );
    } catch (error) {
      console.error("Error fetching Foursquare businesses:", error);
      return [];
    }
  }

  // OpenStreetMap Overpass API (Completely Free)
  private async fetchOpenStreetMapBusinesses(
    filters?: BusinessFilters
  ): Promise<BusinessResult[]> {
    try {
      const location = this.getLocationCoordinates(
        filters?.location || "India"
      );
      const category = this.mapCategoryToOSM(filters?.category);
      const searchRadius = 50000; // 50km radius

      // Overpass API query
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["shop"~"."](around:${searchRadius},${location.lat},${location.lon});
          node["office"~"."](around:${searchRadius},${location.lat},${location.lon});
          node["amenity"~"^(bank|restaurant|cafe|pharmacy)$"](around:${searchRadius},${location.lat},${location.lon});
        );
        out body;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      if (!response.ok) {
        console.error(`OpenStreetMap API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log(
        `OpenStreetMap returned ${data.elements?.length || 0} businesses`
      );

      return (data.elements || [])
        .filter((element: any) => element.tags && element.tags.name)
        .slice(0, 15)
        .map((element: any) => this.transformOSMPlace(element));
    } catch (error) {
      console.error("Error fetching OpenStreetMap businesses:", error);
      return [];
    }
  }

  // Google Places API (backup option)
  private async fetchGoogleBusinesses(
    filters?: BusinessFilters
  ): Promise<BusinessResult[]> {
    try {
      const query = `${
        filters?.searchQuery || filters?.category || "small business"
      } in ${filters?.location || "India"}`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_PLACES_API_KEY}&type=establishment`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Google Places API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log(
        `Google Places returned ${data.results?.length || 0} businesses`
      );

      return (data.results || [])
        .slice(0, 10)
        .map((place: any) => this.transformGooglePlace(place));
    } catch (error) {
      console.error("Error fetching Google Places:", error);
      return [];
    }
  }

  // Transform Foursquare data
  private transformFoursquarePlace(place: any): BusinessResult {
    const categories = place.categories || [];
    const primaryCategory = categories[0]?.name || "Business";

    return {
      _id: `foursquare_${place.fsq_id}`,
      name: place.name,
      businessName: place.name,
      description: this.generateBusinessDescription(
        place.name,
        primaryCategory
      ),
      industry: primaryCategory,
      location:
        place.location?.formatted_address ||
        `${place.location?.locality || ""}, ${
          place.location?.region || "India"
        }`,
      category: primaryCategory,
      website: place.website || "",
      contact: {
        email: "",
        phone: place.tel || "",
        social: {},
      },
      ownerInfo: {
        name: "Business Owner",
        isMother: false,
        story: "",
        yearsInBusiness: 0,
      },
      ownerName: "Business Owner",
      ownerId: place.fsq_id,
      services: categories.map((cat: any) => cat.name),
      specializations: [],
      supportingMoms: false,
      lookingForCollaborators: false,
      hiringStatus: "not-hiring",
      workArrangements: ["onsite"],
      tags: categories.map((cat: any) =>
        cat.name.toLowerCase().replace(/\s+/g, "-")
      ),
      verified: false,
      isVerified: false,
      rating: place.rating || 0,
      reviewCount: place.stats?.total_ratings || 0,
      isMomOwned: false,
      images: place.photos
        ? [place.photos[0]?.prefix + "300x300" + place.photos[0]?.suffix]
        : [],
      createdAt: new Date(),
    };
  }

  // Transform OpenStreetMap data
  private transformOSMPlace(element: any): BusinessResult {
    const tags = element.tags || {};
    const name = tags.name || "Business";
    const category = tags.shop || tags.amenity || tags.office || "business";

    return {
      _id: `osm_${element.id}`,
      name: name,
      businessName: name,
      description: this.generateBusinessDescription(name, category),
      industry: this.mapOSMCategoryToIndustry(category),
      location: `${tags["addr:city"] || tags["addr:state"] || "India"}`,
      category: this.mapOSMCategoryToIndustry(category),
      website: tags.website || tags.url || "",
      contact: {
        email: tags.email || "",
        phone: tags.phone || tags["contact:phone"] || "",
        social: {
          facebook: tags["contact:facebook"] || "",
          instagram: tags["contact:instagram"] || "",
        },
      },
      ownerInfo: {
        name: tags.operator || "Business Owner",
        isMother: false,
        story: "",
        yearsInBusiness: 0,
      },
      ownerName: tags.operator || "Business Owner",
      ownerId: element.id.toString(),
      services: [this.mapOSMCategoryToIndustry(category)],
      specializations: [],
      supportingMoms: false,
      lookingForCollaborators: false,
      hiringStatus: "not-hiring",
      workArrangements: ["onsite"],
      tags: [category],
      verified: false,
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      isMomOwned: false,
      images: [],
      createdAt: new Date(),
    };
  }

  // Transform Google Places data (same as before)
  private transformGooglePlace(place: any): BusinessResult {
    return {
      _id: `google_${place.place_id}`,
      name: place.name,
      businessName: place.name,
      description: `${place.name} - ${
        place.types?.[0]?.replace(/_/g, " ") || "Business"
      }`,
      industry: place.types?.[0]?.replace(/_/g, " ") || "General Business",
      location: place.formatted_address || "India",
      category: place.types?.[0]?.replace(/_/g, " ") || "General",
      website: "",
      contact: {
        email: "",
        phone: "",
        social: {},
      },
      ownerInfo: {
        name: "Business Owner",
        isMother: false,
        story: "",
        yearsInBusiness: 0,
      },
      ownerName: "Business Owner",
      ownerId: place.place_id,
      services:
        place.types?.map((type: string) => type.replace(/_/g, " ")) || [],
      specializations: [],
      supportingMoms: false,
      lookingForCollaborators: false,
      hiringStatus: "not-hiring",
      workArrangements: ["onsite"],
      tags: place.types || [],
      verified: false,
      isVerified: false,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      isMomOwned: false,
      images: place.photos ? [place.photos[0]] : [],
      createdAt: new Date(),
    };
  }

  // India-specific mock businesses
  private getIndianMockBusinesses(filters?: BusinessFilters): BusinessResult[] {
    const businesses: BusinessResult[] = [
      {
        _id: "indian_business_1",
        name: "Women Entrepreneurs Hub Delhi",
        businessName: "Women Entrepreneurs Hub Delhi",
        description:
          "Supporting women entrepreneurs across Delhi NCR with business consulting, networking events, and skill development programs.",
        industry: "Business Consulting",
        location: "Delhi, India",
        category: "Professional Services",
        website: "https://womenentrepreneurshub.in",
        contact: {
          email: "info@womenentrepreneurshub.in",
          phone: "+91-9876543210",
          social: {
            linkedin:
              "https://linkedin.com/company/women-entrepreneurs-hub-delhi",
            instagram: "@wehdelhi",
          },
        },
        ownerInfo: {
          name: "Priya Sharma",
          isMother: true,
          story:
            "Former corporate executive turned entrepreneur who started this hub to support other women in business.",
          yearsInBusiness: 3,
        },
        ownerName: "Priya Sharma",
        ownerId: "owner_india_1",
        services: [
          "Business Consulting",
          "Networking Events",
          "Skill Development",
          "Mentorship Programs",
        ],
        specializations: [
          "Women-owned Business Support",
          "Startup Incubation",
          "Digital Marketing Training",
        ],
        supportingMoms: true,
        lookingForCollaborators: true,
        hiringStatus: "actively-hiring",
        workArrangements: ["remote", "hybrid", "flexible"],
        tags: ["women-entrepreneurs", "consulting", "networking", "delhi"],
        verified: true,
        isVerified: true,
        rating: 4.7,
        reviewCount: 28,
        isMomOwned: true,
        images: ["https://example.com/weh-delhi.jpg"],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
      {
        _id: "indian_business_2",
        name: "FlexiWork Solutions Mumbai",
        businessName: "FlexiWork Solutions Mumbai",
        description:
          "HR consulting firm helping Indian companies implement flexible work policies and support working mothers in their transition back to work.",
        industry: "Human Resources",
        location: "Mumbai, Maharashtra, India",
        category: "Professional Services",
        website: "https://flexiworkmumbai.com",
        contact: {
          email: "team@flexiworkmumbai.com",
          phone: "+91-8765432109",
          social: {
            linkedin: "https://linkedin.com/company/flexiwork-mumbai",
          },
        },
        ownerInfo: {
          name: "Anjali Desai & Sunita Patel",
          isMother: true,
          story:
            "Two HR professionals who left multinational companies to help Indian businesses become more family-friendly.",
          yearsInBusiness: 2,
        },
        ownerName: "Anjali Desai & Sunita Patel",
        ownerId: "owner_india_2",
        services: [
          "HR Consulting",
          "Flexible Work Policy Design",
          "Return-to-Work Programs",
          "Leadership Training",
        ],
        specializations: [
          "Maternity Return Support",
          "Workplace Inclusion",
          "Remote Work Setup",
        ],
        supportingMoms: true,
        lookingForCollaborators: true,
        hiringStatus: "open-to-opportunities",
        workArrangements: ["remote", "hybrid"],
        tags: ["hr-consulting", "flexible-work", "mumbai", "working-mothers"],
        verified: true,
        isVerified: true,
        rating: 4.8,
        reviewCount: 22,
        isMomOwned: true,
        images: ["https://example.com/flexiwork-mumbai.jpg"],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        _id: "indian_business_3",
        name: "Digital Mom Bangalore",
        businessName: "Digital Mom Bangalore",
        description:
          "Digital marketing agency run by working mothers, specializing in social media management and content creation for local businesses in Bangalore.",
        industry: "Digital Marketing",
        location: "Bangalore, Karnataka, India",
        category: "Marketing & Advertising",
        website: "https://digitalmombangalore.in",
        contact: {
          email: "hello@digitalmombangalore.in",
          phone: "+91-7654321098",
          social: {
            instagram: "@digitalmomblr",
            facebook: "https://facebook.com/digitalmombangalore",
          },
        },
        ownerInfo: {
          name: "Kavitha Reddy",
          isMother: true,
          story:
            "Former tech professional who started this agency to provide flexible work opportunities for other mothers with digital skills.",
          yearsInBusiness: 4,
        },
        ownerName: "Kavitha Reddy",
        ownerId: "owner_india_3",
        services: [
          "Social Media Management",
          "Content Creation",
          "Digital Strategy",
          "Website Design",
        ],
        specializations: [
          "Local Business Marketing",
          "Mom Blogger Outreach",
          "Regional Language Content",
        ],
        supportingMoms: true,
        lookingForCollaborators: true,
        hiringStatus: "actively-hiring",
        workArrangements: ["remote", "flexible"],
        tags: [
          "digital-marketing",
          "bangalore",
          "social-media",
          "working-mothers",
        ],
        verified: true,
        isVerified: true,
        rating: 4.6,
        reviewCount: 35,
        isMomOwned: true,
        images: ["https://example.com/digital-mom-blr.jpg"],
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      },
      {
        _id: "indian_business_4",
        name: "Craft & Career Kolkata",
        businessName: "Craft & Career Kolkata",
        description:
          "Artisan cooperative connecting traditional craftswomen with modern markets, providing both craft production and business training opportunities.",
        industry: "Handicrafts & Training",
        location: "Kolkata, West Bengal, India",
        category: "Arts & Crafts",
        website: "https://craftcareerkolkata.org",
        contact: {
          email: "connect@craftcareerkolkata.org",
          phone: "+91-6543210987",
          social: {
            instagram: "@craftcareerkolkata",
            facebook: "https://facebook.com/craftcareerkolkata",
          },
        },
        ownerInfo: {
          name: "Meera Banerjee",
          isMother: true,
          story:
            "Social entrepreneur empowering rural women artisans by connecting them with urban markets and providing business skills training.",
          yearsInBusiness: 6,
        },
        ownerName: "Meera Banerjee",
        ownerId: "owner_india_4",
        services: [
          "Artisan Training",
          "Craft Production",
          "Market Linkage",
          "Business Skills Development",
        ],
        specializations: [
          "Traditional Crafts",
          "Women Empowerment",
          "Rural-Urban Connect",
        ],
        supportingMoms: true,
        lookingForCollaborators: true,
        hiringStatus: "open-to-opportunities",
        workArrangements: ["hybrid", "flexible"],
        tags: ["crafts", "kolkata", "women-empowerment", "artisan-training"],
        verified: true,
        isVerified: true,
        rating: 4.9,
        reviewCount: 18,
        isMomOwned: true,
        images: ["https://example.com/craft-career-kol.jpg"],
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      },
    ];

    return this.filterBusinessesByLocation(businesses, filters?.location);
  }

  // Utility methods
  private filterAndSortBusinesses(
    businesses: BusinessResult[],
    filters?: BusinessFilters
  ): BusinessResult[] {
    let filtered = businesses;

    if (filters?.category) {
      filtered = filtered.filter(
        (b) =>
          b.category.toLowerCase().includes(filters.category!.toLowerCase()) ||
          b.industry.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters?.location) {
      filtered = filtered.filter((b) =>
        b.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters?.momOwned) {
      filtered = filtered.filter((b) => b.isMomOwned);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.services.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (filters?.hiringStatus && filters.hiringStatus !== "not-hiring") {
      filtered = filtered.filter(
        (b) => b.hiringStatus === filters.hiringStatus
      );
    }

    return filtered.sort((a, b) => b.rating - a.rating);
  }

  private filterBusinessesByLocation(
    businesses: BusinessResult[],
    location?: string
  ): BusinessResult[] {
    if (!location) return businesses;

    const locationLower = location.toLowerCase();
    return businesses.filter((business) =>
      business.location.toLowerCase().includes(locationLower)
    );
  }

  private generateBusinessDescription(name: string, category: string): string {
    return `${name} - ${
      category.charAt(0).toUpperCase() + category.slice(1)
    } business providing professional services`;
  }

  private mapCategoryToOSM(category?: string): string {
    const mapping: Record<string, string> = {
      technology: "office",
      consulting: "office",
      marketing: "office",
      retail: "shop",
      food: "restaurant",
      health: "pharmacy",
      education: "school",
    };

    return category ? mapping[category.toLowerCase()] || "office" : "office";
  }

  private mapOSMCategoryToIndustry(category: string): string {
    const mapping: Record<string, string> = {
      shop: "Retail",
      office: "Professional Services",
      restaurant: "Food & Beverage",
      cafe: "Food & Beverage",
      pharmacy: "Healthcare",
      bank: "Financial Services",
      school: "Education",
    };

    return mapping[category] || "General Business";
  }

  private getLocationCoordinates(location: string): {
    lat: number;
    lon: number;
  } {
    // Major Indian city coordinates
    const coordinates: Record<string, { lat: number; lon: number }> = {
      delhi: { lat: 28.6139, lon: 77.209 },
      mumbai: { lat: 19.076, lon: 72.8777 },
      bangalore: { lat: 12.9716, lon: 77.5946 },
      kolkata: { lat: 22.5726, lon: 88.3639 },
      chennai: { lat: 13.0827, lon: 80.2707 },
      hyderabad: { lat: 17.385, lon: 78.4867 },
      pune: { lat: 18.5204, lon: 73.8567 },
      ahmedabad: { lat: 23.0225, lon: 72.5714 },
      india: { lat: 20.5937, lon: 78.9629 },
    };

    const locationKey = location.toLowerCase();
    for (const [city, coords] of Object.entries(coordinates)) {
      if (locationKey.includes(city)) {
        return coords;
      }
    }

    return coordinates.india; // Default to center of India
  }

  private getFromCache(key: string, maxAgeMinutes: number): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, maxAgeMinutes: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + maxAgeMinutes * 60 * 1000,
    });
  }
}

export const businessDirectoryService = new BusinessDirectoryService();
