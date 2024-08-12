"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Session } from "next-auth";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsSchema, zSettingSchema } from "@/types/settings-schema";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { settingsAction } from "@/server/actions/setting";
import { UploadButton } from "@/app/api/uploadthing/upload";

interface SettingsCardProp {
  session: Session;
}

const SettingsCard = ({ session }: SettingsCardProp) => {
  const [avatarUploading, setAvatarUploading] = useState(false);

  const { toast } = useToast();
  const form = useForm<zSettingSchema>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.user?.name || undefined,
      email: session.user?.email || undefined,
      image: session.user?.image || undefined,
      isTwoFactorEnabled: session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const { isExecuting, execute } = useAction(settingsAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: data?.success,
        });
      }
      if (data?.error) {
        toast({
          variant: "destructive",
          title: data.error,
        });
      }
    },
  });

  const onSubmit = (values: zSettingSchema) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={isExecuting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>프로필 사진</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        className="rounded-full size-8"
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        alt={session.user?.name!}
                      />
                    )}
                    <UploadButton
                      appearance={{
                        button:
                          "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-r-none bg-red-500 bg-none after:bg-orange-400",
                      }}
                      className="scale-75 ut:button:ring-primary ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut:button:transition-all ut:button:duration-500 ut-lable:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!);
                        setAvatarUploading(false);
                        return;
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <div>프로필 사진 변경</div>;
                          return <div>업로드중...</div>;
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="User Image"
                      type="hidden"
                      disabled={isExecuting}
                      {...field}
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
                      disabled={isExecuting || session.user.isOAuth}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>변경할 새 비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={isExecuting || session.user.isOAuth}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>계정 이중 인증</FormLabel>
                  <FormDescription>
                    이 기능을 사용할 시 로그인시 이중인증을 하실 수 있습니다.
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={isExecuting || session.user.isOAuth}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">{"업데이트"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
