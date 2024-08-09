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
import { users } from "./schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
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
