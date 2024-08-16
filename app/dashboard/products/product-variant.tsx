"use client";

import { VariantsWithImagesTags } from "@/types/infer-type";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VariantSchema, zVariantSchema } from "@/types/variant-schema";

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
import InputTags from "./input-tags";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { createVariant } from "@/server/actions/create-variant";
import { forwardRef, useEffect, useState } from "react";
import { deleteVariant } from "@/server/actions/delete-variant";

interface ProductVariantProps {
  children: React.ReactNode;
  editMode: boolean;
  productId?: number;
  variant?: VariantsWithImagesTags;
}

const ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  ({ editMode, productId, variant, children }, ref) => {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const form = useForm<zVariantSchema>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        variantImages: [],
        color: "#000000",
        editMode,
        id: undefined,
        productId,
        productType: "나이키 신발",
      },
    });

    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }
      if (editMode && variant) {
        form.setValue("editMode", true);
        form.setValue("id", variant.id);
        form.setValue("productId", variant.productId);
        form.setValue("productType", variant.productType);
        form.setValue("color", variant.color);
        form.setValue(
          "tags",
          variant.variantTags.map((tag) => tag.tag)
        );
        form.setValue(
          "variantImages",
          variant.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          }))
        );
      }
    };

    useEffect(() => {
      setEdit();
    }, []);

    const { execute, isExecuting } = useAction(createVariant, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast({
            variant: "default",
            title: data.success,
          });
          setOpen(false);
        }
        if (data?.error) {
          toast({
            variant: "destructive",
            title: data.error,
          });
        }
      },
    });

    const variantAction = useAction(deleteVariant, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast({
            variant: "default",
            title: data.success,
          });
          setOpen(false);
        }
        if (data?.error) {
          toast({
            variant: "destructive",
            title: data.error,
          });
        }
      },
    });

    const onSubmit = (values: zVariantSchema) => {
      execute(values);
    };

    return (
      <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px] rounded-md">
          <DialogHeader>
            <DialogTitle>{editMode ? "수정" : "등록"} 상품 상세</DialogTitle>
            <DialogDescription>
              상품 이미지와 태그를 등록해보세요
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pick a title for your variant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Tags</FormLabel>
                    <FormControl>
                      <InputTags
                        {...field}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />
              <div className="flex gap-4 items-center justify-end">
                {editMode && variant && (
                  <Button
                    disabled={variantAction.isExecuting}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      variantAction.execute({ id: variant.id });
                    }}
                    variant={"destructive"}
                  >
                    삭제
                  </Button>
                )}
                <Button
                  disabled={
                    isExecuting ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                  type="submit"
                >
                  {editMode ? "변경" : "등록"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
ProductVariant.displayName = "ProductVariant";

export default ProductVariant;
