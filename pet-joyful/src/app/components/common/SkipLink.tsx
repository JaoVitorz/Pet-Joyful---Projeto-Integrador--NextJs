'use client';

import Link from 'next/link';

export default function SkipLink() {
  return (
    <Link 
      href="#main-content" 
      className="skip-link"
      aria-label="Pular para o conteúdo principal"
    >
      Pular para o conteúdo principal
    </Link>
  );
}

