"use client";

import { copyToClipboard, getNameInitial } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Gift, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UserNav() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  if (!isAuthenticated) {
    // 未登录状态显示默认头像和登录选项
    return (
      <Link href="/login">
        <Avatar className="cursor-pointer">
          <AvatarFallback className="bg-gray-100 text-gray-500">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </Link>
    );
  }

  // 已登录状态显示用户头像和下拉菜单
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary/30 transition">
          {/* {user?.avatar && <AvatarImage src={user.avatar} alt={user.username} />} */}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getNameInitial(user?.username)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm">{user?.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <div
            onClick={() => {
              const baseUrl = window.location.origin;
              copyToClipboard(`${baseUrl}/register?inviteCode=${user?.id}`);
            }}
          >
            <Gift className="mr-2 h-4 w-4" />
            <span>邀请得生成次数</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/generate">
            <User className="mr-2 h-4 w-4" />
            <span>我的生成</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>个人主页</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
