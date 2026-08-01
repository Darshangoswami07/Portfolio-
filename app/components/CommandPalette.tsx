'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  Home,
  User,
  Briefcase,
  Code2,
  FolderGit2,
  FileText,
  Mail,
  Github,
  Linkedin,
  Sun,
  Moon,
  Download,
  CornerDownLeft,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Command {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions' | 'Links';
  icon: typeof Home;
  keywords?: string;
  action: () => void;
}

const EMAIL = 'darshangirigoswami07@gmail.com';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const close = () => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  };

  const goTo = (hash: string) => {
    router.push('/');
    window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    close();
  };

  const commands: Command[] = useMemo(
    () => [
      { id: 'home', label: 'Go to Home', group: 'Navigate', icon: Home, action: () => goTo('#home') },
      { id: 'about', label: 'Go to About', group: 'Navigate', icon: User, action: () => goTo('#about') },
      { id: 'experience', label: 'Go to Experience & Education', group: 'Navigate', icon: Briefcase, action: () => goTo('#experience') },
      { id: 'skills', label: 'Go to Skills', group: 'Navigate', icon: Code2, action: () => goTo('#skills') },
      { id: 'projects', label: 'Go to Projects', group: 'Navigate', icon: FolderGit2, action: () => goTo('#projects') },
      { id: 'github', label: 'Go to GitHub Activity', group: 'Navigate', icon: Github, action: () => goTo('#github') },
      { id: 'resume', label: 'Go to Resume', group: 'Navigate', icon: FileText, action: () => goTo('#resume') },
      { id: 'faq', label: 'Go to FAQ', group: 'Navigate', icon: FileText, action: () => goTo('#faq') },
      { id: 'contact', label: 'Go to Contact', group: 'Navigate', icon: Mail, action: () => goTo('#contact') },
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        group: 'Actions',
        icon: theme === 'dark' ? Sun : Moon,
        keywords: 'dark light theme mode toggle',
        action: () => {
          toggleTheme();
          close();
        },
      },
      {
        id: 'resume-download',
        label: 'Download Resume (PDF)',
        group: 'Actions',
        icon: Download,
        keywords: 'cv download pdf',
        action: () => {
          const link = document.createElement('a');
          link.href = '/resume/Darshan_Giri_Goswami_CV.pdf';
          link.download = 'Darshan_Giri_Goswami_CV.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          close();
        },
      },
      {
        id: 'copy-email',
        label: 'Copy Email Address',
        group: 'Actions',
        icon: Mail,
        keywords: 'email contact copy',
        action: () => {
          navigator.clipboard?.writeText(EMAIL).catch(() => {});
          close();
        },
      },
      {
        id: 'github',
        label: 'Open GitHub Profile',
        group: 'Links',
        icon: Github,
        keywords: 'code repos',
        action: () => {
          window.open('https://github.com/Darshangoswami07', '_blank', 'noopener,noreferrer');
          close();
        },
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn Profile',
        group: 'Links',
        icon: Linkedin,
        action: () => {
          window.open('https://www.linkedin.com/in/darshan-goswami-b09137222/', '_blank', 'noopener,noreferrer');
          close();
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords?.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (modifier && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    const handleToggleEvent = () => setOpen((prev) => !prev);
    window.addEventListener('command-palette:toggle', handleToggleEvent);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('command-palette:toggle', handleToggleEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[activeIndex]?.action();
    }
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-900/[0.06] dark:border-white/10">
              <Search size={17} className="text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <kbd className="hidden sm:block px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-zinc-400 border border-zinc-900/10 dark:border-white/10">
                Esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-center text-zinc-500 dark:text-zinc-400">
                  No matching commands.
                </p>
              )}
              {filtered.map((cmd, index) => {
                const showGroupLabel = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                const isActive = index === activeIndex;
                return (
                  <div key={cmd.id}>
                    {showGroupLabel && (
                      <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                        {cmd.group}
                      </p>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={cmd.action}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                        isActive
                          ? 'bg-orange-500/10 text-orange-600 dark:text-amber-400'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <cmd.icon size={16} className="shrink-0" />
                      <span className="flex-1">{cmd.label}</span>
                      {isActive && <CornerDownLeft size={14} className="shrink-0 opacity-60" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
