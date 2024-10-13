'use client';
import Head from 'next/head';
import {useRouter} from 'next/navigation';
import {usePrompt} from "../context/promptContext";
import Transition from "./transition";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

export default function Home() {
  const router = useRouter();
  const {prompt, setPrompt} = usePrompt();

  const handleNextPage = () => {
    router.push('/script');
  };

  return (
    <>
      <Transition>
        <div className="flex flex-col items-center justify-center h-screen w-screen space-y-5 p-6">
          {/* Title */}
          <h1 className="text-3xl font-semibold text-left w-full max-w-lg">
            Enter your prompt
          </h1>

          {/* Textarea */}
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your text here..."
            rows={10}
            className="w-full max-w-lg"
          />

          {/* Button aligned to the right under the Textarea */}
          <div className="w-full max-w-lg flex justify-end">
            <Button onClick={handleNextPage} className="px-6 py-2">
              Next Page
            </Button>
          </div>
        </div>
      </Transition>
    </>
  );
}
