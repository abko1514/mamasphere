// scripts/seedDatabase.ts
import { MongoClient, ObjectId } from "mongodb";
import {dbConnect} from "../lib/dbConnect";
import {
  seedCareerTips,
  seedJobRecommendations,
  seedSmallBusinesses,
  seedFreelanceOpportunities,
} from "../lib/seed/careerSeedData";

async function seedDatabase() {
  try {
    // If dbConnect returns MongoClient, get the database object
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db(); // Replace with your database name if needed, e.g. client.db("yourDbName")

    console.log("Starting database seeding...");

    // Create indexes for better performance
    await createIndexes(db);

    // Seed career tips
    await db.collection("careerTips").deleteMany({}); // Clear existing
    const tipsWithDates = seedCareerTips.map((tip) => ({
      ...tip,
      _id: new ObjectId(),
      createdAt: new Date(),
    }));
    await db.collection("careerTips").insertMany(tipsWithDates);
    console.log(`Seeded ${tipsWithDates.length} career tips`);

    // Seed job recommendations
    await db.collection("jobRecommendations").deleteMany({});
    const jobsWithIds = seedJobRecommendations.map((job) => ({
      ...job,
      _id: new ObjectId(),
    }));
    await db.collection("jobRecommendations").insertMany(jobsWithIds);
    console.log(`Seeded ${jobsWithIds.length} job recommendations`);

    // Seed small businesses
    await db.collection("smallBusinesses").deleteMany({});
    const businessesWithIds = seedSmallBusinesses.map((business) => ({
      ...business,
      _id: new ObjectId(),
      createdAt: new Date(),
    }));
    await db.collection("smallBusinesses").insertMany(businessesWithIds);
    console.log(`Seeded ${businessesWithIds.length} small businesses`);

    // Seed freelance opportunities
    await db.collection("freelanceOpportunities").deleteMany({});
    const freelanceWithIds = seedFreelanceOpportunities.map((opp) => ({
      ...opp,
      _id: new ObjectId(),
    }));
    await db.collection("freelanceOpportunities").insertMany(freelanceWithIds);
    console.log(`Seeded ${freelanceWithIds.length} freelance opportunities`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

async function createIndexes(db: any) {
  // Career tips indexes
  await db.collection("careerTips").createIndex({ category: 1 });
  await db.collection("careerTips").createIndex({ targetAudience: 1 });
  await db.collection("careerTips").createIndex({ relevanceScore: -1 });
  await db.collection("careerTips").createIndex({ createdAt: -1 });

  // Job recommendations indexes
  await db.collection("jobRecommendations").createIndex({ type: 1 });
  await db.collection("jobRecommendations").createIndex({ workArrangement: 1 });
  await db.collection("jobRecommendations").createIndex({ location: "text" });
  await db
    .collection("jobRecommendations")
    .createIndex({ isMaternityFriendly: 1 });
  await db.collection("jobRecommendations").createIndex({ postedDate: -1 });
  await db
    .collection("jobRecommendations")
    .createIndex({ "salaryRange.min": 1 });

  // Small businesses indexes
  await db.collection("smallBusinesses").createIndex({ category: 1 });
  await db.collection("smallBusinesses").createIndex({ location: "text" });
  await db.collection("smallBusinesses").createIndex({ isMomOwned: 1 });
  await db.collection("smallBusinesses").createIndex({ isVerified: 1 });
  await db.collection("smallBusinesses").createIndex({ rating: -1 });
  await db.collection("smallBusinesses").createIndex({ createdAt: -1 });

  // Freelance opportunities indexes
  await db.collection("freelanceOpportunities").createIndex({ projectType: 1 });
  await db
    .collection("freelanceOpportunities")
    .createIndex({ experienceLevel: 1 });
  await db.collection("freelanceOpportunities").createIndex({ isRemote: 1 });
  await db
    .collection("freelanceOpportunities")
    .createIndex({ applicationDeadline: 1 });
  await db.collection("freelanceOpportunities").createIndex({ postedDate: -1 });
  await db
    .collection("freelanceOpportunities")
    .createIndex({ "budget.min": 1 });

  // AI insights indexes
  await db.collection("aiCareerInsights").createIndex({ userId: 1 });
  await db.collection("aiCareerInsights").createIndex({ generatedAt: -1 });

  // User profiles indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ availabilityStatus: 1 });
  await db.collection("users").createIndex({ industry: 1 });

  // Job applications indexes
  await db.collection("jobApplications").createIndex({ userId: 1 });
  await db.collection("jobApplications").createIndex({ jobId: 1 });
  await db.collection("jobApplications").createIndex({ appliedAt: -1 });

  console.log("Database indexes created successfully");
}

if (require.main === module) {
  seedDatabase();
}
