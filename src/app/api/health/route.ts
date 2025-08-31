// app/api/health/route.ts - API health check endpoint
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseHealth(),
      apis: await checkAPIHealth(),
      cache: await checkCacheHealth(),
    },
  };

  const allHealthy = Object.values(health.services).every(
    (service) => service.status === "healthy"
  );

  return NextResponse.json(health, {
    status: allHealthy ? 200 : 503,
  });
}

async function checkDatabaseHealth() {
  try {
    const { dbConnect } = await import("@/lib/dbConnect");
     await dbConnect();
     const client = new MongoClient(process.env.MONGODB_URI!);
     await client.connect();
     const db = client.db("mamasphere");
    await db.collection("users").findOne({}, { projection: { _id: 1 } });
    return { status: "healthy", message: "Database connection successful" };
  } catch (error) {
    return { status: "unhealthy", message: "Database connection failed" };
  }
}

async function checkAPIHealth() {
  const apis = {
    adzuna: process.env.ADZUNA_API_KEY ? "configured" : "not-configured",
    rapidapi: process.env.RAPIDAPI_KEY ? "configured" : "not-configured",
    huggingface: process.env.HUGGINGFACE_API_KEY
      ? "configured"
      : "not-configured",
    yelp: process.env.YELP_API_KEY ? "configured" : "not-configured",
  };

  const configuredApis = Object.values(apis).filter(
    (status) => status === "configured"
  ).length;

  return {
    status: configuredApis >= 2 ? "healthy" : "degraded",
    message: `${configuredApis}/4 APIs configured`,
    apis: apis,
  };
}

async function checkCacheHealth() {
  try {
    // Test cache by attempting to read/write
    const testKey = `health_check_${Date.now()}`;
    const testValue = { test: true };

    // This would depend on your caching implementation
    // For now, we'll just check if the database is available for caching
    const { dbConnect } = await import("@/lib/dbConnect");
    await dbConnect();
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("mamasphere");
    await db
      .collection("health_check")
      .insertOne({ key: testKey, value: testValue, createdAt: new Date() });
    await db.collection("health_check").deleteOne({ key: testKey });

    return { status: "healthy", message: "Cache operations successful" };
  } catch (error) {
    return { status: "unhealthy", message: "Cache operations failed" };
  }
}
