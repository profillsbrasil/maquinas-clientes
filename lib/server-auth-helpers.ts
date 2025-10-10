/**
 * Helpers de autenticação para uso em Server Actions e Server Components
 */
'use server';

import { headers } from 'next/headers';

import type { Role } from '@/db/schema/user';

import { auth } from './auth';
import type { Session } from './auth-types';

/**
 * Helpers de autenticação para uso em Server Actions e Server Components
 */

/**
 * Helpers de autenticação para uso em Server Actions e Server Components
 */

/**
 * Obtém a sessão do usuário no servidor
 * Usa os headers da requisição para validar a sessão
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    return session as Session | null;
  } catch {
    return null;
  }
}

/**
 * Verifica se o usuário está autenticado
 * Lança erro se não estiver
 */
export async function requireAuth(): Promise<Session> {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Não autorizado. Faça login para continuar.');
  }

  return session;
}

/**
 * Verifica se o usuário tem um dos roles permitidos
 * Lança erro se não tiver permissão
 */
export async function requireRole(allowedRoles: Role[]): Promise<Session> {
  const session = await requireAuth();

  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    throw new Error(
      `Acesso negado. Permissão necessária: ${allowedRoles.join(' ou ')}`
    );
  }

  return session;
}

/**
 * Verifica se o usuário é admin
 */
export async function requireAdmin(): Promise<Session> {
  return requireRole(['admin']);
}

/**
 * Verifica se o usuário é engenheiro ou admin
 */
export async function requireEngineerOrAdmin(): Promise<Session> {
  return requireRole(['engenheiro', 'admin']);
}

/**
 * Verifica se o usuário tem permissão (retorna boolean ao invés de lançar erro)
 */
export async function hasPermission(allowedRoles: Role[]): Promise<boolean> {
  try {
    const session = await getServerSession();
    if (!session?.user?.role) return false;
    return allowedRoles.includes(session.user.role);
  } catch {
    return false;
  }
}
