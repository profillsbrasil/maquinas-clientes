/**
 * 💡 EXEMPLOS PRÁTICOS: Como usar os dados de sessão
 * 
 * Agora que você entende o que está no banco,
 * veja como pode aproveitar esses dados!
 */

// ============================================
// 1️⃣ PAINEL DE SESSÕES ATIVAS
// ============================================

// app/api/sessions/route.ts
import { auth } from '@/lib/auth';
import db from '@/db/connection';
import { session } from '@/db/schema/session';
import { eq, gt } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Pega o usuário logado
  const authSession = await auth.api.getSession({
    headers: req.headers
  });

  if (!authSession?.user) {
    return Response.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // Busca todas as sessões ativas do usuário
  const activeSessions = await db
    .select()
    .from(session)
    .where(
      eq(session.userId, authSession.user.id)
      // Você pode adicionar: gt(session.expiresAt, new Date())
    );

  return Response.json({
    sessions: activeSessions.map(s => ({
      id: s.id,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrentSession: s.token === authSession.session.token
    }))
  });
}

// ============================================
// 2️⃣ COMPONENTE: LISTA DE DISPOSITIVOS
// ============================================

// app/(dashboard)/perfil/sessoes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrentSession: boolean;
}

export default function SessoesPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data.sessions));
  }, []);

  const revokeSession = async (sessionId: string) => {
    await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return '📱';
    if (userAgent.includes('Windows')) return '💻';
    if (userAgent.includes('Mac')) return '🖥️';
    if (userAgent.includes('Linux')) return '🐧';
    return '🌐';
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Navegador desconhecido';
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sessões Ativas</h1>
      
      <div className="space-y-4">
        {sessions.map(session => (
          <Card key={session.id} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-3xl">
                  {getDeviceIcon(session.userAgent)}
                </span>
                <div>
                  <p className="font-semibold">
                    {getBrowserName(session.userAgent)}
                    {session.isCurrentSession && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Sessão atual
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    IP: {session.ipAddress}
                  </p>
                  <p className="text-xs text-gray-500">
                    Criado: {new Date(session.createdAt).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expira: {new Date(session.expiresAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              
              {!session.isCurrentSession && (
                <Button
                  variant="destructive"
                  onClick={() => revokeSession(session.id)}
                >
                  Revogar
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 3️⃣ REVOGAR SESSÃO (Logout Remoto)
// ============================================

// app/api/sessions/[id]/route.ts
import { auth } from '@/lib/auth';
import db from '@/db/connection';
import { session } from '@/db/schema/session';
import { eq, and } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;
  
  const authSession = await auth.api.getSession({
    headers: req.headers
  });

  if (!authSession?.user) {
    return Response.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // Deleta a sessão (apenas se for do próprio usuário)
  await db
    .delete(session)
    .where(
      and(
        eq(session.id, sessionId),
        eq(session.userId, authSession.user.id)
      )
    );

  return Response.json({ success: true });
}

// ============================================
// 4️⃣ NOTIFICAÇÃO DE NOVO LOGIN
// ============================================

// lib/notify-new-login.ts
import db from '@/db/connection';
import { session } from '@/db/schema/session';
import { eq } from 'drizzle-orm';

export async function notifyNewLogin(userId: string, newIpAddress: string) {
  // Busca a última sessão desse usuário
  const lastSession = await db
    .select()
    .from(session)
    .where(eq(session.userId, userId))
    .orderBy(session.createdAt)
    .limit(2); // Pega as 2 últimas

  if (lastSession.length === 2) {
    const [previous, current] = lastSession;
    
    // Se o IP mudou, pode ser um login suspeito
    if (previous.ipAddress !== current.ipAddress) {
      console.log(`⚠️ Novo login detectado!
        Usuário: ${userId}
        IP anterior: ${previous.ipAddress}
        IP novo: ${current.ipAddress}
        Navegador: ${current.userAgent}
      `);
      
      // Aqui você poderia:
      // - Enviar email de notificação
      // - Enviar SMS
      // - Registrar em log de segurança
      // - Pedir autenticação 2FA
    }
  }
}

// ============================================
// 5️⃣ MIDDLEWARE DE SEGURANÇA
// ============================================

// app/api/auth/validate-session.ts
import { auth } from '@/lib/auth';
import db from '@/db/connection';
import { session } from '@/db/schema/session';
import { eq, and, gt } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function validateSessionSecurity(req: NextRequest) {
  const authSession = await auth.api.getSession({
    headers: req.headers
  });

  if (!authSession?.session) {
    return { valid: false, reason: 'Sessão não encontrada' };
  }

  // Busca a sessão no banco
  const dbSession = await db
    .select()
    .from(session)
    .where(eq(session.id, authSession.session.id))
    .limit(1);

  if (dbSession.length === 0) {
    return { valid: false, reason: 'Sessão revogada' };
  }

  const currentSession = dbSession[0];
  const currentIp = req.ip || req.headers.get('x-forwarded-for');
  const currentUserAgent = req.headers.get('user-agent');

  // Validações de segurança
  if (currentSession.expiresAt < new Date()) {
    return { valid: false, reason: 'Sessão expirada' };
  }

  if (currentSession.ipAddress !== currentIp) {
    // IP mudou - pode ser sequestro de sessão
    console.warn(`⚠️ IP mudou durante a sessão:
      Original: ${currentSession.ipAddress}
      Atual: ${currentIp}
    `);
    
    // Você pode:
    // - Invalidar a sessão
    // - Pedir confirmação
    // - Aceitar (alguns usuários mudam de rede)
  }

  if (currentSession.userAgent !== currentUserAgent) {
    // User-Agent mudou - muito suspeito!
    return { valid: false, reason: 'User-Agent não corresponde' };
  }

  return { valid: true };
}

// ============================================
// 6️⃣ ESTATÍSTICAS DE USO
// ============================================

// app/api/admin/stats/route.ts
import db from '@/db/connection';
import { session, user } from '@/db/schema';
import { sql, gt } from 'drizzle-orm';

export async function GET() {
  // Sessões ativas agora
  const activeSessions = await db
    .select({ count: sql<number>`count(*)` })
    .from(session)
    .where(gt(session.expiresAt, new Date()));

  // Usuários únicos logados hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const activeUsers = await db
    .select({ count: sql<number>`count(DISTINCT user_id)` })
    .from(session)
    .where(gt(session.createdAt, today));

  // Top IPs
  const topIps = await db
    .select({
      ipAddress: session.ipAddress,
      count: sql<number>`count(*)`
    })
    .from(session)
    .groupBy(session.ipAddress)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

  return Response.json({
    activeSessions: activeSessions[0].count,
    activeUsersToday: activeUsers[0].count,
    topIps
  });
}

// ============================================
// 💡 DICA EXTRA: Limpar sessões expiradas
// ============================================

// scripts/cleanup-sessions.ts
import db from '@/db/connection';
import { session } from '@/db/schema/session';
import { lt } from 'drizzle-orm';

export async function cleanupExpiredSessions() {
  const result = await db
    .delete(session)
    .where(lt(session.expiresAt, new Date()));
  
  console.log(`🧹 Limpeza: ${result.rowsAffected} sessões expiradas removidas`);
}

// Execute isso num cron job diário
// Ou adicione no seu package.json:
// "cleanup": "tsx scripts/cleanup-sessions.ts"

