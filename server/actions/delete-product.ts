"use server";

import { actionClient } from "@/lib/actionClient";
import { DeleteProductSchema } from "@/types/deleteProduct-schema";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteProduct = actionClient
  .schema(DeleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      return { success: `${data[0].title}을 삭제하였습니다` };
    } catch (error) {
      return { error: "제품 삭제에 실패하였습니다." };
    }
  });
