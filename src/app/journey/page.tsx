"use client";

import { useState } from "react";
import {
  ConstellationController,
  ConstellationCanvas,
  ConstellationHUD,
  StarInfoCard,
  ConstellationAudio,
  AudioToggle,
} from "@/components/constellation";

// Voyage-specific CSS - only loaded on this route
import "./voyage.css";

// ==========================================
// CONSTELLATION JOURNEY PAGE
// Navigate through the star chart of your career
// Use arrow keys to pilot through the constellation
// ==========================================

export default function JourneyPage() {
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <ConstellationController>
      {(state) => (
        <>
          {/* 3D Constellation Canvas */}
          <ConstellationCanvas
            progress={state.progress}
            currentScene={state.currentScene}
            activeStar={state.activeStar}
            illuminatedStars={state.illuminatedStars}
            lateralOffset={state.lateralOffset}
            cameraRoll={state.cameraRoll}
            isMoving={state.isMoving}
            isBoosting={state.isBoosting}
          />

          {/* Star information card */}
          <StarInfoCard
            activeStar={state.activeStar}
            progress={state.progress}
          />

          {/* HUD overlay */}
          <ConstellationHUD
            progress={state.progress}
            currentScene={state.currentScene}
            isBoosting={state.isBoosting}
          />

          {/* Audio system */}
          <ConstellationAudio
            currentScene={state.currentScene}
            isMoving={state.isMoving}
            isBoosting={state.isBoosting}
            activeStar={state.activeStar}
            enabled={audioEnabled}
          />

          {/* Audio toggle */}
          <AudioToggle
            enabled={audioEnabled}
            onToggle={() => setAudioEnabled(!audioEnabled)}
          />
        </>
      )}
    </ConstellationController>
  );
}
