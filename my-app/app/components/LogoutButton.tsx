'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-medium text-emerald-800 hover:text-emerald-950 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? 'Logging out…' : 'Log out'}
    </button>
  );
}

export default function LogoutButton({ action }: { action: () => Promise<void> }) {
  return <form action={action}><SubmitButton /></form>;
}
