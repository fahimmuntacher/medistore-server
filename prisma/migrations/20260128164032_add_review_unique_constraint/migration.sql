/*
  Warnings:

  - A unique constraint covering the columns `[medicineId,customerId,orderId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review_medicineId_customerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Review_medicineId_customerId_orderId_key" ON "Review"("medicineId", "customerId", "orderId");
