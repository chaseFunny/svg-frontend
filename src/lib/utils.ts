import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** window 存在 */
export const hasWindow = typeof window !== "undefined";
/** document 存在 */
export const hasDocument = typeof document !== "undefined";

/**
 * 参数转查询 url
 * @param params
 */
export function paramToQueryString(params: { [key: string]: AnyIfEmpty }) {
  return Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
}

// 获取用户名首字母作为头像
export function getNameInitial(name: string | null | undefined): string {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
}

// 提取SVG内容的工具函数
export function extractSvgContent(svgContent: string): string {
  if (!svgContent || typeof svgContent !== "string") return "";

  // 尝试匹配 ```svg 或 ```xml 或其他可能的代码块格式
  const svgCodeBlockRegex = /```(?:svg|xml)?\s*\n([\s\S]*?)<svg[\s\S]*?<\/svg>[\s\S]*?\n```/i;
  const svgTagRegex = /<svg[\s\S]*?<\/svg>/i;

  const codeBlockMatch = svgContent.match(svgCodeBlockRegex);
  if (codeBlockMatch && codeBlockMatch[1]) {
    // 如果找到代码块，提取其中的 SVG 标签
    const svgTagMatch = svgContent.match(svgTagRegex);
    if (svgTagMatch) {
      return svgTagMatch[0];
    }
  } else {
    // 如果没有找到代码块格式，直接尝试提取 SVG 标签
    const svgTagMatch = svgContent.match(svgTagRegex);
    if (svgTagMatch) {
      return svgTagMatch[0];
    }
  }

  // 如果无法提取，返回原内容
  return svgContent;
}

export function extractErrorMessage(errorString: string) {
  try {
    // 使用正则表达式匹配JSON部分
    const jsonMatch = errorString.match(/\{.*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      // 解析JSON
      const errorObj = JSON.parse(jsonStr);
      // 提取message字段
      return errorObj.error.message;
    }
    return "无法提取错误信息";
  } catch (e: AnyIfEmpty) {
    return "解析错误: " + e.message;
  }
}

// 复制SVG内容
export const copyToClipboard = (svgContent: string) => {
  navigator.clipboard
    .writeText(svgContent)
    .then(() => toast.success("已复制到剪贴板"))
    .catch(() => toast.error("复制失败，请手动复制"));
};

export const isDev = process.env.NODE_ENV === "development";
