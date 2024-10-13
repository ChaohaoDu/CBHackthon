'use client';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {usePrompt} from "@/context/promptContext";
import Draggable from "react-draggable";
import Transition from "../transition";
import {Button} from "@/components/ui/button";

export default function MatrixPage() {
  const {coords, script} = usePrompt();
  const router = useRouter();


  useEffect(() => {
    if (!prompt || !script || !coords) {
    //   router.push('/');
    }
  }, [script, router]);



  return (
    <Transition>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 className="text-3xl font-semibold text-left pb-2">Check it out!</h1>

      </div>
    </Transition>
  );
}

