import { MenuPosition, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// create menu
const createMenu = async (name: string) => {
  return prisma.menu.create({
    data: { name },
  });
};

// create menu item
const createMenuItem = async (data: {
  label: string;
  url: string;
  order: number;
  position: MenuPosition;
  menuId: string;
}) => {
  const isMatchUrl = await prisma.menuItem.findFirst({
    where: { url: data.url },
  });

  if (isMatchUrl) {
    throw new Error("Url must be unique");
  }
  return await prisma.menuItem.create({
    data,
  });
};

// get menus by position
const getMenusByPosition = async (position: MenuPosition, role?: Role) => {
  return prisma.menu.findMany({
    include: {
      items: {
        select : {
            id : true,
            label : true,
            url : true
        }
      }
    },
  });
};



// update menu item
const updateMenuItem = async (
  id: string,
  data: Partial<{
    label: string;
    url: string;
    order: number;
    position: MenuPosition;
  }>,
) => {
  return prisma.menuItem.update({
    where: { id },
    data,
  });
};

// delete menu item
const deleteMenuItem = async (id: string) => {
  return prisma.menuItem.delete({
    where: { id },
  });
};

const deleteMenu = async (id: string) => {
  return prisma.menu.delete({
    where: { id },
  });
};

export const menuService = {
  createMenu,
  createMenuItem,
  getMenusByPosition,
  updateMenuItem,
  deleteMenuItem,
  deleteMenu,
};
