import { Button } from "@/components/ui/button";
import { onCleanSvgContent } from "@/lib/formatSvg";
import { copyToClipboard } from "@/lib/utils";
import DOMPurify from "dompurify"; // 引入 DOMPurify 防止 XSS 攻击
import hljs from "highlight.js";
import xml from "highlight.js/lib/languages/xml"; // 引入 XML 语言支持
import "highlight.js/styles/vs2015.css"; // 使用 vs2015 主题
import { Copy } from "lucide-react";
import { useEffect, useRef } from "react";
import { GoEditButton } from "./GoEditButton";
import SwitchViewTab from "./SwitchViewTab";

// 注册 XML 语言
hljs.registerLanguage("xml", xml);

interface StreamContentProps {
  content: string;
  isComplete: boolean;
  toggleTab: () => void;
  activeTab: string;
  generateId: string;
}

export function StreamContent({ content, isComplete, toggleTab, activeTab, generateId }: StreamContentProps) {
  const containerRef = useRef<HTMLPreElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // 让 box 滚动到页面顶部
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  // 应用代码高亮
  useEffect(() => {
    if (codeRef.current && content) {
      try {
        const highlightedCode = hljs.highlight(content, {
          language: "xml", // SVG 基于 XML，使用 xml 语法高亮
          ignoreIllegals: true,
        }).value;

        // 使用 DOMPurify 净化高亮后的 HTML
        codeRef.current.innerHTML = DOMPurify.sanitize(highlightedCode);
      } catch (error) {
        // 如果高亮失败，至少确保内容显示
        console.error("代码高亮失败：", error);
        codeRef.current.textContent = content;
      }
    }
  }, [content]);

  return (
    <div
      ref={boxRef}
      className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 shadow-sm"
    >
      <div className="mb-2 flex items-center">
        {isComplete && (
          <div className="w-full flex justify-between items-center gap-2">
            <SwitchViewTab toggleTab={toggleTab} activeTab={activeTab} />
            <div className="flex gap-2">
              <GoEditButton generateId={generateId} />
              {/* 添加复制按钮 */}
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(onCleanSvgContent(content))}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {!isComplete && (
          <div className="flex gap-1 mt-1">
            <span className="animate-bounce delay-0 h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="animate-bounce delay-150 h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="animate-bounce delay-300 h-2 w-2 bg-blue-500 rounded-full"></span>
          </div>
        )}
      </div>
      <pre
        ref={containerRef}
        className="whitespace-pre-wrap break-words max-h-[calc(100vh-100px)] min-h-[500px] rounded-sm   overflow-y-auto"
      >
        <code ref={codeRef} className="language-xml hljs min-h-[500px] !pb-8"></code>
      </pre>
    </div>
  );
}
