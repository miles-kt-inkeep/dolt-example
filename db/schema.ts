import { jsonb, pgTable, varchar } from 'drizzle-orm/pg-core';


const testTable = pgTable('jsonb_test', {
  id: varchar('id', { length: 256 }).notNull().primaryKey(),
  jsonbColumn: jsonb('jsonb_column').$type<{ test: string }>(),
});
export default testTable;
