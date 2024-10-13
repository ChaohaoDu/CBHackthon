'use client';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { usePrompt } from "../context/promptContext";
import Transition from "./transition";

export default function Home() {
  const router = useRouter();
  const { prompt, setPrompt } = usePrompt();

  const handleNextPage = () => {
    router.push('/script');
  };

  return (
    <Transition>
      <Head>
        <title>Enter your prompt</title>
      </Head>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <h1>Enter your prompt</h1>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text here..."
          rows="10"
          cols="50"
          style={{
            marginBottom: '20px',
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            maxWidth: '500px',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleNextPage}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Next Page
        </button>
      </div>
    </Transition>
  );
}
