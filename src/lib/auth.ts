// 1. Create a new file: lib/auth.ts
import  { AuthOptions } from "next-auth";
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

  interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  }
}

export const authOptions: AuthOptions = {
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
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
              };
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
            const savedUser = await newUser.save();
            // Add the ID to the user object for the session callback
            user.id = savedUser._id.toString();
          } else {
            user.id = existingUser._id.toString();
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
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.role) {
        session.user.role = typeof token.role === "string" ? token.role : null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = typeof user.id === "string" ? user.id : undefined;
        const dbUser = await Users.findById(user.id);
        token.role = typeof dbUser?.role === "string" ? dbUser?.role : null;
      }
      return token;
    },
  },
};
