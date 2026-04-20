import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { COMPANY_STATS } from '../data/projects.js';

export default function IntroHero({ backgroundHero }) {
  const textRef = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    if (textRef.current) textRef.current.classList.add('is-visible');
  }, [textRef]);

  return (
    <section className="slide" data-slide="intro">
      <div className="slide-media">
        {backgroundHero && (
          <picture>
            <source srcSet={`${backgroundHero[640]} 640w, ${backgroundHero[1280]} 1280w, ${backgroundHero[1920]} 1920w`} sizes="100vw" />
            <img src={backgroundHero[1280]} alt="" fetchPriority="high" />
          </picture>
        )}
        <div className="slide-overlay" style={{ background: 'linear-gradient(180deg, rgba(15,25,39,0.6) 0%, rgba(15,25,39,0.9) 100%)' }} />
      </div>
      <div className="slide-content-layer flex items-center justify-center px-6 py-10">
        <div ref={textRef} className="reveal reveal-up text-center w-full max-w-6xl">
          <div className="eyebrow mb-7 mx-auto">Excellent Group</div>
          <h1 className="text-5xl md:text-7xl font-light mb-5" style={{ lineHeight: 1.05 }}>
            Selective<br/>
            <span style={{ color: 'var(--color-gold)', fontStyle: 'italic', fontWeight: 400 }}>Flagship Projects</span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-xl mx-auto mb-10 font-light">
            A curated showcase of landmark developments<br/>
            across Athens and Piraeus.
          </p>

          <div className="company-stats mb-10">
            {COMPANY_STATS.map((s) => (
              <div key={s.label} className="company-stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 mt-2">
            <span className="text-[.7rem] tracking-[.3em] text-white/50 uppercase">Scroll</span>
            <span className="scroll-cue" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
