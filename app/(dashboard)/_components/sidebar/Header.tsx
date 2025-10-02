"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  title,
}: HeaderProps) {
  return (
    <header className="h-16 border-b bg-slate-900 backdrop-blur-sm flex items-center px-6 ">
      <Button
        variant="ghost"
        size="icon"
        className="border border-border/20 hover:border-border/10 bg-transparent text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent gap-2"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5 text-primary-foreground" />
      </Button>
      <h1 className="ml-4 text-xl text-primary-foreground font-semibold">
        {title}
      </h1>
    </header>
  );
}
