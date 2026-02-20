import { boolean, integer, pgTable, unique, varchar } from 'drizzle-orm/pg-core';


const testTable = pgTable('test', {
  tenant_id: varchar('tenant_id', { length: 256 }).notNull(),
  test_id: varchar('test_id', { length: 256 }).notNull(),
  project_id: varchar('project_id', { length: 256 }).notNull(),
  id: varchar('id', { length: 256 }).notNull().primaryKey(),
}, (table) => [
  unique('unique_tenant_test_id').on(table.tenant_id, table.project_id, table.test_id),
]);
export default testTable;
