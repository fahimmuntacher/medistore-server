import { prisma } from "../../lib/prisma";

const adminOverview = async () => {
  const [
    totalUsers,
    totalSellers,
    totalMedicines,
    totalOrders,
    revenue,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.medicine.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: {
        status: "DELIVERED",
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  return {
    stats: {
      totalUsers,
      totalSellers,
      totalMedicines,
      totalOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
    },
    recentOrders,
  };
};

export const sellerOverview = async (sellerId: string) => {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      medicine: {
        sellerId,
      },
    },
    include: {
      order: true,
      medicine: true,
    },
  });

  const totalMedicines = await prisma.medicine.count({ where: { sellerId } });

  const totalRevenue = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItemsSold = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const ordersMap = new Map<string, any>();
  orderItems.forEach((item) => {
    ordersMap.set(item.orderId, item.order);
  });

  return {
    totalOrders: ordersMap.size,
    totalItemsSold,
    totalMedicines,
    totalRevenue,
    recentOrders: Array.from(ordersMap.values()).slice(0, 5),
  };
};

const customerOverview = async (customerId: string) => {
  const [totalOrders, spent, recentOrders] = await Promise.all([
    prisma.order.count({ where: { customerId } }),
    prisma.order.aggregate({
      where: { customerId, status: "DELIVERED" },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: { customerId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    stats: {
      totalOrders,
      totalSpent: spent._sum.totalAmount || 0,
    },
    recentOrders,
  };
};

export const dashboardService = {
  adminOverview,
  sellerOverview,
  customerOverview,
};
