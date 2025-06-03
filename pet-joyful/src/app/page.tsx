import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/registro');
  return null;
}