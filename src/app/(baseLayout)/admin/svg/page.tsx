"use client";

import { SvgViewer } from "@/components/svgGenerator/components/SvgViewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  svgGeneratorControllerFindGenerations,
  svgGeneratorControllerUpdatePublicStatus,
} from "@/services/svg/svgGenerations";
import DOMPurify from "dompurify";
import { Globe2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SvgAdminPage() {
  return (
    <Suspense fallback={<SvgAdminPageLoading />}>
      <SvgAdminPageContent />
    </Suspense>
  );
}

function SvgAdminPageLoading() {
  return (
    <div className="container mx-auto px-0 py-2 ">
      <h1 className="text-3xl font-bold mb-8 text-center">SVG 内容管理</h1>
      <div className="flex justify-center items-center h-60">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">加载中，请稍候...</p>
        </div>
      </div>
    </div>
  );
}

function SvgAdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [generations, setGenerations] = useState<API.SvgGenerationWithVersionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]); // 跟踪正在更新状态的SVG ID

  // 分页相关状态
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  // 从URL获取当前页码
  const getCurrentPage = (): number => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  };

  // 更新URL中的页码参数
  const updatePageParam = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // 获取所有SVG生成数据
  const fetchAllGenerations = async () => {
    try {
      setLoading(true);
      const currentPage = getCurrentPage();
      const response = await svgGeneratorControllerFindGenerations({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      // 解构分页响应并更新状态
      const { items, totalPages } = response;
      setGenerations(items);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("获取SVG数据失败:", error);
      toast.error("获取SVG数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGenerations();
  }, [searchParams]);

  // 切换页码
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updatePageParam(newPage);
  };

  // 更新SVG公开状态
  const setPublicStatus = async (svg: API.SvgGenerationWithVersionData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // 添加到正在更新的ID列表
      setUpdatingIds((prev) => [...prev, svg.id.toString()]);

      // 调用接口更新公开状态（切换当前状态）
      const newStatus = !svg.isPublic;
      await svgGeneratorControllerUpdatePublicStatus({ id: svg.id.toString() }, { isPublic: newStatus });

      // 更新本地数据，避免重新加载整个页面
      setGenerations((prev) => prev.map((item) => (item.id === svg.id ? { ...item, isPublic: newStatus } : item)));

      // 显示成功提示
      toast.success(`SVG ID: ${svg.id} ${newStatus ? "已设置为公开状态" : "已设置为不公开状态"}`);
    } catch (error) {
      console.error("更新公开状态失败:", error);
      toast.error("更新公开状态失败，请稍后重试");
    } finally {
      // 从正在更新的ID列表中移除
      setUpdatingIds((prev) => prev.filter((id) => id !== svg.id.toString()));
    }
  };

  // 安全处理SVG内容
  const sanitizeSvg = (svgContent: string) => {
    return DOMPurify.sanitize(svgContent, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "defs", "title", "desc"],
    });
  };

  // 加载状态
  if (loading && generations.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">加载中，请稍候...</p>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!loading && generations.length === 0) {
    return (
      <div className="container mx-auto px-0 py-2 ">
        <h1 className="text-3xl font-bold mb-8 text-center">SVG 内容管理</h1>
        <div className="flex flex-col justify-center items-center h-60 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
          <p className="text-lg text-muted-foreground mb-2">暂无SVG数据</p>
          <p className="text-sm text-muted-foreground/70 mb-6">数据库中没有找到任何SVG生成记录</p>
        </div>
      </div>
    );
  }

  // 默认列表展示模式
  return (
    <div className="container mx-auto px-0 py-2">
      <h1 className="text-3xl font-bold mb-8 text-center">SVG 内容管理</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-10">
        管理所有用户创建的SVG，可以设置公开状态供公共展示页面使用
      </p>

      {/* SVG列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-10">
        {generations.map((item) => (
          <Card key={item.id} className="relative overflow-hidden hover:shadow-md transition-shadow p-0 gap-2 group">
            <div className="p-2 aspect-square flex justify-center items-center bg-muted/30">
              <SvgViewer
                svgContent={sanitizeSvg(item.latestVersion?.svgContent)}
                className="w-full max-h-[600px] p-4"
              />
            </div>
            <div className="flex justify-between items-center p-3 border-t">
              <div>
                <p className="text-sm truncate max-w-[200px]">
                  ID: {item.id} | 用户: {item.userId}
                </p>
                <p className="text-xs text-muted-foreground">{item.isPublic ? "当前状态: 公开" : "当前状态: 不公开"}</p>
              </div>
              <Button
                variant={item.isPublic ? "outline" : "default"}
                size="sm"
                className="ml-auto"
                onClick={(e) => setPublicStatus(item, e)}
                title={item.isPublic ? "取消公开" : "设为公开"}
                disabled={updatingIds.includes(item.id.toString())}
              >
                {updatingIds.includes(item.id.toString()) ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Globe2 className="w-4 h-4 mr-1" />
                )}
                {item.isPublic ? "已公开" : "公开"}
              </Button>
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
