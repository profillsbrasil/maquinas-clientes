import { NextRequest, NextResponse } from 'next/server';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { user } from '@/db/schema/user';
import { userMaquinas } from '@/db/schema/user_maquinas';

import { and, eq, inArray } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AddMaquinasRequest = {
  email: string;
  maquinaIds: number[];
};

type ApiResponse = {
  success: boolean;
  message: string;
  data?: {
    added: number;
    skipped: number;
    total: number;
  };
};

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    console.error('API_KEY não configurada no .env');
    return false;
  }

  return apiKey === validApiKey;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Validar API Key
    if (!validateApiKey(request)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'API Key inválida ou ausente' },
        { status: 401 }
      );
    }

    // Parse do body
    const body = (await request.json()) as AddMaquinasRequest;

    // Validações
    if (!body.email || !body.maquinaIds) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Email e maquinaIds são obrigatórios'
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.maquinaIds) || body.maquinaIds.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'maquinaIds deve ser um array não vazio'
        },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    const userRecord = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, body.email))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `Usuário com email ${body.email} não encontrado`
        },
        { status: 404 }
      );
    }

    const userId = userRecord[0].id;

    // Verificar se as máquinas existem
    const maquinasExistentes = await db
      .select({ id: maquinas.id })
      .from(maquinas)
      .where(inArray(maquinas.id, body.maquinaIds));

    const maquinasExistentesIds = maquinasExistentes.map((m) => m.id);
    const maquinasInvalidas = body.maquinaIds.filter(
      (id) => !maquinasExistentesIds.includes(id)
    );

    if (maquinasInvalidas.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `Máquinas não encontradas: ${maquinasInvalidas.join(', ')}`
        },
        { status: 404 }
      );
    }

    // Verificar quais máquinas já estão associadas ao usuário
    const maquinasJaAssociadas = await db
      .select({ maquinaId: userMaquinas.maquinaId })
      .from(userMaquinas)
      .where(
        and(
          eq(userMaquinas.userId, userId),
          inArray(userMaquinas.maquinaId, body.maquinaIds)
        )
      );

    const idsJaAssociados = maquinasJaAssociadas.map((m) => m.maquinaId);
    const maquinasParaAdicionar = body.maquinaIds.filter(
      (id) => !idsJaAssociados.includes(id)
    );

    // Inserir apenas as novas associações
    let adicionadas = 0;
    if (maquinasParaAdicionar.length > 0) {
      const valores = maquinasParaAdicionar.map((maquinaId) => ({
        userId,
        maquinaId
      }));

      await db.insert(userMaquinas).values(valores);
      adicionadas = valores.length;
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Máquinas processadas com sucesso',
        data: {
          added: adicionadas,
          skipped: idsJaAssociados.length,
          total: body.maquinaIds.length
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao adicionar máquinas ao usuário:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
