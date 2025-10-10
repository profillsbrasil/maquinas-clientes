import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { hasRole } from '@/lib/auth-helpers';
import type { Session } from '@/lib/auth-types';

import { navItems } from '../_components/sidebar/nav-config';

/**
 * Hook para proteger rotas baseado nas permissões do nav-config
 * Redireciona para / se o usuário não tiver permissão
 */
export function useRouteProtection(session: Session | null) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session) return;

    // Encontra o item de navegação correspondente à rota atual
    const currentRoute = navItems.find((item) => {
      if (item.path === '/') {
        return pathname === item.path;
      }
      return pathname.startsWith(item.path);
    });

    // Se não encontrou rota configurada, permite (pode ser uma rota dinâmica)
    if (!currentRoute) return;

    // Se a rota não tem restrições, permite
    if (!currentRoute.allowedRoles) return;

    // Verifica se o usuário tem permissão
    const hasPermission = hasRole(session, currentRoute.allowedRoles);

    if (!hasPermission) {
      console.warn(
        `Acesso negado à rota ${pathname}. Redirecionando para dashboard.`
      );
      router.replace('/');
    }
  }, [session, pathname, router]);
}
