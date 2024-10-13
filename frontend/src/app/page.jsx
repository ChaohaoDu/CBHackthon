'use client';
import Transition from './transition';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Skeleton} from '@/components/ui/skeleton';
import {useState} from 'react';
import {usePrompt} from '@/context/promptContext';
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();
  const {prompt, setPrompt} = usePrompt();
  const [showScript, setShowScript] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // Store array of objects

  const generateStoryBoard = () => {
    setShowScript(true);
    setLoading(true);
    setPrompt(prompt.trim());

    // todo
    setTimeout(() => {
      const apiResponse = [
        {
          image: 'https://via.placeholder.com/50',
          text: 'This is the first script.',
        },
        {
          image: 'https://via.placeholder.com/50',
          text: 'This is the second script.',
        },
        {
          image: 'https://via.placeholder.com/50',
          text: 'This is the third script.',
        },
      ];

      setResults(apiResponse);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative h-screen w-screen flex overflow-hidden">
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showScript ? 'w-1/2' : 'w-full'
        } flex items-center justify-center h-full bg-gray-100 p-1`}
      >
        <Transition>
          <div className="flex flex-col items-center justify-center space-y-5 w-1/2 ">
            <h1 className="text-3xl font-semibold text-left w-full">
              Enter your prompt
            </h1>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your text here..."
              rows={10}
            />

            <div className="w-full flex justify-end">
              <Button onClick={generateStoryBoard} className="px-6 py-2">
                Generate Script for Me!
              </Button>
            </div>
          </div>
        </Transition>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showScript ? 'translate-x-0 w-1/2' : 'hidden translate-x-full w-0'
        } flex items-center justify-center h-full bg-white p-6`}
      >
        <div className="flex flex-col items-center space-y-5 w-full max-w-lg">
          {loading && (
            <div className="w-full flex flex-col space-y-4">
              <Skeleton className="h-24 w-full rounded-md"/>
              <Skeleton className="h-24 w-full rounded-md"/>
              <Skeleton className="h-24 w-full rounded-md"/>
            </div>
          )}

          {!loading &&
            results.map((result, index) => (
              <div key={index} className="flex items-center space-x-5 w-full p-4">
                <div className="w-1/2 flex-shrink-0">
                  <img
                    src={result.image}
                    alt={`Generated storyboard ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <div className="w-1/2">
                  <p className="text-lg leading-relaxed">{result.text}</p>
                </div>
              </div>
            ))}
          {!loading && results.length > 0 && (
            <div className="w-full flex justify-end mt-4">
              <Button
                onClick={() => router.push('/script')}
                className="px-6 py-2"
              >
                Go to Next Step
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
