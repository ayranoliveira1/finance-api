/*
  Warnings:

  - A unique constraint covering the columns `[verification_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "code_expiration_date" TIMESTAMP(3),
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "verification_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_code_key" ON "users"("verification_code");
