"use client";

import { useHyperspace } from "@/context/hyperspace-context";
import { HyperspaceJourney } from "./hyperspace-journey";

export function HyperspaceJourneyWrapper() {
  const { isJourneyActive, targetPath, endJourney } = useHyperspace();

  return (
    <HyperspaceJourney
      isActive={isJourneyActive}
      targetPath={targetPath}
      onComplete={endJourney}
    />
  );
}
