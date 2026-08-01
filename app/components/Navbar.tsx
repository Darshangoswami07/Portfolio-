'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll();
  const progressWidth = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: highlight the nav item for the section currently in view
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on Escape, and return focus to the toggle button
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Move focus into the menu for keyboard users
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a, button');
    firstLink?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-60 h-0.75 origin-left bg-linear-to-r from-orange-500 via-amber-400 to-orange-500"
        style={{ scaleX: progressWidth }}
        aria-hidden="true"
      />

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:px-4 focus:py-2 focus:rounded-full focus:bg-orange-500 focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      >
        <div
          className={`max-w-6xl mx-auto rounded-2xl transition-all duration-300 ${
            scrolled
              ? 'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-900/[0.06] dark:border-white/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]'
              : 'bg-white/30 dark:bg-zinc-900/20 backdrop-blur-md border border-transparent'
          }`}
        >
          <div className="flex justify-between items-center h-14 px-4 sm:px-5">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
              >
                Darshan<span className="text-orange-500">.</span>
              </Link>
              <span className="hidden lg:inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                Open to Work
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 rounded-full border border-zinc-900/[0.06] dark:border-white/10 bg-zinc-900/[0.02] dark:bg-white/[0.03] p-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    aria-current={isActive ? 'location' : undefined}
                    className="group relative px-3.5 py-1.5 text-sm font-medium rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-white dark:bg-white/10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${isActive ? 'text-zinc-900 dark:text-white' : ''}`}
                    >
                      {item.name}
                    </span>
                    {/* Animated underline on hover */}
                    <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-orange-500 scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-300" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('command-palette:toggle'))}
                aria-label="Open command palette"
                title="Command palette (Ctrl+K)"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-900/[0.08] dark:border-white/10 bg-zinc-900/[0.02] dark:bg-white/[0.03] text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
              >
                <Search size={13} />
                <kbd className="text-[10px] font-semibold">Ctrl K</kbd>
              </button>

              <ThemeToggle />

              <div className="hidden md:block">
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="btn-gradient px-4 py-2 rounded-full text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                >
                  Let&apos;s talk
                </button>
              </div>
            </div>

            {/* Mobile menu button — animated hamburger */}
            <div className="md:hidden">
              <button
                ref={toggleBtnRef}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-menu"
                className="relative w-9 h-9 -mr-1.5 flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
              >
                <span className="relative block w-5 h-4">
                  <motion.span
                    className="absolute left-0 top-0 w-5 h-0.5 rounded-full bg-current"
                    animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 rounded-full bg-current"
                    animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="absolute left-0 bottom-0 w-5 h-0.5 rounded-full bg-current"
                    animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            id="mobile-nav-menu"
            ref={menuRef}
            initial={false}
            animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-zinc-900/[0.06] dark:border-white/10"
            aria-hidden={!isOpen}
          >
            <div className="px-2 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    aria-current={isActive ? 'location' : undefined}
                    tabIndex={isOpen ? 0 : -1}
                    className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 ${
                      isActive
                        ? 'text-orange-600 dark:text-amber-400 bg-orange-500/10'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-amber-400 hover:bg-zinc-900/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
