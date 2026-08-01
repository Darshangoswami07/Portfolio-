'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Github, FileText, CheckCircle2, Sparkles } from 'lucide-react';
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

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenCaseStudy: (project: Project) => void;
}

export default function ProjectCard({ project, index, onOpenCaseStudy }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      viewport={{ once: true }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="project-card glow-border group relative surface-card overflow-hidden flex flex-col h-full"
      >
        <div className="spotlight" />

        {/* Large cover image */}
        <div className="relative aspect-video w-full overflow-hidden bg-linear-to-br from-orange-500/20 via-amber-400/10 to-zinc-900/5">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-orange-500/50 dark:text-amber-400/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status badge */}
          <span
            className={`absolute top-3 left-3 inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${statusStyles[project.status]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[project.status]}`} />
            {project.status}
          </span>

          {project.featured && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-900/80 text-orange-600 dark:text-amber-400 backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        <div className="p-6 relative z-[1] flex flex-col flex-1" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-300 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 5 && (
              <span className="px-2.5 py-1 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                +{project.tags.length - 5} more
              </span>
            )}
          </div>

          {/* Key features */}
          <ul className="space-y-1.5 mb-5">
            {project.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 dark:text-amber-400 mt-0.5 shrink-0" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-zinc-900/[0.06] dark:border-white/[0.06]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors"
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
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors"
              >
                <ExternalLink size={16} />
                <span>Live Demo</span>
              </a>
            )}
            <button
              onClick={() => onOpenCaseStudy(project)}
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors"
            >
              <FileText size={16} />
              <span>Case Study</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
