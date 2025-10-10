import db from '@/db/connection';
import { schema } from '@/db/schema';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nanoid } from 'nanoid';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128
  },

  // Campos adicionais do usuário
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'cliente',
        input: false // Não permite que o usuário defina o role ao se registrar
      }
    }
  },

  // URL base da aplicação (OBRIGATÓRIO para Vercel)
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

  // Secret para assinar tokens (OBRIGATÓRIO para produção)
  secret: process.env.BETTER_AUTH_SECRET,

  // Configurações de sessão
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualiza a cada 24 horas
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache de 5 minutos
    }
  },

  // Origens confiáveis
  trustedOrigins: [
    'http://localhost:3000',
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  ].filter(Boolean) as string[],

  // Configurações de segurança
  advanced: {
    cookiePrefix: 'auth',
    crossSubDomainCookies: {
      enabled: false
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    generateId: () => nanoid(8)
  }
});
