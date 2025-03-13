import { DownloadButton } from "@/components/download-button";
import { typeActiveTab } from "..";
import { GoEditButton } from "./GoEditButton";
import { SvgViewer } from "./SvgViewer";
import SwitchViewTab from "./SwitchViewTab";

interface SvgResultProps {
  svgContent: string;
  toggleTab: () => void;
  activeTab: typeActiveTab;
  generateId: string;
}

export function SvgResult({ svgContent, toggleTab, activeTab, generateId }: SvgResultProps) {
  return (
    <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        {/* 预览/代码切换选项卡 */}
        <SwitchViewTab toggleTab={toggleTab} activeTab={activeTab} />
        <div className="flex gap-2">
          <GoEditButton generateId={generateId} />
          <DownloadButton svgContent={svgContent} />
        </div>
      </div>

      {/* 使用新的 SvgViewer 组件 */}
      <SvgViewer svgContent={svgContent} className="w-full h-3/4" />
    </div>
  );
}
