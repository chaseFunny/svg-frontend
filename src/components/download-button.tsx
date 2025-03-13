import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadSvgAsPng, downloadSvgAsSvg } from "@/lib/saveSvg";
import { ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DownloadFormat = "png" | "svg" | "jpg";

interface DownloadButtonProps {
  svgContent: string;
  className?: string;
}

export function DownloadButton({ svgContent, className }: DownloadButtonProps) {
  const [format, setFormat] = useState<DownloadFormat>("png");

  const handleDownload = async () => {
    if (!svgContent) {
      toast.error("没有可下载的SVG内容");
      return;
    }

    try {
      if (format === "svg") {
        downloadSvgAsSvg(svgContent);
      } else {
        downloadSvgAsPng(svgContent);
      }
    } catch (error) {
      console.error("下载失败:", error);
      toast.error(`${format.toUpperCase()}下载失败`);
    }
  };

  return (
    <div className={`flex relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-r-none gap-1">
        <Download className="h-4 w-4" />
        <span>下载{format.toUpperCase()}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-l-none border-l-0 px-2">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setFormat("png")}>PNG格式</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFormat("svg")}>SVG格式</DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setFormat("jpg")}>JPG格式</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
