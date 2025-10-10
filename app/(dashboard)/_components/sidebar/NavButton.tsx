import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { NavItem } from './nav-config';

type NavButtonProps = {
  item: NavItem;
  isActive: boolean;
  sidebarOpen: boolean;
};

export default function NavButton({
  item,
  isActive,
  sidebarOpen
}: NavButtonProps) {
  const router = useRouter();
  const Icon = item.icon;

  const baseClasses =
    'w-full gap-4 transition-all duration-200 border-transparent rounded-none hover:text-primary-foreground/80 text-primary-foreground bg-slate-900 hover:bg-slate-900';

  const activeClasses = isActive ? 'border-y border-border/20' : '';

  const alignmentClasses = sidebarOpen ? 'justify-start' : 'justify-center';

  const disabledClasses = item.disabled
    ? 'bg-transparent text-primary-foreground/40 hover:text-primary-foreground/40 hover:bg-transparent cursor-not-allowed opacity-50'
    : '';

  return (
    <Button
      variant='ghost'
      disabled={item.disabled}
      className={cn(
        baseClasses,
        activeClasses,
        alignmentClasses,
        disabledClasses
      )}
      onClick={() => router.push(item.path)}>
      <Icon className='size-4' />
      {sidebarOpen && <span className='font-medium'>{item.label}</span>}
    </Button>
  );
}
