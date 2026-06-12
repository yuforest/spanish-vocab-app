import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";
import type { User } from "next-auth";
import { findUserByEmail } from "@/lib/db/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const user = await findUserByEmail(credentials.email);
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({
      request,
      auth: session,
    }: {
      request: NextRequest;
      auth: Session | null;
    }) {
      const { pathname } = request.nextUrl;
      const protectedPaths = ["/learn", "/quiz", "/dashboard"];
      const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );
      if (isProtected) {
        return !!session?.user;
      }
      return true;
    },
  },
});
