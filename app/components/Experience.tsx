'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { experiences, type Experience as ExperienceItem } from '../data/experience';
import { Briefcase, Rocket, GraduationCap, Code2, MapPin, Calendar, Award } from 'lucide-react';

const typeMeta: Record<
  ExperienceItem['type'],
  { label: string; icon: typeof Briefcase; dot: string; ring: string; badge: string }
> = {
  work: {
    label: 'Work',
    icon: Briefcase,
    dot: 'bg-orange-500',
    ring: 'ring-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
  internship: {
    label: 'Internship',
    icon: Rocket,
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  project: {
    label: 'Project',
    icon: Code2,
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    dot: 'bg-blue-500',
    ring: 'ring-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
};

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 60%'],
  });

  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="py-24 bg-surface-muted">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-badge mb-4">Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Experience &amp; Education
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            My professional journey, internships, and academic background
          </p>
        </motion.div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Timeline base track */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-zinc-900/[0.08] dark:bg-white/[0.08] md:-translate-x-1/2" />

          {/* Animated fill that draws in as you scroll */}
          <motion.div
            style={{ scaleY: lineProgress }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px origin-top bg-linear-to-b from-orange-500 via-amber-400 to-blue-500 md:-translate-x-1/2"
          />

          <div className="space-y-10 md:space-y-12">
            {experiences.map((experience, index) => {
              const meta = typeMeta[experience.type];
              const Icon = meta.icon;
              const isRight = index % 2 === 1;

              return (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, x: isRight ? 40 : -40, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="relative"
                >
                  {/* Timeline node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 300, damping: 18 }}
                    viewport={{ once: true, margin: '-80px' }}
                    className={`absolute left-6 md:left-1/2 top-6 flex items-center justify-center w-9 h-9 rounded-full ${meta.dot} ring-4 ${meta.ring} -translate-x-1/2 z-10 shadow-lg`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.div>

                  <div
                    className={`flex flex-col md:flex-row ${isRight ? 'md:justify-end' : 'md:justify-start'}`}
                  >
                    <div
                      className={`w-full pl-20 md:pl-0 ${
                        isRight ? 'md:w-5/12 md:pl-8' : 'md:w-5/12 md:pr-8'
                      }`}
                    >
                      <div className="project-card glow-border surface-card p-6 relative overflow-hidden hover:-translate-y-1">
                        <div className="spotlight" />

                        <div className="relative z-[1]">
                          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${meta.badge}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {meta.label}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              <Calendar className="w-3.5 h-3.5" />
                              {experience.duration}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1 tracking-tight">
                            {experience.title}
                          </h3>
                          <h4 className="text-sm font-medium text-orange-600 dark:text-amber-400 mb-3">
                            {experience.company}
                          </h4>

                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                            <MapPin className="w-3.5 h-3.5" />
                            {experience.location}
                          </div>

                          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                            {experience.description}
                          </p>

                          {experience.technologies && (
                            <div className="mb-4">
                              <h5 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
                                Technologies
                              </h5>
                              <div className="flex flex-wrap gap-1.5">
                                {experience.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 bg-zinc-900/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 rounded-md text-xs font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {experience.achievements && (
                            <div>
                              <h5 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2 flex items-center">
                                <Award className="w-3.5 h-3.5 mr-1.5" />
                                Key Achievements
                              </h5>
                              <ul className="text-sm text-zinc-600 dark:text-zinc-300 space-y-1.5">
                                {experience.achievements.map((achievement, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-orange-500 mr-2">•</span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
