"use client";

// Parallax Starfield - multiple layers at different speeds
function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="stars stars-small" />
      <div className="stars stars-medium" />
      <div className="stars stars-large" />
    </div>
  );
}

export function SpaceEffects() {
  return (
    <>
      <Starfield />
    </>
  );
}
