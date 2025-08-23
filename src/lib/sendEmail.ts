import nodemailer from "nodemailer";

// Create a reusable transporter object using OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.USER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Function to send an email
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `MamaSphere <${process.env.USER_EMAIL}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
