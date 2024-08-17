"use client";

import { ProductSchema, zProductSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaWonSign } from "react-icons/fa";
import Tiptap from "./tiptap";
import { useAction } from "next-safe-action/hooks";
import { createProductAction } from "@/server/actions/create-product";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";

const ProductForm = () => {
  const { toast } = useToast();
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (editMode) {
      const { error, success, product } = await getProduct(id);
      if (error) {
        toast({
          variant: "destructive",
          title: error,
        });
        return router.push("/dashboard/products");
      }
      if (success) {
        const id = Number(editMode);
        form.setValue("title", product.title);
        form.setValue("description", product.description);
        form.setValue("price", product.price);
        form.setValue("id", id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(Number(editMode));
    }
  }, []);

  const { isExecuting, execute } = useAction(createProductAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: data.success,
        });
        router.push(`/dashboard/products`);
      }
    },
  });

  const onSubmit = (values: zProductSchema) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "상품수정" : "상품등록"}</CardTitle>
        <CardDescription>
          {editMode
            ? "상품에 대한 정보를 입력해주세요."
            : "상품에 대한 정보를 수정해주세요."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품명</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isExecuting}
                      placeholder="스프라이트 셔츠"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품설명</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품가격</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <FaWonSign
                        size={34}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        disabled={isExecuting}
                        type="number"
                        placeholder="100,000"
                        {...field}
                        step="1000"
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isExecuting} className="w-full" type="submit">
              {editMode ? "수정하기" : "등록하기"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
