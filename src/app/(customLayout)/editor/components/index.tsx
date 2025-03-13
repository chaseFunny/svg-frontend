"use client";
import { useEffect, useState } from "react";

export default function EditorLoading() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading && (
        <div className="fixed top-3 left-0 right-0 mx-auto w-fit h-8 px-4 bg-primary/80 text-white flex items-center justify-center rounded-md shadow-sm">
          <p className="text-xs font-medium">内容加载中...</p>
        </div>
      )}
    </>
  );
}
