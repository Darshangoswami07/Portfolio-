'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'has-seen-preloader';

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // ignore
    }

    if (reduceMotion || alreadySeen) return;

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // ignore
      }
    }, 750);

    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          aria-hidden="true"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
              Darshan<span className="text-orange-500">.</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
