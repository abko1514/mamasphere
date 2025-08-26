// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function GET() {
//   try {
//     console.log("Testing MongoDB connection...");
//     console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

//     const client = await clientPromise;
//     console.log("Client connected successfully");

//     // Test basic connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Ping successful");

//     // Test database access
//     const db = client.db("mamasphere");
//     const collections = await db.listCollections().toArray();
//     console.log(
//       "Collections:",
//       collections.map((c) => c.name)
//     );

//     // Test reading from tasks collection
//     const tasksCount = await db.collection("tasks").countDocuments();
//     console.log("Tasks count:", tasksCount);

//     return NextResponse.json({
//       status: "success",
//       message: "MongoDB connection working",
//       collections: collections.map((c) => c.name),
//       tasksCount: tasksCount,
//     });
//   } catch (error) {
//     console.error("Database test failed:", error);
//     return NextResponse.json(
//       {
//         error: "Database connection failed",
//         details: typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : String(error),
//         stack: typeof error === "object" && error !== null && "stack" in error ? (error as { stack?: string }).stack : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }
