'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ExternalLink, Github, CheckCircle2, Sparkles } from 'lucide-react';
import type { Project } from '../data/projects';

const statusStyles: Record<Project['status'], string> = {
  Live: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Completed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'In Progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const statusDot: Record<Project['status'], string> = {
  Live: 'bg-green-500',
  Completed: 'bg-blue-500',
  'In Progress': 'bg-amber-500',
};

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (project) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [project, handleEscape]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            className="surface-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-linear-to-br from-orange-500/20 via-amber-400/10 to-zinc-900/5 rounded-t-2xl">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(min-width: 768px) 42rem, 100vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-orange-500/50 dark:text-amber-400/50" />
                </div>
              )}

              <button
                onClick={onClose}
                aria-label="Close case study"
                className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-md"
              >
                <X size={16} />
              </button>

              <span
                className={`absolute top-3 left-3 inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${statusStyles[project.status]}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[project.status]}`} />
                {project.status}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                {project.longDescription}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-2.5">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-2.5">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 dark:text-amber-400 mt-0.5 shrink-0" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-zinc-900/[0.06] dark:border-white/[0.06]">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900/[0.08] dark:hover:bg-white/[0.1] transition-colors"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gradient inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
