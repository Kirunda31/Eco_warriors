import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      {' | '}
      <Link href="/programs">Programs</Link>
      {' | '}
      <Link href="/projects">Projects</Link>
      {' | '}
      <Link href="/stories">Stories</Link>
      {' | '}
      <Link href="/admin">Admin</Link>
      {' | '}
      <Link href="/login">Log In</Link>
      {' | '}
      <Link href="/signup">Sign Up</Link>
    </nav>
  );
}