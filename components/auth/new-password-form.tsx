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
import Link from "next/link";
import {
  NewPasswordSchema,
  zNewPasswordSchema,
} from "@/types/new-password-schema";
import { newPasswordAction } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

const NewPasswordForm = () => {
  const token = useSearchParams().get("token");

  const form = useForm<zNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token: "",
    },
    mode: "onChange",
  });
  useAction;

  const { execute, isExecuting } = useAction(newPasswordAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: data.success,
          description: "다시 로그인해주세요.",
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

  const onSubmit = (values: zNewPasswordSchema) => {
    execute({ password: values.password, token });
  };

  return (
    <AuthCard
      cardTitle="비밀번호를 변경하세요!"
      backButtonHref="/auth/login"
      backButtonlabel="이미 아이디가 있으신가요?"
      showSocial
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      {...field}
                      type="password"
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
              {isExecuting ? "비밀번호 변경중..." : "비밀번호 변경"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default NewPasswordForm;
