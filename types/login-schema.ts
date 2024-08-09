import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "이메일 형식으로 입력해주세요." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상으로 입력해주세요." })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/, {
      message:
        "적어도 하나의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수문자를 입력해주세요",
    }),
  code: z.optional(z.string()),
});

export type zLoginSchema = z.infer<typeof LoginSchema>;
