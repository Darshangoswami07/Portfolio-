'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What kind of work are you available for?',
    answer:
      'I\'m open to full-time roles, freelance projects, and startup collaborations — primarily full-stack MERN work, but happy to discuss frontend-only or backend-only engagements too.',
  },
  {
    question: 'What is your tech stack?',
    answer:
      'React.js, Next.js, TypeScript, Node.js, Express.js, and MongoDB form my core stack, alongside Tailwind CSS, Redux Toolkit, and REST API design. I also have working experience with Angular and AWS basics.',
  },
  {
    question: 'How quickly do you respond to inquiries?',
    answer:
      'I typically respond within 24 hours. For faster scheduling, use the "Book a Meeting" section above to pick a time directly.',
  },
  {
    question: 'Do you take on freelance or contract projects?',
    answer:
      'Yes — freelance and contract work are welcome. Share your project scope through the contact form and I\'ll get back with availability and estimated timelines.',
  },
  {
    question: 'Can I see your resume or code samples?',
    answer:
      'Absolutely. You can download my resume from the Resume section above, and explore real, live projects with source code in the Projects section.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-badge mb-4">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Quick answers before you reach out
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="surface-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3 text-sm sm:text-base font-medium text-zinc-900 dark:text-white">
                    <HelpCircle className="w-4 h-4 text-orange-500 dark:text-amber-400 shrink-0" />
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-zinc-400"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 pl-12 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
