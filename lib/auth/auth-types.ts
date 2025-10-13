/**
 * Types customizados para Better Auth
 * Usa tipos inferidos automaticamente dos schemas Drizzle
 */
import type { Role, User } from '@/db/schema/types';

/**
 * Tipo do usuário na sessão retornado pelo Better Auth
 * Baseado no User do schema mas com campos opcionais que o Better Auth pode não retornar
 */
export type SessionUser = Pick<
  User,
  'id' | 'name' | 'email' | 'emailVerified' | 'createdAt' | 'updatedAt'
> & {
  image?: string | null;
  status?: boolean;
  role?: Role;
  userPhone?: string | null;
  companyName?: string | null;
  companyCnpj?: string | null;
};

/**
 * Tipo da sessão do Better Auth
 */
export type BetterAuthSession = {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Tipo da sessão completa retornada pelo Better Auth
 * Combina dados da sessão com dados do usuário
 */
export type Session = {
  session: BetterAuthSession;
  user: SessionUser;
};
