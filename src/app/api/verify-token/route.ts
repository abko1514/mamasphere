import Users from "@/models/Users";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import crypto from "crypto";

interface RequestBody {
  token: string;
}

export const POST = async (request: Request) => {
  try {
    const { token }: RequestBody = await request.json();
    await dbConnect();


    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Users.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new NextResponse("Invalid or expired token", { status: 400 });
    }
    return new NextResponse(JSON.stringify(user), { status: 200 });
  }
  catch(error)
  {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}