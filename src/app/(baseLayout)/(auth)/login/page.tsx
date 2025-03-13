"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  // const

  const handleLogin = async (data: API.LoginDto) => {
    try {
      await login(data);
      toast.success("登录成功！");
      router.push("/");
    } catch (error: unknown) {
      console.error("登录失败:", error);
    }
  };

  return (
    <div className="flex sm:min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">登录</h1>
          <p className="mt-2 text-sm text-gray-600">输入您的账号信息登录系统</p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

        <div className="mt-4 text-center text-sm">
          <p>
            还没有账号？{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
