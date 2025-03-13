import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
  error?: string;
  status?: number;
}

/**
 * HTTP状态码错误处理器
 * @param status HTTP状态码
 * @param errorData 错误数据对象
 */
export const handleHttpError = (status: number, errorData?: ErrorResponse): void => {
  // 获取错误消息，优先使用服务器返回的错误信息
  const errorMessage = errorData?.message || errorData?.error;

  // 根据状态码范围处理不同类型的错误
  if (status >= 400 && status < 500) {
    // 4xx: 客户端错误
    switch (status) {
      case 400:
        toast.error(errorMessage || "请求参数错误，请检查输入");
        break;
      case 401:
        toast.error(errorMessage || "未授权，请先登录");
        // 可以在这里添加重定向到登录页面的逻辑
        break;
      case 403:
        toast.error(errorMessage || "权限不足，无法访问该资源");
        break;
      case 404:
        toast.error(errorMessage || "请求的资源不存在");
        break;
      case 429:
        toast.error(errorMessage || "请求过于频繁，请稍后再试");
        break;
      default:
        toast.error(errorMessage || `客户端错误 (${status})`);
        break;
    }
  } else if (status >= 500) {
    // 5xx: 服务器错误
    switch (status) {
      case 500:
        toast.error(errorMessage || "服务器内部错误");
        break;
      case 502:
        toast.error(errorMessage || "网关错误");
        break;
      case 503:
        toast.error(errorMessage || "服务暂时不可用，请稍后再试");
        break;
      case 504:
        toast.error(errorMessage || "网关超时");
        break;
      default:
        toast.error(errorMessage || `服务器错误 (${status})`);
        break;
    }
  } else if (status >= 300 && status < 400) {
    // 3xx: 重定向
    // 通常3xx由浏览器自动处理，但如果需要可以添加处理逻辑
    toast.error(errorMessage || `重定向错误 (${status})`);
  } else {
    // 其他状态码
    toast.error(errorMessage || `未知错误 (${status})`);
  }
  // 记录错误到控制台，便于调试
  // console.error(`HTTP错误 ${status}:`, errorData);
};

/**
 * 网络错误处理器
 * @param error 错误对象
 */
export const handleNetworkError = (error: Error): void => {
  toast.error("网络连接失败，请检查您的网络连接");
  console.error("网络错误:", error);
};

/**
 * 通用错误处理器
 * @param error 错误对象或状态码
 * @param errorData 错误数据对象
 */
export const errorHandler = (error: Error | number, errorData?: ErrorResponse, url?: string): void => {
  console.log("errorHandler：", url);

  if (typeof error === "number") {
    // 处理HTTP状态码错误
    handleHttpError(error, errorData);
  } else {
    // 处理网络错误或其他JavaScript错误
    handleNetworkError(error);
  }
};

export default errorHandler;
