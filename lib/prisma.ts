import { PrismaClient, Prisma } from '@prisma/client';
import { env } from './env-validator';

const REQUIRED_TABLES = [
  'Appointment',
  'UserConversation',
  'Message',
  'AIUsageStats',
] as const;

type RequiredTable = (typeof REQUIRED_TABLES)[number];

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prismaLogLevels: Prisma.LogLevel[] =
  process.env.NODE_ENV === 'development'
    ? ['warn', 'error']
    : ['error'];

const shouldCreatePrismaClient = env.database.enabled;

export const prisma = shouldCreatePrismaClient
  ? globalForPrisma.prisma ??
    new PrismaClient({
      log: prismaLogLevels,
    })
  : (new Proxy(
      {},
      {
        get() {
          throw new Error(env.database.reason ?? 'Prisma is disabled.');
        },
      }
    ) as PrismaClient);

if (shouldCreatePrismaClient && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const prismaEnabled = shouldCreatePrismaClient;

export function isPrismaEnabled(): boolean {
  return prismaEnabled;
}

export function isMockDbEnabled(): boolean {
  return env.database.useMockDb;
}

export async function connectPrisma(): Promise<void> {
  if (!isPrismaEnabled()) {
    throw new Error(env.database.reason ?? 'Prisma is disabled.');
  }

  await prisma.$connect();
}

export async function getExistingPublicTables(): Promise<Set<string>> {
  if (!isPrismaEnabled()) {
    return new Set<string>();
  }

  const rows = await prisma.$queryRaw<Array<{ table_name: string }>>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name IN ('Appointment', 'UserConversation', 'Message', 'AIUsageStats')
  `;

  return new Set(rows.map((row) => row.table_name));
}

export async function getMissingRequiredTables(): Promise<RequiredTable[]> {
  const existingTables = await getExistingPublicTables();
  return REQUIRED_TABLES.filter((tableName) => !existingTables.has(tableName));
}

export async function assertDatabaseReady(): Promise<void> {
  await connectPrisma();

  const missingTables = await getMissingRequiredTables();
  if (missingTables.length > 0) {
    throw new Error(
      `Database schema is missing required tables: ${missingTables.join(
        ', '
      )}. Run "npx prisma db push" to sync the Prisma schema.`
    );
  }
}
