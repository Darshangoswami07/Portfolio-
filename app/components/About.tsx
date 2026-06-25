'use client';

import { motion } from 'framer-motion';
import { User, Award, Target, Coffee } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { icon: Award, label: 'Projects Built', value: '10+' },
  { icon: Coffee, label: 'Internship Experience', value: '6+ months' },
  { icon: Target, label: 'Years Learning', value: '3+' },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-amber-50 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Full Stack MERN Developer with hands-on experience in building scalable web applications using MongoDB, Express.js, React.js, and Node.js. Skilled in developing REST APIs, authentication systems, and responsive user interfaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="aspect-square bg-orange-500 rounded-2xl overflow-hidden">
                <Image
                  src="/images/darshan-professional-image.png"
                  alt="Darshan Giri Goswami"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                My Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I am currently pursuing a Master of Computer Applications (MCA) from Amity Online while building practical full-stack projects. My academic foundation from BCA and internship experience helped me strengthen frontend engineering, scalable UI development, and API integration.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                My Approach
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I focus on writing clean, maintainable code and building user-first applications.
                I enjoy solving complex problems, creating responsive interfaces, and improving
                performance through reusable components and scalable architecture. I continuously
                learn modern tools and best practices to deliver reliable, production-ready solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-gray-100 dark:bg-stone-800 rounded-lg p-4">
                    <stat.icon className="w-8 h-8 text-orange-500 dark:text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
