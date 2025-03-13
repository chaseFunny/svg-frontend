"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BuyCard } from "@/components/buyCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNameInitial } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { CreditCardIcon, MailIcon, UserIcon, ZapIcon } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <ProtectedRoute>
      <div className="container max-w-4xl py-10 px-4 md:py-12 mx-auto">
        <h1 className="text-2xl text-center font-bold mb-6">个人主页</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          {/* 个人资料卡片 */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getNameInitial(user?.username)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user?.username}</h2>
          </div>

          {/* 详细信息 */}
          <Card>
            <CardHeader>
              <CardTitle>账号信息</CardTitle>
              <CardDescription>您的个人账号详细信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">用户名</p>
                  <p>{user?.username || "-"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">邮箱</p>
                  <p>{user?.email || "-"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ZapIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">剩余 AI 生成次数</p>
                  <p>{user?.remainingCredits || 0} 次</p>
                </div>
                <Button size="sm" className="flex items-center gap-1" onClick={() => setIsDialogOpen(true)}>
                  <CreditCardIcon className="h-4 w-4" />
                  充值
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BuyCard open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </ProtectedRoute>
  );
}
