'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { handleLogout, hasRole } from '@/lib/auth/auth-helpers';
import type { Session } from '@/lib/auth/auth-types';
import iconeProfills from '@/public/icon.png';

import NavButton from './NavButton';
import { navItems } from './nav-config';
import { LogOut } from 'lucide-react';

type SidebarProps = {
  session: Session;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({ session, sidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const canAccessItem = (item: (typeof navItems)[number]) => {
    if (!item.allowedRoles) return true;
    return hasRole(session, item.allowedRoles);
  };

  const visibleItems = navItems.filter(canAccessItem);

  return (
    <div
      className={`h-full relative transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 z-10 fixed left-0 top-0 h-full border-r border-border/10 transition-all duration-300 flex flex-col`}>
        <div className='py-4 flex-1'>
          <Link
            href='/'
            className={`text-xl font-bold mb-6 border-b border-border/10 pb-2 flex items-center justify-center transition-all duration-300 fade-in ${
              sidebarOpen ? '' : 'text-center'
            }`}>
            {sidebarOpen ? (
              <div className='flex items-center font-bold text-2xl text-primary-foreground'>
                <Image src={iconeProfills} alt='Logo' className='w-10 h-10' />{' '}
                Profills
              </div>
            ) : (
              <Image src={iconeProfills} alt='Logo' className='w-10 h-10' />
            )}
          </Link>

          <nav className='space-y-2'>
            {visibleItems.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                isActive={isActive(item.path)}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </nav>
        </div>

        <div className='flex px-4 items-center justify-center border-t border-border/10 h-14 w-full'>
          {sidebarOpen ? (
            <div className='flex items-center gap-2 text-primary-foreground w-full justify-between'>
              <div className='flex flex-col min-w-0'>
                <p className='font-medium truncate text-sm text-primary-foreground'>
                  {session.user.name}
                </p>
                <p className='text-muted-foreground text-xs truncate'>
                  {session.user.email}
                </p>
              </div>
              <Button
                variant='outline'
                size='icon'
                className='border border-border/20 hover:border-border/10 bg-transparent text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent gap-2'
                onClick={handleLogout}>
                <LogOut className='size-4' />
              </Button>
            </div>
          ) : (
            <Button
              variant='outline'
              size='icon'
              className='w-full justify-center border border-border/20 hover:border-border/10 bg-transparent text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent gap-2'
              onClick={handleLogout}>
              <LogOut className='size-4' />
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
