'use client';

import type { FormEvent } from 'react';
import { deleteUser } from '@/app/actions/deleteUser';

export default function UserDeleteForm({ userId, userName, hasProgressReports }: { userId: number; userName: string; hasProgressReports: boolean }) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete ${userName}'s account? This cannot be undone.`)) event.preventDefault();
  }

  return (
    <form action={deleteUser} onSubmit={confirmDelete} className="mt-6 border-t border-red-100 pt-5">
      <input type="hidden" name="id" value={userId} />
      <button type="submit" disabled={hasProgressReports} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
        Delete account
      </button>
      <p className="mt-2 text-xs text-gray-500">{hasProgressReports ? 'Delete this user’s project progress reports first to preserve the report history.' : 'This action cannot be undone.'}</p>
    </form>
  );
}
