'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { lightTheme, darkTheme, createCSSVariableMap } from '@/lib/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  readonly children: React.ReactNode;
  readonly defaultTheme?: ThemeMode;
  readonly storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'light',
  storageKey = 'theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Apply CSS variables to document element
  const applyTheme = (currentTheme: ThemeMode) => {
    const root = document.documentElement;
    const themeTokens = currentTheme === 'light' ? lightTheme : darkTheme;
    const cssVars = createCSSVariableMap(themeTokens, 'theme');

    // Remove old theme variables
    Object.keys(cssVars).forEach(key => {
      root.style.removeProperty(key);
    });

    // Apply new theme variables
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', currentTheme);
  };

  // Initialize theme from localStorage or default
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as ThemeMode;
      const initialTheme = storedTheme || defaultTheme;
      setThemeState(initialTheme);
      setMounted(true);
    } catch (error) {
      // Fallback if localStorage is not available
      console.warn('localStorage not available, using default theme:', error);
      setThemeState(defaultTheme);
      setMounted(true);
    }
  }, [defaultTheme, storageKey]);

  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      try {
        applyTheme(theme);
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn('Failed to apply theme or save to localStorage:', error);
      }
    }
  }, [theme, mounted, storageKey]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme
  }), [theme, toggleTheme, setTheme]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme Toggle Component
interface ThemeToggleProps {
  readonly className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const context = useContext(ThemeContext);
  
  // Safety check - if context is not available, render a placeholder
  if (!context) {
    return (
      <button
        className={`
          relative inline-flex h-10 w-10 items-center justify-center rounded-lg
          bg-neutral-100 dark:bg-neutral-800
          text-neutral-700 dark:text-neutral-300
          transition-colors duration-200
          ${className}
        `}
        disabled
        aria-label="Theme toggle loading"
      >
        <div className="h-5 w-5 animate-pulse bg-neutral-400 rounded" />
      </button>
    );
  }

  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-10 w-10 items-center justify-center rounded-lg
        bg-neutral-100 dark:bg-neutral-800
        text-neutral-700 dark:text-neutral-300
        hover:bg-neutral-200 dark:hover:bg-neutral-700
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        transition-colors duration-200
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        // Moon icon for dark mode
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}

// Alternative toggle with text labels
export function ThemeToggleWithLabel({ className = '' }: ThemeToggleProps) {
  const context = useContext(ThemeContext);
  
  // Safety check - if context is not available, render a placeholder
  if (!context) {
    return (
      <button
        className={`
          inline-flex items-center gap-2 px-3 py-2 rounded-lg
          bg-neutral-100 dark:bg-neutral-800
          text-neutral-700 dark:text-neutral-300
          transition-colors duration-200
          ${className}
        `}
        disabled
        aria-label="Theme toggle loading"
      >
        <div className="h-4 w-4 animate-pulse bg-neutral-400 rounded" />
        <span className="animate-pulse bg-neutral-400 rounded h-4 w-12" />
      </button>
    );
  }

  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg
        bg-neutral-100 dark:bg-neutral-800
        text-neutral-700 dark:text-neutral-300
        hover:bg-neutral-200 dark:hover:bg-neutral-700
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        transition-colors duration-200
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Dark
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Light
        </>
      )}
    </button>
  );
}
