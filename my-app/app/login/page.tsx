'use client';

import { loginUser } from '@/app/actions/login';
import { useState } from 'react';

export default function LoginPage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    const result = await loginUser(formData);

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage('Logged in successfully!');
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Log In</button>
      {message && <p>{message}</p>}
    </form>
  );
}