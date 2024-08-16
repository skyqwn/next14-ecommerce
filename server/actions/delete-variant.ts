"use server";

import { actionClient } from "@/lib/actionClient";
import { DeleteVariantSchema } from "@/types/delete-variant-schema";
import { z } from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliaClient } from "@/lib/algoliaIndex";

const algoliaIndex = algoliaClient.initIndex("products");

export const deleteVariant = actionClient
  .schema(DeleteVariantSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deleteVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("/dashboard/products");

      algoliaIndex.deleteObject(deleteVariant[0].id.toString());
      return { success: `${deleteVariant[0].productType}을 삭제하였습니다.` };
    } catch (error) {
      return { error: "삭제하는데 실패하였습니다." };
    }
  });
