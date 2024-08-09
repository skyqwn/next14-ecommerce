"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { newVerification } from "@/server/actions/tokens";
import { useCallback, useEffect } from "react";
import AuthCard from "./auth-card";

const EmailVerificationForm = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const { toast } = useToast();

  const handleVerification = useCallback(() => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "토큰이 존재하지 않습니다. 다시 시도해주세요",
      });
      return router.push("/auth/login");
    }
    newVerification(token).then((data) => {
      if (data.error) {
        toast({
          variant: "destructive",
          title: data.error,
        });
        router.push("/auth/login");
      }
      if (data.success) {
        toast({
          variant: "default",
          title: `${data.success}`,
        });
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      backButtonlabel="로그인으로 돌아가기"
      backButtonHref="/auth/login"
      cardTitle="계정 인증하기"
    >
      <div className="flex items-center justify-center flex-col w-full">
        <p className="animate-pulse">이메일 인증중...</p>
      </div>
    </AuthCard>
  );
};

export default EmailVerificationForm;
