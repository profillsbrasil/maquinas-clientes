import { sql } from 'drizzle-orm';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  customType,
  integer,
  sqliteTable,
  text
} from 'drizzle-orm/sqlite-core';

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

export const pecas = sqliteTable('pecas', {
  id: integer('id').primaryKey(),
  nome: text('nome').notNull(),
  linkLojaIntegrada: text('link_loja_integrada').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`)
    .$onUpdate(() => new Date())
});

// Tipos inferidos automaticamente do schema
export type Peca = InferSelectModel<typeof pecas>;
export type InsertPeca = InferInsertModel<typeof pecas>;
