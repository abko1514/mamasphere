// app/api/career/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/lib/careerService";
import { MongoClient, ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { realTimeCareerService } from "@/lib/services/realTimeCareerService";
import { getServerSession } from "next-auth";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const userId = searchParams.get("userId");
//     const limit = searchParams.get("limit") || "20";
//     const type = searchParams.get("type");
//     const workArrangement = searchParams.get("workArrangement");
//     const location = searchParams.get("location");
//     const salaryMin = searchParams.get("salaryMin");
//     const experienceLevel = searchParams.get("experienceLevel");

//     if (!userId) {
//       return NextResponse.json(
//         { message: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     const filters = {
//       type: type as string,
//       workArrangement: workArrangement as string,
//       location: location as string,
//       salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
//       experienceLevel: experienceLevel as string,
//     };

//     // Remove undefined values
//     Object.keys(filters).forEach(
//       (key) =>
//         filters[key as keyof typeof filters] === undefined &&
//         delete filters[key as keyof typeof filters]
//     );

//     const jobs = await careerService.getJobRecommendations(
//       userId,
//       Object.keys(filters).length > 0 ? filters : undefined,
//       parseInt(limit)
//     );

//     // Track job recommendations viewed
//     await careerService.trackUserActivity(userId, "jobs_viewed", {
//       jobsCount: jobs.length,
//       filters,
//     });

//     return NextResponse.json(jobs);
//   } catch (error) {
//     console.error("Error fetching job recommendations:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// Add other HTTP methods if needed
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}



// app/api/career/jobs/route.ts - Updated version (keep existing code but add fallback handling)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const filters = {
      type: searchParams.get("type") || undefined,
      workArrangement: searchParams.get("workArrangement") || undefined,
      location: searchParams.get("location") || undefined,
      salaryMin: searchParams.get("salaryMin") ? parseInt(searchParams.get("salaryMin")!) : undefined,
      experienceLevel: searchParams.get("experienceLevel") || undefined,
    };

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

     await dbConnect();
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db("mamasphere");
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let jobs = [];
    
    try {
      // Try to get real-time job recommendations
      jobs = await realTimeCareerService.getPersonalizedJobRecommendations({
        _id: user._id.toString(),
        name: user.name || '',
        email: user.email || '',
        currentRole: user.currentRole,
        skillsAndExperience: user.skillsAndExperience,
        yearsOfExperience: user.yearsOfExperience,
        location: user.location,
        workPreference: user.workPreference,
        childrenAges: user.childrenAges
      }, filters);
        } catch (apiError) {
      console.error('Real-time job fetch failed, using cached/mock data:', apiError);
      
      // Try to get cached jobs first
      const cachedJobs = await db.collection("cachedJobs").findOne({
        userId,
        filters: JSON.stringify(filters),
        createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // 30 min cache
      });

      if (cachedJobs?.jobs) {
        jobs = cachedJobs.jobs;
      } else {
        // Use mock data as final fallback
        jobs = getFallbackJobs(user, filters);
      }
    }

    // Cache successful results
    if (jobs.length > 0 && !jobs[0]._id.includes('fallback')) {
      await db.collection("cachedJobs").replaceOne(
        { userId, filters: JSON.stringify(filters) },
        { 
          userId, 
          filters: JSON.stringify(filters), 
          jobs, 
          createdAt: new Date() 
        },
        { upsert: true }
      );
    }

    // Track activity
    await db.collection("userActivities").insertOne({
      userId,
      action: "job_search",
      filters,
      resultsCount: jobs.length,
      dataSource: jobs.length > 0 ? (jobs[0]._id.includes('fallback') ? 'fallback' : 'real-time') : 'none',
      timestamp: new Date(),
    });

    return NextResponse.json({ jobs, count: jobs.length });
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fallback jobs function
function getFallbackJobs(user: any, filters: any) {
  const baseJobs = [
    {
      _id: `fallback_job_${Date.now()}_1`,
      title: `${user.currentRole || 'Professional'} Position`,
      company: "Growing Company",
      location: filters.location || user.location || "Remote",
      workArrangement: filters.workArrangement || user.workPreference || "flexible",
      salaryRange: {
        min: filters.salaryMin || 60000,
        max: (filters.salaryMin || 60000) + 40000,
        currency: "USD"
      },
      requiredSkills: user.skillsAndExperience?.slice(0, 3) || ["Professional Skills"],
      preferredSkills: user.skillsAndExperience?.slice(3, 5) || [],
      description: `Exciting opportunity for a ${user.currentRole || 'professional'} to join our growing team. We offer flexible work arrangements and value work-life balance.`,
      matchScore: 85,
      isMaternityFriendly: true,
      flexibleHours: true,
      benefitsHighlights: ["Health Insurance", "Flexible Schedule", "Professional Development"],
      postedDate: new Date(),
      jobType: filters.type || "full-time",
      experienceLevel: user.yearsOfExperience >= 7 ? "senior" : user.yearsOfExperience >= 3 ? "mid" : "entry",
      companySize: "medium",
      companyStage: "growth",
      diversityCommitment: true,
      parentingSupport: ["Flexible Hours", "Family Support"],
      reasonsForMatch: [
        "Matches your experience level and skills",
        "Offers the work arrangement you prefer",
        "Company values work-life balance"
      ]
    }
  ];

  // Personalize based on user profile
  if (user.childrenAges && user.childrenAges.length > 0) {
    baseJobs[0].benefitsHighlights.push("Childcare Support");
    baseJobs[0].parentingSupport.push("Parental Leave Policy");
  }

  if (user.workPreference === 'remote') {
    baseJobs[0].benefitsHighlights.push("100% Remote Work");
  }

  return baseJobs;
}
