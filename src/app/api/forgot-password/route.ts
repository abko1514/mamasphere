import Users from "@/models/Users";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

interface RequestBody {
  email: string;
}

export const POST = async (request: Request) => {
  try {
    const { email }: RequestBody = await request.json();
    await dbConnect();

    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return new NextResponse("User does not exist", { status: 400 });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 3600000;

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetExpires;
    await existingUser.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_YOUR_SITE_URL}/reset-password/${resetToken}`;
    const body =  `
Hello,

To reset your password, please verify by clicking the link below:

${resetUrl}

This link will expire in 24 hours.

Best regards,
The MamaSphere Team
                `;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: body,
    });

    return NextResponse.json(
      { message: "Reset password email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
