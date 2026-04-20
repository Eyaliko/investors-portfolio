import { useCallback, useRef, useState } from 'react';
import { PROJECTS } from './data/projects.js';
import { useActiveSlide } from './hooks/useActiveSlide.js';
import IntroHero from './components/IntroHero.jsx';
import ProjectSlide from './components/ProjectSlide.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Lightbox from './components/Lightbox.jsx';

export default function App() {
  const reelRef = useRef(null);
  const activeIdx = useActiveSlide(reelRef);
  const totalSlides = PROJECTS.length + 1; // intro + projects

  const [lightbox, setLightbox] = useState(null);

  const jumpTo = useCallback((idx) => {
    const slides = reelRef.current?.querySelectorAll('.slide');
    if (slides && slides[idx]) slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openGallery = useCallback((project, initialPhaseHint = null) => {
    setLightbox({ project, initialPhaseHint });
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
            onOpenGallery={openGallery}
            eager={i === 0}
          />
        ))}
      </main>

      {lightbox && (
        <Lightbox
          project={lightbox.project}
          initialPhaseHint={lightbox.initialPhaseHint}
          onClose={closeGallery}
        />
      )}
    </>
  );
}
