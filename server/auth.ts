import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from ".";
import { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { accounts, users } from "./schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;

      const existingAccout = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });

      token.isOAuth = !!existingAccout;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      token.image = existingUser.image;
      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLINET_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const user = await db.query.users.findFirst({
            where: eq(users.email, validatedFields.data.email),
          });

          if (!user || !user.password) return null;
          const checkPassword = await bcrypt.compare(
            validatedFields.data.password,
            user.password
          );

          if (!checkPassword) return null;

          return user;
        }
        return null;
      },
    }),
  ],
});
