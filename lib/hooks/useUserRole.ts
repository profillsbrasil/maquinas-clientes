/**
 * Hook customizado para acessar o role do usuário
 */
'use client';

import type { Role } from '@/db/schema/user';

import { useSession } from '../auth/auth-client';
import type { Session } from '../auth/auth-types';

/**
 * Hook customizado para acessar o role do usuário
 */

/**
 * Hook customizado para acessar o role do usuário
 */

/**
 * Hook customizado para acessar o role do usuário
 */

/**
 * Hook customizado para acessar o role do usuário
 */

export function useUserRole() {
  const { data: session, isPending } = useSession();

  const typedSession = session as Session | null;
  const role: Role | null = typedSession?.user?.role || null;

  return {
    role,
    isLoading: isPending,
    isCliente: role === 'cliente',
    isEngenheiro: role === 'engenheiro',
    isAdmin: role === 'admin',
    hasRole: (allowedRoles: Role[]) =>
      role !== null && allowedRoles.includes(role)
  };
}
