'use client';

import { motion } from 'framer-motion';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { useMouseGlow } from '../hooks/useMouseGlow';

export default function Resume() {
  const resumePath = '/resume/Darshan_Giri_Goswami_CV.pdf';
  const handleMouseMove = useMouseGlow();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Darshan_Giri_Goswami_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-badge mb-4">Resume</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Resume
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Download or view my resume to learn more about my experience and qualifications
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Resume Actions */}
          <div
            onMouseMove={handleMouseMove}
            className="surface-card glow-border mouse-glow relative overflow-hidden p-8 mb-8"
          >
            <div className="glow-spot" />
            <div className="relative z-[1] flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start mb-3">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="p-2.5 rounded-xl bg-orange-500/10 mr-3"
                  >
                    <FileText className="w-6 h-6 text-orange-500 dark:text-amber-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Darshan Giri Goswami — CV
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Full Stack MERN Developer · React.js, Node.js, Express.js, MongoDB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gradient flex items-center justify-center px-6 py-3 text-white rounded-full font-semibold text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </motion.button>

                <motion.a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm border border-zinc-900/10 dark:border-white/15 text-zinc-800 dark:text-zinc-100 bg-white/60 dark:bg-white/5 hover:border-orange-400/60 hover:text-orange-600 dark:hover:text-amber-300 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </motion.a>
              </div>
            </div>
          </div>

          {/* Resume Viewer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="surface-card overflow-hidden"
          >
            <div className="relative w-full h-screen">
              <iframe
                src={resumePath}
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}