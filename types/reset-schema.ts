import { z } from "zod";

export const ResetSchema = z.object({
  email: z.string().email({ message: "이메일 형식으로 입력해주세요." }),
});

export type zResetSchema = z.infer<typeof ResetSchema>;
