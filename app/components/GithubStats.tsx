'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Users, BookMarked, GitFork, Star, ExternalLink } from 'lucide-react';
import { useMouseGlow } from '../hooks/useMouseGlow';

const GITHUB_USERNAME = 'Darshangoswami07';

interface GithubUser {
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GithubRepo {
  stargazers_count: number;
  forks_count: number;
}

const statMeta = [
  { key: 'public_repos', label: 'Public Repos', icon: BookMarked },
  { key: 'followers', label: 'Followers', icon: Users },
  { key: 'stars', label: 'Total Stars', icon: Star },
  { key: 'forks', label: 'Total Forks', icon: GitFork },
] as const;

export default function GithubStats() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [totals, setTotals] = useState({ stars: 0, forks: 0 });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [imgError, setImgError] = useState(false);
  const handleMouseMove = useMouseGlow();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed');

        const userData: GithubUser = await userRes.json();
        const repos: GithubRepo[] = await reposRes.json();
        if (cancelled) return;

        setUser(userData);
        setTotals({
          stars: repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
          forks: repos.reduce((sum, r) => sum + (r.forks_count || 0), 0),
        });
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const values: Record<string, number> = {
    public_repos: user?.public_repos ?? 0,
    followers: user?.followers ?? 0,
    stars: totals.stars,
    forks: totals.forks,
  };

  return (
    <section id="github" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-badge mb-4">Open Source</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            GitHub Activity
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A live look at my public repositories and contribution history
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statMeta.map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                onMouseMove={handleMouseMove}
                className="surface-card glow-border mouse-glow relative overflow-hidden p-5 text-center"
              >
                <div className="glow-spot" />
                <div className="relative z-[1]">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-orange-500 dark:text-amber-400" />
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
                    {status === 'loading' ? (
                      <span className="inline-block w-10 h-6 rounded bg-zinc-900/10 dark:bg-white/10 animate-pulse" />
                    ) : (
                      values[stat.key].toLocaleString()
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="surface-card p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Contribution Graph
              </h3>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-amber-400 hover:underline"
              >
                <Github size={14} />
                View Profile
                <ExternalLink size={12} />
              </a>
            </div>

            {!imgError ? (
              <div className="overflow-x-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://ghchart.rshah.org/f97316/${GITHUB_USERNAME}`}
                  alt={`${GITHUB_USERNAME}'s GitHub contribution graph`}
                  loading="lazy"
                  className="min-w-[700px] w-full dark:invert dark:hue-rotate-180"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
                Contribution graph unavailable right now — view it directly on{' '}
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-amber-400 hover:underline"
                >
                  GitHub
                </a>
                .
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
