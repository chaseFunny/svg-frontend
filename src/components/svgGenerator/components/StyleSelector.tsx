import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface StyleSelectorProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function StyleSelector({ value, options, onChange, disabled }: StyleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 过滤选项
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));

  // 检查是否为自定义选项
  const isCustomValue = inputValue && !options.includes(inputValue);

  // 当外部value变化时更新输入框
  useEffect(() => {
    if (!open) setInputValue("");
  }, [value, open]);

  // 验证输入内容
  const validateInput = (input: string): boolean => {
    if (input.trim().length === 0) {
      setError("风格不能为空");
      return false;
    }

    if (input.length > 10) {
      setError("自定义风格最多10个字符");
      return false;
    }

    setError("");
    return true;
  };

  // 处理输入变化
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue) validateInput(newValue);
    else setError("");
  };

  // 处理选项选择
  const handleSelect = (selectedValue: string) => {
    setInputValue("");
    onChange(selectedValue);
    setOpen(false);
  };

  // 处理确认
  const handleConfirm = () => {
    if (validateInput(inputValue)) {
      onChange(inputValue);
      setOpen(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isCustomValue && !error) {
        handleConfirm();
      } else if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown" && filteredOptions.length > 0) {
      // 焦点移到第一个选项
      const firstOption = document.querySelector("[data-style-option]") as HTMLElement;
      if (firstOption) firstOption.focus();
    }
  };

  // 处理弹窗打开状态变化
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // 当弹窗打开时，聚焦到输入框
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="relative">
            {open ? (
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={() => !open && setOpen(true)}
                placeholder="搜索或输入自定义风格..."
                className={cn("pr-10", error && "border-red-500 focus-visible:ring-red-500")}
                disabled={disabled}
                maxLength={10}
              />
            ) : (
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={disabled}
                onClick={() => setOpen(true)}
              >
                <span className="truncate text-left">{value || "选择风格"}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            )}

            {open && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setOpen(false)}
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
            {inputValue && isCustomValue && (
              <div className="px-1 py-2">
                <div className="text-sm text-muted-foreground">自定义风格 ({inputValue.length}/10)</div>
                <Button
                  className="mt-1 w-full justify-between"
                  variant="secondary"
                  onClick={handleConfirm}
                  disabled={!!error}
                >
                  <span>使用 &quot;{inputValue}&quot;</span>
                  {!error && <CheckIcon className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            )}

            {inputValue && filteredOptions.length === 0 && !isCustomValue && (
              <div className="p-2 text-sm text-muted-foreground text-center">未找到匹配的风格</div>
            )}

            {filteredOptions.length > 0 && (
              <>
                {inputValue && isCustomValue && <div className="border-t my-1"></div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
                  {filteredOptions.map((style) => (
                    <Button
                      key={style}
                      variant={value === style ? "secondary" : "ghost"}
                      className="justify-start font-normal text-left"
                      onClick={() => handleSelect(style)}
                      data-style-option
                    >
                      <div className="flex items-center w-full">
                        <span className="flex-grow truncate">{style}</span>
                        {value === style && <CheckIcon className="h-4 w-4 ml-2 flex-shrink-0" />}
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            )}

            {/* 提示信息 */}
            <div className="p-2 text-xs text-muted-foreground border-t mt-1">
              提示：可直接输入自定义风格，最多10个字符
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
