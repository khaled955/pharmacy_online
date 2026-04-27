import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { NextAuthUserPayload, SessionUser } from "@/lib/types/auth";
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

        const sessionUser: SessionUser = {
          id: payload.data.id,
          avatar_url: payload.data.avatar_url,
          email: payload.data.email,
          first_name: payload.data.first_name,
          last_name: payload.data.last_name,
          phone: payload.data.phone,
          role: payload.data.role,
        };

        return {
          id: payload.data.id,
          accessToken: payload.data.accessToken,
          user: sessionUser,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // in case of login
      if (user) {
        token.user = user as NextAuthUserPayload;
      }

      if (trigger === "update" && session?.user && token.user) {
        token.user = {
          ...token.user,
          user: {
            ...token.user.user,
            ...session.user,
          },
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user.user;
      }

      return session;
    },
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};
