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

// Lista todas as máquinas com count de peças
// Query otimizada: busca APENAS os campos necessários
export async function listarMaquinas() {
  try {
    const resultado = await db
      .select({
        id: maquinas.id,
        nome: maquinas.nome,
        imagem: maquinas.imagem, // URL da imagem (não base64)
        totalPecas: sql<number>`cast(count(${pecasNaMaquina.id}) as int)`
      })
      .from(maquinas)
      .leftJoin(pecasNaMaquina, eq(maquinas.id, pecasNaMaquina.maquinaId))
      .groupBy(maquinas.id)
      .orderBy(maquinas.nome); // Ordenar por nome é mais útil

    return {
      success: true,
      data: resultado
    };
  } catch (error) {
    console.error('Erro ao listar máquinas:', error);
    return {
      success: false,
      message: 'Erro ao carregar máquinas',
      data: []
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
