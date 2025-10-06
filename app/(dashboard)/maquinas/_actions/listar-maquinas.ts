'use server';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { pecasNaMaquina } from '@/db/schema/pecas_na_maquina';

import { eq, sql } from 'drizzle-orm';

type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

type MaquinaComPecas = {
  id: string;
  nome: string;
  imagem: string;
  criadoEm: Date;
  alteradoEm: Date;
  totalPecas: number;
};

// Listar todas as máquinas com contagem de peças
export async function listarTodasMaquinas(): Promise<
  ActionResult<MaquinaComPecas[]>
> {
  try {
    const resultado = await db
      .select({
        id: maquinas.id,
        nome: maquinas.nome,
        imagem: maquinas.imagem,
        criadoEm: maquinas.criadoEm,
        alteradoEm: maquinas.alteradoEm,
        totalPecas: sql<number>`count(${pecasNaMaquina.id})`
      })
      .from(maquinas)
      .leftJoin(pecasNaMaquina, eq(maquinas.id, pecasNaMaquina.maquinaId))
      .groupBy(maquinas.id)
      .orderBy(maquinas.criadoEm);

    return {
      success: true,
      message: 'Máquinas carregadas com sucesso',
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

// Deletar máquina
export async function deletarMaquina(id: string): Promise<ActionResult> {
  try {
    await db.delete(maquinas).where(eq(maquinas.id, id));

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
