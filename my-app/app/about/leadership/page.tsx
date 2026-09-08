import { prisma } from '@/lib/prisma';

export default async function LeadershipPage() {
  const leaders = await prisma.leader.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Leadership</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaders.map((leader) => (
          <div key={leader.id}>
            {leader.photo && (
              <img src={leader.photo} alt={leader.name} className="w-full h-48 object-cover rounded mb-3" />
            )}
            <h2 className="text-lg font-semibold">{leader.name}</h2>
            <p className="text-sm text-gray-500">{leader.position}</p>
            <p className="text-gray-700 mt-2">{leader.biography}</p>
          </div>
        ))}
      </div>
    </div>
  );
}