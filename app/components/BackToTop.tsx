'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 480);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 10 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25 }}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full glass-panel shadow-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-orange-500 dark:hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="19.5" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
            <motion.circle
              cx="22"
              cy="22"
              r="19.5"
              fill="none"
              stroke="currentColor"
              className="text-orange-500 dark:text-amber-400"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp size={16} className="relative z-[1]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
