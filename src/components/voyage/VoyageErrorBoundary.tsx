"use client";

import { Component, ReactNode } from "react";

// ==========================================
// VOYAGE ERROR BOUNDARY
// Catches errors in 3D scenes and renders fallback
// Prevents WebGL crashes from breaking the entire app
// ==========================================

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class VoyageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development
    console.error("Voyage scene error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise a default message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-display text-cyan mb-2">
              Navigation System Offline
            </h2>
            <p className="text-white/60 font-mono text-sm mb-4">
              The 3D visualization encountered an error. Your browser may not
              support WebGL or there was a rendering issue.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 border border-cyan/50 text-cyan font-mono text-sm hover:bg-cyan/10 transition-colors"
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Static 2D fallback component for use when 3D fails
export function Static2DFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a25] to-black">
      {/* Simple CSS starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.7,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Centered message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-white/60 font-mono text-sm">
            Simplified view active
          </p>
        </div>
      </div>
    </div>
  );
}
