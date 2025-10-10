import { NextRequest, NextResponse } from 'next/server';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type MaquinaResponse = {
  id: number;
  nome: string;
};

type ApiResponse = {
  success: boolean;
  data?: MaquinaResponse[];
  message?: string;
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validar API Key
    if (!validateApiKey(request)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'API Key inválida ou ausente' },
        { status: 401 }
      );
    }

    // Buscar todas as máquinas (apenas id e nome)
    const maquinasDisponiveis = await db
      .select({
        id: maquinas.id,
        nome: maquinas.nome
      })
      .from(maquinas)
      .orderBy(maquinas.nome);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: maquinasDisponiveis
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao listar máquinas:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Erro ao buscar máquinas' },
      { status: 500 }
    );
  }
}
