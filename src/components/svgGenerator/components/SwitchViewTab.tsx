import { cn } from "@/lib/utils";

export default function SwitchViewTab({ toggleTab, activeTab }: { toggleTab: () => void; activeTab: string }) {
  return (
    <div className="flex ">
      <div className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 p-1">
        <button
          onClick={toggleTab}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
            activeTab === "preview"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          预览
        </button>
        <button
          onClick={toggleTab}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
            activeTab === "code"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          源码
        </button>
      </div>
    </div>
  );
}
