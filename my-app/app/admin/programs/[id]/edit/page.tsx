import { prisma } from '@/lib/prisma';
import { updateProgram } from '@/app/actions/updateProgram';
import { deleteProgram } from '@/app/actions/deleteProgram';

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await prisma.program.findUnique({
    where: { id: parseInt(id) },
  });

  if (!program) {
    return <h1>Program not found</h1>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Program</h1>

      <form action={updateProgram} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={program.id} />
        <input
          type="text"
          name="name"
          defaultValue={program.name}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="slug"
          defaultValue={program.slug}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="description"
          defaultValue={program.description}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="goal"
          defaultValue={program.goal}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900"
        >
          Save Changes
        </button>
      </form>

      <form action={deleteProgram}>
        <input type="hidden" name="id" value={program.id} />
        <button
          type="submit"
          className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800"
        >
          Delete Program
        </button>
      </form>
    </div>
  );
}