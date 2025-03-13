// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIfEmpty = any;

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface DefaultRequestInit {
  params?: { [key: string]: AnyIfEmpty }; // query params
  requestType?: "json" | "form" | "formData";
  data?: { [key: string]: AnyIfEmpty } | AnyIfEmpty; // body data
  timeout?: number;
}
type TypeOptions = RequestInit & DefaultRequestInit;
interface RequestInterceptor {
  url?: string | URL | globalThis.Request;
  options?: RequestInit & DefaultRequestInit;
}

type Config = { next: { revalidate: number } } | { cache: "no-store" } | { cache: "force-cache" };

interface ErrorResponse {
  message?: string;
  error?: string;
  status?: number;
}

interface typeVersionData {
  content: string;
  timestamp: string;
  versionNumber: number;
}
