import { useCallback, useRef, useState } from 'react';
import { PROJECTS } from './data/projects.js';
import { useActiveSlide } from './hooks/useActiveSlide.js';
import IntroHero from './components/IntroHero.jsx';
import ProjectSlide from './components/ProjectSlide.jsx';
import ClosingSlide from './components/ClosingSlide.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Lightbox from './components/Lightbox.jsx';

export default function App() {
  const reelRef = useRef(null);
  const activeIdx = useActiveSlide(reelRef);
  const totalSlides = PROJECTS.length + 2; // intro + projects + closing

  const [lightbox, setLightbox] = useState(null); // { project, initialPhase }

  const jumpTo = useCallback((idx) => {
    const slides = reelRef.current?.querySelectorAll('.slide');
    if (slides && slides[idx]) slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openGallery = useCallback((project, initialPhase = null) => {
    setLightbox({ project, initialPhase });
  }, []);
  const closeGallery = useCallback(() => setLightbox(null), []);

  return (
    <>
      <ScrollProgress total={totalSlides} activeIdx={activeIdx} onJump={jumpTo} />

      <main className="reel" ref={reelRef}>
        <IntroHero backgroundHero={PROJECTS[0]?.hero} />
        {PROJECTS.map((p, i) => (
          <ProjectSlide
            key={p.slug}
            project={p}
            index={i}
            total={PROJECTS.length}
            onOpenGallery={openGallery}
            eager={i === 0}
          />
        ))}
        <ClosingSlide onBackToTop={() => jumpTo(0)} />
      </main>

      {lightbox && (
        <Lightbox
          project={lightbox.project}
          initialPhase={lightbox.initialPhase}
          onClose={closeGallery}
        />
      )}
    </>
  );
}
