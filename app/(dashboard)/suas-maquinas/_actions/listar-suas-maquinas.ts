'use server';

import { headers } from 'next/headers';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { pecas } from '@/db/schema/pecas';
import { pecasNaMaquina } from '@/db/schema/pecas_na_maquina';
import type { ActionResult } from '@/db/schema/types';
import { userMaquinas } from '@/db/schema/user_maquinas';
import { auth } from '@/lib/auth/auth';

import { and, eq, sql } from 'drizzle-orm';

type ListarSuasMaquinasResult = {
  maquinas: {
    id: number;
    nome: string;
    imagem: string;
    totalPecas: number;
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Lista máquinas associadas ao usuário logado com paginação
export async function listarSuasMaquinas(
  page: number = 1,
  limit: number = 8
): Promise<ActionResult<ListarSuasMaquinasResult>> {
  try {
    // Obter sessão do usuário
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return {
        success: false,
        message: 'Usuário não autenticado',
        data: {
          maquinas: [],
          total: 0,
          page: 1,
          limit: 8,
          totalPages: 0
        }
      };
    }

    const userId = session.user.id;

    // Validação de parâmetros
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    // Query para contar total de máquinas do usuário
    const [{ total }] = await db
      .select({
        total: sql<number>`cast(count(*) as int)`
      })
      .from(userMaquinas)
      .where(eq(userMaquinas.userId, userId));

    // Query paginada para buscar máquinas do usuário com count de peças
    const resultado = await db
      .select({
        id: maquinas.id,
        nome: maquinas.nome,
        imagem: maquinas.imagem,
        totalPecas: sql<number>`cast(count(${pecasNaMaquina.id}) as int)`
      })
      .from(userMaquinas)
      .innerJoin(maquinas, eq(userMaquinas.maquinaId, maquinas.id))
      .leftJoin(pecasNaMaquina, eq(maquinas.id, pecasNaMaquina.maquinaId))
      .where(eq(userMaquinas.userId, userId))
      .groupBy(maquinas.id)
      .orderBy(maquinas.nome)
      .limit(validLimit)
      .offset(offset);

    const totalPages = Math.ceil(total / validLimit);

    return {
      success: true,
      message: 'Máquinas carregadas com sucesso',
      data: {
        maquinas: resultado,
        total,
        page: validPage,
        limit: validLimit,
        totalPages
      }
    };
  } catch (error) {
    console.error('Erro ao listar suas máquinas:', error);
    return {
      success: false,
      message: 'Erro ao carregar suas máquinas',
      data: {
        maquinas: [],
        total: 0,
        page: 1,
        limit: 8,
        totalPages: 0
      }
    };
  }
}

// Busca uma máquina específica do usuário com suas peças
export async function buscarSuaMaquina(maquinaId: number) {
  try {
    // Obter sessão do usuário
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return {
        success: false,
        message: 'Usuário não autenticado'
      };
    }

    const userId = session.user.id;

    // Verificar se a máquina pertence ao usuário
    const [associacao] = await db
      .select()
      .from(userMaquinas)
      .where(
        and(
          eq(userMaquinas.userId, userId),
          eq(userMaquinas.maquinaId, maquinaId)
        )
      )
      .limit(1);

    if (!associacao) {
      return {
        success: false,
        message: 'Máquina não encontrada ou você não tem acesso a ela'
      };
    }

    // Buscar dados da máquina e suas peças
    const [maquinaResult, pecasResult] = await Promise.all([
      db.select().from(maquinas).where(eq(maquinas.id, maquinaId)).limit(1),
      db
        .select({
          id: pecasNaMaquina.id,
          pecaId: pecasNaMaquina.pecaId,
          nome: pecas.nome,
          linkLojaIntegrada: pecas.linkLojaIntegrada,
          localizacao: pecasNaMaquina.localizacao
        })
        .from(pecasNaMaquina)
        .innerJoin(pecas, eq(pecasNaMaquina.pecaId, pecas.id))
        .where(eq(pecasNaMaquina.maquinaId, maquinaId))
    ]);

    if (!maquinaResult || maquinaResult.length === 0) {
      return {
        success: false,
        message: 'Máquina não encontrada'
      };
    }

    return {
      success: true,
      data: {
        ...maquinaResult[0],
        pecas: pecasResult
      }
    };
  } catch (error) {
    console.error('Erro ao buscar sua máquina:', error);
    return {
      success: false,
      message: 'Erro ao carregar máquina'
    };
  }
}
