import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Shield Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 40 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Background with Gradient */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          
          {/* Shield Shape */}
          <path
            d="M20 0L38 8V24C38 32.8366 30.8366 40 22 40H18C9.16344 40 2 32.8366 2 24V8L20 0Z"
            fill="url(#shieldGradient)"
            stroke="#1e293b"
            strokeWidth="2"
          />
          
          {/* House Icon */}
          <path
            d="M12 28H28V36H12V28Z"
            stroke="#1e293b"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M20 20L12 28H28L20 20Z"
            stroke="#1e293b"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Keyhole */}
          <circle
            cx="20"
            cy="32"
            r="2"
            stroke="#1e293b"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="19"
            y="34"
            width="2"
            height="2"
            stroke="#1e293b"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Padlock */}
          <path
            d="M16 16H24C25.1046 16 26 16.8954 26 18V20C26 21.1046 25.1046 22 24 22H16C14.8954 22 14 21.1046 14 20V18C14 16.8954 14.8954 16 16 16Z"
            stroke="#1e293b"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M18 16V14C18 12.8954 18.8954 12 20 12C21.1046 12 22 12.8954 22 14V16"
            stroke="#1e293b"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className={`font-bold uppercase text-secondary-800 dark:text-secondary-200 ${textSizeClasses[size]}`}>
          MYASSET
        </span>
        <span className={`font-bold uppercase text-primary-600 dark:text-primary-400 ${textSizeClasses[size]}`}>
          LOCKER
        </span>
      </div>
    </div>
  );
}
