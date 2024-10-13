'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {usePrompt} from "../../context/promptContext";
import Draggable from "react-draggable";
import Transition from "../transition";
import {Button} from "@/components/ui/button";

export default function MatrixPage() {
  const router = useRouter();
  const {script} = usePrompt();
  const svgRef = useRef(null);

  useEffect(() => {
    if (!script) {
      router.push('/');
    }
  }, [script, router]);

  const [coords, setCoords] = useState({x: 0, y: 0});

  const handleDrag = (e, data) => {
    const mappedX = (data.x / 150).toFixed(2);
    const mappedY = (-data.y / 150).toFixed(2);

    setCoords({x: mappedX, y: mappedY});
  };

  const handleSvgClick = (e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    const x = e.clientX - rect.left - 150;
    const y = e.clientY - rect.top - 150;

    const mappedX = (x / 150);
    const mappedY = (-y / 150);

    setCoords({x: mappedX.toFixed(2), y: mappedY.toFixed(2)});
  };

  const handleBack = () => {
    router.back();
  };

  const handleNextPage = () => {
    router.push('/result');
  };

  return (
    <Transition>
      <div className="flex flex-col items-center justify-center h-screen w-screen space-y-5 p-6">
        <h1 className="text-3xl font-semibold">Drag the point and get coordinates</h1>

        {/* SVG Container */}
        <div className="flex items-center justify-center">
          <svg
            ref={svgRef}
            width="300"
            height="300"
            className="border border-black"
            onClick={handleSvgClick}
          >
            <line x1="0" y1="150" x2="300" y2="150" stroke="black"/>
            <line x1="150" y1="0" x2="150" y2="300" stroke="black"/>

            <Draggable
              position={{x: coords.x * 150, y: -coords.y * 150}}
              bounds={{left: -150, right: 150, top: -150, bottom: 150}}
              onDrag={handleDrag}
            >
              <circle cx="150" cy="150" r="10" fill="red"/>
            </Draggable>
          </svg>
        </div>

        {/* Coordinates Display */}
        <p className="text-lg">
          Coordinates: (x: {coords.x}, y: {coords.y})
        </p>

        {/* Buttons */}
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
