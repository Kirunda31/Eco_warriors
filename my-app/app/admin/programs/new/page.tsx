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
        <label className="text-sm font-medium text-gray-700 -mb-2">Program description</label>
        <p className="text-xs text-gray-500 -mt-3">Use paragraphs to explain who the programme serves, how it works, and the change it seeks to make.</p>
        <textarea
          name="description"
          placeholder="Write a clear, detailed programme description..."
          required
          rows={7}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <label className="text-sm font-medium text-gray-700 -mb-2">Long-term goal</label>
        <textarea
          name="goal"
          placeholder="Describe the lasting outcome this programme is working toward..."
          required
          rows={4}
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
