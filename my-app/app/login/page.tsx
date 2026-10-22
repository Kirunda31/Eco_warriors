'use client';

import Link from 'next/link';
import { useState } from 'react';
import { loginUser } from '@/app/actions/login';

export default function LoginPage() {
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setMessage('');
    setPending(true);
    try {
      const result = await loginUser(formData);
      if (result?.error) setMessage(result.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-emerald-50/60 px-5 py-14 sm:py-20">
      <section className="w-full max-w-md rounded-2xl border border-emerald-950/10 bg-white p-7 shadow-lg shadow-emerald-950/5 sm:p-10">
        <div className="mb-8 text-center">
          <span aria-hidden="true" className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-800 text-2xl text-white">🌿</span>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Eco Warriors Initiative</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to continue to your account.</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
            <input id="username" type="text" name="username" autoComplete="username" required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input id="password" type="password" name="password" autoComplete="current-password" required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
          </div>
          {message && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-800">{message}</p>}
          <button type="submit" disabled={pending}
            className="w-full rounded-lg bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-wait disabled:opacity-70">
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-600">
          New to Eco Warriors? <Link href="/signup" className="font-semibold text-emerald-800 underline-offset-4 hover:underline">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
