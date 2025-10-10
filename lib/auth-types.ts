/**
 * Types customizados para Better Auth
 * Extende os tipos padrão para incluir o campo role
 */
import type { Role } from '@/db/schema/user';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: Role; // Opcional até o Better Auth retornar
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  user: SessionUser;
};
