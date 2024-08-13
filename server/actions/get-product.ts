"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export const getProduct = async (id: number) => {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    if (!product) throw new Error("상품을 찾을 수 없습니다.");
    return { success: `${product.title}을 찾았습니다.`, product };
  } catch (error) {
    return { error: "상품을 불러오는데 실패하였습니다." };
  }
};
