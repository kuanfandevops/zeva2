import { PrismaClient as PrismaClientOld } from "@/prisma/generated/clientOld";

const prismaOld = new PrismaClientOld();

const globalForPrismaOld = global as unknown as { prismaOld: typeof prismaOld };

if (process.env.NODE_ENV !== "production") {
  globalForPrismaOld.prismaOld = prismaOld;
}

export { prismaOld };
