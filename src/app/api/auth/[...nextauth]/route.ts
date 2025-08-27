import NextAuth, { AuthOptions } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Users from "@/models/Users";
import { dbConnect } from "@/lib/dbConnect";

interface Credentials {
  name: string;
  email: string;
  password: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) return null;

        await dbConnect();
        try {
          const user = await Users.findOne({ email: credentials.email });
          if (user) {
            // Check if user is verified
            if (!user.isVerified) {
              throw new Error("Please verify your email before logging in");
            }

            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
          return null;
        } catch (err) {
          throw new Error(
            err instanceof Error ? err.message : "Unknown error occurred"
          );
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: AuthUser;
      account: Account | null;
    }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "google") {
        await dbConnect();
        try {
          const existingUser = await Users.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new Users({
              name: user.name,
              email: user.email,
              role: "user", // Default role for new Google sign-ins
            });
            await newUser.save();
          }
          // If user exists or was just created, allow sign-in
          return true;
        } catch (err: unknown) {
          // Type guard to check if error is a MongoDB error
          if (
            err &&
            typeof err === "object" &&
            "code" in err &&
            err.code === 11000
          ) {
            console.log(
              "User already exists with this email, proceeding with sign-in."
            );
            return true; // Allow sign-in despite duplicate
          }
          console.log("Error saving user", err);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (token?.role) {
        if (session.user) {
          session.user.role =
            typeof token.role === "string" ? token.role : null; // Add role to session
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await Users.findOne({ email: user.email });
        token.role = typeof dbUser?.role === "string" ? dbUser?.role : null; // Add role to token
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };