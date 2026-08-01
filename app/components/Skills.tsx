'use client';

import { motion } from 'framer-motion';
import { Code2, Server, Database, Cloud, Wrench, Rocket, type LucideIcon } from 'lucide-react';
import { useMouseGlow } from '../hooks/useMouseGlow';

interface SkillItem {
  name: string;
  level: number;
}

interface SkillGroup {
  category: string;
  icon: LucideIcon;
  gradient: string;
  items: SkillItem[];
}

const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    icon: Code2,
    gradient: 'from-orange-500 to-orange-600',
    items: [
      { name: 'React.js', level: 90 },
      { name: 'JavaScript (ES6+)', level: 90 },
      { name: 'TypeScript', level: 75 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'Angular', level: 65 },
      { name: 'HTML5 & CSS3', level: 90 },
    ],
  },
  {
    category: 'Backend',
    icon: Server,
    gradient: 'from-amber-500 to-orange-600',
    items: [
      { name: 'Node.js', level: 80 },
      { name: 'Express.js', level: 80 },
      { name: 'REST APIs', level: 85 },
      { name: 'JWT Authentication', level: 75 },
      { name: 'Socket.io', level: 60 },
    ],
  },
  {
    category: 'Database',
    icon: Database,
    gradient: 'from-amber-400 to-amber-600',
    items: [
      { name: 'MongoDB', level: 80 },
      { name: 'Mongoose ODM', level: 75 },
      { name: 'Data Modeling', level: 70 },
    ],
  },
  {
    category: 'Cloud',
    icon: Cloud,
    gradient: 'from-sky-500 to-blue-600',
    items: [
      { name: 'AWS EC2', level: 55 },
      { name: 'AWS S3', level: 55 },
      { name: 'CI/CD Basics', level: 50 },
      { name: 'Vercel Deployment', level: 70 },
    ],
  },
  {
    category: 'Tools',
    icon: Wrench,
    gradient: 'from-orange-400 to-amber-500',
    items: [
      { name: 'Git & GitHub', level: 85 },
      { name: 'Redux Toolkit', level: 75 },
      { name: 'Cloudinary', level: 65 },
      { name: 'Postman', level: 75 },
    ],
  },
  {
    category: 'Learning',
    icon: Rocket,
    gradient: 'from-violet-500 to-fuchsia-600',
    items: [
      { name: 'System Design', level: 50 },
      { name: 'Performance Optimization', level: 55 },
      { name: 'Scalable Architecture', level: 55 },
      { name: 'Clean Code Practices', level: 80 },
    ],
  },
];

export default function Skills() {
  const handleMouseMove = useMouseGlow();

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-badge mb-4">Toolbox</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Technologies and tools I use to build clean, responsive, and scalable web applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              onMouseMove={handleMouseMove}
              className="surface-card glow-border mouse-glow relative overflow-hidden p-6"
            >
              <div className="glow-spot" />
              <div className="relative z-[1]">
                <div className="flex items-center gap-3.5 mb-6">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className={`p-2.5 rounded-xl shadow-lg bg-linear-to-br ${group.gradient}`}
                  >
                    <group.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    {group.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {group.items.map((skill, i) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {skill.name}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tabular-nums">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-900/5 dark:bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-linear-to-r ${group.gradient}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
