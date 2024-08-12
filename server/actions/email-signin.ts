"use server";

import { actionClient } from "@/lib/actionClient";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "../schema";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const emailSignInAction = actionClient
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

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
          if (!twoFactorToken) {
            return { error: "존재하지 않는 토큰입니다." };
          }
          if (twoFactorToken.token !== code) {
            return { error: "토큰이 동일하지 않습니다." };
          }
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: "토큰이 만료되었습니다." };
          }

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));

          const existingConfirmation = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (existingConfirmation) {
            await db
              .delete(twoFactorTokens)
              .where(eq(twoFactorTokens.email, existingUser.email));
          }
        } else {
          const twoFactorToken = await generateTwoFactorToken(
            existingUser.email
          );
          if (!twoFactorToken) {
            return { error: "토큰 생성에 실패하였습니다." };
          }

          await sendTwoFactorTokenByEmail(
            twoFactorToken[0].email,
            twoFactorToken[0].token
          );
          return {
            twoFactor: "이중인증 토큰을 가입된 이메일로 전송하였습니다.",
          };
        }
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
