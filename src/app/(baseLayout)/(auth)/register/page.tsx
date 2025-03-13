"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterPageLoading />}>
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageLoading() {
  return (
    <div className="flex sm:min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">注册账号</h1>
          <p className="mt-2 text-sm text-gray-600">加载中...</p>
        </div>
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

function RegisterPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const register = useAuthStore((state) => state.register);
  useEffect(() => {
    const inviteCode = searchParams.get("inviteCode");
    if (inviteCode) {
      localStorage.setItem("inviteCode", inviteCode);
    }
  }, [searchParams]);
  const handleRegister = async (data: API.RegisterDto) => {
    setIsLoading(true);
    try {
      await register(data);
      toast.success("注册成功！");
      router.push("/");
    } catch (error) {
      console.error("注册失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex sm:min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">注册账号</h1>
          <p className="mt-2 text-sm text-gray-600">创建您的账号以使用系统功能</p>
        </div>

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

        <div className="mt-4 text-center text-sm">
          <p>
            已有账号？{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
