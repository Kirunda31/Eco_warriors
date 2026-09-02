import { prisma } from './lib/prisma';

async function main() {
  const program = await prisma.program.create({
    data: {
      name: 'Climate Action & Environmental Stewardship',
      slug: 'climate-action',
      description: 'Programs focused on environmental sustainability and climate resilience.',
      goal: 'Promote climate action and environmental stewardship across communities.',
    },
  });
  console.log('Created:', program);
}

main();
