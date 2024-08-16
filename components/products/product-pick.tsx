"use client";

import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

interface ProductPickProps {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productId: number;
  image: string;
}

const ProductPick = ({
  id,
  color,
  productType,
  title,
  price,
  productId,
  image,
}: ProductPickProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seletedColor = searchParams.get("type" || productType);
  return (
    <div
      style={{ background: color }}
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:opacity-75",
        seletedColor === productType ? "opacity-100" : "opacity-50"
      )}
      onClick={() => {
        router.push(
          `/products/${id}?id=${id}&productId=${productId}&price=${price}&title=${title}&type=${productType}&image=${image}`,
          { scroll: false }
        );
      }}
    ></div>
  );
};

export default ProductPick;
