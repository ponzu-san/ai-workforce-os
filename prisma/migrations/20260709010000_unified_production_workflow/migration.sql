-- CreateEnum
CREATE TYPE "ProjectTemplate" AS ENUM ('lp_static', 'lp_form', 'corporate', 'design_only', 'custom_blank');

-- CreateEnum
CREATE TYPE "StageExecutionMode" AS ENUM ('internal_ai', 'external_handoff', 'human_handoff', 'skip');

-- CreateEnum
CREATE TYPE "ArtifactContentKind" AS ENUM ('markdown', 'url', 'file');

-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'waiting_external';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN "template" "ProjectTemplate" NOT NULL DEFAULT 'lp_static';

-- AlterTable
ALTER TABLE "stages" ADD COLUMN "execution_mode" "StageExecutionMode" NOT NULL DEFAULT 'internal_ai';

-- AlterTable
ALTER TABLE "artifacts" ADD COLUMN "content_kind" "ArtifactContentKind" NOT NULL DEFAULT 'markdown',
ADD COLUMN "external_url" TEXT,
ADD COLUMN "file_path" TEXT,
ADD COLUMN "mime_type" TEXT;

-- Migrate ProjectType to production-only
CREATE TYPE "ProjectType_new" AS ENUM ('production');

ALTER TABLE "projects" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "projects" ALTER COLUMN "type" TYPE "ProjectType_new" USING ('production'::"ProjectType_new");
DROP TYPE "ProjectType";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
ALTER TABLE "projects" ALTER COLUMN "type" SET DEFAULT 'production';

-- Set template based on legacy type (all rows are now production)
UPDATE "projects" SET "template" = 'corporate' WHERE "name" ILIKE '%demo%' AND "template" = 'lp_static';
UPDATE "projects" SET "template" = 'lp_static' WHERE "template" = 'lp_static';
