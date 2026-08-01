'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/Darshangoswami07' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/darshan-goswami-b09137222/' },
  { name: 'Email', icon: Mail, url: 'mailto:darshangirigoswami07@gmail.com' },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-zinc-950 text-white py-16 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-xl h-72 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-3">
              Darshan<span className="text-orange-500">.</span>
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Passionate Full Stack MERN Developer building scalable, user-focused web applications.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="#home" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Connect</h4>
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    title={link.name}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-orange-500/40 hover:bg-orange-500/10 transition-colors duration-200"
                  >
                    <link.icon size={18} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Darshan Giri Goswami. All rights reserved.
          </p>
          <VisitorCounter />
        </div>
      </div>
    </motion.footer>
  );
}
