"use client";

import { authControllerSendVerificationCode } from "@/services/svg/renzheng";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface RegisterFormProps {
  onSubmit: (data: API.RegisterDto) => void;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [formData, setFormData] = useState<API.RegisterDto & { confirmPassword: string }>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerSchema = z
    .object({
      username: z.string().min(3, "用户名至少需要3个字符"),
      email: z.string().email("请输入有效的邮箱地址"),
      password: z.string().min(6, "密码至少需要6个字符"),
      confirmPassword: z.string().min(6, "确认密码至少需要6个字符"),
      verificationCode: z.string().min(4, "请输入验证码"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "两次输入的密码不一致",
      path: ["confirmPassword"],
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSendCode = async () => {
    // 验证邮箱
    if (!z.string().email().safeParse(formData.email).success) {
      setErrors((prev) => ({
        ...prev,
        email: "请输入有效的邮箱地址",
      }));
      return;
    }

    setSendingCode(true);
    try {
      await authControllerSendVerificationCode({ email: formData.email });
      setCodeSent(true);
      toast.success("验证码已发送，请查收邮件");

      // 启动倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("发送验证码失败:", error);
    } finally {
      setSendingCode(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = registerSchema.parse(formData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = validatedData;
      onSubmit(registerData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          用户名
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading || codeSent}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="verificationCode" className="block text-sm font-medium">
          验证码
        </label>
        <div className="flex gap-2">
          <input
            id="verificationCode"
            name="verificationCode"
            type="text"
            value={formData.verificationCode}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sendingCode || countdown > 0 || isLoading || codeSent}
            className="mt-1 whitespace-nowrap rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            {countdown > 0 ? `${countdown}秒后重试` : sendingCode ? "发送中..." : codeSent ? "已发送" : "发送验证码"}
          </button>
        </div>
        {errors.verificationCode && <p className="mt-1 text-sm text-red-600">{errors.verificationCode}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          密码
        </label>
        <div className="relative mt-1">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">{showPassword ? "隐藏密码" : "显示密码"}</span>
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          确认密码
        </label>
        <div className="relative mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">{showConfirmPassword ? "隐藏密码" : "显示密码"}</span>
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {isLoading ? "注册中..." : "注册"}
      </button>
    </form>
  );
}
