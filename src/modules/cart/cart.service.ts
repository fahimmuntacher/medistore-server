import { prisma } from "../../lib/prisma";

 const getCart = async (customerId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      items: [],
      total: 0,
    };
  }

  const items = cart.items.map((item) => ({
    id: item.id,
    medicineId: item.medicineId,
    name: item.medicine.name,
    image: item.medicine.image,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);

  return { id: cart.id, items, total };
};

 const addToCart = async (
  customerId: string,
  medicineId: string,
  price: number,
  quantity: number
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  // Stock check
  if (medicine.stock < quantity) {
    throw new Error("Not enough stock");
  }

  const cart = await prisma.cart.upsert({
    where: { customerId },
    create: { customerId },
    update: {},
  });

  const item = await prisma.cartItem.upsert({
    where: {
      cartId_medicineId: {
        cartId: cart.id,
        medicineId,
      },
    },
    update: {
      quantity: { increment: quantity },
      price: price,
    },
    create: {
      cartId: cart.id,
      medicineId,
      quantity,
      price: price,
    },
  });

  return item;
};

 const updateQuantity = async (
  customerId: string,
  itemId: string,
  quantity: number
) => {
  if (!itemId || itemId === "undefined") {
    throw new Error("Cart Item ID is required");
  }

  if (quantity < 1) {
    // Calling the sibling function directly
    return removeItem(customerId, itemId);
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { customerId },
    },
  });

  if (!item) {
    throw new Error("Cart item not found or you are not authorized");
  }

  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: Math.floor(quantity) },
  });
};

 const removeItem = async (customerId: string, itemId: string) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { customerId },
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return true;
};

 const clearCart = async (customerId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId },
  });

  if (!cart) return true;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return true;
};


export const CartServices = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart
}