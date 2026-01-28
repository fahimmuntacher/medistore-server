import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "MediStore Admin",
      email: "admin@gmail.com",
      role: Role.ADMIN,
      password: `${process.env.ADMIN_PASS}`,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      console.log("user already exist");
      return;
    }

    const signUpAdmin = await fetch(
      `${process.env.API_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: `${process.env.ORIGIN_URL}`,
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("user updated");
    }

    console.log("sign up info :", signUpAdmin);
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
