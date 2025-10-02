"use client";

import { useRouter, usePathname } from "next/navigation";
import { handleLogout } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Home, Users, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import iconeProfills from "@/public/icon.png";
import Link from "next/link";

interface SidebarProps {
  session: {
    user: {
      name: string;
      email: string;
    };
  };
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ session, sidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-slate-900 z-10 border-r border-border/10 transition-all duration-300 flex flex-col`}
    >
      <div className="py-4 flex-1">
        <Link
          href="/"
          className={`text-xl font-bold mb-6 border-b border-border/10 pb-2 flex items-center justify-center transition-all duration-300 fade-in ${
            sidebarOpen ? "" : "text-center"
          }`}
        >
          {sidebarOpen ? (
            <div className="flex items-center   font-bold text-2xl text-primary-foreground">
              <Image src={iconeProfills} alt="Logo" className="w-10 h-10" />{" "}
              Profills
            </div>
          ) : (
            <Image src={iconeProfills} alt="Logo" className="w-10 h-10" />
          )}
        </Link>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full gap-4 transition-all duration-200  border-transparent rounded-none hover:text-primary-foreground/80 text-primary-foreground bg-slate-900  hover:bg-slate-900   ${
              isActive("/")
                ? "border border-border/20  !hover:border-border/10 "
                : ""
            } ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={() => router.push("/")}
          >
            <Home className="size-4" />
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full gap-4 transition-all duration-200  border-transparent rounded-none hover:text-primary-foreground/80 text-primary-foreground bg-slate-900  hover:bg-slate-900   ${
              isActive("/maquinas")
                ? "border border-border/20  !hover:border-border/10 "
                : ""
            } ${sidebarOpen ? "justify-start" : "justify-center"}`}
            onClick={() => router.push("/maquinas")}
          >
            <Users className="size-4" />
            {sidebarOpen && <span className="font-medium">Máquinas</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full gap-4  bg-transparent text-primary-foreground/40 hover:text-primary-foreground/40 hover:bg-transparent  cursor-not-allowed opacity-50
              ${sidebarOpen ? "justify-start" : "justify-center"}`}
            disabled
          >
            <Settings className="size-4" />
            {sidebarOpen && <span className="font-medium">Configurações</span>}
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t border-border/10">
        {sidebarOpen ? (
          <div className="flex items-center gap-2 text-primary-foreground">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm text-primary-foreground">
                {session.user.name}
              </p>
              <p className="text-muted-foreground text-xs truncate">
                {session.user.email}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border border-border/20 hover:border-border/10 bg-transparent text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent gap-2"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="w-full justify-center border border-border/20 hover:border-border/10 bg-transparent text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
