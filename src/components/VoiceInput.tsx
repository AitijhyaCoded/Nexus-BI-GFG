import React, { useState, useEffect, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { cn } from '../utils';

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onResult, className }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Check for both SpeechRecognition and webkitSpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onResult]);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={isListening}
      className={cn(
        "p-2 rounded-lg transition-all duration-300 flex items-center justify-center",
        isListening 
          ? "bg-rose-500/20 text-rose-400 animate-pulse scale-110 shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
          : "text-white/40 hover:text-white hover:bg-white/5",
        className
      )}
      title={isListening ? "Listening..." : "Start voice input"}
    >
      <Mic size={20} className={cn(isListening && "animate-bounce")} />
    </button>
  );
}
