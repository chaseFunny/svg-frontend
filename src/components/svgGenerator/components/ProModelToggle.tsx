import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface ProModelToggleProps {
  /** 是否开启Pro模型 */
  checked: boolean;
  /** 切换状态的回调函数 */
  onCheckedChange: (checked: boolean) => void;
  /** 可选的自定义样式 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

export function ProModelToggle({ checked, onCheckedChange, className, disabled }: ProModelToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5", className)}>
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all",
                checked
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : "border-border bg-transparent text-muted-foreground"
              )}
            >
              <Star size={14} className={cn("transition-all", checked ? "fill-primary" : "fill-none")} />
              <span className="text-xs font-medium tracking-wide">Pro</span>
              <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className={cn("h-4 w-7", checked ? "bg-primary" : "bg-muted")}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>切换使用高级模型</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
