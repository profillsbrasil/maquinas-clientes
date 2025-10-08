import { maquinas } from './maquinas';
import { pecas } from './pecas';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const pecasNaMaquina = sqliteTable('pecas_na_maquina', {
  id: integer('id').primaryKey(),
  maquinaId: integer('maquina_id')
    .notNull()
    .references(() => maquinas.id, { onDelete: 'cascade' }),
  pecaId: integer('peca_id')
    .notNull()
    .references(() => pecas.id, { onDelete: 'cascade' }),
  localizacao: integer('localizacao').notNull()
});
