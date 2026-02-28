import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: `${process.env.BETTER_AUTH_URL}`,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigin = [
      "http://localhost:3000",
      `${process.env.PROD_APP_URL}`,
    ].filter(Boolean);

    // Check if origin matches allowed origins or Vercel pattern
    if (
      !origin ||
      allowedOrigin.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }

    return [];
  },
  basePath: "/api/auth",
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 5 * 60, // 5 minutes
  //   },
  //   cookieOptions: {
  //     secure: true, // always sent over HTTPS
  //     sameSite: "none", // permit cross‑site requests
  //     // domain: ".vercel.app" // if you ever share across sub‑domains
  //   },
  // },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },

  // advanced: {
  //   cookiePrefix: "better-auth",
  //   useSecureCookies: true,
  // },

  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
