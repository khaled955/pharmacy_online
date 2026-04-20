import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { AuthUser } from "@/lib/types/auth";
import { loginAction } from "./lib/auth/login.action";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Credentials Are Required!");
        }

        const payload = await loginAction({
          email: credentials.email,
          password: credentials.password,
        });

        if (!payload.status || !payload.data) {
          throw new Error(payload.message || "Error During LogIn!");
        }

        return payload.data;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user as AuthUser;
      }

      if (trigger === "update" && session?.user && token.user) {
        const currentUser = token.user as AuthUser;
        token.user = {
          ...currentUser,
          ...session.user,
          accessToken: currentUser.accessToken,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as AuthUser;
      return session;
    },
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
};
