// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** 此处后端没有提供注释 GET /api/v1/health */
export async function healthControllerHealthCheck(options?: {
  [key: string]: any;
}) {
  return request<any>("/api/v1/health", {
    method: "GET",
    ...(options || {}),
  });
}
