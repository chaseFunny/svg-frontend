import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ASPECT_RATIOS, AspectRatio } from "@/constants/aspect-ratios";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface AspectRatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AspectRatioSelector({ value, onChange, disabled = false }: AspectRatioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 当前选中的比例对象
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio | null>(
    ASPECT_RATIOS.find((ratio) => ratio.ratio === value) || null
  );

  // 根据输入内容过滤选项
  const filteredRatios = ASPECT_RATIOS.filter(
    (ratio) =>
      ratio.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      ratio.ratio.toLowerCase().includes(inputValue.toLowerCase())
  );

  // 检查输入是否符合比例格式
  const isValidRatioFormat = /^\d+:\d+$/.test(inputValue);

  // 是否为自定义比例输入
  const isCustomRatio = inputValue && isValidRatioFormat && !ASPECT_RATIOS.some((ratio) => ratio.ratio === inputValue);

  // 当外部value变化时更新选中状态
  useEffect(() => {
    const found = ASPECT_RATIOS.find((ratio) => ratio.ratio === value);
    setSelectedRatio(found || null);

    // 当直接关闭弹窗或清空输入框时，重置输入值
    if (!isOpen) {
      setInputValue("");
    }
  }, [value, isOpen]);

  // 验证比例格式
  const validateRatio = (input: string): boolean => {
    if (!input.trim()) {
      setError("比例不能为空");
      return false;
    }

    const ratioRegex = /^\d+:\d+$/;
    if (!ratioRegex.test(input)) {
      setError("请使用 数字:数字 格式");
      return false;
    }

    setError("");
    return true;
  };

  // 处理输入变化
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue && newValue.includes(":")) {
      validateRatio(newValue);
    } else {
      setError("");
    }
  };

  // 处理比例选择
  const handleSelectRatio = (ratio: AspectRatio) => {
    setSelectedRatio(ratio);
    onChange(ratio.ratio);
    setIsOpen(false);
    setInputValue("");
  };

  // 确认使用自定义比例
  const handleConfirmCustomRatio = () => {
    if (validateRatio(inputValue)) {
      onChange(inputValue);
      setIsOpen(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isCustomRatio && !error) {
        handleConfirmCustomRatio();
      } else if (filteredRatios.length === 1) {
        // 如果只有一个匹配项，直接选择它
        handleSelectRatio(filteredRatios[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && filteredRatios.length > 0) {
      // 焦点移到第一个选项
      const firstOption = document.querySelector("[data-ratio-option]") as HTMLElement;
      if (firstOption) firstOption.focus();
    }
  };

  // 处理弹窗打开状态变化
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // 当弹窗打开时，聚焦到输入框
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen && !disabled} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="relative">
            {isOpen ? (
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索或输入比例，如 16:9..."
                className={cn("pr-10", error && "border-red-500 focus-visible:ring-red-500")}
                disabled={disabled}
              />
            ) : (
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isOpen}
                className="w-full justify-between"
                disabled={disabled}
                onClick={() => setIsOpen(true)}
              >
                <span className="truncate text-left">
                  {selectedRatio ? `${selectedRatio.name} (${selectedRatio.ratio})` : value || "选择比例"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            )}

            {isOpen && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setIsOpen(false)}
                disabled={disabled}
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", "rotate-180")} />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          {error && <p className="text-xs text-red-500 p-2 border-b">{error}</p>}

          <div className="max-h-[300px] overflow-auto p-1">
            {/* 自定义比例区域 */}
            {isCustomRatio && (
              <div className="px-1 py-2">
                <div className="text-sm text-muted-foreground">自定义比例</div>
                <Button
                  className="mt-1 w-full justify-between"
                  variant="secondary"
                  onClick={handleConfirmCustomRatio}
                  disabled={!!error}
                >
                  <span>使用 &quot;{inputValue}&quot;</span>
                  {!error && <CheckIcon className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            )}

            {/* 未找到匹配项提示 */}
            {inputValue && filteredRatios.length === 0 && !isCustomRatio && (
              <div className="p-2 text-sm text-muted-foreground text-center">未找到匹配的比例</div>
            )}

            {/* 比例选项列表 */}
            {filteredRatios.length > 0 && (
              <>
                {isCustomRatio && <div className="border-t my-1"></div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
                  {filteredRatios.map((ratio) => (
                    <Button
                      key={`${ratio.name}-${ratio.ratio}`}
                      variant={selectedRatio?.ratio === ratio.ratio ? "secondary" : "ghost"}
                      className="justify-start text-left h-auto py-2 px-3"
                      onClick={() => handleSelectRatio(ratio)}
                      data-ratio-option
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1 w-full">
                          <span className="font-medium truncate">{ratio.name}</span>
                          <span className="text-xs text-muted-foreground">({ratio.ratio})</span>
                          {selectedRatio?.ratio === ratio.ratio && (
                            <CheckIcon className="h-4 w-4 ml-auto flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {ratio.width}×{ratio.height}px
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            )}

            {/* 提示信息 - 始终显示 */}
            <div className="p-2 text-xs text-muted-foreground border-t mt-1">
              提示：可直接输入自定义比例，如 4:3、16:9
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
