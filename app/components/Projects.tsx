'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FolderGit2 } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import ProjectCard from './ProjectCard';
import CaseStudyModal from './CaseStudyModal';

export default function Projects() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [caseStudyProject, setCaseStudyProject] = useState<Project | null>(null);

  const filters = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => project.filterTags.forEach((tag) => tags.add(tag)));
    return ['All', ...Array.from(tags).sort()];
  }, []);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === 'All' || project.filterTags.includes(activeFilter);
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [query, activeFilter]);

  return (
    <section id="projects" className="py-24 bg-surface-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="pill-badge mb-4">Work</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col gap-4 items-center"
        >
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tech, keywords..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full text-sm surface-card bg-transparent border border-zinc-900/[0.08] dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-shadow"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  activeFilter === filter
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-zinc-900/[0.08] dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-amber-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key={`${activeFilter}-${query}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpenCaseStudy={setCaseStudyProject}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <FolderGit2 className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                No projects match your search.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveFilter('All');
                }}
                className="mt-3 text-sm font-medium text-orange-600 dark:text-amber-400 hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CaseStudyModal project={caseStudyProject} onClose={() => setCaseStudyProject(null)} />
    </section>
  );
}
