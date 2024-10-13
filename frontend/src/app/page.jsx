'use client';
import {useEffect, useRef, useState} from 'react';
import Transition from './transition';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Skeleton} from '@/components/ui/skeleton';
import {usePrompt} from '@/context/promptContext';
import {useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
import {Badge} from '@/components/ui/badge';
import {Loader2} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

export default function Home() {
  const router = useRouter();
  const {prompt, setPrompt} = usePrompt();
  const [showScript, setShowScript] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const {toast} = useToast();

  const generateStoryBoard = async () => {
    setShowScript(true);
    setLoading(true);
    setPrompt(prompt.trim());

    try {
      const apiResponse = await axiosInstance.post('/get-samples', {prompt});
      setResults(apiResponse.data.samples);
      console.log(apiResponse.data.samples);
    } catch (e) {
      console.error(e);
      toast({
        title: 'Failed to generate storyboard',
        description: 'Please try again!',
      });
    } finally {
      setLoading(false);
    }
  };

  const goScriptPage = () => {
    router.push('/script');
  };

  return (
    <div className="relative h-screen w-screen flex overflow-hidden">
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showScript ? 'w-1/2' : 'w-full'
        } flex items-center justify-center h-full bg-gray-100 p-1`}
      >
        <Transition>
          <div className="flex flex-col items-center justify-center space-y-5 w-1/2">
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
                Generate Previews for Me!
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
            <div className="w-full flex flex-col space-y-4 items-center">
              <div className="w-full flex flex-col space-y-4">
                <Skeleton className="h-24 w-full rounded-md"/>
                <Skeleton className="h-24 w-full rounded-md"/>
                <Skeleton className="h-24 w-full rounded-md"/>
              </div>
              <div className="w-full flex justify-end">
                <Button disabled className="mt-4 flex items-center px-4 py-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Please wait
                </Button>
              </div>
            </div>
          )}

          {!loading && results.length !== 0 && (
            <>
              {results.map((result, index) => (
                  <div key={index} className="flex space-x-5 w-full">
                    <div className="w-1/2">
                      {result.imageUrl.endsWith('.mp4') || result.imageUrl.endsWith('.webm') || result.imageUrl.endsWith('.m3u8') ? (
                        // <VideoThumbnail videoUrl={result.imageUrl}/>
                        <video ref={videoRef} src={videoUrl} style={{display: 'none'}}/>
                      ) : (
                        <img
                          src={result.imageUrl}
                          alt={result.imageUrl}
                          className="w-full h-auto rounded-lg"
                        />
                      )}
                    </div>

                    <div className="w-1/2">
                      <h1
                        className="text-lg font-semibold line-clamp-2 overflow-hidden text-ellipsis"
                        style={{display: '-webkit-box', WebkitBoxOrient: 'vertical'}}
                      >
                        {result.title}
                      </h1>
                      <p className="text-lg">{result.text}</p>
                      {result.tags.map((tag, tagIndex) => (
                        <Badge variant="outline" key={tagIndex}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              )}

              <div className="w-full flex justify-end mt-4">
                <Button onClick={goScriptPage} className="px-6 py-2">
                  LGTM!
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
    ;
}

function VideoThumbnail({videoUrl}) {
  const videoRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const captureFrame = () => {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL('image/png'));
    };

    const video = videoRef.current;
    video.addEventListener('loadeddata', captureFrame);

    return () => {
      video.removeEventListener('loadeddata', captureFrame);
    };
  }, [videoUrl]);

  return (
    <div>
      {thumbnail ? (
        <img src={thumbnail} alt="Video thumbnail" className="w-full h-auto rounded-lg"/>
      ) : (
        <video ref={videoRef} src={videoUrl} style={{display: 'none'}}/>
      )}
    </div>
  );
}
