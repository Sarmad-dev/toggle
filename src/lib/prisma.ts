import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'], // Only log errors
    // Or completely disable logs:
    // log: [],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma 