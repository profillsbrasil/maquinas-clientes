import db from '@/db/connection';
import { schema } from '@/db/schema';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Defina como true se quiser verificação de email
    minPasswordLength: 8,
    maxPasswordLength: 128
  },
  // Configurações de sessão
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualiza a cada 24 horas
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache de 5 minutos
    }
  },
  // Origens confiáveis (adicione seu domínio de produção aqui)
  trustedOrigins: [
    'http://localhost:3000',
    process.env.BETTER_AUTH_URL || '',
    process.env.NEXT_PUBLIC_APP_URL || ''
  ].filter(Boolean),
  // Configurações de segurança
  advanced: {
    cookiePrefix: 'auth',
    crossSubDomainCookies: {
      enabled: false
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    generateId: undefined // Usa o gerador padrão do Better Auth
  }
});
