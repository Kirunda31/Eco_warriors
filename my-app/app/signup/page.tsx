'use client';

import { signupUser } from '@/app/actions/signup';
import { useState } from 'react';

export default function SignupPage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    const result = await signupUser(formData);

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage('Account created successfully!');
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
}