import { boolean, integer, pgTable, varchar } from 'drizzle-orm/pg-core';


const testTable = pgTable('test', {
  id: varchar('id', { length: 256 }).notNull().primaryKey(),
  test_int: integer('test_int').notNull(),
  test_bool: boolean('test_bool').notNull().default(false),
});
export default testTable;
