'use client';

import { motion } from 'framer-motion';
import { Code, Database, GitBranch, CircuitBoard, MicVocal, Brain } from 'lucide-react';

const skills = [
  {
    category: 'Frontend',
    icon: Code,
    color: 'bg-orange-500',
    technologies: ['React.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'SCSS', 'Bootstrap']
  },
  {
    category: 'Backend',
    icon: Database,
    color: 'bg-amber-600',
    technologies: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'Role-Based Access Control', 'Socket.io']
  },
  {
    category: 'Database',
    icon: CircuitBoard,
    color: 'bg-amber-500',
    technologies: ['MongoDB']
  },
  {
    category: 'Tools & Technologies',
    icon: GitBranch,
    color: 'bg-orange-400',
    technologies: ['Git', 'GitHub', 'Redux Toolkit', 'Cloudinary', 'Responsive Design']
  },
  {
    category: 'Currently Learning',
    icon: MicVocal,
    color: 'bg-amber-500',
    technologies: ['AWS Basics', 'CI/CD Practices', 'Performance Optimization', 'Scalable System Design']
  },
  {
    category: 'Core Concepts',
    icon: Brain,
    color: 'bg-orange-600',
    technologies: ['Clean Code', 'Problem Solving', 'Component Reusability', 'API Integration', 'Debugging']
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-amber-50 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Technologies and tools I use to build clean, responsive, and scalable web applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${skill.color}`}>
                  <skill.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
                  {skill.category}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skill.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 dark:bg-stone-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
