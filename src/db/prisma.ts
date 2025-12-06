// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  // In Prisma 7, DATABASE_URL is passed via environment variable
  // and configured when running migrate/generate commands
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
