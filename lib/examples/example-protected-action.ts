'use server';

import {
  requireAdmin,
  requireEngineerOrAdmin,
  requireRole
} from '@/lib/examples/server-auth-helpers';

/**
 * EXEMPLO de como proteger Server Actions com validação de role
 *
 * Este arquivo serve como referência - copie esses padrões para suas actions
 */

/**
 * EXEMPLO 1: Action que requer admin
 */
export async function deletarUsuario(_userId: string) {
  try {
    // Valida se o usuário é admin
    await requireAdmin();

    // Lógica da action
    // await db.delete(users).where(eq(users.id, userId));

    return { success: true, message: 'Usuário deletado' };
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Erro ao deletar usuário'
    };
  }
}

/**
 * EXEMPLO 2: Action que requer engenheiro ou admin
 */
export async function criarMaquina(_data: unknown) {
  try {
    // Valida se o usuário é engenheiro ou admin
    const session = await requireEngineerOrAdmin();

    // Você pode usar a sessão para audit log
    console.log(`Máquina criada por: ${session.user.email}`);

    // Lógica da action
    // const maquina = await db.insert(maquinas).values(data);

    return { success: true, message: 'Máquina criada' };
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao criar máquina'
    };
  }
}

/**
 * EXEMPLO 3: Action com múltiplos roles aceitos
 */
export async function visualizarRelatorio(_tipo: string) {
  try {
    // Aceita admin e engenheiro
    await requireRole(['admin', 'engenheiro']);

    // Lógica da action
    // const relatorio = await gerarRelatorio(tipo);

    return { success: true, data: [] };
  } catch (error) {
    console.error('Erro ao visualizar relatório:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Erro ao visualizar relatório'
    };
  }
}

/**
 * EXEMPLO 4: Action onde cada role tem comportamento diferente
 */
export async function listarMaquinas() {
  try {
    const session = await requireEngineerOrAdmin();

    // Engenheiros veem todas as máquinas
    if (session.user.role === 'engenheiro' || session.user.role === 'admin') {
      // const todasMaquinas = await db.select().from(maquinas);
      return { success: true, data: [] };
    }

    // Clientes veem apenas suas máquinas
    // const minhasMaquinas = await db.select().from(maquinas).where(...);
    return { success: true, data: [] };
  } catch (error) {
    console.error('Erro ao listar máquinas:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Erro ao listar máquinas'
    };
  }
}
