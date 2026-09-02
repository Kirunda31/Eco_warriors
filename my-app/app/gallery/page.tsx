import { prisma } from '@/lib/prisma';

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: { project: true },
  });

  const ungrouped = items.filter((item) => !item.project);
  const grouped = items.filter((item) => item.project);

  const projectGroups = new Map<string, typeof items>();
  for (const item of grouped) {
    const projectTitle = item.project!.title;
    if (!projectGroups.has(projectTitle)) {
      projectGroups.set(projectTitle, []);
    }
    projectGroups.get(projectTitle)!.push(item);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Gallery</h1>

      {Array.from(projectGroups.entries()).map(([projectTitle, projectItems]) => (
        <div key={projectTitle} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{projectTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projectItems.map((item) => (
              <div key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? 'Gallery image'}
                  className="w-full h-48 object-cover rounded"
                />
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-1">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {ungrouped.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">General</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ungrouped.map((item) => (
              <div key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? 'Gallery image'}
                  className="w-full h-48 object-cover rounded"
                />
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-1">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}