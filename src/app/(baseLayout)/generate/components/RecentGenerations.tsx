"use client";

import { DownloadButton } from "@/components/download-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { copyToClipboard, extractSvgContent } from "@/lib/utils";
import { svgGeneratorControllerFindGenerations } from "@/services/svg/svgGenerations";
import { useAuthStore } from "@/store/useAuthStore";
import DOMPurify from "dompurify";
import { CopyIcon, EyeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { GenerationVersions } from "./GenerationVersions";

export function RecentGenerations() {
  return (
    <Suspense fallback={<RecentGenerationsLoading />}>
      <RecentGenerationsContent />
    </Suspense>
  );
}

function RecentGenerationsLoading() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground">加载中...</p>
      </div>
    </div>
  );
}

function RecentGenerationsContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [generations, setGenerations] = useState<API.SvgGenerationWithVersionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<API.SvgGenerationWithVersionData | null>(null);

  // 分页相关状态
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  // 从 URL 获取当前页码
  const getCurrentPage = (): number => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  };

  // 更新 URL 中的页码参数
  const updatePageParam = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // 获取历史生成记录
  const fetchGenerations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const currentPage = getCurrentPage();
      const response = await svgGeneratorControllerFindGenerations({
        userId: user.id.toString(),
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      // 解构分页响应并更新状态
      const { items, totalPages } = response;
      setGenerations(items);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("获取生成历史失败：", error);
      toast.error("获取生成历史失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, [user?.id, searchParams]);

  // 切换页码
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updatePageParam(newPage);
  };

  // 查看详情
  const viewDetails = (svg: API.SvgGenerationWithVersionData) => {
    setSelectedGeneration(svg);
  };

  // 关闭版本查看
  const closeVersionView = () => {
    setSelectedGeneration(null);
  };

  // 安全处理 SVG 内容
  const sanitizeSvg = (svgContent: string) => {
    return DOMPurify.sanitize(svgContent, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "defs", "title", "desc"],
    });
  };

  if (loading && generations.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">暂无生成记录</p>
      </div>
    );
  }

  // 如果选择了特定生成，显示其版本历史
  if (selectedGeneration !== null) {
    return <GenerationVersions generation={selectedGeneration} onClose={closeVersionView} />;
  }

  const currentPage = getCurrentPage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generations.map((generation) => (
          <Card
            key={generation.id}
            className="flex flex-col overflow-hidden py-0 gap-0"
            onClick={() => viewDetails(generation)}
          >
            <CardContent className="p-2 flex-grow">
              <div className="mb-4 h-90 flex items-center justify-center overflow-hidden bg-secondary/30 rounded-md">
                {generation.latestVersion && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: extractSvgContent(sanitizeSvg(generation.latestVersion?.svgContent)),
                    }}
                    className="w-full h-full flex items-center justify-center"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">提示词：{generation.inputContent}</p>
              <div className="flex justify-between items-center gap-2 flex-wrap w-full">
                <div className="flex items-center gap-2">
                  {generation.style && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md">{generation.style}</span>
                  )}
                  {generation.configuration?.aspectRatio && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md">
                      {generation.configuration?.aspectRatio}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <DownloadButton svgContent={extractSvgContent(generation.latestVersion?.svgContent || "")} />
                  <Link href={`/editor/${generation.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    className="text-gray-400"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewDetails(generation);
                    }}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    className="text-gray-400"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(generation.inputContent);
                    }}
                    title="复制提示词"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <Separator />
          </Card>
        ))}
      </div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1}>
            上一页
          </Button>
          <span className="text-sm">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
