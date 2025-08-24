import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function POST() {
  try {
    await dbConnect();

    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }

    const result = await mongoose.connection.db.collection("tasks").updateMany(
      {
        reminder: {
          $type: "string",
          $nin: [null, ""],
        },
      },
      [
        {
          $set: {
            reminder: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$reminder", null] },
                    { $ne: ["$reminder", ""] },
                  ],
                },
                then: {
                  $dateFromString: {
                    dateString: "$reminder",
                    onError: null,
                  },
                },
                else: null,
              },
            },
          },
        },
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Migration completed: ${result.modifiedCount} documents updated`,
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
