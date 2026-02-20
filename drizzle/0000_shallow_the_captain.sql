CREATE TABLE "test" (
	"tenant_id" varchar(256) NOT NULL,
	"test_id" varchar(256) NOT NULL,
	"project_id" varchar(256) NOT NULL,
	"id" varchar(256) PRIMARY KEY NOT NULL,
	CONSTRAINT "unique_tenant_test_id" UNIQUE("tenant_id","test_id")
);
