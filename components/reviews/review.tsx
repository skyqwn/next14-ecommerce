"use client";

import { ReviewsWithUser } from "@/types/infer-type";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import Stars from "./stars";

const Review = ({ reviews }: { reviews: ReviewsWithUser[] }) => {
  return (
    <motion.div className=" flex flex-col gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex gap-2 items-center">
            <Image
              className="rounded-full"
              width={32}
              height={32}
              alt={review.user.name!}
              src={review.user.image!}
            />
            <div>
              <p className="text-sm font-bold">{review.user.name}</p>
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
                <p className="text-xs text-bold text-muted-foreground">
                  {formatDate(review.created!)}
                </p>
              </div>
            </div>
          </div>
          <p className="py-2 font-medium">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
};

export default Review;
