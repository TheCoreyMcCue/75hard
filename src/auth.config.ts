import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = ["/login", "/signup"];

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

      if (isPublic) {
        if (isLoggedIn) return Response.redirect(new URL("/", request.nextUrl));
        return true;
      }
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) token.userId = (user as { id?: string }).id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
