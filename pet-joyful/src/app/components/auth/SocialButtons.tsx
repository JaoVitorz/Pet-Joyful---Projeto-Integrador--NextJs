'use client';

import { FaGoogle, FaApple } from 'react-icons/fa';

export default function SocialButtons() {
  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Implementar lógica de OAuth aqui
  };

  return (
    <>
      <button 
        className="btn btn-light w-100 btn-google mb-2"
        onClick={() => handleSocialLogin('google')}
      >
        <FaGoogle className="me-2" />
        Continue com Google
      </button>
      
      <button 
        className="btn btn-light w-100 btn-apple"
        onClick={() => handleSocialLogin('apple')}
      >
        <FaApple className="me-2" />
        Continue com Apple
      </button>
    </>
  );
}