'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../lib/axiosInstance';
import Transition from "../transition";
import { Button } from "@/components/ui/button";
import { usePrompt } from "@/context/promptContext";
import { Input } from "@/components/ui/input";

export default function ScriptPage() {
  const { prompt, script, setScript } = usePrompt();
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchScript = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/get-script', { prompt });
      setScript(response.data.script);
    } catch (err) {
      console.error('Error fetching script:', err);
      setError('Failed to fetch the script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateScript = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/update-script', {
        prompt,
        script,
        suggestion,
      });
      setScript(response.data.script);
      setSuggestion('');
    } catch (err) {
      console.error('Error updating script:', err);
      setError('Failed to update the script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!prompt) {
      router.push('/'); // Redirect to root if prompt is empty
    } else {
      fetchScript();
    }
  }, [prompt, router]);

  const handleBack = () => {
    router.back();
  };

  const handleNextPage = () => {
    router.push('/matrix'); // Navigate to next page
  };

  return (
    <Transition>
      <div className="flex flex-col items-center justify-center h-screen w-screen p-6 space-y-5">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-semibold text-left">Your Script</h1>
        </div>

        {loading ? (
          <p className="mt-4 text-lg">Loading...</p>
        ) : error ? (
          <p className="mt-4 text-lg text-red-500">{error}</p>
        ) : (
          <>
            <p className="whitespace-pre-wrap mt-4 text-lg w-full max-w-lg">
              {script || 'No script available.'}
            </p>

            <div className="w-full max-w-lg flex space-x-2 mt-4">
              <Input
                type="text"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Enter your suggestion..."
                className="flex-1"
              />
              <Button onClick={updateScript} className="px-4 py-2">
                Update Script
              </Button>
            </div>
          </>
        )}

        <div className="w-full max-w-lg flex justify-between mt-6">
          <Button
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            onClick={handleNextPage}
          >
            Next Page
          </Button>
        </div>
      </div>
    </Transition>
  );
}
