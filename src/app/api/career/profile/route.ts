// app/api/career/profile/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return createCareerProfile(req, res);
    case "GET":
      return getCareerProfile(req, res);
    case "PUT":
      return updateCareerProfile(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function createCareerProfile(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();
    const { MongoClient, ObjectId } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    const profileData = {
      ...req.body,
      email: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: new ObjectId(),
    };

    // Check if profile already exists
    const existingProfile = await db.collection("userProfiles").findOne({
      email: session.user.email,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists. Use PUT to update.",
      });
    }

    // Insert new profile
    const result = await db.collection("userProfiles").insertOne(profileData);

    // Also update the main users collection with basic info
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name: profileData.name,
          phone: profileData.phone,
          location: profileData.location,
          industry: profileData.industry,
          currentRole: profileData.currentRole,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    await client.close();
    res.status(201).json({
      message: "Profile created successfully",
      profileId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating career profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getCareerProfile(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    const profile = await db.collection("userProfiles").findOne({
      email: session.user.email,
    });

    await client.close();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching career profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateCareerProfile(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.email;

    const result = await db
      .collection("userProfiles")
      .updateOne({ email: session.user.email }, { $set: updateData });

    if (result.matchedCount === 0) {
      await client.close();
      return res.status(404).json({ message: "Profile not found" });
    }

    // Also update the main users collection with basic info
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name: updateData.name,
          phone: updateData.phone,
          location: updateData.location,
          industry: updateData.industry,
          currentRole: updateData.currentRole,
          updatedAt: new Date(),
        },
      }
    );

    const updatedProfile = await db.collection("userProfiles").findOne({
      email: session.user.email,
    });

    await client.close();
    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating career profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// pages/api/career/profile/check.ts - Check if user has completed profile
export async function checkProfileHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    const profile = await db.collection("userProfiles").findOne({
      email: session.user.email,
    });

    await client.close();

    // Calculate profile completion percentage
    let completionScore = 0;
    if (profile) {
      const requiredFields = [
        "name",
        "email",
        "location",
        "industry",
        "yearsOfExperience",
        "educationLevel",
        "workPreference",
        "availabilityStatus",
      ];

      const optionalFields = [
        "currentRole",
        "skillsAndExperience",
        "careerGoals",
        "bio",
        "desiredSalaryRange",
        "flexibilityNeeds",
        "workExperience",
      ];

      // Required fields count for 60%
      const completedRequired = requiredFields.filter(
        (field) => profile[field] && profile[field] !== ""
      ).length;
      completionScore += (completedRequired / requiredFields.length) * 60;

      // Optional fields count for 40%
      const completedOptional = optionalFields.filter((field) => {
        if (Array.isArray(profile[field])) {
          return profile[field].length > 0;
        }
        return profile[field] && profile[field] !== "";
      }).length;
      completionScore += (completedOptional / optionalFields.length) * 40;
    }

    res.status(200).json({
      hasProfile: !!profile,
      completionPercentage: Math.round(completionScore),
      profile: profile
        ? {
            name: profile.name,
            currentRole: profile.currentRole,
            industry: profile.industry,
            location: profile.location,
            availabilityStatus: profile.availabilityStatus,
            lastUpdated: profile.updatedAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// pages/api/career/profile/stats.ts - Get profile statistics
export async function getProfileStatsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    const profile = await db.collection("userProfiles").findOne({
      email: session.user.email,
    });

    if (!profile) {
      await client.close();
      return res.status(404).json({ message: "Profile not found" });
    }

    // Get related career data
    const [savedJobs, applications, aiInsights] = await Promise.all([
      db
        .collection("savedJobs")
        .countDocuments({ userEmail: session.user.email }),
      db
        .collection("jobApplications")
        .countDocuments({ userEmail: session.user.email }),
      db
        .collection("aiCareerInsights")
        .findOne(
          { userEmail: session.user.email },
          { sort: { generatedAt: -1 } }
        ),
    ]);

    // Get available jobs count based on user preferences
    const jobsQuery: any = {};
    if (profile.workPreference && profile.workPreference !== "flexible") {
      jobsQuery.workArrangement = profile.workPreference;
    }
    if (profile.location) {
      jobsQuery.$or = [
        { workArrangement: "remote" },
        { location: { $regex: profile.location.split(",")[0], $options: "i" } },
      ];
    }

    const availableJobs = await db
      .collection("jobRecommendations")
      .countDocuments(jobsQuery);

    await client.close();

    res.status(200).json({
      profileCompletion: calculateCompletionScore(profile),
      savedJobs,
      applications,
      availableJobs,
      hasAIInsights: !!aiInsights,
      lastAIInsightDate: aiInsights?.generatedAt || null,
      memberSince: profile.createdAt,
      lastActive: profile.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

function calculateCompletionScore(profile: any): number {
  if (!profile) return 0;

  let score = 0;
  const weights = {
    // Essential fields (60% total)
    name: 8,
    email: 8,
    location: 8,
    industry: 8,
    yearsOfExperience: 8,
    educationLevel: 6,
    workPreference: 6,
    availabilityStatus: 8,

    // Important fields (25% total)
    currentRole: 5,
    skillsAndExperience: 8,
    careerGoals: 4,
    desiredSalaryRange: 8,

    // Nice to have fields (15% total)
    bio: 3,
    flexibilityNeeds: 4,
    workExperience: 4,
    certifications: 2,
    languages: 2,
  };

  Object.entries(weights).forEach(([field, weight]) => {
    const value = profile[field];
    let hasValue = false;

    if (Array.isArray(value)) {
      hasValue = value.length > 0;
    } else if (typeof value === "object" && value !== null) {
      hasValue = Object.keys(value).length > 0;
    } else {
      hasValue = value !== undefined && value !== null && value !== "";
    }

    if (hasValue) {
      score += weight;
    }
  });

  return Math.min(100, Math.round(score));
}

// Mongoose schema for UserProfile (optional - for type safety)
import mongoose from "mongoose";

const workExperienceSchema = new mongoose.Schema({
  id: String,
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  isCurrent: Boolean,
  description: String,
  achievements: [String],
  skills: [String],
  location: String,
  employmentType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "freelance", "internship"],
  },
});

const certificationSchema = new mongoose.Schema({
  id: String,
  name: String,
  issuer: String,
  issueDate: Date,
  expiryDate: Date,
  credentialUrl: String,
  skills: [String],
});

const languageSchema = new mongoose.Schema({
  language: String,
  proficiency: {
    type: String,
    enum: ["basic", "intermediate", "advanced", "native"],
  },
});

const userProfileSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    resumeUrl: String,
    avatar: String,

    // Personal Information
    phone: String,
    dateOfBirth: Date,
    location: { type: String, required: true },
    bio: String,

    // Pregnancy & Family Status
    isPregnant: { type: Boolean, default: false },
    dueDate: Date,
    pregnancyWeek: Number,
    childrenAges: [Number],
    partnerName: String,
    familyStatus: {
      type: String,
      enum: ["single", "partnered", "married", "divorced", "widowed"],
      default: "single",
    },

    // Career Information
    currentRole: String,
    company: String,
    industry: { type: String, required: true },
    workExperience: [workExperienceSchema],
    skillsAndExperience: [String],
    educationLevel: {
      type: String,
      enum: [
        "high_school",
        "associates",
        "bachelors",
        "masters",
        "phd",
        "other",
      ],
      default: "bachelors",
    },

    // Career Goals & Preferences
    careerGoals: String,
    workPreference: {
      type: String,
      enum: ["remote", "hybrid", "onsite", "flexible"],
      default: "hybrid",
    },
    availabilityStatus: {
      type: String,
      enum: [
        "maternity_leave",
        "returning_to_work",
        "actively_working",
        "seeking_opportunities",
        "career_break",
      ],
      default: "actively_working",
    },
    desiredSalaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: "USD" },
    },

    // Professional Development
    certifications: [certificationSchema],
    languages: [languageSchema],
    portfolioUrl: String,
    linkedinUrl: String,
    githubUrl: String,

    // Preferences & Settings
    jobAlerts: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true },
    communityUpdates: { type: Boolean, default: false },
    mentorshipInterested: { type: Boolean, default: false },

    // Career Support Specific
    yearsOfExperience: { type: Number, required: true, min: 0 },
    careerBreakDuration: Number, // in months
    returnToWorkDate: Date,
    flexibilityNeeds: [String],

    // Community & Social
    interests: [String],
    supportGroups: [String],
    mentorStatus: {
      type: String,
      enum: ["seeking", "offering", "both", "none"],
      default: "none",
    },

    // Privacy Settings
    profileVisibility: {
      type: String,
      enum: ["public", "community", "private"],
      default: "community",
    },
    showContactInfo: { type: Boolean, default: false },
    allowMessages: { type: Boolean, default: true },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

export const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);
