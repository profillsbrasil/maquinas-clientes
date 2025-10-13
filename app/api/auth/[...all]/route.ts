import { auth } from '@/lib/auth/auth';

import { toNextJsHandler } from 'better-auth/next-js';

// Configuração de runtime para Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { POST, GET } = toNextJsHandler(auth);
