import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

// First slide: brand + tagline + scroll cue. Uses the highest-priority hero
// from the first project as a muted background.
export default function IntroHero({ backgroundHero }) {
  const textRef = useScrollReveal({ threshold: 0.1 });
  const innerRef = useRef(null);

  useEffect(() => {
    // Trigger reveal on initial load (no scroll needed for the first slide)
    if (textRef.current) textRef.current.classList.add('is-visible');
  }, [textRef]);

  return (
    <section className="slide" data-slide="intro">
      <div className="slide-media">
        {backgroundHero && (
          <picture>
            <source srcSet={`${backgroundHero[640]} 640w, ${backgroundHero[1280]} 1280w, ${backgroundHero[1920]} 1920w`} sizes="100vw" />
            <img src={backgroundHero[1280]} alt="" fetchpriority="high" />
          </picture>
        )}
        <div className="slide-overlay" style={{ background: 'linear-gradient(180deg, rgba(15,25,39,0.5) 0%, rgba(15,25,39,0.85) 100%)' }} />
      </div>
      <div className="relative h-full w-full flex items-center justify-center px-6">
        <div ref={textRef} className="reveal reveal-up text-center max-w-3xl" dir="rtl">
          <div className="eyebrow mb-6 mx-auto">Excellent Group</div>
          <h1 className="text-5xl md:text-7xl font-semibold mb-5" style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
            הפורטפוליו<br/>
            <span style={{ color: 'var(--color-gold)' }}>שלנו</span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-xl mx-auto mb-10">
            חזון אדריכלי. ביצוע מוקפד. תוצאות שמדברות בעד עצמן.<br/>
            גלילה דרך הפרויקטים שהגדירו מחדש שכונות באתונה.
          </p>
          <div className="flex flex-col items-center gap-3 mt-14">
            <span className="text-xs tracking-[.25em] text-white/50">גלול</span>
            <span className="scroll-cue" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div ref={innerRef} />
    </section>
  );
}
