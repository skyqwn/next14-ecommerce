"use server";

import { actionClient } from "@/lib/actionClient";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "이메일 또는 비밀번호를 확인해주세요." };
    }

    // if(!existingUser.emailVerified){}

    if (!existingUser) {
      return { error: "이메일 또는 비밀번호를 확인해주세요." };
    }

    return { success: true };
  });
