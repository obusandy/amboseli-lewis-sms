import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; role: string } & DefaultSession["user"];
  }
  interface User {
    role: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // --- START OF LOGGING ---
        console.log("--- [AUTHORIZE FUNCTION START] ---");

        if (!credentials?.email || !credentials.password) {
          console.log("ERROR: Missing email or password in credentials.");
          throw new Error("Invalid credentials.");
        }

        console.log(
          `Step 1: Credentials received for email: ${credentials.email}`
        );

        try {
          console.log(
            "Step 2: Attempting to connect to Prisma to find user..."
          );
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            console.log(
              "ERROR: User not found in database, or user has no password field."
            );
            throw new Error("No user found with this email.");
          }

          console.log(
            "Step 3: User found in database. User's role:",
            user.role
          );
          console.log("Step 4: Comparing passwords now.");
          console.log(
            " -> Plain text password from form:",
            credentials.password
          );
          console.log(" -> Hashed password from DB:", user.password);

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          console.log(
            "Step 5: Password comparison result (isPasswordValid):",
            isPasswordValid
          );

          if (!isPasswordValid) {
            console.log(
              "ERROR: Password comparison returned false. Incorrect password."
            );
            throw new Error("Incorrect password.");
          }

          console.log("SUCCESS: Password is valid. Returning user object.");
          console.log("--- [AUTHORIZE FUNCTION END] ---");
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error(
            "CRITICAL ERROR inside authorize try/catch block:",
            error
          );
          // Re-throw the error so NextAuth can handle it
          throw new Error("A server error occurred during authentication.");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = () => getServerSession(authOptions);
