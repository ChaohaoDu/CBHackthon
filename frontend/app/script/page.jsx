'use client';

import {useEffect, useState} from 'react';
import {usePrompt} from '../../context/promptContext';
import {useRouter} from 'next/navigation';
import axiosInstance from '../../lib/axiosInstance';
import Transition from "../transition";

export default function ScriptPage() {
  const {prompt, script, setScript} = usePrompt();
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchScript = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/get-script', {prompt});
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
      <div style={{padding: '20px', textAlign: 'center'}}>
        <h1>Your Script</h1>
        {loading ? (
          <p style={{marginTop: '20px', fontSize: '18px'}}>Loading...</p>
        ) : error ? (
          <p style={{marginTop: '20px', color: 'red', fontSize: '18px'}}>
            {error}
          </p>
        ) : (
          <>
            <p style={{whiteSpace: 'pre-wrap', marginTop: '20px', fontSize: '18px'}}>
              {script || 'No script available.'}
            </p>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Enter your suggestion..."
              rows="4"
              cols="50"
              style={{marginTop: '20px', padding: '10px', fontSize: '16px'}}
            />
            <br/>
            <button
              onClick={updateScript}
              style={{marginTop: '10px', padding: '10px 20px', fontSize: '16px'}}
            >
              Update Script
            </button>
          </>
        )}

        <div style={{marginTop: '20px'}}>
          <button
            onClick={handleBack}
            style={{marginRight: '10px', padding: '10px 20px', fontSize: '16px'}}
          >
            Back
          </button>
          <button
            onClick={handleNextPage}
            style={{padding: '10px 20px', fontSize: '16px'}}
          >
            Next Page
          </button>
        </div>
      </div>
    </Transition>
  );
}
