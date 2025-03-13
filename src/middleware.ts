import { isDev } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// 目标 API 地址
const API_BASE_URL = !isDev ? process.env.API_BASE_URL : process.env.API_BASE_URL_DEV;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const targetUrl = new URL(pathname + search, API_BASE_URL);
  console.log(targetUrl.toString(), isDev);

  // 只处理 /api 开头的请求
  if (pathname.startsWith("/api")) {
    // 构建目标 URL
    return NextResponse.rewrite(targetUrl);
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
