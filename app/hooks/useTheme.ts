'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'site-theme';
const THEME_CHANGE_EVENT = 'site-theme-change';

// useLayoutEffect is a no-op (with a console warning) during SSR since it
// requires a DOM; fall back to useEffect there. On the client, using the
// layout variant syncs the real theme in before paint, avoiding an icon
// flash — while still running strictly after the hydration-matching commit.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('theme-dark', 'theme-light');
  root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
}

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('theme-light') ? 'light' : 'dark';
}

export function useTheme() {
  // Always start with the same default the SSR HTML/inline init script use
  // ('dark') so the first client render matches exactly — avoids a
  // hydration mismatch. The real theme (already applied to <html> by the
  // inline init script, so there's no visual flash) is synced in
  // immediately after mount.
  const [theme, setThemeState] = useState<Theme>('dark');

  useIsomorphicLayoutEffect(() => {
    setThemeState(readInitialTheme());

    const handleChange = () => setThemeState(readInitialTheme());
    window.addEventListener(THEME_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore (private browsing / storage disabled)
    }
    setThemeState(next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
