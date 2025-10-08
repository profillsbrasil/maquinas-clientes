'use server';

import { revalidatePath } from 'next/cache';

import db from '@/db/connection';
import { pecas } from '@/db/schema/pecas';

import type { ActionResult } from '../_types';
import { eq } from 'drizzle-orm';

// Action para listar todas as peças
export async function listarPecas(): Promise<
  ActionResult<
    {
      id: number;
      nome: string;
      linkLojaIntegrada: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >
> {
  try {
    const todasPecas = await db
      .select({
        id: pecas.id,
        nome: pecas.nome,
        linkLojaIntegrada: pecas.linkLojaIntegrada,
        createdAt: pecas.createdAt,
        updatedAt: pecas.updatedAt
      })
      .from(pecas)
      .orderBy(pecas.createdAt);

    return {
      success: true,
      message: 'Peças carregadas com sucesso',
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

// Action para criar uma nova peça
export async function criarPeca(formData: FormData): Promise<ActionResult> {
  try {
    const nome = formData.get('nome') as string;
    const linkLojaIntegrada = formData.get('linkLojaIntegrada') as string;

    // Validações
    const errors: Record<string, string[]> = {};

    if (!nome || nome.trim().length === 0) {
      errors.nome = ['O nome é obrigatório'];
    }

    if (!linkLojaIntegrada || linkLojaIntegrada.trim().length === 0) {
      errors.linkLojaIntegrada = ['O link da loja integrada é obrigatório'];
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Erro de validação',
        errors
      };
    }

    // Criar a peça (id é gerado automaticamente pelo banco)
    await db.insert(pecas).values({
      nome: nome.trim(),
      linkLojaIntegrada: linkLojaIntegrada.trim()
    });

    revalidatePath('/adicionar-peca');
    revalidatePath('/adicionar-maquina');

    return {
      success: true,
      message: 'Peça criada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao criar peça:', error);
    return {
      success: false,
      message: 'Erro ao criar peça. Tente novamente.'
    };
  }
}

// Action para editar uma peça existente
export async function editarPeca(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    const nome = formData.get('nome') as string;
    const linkLojaIntegrada = formData.get('linkLojaIntegrada') as string;

    // Validações
    const errors: Record<string, string[]> = {};

    if (!nome || nome.trim().length === 0) {
      errors.nome = ['O nome é obrigatório'];
    }

    if (!linkLojaIntegrada || linkLojaIntegrada.trim().length === 0) {
      errors.linkLojaIntegrada = ['O link da loja integrada é obrigatório'];
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Erro de validação',
        errors
      };
    }

    // Atualizar a peça
    await db
      .update(pecas)
      .set({
        nome: nome.trim(),
        linkLojaIntegrada: linkLojaIntegrada.trim(),
        updatedAt: new Date()
      })
      .where(eq(pecas.id, id));

    revalidatePath('/adicionar-peca');
    revalidatePath('/adicionar-maquina');

    return {
      success: true,
      message: 'Peça atualizada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao editar peça:', error);
    return {
      success: false,
      message: 'Erro ao editar peça. Tente novamente.'
    };
  }
}

// Action para deletar uma peça
export async function deletarPeca(id: number): Promise<ActionResult> {
  try {
    await db.delete(pecas).where(eq(pecas.id, id));

    revalidatePath('/adicionar-peca');
    revalidatePath('/adicionar-maquina');

    return {
      success: true,
      message: 'Peça deletada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao deletar peça:', error);
    return {
      success: false,
      message: 'Erro ao deletar peça. Tente novamente.'
    };
  }
}

// Action para buscar uma peça específica
export async function buscarPeca(id: number): Promise<
  ActionResult<{
    id: number;
    nome: string;
    linkLojaIntegrada: string;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  try {
    const [peca] = await db
      .select({
        id: pecas.id,
        nome: pecas.nome,
        linkLojaIntegrada: pecas.linkLojaIntegrada,
        createdAt: pecas.createdAt,
        updatedAt: pecas.updatedAt
      })
      .from(pecas)
      .where(eq(pecas.id, id));

    if (!peca) {
      return {
        success: false,
        message: 'Peça não encontrada'
      };
    }

    return {
      success: true,
      message: 'Peça encontrada',
      data: peca
    };
  } catch (error) {
    console.error('Erro ao buscar peça:', error);
    return {
      success: false,
      message: 'Erro ao buscar peça'
    };
  }
}
