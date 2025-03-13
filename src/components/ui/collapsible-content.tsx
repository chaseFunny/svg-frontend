"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

interface CollapsibleContentProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  titleClassName?: string;
  contentClassName?: string;
}

export function CollapsibleContent({
  title,
  children,
  className,
  defaultExpanded = false,
  titleClassName,
  contentClassName,
}: CollapsibleContentProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={cn("border rounded-md", className)}>
      <div
        className={cn("flex items-center justify-between p-3 cursor-pointer", titleClassName)}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="font-medium text-sm truncate">{title}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="p-1 h-auto"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      {expanded && <div className={cn("p-3 pt-0 text-sm", contentClassName)}>{children}</div>}
    </div>
  );
}
