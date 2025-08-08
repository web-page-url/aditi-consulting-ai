'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useVoice } from '@/hooks/useVoice';

interface VoiceContextType {
  isSupported: boolean;
  isPlaying: boolean;
  voices: SpeechSynthesisVoice[];
  settings: {
    rate: number;
    pitch: number;
    volume: number;
    voice: SpeechSynthesisVoice | null;
  };
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  updateSettings: (settings: any) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const voice = useVoice();

  return (
    <VoiceContext.Provider value={voice}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoiceContext() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoiceContext must be used within VoiceProvider');
  }
  return context;
}