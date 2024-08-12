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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { LoginSchema, zLoginSchema } from "@/types/login-schema";
import { emailSignInAction } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);

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

  const { execute, isExecuting } = useAction(emailSignInAction, {
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
      if (data?.twoFactor) setShowTwoFactor(true);
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
            <div>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>가입된 이메일로 코드를 확인해주세요</FormLabel>
                      <FormControl>
                        <InputOTP
                          disabled={isExecuting}
                          {...field}
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="example@gmail.com"
                            type="email"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="********"
                            type="password"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <Button size={"sm"} className="px-0 mt-4" variant={"link"}>
                <Link href={"/auth/reset"}>비밀번호를 잊어버리셨나요?</Link>
              </Button>
            </div>
            <Button
              className={cn("w-full mt-4", isExecuting && "animate-pulse")}
              type="submit"
            >
              {showTwoFactor ? "인증하기" : "로그인"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
