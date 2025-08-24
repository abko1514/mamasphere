import { NextResponse } from 'next/server';

export async function GET() {
  const debugInfo = {
    brevoApiKey: !!process.env.BREVO_API_KEY,
    mongodbUri: !!process.env.MONGODB_URI,
    senderEmail: process.env.SENDER_EMAIL,
    senderName: process.env.SENDER_NAME,
    cronSecret: !!process.env.CRON_SECRET,
    nodeEnv: process.env.NODE_ENV,
  };

  return NextResponse.json(debugInfo);
}
