import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL,
  // Supabase's pooler certificate chain isn't trusted by Node's default CA store
  // in this Vercel runtime. Keep TLS encryption while accepting that certificate.
  ssl: { rejectUnauthorized: false },
});

export const prisma = new PrismaClient({ adapter });
