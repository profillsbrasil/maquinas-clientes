'use server';

import { revalidatePath } from 'next/cache';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { pecas } from '@/db/schema/pecas';
import { pecasNaMaquina } from '@/db/schema/pecas_na_maquina';
import { del } from '@vercel/blob';

import { eq, sql } from 'drizzle-orm';

type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

type ListarMaquinasResult = {
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

// Lista todas as máquinas com paginação
// Query otimizada: busca APENAS os campos necessários com offset/limit
export async function listarMaquinas(
  page: number = 1,
  limit: number = 8
): Promise<ActionResult<ListarMaquinasResult>> {
  try {
    // Validação de parâmetros
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // Máx 100 por página
    const offset = (validPage - 1) * validLimit;

    // Query para contar total de máquinas (sem join para performance)
    const [{ total }] = await db
      .select({
        total: sql<number>`cast(count(*) as int)`
      })
      .from(maquinas);

    // Query paginada para buscar máquinas com count de peças
    const resultado = await db
      .select({
        id: maquinas.id,
        nome: maquinas.nome,
        imagem: maquinas.imagem,
        totalPecas: sql<number>`cast(count(${pecasNaMaquina.id}) as int)`
      })
      .from(maquinas)
      .leftJoin(pecasNaMaquina, eq(maquinas.id, pecasNaMaquina.maquinaId))
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
    console.error('Erro ao listar máquinas:', error);
    return {
      success: false,
      message: 'Erro ao carregar máquinas',
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

// Busca uma máquina com suas peças
export async function buscarMaquina(id: number) {
  try {
    const [maquinaResult, pecasResult] = await Promise.all([
      db.select().from(maquinas).where(eq(maquinas.id, id)).limit(1),
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
        .where(eq(pecasNaMaquina.maquinaId, id))
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
    console.error('Erro ao buscar máquina:', error);
    return {
      success: false,
      message: 'Erro ao carregar máquina'
    };
  }
}

// Deleta uma máquina e sua imagem do Blob Storage
export async function deletarMaquina(id: number): Promise<ActionResult> {
  try {
    // Buscar a máquina para obter a URL da imagem
    const [maquina] = await db
      .select({ imagem: maquinas.imagem })
      .from(maquinas)
      .where(eq(maquinas.id, id))
      .limit(1);

    if (!maquina) {
      return {
        success: false,
        message: 'Máquina não encontrada'
      };
    }

    // Deletar a imagem do Blob Storage (se for URL do Blob)
    if (maquina.imagem && maquina.imagem.includes('blob.vercel-storage.com')) {
      try {
        await del(maquina.imagem);
      } catch (blobError) {
        // Log do erro mas não falha a operação
        console.error('Erro ao deletar imagem do Blob:', blobError);
        // Continua com a deleção da máquina mesmo se a imagem falhar
      }
    }

    // Deletar a máquina do banco (cascade vai deletar peças relacionadas)
    await db.delete(maquinas).where(eq(maquinas.id, id));

    revalidatePath('/maquinas');

    return {
      success: true,
      message: 'Máquina deletada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao deletar máquina:', error);
    return {
      success: false,
      message: 'Erro ao deletar máquina'
    };
  }
}
