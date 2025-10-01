"use client";

import { useRouter } from "next/navigation";
import { handleLogout } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Home, Users, Settings, LogOut } from "lucide-react";

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

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-card border-r transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex-1">
        <h2
          className={`text-xl font-bold mb-6 ${
            sidebarOpen ? "" : "text-center"
          }`}
        >
          {sidebarOpen ? "Profills" : "P"}
        </h2>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full ${
              sidebarOpen ? "justify-start" : "justify-center"
            } gap-2`}
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4" />
            {sidebarOpen && "Dashboard"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full ${
              sidebarOpen ? "justify-start" : "justify-center"
            } gap-2`}
            onClick={() => router.push("/clientes")}
          >
            <Users className="h-4 w-4" />
            {sidebarOpen && "Clientes"}
          </Button>
          <Button
            variant="ghost"
            className={`w-full ${
              sidebarOpen ? "justify-start" : "justify-center"
            } gap-2`}
            disabled
          >
            <Settings className="h-4 w-4" />
            {sidebarOpen && "Configurações"}
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">
                {session.user.name}
              </p>
              <p className="text-muted-foreground text-xs truncate">
                {session.user.email}
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
