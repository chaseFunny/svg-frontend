import { ChangeEvent } from "react";

interface SvgPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SvgPromptInput({ value, onChange, disabled }: SvgPromptInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <textarea
        id="svg-prompt"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="描述你需要的SVG图像，例如：一个简单的流程图，展示数据从用户到数据库的流动..."
        className="w-full min-h-[188px] p-4 border shadow-none  focus:border-neutral-300 dark:focus:border-neutral-700  border-neutral-300/50 bg-gradient-to-tr from-neutral-50 to-neutral-200 dark:border-neutral-50/20 dark:from-neutral-800 dark:to-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary  dark:bg-gray-800/50 dark:text-gray-100 transition-all duration-200 ease-in-out text-base resize-none"
      />
    </div>
  );
}
