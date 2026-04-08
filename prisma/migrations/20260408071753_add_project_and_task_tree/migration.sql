-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate" DATETIME,
    "progressMode" TEXT NOT NULL DEFAULT 'AUTO',
    "manualProgress" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate" DATETIME,
    "estimatedMinutes" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'INBOX',
    "fearLevel" INTEGER,
    "resistanceLevel" INTEGER,
    "clarityLevel" INTEGER,
    "painLevel" INTEGER,
    "startDifficulty" INTEGER,
    "resistanceReasons" TEXT,
    "resistanceNote" TEXT,
    "contactStep" TEXT,
    "tinyStep" TEXT,
    "normalStep" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" TEXT,
    "parentTaskId" TEXT,
    "taskType" TEXT NOT NULL DEFAULT 'TASK',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "progressWeight" INTEGER NOT NULL DEFAULT 1,
    "manualProgress" INTEGER,
    "isExpanded" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("category", "clarityLevel", "contactStep", "createdAt", "description", "dueDate", "estimatedMinutes", "fearLevel", "id", "normalStep", "painLevel", "priority", "resistanceLevel", "resistanceNote", "resistanceReasons", "startDifficulty", "status", "tinyStep", "title", "updatedAt") SELECT "category", "clarityLevel", "contactStep", "createdAt", "description", "dueDate", "estimatedMinutes", "fearLevel", "id", "normalStep", "painLevel", "priority", "resistanceLevel", "resistanceNote", "resistanceReasons", "startDifficulty", "status", "tinyStep", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_priority_idx" ON "Task"("priority");
CREATE INDEX "Task_createdAt_idx" ON "Task"("createdAt");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Task_parentTaskId_idx" ON "Task"("parentTaskId");
CREATE INDEX "Task_taskType_idx" ON "Task"("taskType");
CREATE INDEX "Task_orderIndex_idx" ON "Task"("orderIndex");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_orderIndex_idx" ON "Project"("orderIndex");
