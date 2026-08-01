'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  Download,
  Rocket,
  Mail,
  MessageCircle,
  Code2,
  Server,
  Database,
  Boxes,
  FileCode2,
  Palette,
  Braces,
  Terminal,
  Cpu,
  ArrowRight,
} from 'lucide-react';

const AiAssistant = dynamic(
  () => import('@/app/components/ai-section/AiAssistant').then((mod) => mod.AiAssistant),
  { ssr: false }
);

const roles = ['Full Stack MERN Developer', 'React.js • Node.js • Express.js', 'MongoDB • REST APIs • Tailwind CSS'];

const COLORS = ['#fbbf24', '#fb923c', '#f97316', '#818cf8'];

const resumePath = '/resume/Darshan_Giri_Goswami_CV.pdf';

const nameWords = ['Darshan', 'Giri', 'Goswami'];

const floatingIcons = [
  { Icon: Code2, className: 'top-[16%] left-[6%]', duration: 7, delay: 0 },
  { Icon: Database, className: 'top-[24%] right-[9%]', duration: 8, delay: 1.2 },
  { Icon: Braces, className: 'bottom-[30%] left-[4%]', duration: 6.5, delay: 0.6 },
  { Icon: Terminal, className: 'bottom-[20%] right-[7%]', duration: 7.5, delay: 1.8 },
  { Icon: Cpu, className: 'top-[50%] left-[2%]', duration: 9, delay: 2.4 },
  { Icon: Boxes, className: 'top-[54%] right-[3%]', duration: 8.5, delay: 0.3 },
];

const techBadges = [
  { label: 'React', Icon: Code2, className: '-top-5 -left-8 sm:-left-12', duration: 5, delay: 0 },
  { label: 'Node.js', Icon: Server, className: 'top-10 -right-9 sm:-right-16', duration: 6, delay: 0.4 },
  { label: 'MongoDB', Icon: Database, className: 'bottom-20 -left-10 sm:-left-16', duration: 5.5, delay: 0.8 },
  { label: 'TypeScript', Icon: FileCode2, className: 'bottom-6 -right-6 sm:-right-12', duration: 6.5, delay: 1.2 },
  { label: 'Tailwind', Icon: Palette, className: '-bottom-5 left-10', duration: 5.2, delay: 1.6 },
];

function makeParticles() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    duration: Math.random() * 14 + 10,
    delay: Math.random() * -20,
    driftX: (Math.random() - 0.5) * 30,
    driftY: (Math.random() - 0.5) * 30,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

const nameContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const nameWordVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/** Small mouse-follow "magnetic" wrapper — nudges its child toward the cursor within a small radius. */
function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isAiSectionOpen, setIsAiSectionOpen] = useState(false);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [particles, setParticles] = useState<ReturnType<typeof makeParticles>>([]);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(640px circle at ${mouseX}px ${mouseY}px, rgba(249, 115, 22, 0.14), transparent 75%)`;

  // Card tilt, driven by pointer position relative to the card itself
  const cardX = useMotionValue(0.5);
  const cardY = useMotionValue(0.5);
  const cardRotateX = useSpring(useTransform(cardY, [0, 1], [7, -7]), { stiffness: 250, damping: 22 });
  const cardRotateY = useSpring(useTransform(cardX, [0, 1], [-7, 7]), { stiffness: 250, damping: 22 });

  useEffect(() => {
    setParticles(makeParticles());
  }, []);

  useEffect(() => {
    const role = roles[roleIndex];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && displayed === role) {
      t = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed === '') {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    } else {
      t = setTimeout(() => {
        setDisplayed(deleting
          ? role.slice(0, displayed.length - 1)
          : role.slice(0, displayed.length + 1)
        );
      }, deleting ? 40 : 70);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, roleIndex]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set((e.clientX - rect.left) / rect.width);
    cardY.set((e.clientY - rect.top) / rect.height);
  };

  const resetCard = () => {
    cardX.set(0.5);
    cardY.set(0.5);
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8 pt-32 pb-24 overflow-hidden"
    >
      {/* Layered premium background: mesh gradient + fine grid + noise + mouse spotlight + particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="hero-mesh absolute inset-0" />
        <div className="hero-line-grid absolute inset-0" />
        <div className="hero-noise absolute inset-0" />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.color}`,
              opacity: 0.6,
            }}
            animate={{
              x: [0, p.driftX, 0, -p.driftX, 0],
              y: [0, p.driftY, -p.driftY, p.driftY * 0.5, 0],
              opacity: [0.6, 0.9, 0.4, 0.8, 0.6],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Floating decorative tech icons */}
        {floatingIcons.map(({ Icon, className, duration, delay }, i) => (
          <motion.div
            key={i}
            className={`hidden sm:flex absolute ${className} w-11 h-11 items-center justify-center rounded-2xl glass-panel shadow-lg`}
            animate={{ y: [0, -16, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon className="w-5 h-5 text-orange-500/70 dark:text-amber-400/70" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-12 items-center">
        {/* Left column: introduction */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pill-badge mx-auto lg:mx-0 mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Available for new opportunities
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm font-semibold tracking-[0.2em] uppercase text-orange-600 dark:text-amber-400 mb-4"
          >
            Hi, I&apos;m
          </motion.p>

          <motion.h1
            variants={nameContainerVariants}
            initial="hidden"
            animate="visible"
            className="hero-headline text-6xl sm:text-7xl lg:text-[5.5rem] font-bold text-zinc-900 dark:text-white mb-6 flex flex-wrap justify-center lg:justify-start gap-x-5"
          >
            {nameWords.map((word, i) => (
              <motion.span
                key={word}
                variants={nameWordVariants}
                className={i === nameWords.length - 1 ? 'text-shimmer' : ''}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="inline-flex items-center gap-2 pill-badge font-mono text-orange-600 dark:text-amber-400 mb-7"
          >
            <span className="text-zinc-400 dark:text-zinc-500">{'>'}</span>
            <span>{displayed}</span>
            <span className="cursor-blink">|</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-11 max-w-xl mx-auto lg:mx-0 leading-relaxed tracking-[-0.01em]"
          >
            Passionate Full Stack MERN Developer skilled in React.js, Node.js, Express.js, MongoDB, and
            modern web technologies. I build clean, scalable, user-first products from idea to deployment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
            ref={buttonsRef}
          >
            <Magnetic>
              <a
                href={resumePath}
                download="Darshan_Giri_Goswami_CV.pdf"
                className="btn-gradient group inline-flex items-center gap-2 px-7 py-3.5 text-white rounded-full font-semibold text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection('#projects')}
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-zinc-800 dark:text-zinc-100 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md border border-zinc-900/10 dark:border-white/10 overflow-hidden transition-colors duration-300 hover:border-transparent"
              >
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  style={{ background: 'conic-gradient(from 0deg, #f97316, #fbbf24, #6366f1, #f97316)' }}
                  aria-hidden="true"
                />
                <span className="absolute inset-[1.5px] rounded-full bg-white dark:bg-zinc-950 -z-10 group-hover:bg-white/90 dark:group-hover:bg-zinc-950/90 transition-colors" aria-hidden="true" />
                <Rocket className="w-4 h-4" />
                View Projects
                <ArrowRight className="w-3.5 h-3.5 -ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection('#contact')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base border border-zinc-900/10 dark:border-white/15 text-zinc-800 dark:text-zinc-100 bg-white/60 dark:bg-white/5 backdrop-blur hover:border-orange-400/60 hover:text-orange-600 dark:hover:text-amber-300 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => setIsAiSectionOpen(!isAiSectionOpen)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold text-sm text-white bg-linear-to-r from-indigo-600 to-violet-600 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.55)] hover:shadow-[0_12px_32px_-8px_rgba(99,102,241,0.65)] transition-shadow duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with AI
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Right column: premium developer card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-72 sm:w-80 lg:w-88"
          style={{ perspective: 1400 }}
        >
          {/* Ambient glow behind the card */}
          <div
            className="absolute -inset-8 rounded-[2.5rem] bg-linear-to-br from-orange-500/25 via-amber-400/10 to-indigo-500/20 blur-3xl"
            aria-hidden="true"
          />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={resetCard}
            style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
            className="hero-card-border relative rounded-[1.75rem] glass-panel shadow-2xl p-3"
          >
            {/* Portrait */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
              <Image
                src="/images/darshan-2.jpg"
                alt="Darshan Giri Goswami — Full Stack MERN Developer"
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 20rem, 18rem"
                className="object-cover"
                priority
              />
              {/* Bottom caption scrim */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Darshan Giri Goswami</p>
                  <p className="text-white/70 text-xs">Full Stack MERN Developer</p>
                </div>
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 ring-2 ring-black/40" />
                </span>
              </div>
            </div>

            {/* "Open to hire" badge overlapping the top-right corner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="absolute -top-3 -right-3 pill-badge glass-panel shadow-lg whitespace-nowrap"
              style={{ transform: 'translateZ(40px)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Open to hire
            </motion.div>
          </motion.div>

          {/* Floating tech badges orbiting the card */}
          {techBadges.map(({ label, Icon, className, duration, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + delay * 0.3 }}
              className={`absolute ${className} hidden sm:block`}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full glass-panel shadow-lg text-xs font-semibold text-zinc-800 dark:text-zinc-100"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/15">
                  <Icon className="w-3.5 h-3.5 text-orange-500 dark:text-amber-400" />
                </span>
                {label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        onClick={() => scrollToSection('#about')}
        aria-label="Scroll to about"
        title="Scroll to About section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors"
      >
        <span className="text-xs font-medium tracking-wide uppercase">Scroll</span>
        <span className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
          <motion.span
            className="w-1 h-2 rounded-full bg-current"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>

      <AiAssistant isOpen={isAiSectionOpen} anchorRef={buttonsRef} onClose={() => setIsAiSectionOpen(false)} />
    </section>
  );
}
