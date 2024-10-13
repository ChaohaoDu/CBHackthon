'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {usePrompt} from "@/context/promptContext";
import Draggable from "react-draggable";
import Transition from "../transition";
import {Button} from "@/components/ui/button";
import { Toast } from '@radix-ui/react-toast';
import {useToast} from '@/hooks/use-toast';
import axiosInstance from '../../lib/axiosInstance';
export default function ResultPage() {
  const {prompt, script, setScript, coords} = usePrompt();  
  const router = useRouter();
  const {toast} = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const hardCodedPrompt = "I am trying to create a compelling 1-minute video describing why the degree of difficulty in an Olympic Gymnastics event can impact the judge's score as much as the execution of the routine."



  const generateVideo = async () => {
    setLoading(true);
    setError(false);
    setErrorMessage('Server timed out.');

    try {
      const apiResponse = await axiosInstance.post('/get-video', {prompt: hardCodedPrompt});
    //   setResults(apiResponse.data.samples);
    //   console.log(apiResponse.data.samples);
    } catch (e) {
      console.error(e);
      let message = e.response.data.message;
      setErrorMessage(message);
    //   toast.error("Failed to generate video. Please try again!", {
    //     position: "top-right",
    //     autoClose: 5000,
    //   });
      toast({
        title: 'Failed to generate video',
        description: 'Please try again!',
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (prompt) {
        // console.log(prompt);
        generateVideo();
    // }
  }, [router]);


  return (
    <Transition>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 className="text-3xl font-semibold text-left pb-2">Check it out!</h1>

        { loading && <p>Loading...</p>}

        {results.length > 0 && (
          <div className="mt-4 w-full max-w-2xl">
            {results.map((sample, index) => (
              <div key={index} className="mb-4 p-4 border rounded shadow">
                {sample}
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <p>Error: {errorMessage}</p>
        )}

    
        <div className="mt-4">
            {/* <Button variant="secondary" onClick={handleBack} disabled={loading}>Back</Button> */}
            <Button onClick={generateVideo} disabled={loading}>{loading ? 'Generating...': 'Reload'}</Button>
        </div>
        


      </div>

      {/* Initialize Toast Container */}
      {/* <ToastConrtainer /> */}
    </Transition>
  );
}

