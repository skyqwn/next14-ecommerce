"use client";

import AuthCard from "./auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

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
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { RegisterSchema, zRegisterSchema } from "@/types/register-schema";
import { emailRegisterAction } from "@/server/actions/email-register";
import Link from "next/link";

const RegisterForm = () => {
  const form = useForm<zRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  useAction;

  const { execute, isExecuting } = useAction(emailRegisterAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: "회원가입 성공🎉",
          description: data.success,
        });
      }
      if (data?.error) {
        toast({
          variant: "destructive",
          title: "회원가입 실패",
          description: data.error,
        });
      }
    },
  });

  const onSubmit = (values: zRegisterSchema) => {
    execute(values);
  };
  return (
    <AuthCard
      cardTitle="회원가입을 해주세요!"
      backButtonHref="/auth/login"
      backButtonlabel="이미 아이디가 있으신가요?"
      showSocial
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kim Lee"
                      {...field}
                      type="text"
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              {isExecuting ? "회원가입중..." : "회원가입"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default RegisterForm;
