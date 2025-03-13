"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BuyCard } from "../buyCard";
import { AspectRatioSelector } from "./components/AspectRatioSelector";
import { StreamContent } from "./components/StreamContent";
import { StyleSelector } from "./components/StyleSelector";
import { SvgPromptInput } from "./components/SvgPromptInput";
import { SvgResult } from "./components/SvgResult";
import { useSvgGenerator } from "./hooks/useSvgGenerator";

const GenerateButton = dynamic(() => import("./components/GenerateButton").then((mod) => mod.GenerateButton), {
  ssr: false,
});

interface SvgDialogProps {
  className?: string;
}

export type typeActiveTab = "preview" | "code";

export function SvgDialog({ className }: SvgDialogProps) {
  return (
    <Suspense fallback={<SvgDialogLoading />}>
      <SvgDialogContent className={className} />
    </Suspense>
  );
}

function SvgDialogLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-[250px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">加载中，请稍候...</p>
        </div>
      </div>
    </div>
  );
}

function SvgDialogContent({ className }: SvgDialogProps) {
  const [openBuyCard, setOpenBuyCard] = useState(false);
  const searchParams = useSearchParams();

  const {
    prompt,
    setPrompt,
    selectedStyle,
    setSelectedStyle,
    selectedAspectRatio,
    setSelectedAspectRatio,
    isGenerating,
    generatedSvg,
    generateSvg,
    styleOptions,
    streamContent,
    isStreaming,
    streamComplete,
    cancelGenerate,
    generateId,
  } = useSvgGenerator(setOpenBuyCard, searchParams);
  const [activeTab, setActiveTab] = useState<typeActiveTab>("preview");
  // 添加过渡动画状态
  const [showStreamContent, setShowStreamContent] = useState(true);
  const [showSvgResult, setShowSvgResult] = useState(false);
  // 添加切换锁定状态，防止快速点击导致动画异常
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  const disabled = !prompt || isGenerating;

  // 处理组件切换的动画效果
  useEffect(() => {
    // 重置函数，用于清除所有延时操作
    let timeouts: NodeJS.Timeout[] = [];
    const clearTimeouts = () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts = [];
    };

    if (isStreaming) {
      // 流式生成过程中，始终显示StreamContent
      clearTimeouts();
      setShowStreamContent(true);
      setShowSvgResult(false);
      setIsTabSwitching(false);
    } else if (streamComplete) {
      if (activeTab === "preview" && !isTabSwitching) {
        // 流式生成完成且处于预览模式，显示SVG结果
        if (!isStreaming && !showSvgResult) {
          // 首次从流式内容切换到结果时使用动画
          clearTimeouts();
          const t1 = setTimeout(() => {
            setShowStreamContent(false);
            const t2 = setTimeout(() => {
              setShowSvgResult(true);
            }, 150);
            timeouts.push(t2);
          }, 200);
          timeouts.push(t1);
        } else if (!showSvgResult) {
          // 确保预览模式下总是显示SVG结果
          clearTimeouts();
          setShowStreamContent(false);
          setShowSvgResult(true);
        }
      } else if (activeTab === "code" && !isTabSwitching) {
        // 代码视图：显示StreamContent，隐藏SvgResult
        clearTimeouts();
        setShowStreamContent(true);
        setShowSvgResult(false);
      }
    }

    // 清理函数
    return () => {
      clearTimeouts();
    };
  }, [isStreaming, streamComplete, activeTab, showSvgResult, isTabSwitching]);

  // 处理视图切换的动画效果
  const handleToggleTab = () => {
    // 如果正在切换中，忽略新的切换请求
    if (isTabSwitching) return;

    // 设置切换锁定，防止快速切换
    setIsTabSwitching(true);

    // 先更新activeTab，确保UI与状态一致
    const newTab = activeTab === "preview" ? "code" : "preview";
    setActiveTab(newTab);

    // 然后根据新的activeTab值应用过渡动画
    if (newTab === "code") {
      // 切换到代码视图：先隐藏结果，再显示代码
      setShowSvgResult(false);
      setTimeout(() => {
        setShowStreamContent(true);
        setTimeout(() => {
          // 解除切换锁定
          setIsTabSwitching(false);
        }, 300);
      }, 150);
    } else {
      // 切换到预览视图：先隐藏代码，再显示结果
      setShowStreamContent(false);
      setTimeout(() => {
        setShowSvgResult(true);
        setTimeout(() => {
          // 解除切换锁定
          setIsTabSwitching(false);
        }, 300);
      }, 150);
    }
  };

  // 添加回车键监听器来触发生成
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !disabled) {
        generateSvg();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [disabled, generateSvg]);
  /** 重置所有状态 */
  const resetAllState = () => {
    setActiveTab("preview");
    setShowStreamContent(true);
    setShowSvgResult(false);
    setIsTabSwitching(false);
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        {/* 生成结果区域 */}
        {streamContent ? (
          <div className="relative min-h-[250px]">
            {/* 流式内容显示 - 添加过渡动画 */}
            <div
              className={cn(
                "transition-all duration-300 ease-in-out absolute w-full",
                showStreamContent
                  ? "opacity-100 z-10 transform translate-y-0"
                  : "opacity-0 z-0 transform -translate-y-1 scale-98"
              )}
            >
              <StreamContent
                generateId={generateId}
                content={streamContent}
                isComplete={streamComplete}
                toggleTab={handleToggleTab}
                activeTab={activeTab}
              />
            </div>

            {/* 最终SVG结果 - 添加过渡动画 */}
            {generatedSvg && (
              <div
                className={cn(
                  "transition-all duration-300 ease-out absolute w-full",
                  showSvgResult
                    ? "opacity-100 z-20 transform translate-y-0"
                    : "opacity-0 z-0 transform translate-y-1 scale-102"
                )}
              >
                <SvgResult
                  generateId={generateId}
                  svgContent={generatedSvg}
                  toggleTab={handleToggleTab}
                  activeTab={activeTab}
                />
              </div>
            )}

            {/* 添加一个占位元素保持布局稳定 */}
            <div aria-hidden="true" className="invisible opacity-0 pointer-events-none">
              {activeTab === "preview" && generatedSvg && !isStreaming ? (
                <SvgResult
                  generateId={generateId}
                  svgContent={generatedSvg}
                  toggleTab={handleToggleTab}
                  activeTab={activeTab}
                />
              ) : (
                <StreamContent
                  generateId={generateId}
                  content={streamContent}
                  isComplete={streamComplete}
                  toggleTab={handleToggleTab}
                  activeTab={activeTab}
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
      <div>
        <div
          className={cn(
            "flex flex-col space-y-4 p-2 relative z-10 border border-neutral-200/50 dark:border-white/15 rounded-2xl transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700",
            className
          )}
        >
          {/* 顶部大输入框 */}
          <div className="w-full mb-1">
            <SvgPromptInput value={prompt || ""} onChange={setPrompt} disabled={isGenerating} />
          </div>

          {/* 控制区域 - 选择器和生成按钮 */}
          <div className="flex flex-col mb-0 md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-auto">
              <StyleSelector
                value={selectedStyle}
                options={styleOptions}
                onChange={setSelectedStyle}
                disabled={isGenerating}
              />
              <AspectRatioSelector
                value={selectedAspectRatio}
                onChange={setSelectedAspectRatio}
                disabled={isGenerating}
              />
            </div>
            <div className="w-full md:w-auto">
              <GenerateButton
                onClick={() => {
                  resetAllState();
                  generateSvg();
                }}
                disabled={disabled}
                isGenerating={isGenerating}
                cancelGenerate={cancelGenerate}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <BuyCard open={openBuyCard} onOpenChange={(open) => setOpenBuyCard(open)} />
    </div>
  );
}

export default SvgDialog;
