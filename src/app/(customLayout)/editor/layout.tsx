// 开发layout组件
import CustomLayoutHeader from "@/components/customLayoutHeader";
import { Button } from "@/components/ui/button";
import { Info, Pencil } from "lucide-react";
import Link from "next/link";
import EditorLoading from "./components";
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EditorLoading />
      <CustomLayoutHeader>
        {/* 下载 */}
        {/* 高级编辑器按钮 */}
        <div className="flex items-center gap-2">
          <Link target="_blank" prefetch={false} href={"https://svgedit.netlify.app/editor/"}>
            <Button variant="secondary" size="sm" className="cursor-pointer">
              高级编辑器 <Pencil className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link target="_blank" prefetch={false} href={"https://www.yuque.com/asgas/qqbbzl/xhlo4qk7fy9ln7kn"}>
            <Button variant="secondary" size="sm" className="cursor-pointer">
              帮助 <Info className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CustomLayoutHeader>
      {children}
    </>
  );
}
