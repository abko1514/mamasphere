// app/api/verify-email/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Users from "@/models/Users";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Verification token is required", {
        status: 400,
      });
    }

    await dbConnect();

    const user = await Users.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return new NextResponse("Invalid or expired verification token", {
        status: 400,
      });
    }

    if (user.isVerified) {
      return new NextResponse("Email already verified", { status: 400 });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Redirect to login page with success message
    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    return new NextResponse(String(error), { status: 500 });
  }
}
