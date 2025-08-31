// app/api/career/businesses/route.ts - Updated for India (No Yelp)
import { NextRequest, NextResponse } from "next/server";
import { realTimeCareerService } from "@/lib/services/realTimeCareerService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get("category") || undefined,
      location: searchParams.get("location") || undefined,
      momOwned: searchParams.get("momOwned") === "true",
      searchQuery: searchParams.get("searchQuery") || undefined,
      hiringStatus: searchParams.get("hiringStatus") || undefined,
    };
    const limit = parseInt(searchParams.get("limit") || "25");

    let businesses = [];
    let dataSource = "unknown";

    try {
      // Get businesses using India-compatible service (Foursquare, OSM, Google Places)
      businesses = await realTimeCareerService.getSmallBusinesses(filters);
      dataSource = businesses.length > 0 ? "real-time" : "mock";
    } catch (apiError) {
      console.error("Real-time business fetch failed:", apiError);

      // Try cached businesses
       await dbConnect();
          const client = new MongoClient(process.env.MONGODB_URI!);
          await client.connect();
          const db = client.db("mamasphere");
      const cachedBusinesses = await db.collection("cachedBusinesses").findOne({
        filters: JSON.stringify(filters),
        createdAt: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 hour cache
      });

      if (cachedBusinesses?.businesses) {
        businesses = cachedBusinesses.businesses;
        dataSource = "cached";
      } else {
        // Use India-specific mock data as final fallback
        businesses = getIndianFallbackBusinesses(filters);
        dataSource = "fallback";
      }
    }

    // Cache successful results
    if (businesses.length > 0 && !businesses[0]._id.includes("fallback")) {
      try {
         await dbConnect();
         const client = new MongoClient(process.env.MONGODB_URI!);
         await client.connect();
         const db = client.db("mamasphere");
        await db.collection("cachedBusinesses").replaceOne(
          { filters: JSON.stringify(filters) },
          {
            filters: JSON.stringify(filters),
            businesses,
            createdAt: new Date(),
          },
          { upsert: true }
        );
      } catch (cacheError) {
        console.error("Error caching businesses:", cacheError);
      }
    }

    // Track activity
    try {
       await dbConnect();
       const client = new MongoClient(process.env.MONGODB_URI!);
       await client.connect();
       const db = client.db("mamasphere");
      await db.collection("userActivities").insertOne({
        userId: session.user.email,
        action: "business_search",
        filters,
        resultsCount: businesses.length,
        dataSource: dataSource,
        timestamp: new Date(),
      });
    } catch (trackingError) {
      console.error("Error tracking activity:", trackingError);
    }

    return NextResponse.json({
      businesses: businesses.slice(0, limit),
      count: businesses.length,
      dataSource: dataSource,
      message: getDataSourceMessage(dataSource),
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);

    // Final fallback
    const fallbackBusinesses = getIndianFallbackBusinesses();
    return NextResponse.json({
      businesses: fallbackBusinesses.slice(0, 5),
      count: fallbackBusinesses.length,
      dataSource: "emergency-fallback",
      message: "Using emergency fallback data due to system error",
    });
  }
}

