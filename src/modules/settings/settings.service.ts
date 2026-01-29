import { prisma } from "../../lib/prisma";

const getSettings = async () => {
  return prisma.siteSetting.findFirst();
};

const upsertSettings = async (data: any) => {
  const existing = await prisma.siteSetting.findFirst();

  if (existing) {
    return prisma.siteSetting.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.siteSetting.create({
    data,
  });
};

export const settingsService = {
  getSettings,
  upsertSettings,
};
