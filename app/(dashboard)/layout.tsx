'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { GridPatternBg } from '@/components/gridPatternBg';
import { useSession } from '@/lib/auth-client';
import { redirectIfNotAuthenticated } from '@/lib/auth-helpers';

import Header from './_components/sidebar/Header';
import Sidebar from './_components/sidebar/Sidebar';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/maquinas': 'Suas Maquinas',
  '/configuracoes': 'Configurações'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageTitle = routeTitles[pathname] || 'Dashboard';

  useEffect(() => {
    redirectIfNotAuthenticated(session, isPending, router);
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className='flex min-h-screen'>
      <Sidebar
        session={session}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className='flex-1 flex flex-col'>
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
