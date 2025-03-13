"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

type UseLeavePageConfirmProps = {
  /**
   * 自定义提示消息
   * @default "您有未保存的更改，确定要离开当前页面吗？"
   */
  message?: string;
  /**
   * 是否启用离开确认
   * @default true
   */
  enabled?: boolean;
};

/**
 * 用于在用户尝试离开页面时显示确认对话框的自定义钩子
 */
export function useLeavePageConfirm({
  message = "您有未保存的更改，确定要离开当前页面吗？",
  enabled = true,
}: UseLeavePageConfirmProps = {}) {
  const pathname = usePathname();

  // 处理路由变化
  const handleRouteChangeStart = useCallback(
    (url: string) => {
      // 如果未启用或者是相同路径，则不拦截
      if (!enabled || url === pathname) {
        return;
      }

      // 返回false阻止路由变化
      return false;
    },
    [enabled, pathname]
  );

  useEffect(() => {
    if (!enabled) return;

    // 监听浏览器的beforeunload事件
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // 添加事件监听器
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 清理函数
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, message]);

  // 路由监听
  useEffect(() => {
    if (!enabled) return;

    // 由于Next.js 13+ App Router的限制，需要使用一些变通方法监听路由
    // 这里我们使用document点击事件来检测链接点击
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && !link.getAttribute("target") && link.getAttribute("href")) {
        const href = link.getAttribute("href") as string;

        // 如果是内部链接且不同于当前路径
        if (href.startsWith("/") && href !== pathname) {
          e.preventDefault();
          handleRouteChangeStart(href);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [enabled, handleRouteChangeStart, pathname]);

  // 离开确认对话框组件
  // const LeaveConfirmDialog = (
  //   <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
  //     <AlertDialogContent>
  //       <AlertDialogHeader>
  //         <AlertDialogTitle>确认离开</AlertDialogTitle>
  //         <AlertDialogDescription>{message}</AlertDialogDescription>
  //       </AlertDialogHeader>
  //       <AlertDialogFooter>
  //         <AlertDialogCancel onClick={handleCancel}>取消</AlertDialogCancel>
  //         <AlertDialogAction onClick={handleConfirm}>确认离开</AlertDialogAction>
  //       </AlertDialogFooter>
  //     </AlertDialogContent>
  //   </AlertDialog>
  // );

  return {
    /**
     * 离开确认对话框组件
     */
    // LeaveConfirmDialog,
    /**
     * 当前是否启用离开确认
     */
    enabled,
  };
}
