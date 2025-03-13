import { siteConfig } from "@/config";
import Link from "next/link";
import React from "react";

export default function CustomLayoutHeader({ children }: { children: React.ReactNode }) {
  return (
    <nav className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        {siteConfig.title}
      </Link>
      {children}
    </nav>
  );
}
