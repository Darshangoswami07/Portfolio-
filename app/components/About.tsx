'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap, Code2, Zap, MapPin, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useMouseGlow } from '../hooks/useMouseGlow';

const quickFacts = [
  {
    icon: Briefcase,
    label: 'Experience',
    value: 'Frontend Internship + freelance/personal full-stack projects',
  },
  {
    icon: GraduationCap,
    label: 'Education',
    value: 'BCA — Amrapali Group of Institutes (2021–2024)',
  },
  {
    icon: BookOpen,
    label: 'Currently Pursuing',
    value: 'MCA — Amity Online (2025–Present)',
  },
  {
    icon: Code2,
    label: 'Internship',
    value: 'Frontend Developer Intern @ CADL (Jul 2024–Jan 2025)',
  },
  {
    icon: Zap,
    label: 'Availability',
    value: 'Open to full-time roles & freelance projects',
    accent: true,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bageshwar, Uttarakhand, India',
  },
];

export default function About() {
  const handleMouseMove = useMouseGlow();
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ['start end', 'end start'],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-badge mb-4">About</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Building things with care
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Full Stack MERN Developer with hands-on experience in building scalable web applications using MongoDB, Express.js, React.js, and Node.js. Skilled in developing REST APIs, authentication systems, and responsive user interfaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start mb-14">
          {/* Portrait */}
          <motion.div
            ref={portraitRef}
            initial={{ opacity: 0, x: -50, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ y: portraitY }}
            className="lg:col-span-2"
          >
            <div className="relative group">
              <div className="absolute -inset-3 rounded-[1.75rem] bg-linear-to-br from-orange-500/20 via-amber-400/10 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-900/10 dark:border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/darshan-1.jpg"
                  alt="Darshan Giri Goswami"
                  fill
                  sizes="(min-width: 1024px) 32rem, (min-width: 640px) 60vw, 90vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                My Journey
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                I am currently pursuing a Master of Computer Applications (MCA) from Amity Online while building practical full-stack projects. My academic foundation from BCA and internship experience helped me strengthen frontend engineering, scalable UI development, and API integration.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                My Approach
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                I focus on writing clean, maintainable code and building user-first applications.
                I enjoy solving complex problems, creating responsive interfaces, and improving
                performance through reusable components and scalable architecture. I continuously
                learn modern tools and best practices to deliver reliable, production-ready solutions.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Quick facts / professional summary panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {quickFacts.map((fact, index) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              onMouseMove={handleMouseMove}
              className="surface-card glow-border mouse-glow relative overflow-hidden p-5 flex items-start gap-4"
            >
              <div className="glow-spot" />
              <div
                className={`relative z-[1] shrink-0 p-2.5 rounded-xl ${
                  fact.accent
                    ? 'bg-green-500/10'
                    : 'bg-orange-500/10'
                }`}
              >
                <fact.icon
                  className={`w-5 h-5 ${
                    fact.accent
                      ? 'text-green-500'
                      : 'text-orange-500 dark:text-amber-400'
                  }`}
                />
              </div>
              <div className="relative z-[1] min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {fact.label}
                  </p>
                  {fact.accent && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                  {fact.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
