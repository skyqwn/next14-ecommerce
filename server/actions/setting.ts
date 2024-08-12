"use server";

import { actionClient } from "@/lib/actionClient";
import { SettingsSchema } from "@/types/settings-schema";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export const settingsAction = actionClient
  .schema(SettingsSchema)
  .action(
    async ({
      parsedInput: {
        email,
        image,
        isTwoFactorEnabled,
        name,
        newPassword,
        password,
      },
    }) => {
      const user = await auth();
      if (!user) {
        return { error: "존재하지 않는 유저입니다." };
      }
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id),
      });

      if (!dbUser) {
        return { error: "존재하지 않는 유저입니다." };
      }

      if (user.user.isOAuth) {
        email = undefined;
        password = undefined;
        newPassword = undefined;
        isTwoFactorEnabled = undefined;
      }

      if (password && newPassword && dbUser.password) {
        const passwordChecked = await bcrypt.compare(password, dbUser.password);
        if (!passwordChecked) {
          return { error: "기존 비밀번호를 잘못입력하셨습니다." };
        }

        const samePassword = await bcrypt.compare(newPassword, dbUser.password);
        if (samePassword) {
          return { error: "기존의 비밀번호와 다른 비밀번호를 설정해주세요." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        password = hashedPassword;
        newPassword = undefined;
      }
      const updateUser = await db
        .update(users)
        .set({
          twoFactorEnabled: isTwoFactorEnabled,
          name,
          password,
          email,
          image,
        })
        .where(eq(users.id, dbUser.id))
        .returning();
      revalidatePath("/dashboard/settings");
      return { success: "유저정보를 업데이트하였습니다." };
    }
  );
