import { onCleanSvgContent } from "@/lib/formatSvg";
import { cn } from "@/lib/utils";
import { Minus, Move, Plus, RotateCcw } from "lucide-react";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

interface SvgViewerProps {
  svgContent: string;
  className?: string;
}

export function SvgViewer({ svgContent, className }: SvgViewerProps) {
  const cleanSvgContent = onCleanSvgContent(svgContent);
  // 状态管理
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 使用refs存储当前值，避免在事件处理函数中的闭包问题
  const positionRef = useRef(position);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // 同步ref和state
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // 重置视图
  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 放大
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  }, []);

  // 缩小
  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  // 切换全屏
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    // 重置位置和缩放
    resetView();
  }, [resetView]);

  // 处理拖动开始
  const handleDragStart = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // 使用requestAnimationFrame优化拖动
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      requestAnimationFrame(() => {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;

        const newPosition = {
          x: positionRef.current.x + dx,
          y: positionRef.current.y + dy,
        };

        setPosition(newPosition);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      });
    },
    [isDragging]
  );

  // 处理拖动结束
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 添加全局事件监听
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDrag(e as MouseEvent<Element>);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  // 全屏模式下按ESC键退出
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        resetView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, resetView]);

  return (
    <div
      ref={viewerRef}
      className={cn(
        "flex justify-center items-center relative overflow-hidden rounded-lg border border-dashed bg-white dark:bg-gray-900",
        className,
        isFullscreen ? "fixed inset-0 z-50 m-0 rounded-none border-none w-screen h-screen  top-0 left-0" : ""
      )}
    >
      {/* SVG 容器 */}
      <div
        ref={containerRef}
        className={cn(
          "flex justify-center w-full h-auto bg-white dark:bg-gray-900 ",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          transform: `scale(${scale}) translate3d(${position.x}px, ${position.y}px, 0)`,
          transformOrigin: "center center",
        }}
        onMouseDown={handleDragStart}
        dangerouslySetInnerHTML={{ __html: cleanSvgContent }}
      />

      {/* 控制按钮 */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1 p-1 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="放大"
          >
            <Plus className="h-4 w-4" />
          </button>
          <div className="h-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="缩小"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="h-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <button
            onClick={resetView}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="重置视图"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="h-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title={isFullscreen ? "退出全屏" : "全屏查看"}
          >
            {/* {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />} */}
          </button>
        </div>
      </div>

      {/* 提示标签 */}
      <div className="absolute top-4 left-4 px-2 py-1 rounded-md bg-black/30 dark:bg-white/20 text-xs text-white dark:text-gray-200 backdrop-blur-sm">
        <Move className="h-3 w-3 inline-block mr-1" /> 拖动查看 ({Math.round(scale * 100)}%)
      </div>

      {/* 全屏模式下的关闭提示 */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-black/30 dark:bg-white/20 text-xs text-white dark:text-gray-200 backdrop-blur-sm">
          按 ESC 退出全屏
        </div>
      )}
    </div>
  );
}
