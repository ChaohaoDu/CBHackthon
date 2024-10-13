'use client';
import { createContext, useState, useContext } from 'react';

const PromptContext = createContext();

export function PromptProvider({ children }) {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');

  return (
    <PromptContext.Provider value={{ prompt, setPrompt, script, setScript }}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompt() {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
}
