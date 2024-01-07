/*
  Warnings:

  - You are about to drop the `RevokedRefreshTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RevokedRefreshTokens";

-- CreateTable
CREATE TABLE "RevokedRefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevokedRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevokedRefreshToken_token_key" ON "RevokedRefreshToken"("token");
