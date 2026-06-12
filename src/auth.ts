import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextRequest } from "next/server";
import type { Session } from "next-auth";
import type { User } from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // NOTE: User model is not yet defined (Issue #2).
      // This authorize function will be fully implemented in Issue #3.
      async authorize(credentials): Promise<User | null> {
        // Placeholder: always returns null until User model and auth logic are implemented
        void credentials;
        return null;
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
