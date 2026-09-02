'use client';

import { createProgram } from '@/app/actions/createProgram';

export default function NewProgramPage() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Program</h1>
      <form action={createProgram} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Program Name"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="slug"
          placeholder="Slug (e.g. climate-action)"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="goal"
          placeholder="Goal"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900"
        >
          Create Program
        </button>
      </form>
    </div>
  );
}