import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleX, Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  className?: string;
  variant?: "default" | "primary" | "outline";
  cancelGenerate?: () => void;
}

export function GenerateButton({
  onClick,
  disabled,
  isGenerating,
  className,
  variant = "primary",
  cancelGenerate,
}: GenerateButtonProps) {
  return (
    <>
      {isGenerating && (
        <Button onClick={cancelGenerate} variant="outline" size="sm" className="mr-2 border-none" title="取消">
          <CircleX className="h-5 w-5" />
        </Button>
      )}
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative h-8 font-medium transition-all",
          variant === "primary" &&
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70",
          isGenerating && "animate-pulse",
          disabled === true && "bg-gray-300 text-gray-500 cursor-not-allowed",
          className
        )}
        size="lg"
        aria-busy={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>生成中...</span>
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>生成</span>
          </>
        )}

        {variant === "primary" && (
          <span className="absolute inset-0 rounded-md bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
        )}
      </Button>
    </>
  );
}
