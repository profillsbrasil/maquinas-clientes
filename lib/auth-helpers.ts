/**
 * Helpers de autenticação para uso em componentes client
 */
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { signOut as authSignOut } from './auth-client';

/**
 * Função unificada de logout
 * Desloga o usuário e redireciona para login
 */
export async function handleLogout() {
  await authSignOut();
  window.location.href = '/login';
}

/**
 * Redireciona para login se não estiver autenticado
 * Uso: No useEffect de páginas protegidas
 */
export function redirectIfNotAuthenticated(
  session: unknown,
  isPending: boolean,
  router: AppRouterInstance
) {
  if (!isPending && !session) {
    router.push('/login');
  }
}
