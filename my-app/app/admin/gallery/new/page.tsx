'use client';

import { uploadGalleryItem } from '@/app/actions/uploadGalleryItem';

export default function NewGalleryItemPage() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Gallery Image</h1>
      <form
        action={uploadGalleryItem}
        encType="multipart/form-data"
        className="flex flex-col gap-4"
      >
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="caption"
          placeholder="Caption (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          name="projectId"
          placeholder="Project ID (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900"
        >
          Upload
        </button>
      </form>
    </div>
  );
}