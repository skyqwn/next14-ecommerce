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
import { LoginSchema, zLoginSchema } from "@/types/login-schema";
import { emailSignIn } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<zLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  useAction;

  const { execute, isExecuting } = useAction(emailSignIn, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: "로그인 성공🎉",
          description: "환영합니다!",
        });
        router.push("/");
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

  const onSubmit = (values: zLoginSchema) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="로그인을 해주세요!"
      backButtonHref="/auth/register"
      backButtonlabel="아이디가 없으신가요?"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={cn("w-full mt-5", isExecuting && "animate-pulse")}
              type="submit"
            >
              {isExecuting ? "로그인중..." : "로그인"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
