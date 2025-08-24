import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    console.log("Testing AI with:", { title, description });

    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/ai/prioritize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      }
    );

    const result = await response.json();

    return NextResponse.json({
      input: { title, description },
      output: result,
      success: response.ok,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
