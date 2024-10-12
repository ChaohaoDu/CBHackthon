'use client';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const handleNextPage = () => {
    router.push('/script');
  };

  return (
    <>
      <Head>
        <title>Enter your prompt</title>
      </Head>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Enter your prompt</h1>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text here..."
          rows="10"
          cols="50"
          style={{ marginBottom: '20px', padding: '10px', fontSize: '16px' }}
        />
        <br />
        <button onClick={handleNextPage} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Next Page
        </button>
      </div>
    </>
  );
}
