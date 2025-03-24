"use client";

import { onCleanSvgContent } from "@/lib/formatSvg";
import { extractSvgContent } from "@/lib/utils";
import { svgGeneratorControllerGetVersions } from "@/services/svg/svgGenerations";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

interface SvgPreviewProps {
  generationId: number;
}

export function SvgPreview({ generationId }: SvgPreviewProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取最新版本
  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        setLoading(true);
        const versions = await svgGeneratorControllerGetVersions({
          id: generationId.toString(),
        });

        // 如果有版本数据，取最新的一个
        if (versions && versions.length > 0) {
          // 按版本号排序
          const latestVersion = versions.sort((a, b) => b.versionNumber - a.versionNumber)[0];
          setSvgContent(extractSvgContent(latestVersion?.svgContent));
        }
      } catch (error) {
        console.error("获取 SVG 预览失败：", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVersion();
  }, [generationId]);

  // 安全处理 SVG 内容
  const sanitizeSvg = (svgContent: string) => {
    return DOMPurify.sanitize(svgContent, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "defs", "title", "desc"],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-secondary/30 rounded-md animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 border-2 border-primary/50 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-secondary/20 rounded-md border border-dashed border-muted-foreground/30">
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <svg
            className="w-8 h-8 text-muted-foreground/70"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-sm text-muted-foreground">预览不可用</p>
          <p className="text-xs text-muted-foreground/70">无法加载 SVG 内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[120px] bg-muted rounded-md flex items-center justify-center overflow-hidden">
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeSvg(onCleanSvgContent(svgContent)) }}
        className="w-full h-auto p-2"
      />
    </div>
  );
}
