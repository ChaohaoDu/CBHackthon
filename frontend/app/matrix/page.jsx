'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {usePrompt} from "../../context/promptContext";
import Draggable from "react-draggable";
import Transition from "../transition";

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
    // 将坐标映射到 [-1, 1] 范围内
    const mappedX = (data.x / 150).toFixed(2);
    const mappedY = (-data.y / 150).toFixed(2);

    setCoords({x: mappedX, y: mappedY});
  };


  const handleSvgClick = (e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect(); // 获取 SVG 的尺寸和位置

    const x = e.clientX - rect.left - 150; // 转换为相对中心的 x 坐标
    const y = e.clientY - rect.top - 150;  // 转换为相对中心的 y 坐标

    const mappedX = (x / 150).toFixed(2);
    const mappedY = (-y / 150).toFixed(2);

    setCoords({x: mappedX, y: mappedY});
  };

  const handleBack = () => {
    router.back();
  };

  const handleNextPage = () => {
    router.push('/result'); // Navigate to next page
  };

  return (
    <Transition>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1>Drag the point and get coordinates</h1>
        <svg ref={svgRef} width="300" height="300" style={{border: '1px solid black'}} onClick={handleSvgClick}>
          <line x1="0" y1="150" x2="300" y2="150" stroke="black"/>
          <line x1="150" y1="0" x2="150" y2="300" stroke="black"/>

          <Draggable
            position={{x: coords.x * 150, y: -coords.y * 150}} // 使用坐标控制位置
            bounds={{left: -150, right: 150, top: -150, bottom: 150}}
            onDrag={handleDrag}
          >
            <circle cx="150" cy="150" r="10" fill="red"/>
          </Draggable>
        </svg>

        <p>
          Coordinates: (x: {coords.x}, y: {coords.y})
        </p>


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
