'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

/**
 * Placeholder visitor counter. Not wired to real analytics — shows a
 * locally-persisted count for this browser only, clearly labeled so it's
 * never mistaken for live site-wide traffic data.
 */
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem('local-visit-count') || 0);
      const next = stored + 1;
      localStorage.setItem('local-visit-count', String(next));
      setCount(next);
    } catch {
      setCount(1);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      title="Placeholder — not connected to live analytics yet"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400"
    >
      <Eye size={13} />
      <span>
        Your visits: <span className="font-semibold text-zinc-200 tabular-nums">{count ?? '—'}</span>
      </span>
      <span className="text-zinc-600">· placeholder</span>
    </motion.div>
  );
}
