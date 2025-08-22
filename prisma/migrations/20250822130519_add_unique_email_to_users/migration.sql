/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "confirmpassword" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastPasswordChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "refreshToken" VARCHAR(500) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" VARCHAR(100) NOT NULL,
    "table" VARCHAR(50) NOT NULL,
    "details" TEXT,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "query" TEXT,
    "params" TEXT,
    "duration" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."health_profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "medicalHistory" TEXT,
    "lifestyle" TEXT,
    "symptoms" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "health_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionId" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_messages" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "sender" VARCHAR(20) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rate_limits" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(200) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."security_events" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "severity" VARCHAR(20) NOT NULL,
    "details" TEXT NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "userId" INTEGER,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" INTEGER,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "public"."users"("isActive");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "public"."sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "public"."sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "public"."sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "public"."sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_refreshToken_idx" ON "public"."sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "public"."sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_isActive_idx" ON "public"."sessions"("isActive");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "public"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_table_idx" ON "public"."audit_logs"("table");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_ipAddress_idx" ON "public"."audit_logs"("ipAddress");

-- CreateIndex
CREATE INDEX "audit_logs_success_idx" ON "public"."audit_logs"("success");

-- CreateIndex
CREATE UNIQUE INDEX "health_profiles_userId_key" ON "public"."health_profiles"("userId");

-- CreateIndex
CREATE INDEX "health_profiles_userId_idx" ON "public"."health_profiles"("userId");

-- CreateIndex
CREATE INDEX "health_profiles_createdAt_idx" ON "public"."health_profiles"("createdAt");

-- CreateIndex
CREATE INDEX "health_profiles_isActive_idx" ON "public"."health_profiles"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "chat_sessions_sessionId_key" ON "public"."chat_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "chat_sessions_userId_idx" ON "public"."chat_sessions"("userId");

-- CreateIndex
CREATE INDEX "chat_sessions_sessionId_idx" ON "public"."chat_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "chat_sessions_createdAt_idx" ON "public"."chat_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "chat_sessions_isActive_idx" ON "public"."chat_sessions"("isActive");

-- CreateIndex
CREATE INDEX "chat_messages_sessionId_idx" ON "public"."chat_messages"("sessionId");

-- CreateIndex
CREATE INDEX "chat_messages_sender_idx" ON "public"."chat_messages"("sender");

-- CreateIndex
CREATE INDEX "chat_messages_timestamp_idx" ON "public"."chat_messages"("timestamp");

-- CreateIndex
CREATE INDEX "chat_messages_isFollowUp_idx" ON "public"."chat_messages"("isFollowUp");

-- CreateIndex
CREATE INDEX "rate_limits_resetTime_idx" ON "public"."rate_limits"("resetTime");

-- CreateIndex
CREATE INDEX "rate_limits_createdAt_idx" ON "public"."rate_limits"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "rate_limits_key_key" ON "public"."rate_limits"("key");

-- CreateIndex
CREATE INDEX "security_events_type_idx" ON "public"."security_events"("type");

-- CreateIndex
CREATE INDEX "security_events_severity_idx" ON "public"."security_events"("severity");

-- CreateIndex
CREATE INDEX "security_events_createdAt_idx" ON "public"."security_events"("createdAt");

-- CreateIndex
CREATE INDEX "security_events_ipAddress_idx" ON "public"."security_events"("ipAddress");

-- CreateIndex
CREATE INDEX "security_events_resolved_idx" ON "public"."security_events"("resolved");

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."health_profiles" ADD CONSTRAINT "health_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
