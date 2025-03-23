"use client";
import { STYLE_OPTIONS } from "@/constants";
import { DEFAULT_ASPECT_RATIO } from "@/constants/aspect-ratios";
import { extractErrorMessage, extractSvgContent } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useSessionStorageState } from "ahooks";
import { useRouter, type ReadonlyURLSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useSvgGenerator(setOpenBuyCard: (open: boolean) => void, searchParams: ReadonlyURLSearchParams) {
  const { user } = useAuthStore();
  // 从 URL 获取选中的风格和比例
  const router = useRouter();
  const urlStyle = searchParams.get("style") || STYLE_OPTIONS[0];
  const urlAspectRatio = searchParams.get("aspectRatio") || DEFAULT_ASPECT_RATIO.ratio;

  // 使用 sessionStorage 存储用户输入
  const [prompt, setPrompt] = useSessionStorageState<string>("svg-prompt", {
    defaultValue: "",
  });
  useEffect(() => {
    if (localStorage.getItem("svg-prompt")) {
      setPrompt(localStorage.getItem("svg-prompt") || "");
    }
  }, [setPrompt]);
  // 生成 id
  const [generateId, setGenerateId] = useState<string>("");

  // 本地状态
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingErrorRef = useRef(false);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);

  // 流式生成状态
  const [streamContent, setStreamContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamComplete, setStreamComplete] = useState(false);
  // 添加 AbortController 引用以支持取消请求
  const abortControllerRef = useRef<AbortController | null>(null);

  // 更新风格选择并存储到 URL
  const setSelectedStyle = useCallback(
    (style: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("style", style);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // 更新尺寸比例并存储到 URL
  const setSelectedAspectRatio = useCallback(
    (aspectRatio: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("aspectRatio", aspectRatio);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  /** 重置所有状态 */
  const resetAllState = useCallback(() => {
    setIsGenerating(false);
    setIsStreaming(false);
    setStreamComplete(false);
    setStreamContent("");
    setGeneratedSvg(null);
    isGeneratingErrorRef.current = false;
    abortControllerRef.current = null;
  }, []);

  // 流式生成 SVG
  const generateSvg = useCallback(
    async (file?: { image?: string; file?: string }, isPro?: boolean) => {
      // 先恢复所有状态
      resetAllState();
      if (!prompt) {
        toast.error("请输入描述内容");
        return;
      }

      setIsGenerating(true);
      setIsStreaming(true);
      setStreamContent("");
      setStreamComplete(false);
      setGeneratedSvg(null);
      isGeneratingErrorRef.current = false;
      // 创建新的 AbortController 实例
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      if (!user?.id) {
        toast.error("请先登录");
        return router.push("/login");
      }
      try {
        const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token;
        const imageData = file?.image ? { image: file.image } : {};
        const fileData = file?.file ? { file: file.file } : {};
        const response = await fetch("/api/v1/svg-generator/generations/stream?userId=" + user?.id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
            "Cache-Control": "no-cache",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            inputContent: prompt,
            style: urlStyle,
            aspectRatio: urlAspectRatio,
            isThinking: isPro ? "thinking" : "base",
            ...imageData,
            ...fileData,
          }),
          // 确保使用正确的流式处理模式
          cache: "no-store",
          signal, // 添加信号用于中断请求
        });

        if (!response.ok) {
          throw new Error(`请求失败：${response.status}`);
        }

        if (!response.body) {
          throw new Error("响应体为空");
        }

        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let receivedData = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          // 按行处理 SSE 数据
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // 保留最后一个不完整的行

          for (const line of lines) {
            if (line.trim() === "") continue;

            if (line.startsWith("data: ")) {
              const jsonStr = line.substring(6); // 去掉"data: "前缀
              // console.log(jsonStr, "jsonStr");

              if (jsonStr === "[DONE]") {
                continue; // 忽略结束标记，我们使用 done 来检测
              }

              try {
                const eventData: {
                  chunk: string;
                  message: string;
                  status: "started" | "streaming" | "completed" | "error";
                  id: number;
                } = JSON.parse(jsonStr);

                if (eventData.status === "error") {
                  isGeneratingErrorRef.current = true;
                  setStreamContent("");
                  if (eventData.message.includes("户没有剩余积分")) {
                    setOpenBuyCard(true);
                  }
                  return toast.error(eventData.id === 17 ? extractErrorMessage(eventData.message) : eventData.message);
                } else if (eventData.chunk && eventData.status === "streaming") {
                  receivedData += eventData.chunk;
                  setStreamContent(receivedData);
                } else if (eventData.status === "completed") {
                  // 流结束
                  setStreamComplete(true);
                  localStorage.removeItem("svg-prompt");
                } else if (eventData.status === "started") {
                  // 流开始
                  setStreamContent(eventData.message);
                  setGenerateId(eventData.id?.toString());
                }
              } catch (error) {
                console.error("解析事件数据失败：", error, jsonStr);
                setStreamContent("");
                if (!isGeneratingErrorRef.current) {
                  isGeneratingErrorRef.current = true;
                  toast.error("解析响应数据失败");
                }
              }
            }
          }
        }

        // 流结束，从完整响应中提取 SVG 内容
        setStreamComplete(true);

        // 提取 SVG 内容
        const svgContent = extractSvgContent(receivedData);
        if (svgContent) {
          setGeneratedSvg(svgContent);
          if (!isGeneratingErrorRef.current) {
            toast.success("SVG 生成成功");
          }
        } else {
          // 如果无法提取有效的 SVG 内容，尝试直接从原始字符串中查找 SVG 标签
          const svgMatch = receivedData.match(/<svg[\s\S]*?<\/svg>/i);
          if (svgMatch) {
            setGeneratedSvg(svgMatch[0]);
            if (!isGeneratingErrorRef.current) {
              toast.success("SVG 生成成功");
            }
          } else {
            toast.error("无法提取有效的 SVG 内容");
          }
        }
      } catch (error) {
        console.error("生成 SVG 时出错：", error);
        toast.error("生成 SVG 失败，请稍后重试");
        setStreamContent("");
      } finally {
        setIsGenerating(false);
        setIsStreaming(false);
      }
    },
    [prompt, urlStyle, urlAspectRatio, user?.id]
  );
  /** 取消生成 */
  const cancelGenerate = useCallback(() => {
    // 取消请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 重置状态
    setIsGenerating(false);
    setIsStreaming(false);
    setStreamComplete(false);

    toast.info("已取消生成");
  }, []);

  // 下载 SVG
  const downloadSvg = useCallback(() => {
    if (!generatedSvg) return;

    const blob = new Blob([generatedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `svg-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SVG 下载成功");
  }, [generatedSvg]);

  useEffect(() => {
    if (streamComplete) {
      setPrompt("");
    }
  }, [streamComplete]);
  return {
    prompt,
    setPrompt,
    selectedStyle: urlStyle,
    setSelectedStyle,
    selectedAspectRatio: urlAspectRatio,
    setSelectedAspectRatio,
    isGenerating,
    generatedSvg,
    generateSvg,
    downloadSvg,
    styleOptions: STYLE_OPTIONS,
    // 流式生成相关状态
    streamContent,
    isStreaming,
    streamComplete,
    cancelGenerate,
    generateId,
    setStreamContent,
  };
}
