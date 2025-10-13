'use server';

import { revalidatePath } from 'next/cache';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { pecas } from '@/db/schema/pecas';
import { pecasNaMaquina } from '@/db/schema/pecas_na_maquina';
import type { ActionResult } from '@/db/schema/types';

// Lista peças disponíveis para adicionar
export async function listarPecasDisponiveis(): Promise<
  ActionResult<{ id: number; nome: string; linkLojaIntegrada: string }[]>
> {
  try {
    const resultado = await db
      .select({
        id: pecas.id,
        nome: pecas.nome,
        linkLojaIntegrada: pecas.linkLojaIntegrada
      })
      .from(pecas)
      .orderBy(pecas.nome);

    return {
      success: true,
      message: 'Peças carregadas',
      data: resultado
    };
  } catch (error) {
    console.error('Erro ao listar peças:', error);
    return {
      success: false,
      message: 'Erro ao carregar peças',
      data: []
    };
  }
}

// Cria máquina e adiciona peças em uma transação
export async function criarMaquinaCompleta(
  nome: string,
  imagemUrl: string,
  pecasParaAdicionar: { pecaId: number; localizacao: number }[]
): Promise<ActionResult<{ id: number }>> {
  try {
    // Validações
    if (!nome.trim()) {
      return {
        success: false,
        message: 'Nome da máquina é obrigatório'
      };
    }

    if (!imagemUrl) {
      return {
        success: false,
        message: 'Imagem da máquina é obrigatória'
      };
    }

    if (pecasParaAdicionar.length === 0) {
      return {
        success: false,
        message: 'Adicione pelo menos uma peça'
      };
    }

    // Criar máquina e adicionar peças em transação
    const resultado = await db.transaction(async (tx) => {
      const [novaMaquina] = await tx
        .insert(maquinas)
        .values({
          nome: nome.trim(),
          imagem: imagemUrl
        })
        .returning({ id: maquinas.id });

      // Adicionar peças em batch
      await tx.insert(pecasNaMaquina).values(
        pecasParaAdicionar.map((p) => ({
          maquinaId: novaMaquina.id,
          pecaId: p.pecaId,
          localizacao: p.localizacao
        }))
      );

      return novaMaquina;
    });

    revalidatePath('/maquinas');

    return {
      success: true,
      message: 'Máquina criada com sucesso!',
      data: { id: resultado.id }
    };
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    return {
      success: false,
      message: 'Erro ao criar máquina'
    };
  }
}
