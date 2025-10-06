import { maquina_cliente } from './maquina_cliente';
import { sql } from 'drizzle-orm';
import { customType, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamp = customType<{ data: Date; driverData: string }>({
  dataType() {
    return 'text';
  },
  toDriver(value: Date): string {
    return value.toISOString().replace('T', ' ').substring(0, 19);
  },
  fromDriver(value: string): Date {
    return new Date(value);
  }
});

export const peca_maquina = sqliteTable('peca_maquina', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  linkLoja: text('link_loja'),
  localizacao: text('localizacao'),
  maquinaId: text('maquina_id')
    .notNull()
    .references(() => maquina_cliente.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`)
    .$onUpdate(() => new Date())
});
