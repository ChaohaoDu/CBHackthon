'use client';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const handleNextPage = () => {
    router.push('/script');
  };

  return (
    <>
      script
    </>
  );
}
