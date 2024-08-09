"use server";

import { actionClient } from "@/lib/actionClient";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "이메일 또는 비밀번호를 확인해주세요." };
      }

      if (!existingUser) {
        return { error: "이메일 또는 비밀번호를 확인해주세요." };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "인증번호를 이메일로 보냈습니다." };
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: true };
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "이메일 또는 비밀번호를 확인해주세요" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Something Wrong Error" };
        }
      }
      throw error;
    }
  });
