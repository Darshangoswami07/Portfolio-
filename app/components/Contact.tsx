'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Copy,
  Check,
  Github,
  Linkedin,
  CheckCircle2,
} from 'lucide-react';
import { useToast, Toaster } from './ui/Toast';

const EMAIL = 'darshangirigoswami07@gmail.com';
const PHONE_DISPLAY = '+91 8865928963';
const PHONE_TEL = '+918865928963';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    copyable: true,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
    copyable: false,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bageshwar, Uttarakhand, India',
    href: '#',
    copyable: false,
  },
];

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/Darshangoswami07' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/darshan-goswami-b09137222/' },
  { name: 'Email', icon: Mail, url: `mailto:${EMAIL}` },
  { name: 'Phone', icon: Phone, url: `tel:${PHONE_TEL}` },
];

interface FormData {
  name: string;
  email: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Please enter your name';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Please enter your email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!data.message.trim()) {
    errors.message = 'Please enter a message';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters';
  }

  return errors;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [copied, setCopied] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    if (touched[name as keyof FormData]) {
      setErrors(validate(next));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(validationErrors).length > 0) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    setStatus('submitting');

    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    window.setTimeout(() => {
      window.location.href = mailtoLink;
      setStatus('success');
      showToast('Your email client is opening — thanks for reaching out!', 'success');
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
      window.setTimeout(() => setStatus('idle'), 2200);
    }, 700);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      showToast('Email address copied to clipboard.', 'success');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy — please copy it manually.', 'error');
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-surface-muted overflow-hidden">
      <div className="aurora-bg absolute inset-0 pointer-events-none" />
      <div className="bg-grid absolute inset-0 opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-badge mb-4">Contact</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            I&apos;m always open to discussing new opportunities and interesting projects
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3 tracking-tight">
              Let&apos;s Connect
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Whether you have a project in mind, want to collaborate, or just want to say hello,
              I would love to hear from you. Feel free to reach out!
            </p>

            <div className="space-y-4 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                  className="glass-panel glow-border relative flex items-center gap-4 p-4 rounded-2xl"
                >
                  <div className="p-3 bg-orange-500/10 rounded-xl shrink-0">
                    <info.icon className="w-5 h-5 text-orange-500 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{info.label}</p>
                    <a
                      href={info.href}
                      className="text-sm font-medium text-zinc-900 dark:text-white hover:text-orange-500 dark:hover:text-amber-400 transition-colors break-words"
                    >
                      {info.value}
                    </a>
                  </div>
                  {info.copyable && (
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      title="Copy email address"
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-900/[0.08] dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-amber-400 hover:border-orange-500/40 transition-colors"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Copy className="w-4 h-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-3">
                Find me online
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    title={link.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.07 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3, scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 flex items-center justify-center rounded-full glass-panel text-zinc-600 dark:text-zinc-300 hover:text-orange-500 dark:hover:text-amber-400 hover:border-orange-500/40 transition-colors shadow-lg"
                  >
                    <link.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            noValidate
            className="glass-panel glow-border relative rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`w-full px-4 py-3 rounded-xl bg-surface-muted text-zinc-900 dark:text-white outline-none transition-colors border focus:ring-2 ${
                  errors.name
                    ? 'border-red-500/60 focus:ring-red-500/30'
                    : 'border-zinc-900/10 dark:border-white/10 focus:ring-orange-500/40 focus:border-orange-500'
                }`}
                placeholder="Your Name"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    id="name-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500 mt-1.5"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-3 rounded-xl bg-surface-muted text-zinc-900 dark:text-white outline-none transition-colors border focus:ring-2 ${
                  errors.email
                    ? 'border-red-500/60 focus:ring-red-500/30'
                    : 'border-zinc-900/10 dark:border-white/10 focus:ring-orange-500/40 focus:border-orange-500'
                }`}
                placeholder="your.email@example.com"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    id="email-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500 mt-1.5"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`w-full px-4 py-3 rounded-xl bg-surface-muted text-zinc-900 dark:text-white outline-none transition-colors resize-none border focus:ring-2 ${
                  errors.message
                    ? 'border-red-500/60 focus:ring-red-500/30'
                    : 'border-zinc-900/10 dark:border-white/10 focus:ring-orange-500/40 focus:border-orange-500'
                }`}
                placeholder="Tell me about your project..."
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.p
                    id="message-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500 mt-1.5"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={status !== 'idle'}
              whileHover={status === 'idle' ? { scale: 1.015, y: -1 } : undefined}
              whileTap={status === 'idle' ? { scale: 0.98 } : undefined}
              className="btn-gradient w-full flex items-center justify-center px-6 py-3 text-white rounded-full font-semibold text-sm disabled:cursor-not-allowed overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === 'submitting' ? (
                  <motion.span
                    key="submitting"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </motion.span>
                ) : status === 'success' ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <CheckCircle2 size={16} className="mr-2" />
                    Sent!
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <Send size={16} className="mr-2" />
                    Send Message
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </div>
      </div>

      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </section>
  );
}
