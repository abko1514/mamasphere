// app/api/change-password/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Users from "@/models/Users";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();
    await dbConnect();

    const session = await getServerSession();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current password matches
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await Users.updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
