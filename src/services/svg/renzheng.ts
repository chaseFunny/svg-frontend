// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** 用户登录 POST /api/v1/auth/login */
export async function authControllerLogin(
  body: API.LoginDto,
  options?: { [key: string]: any }
) {
  return request<API.AuthResponseDto>("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户退出登录 POST /api/v1/auth/logout */
export async function authControllerLogout(options?: { [key: string]: any }) {
  return request<{ success?: boolean; message?: string }>(
    "/api/v1/auth/logout",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** 获取当前登录用户信息 GET /api/v1/auth/me */
export async function authControllerGetCurrentUser(options?: {
  [key: string]: any;
}) {
  return request<API.UserData>("/api/v1/auth/me", {
    method: "GET",
    ...(options || {}),
  });
}

/** 用户注册 POST /api/v1/auth/register */
export async function authControllerRegister(
  body: API.RegisterDto,
  options?: { [key: string]: any }
) {
  return request<API.AuthResponseDto>("/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送邮箱验证码 POST /api/v1/auth/verification-code */
export async function authControllerSendVerificationCode(
  body: API.SendVerificationCodeDto,
  options?: { [key: string]: any }
) {
  return request<boolean>("/api/v1/auth/verification-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 验证邮箱验证码 POST /api/v1/auth/verify-email */
export async function authControllerVerifyEmail(
  body: API.VerifyEmailDto,
  options?: { [key: string]: any }
) {
  return request<boolean>("/api/v1/auth/verify-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
