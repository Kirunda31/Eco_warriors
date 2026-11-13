import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL;
let connectionString = databaseUrl;
if (databaseUrl) {
  // Supabase's pooler certificate chain isn't trusted by Node's default CA store
  // in this Vercel runtime. Keep TLS encrypted while accepting the pooler's cert.
  const connectionUrl = new URL(databaseUrl);
  connectionUrl.searchParams.set('sslmode', 'no-verify');
  connectionString = connectionUrl.toString();
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({ adapter });
