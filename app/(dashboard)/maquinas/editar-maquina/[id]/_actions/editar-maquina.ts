'use server';

import { revalidatePath } from 'next/cache';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { pecasNaMaquina } from '@/db/schema/pecas_na_maquina';
import type { ActionResult } from '@/db/schema/types';
import { del } from '@vercel/blob';

import { eq } from 'drizzle-orm';

// Atualiza dados básicos da máquina (nome e imagem)
export async function editarMaquina(
  id: number,
  nome: string,
  imagemUrl: string
): Promise<ActionResult> {
  try {
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

    await db
      .update(maquinas)
      .set({
        nome: nome.trim(),
        imagem: imagemUrl
      })
      .where(eq(maquinas.id, id));

    revalidatePath('/maquinas');
    revalidatePath(`/maquinas/${id}`);

    return {
      success: true,
      message: 'Máquina atualizada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao editar máquina:', error);
    return {
      success: false,
      message: 'Erro ao atualizar máquina'
    };
  }
}

// Sincroniza peças da máquina (adiciona novas e remove antigas)
export async function sincronizarPecasMaquina(
  maquinaId: number,
  pecasNovas: { pecaId: number; localizacao: number }[]
): Promise<ActionResult> {
  try {
    if (pecasNovas.length === 0) {
      return {
        success: false,
        message: 'Adicione pelo menos uma peça'
      };
    }

    await db.transaction(async (tx) => {
      // Remove todas as peças existentes
      await tx
        .delete(pecasNaMaquina)
        .where(eq(pecasNaMaquina.maquinaId, maquinaId));

      // Adiciona as novas peças
      await tx.insert(pecasNaMaquina).values(
        pecasNovas.map((p) => ({
          maquinaId,
          pecaId: p.pecaId,
          localizacao: p.localizacao
        }))
      );
    });

    revalidatePath('/maquinas');
    revalidatePath(`/maquinas/${maquinaId}`);

    return {
      success: true,
      message: 'Peças sincronizadas com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao sincronizar peças:', error);
    return {
      success: false,
      message: 'Erro ao sincronizar peças'
    };
  }
}

// Atualiza máquina completa (nome, imagem e peças) em uma transação
export async function editarMaquinaCompleta(
  id: number,
  nome: string,
  imagemUrl: string,
  pecas: { pecaId: number; localizacao: number }[]
): Promise<ActionResult> {
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

    if (pecas.length === 0) {
      return {
        success: false,
        message: 'Adicione pelo menos uma peça'
      };
    }

    // Buscar imagem antiga para deletar se for diferente
    const [maquinaAntiga] = await db
      .select({ imagem: maquinas.imagem })
      .from(maquinas)
      .where(eq(maquinas.id, id))
      .limit(1);

    // Deletar imagem antiga do Blob se mudou e é URL do Blob
    if (
      maquinaAntiga &&
      maquinaAntiga.imagem !== imagemUrl &&
      maquinaAntiga.imagem.includes('blob.vercel-storage.com')
    ) {
      try {
        await del(maquinaAntiga.imagem);
      } catch (blobError) {
        // Log do erro mas não falha a operação
        console.error('Erro ao deletar imagem antiga do Blob:', blobError);
      }
    }

    // Atualizar tudo em transação
    await db.transaction(async (tx) => {
      // Atualizar dados da máquina
      await tx
        .update(maquinas)
        .set({
          nome: nome.trim(),
          imagem: imagemUrl
        })
        .where(eq(maquinas.id, id));

      // Remover peças antigas
      await tx.delete(pecasNaMaquina).where(eq(pecasNaMaquina.maquinaId, id));

      // Adicionar novas peças
      await tx.insert(pecasNaMaquina).values(
        pecas.map((p) => ({
          maquinaId: id,
          pecaId: p.pecaId,
          localizacao: p.localizacao
        }))
      );
    });

    revalidatePath('/maquinas');
    revalidatePath(`/maquinas/${id}`);

    return {
      success: true,
      message: 'Máquina atualizada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao editar máquina completa:', error);
    return {
      success: false,
      message: 'Erro ao atualizar máquina'
    };
  }
}
