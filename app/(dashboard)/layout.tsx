'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useSession } from '@/lib/auth/auth-client';
import { redirectIfNotAuthenticated } from '@/lib/auth/auth-helpers';
import type { Session } from '@/lib/auth/auth-types';
import QueryProvider from '@/lib/providers/QueryProvider';

import Header from './_components/sidebar/Header';
import Sidebar from './_components/sidebar/Sidebar';
import { getPageTitle } from './_components/sidebar/nav-config';
import { useRouteProtection } from './_hooks/useRouteProtection';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    redirectIfNotAuthenticated(session, isPending, router);
  }, [session, isPending, router]);

  // Proteção de rotas baseada em permissões
  useRouteProtection(session as Session | null);

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
    <QueryProvider>
      <div className='flex min-h-screen'>
        <Sidebar
          session={session as Session}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className='flex-1 flex flex-col'>
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={pageTitle}
          />
          <div className='pt-16 flex-1'>{children}</div>
        </div>
      </div>
    </QueryProvider>
  );
}
