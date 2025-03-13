"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 防止在初始加载状态下重定向
    if (!isLoading && !isAuthenticated) {
      // 将当前路径添加到查询参数，以便登录后重定向回来
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // 显示加载状态或未认证状态
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex sm:min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
