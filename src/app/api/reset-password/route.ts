import Users from "@/models/Users";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface RequestBody {
    email: string;
    password: string;
}

export const POST = async (request: Request) => {
  try {
    const { email,password }: RequestBody = await request.json();
    await dbConnect();

    const existingUser = await Users.findOne({ email: email });
    const hashedPassword = await bcrypt.hash(password, 5);
    existingUser.password = hashedPassword;

    existingUser.resetToken = undefined;
    existingUser.resetTokenExpiry = undefined;

    await existingUser.save();
    return new NextResponse("Password changed successfully", { status: 200 });
  } catch (error) {
    return new NextResponse(String(error), { status: 400 });
  }
};
