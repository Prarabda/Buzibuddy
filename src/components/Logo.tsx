import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  // Responsive dimensions for each scenario
  const sizes = {
    sm: {
      container: 'h-15 w-15 rounded-md text-sm',
      img: 'h-15 w-15 rounded-md object-contain',
      text: 'B',
    },
    md: {
      container: 'h-26 w-26 rounded-xl text-base shadow-sm shadow-emerald-950/20',
      img: 'h-26 w-26 rounded-xl object-contain',
      text: 'B',
    },
    lg: {
      container: 'h-40 w-40 rounded-2xl text-3xl shadow-xl shadow-emerald-600/20',
      img: 'h-40 w-40 rounded-2xl object-contain',
      text: 'B',
    },
  };

  const selectedSize = sizes[size];

  // Try to load /logo.png (which is located in public/logo.png in the project root)
  if (!imgError) {
    return (
      <div className={`flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/logo.png"
          alt="BuziBuddy Logo"
          onError={() => setImgError(true)}
          className={selectedSize.img}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Graceful visual fallback to the beautiful emerald branded badge
  return (
    <div
      className={`flex items-center justify-center bg-emerald-600 text-white font-extrabold shrink-0 ${selectedSize.container} ${className}`}
    >
      {selectedSize.text}
    </div>
  );
};