import { z } from "zod";

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상으로 입력해주세요." })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/, {
      message:
        "적어도 하나의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수문자를 입력해주세요",
    }),
  token: z.string().nullable().optional(),
});

export type zNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
