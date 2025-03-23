import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface UsageCounterProps {
  /** 剩余使用次数 */
  count: number;
  /** 可选的自定义样式 */
  className?: string;
}

export function UsageCounter({ count, className }: UsageCounterProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 h-8 text-sm bg-muted/30 rounded-md text-muted-foreground",
              className
            )}
          >
            <Zap size={14} />
            <span>{count}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>消耗次数</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
