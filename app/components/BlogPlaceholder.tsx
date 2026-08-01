'use client';

import { motion } from 'framer-motion';
import { Newspaper, Sparkles } from 'lucide-react';

const upcomingTopics = [
  'Building a MERN job portal from scratch',
  'Structuring scalable React component architecture',
  'Lessons from integrating AI chat into a portfolio',
];

export default function BlogPlaceholder() {
  return (
    <section id="blog" className="py-24 bg-surface-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="surface-card glow-border relative overflow-hidden p-8 sm:p-12 text-center"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 pill-badge mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Coming Soon
            </span>
            <Newspaper className="w-8 h-8 mx-auto mb-4 text-orange-500 dark:text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              Blog — Under Construction
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
              I&apos;m working on a space to share write-ups on full-stack development, project
              breakdowns, and lessons learned. Here&apos;s what&apos;s planned:
            </p>

            <ul className="grid gap-3 max-w-md mx-auto text-left mb-2">
              {upcomingTopics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-900/[0.03] dark:bg-white/[0.04] rounded-xl px-4 py-3"
                >
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-orange-500 shrink-0" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
