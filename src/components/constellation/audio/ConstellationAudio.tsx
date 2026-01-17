"use client";

import { useEffect, useRef, useCallback } from "react";
import { Howl, Howler } from "howler";

// ==========================================
// CONSTELLATION AUDIO
// Manages ambient sounds and effects
// Uses Web Audio API via Howler.js
// ==========================================

interface ConstellationAudioProps {
  currentScene: string;
  isMoving: boolean;
  isBoosting: boolean;
  activeStar: { id: string } | null;
  enabled?: boolean;
}

// Audio configuration
const AUDIO_CONFIG = {
  ambient: {
    volume: 0.15,
    fadeTime: 2000,
  },
  effects: {
    volume: 0.3,
  },
};

// Generate simple sounds using Web Audio API oscillators
// This avoids needing external audio files
function createOscillatorSound(
  context: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine'
): void {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  // Envelope
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
}

export function ConstellationAudio({
  currentScene,
  isMoving,
  isBoosting,
  activeStar,
  enabled = true,
}: ConstellationAudioProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastStarRef = useRef<string | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // Initialize audio context on user interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current && enabled) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & {webkitAudioContext: typeof AudioContext}).webkitAudioContext)();

      // Create ambient noise (space hum)
      createAmbientNoise();
    }
  }, [enabled]);

  // Create ambient space noise
  const createAmbientNoise = useCallback(() => {
    const context = audioContextRef.current;
    if (!context) return;

    // Create a buffer of low-frequency noise
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);

    // Generate brown noise (more bass-heavy, space-like)
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 0.5; // Reduce volume
    }

    // Create and connect nodes
    const noiseNode = context.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, context.currentTime + 2);

    // Low-pass filter for space ambience
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, context.currentTime);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    noiseNode.start();

    noiseNodeRef.current = noiseNode;
    noiseGainRef.current = gainNode;
  }, []);

  // Play star activation chime
  const playStarChime = useCallback((starId: string) => {
    const context = audioContextRef.current;
    if (!context || !enabled) return;

    // Different frequencies for different star types
    const frequencies: Record<string, number> = {
      origin: 440, // A4
      ey: 494, // B4
      '6figr': 523, // C5
      'captain-fresh': 587, // D5
      glance: 659, // E5
      devtoolkit: 698, // F5
      'colorful-extension': 784, // G5
      'black-note': 880, // A5
    };

    const freq = frequencies[starId] || 440;

    // Play a pleasant chime (multiple harmonics)
    createOscillatorSound(context, freq, 0.5, 'sine');
    setTimeout(() => createOscillatorSound(context, freq * 1.5, 0.3, 'sine'), 50);
    setTimeout(() => createOscillatorSound(context, freq * 2, 0.2, 'sine'), 100);
  }, [enabled]);

  // Play boost sound
  const playBoostSound = useCallback(() => {
    const context = audioContextRef.current;
    if (!context || !enabled) return;

    // Whoosh effect using noise and filter sweep
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, context.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, context.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  }, [enabled]);

  // Initialize on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      // Remove listeners after first interaction
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);

      // Cleanup audio
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [initAudio]);

  // Play star chime when active star changes
  useEffect(() => {
    if (activeStar && activeStar.id !== lastStarRef.current) {
      playStarChime(activeStar.id);
      lastStarRef.current = activeStar.id;
    }
  }, [activeStar, playStarChime]);

  // Adjust ambient based on boosting
  useEffect(() => {
    const gainNode = noiseGainRef.current;
    const context = audioContextRef.current;

    if (gainNode && context) {
      const targetGain = isBoosting ? 0.06 : 0.03;
      gainNode.gain.linearRampToValueAtTime(targetGain, context.currentTime + 0.3);
    }

    // Play boost sound on boost start
    if (isBoosting) {
      playBoostSound();
    }
  }, [isBoosting, playBoostSound]);

  // This component doesn't render anything visible
  return null;
}

// Audio toggle button (optional UI element)
export function AudioToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-20 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/50 border border-white/20 rounded-full hover:border-white/40 transition-colors"
      aria-label={enabled ? 'Mute audio' : 'Enable audio'}
    >
      {enabled ? (
        <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
