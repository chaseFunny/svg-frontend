"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 在组件挂载后再渲染，避免服务端渲染时的不匹配问题
  useEffect(() => {
    setMounted(true);
  }, []);

  // 使用 View Transitions API 实现平滑主题切换
  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(theme === "dark" ? "light" : "dark");
      return;
    }

    // 使用 View Transitions API
    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme === "dark" ? "light" : "dark");
      });
    });
  };

  if (!mounted) {
    return (
      <button
        className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="切换主题"
      >
        <div className="size-5" />
      </button>
    );
  }

  return (
    <>
      {theme === "dark" ? (
        <></>
      ) : (
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
      )}

      <button
        onClick={toggleTheme}
        className="rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
      >
        {theme === "dark" ? (
          <Sun className="size-5 view-transition-theme" />
        ) : (
          <Moon className="size-5 view-transition-theme" />
        )}
      </button>
    </>
  );
}
