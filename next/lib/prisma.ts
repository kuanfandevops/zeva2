import { PrismaClient as PrismaClient } from "../prisma/generated/client";
import { PrismaClient as PrismaClientOld } from "../prisma/generated/clientOld";

const prisma = new PrismaClient();
const prismaOld = new PrismaClientOld();

const globalForPrisma = global as unknown as { prisma: typeof prisma };
const globalForPrismaOld = global as unknown as { prismaOld: typeof prismaOld };

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrismaOld.prismaOld = prismaOld;
}

export { prisma, prismaOld };
