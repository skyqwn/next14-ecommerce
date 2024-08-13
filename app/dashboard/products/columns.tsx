"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

type ProductColumn = {
  title: string;
  price: number;
  image: string;
  variants: any;
  id: number;
};

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  const { toast } = useToast();
  const { execute, isExecuting } = useAction(deleteProduct, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: "제품등록 성공! 🎉",
          description: data?.success,
        });
      }
      if (data?.error) {
        toast({
          variant: "destructive",
          title: "제품등록 실패!",
          description: data.error,
        });
      }
    },
    onExecute: () => {
      toast({
        variant: "default",
        title: "제품을 삭제중입니다...",
      });
    },
  });
  const product = row.original;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="size-8 p-0">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (window.confirm("정말 삭제하시겠습니까?")) {
              return execute({ id: product.id });
            }
            return null;
          }}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "상품명",
  },
  {
    accessorKey: "variants",
    header: "Variants",
  },
  {
    accessorKey: "price",
    header: "가격",
    cell: ({ row }) => {
      const price = Number(row.getValue("price"));
      const formatted = new Intl.NumberFormat("ko-KR", {
        currency: "KRW",
        style: "currency",
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "사진",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <div className="">
          <Image
            src={cellImage}
            alt={cellTitle}
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ActionCell,
  },
];
