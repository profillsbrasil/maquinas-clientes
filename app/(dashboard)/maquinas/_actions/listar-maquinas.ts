'use server';

import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { pecas } from '@/db/schema/pecas';
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

type PecaNaMaquina = {
  id: string;
  pecaId: string;
  nome: string;
  linkLojaIntegrada: string;
  localizacao: number;
};

type MaquinaDetalhada = {
  id: string;
  nome: string;
  imagem: string;
  criadoEm: Date;
  alteradoEm: Date;
  pecas: PecaNaMaquina[];
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

// Buscar máquina por ID com suas peças
export async function buscarMaquinaPorId(
  id: string
): Promise<ActionResult<MaquinaDetalhada>> {
  try {
    // Buscar a máquina
    const maquina = await db
      .select()
      .from(maquinas)
      .where(eq(maquinas.id, id))
      .limit(1);

    if (!maquina || maquina.length === 0) {
      return {
        success: false,
        message: 'Máquina não encontrada'
      };
    }

    // Buscar as peças da máquina
    const pecasDaMaquina = await db
      .select({
        id: pecasNaMaquina.id,
        pecaId: pecasNaMaquina.pecaId,
        nome: pecas.nome,
        linkLojaIntegrada: pecas.linkLojaIntegrada,
        localizacao: pecasNaMaquina.localizacao
      })
      .from(pecasNaMaquina)
      .innerJoin(pecas, eq(pecasNaMaquina.pecaId, pecas.id))
      .where(eq(pecasNaMaquina.maquinaId, id));

    const maquinaDetalhada: MaquinaDetalhada = {
      id: maquina[0].id,
      nome: maquina[0].nome,
      imagem: maquina[0].imagem,
      criadoEm: maquina[0].criadoEm,
      alteradoEm: maquina[0].alteradoEm,
      pecas: pecasDaMaquina
    };

    return {
      success: true,
      message: 'Máquina carregada com sucesso',
      data: maquinaDetalhada
    };
  } catch (error) {
    console.error('Erro ao buscar máquina:', error);
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