// India-specific fallback businesses
function getIndianFallbackBusinesses(filters?: any): any[] {
  let businesses = [
    {
      _id: "fallback_indian_business_1",
      name: "Women Entrepreneurs Network Delhi",
      businessName: "Women Entrepreneurs Network Delhi",
      description:
        "Premier network for women entrepreneurs in Delhi NCR, providing business mentorship, funding guidance, and networking opportunities.",
      industry: "Business Networking",
      location: "Delhi, NCR, India",
      category: "Professional Services",
      website: "https://wendelhi.org",
      contact: {
        email: "connect@wendelhi.org",
        phone: "+91-9876543210",
        social: {
          linkedin: "https://linkedin.com/company/wen-delhi",
          instagram: "@wendelhi",
        },
      },
      ownerInfo: {
        name: "Dr. Meera Agarwal",
        isMother: true,
        story:
          "Serial entrepreneur and mother of two, dedicated to empowering women in business across India.",
        yearsInBusiness: 8,
      },
      ownerName: "Dr. Meera Agarwal",
      ownerId: "wen_delhi_owner",
      services: [
        "Business Mentorship",
        "Funding Guidance",
        "Networking Events",
        "Skill Development",
      ],
      specializations: [
        "Women Entrepreneurship",
        "Startup Support",
        "Business Strategy",
      ],
      supportingMoms: true,
      lookingForCollaborators: true,
      hiringStatus: "open-to-opportunities",
      workArrangements: ["remote", "hybrid", "flexible"],
      tags: ["women-entrepreneurs", "delhi", "business-network", "mentorship"],
      verified: true,
      isVerified: true,
      rating: 4.8,
      reviewCount: 67,
      isMomOwned: true,
      images: ["https://example.com/wen-delhi.jpg"],
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "fallback_indian_business_2",
      name: "TechMoms Bangalore",
      businessName: "TechMoms Bangalore",
      description:
        "Supporting working mothers in Bangalore's tech industry with flexible job opportunities, skill development, and community support.",
      industry: "Technology Community",
      location: "Bangalore, Karnataka, India",
      category: "Technology Support",
      website: "https://techmomsbangalore.in",
      contact: {
        email: "hello@techmomsbangalore.in",
        phone: "+91-8765432109",
        social: {
          linkedin: "https://linkedin.com/company/techmoms-bangalore",
          instagram: "@techmomsblr",
          facebook: "https://facebook.com/techmomsbangalore",
        },
      },
      ownerInfo: {
        name: "Priya Krishnan & Anjali Nair",
        isMother: true,
        story:
          "Two software engineers who became mothers and created a support system for other tech moms in Bangalore.",
        yearsInBusiness: 4,
      },
      ownerName: "Priya Krishnan & Anjali Nair",
      ownerId: "techmoms_blr_owner",
      services: [
        "Job Placement",
        "Skill Training",
        "Flexible Work Matching",
        "Community Support",
      ],
      specializations: [
        "Tech Career Transition",
        "Remote Work Setup",
        "Coding Bootcamps",
      ],
      supportingMoms: true,
      lookingForCollaborators: true,
      hiringStatus: "actively-hiring",
      workArrangements: ["remote", "hybrid", "flexible"],
      tags: ["technology", "bangalore", "working-mothers", "job-placement"],
      verified: true,
      isVerified: true,
      rating: 4.7,
      reviewCount: 89,
      isMomOwned: true,
      images: ["https://example.com/techmoms-blr.jpg"],
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "fallback_indian_business_3",
      name: "Mumbai Mom Entrepreneurs Hub",
      businessName: "Mumbai Mom Entrepreneurs Hub",
      description:
        "Collaborative workspace and business incubator in Mumbai specifically designed for mother entrepreneurs and women returning to work.",
      industry: "Business Incubation",
      location: "Mumbai, Maharashtra, India",
      category: "Business Development",
      website: "https://mumbaimo mentshub.com",
      contact: {
        email: "info@mumbaimo entshub.com",
        phone: "+91-7654321098",
        social: {
          linkedin: "https://linkedin.com/company/mumbai-mom-entrepreneurs",
          instagram: "@mumbaimo entshub",
        },
      },
      ownerInfo: {
        name: "Kavita Shah",
        isMother: true,
        story:
          "Former investment banker turned social entrepreneur, creating opportunities for Mumbai's working mothers.",
        yearsInBusiness: 3,
      },
      ownerName: "Kavita Shah",
      ownerId: "mumbai_hub_owner",
      services: [
        "Co-working Space",
        "Business Incubation",
        "Funding Support",
        "Childcare Facilities",
      ],
      specializations: [
        "Mom-Friendly Workspace",
        "Business Acceleration",
        "Investor Connect",
      ],
      supportingMoms: true,
      lookingForCollaborators: true,
      hiringStatus: "actively-hiring",
      workArrangements: ["onsite", "hybrid", "flexible"],
      tags: ["mumbai", "co-working", "business-incubator", "mom-entrepreneurs"],
      verified: true,
      isVerified: true,
      rating: 4.9,
      reviewCount: 43,
      isMomOwned: true,
      images: ["https://example.com/mumbai-hub.jpg"],
      createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "fallback_indian_business_4",
      name: "Chennai Digital Marketing Collective",
      businessName: "Chennai Digital Marketing Collective",
      description:
        "Women-led digital marketing agency in Chennai offering services to local businesses while providing flexible work opportunities for mothers.",
      industry: "Digital Marketing",
      location: "Chennai, Tamil Nadu, India",
      category: "Marketing & Advertising",
      website: "https://chennaidigimarketing.co.in",
      contact: {
        email: "team@chennaidigimarketing.co.in",
        phone: "+91-6543210987",
        social: {
          linkedin: "https://linkedin.com/company/chennai-digital-collective",
          instagram: "@chennaidigicollective",
        },
      },
      ownerInfo: {
        name: "Lakshmi Raghavan",
        isMother: true,
        story:
          "Marketing professional who started this collective to provide quality services while supporting working mothers in Chennai.",
        yearsInBusiness: 2,
      },
      ownerName: "Lakshmi Raghavan",
      ownerId: "chennai_digital_owner",
      services: [
        "Social Media Marketing",
        "Content Creation",
        "Website Development",
        "SEO Services",
      ],
      specializations: [
        "Local Business Marketing",
        "Tamil Content",
        "Regional Campaigns",
      ],
      supportingMoms: true,
      lookingForCollaborators: true,
      hiringStatus: "open-to-opportunities",
      workArrangements: ["remote", "hybrid"],
      tags: ["chennai", "digital-marketing", "tamil", "women-led"],
      verified: true,
      isVerified: true,
      rating: 4.6,
      reviewCount: 52,
      isMomOwned: true,
      images: ["https://example.com/chennai-digital.jpg"],
      createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "fallback_indian_business_5",
      name: "Hyderabad Women in Finance Network",
      businessName: "Hyderabad Women in Finance Network",
      description:
        "Professional network and consulting group for women in finance, banking, and fintech sectors across Hyderabad and Telangana.",
      industry: "Financial Services",
      location: "Hyderabad, Telangana, India",
      category: "Financial Consulting",
      website: "https://hyd-women-finance.org",
      contact: {
        email: "network@hyd-women-finance.org",
        phone: "+91-5432109876",
        social: {
          linkedin: "https://linkedin.com/company/hyd-women-finance",
          instagram: "@hydwomenfinance",
        },
      },
      ownerInfo: {
        name: "Sunitha Reddy",
        isMother: true,
        story:
          "Former bank executive building a support network for women in Hyderabad's growing fintech ecosystem.",
        yearsInBusiness: 6,
      },
      ownerName: "Sunitha Reddy",
      ownerId: "hyd_finance_owner",
      services: [
        "Financial Consulting",
        "Career Mentorship",
        "Networking Events",
        "Investment Advisory",
      ],
      specializations: [
        "Fintech Career Transition",
        "Investment Planning",
        "Financial Literacy",
      ],
      supportingMoms: true,
      lookingForCollaborators: true,
      hiringStatus: "open-to-opportunities",
      workArrangements: ["hybrid", "flexible"],
      tags: ["hyderabad", "finance", "fintech", "women-network"],
      verified: true,
      isVerified: true,
      rating: 4.8,
      reviewCount: 34,
      isMomOwned: true,
      images: ["https://example.com/hyd-finance.jpg"],
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    },
  ];

  // Filter by location if specified
  if (filters?.location) {
    const locationLower = filters.location.toLowerCase();
    businesses = businesses.filter((business) =>
      business.location.toLowerCase().includes(locationLower)
    );
  }

  // Filter by category if specified
  if (filters?.category) {
    const categoryLower = filters.category.toLowerCase();
    businesses = businesses.filter(
      (business) =>
        business.category.toLowerCase().includes(categoryLower) ||
        business.industry.toLowerCase().includes(categoryLower)
    );
  }

  // Filter by mom-owned if specified
  if (filters?.momOwned) {
    businesses = businesses.filter((business) => business.isMomOwned);
  }

  // Filter by search query if specified
  if (filters?.searchQuery) {
    const queryLower = filters.searchQuery.toLowerCase();
    businesses = businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(queryLower) ||
        business.description.toLowerCase().includes(queryLower) ||
        business.services.some((service) =>
          service.toLowerCase().includes(queryLower)
        )
    );
  }

  // Filter by hiring status if specified
  if (filters?.hiringStatus && filters.hiringStatus !== "not-hiring") {
    businesses = businesses.filter(
      (business) => business.hiringStatus === filters.hiringStatus
    );
  }

  return businesses;
}

