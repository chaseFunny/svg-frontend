"use client";

import { useLeavePageConfirm } from "@/hooks/useLeavePageConfirm";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getSvgVersions, updateSvgVersion } from "../actions";

export default function EditPage() {
  return (
    <Suspense fallback={<EditPageLoading />}>
      <EditPageContent />
    </Suspense>
  );
}

function EditPageLoading() {
  return (
    <div className="editor-container h-[calc(100vh-100px)]">
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">正在加载编辑器...</p>
        </div>
      </div>
    </div>
  );
}

function EditPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [svgVersions, setSvgVersions] = useState<typeVersionData[]>([]);
  const versionIdRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const searchParams = useSearchParams();
  const version = Number(searchParams.get("version") ?? 0);
  useLeavePageConfirm();

  // 模拟用户ID，实际应用中应从用户会话或认证系统获取
  const userId = 1; // 假设当前用户ID为1

  // 获取 SVG 版本数据
  const fetchSvgVersions = async () => {
    setLoading(true);
    try {
      const versions = await getSvgVersions(id);
      setSvgVersions(
        (versions[0].svgModifyList?.length ?? 0) > 0
          ? (versions[0].svgModifyList as unknown as typeVersionData[])
          : [
              {
                content: versions[0].svgContent,
                timestamp: versions[0].createdAt,
                versionNumber: versions[0].versionNumber,
              },
            ]
      );
      versionIdRef.current = versions[0].id;
    } catch (error) {
      console.error("获取SVG版本失败:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSvgVersions();
  }, [id]);

  // 使用 postMessage 向 iframe 传递 SVG 内容
  useEffect(() => {
    if (!loading && svgVersions.length > 0 && svgVersions[version]?.content && iframeRef.current) {
      // 确保 iframe 已加载完成
      const handleIframeLoad = () => {
        // 发送 SVG 内容给 iframe
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "svg-content",
            content: svgVersions[version].content,
          },
          "*"
        );
      };

      // 添加 load 事件监听器
      const iframe = iframeRef.current;
      iframe.addEventListener("load", handleIframeLoad);

      return () => {
        iframe.removeEventListener("load", handleIframeLoad);
      };
    }
  }, [loading, svgVersions]);

  // 监听来自 iframe 的消息
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // 确保消息来源是我们的 iframe
      if (event.source === iframeRef.current?.contentWindow) {
        const { type, content } = event.data;

        // 如果收到更新的 SVG 内容
        if (type === "update-svg" && content && versionIdRef.current) {
          // 将 width 和 height 属性转换为 viewBox
          const modifiedContent = content.replace(
            /<svg\s+([^>]*?)width="(\d+)"\s+height="(\d+)"([^>]*?)>/i,
            (match: any, prefix: any, width: any, height: any, suffix: any) => {
              return `<svg ${prefix}viewBox="0 0 ${width} ${height}"${suffix}>`;
            }
          );
          try {
            // 使用 updateSvgVersion action 保存更新的内容
            await updateSvgVersion(String(versionIdRef.current), {
              svgContent: modifiedContent,
              userId: userId,
            });
            // 移除路由查询参数
            router.replace(pathname, { scroll: false });
            toast.success("保存成功");
          } catch (error: AnyIfEmpty) {
            console.error("保存SVG内容失败:", error);
            toast.error("保存失败" + error.message);
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [svgVersions, userId]);

  return (
    <div className="editor-container h-[calc(100vh-100px)]">
      {loading ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {loading ? "正在加载编辑器..." : "正在保存内容..."}
            </p>
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src="http://edit.svgshow.cn/"
          // src="http://127.0.0.1:5500/src/index.html"
          width="100%"
          height="850px"
          style={{ border: "none" }}
          title="SVG 编辑器"
        />
      )}
    </div>
  );
}
