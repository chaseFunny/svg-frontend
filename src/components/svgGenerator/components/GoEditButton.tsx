/** 编辑按钮 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
interface GoEditProps {
  generateId: string;
  className?: string;
}

export function GoEditButton({ generateId, className }: GoEditProps) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        router.push(`/editor/${generateId}`);
      }}
      className={cn(
        "gap-1 group hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-700 transition-all",
        "hover:shadow-sm hover:scale-105 active:scale-95",
        className
      )}
    >
      <Pencil className="h-3.5 w-3.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      <span className="group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">编辑</span>
    </Button>
  );
}