function getDataSourceMessage(dataSource: string): string {
  switch (dataSource) {
    case "real-time":
      return "Live data from Foursquare, OpenStreetMap, and Google Places";
    case "cached":
      return "Recently cached business data";
    case "fallback":
      return "India-specific curated business directory";
    case "emergency-fallback":
      return "Emergency backup data - some services may be temporarily unavailable";
    default:
      return "Business data retrieved successfully";
  }
}

// Additional endpoint for business details
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { businessId, action, message } = await request.json();

    if (!businessId || !action) {
      return NextResponse.json(
        {
          message: "Missing required fields: businessId and action",
        },
        { status: 400 }
      );
    }

     await dbConnect();
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db("mamasphere");

    // Track business interaction
    await db.collection("userActivities").insertOne({
      userId: session.user.email,
      action: `business_${action}`,
      metadata: {
        businessId: businessId,
        message: action === "contact" ? message : undefined,
      },
      timestamp: new Date(),
    });

    let response = {};

    switch (action) {
      case "contact":
        if (!message) {
          return NextResponse.json(
            {
              message: "Message is required for contact action",
            },
            { status: 400 }
          );
        }

        // Store contact request
        await db.collection("businessContacts").insertOne({
          userId: session.user.email,
          businessId: businessId,
          message: message,
          status: "pending",
          createdAt: new Date(),
        });

        response = {
          message: "Contact request sent successfully",
          status: "sent",
        };
        break;

      case "save":
        // Save business to user's saved list
        await db.collection("savedBusinesses").replaceOne(
          { userId: session.user.email, businessId: businessId },
          {
            userId: session.user.email,
            businessId: businessId,
            savedAt: new Date(),
          },
          { upsert: true }
        );

        response = {
          message: "Business saved successfully",
          status: "saved",
        };
        break;

      case "view":
        // Track business view
        await db.collection("businessViews").insertOne({
          userId: session.user.email,
          businessId: businessId,
          viewedAt: new Date(),
        });

        response = {
          message: "Business view tracked",
          status: "viewed",
        };
        break;

      default:
        return NextResponse.json(
          {
            message: "Invalid action. Supported actions: contact, save, view",
          },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing business action:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
