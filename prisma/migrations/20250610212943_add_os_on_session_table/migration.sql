/*
  Warnings:

  - Added the required column `os` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "os" TEXT NOT NULL;
