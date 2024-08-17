"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewsSchema, zReviewSchema } from "@/types/reviews-schema";
import { useAction } from "next-safe-action/hooks";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { addReviewAction } from "@/server/actions/add-review";
import { useToast } from "../ui/use-toast";

const ReviewsForm = () => {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("productId"));
  const { toast } = useToast();

  const form = useForm<zReviewSchema>({
    resolver: zodResolver(reviewsSchema),
    defaultValues: {
      comment: "",
      rating: 0,
      productId,
    },
  });

  const { execute, isExecuting } = useAction(addReviewAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: "리뷰작성을 성공하였습니다.",
        });
      }
      if (data?.error) {
        toast({
          variant: "destructive",
          title: data.error,
        });
      }
    },
  });

  const onSubmit = (values: zReviewSchema) => {
    execute({
      comment: values.comment,
      rating: values.rating,
      productId,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={"secondary"}>
            리뷰 남기기
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>리뷰를 남겨주세요</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="이 제품에 대해 생각하시는 점을 적어주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>별점을 남겨주세요</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="Star Rating" {...field} />
                  </FormControl>
                  <FormMessage />
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div
                          className="reltive cursor-pointer"
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          key={value}
                        >
                          <Star
                            key={value}
                            onClick={() => {
                              form.setValue("rating", value, {
                                shouldValidate: true,
                              });
                            }}
                            className={cn(
                              "text-primary bg-transparent transition-all duration-300 ease-in-out",
                              form.getValues("rating") >= value
                                ? "fill-primary"
                                : "fill-muted"
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={isExecuting} className="w-full" type="submit">
              {isExecuting ? "리뷰저장중..." : "리뷰남기기"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default ReviewsForm;
