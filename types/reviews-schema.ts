import { z } from "zod";

export const reviewsSchema = z.object({
  productId: z.number(),
  rating: z
    .number()
    .min(1, { message: "1점 이상 별점을 입력하셔야합니다." })
    .max(5, { message: "5점 보다 높은 점수는 할수 없습니다." }),
  comment: z
    .string()
    .min(10, { message: "리뷰작성글은 10글자 이상으로 부탁드립니다." }),
});

export type zReviewSchema = z.infer<typeof reviewsSchema>;
