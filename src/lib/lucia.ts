import { qwik } from "lucia-auth/middleware";
import prismaAdapter from "@lucia-auth/adapter-prisma";
import lucia from "lucia-auth";
import { prisma } from "./prisma";

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: qwik(),
  transformDatabaseUser: (userData) => ({
    // what you wanna have in the user object when you call `auth.vadaliteUser()`
    userId: userData.id,
    email: userData.email,
    name: userData.name,
  })
});

export type Auth = typeof  auth