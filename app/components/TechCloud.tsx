'use client';

import { motion } from 'framer-motion';

const technologies = [
  { name: 'React.js', weight: 'lg' },
  { name: 'Node.js', weight: 'lg' },
  { name: 'TypeScript', weight: 'md' },
  { name: 'JavaScript', weight: 'lg' },
  { name: 'MongoDB', weight: 'md' },
  { name: 'Express.js', weight: 'md' },
  { name: 'Next.js', weight: 'lg' },
  { name: 'Tailwind CSS', weight: 'md' },
  { name: 'Redux Toolkit', weight: 'sm' },
  { name: 'REST APIs', weight: 'md' },
  { name: 'JWT Auth', weight: 'sm' },
  { name: 'Angular', weight: 'sm' },
  { name: 'Mongoose', weight: 'sm' },
  { name: 'AWS', weight: 'sm' },
  { name: 'Git & GitHub', weight: 'md' },
  { name: 'Socket.io', weight: 'sm' },
  { name: 'Vercel', weight: 'sm' },
  { name: 'Cloudinary', weight: 'sm' },
  { name: 'Postman', weight: 'sm' },
  { name: 'HTML5 & CSS3', weight: 'md' },
];

const weightClasses: Record<string, string> = {
  lg: 'text-xl sm:text-2xl font-bold',
  md: 'text-base sm:text-lg font-semibold',
  sm: 'text-sm font-medium',
};

export default function TechCloud() {
  return (
    <section className="py-20 bg-surface-muted">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="pill-badge mb-4">Stack</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Technologies I Work With
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
        >
          {technologies.map((tech) => (
            <motion.span
              key={tech.name}
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{ scale: 1.12, color: 'var(--accent)' }}
              transition={{ duration: 0.3 }}
              className={`cursor-default text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors ${weightClasses[tech.weight]}`}
            >
              {tech.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
