"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  totalReviews?: number;
  size?: number;
}

const Stars = ({ rating, totalReviews, size = 14 }: StarsProps) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          size={size}
          key={star}
          className={cn(
            "text-primary bg-transparent trasition-all duration300 ease-in-out",
            rating >= star ? "fill-primary" : "fill-transparent"
          )}
        >
          <span className="text-secondary-foreground font-bold text-sm ml-2">
            {totalReviews} 리뷰
          </span>
        </Star>
      ))}
    </div>
  );
};

export default Stars;
