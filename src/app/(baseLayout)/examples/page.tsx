"use client";

import { DownloadButton } from "@/components/download-button";
import { SvgViewer } from "@/components/svgGenerator/components/SvgViewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleContent } from "@/components/ui/collapsible-content";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { copyToClipboard, extractSvgContent } from "@/lib/utils";
import { svgGeneratorControllerFindPublicGenerations } from "@/services/svg/svgGenerations";
import DOMPurify from "dompurify";
import { ArrowRight, Copy, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ExamplesPage() {
  return (
    <Suspense fallback={<ExamplesPageLoading />}>
      <ExamplesPageContent />
    </Suspense>
  );
}

function ExamplesPageLoading() {
  return (
    <div className="container mx-auto px-0 py-2 ">
      <h1 className="text-3xl font-bold mb-8 text-center">SVG 示例展示</h1>
      <div className="flex justify-center items-center h-60">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">加载中，请稍候...</p>
        </div>
      </div>
    </div>
  );
}

function ExamplesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [generations, setGenerations] = useState<API.SvgGenerationWithVersionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedSvg, setSelectedSvg] = useState<API.SvgGenerationWithVersionData | null>(null);

  // 分页相关状态
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  // 从 URL 获取当前页码
  const getCurrentPage = (): number => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  };

  // 获取当前查看的 SVG ID
  const getCurrentSvgId = (): string | null => {
    return searchParams.get("id");
  };

  // 更新 URL 中的页码参数
  const updatePageParam = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    // 如果有 id 参数，需要清除
    if (params.has("id")) {
      params.delete("id");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // 更新 URL 中的 SVG ID 参数
  const updateSvgIdParam = (svgId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", svgId);
    router.push(`?${params.toString()}`, { scroll: true });
  };

  // 获取公共展示示例
  const fetchPublicGenerations = async () => {
    try {
      setLoading(true);
      const currentPage = getCurrentPage();
      const response = await svgGeneratorControllerFindPublicGenerations({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      // 解构分页响应并更新状态
      const { items, totalPages } = response;
      setGenerations(items);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("获取展示示例失败：", error);
      toast.error("获取展示示例失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 根据 ID 获取 SVG 详情
  const fetchSvgById = async (id: string) => {
    try {
      setDetailLoading(true);

      // 修复：遍历所有页面查找 SVG，而不仅仅是当前页
      let svg = null;
      let currentSearchPage = 1;
      const maxSearchPages = 10; // 设置最大搜索页数限制，避免无限循环

      while (!svg && currentSearchPage <= maxSearchPages) {
        const response = await svgGeneratorControllerFindPublicGenerations({
          page: currentSearchPage.toString(),
          pageSize: "20", // 使用适当的页面大小
        });

        svg = response.items.find((item) => item.id.toString() === id);

        // 如果找到了 SVG 或已经搜索完所有页面，则退出循环
        if (svg || currentSearchPage >= response.totalPages) {
          break;
        }

        currentSearchPage++;
      }

      if (svg) {
        setSelectedSvg(svg);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("未找到相应的 SVG");
        backToList();
      }
    } catch (error) {
      console.error("获取 SVG 详情失败：", error);
      toast.error("获取 SVG 详情失败，请稍后重试");
      // 获取失败时，清除 URL 中的 id 参数，返回列表视图
      backToList();
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const svgId = getCurrentSvgId();
    if (svgId) {
      // 先检查生成列表中是否已经有该 SVG
      const existingSvg = generations.find((item) => item.id.toString() === svgId);
      if (existingSvg) {
        setSelectedSvg(existingSvg);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        fetchSvgById(svgId);
      }
    } else {
      setSelectedSvg(null);
      fetchPublicGenerations();
    }
  }, [searchParams]);

  // 切换页码
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updatePageParam(newPage);
  };

  // 返回列表视图
  const backToList = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has("id")) {
      params.delete("id");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  // 查看 SVG 详情
  const viewSvgDetails = (svg: API.SvgGenerationWithVersionData) => {
    updateSvgIdParam(svg.id.toString());
  };

  // 复制 SVG 代码
  const copySvgCode = (svg: API.SvgGenerationWithVersionData, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const svgContent = svg.latestVersion?.svgContent;
    copyToClipboard(extractSvgContent(svgContent));
  };

  // 安全处理 SVG 内容
  const sanitizeSvg = (svgContent: string) => {
    return DOMPurify.sanitize(svgContent, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "defs", "title", "desc"],
    });
  };
  const doSameSvg = (content?: string) => {
    localStorage.setItem("svg-prompt", content || selectedSvg?.inputContent || "");
  };

  // 加载状态
  if (
    (loading && generations.length === 0 && !getCurrentSvgId()) ||
    (detailLoading && !selectedSvg && getCurrentSvgId())
  ) {
    return (
      <div className="container mx-auto px-0 py-2 ">
        <h1 className="text-3xl font-bold mb-8 text-center">SVG 示例展示</h1>
        <div className="flex justify-center items-center h-60">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">加载中，请稍候...</p>
          </div>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (generations.length === 0 && !getCurrentSvgId()) {
    return (
      <div className="container mx-auto px-0 py-2 ">
        <h1 className="text-3xl font-bold mb-8 text-center">SVG 示例展示</h1>
        <div className="flex flex-col justify-center items-center h-60 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
          <Info className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-lg text-muted-foreground mb-2">暂无示例数据</p>
          <p className="text-sm text-muted-foreground/70 mb-6">目前还没有公开的 SVG 生成示例</p>
          <Button asChild>
            <Link href="/">
              尝试生成 <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // 详情查看模式
  if (selectedSvg && getCurrentSvgId()) {
    return (
      <div className="container mx-auto px-0 py-0">
        <div className="mb-4 flex justify-between items-center gap-2">
          <div className="hidden md:flex items-center gap-2 max-w-2/3">
            <Button variant="ghost" size="sm" onClick={backToList}>
              <ArrowRight className="w-4 h-4 rotate-180 mr-1" />
            </Button>
          </div>
          <div className="flex gap-2">
            <DownloadButton svgContent={extractSvgContent(selectedSvg.latestVersion?.svgContent)} />
            <Button variant="outline" onClick={() => copySvgCode(selectedSvg)} className=" justify-start">
              <Copy className=" h-4 w-4" />
            </Button>
            <Button asChild className="justify-start">
              <Link
                href={
                  "/?" +
                  `style=${selectedSvg?.style ?? ""}&aspectRatio=${selectedSvg?.configuration?.aspectRatio ?? ""}`
                }
                onClick={() => doSameSvg()}
              >
                <ExternalLink className=" h-4 w-4" />
                做同款
              </Link>
            </Button>
          </div>
        </div>
        <Card className="my-3 border-none shadow-sm">
          <CollapsibleContent
            title={`${selectedSvg.inputContent}`}
            className="flex-1 border-none"
            titleClassName="py-1"
          >
            <MarkdownRenderer content={selectedSvg.inputContent} className="mt-2 border-t pt-2" />
          </CollapsibleContent>
        </Card>
        <div className="md:col-span-2">
          <div className="aspect-video w-full bg-white">
            <SvgViewer
              svgContent={sanitizeSvg(selectedSvg.latestVersion?.svgContent)}
              className="w-full h-full min-h-[400px]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 默认列表展示模式
  return (
    <div className="container mx-auto px-0 py-2 ">
      <h1 className="text-3xl font-bold mb-8 text-center">好图分享</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-10">
        探索由我们的 AI 智能创作平台生成的精美 SVG 作品，从中获取灵感，或直接下载使用。
      </p>

      {/* 示例列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-10">
        {generations.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden hover:shadow-md transition-shadow p-0 gap-2 group cursor-pointer"
            onClick={() => viewSvgDetails(item)}
          >
            <div className="p-2 aspect-square flex justify-center items-center bg-muted/30">
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeSvg(extractSvgContent(item.latestVersion?.svgContent)) }}
                className="w-full max-h-[600px] p-4"
              />
            </div>
            <div className="hidden group-hover:flex absolute top-2 right-2 justify-between items-center bg-background/80 rounded-md p-1 backdrop-blur-sm">
              <div className="flex gap-1">
                <DownloadButton svgContent={extractSvgContent(item.latestVersion?.svgContent)} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={(e) => copySvgCode(item, e)}
                  title="复制 SVG 代码"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" asChild className="justify-start">
                  <Link
                    href={"/?" + `style=${item?.style ?? ""}&aspectRatio=${item?.configuration?.aspectRatio ?? ""}`}
                    onClick={(e) => {
                      doSameSvg(item.inputContent);
                      e.stopPropagation();
                    }}
                  >
                    <ExternalLink className=" h-4 w-4" />
                    做同款
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button variant="outline" onClick={() => changePage(getCurrentPage() - 1)} disabled={getCurrentPage() <= 1}>
            上一页
          </Button>
          <span className="text-sm">
            第 {getCurrentPage()} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => changePage(getCurrentPage() + 1)}
            disabled={getCurrentPage() >= totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
