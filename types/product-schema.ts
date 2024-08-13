import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(2, { message: "상품명은 2글자 이상으로 입력해주세요." }),
  description: z
    .string()
    .min(30, { message: "상품설명은 30글자 이상으로 입력해주세요." }),
  price: z.coerce
    .number({ invalid_type_error: "가격의 값은 숫자로만 입력해주세요." })
    .positive({ message: "가격은 양수로만 입력할수있습니다." }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;
