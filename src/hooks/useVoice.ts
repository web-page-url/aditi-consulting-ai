'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
  enabled: boolean;
}

export function useVoice() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    rate: 0.9, // Slightly slower for better clarity
    pitch: 1,
    volume: 0.7, // Lower volume to be less intrusive
    voice: null,
    enabled: false, // Disabled by default to prevent auto-speaking
  });
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Set default voice (prefer high-quality English voices)
        const englishVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en') && (
            voice.name.includes('Neural') || 
            voice.name.includes('Premium') ||
            voice.name.includes('Enhanced') ||
            voice.name.includes('Google')
          )
        ) || availableVoices.find(voice => 
          voice.lang.startsWith('en') && voice.localService === false
        ) || availableVoices.find(voice => 
          voice.lang.startsWith('en')
        ) || availableVoices[0];
        
        if (englishVoice && !settings.voice) {
          setSettings(prev => ({ ...prev, voice: englishVoice }));
        }
      };

      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, [settings.voice]);

  const speak = (text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    if (settings.voice) {
      utterance.voice = settings.voice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (isSupported && isPlaying) {
      speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (isSupported && speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  };

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    isSupported,
    isPlaying,
    voices,
    settings,
    speak,
    stop,
    pause,
    resume,
    updateSettings,
  };
}