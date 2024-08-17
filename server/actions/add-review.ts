"use server";

import { actionClient } from "@/lib/actionClient";
import { reviewsSchema } from "@/types/reviews-schema";
import { auth } from "../auth";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

export const addReviewAction = actionClient
  .schema(reviewsSchema)
  .action(async ({ parsedInput: { comment, rating, productId } }) => {
    try {
      const session = await auth();
      if (!session) return { error: "로그인을 해주세요" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, productId),
          eq(reviews.userId, session.user.id)
        ),
      });
      if (reviewExists) {
        return { error: "이미 이제품엔 리뷰를 남겼습니다." };
      }
      const newReview = await db
        .insert(reviews)
        .values({
          productId,
          comment,
          rating,
          userId: session.user.id,
        })
        .returning();
      revalidatePath(`/product/${productId}`);
      return { success: "리뷰 생성을 성공하였습니다.", newReview };
    } catch (error) {
      console.log(error);
      return { error: "리뷰를 생성하는데 실패하였습니다. 다시 시도해주세요." };
    }
  });
