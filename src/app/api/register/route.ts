import Users from "@/models/Users";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    const { name, email, password }: RequestBody = await request.json();
    await dbConnect();

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    await newUser.save();

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_YOUR_SITE_URL}/api/verify-email?token=${verificationToken}`;

    try {
      await sendEmail({
        to: email,
        subject: "Verify your MamaSphere Account",
        text: `
Hello ${name},

Thank you for registering with MamaSphere! To complete your registration, please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with MamaSphere, please ignore this email.

Best regards,
The MamaSphere Team
                `,
      });
    } catch (emailError) {
      // If email fails, delete the user and throw error
      await Users.findOneAndDelete({ email });
      return new NextResponse("Failed to send verification email"+emailError, {
        status: 500,
      });
    }

    return new NextResponse(
      "User registered successfully. Please check your email for verification.",
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(String(error), { status: 500 });
  }
};
