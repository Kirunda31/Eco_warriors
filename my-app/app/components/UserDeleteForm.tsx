'use client';

import type { FormEvent } from 'react';
import { deleteUser } from '@/app/actions/deleteUser';

export default function UserDeleteForm({ userId, userName }: { userId: number; userName: string }) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete ${userName}'s account? This cannot be undone.`)) event.preventDefault();
  }

  return (
    <form action={deleteUser} onSubmit={confirmDelete} className="mt-6 border-t border-red-100 pt-5">
      <input type="hidden" name="id" value={userId} />
      <button type="submit" className="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
        Delete account
      </button>
      <p className="mt-2 text-xs text-gray-500">Project progress reports are retained and marked as submitted by a deleted user.</p>
    </form>
  );
}
