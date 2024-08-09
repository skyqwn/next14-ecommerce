"use server";

import { actionClient } from "@/lib/actionClient";
import { RegisterSchema } from "@/types/register-schema";
import bcrypt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      console.log(existingUser);

      if (existingUser) {
        if (!existingUser.emailVerified) {
          const verificationToken = await generateEmailVerificationToken(email);
          await sendVerificationEmail(
            verificationToken[0].email,
            verificationToken[0].token
          );

          return { success: "이메일 인증번호를 보냈습니다." };
        }
        return { error: "이미 가입된 이메일입니다." };
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
      });

      const verificationToken = await generateEmailVerificationToken(email);

      await sendVerificationEmail(
        verificationToken[0].email,
        verificationToken[0].token
      );

      return { success: "인증번호를 가입된 이메일로 전송하였습니다." };
    } catch (error) {
      console.log(error);
    }
  });
