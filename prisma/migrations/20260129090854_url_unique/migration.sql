/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_url_key" ON "MenuItem"("url");
