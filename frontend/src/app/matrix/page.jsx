'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {usePrompt} from "@/context/promptContext";
import Draggable from "react-draggable";
import Transition from "../transition";
import {Button} from "@/components/ui/button";

export default function MatrixPage() {
  const router = useRouter();
  const {script} = usePrompt();
  const [coords, setCoords] = useState({x: 0.5, y: -0.5});

  const svgRef = useRef(null);

  useEffect(() => {
    if (!script) {
      router.push('/');
    }
  }, [script, router]);


  const handleDrag = (e, data) => {
    const newX = data.x / 300; // Normalize between -1 and 1
    const newY = -data.y / 300; // SVG Y-axis is inverted
    setCoords({x: newX.toFixed(2), y: newY.toFixed(2)});
  };


  const handleBack = () => {
    router.back();
  };

  const handleNextPage = () => {
    const humorous = Math.abs(coords.x);
    const dense = Math.abs(coords.y);


    router.push('/result');
  };

  return (
    <Transition>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 className="text-3xl font-semibold text-left pb-2">Customize Your Script</h1>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '20px', background: 'linear-gradient(#333, #111)'
          }}
        >
          <svg
            ref={svgRef}
            width="300"
            height="300"
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(#333, #111)',
            }}
          >
            {/* Grid Background */}
            <defs>
              <pattern
                id="grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#444" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>

            <text x="150" y="20" textAnchor="middle" fill="#aaa" fontSize="12">
              RELAXED
            </text>
            <text x="150" y="290" textAnchor="middle" fill="#aaa" fontSize="12">
              DENSE
            </text>
            <text
              x="20"
              y="150"
              textAnchor="middle"
              fill="#aaa"
              fontSize="12"
              transform="rotate(-90 20,150)"
            >
              PROFESSIONAL
            </text>
            <text
              x="280"
              y="150"
              textAnchor="middle"
              fill="#aaa"
              fontSize="12"
              transform="rotate(90 280,150)"
            >
              HUMOROUS
            </text>

            <Draggable
              position={{x: coords.x * 300, y: -coords.y * 300}}
              bounds={{left: 0, right: 300, top: 0, bottom: 300}}
              onDrag={handleDrag}
            >
              <g transform="translate(150, 150)"> {/* Center the draggable group */}
                <circle r="20" fill="gray" stroke="white" strokeWidth="2"/>
              </g>
            </Draggable>
          </svg>
        </div>


        <p className="text-lg">
          Coordinates: (x: {coords.x}, y: {coords.y})
        </p>

        <div className="w-full max-w-lg flex justify-between mt-6">
          <Button variant="secondary" onClick={handleBack}>Back</Button>
          <Button onClick={handleNextPage}>Generate Video!</Button>
        </div>
      </div>
    </Transition>
  );
}

