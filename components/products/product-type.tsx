"use client";

import { VariantsWithImagesTags } from "@/types/infer-type";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const ProductType = ({ variants }: { variants: VariantsWithImagesTags[] }) => {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || variants[0].productType;
  return variants.map((variant) => {
    if (variant.productType === selectedType) {
      return (
        <motion.div
          key={variant.id}
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: 4, opacity: 0 }}
          className="text-secondary-foreground font-medium"
        >
          {selectedType}
        </motion.div>
      );
    }
  });
};

export default ProductType;
