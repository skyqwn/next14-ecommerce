"use server";

import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { actionClient } from "@/lib/actionClient";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { getPasswordResetTokenByToken } from "./tokens";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import { db } from "..";

export const newPasswordAction = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);

    if (!token) {
      return { error: "토큰이 존재하지 않습니다." };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return { error: "토큰이 존재하지 않습니다." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: " 토큰의 유효기간이 만료되었습니다." };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "유저가 존재하지 않습니다." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));

      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });

    return { success: "비밀번호가 변경되었습니다." };
  });
