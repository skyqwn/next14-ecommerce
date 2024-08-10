"use client";

import AuthCard from "./auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

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
import { emailSignInAction } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResetSchema, zResetSchema } from "@/types/reset-schema";
import { resetPasswordAction } from "@/server/actions/password-reset";

const ResetForm = () => {
  const router = useRouter();
  const form = useForm<zResetSchema>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  useAction;

  const { execute, isExecuting } = useAction(resetPasswordAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: data.success,
          description: "이메일 확인하여 다음 단계를 확인해주세요.",
        });
      }
      if (data?.error) {
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: data.error,
        });
      }
    },
  });

  const onSubmit = (values: zResetSchema) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="비밀번호를 잃어버리셨나요?"
      backButtonHref="/auth/login"
      backButtonlabel="이미 아이디가 있으신가요?"
      showSocial
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gamil.com"
                      {...field}
                      type="email"
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button size={"sm"} className="px-0" variant={"link"}>
              <Link href={"/auth/reset"}>비밀번호를 잊어버리셨나요?</Link>
            </Button>
            <Button
              className={cn("w-full mt-5", isExecuting && "animate-pulse")}
              type="submit"
            >
              {isExecuting ? "이메일 확인중..." : "확인"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default ResetForm;
