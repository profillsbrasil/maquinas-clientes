"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { redirectIfNotAuthenticated } from "@/lib/auth-helpers";
import Sidebar from "./_components/sidebar/Sidebar";
import Header from "./_components/sidebar/Header";
import { GridPatternBg } from "@/components/gridPatternBg";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/maquinas": "Máquinas",
  "/configuracoes": "Configurações",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageTitle = routeTitles[pathname] || "Dashboard";

  useEffect(() => {
    redirectIfNotAuthenticated(session, isPending, router);
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <GridPatternBg />
      <Sidebar
        session={session}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title={pageTitle}
        />
        {children}
      </div>
    </div>
  );
}
