-- AlterTable
ALTER TABLE "memories" ADD COLUMN "stage_id" UUID;

-- AlterTable
ALTER TABLE "artifacts" ADD COLUMN "source_artifact_ids" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN "previous_artifact_id" UUID,
ADD COLUMN "edited_by" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "memories_stage_id_idx" ON "memories"("stage_id");

-- CreateIndex
CREATE INDEX "artifacts_previous_artifact_id_idx" ON "artifacts"("previous_artifact_id");

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_previous_artifact_id_fkey" FOREIGN KEY ("previous_artifact_id") REFERENCES "artifacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
