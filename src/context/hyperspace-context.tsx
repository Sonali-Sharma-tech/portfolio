"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface HyperspaceContextType {
  isJourneyActive: boolean;
  targetPath: string;
  startJourney: (path: string) => void;
  endJourney: () => void;
}

const HyperspaceContext = createContext<HyperspaceContextType | undefined>(undefined);

export function HyperspaceProvider({ children }: { children: ReactNode }) {
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [targetPath, setTargetPath] = useState('/projects');

  const startJourney = useCallback((path: string) => {
    setTargetPath(path);
    setIsJourneyActive(true);
  }, []);

  const endJourney = useCallback(() => {
    setIsJourneyActive(false);
  }, []);

  return (
    <HyperspaceContext.Provider value={{ isJourneyActive, targetPath, startJourney, endJourney }}>
      {children}
    </HyperspaceContext.Provider>
  );
}

export function useHyperspace() {
  const context = useContext(HyperspaceContext);
  if (context === undefined) {
    throw new Error('useHyperspace must be used within a HyperspaceProvider');
  }
  return context;
}
