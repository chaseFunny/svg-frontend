import errorHandler from "./errorHandler";
import { paramToQueryString } from "./utils";

interface TypeInitOptions {
  // 超时时长
  timeout?: number;
  // 请求前缀
  prefix?: string;
  // 是否获取请求数据源
  getResponse: boolean;
}

interface TypeRequest {
  timeout: number;
  prefix: string;
  getResponse: boolean;
}

// 创建一个请求类，用于封装请求方法
// 1. 参数校验
// 2. 请求拦截器
// 3. 响应拦截器
// 4. 错误处理
// 5. 超时处理，取消请求，请求重试
class Request implements TypeRequest {
  timeout: number;
  prefix: string;
  getResponse: boolean;
  constructor(initOptions: TypeInitOptions) {
    this.timeout = initOptions.timeout || 30000;
    this.prefix = initOptions.prefix || "";
    this.getResponse = initOptions.getResponse || false;
  }

  getAuthToken(): string | null {
    try {
      // 从 localStorage 中获取 auth-storage
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        return authData.state?.token || null;
      }
      return null;
    } catch (error) {
      console.error("获取认证 token 失败:", error);
      return null;
    }
  }
  /** 请求拦截器 */
  private interceptorsRequest({ url, options = {} }: RequestInterceptor): RequestInterceptor {
    const method = options.method?.toUpperCase() || "GET";

    // 设置默认请求头
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    } as Record<string, string>;

    // 添加认证 token
    const token = this.getAuthToken();
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // 处理不同类型的请求
    if (method === "GET" || method === "DELETE") {
      // GET 或 DELETE 请求：参数转为查询字符串
      if (options.params) {
        url = `${url}?${paramToQueryString(options.params)}`;
      }
    } else if (options?.requestType === "form") {
      // 表单请求：修改 Content-Type 并保持 body 为表单数据
      options.headers["Content-Type"] = "application/x-www-form-urlencoded";
      options.body = options.data;
    } else if (options?.requestType === "formData") {
      // FormData 请求：移除 Content-Type 让浏览器自动设置边界
      delete options.headers["Content-Type"];
      options.body = options.data;
    } else {
      // JSON 请求：序列化数据
      if (options.data !== undefined) {
        options.body = JSON.stringify(options.data);
      }
    }

    return {
      url,
      options: {
        ...options,
        method,
        timeout: this.timeout,
      },
    };
  }

  /**
   * 响应拦截器
   */
  private interceptorsResponse<T>(res: Response): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestUrl = res.url;

      if (res.ok) {
        // 处理内容类型
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          // JSON 响应
          return res
            .json()
            .then((data) => resolve(data as T))
            .catch((err) => reject({ message: "解析 JSON 响应失败", url: requestUrl, error: err }));
        } else if (contentType && contentType.includes("text/")) {
          // 文本响应
          return res.text().then((text) => resolve(text as unknown as T));
        } else {
          // 其他类型响应
          return resolve(res as unknown as T);
        }
      } else {
        // 处理错误响应
        res
          .clone()
          .text()
          .then((text) => {
            try {
              const errorData = JSON.parse(text);
              const errorMessage = errorData.message || errorData.error || `请求失败: ${res.status}`;
              errorHandler(res.status, { message: errorMessage, status: res.status }, requestUrl);
              reject({ message: errorMessage, status: res.status, url: requestUrl });
            } catch {
              errorHandler(res.status, { message: `请求失败: ${res.status}`, status: res.status }, requestUrl);
              reject({ message: `请求失败: ${res.status}`, status: res.status, url: requestUrl });
            }
          })
          .catch(() => {
            errorHandler(res.status, { message: `请求失败: ${res.status}`, status: res.status }, requestUrl);
            reject({ message: `请求失败: ${res.status}`, status: res.status, url: requestUrl });
          });
      }
    });
  }
  async httpFactory<T>({ url = "", params = {} }: { url: string; params: TypeOptions }): Promise<T> {
    // 处理 URL 前缀
    if (!url.startsWith("http") && !url.startsWith("/api")) {
      url = "/api" + url;
    }

    const req = this.interceptorsRequest({
      url,
      options: params,
    });

    try {
      const res = await fetch(req.url ?? url, req.options);
      return this.interceptorsResponse<T>(res);
    } catch (error) {
      // 增强错误处理
      const errorMessage = error instanceof Error ? error.message : "网络请求失败";
      console.error("请求失败:", errorMessage, url);
      throw error;
    }
  }

  async request<T>(url: string, params: TypeOptions): Promise<T> {
    return this.httpFactory<T>({ url, params });
  }
}

const requestInstance = Object.freeze(
  new Request({
    timeout: 30000,
    prefix: process.env.API_BASE_URL ?? "http://localhost:3001",
    getResponse: false,
  })
);

export const request = async <T>(url: string, options: TypeOptions): Promise<T> =>
  await requestInstance.request(url, options);
