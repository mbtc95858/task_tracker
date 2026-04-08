-- CreateTable
CREATE TABLE "Task" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TaskProgressLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskProgressLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "mostAvoidedTaskId" TEXT,
    "didStart" BOOLEAN,
    "blockingReason" TEXT,
    "effectiveStarter" TEXT,
    "actualPainLevel" INTEGER,
    "painComparison" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyReview_mostAvoidedTaskId_fkey" FOREIGN KEY ("mostAvoidedTaskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PointTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Task_createdAt_idx" ON "Task"("createdAt");

-- CreateIndex
CREATE INDEX "TaskProgressLog_taskId_idx" ON "TaskProgressLog"("taskId");

-- CreateIndex
CREATE INDEX "TaskProgressLog_actionType_idx" ON "TaskProgressLog"("actionType");

-- CreateIndex
CREATE INDEX "TaskProgressLog_createdAt_idx" ON "TaskProgressLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReview_date_key" ON "DailyReview"("date");

-- CreateIndex
CREATE INDEX "DailyReview_date_idx" ON "DailyReview"("date");

-- CreateIndex
CREATE INDEX "PointTransaction_sourceType_idx" ON "PointTransaction"("sourceType");

-- CreateIndex
CREATE INDEX "PointTransaction_createdAt_idx" ON "PointTransaction"("createdAt");
