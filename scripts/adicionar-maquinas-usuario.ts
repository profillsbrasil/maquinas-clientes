import db from '@/db/connection';
import { maquinas } from '@/db/schema/maquinas';
import { user } from '@/db/schema/user';
import { userMaquinas } from '@/db/schema/user_maquinas';

import { eq } from 'drizzle-orm';

async function adicionarMaquinasParaUsuario() {
  try {
    // 1. Buscar o usuário pelo email
    const usuario = await db
      .select()
      .from(user)
      .where(eq(user.email, 'othavioquiliao@gmail.com'))
      .limit(1);

    if (usuario.length === 0) {
      console.log(
        '❌ Usuário não encontrado com o email: othavioquiliao@gmail.com'
      );
      return;
    }

    const userId = usuario[0].id;
    console.log(
      `✅ Usuário encontrado: ${usuario[0].name} (${usuario[0].email})`
    );

    // 2. Buscar as primeiras 3 máquinas disponíveis
    const maquinasDisponiveis = await db.select().from(maquinas).limit(3);

    if (maquinasDisponiveis.length === 0) {
      console.log('❌ Nenhuma máquina encontrada no banco');
      return;
    }

    console.log(`✅ Encontradas ${maquinasDisponiveis.length} máquinas:`);
    maquinasDisponiveis.forEach((maq, index) => {
      console.log(`   ${index + 1}. ${maq.nome} (ID: ${maq.id})`);
    });

    // 3. Verificar se já existem associações
    const associacoesExistentes = await db
      .select()
      .from(userMaquinas)
      .where(eq(userMaquinas.userId, userId));

    console.log(`📊 Associações existentes: ${associacoesExistentes.length}`);

    // 4. Adicionar novas associações (apenas se não existirem)
    const novasAssociacoes = [];

    for (const maquina of maquinasDisponiveis) {
      const jaAssociada = associacoesExistentes.some(
        (assoc) => assoc.maquinaId === maquina.id
      );

      if (!jaAssociada) {
        novasAssociacoes.push({
          userId,
          maquinaId: maquina.id
        });
      } else {
        console.log(
          `⚠️  Máquina "${maquina.nome}" já está associada ao usuário`
        );
      }
    }

    if (novasAssociacoes.length > 0) {
      // 5. Inserir as novas associações
      await db.insert(userMaquinas).values(novasAssociacoes);

      console.log(
        `✅ ${novasAssociacoes.length} nova(s) associação(ões) criada(s)!`
      );
      novasAssociacoes.forEach((assoc, index) => {
        const maquina = maquinasDisponiveis.find(
          (m) => m.id === assoc.maquinaId
        );
        console.log(
          `   ${index + 1}. ${maquina?.nome} (ID: ${assoc.maquinaId})`
        );
      });
    } else {
      console.log('ℹ️  Todas as máquinas já estão associadas ao usuário');
    }

    // 6. Verificar resultado final
    const associacoesFinais = await db
      .select({
        userId: userMaquinas.userId,
        maquinaId: userMaquinas.maquinaId,
        nomeMaquina: maquinas.nome,
        criadoEm: userMaquinas.criadoEm
      })
      .from(userMaquinas)
      .innerJoin(maquinas, eq(userMaquinas.maquinaId, maquinas.id))
      .where(eq(userMaquinas.userId, userId));

    console.log('\n📋 Associações finais:');
    associacoesFinais.forEach((assoc, index) => {
      console.log(
        `   ${index + 1}. ${assoc.nomeMaquina} (criado em: ${assoc.criadoEm})`
      );
    });
  } catch (error) {
    console.error('❌ Erro ao executar script:', error);
  }
}

// Executar o script
adicionarMaquinasParaUsuario()
  .then(() => {
    console.log('\n🎉 Script executado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
