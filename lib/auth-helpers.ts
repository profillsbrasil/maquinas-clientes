/**
 * Helpers de autenticação para uso em componentes client
 */
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import type { Role } from '@/db/schema/user';

import { signOut as authSignOut } from './auth-client';
import type { Session } from './auth-types';

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

/**
 * Verifica se o usuário tem permissão baseado no role
 */
export function hasRole(
  session: Session | null,
  allowedRoles: Role[]
): boolean {
  if (!session?.user?.role) return false;
  return allowedRoles.includes(session.user.role);
}

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === 'admin';
}

/**
 * Verifica se o usuário é engenheiro ou admin
 */
export function isEngineerOrAdmin(session: Session | null): boolean {
  return hasRole(session, ['engenheiro', 'admin']);
}

/**
 * Verifica se o usuário é cliente
 */
export function isClient(session: Session | null): boolean {
  return session?.user?.role === 'cliente';
}
