"use client";

import { DownloadButton } from "@/components/download-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleContent } from "@/components/ui/collapsible-content";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { copyToClipboard, extractSvgContent } from "@/lib/utils";
import { svgGeneratorControllerGetVersions } from "@/services/svg/svgGenerations";
import DOMPurify from "dompurify";
import { ArrowLeftIcon, CopyIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GenerationVersionsProps {
  generation: API.SvgGenerationWithVersionData;
  onClose: () => void;
}

export function GenerationVersions({ generation, onClose }: GenerationVersionsProps) {
  const [data, setData] = useState<API.SvgVersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<typeVersionData | null>(null);
  const defaultVersionRef = useRef<typeVersionData | null>(null);
  // 获取版本历史
  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await svgGeneratorControllerGetVersions({
        id: generation?.id?.toString(),
      });
      setData(data?.[0]);
      if (data.length > 0) {
        const defaultData = {
          content: extractSvgContent(data[0].svgContent),
          timestamp: data[0].createdAt,
          versionNumber: 1,
        };
        defaultVersionRef.current = defaultData;
        setSelectedVersion(defaultData);
      }
    } catch (error) {
      console.error("获取版本历史失败：", error);
      toast.error("获取版本历史失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (generation?.id) {
      fetchVersions();
    }
  }, [generation?.id]);

  // 安全处理 SVG 内容
  const sanitizeSvg = (svgContent: string) => {
    return DOMPurify.sanitize(svgContent, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "defs", "title", "desc"],
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }
  const total = (data?.svgModifyList?.length ?? 0) + 1;
  if (total === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Button title="返回" variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <h3 className="font-medium">版本历史</h3>
        </div>
        <p className="text-muted-foreground text-center py-8">暂无版本记录</p>
      </div>
    );
  }
  const renderData = defaultVersionRef.current
    ? [defaultVersionRef.current, ...(data?.svgModifyList ?? [])]
    : data?.svgModifyList;
  return (
    <div className="p-4">
      <div className="flex  items-center mb-4">
        <Button title="返回" variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <h3 className="font-medium">版本历史 (共 {total} 个版本)</h3>
      </div>

      {/* 提示词 */}
      {generation?.inputContent && (
        <Card className="my-3 border-none shadow-sm relative">
          {/* 绝对定位在右上角的复制按钮 */}
          <div className="absolute -top-1 right-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(generation?.inputContent);
              }}
              title="复制提示词"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <CollapsibleContent
            title={`${generation?.inputContent}`}
            className="flex-1 border-none"
            titleClassName="py-1"
          >
            <MarkdownRenderer content={generation?.inputContent} className="mt-2 border-t pt-2" />
          </CollapsibleContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2">
          {renderData?.map((version: AnyIfEmpty, idx: number) => (
            <div
              key={version.timestamp}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
                selectedVersion?.versionNumber === idx + 1 ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
              }`}
              onClick={() => setSelectedVersion({ ...(version ?? {}), versionNumber: idx + 1 })}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">版本 {idx + 1}</span>
                <span className="text-xs text-muted-foreground">
                  {idx + 1 === renderData.length ? "AI 生成" : "手动编辑"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{new Date(version.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {selectedVersion && (
            <Card className="p-4 h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">版本 {selectedVersion.versionNumber} 预览</h4>
                  <div className="flex items-center gap-2">
                    <DownloadButton svgContent={extractSvgContent(selectedVersion.content)} />
                    <Link href={`/editor/${generation?.id}?version=${selectedVersion.versionNumber - 1}`}>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        编辑
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-muted rounded-md p-4 flex-grow overflow-hidden flex items-center justify-center">
                  <div
                    dangerouslySetInnerHTML={{ __html: extractSvgContent(sanitizeSvg(selectedVersion.content)) }}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
