"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const EmailVerification = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
};
