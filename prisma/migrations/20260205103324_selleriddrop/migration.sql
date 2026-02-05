/*
  Warnings:

  - You are about to drop the column `sellerId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropIndex
DROP INDEX "Order_customerId_idx";

-- DropIndex
DROP INDEX "Order_status_idx";

-- DropIndex
DROP INDEX "OrderItem_medicineId_idx";

-- DropIndex
DROP INDEX "OrderItem_orderId_medicineId_key";

-- DropIndex
DROP INDEX "OrderItem_sellerId_idx";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "sellerId";

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
