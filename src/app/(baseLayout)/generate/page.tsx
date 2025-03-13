"use client";

import { RecentGenerations } from "./components/RecentGenerations";

export default function GeneratePage() {
  return (
    <div className="container mx-auto py-6 pt-0">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-2">我的生成历史</h1>
        </div>
        <RecentGenerations />
      </div>
    </div>
  );
}
