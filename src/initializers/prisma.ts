import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import config from "config"

const adapter = new PrismaBetterSqlite3({ url: config.dbUrl })
export const prisma = new PrismaClient({ adapter })
