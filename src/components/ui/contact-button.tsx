"use client";

interface ContactButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function ContactButton({ className = "", children }: ContactButtonProps) {
  return (
    <button
      onClick={() => (window.location.href = "mailto:sonalisharma.tech123@gmail.com")}
      className={className}
    >
      {children}
    </button>
  );
}
