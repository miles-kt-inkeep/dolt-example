ALTER TABLE "test" DROP CONSTRAINT "unique_tenant_test_id";--> statement-breakpoint
ALTER TABLE "test" ADD CONSTRAINT "unique_tenant_test_id" UNIQUE("tenant_id","project_id","test_id");