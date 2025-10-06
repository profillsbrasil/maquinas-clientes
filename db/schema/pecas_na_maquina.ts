import { maquinas } from './maquinas';
import { pecas } from './pecas';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pecasNaMaquina = sqliteTable('pecas_na_maquina', {
  id: text('id').primaryKey(),
  maquinaId: text('maquina_id')
    .notNull()
    .references(() => maquinas.id, { onDelete: 'cascade' }),
  pecaId: text('peca_id')
    .notNull()
    .references(() => pecas.id, { onDelete: 'cascade' }),
  localizacao: integer('localizacao').notNull()
});
