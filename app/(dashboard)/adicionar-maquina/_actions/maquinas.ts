'use server';

import { revalidatePath } from 'next/cache';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { pecas } from '@/db/schema/pecas';
import { pecasNaMaquina } from '@/db/schema/pecas_na_maquina';

import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

// Listar todas as peças disponíveis
export async function listarPecasDisponiveis(): Promise<
  ActionResult<(typeof pecas.$inferSelect)[]>
> {
  try {
    const todasPecas = await db.select().from(pecas).orderBy(pecas.nome);

    return {
      success: true,
      message: 'Peças carregadas',
      data: todasPecas
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

// Adicionar peça na máquina
export async function adicionarPecaNaMaquina(
  maquinaId: string,
  pecaId: string,
  localizacao: number
): Promise<ActionResult> {
  try {
    // Verificar se já existe uma peça nessa localização
    const [pecaExistente] = await db
      .select()
      .from(pecasNaMaquina)
      .where(
        and(
          eq(pecasNaMaquina.maquinaId, maquinaId),
          eq(pecasNaMaquina.localizacao, localizacao)
        )
      );

    if (pecaExistente) {
      return {
        success: false,
        message: 'Já existe uma peça nesta localização'
      };
    }

    await db.insert(pecasNaMaquina).values({
      id: nanoid(),
      maquinaId,
      pecaId,
      localizacao
    });

    revalidatePath('/adicionar-maquina');

    return {
      success: true,
      message: 'Peça adicionada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao adicionar peça na máquina:', error);
    return {
      success: false,
      message: 'Erro ao adicionar peça'
    };
  }
}

// Remover peça da máquina
export async function removerPecaDaMaquina(
  pecaNaMaquinaId: string
): Promise<ActionResult> {
  try {
    await db
      .delete(pecasNaMaquina)
      .where(eq(pecasNaMaquina.id, pecaNaMaquinaId));

    revalidatePath('/adicionar-maquina');

    return {
      success: true,
      message: 'Peça removida com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao remover peça:', error);
    return {
      success: false,
      message: 'Erro ao remover peça'
    };
  }
}

// Listar peças de uma máquina específica
export async function listarPecasDaMaquina(maquinaId: string): Promise<
  ActionResult<
    Array<{
      id: string;
      localizacao: number;
      peca: typeof pecas.$inferSelect;
    }>
  >
> {
  try {
    const pecasDaMaquina = await db
      .select({
        id: pecasNaMaquina.id,
        localizacao: pecasNaMaquina.localizacao,
        peca: pecas
      })
      .from(pecasNaMaquina)
      .innerJoin(pecas, eq(pecasNaMaquina.pecaId, pecas.id))
      .where(eq(pecasNaMaquina.maquinaId, maquinaId));

    return {
      success: true,
      message: 'Peças carregadas',
      data: pecasDaMaquina
    };
  } catch (error) {
    console.error('Erro ao listar peças da máquina:', error);
    return {
      success: false,
      message: 'Erro ao carregar peças',
      data: []
    };
  }
}

// Criar nova máquina
export async function criarMaquina(
  nome: string,
  imagem: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const id = nanoid();

    await db.insert(maquinas).values({
      id,
      nome,
      imagem
    });

    revalidatePath('/maquinas');
    revalidatePath('/adicionar-maquina');

    return {
      success: true,
      message: 'Máquina criada com sucesso!',
      data: { id }
    };
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    return {
      success: false,
      message: 'Erro ao criar máquina'
    };
  }
}

// Atualizar máquina
export async function atualizarMaquina(
  id: string,
  nome: string,
  imagem: string
): Promise<ActionResult> {
  try {
    await db.update(maquinas).set({ nome, imagem }).where(eq(maquinas.id, id));

    revalidatePath('/maquinas');
    revalidatePath('/adicionar-maquina');

    return {
      success: true,
      message: 'Máquina atualizada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao atualizar máquina:', error);
    return {
      success: false,
      message: 'Erro ao atualizar máquina'
    };
  }
}

// Obter dados da máquina
export async function obterMaquina(
  id: string
): Promise<ActionResult<typeof maquinas.$inferSelect>> {
  try {
    const [maquina] = await db
      .select()
      .from(maquinas)
      .where(eq(maquinas.id, id));

    if (!maquina) {
      return {
        success: false,
        message: 'Máquina não encontrada'
      };
    }

    return {
      success: true,
      message: 'Máquina carregada',
      data: maquina
    };
  } catch (error) {
    console.error('Erro ao obter máquina:', error);
    return {
      success: false,
      message: 'Erro ao carregar máquina'
    };
  }
}

// Deletar máquina
export async function deletarMaquina(id: string): Promise<ActionResult> {
  try {
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
