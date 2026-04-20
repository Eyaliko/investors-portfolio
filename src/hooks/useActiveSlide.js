import { useEffect, useState } from 'react';

// Observes all `.slide` elements inside the given scrollRoot and returns the
// index of the slide closest to the viewport center. Applies CSS classes
// (is-active / is-near) for the cross-fade.
export function useActiveSlide(scrollRootRef) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.slide'));
    if (!slides.length) return;

    // Mark first slide active on mount so the hero is visible pre-scroll
    slides[0].classList.add('is-active');

    const obs = new IntersectionObserver(
      (entries) => {
        // Find the slide with highest intersection ratio
        let maxRatio = 0; let maxEl = null;
        entries.forEach(e => {
          if (e.intersectionRatio > maxRatio) { maxRatio = e.intersectionRatio; maxEl = e.target; }
        });
        if (!maxEl) return;
        slides.forEach((s, i) => {
          s.classList.remove('is-active', 'is-near');
          if (s === maxEl) {
            s.classList.add('is-active');
            setActiveIdx(i);
          } else {
            const dist = Math.abs(slides.indexOf(s) - slides.indexOf(maxEl));
            if (dist === 1) s.classList.add('is-near');
          }
        });
      },
      {
        root,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    slides.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [scrollRootRef]);

  return activeIdx;
}
