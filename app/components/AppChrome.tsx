'use client';

import Preloader from './Preloader';
import CursorSpotlight from './CursorSpotlight';
import BackToTop from './BackToTop';
import CommandPalette from './CommandPalette';
import PageTransition from './PageTransition';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <CursorSpotlight />
      <CommandPalette />
      <BackToTop />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
