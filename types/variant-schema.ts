import * as z from "zod";

export const VariantSchema = z.object({
  productId: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z.string().min(3, { message: "3글자 이상 입력해주세요" }),
  color: z.string().min(3, { message: "3글자 이상 입력해주세요" }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "적어도 하나 이상의 태그를 선택해야합니다." })
    )
    .min(1, { message: "하나의 태크는 입력해주세요  " }),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "이미지를 등록해주시길 바랍니다.",
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
      })
    )
    .min(1, { message: "최소 한장의 사진은 등록해주셔야합니다" }),
});

export type zVariantSchema = z.infer<typeof VariantSchema>;
