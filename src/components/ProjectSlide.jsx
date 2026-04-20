import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { STATUS_LABELS } from '../data/projects.js';

export default function ProjectSlide({ project, onOpenGallery, eager = false }) {
  const revealRef = useScrollReveal({ threshold: 0.35 });
  const { name, location, units, sqm, status, description, goldenVisa, rented, mixedUse, hero, unitLabel } = project;
  const unitsLabel = unitLabel || (units === 1 ? 'Unit' : 'Units');

  return (
    <section className="slide" data-slide={project.slug}>
      <div className="slide-media">
        <picture>
          <source srcSet={`${hero[640]} 640w, ${hero[1280]} 1280w, ${hero[1920]} 1920w`} sizes="100vw" />
          <img
            src={hero[1280]}
            alt={`${name} — ${location}`}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
            decoding="async"
          />
        </picture>
        <div className="slide-overlay" />
      </div>

      <div className="relative h-full w-full flex items-end md:items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20">
          <div ref={revealRef} className="reveal reveal-up details-card">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`status-pill ${status}`}>{STATUS_LABELS[status] || status}</span>
              {rented && <span className="tag-pill rented">Fully Rented</span>}
              {mixedUse && <span className="tag-pill mixed-use">Mixed Use</span>}
              {goldenVisa && <span className="tag-pill golden-visa">Golden Visa</span>}
            </div>

            <h2 className="text-4xl md:text-6xl font-light mb-1 uppercase" style={{ lineHeight: 1.05, letterSpacing: '0.04em' }}>
              {name}
            </h2>
            <p className="text-white/65 text-sm md:text-base mb-6 tracking-widest uppercase font-light">
              {location}
            </p>

            <div className="flex gap-4 md:gap-5 mb-6">
              {units != null && (
                <div className="metric-circle">
                  <span className="num">{units}</span>
                  <span className="unit">{unitsLabel}</span>
                </div>
              )}
              {sqm != null && (
                <div className="metric-circle">
                  <span className="num">{sqm.toLocaleString()}</span>
                  <span className="unit">sqm</span>
                </div>
              )}
            </div>

            {description && (
              <p className="text-white/75 text-sm md:text-base leading-relaxed mb-7 max-w-lg font-light">
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button className="btn-gold" onClick={() => onOpenGallery(project)}>
                Full Gallery
                <span aria-hidden>→</span>
              </button>
              {project.galleries?.some(g => /before/i.test(g.title)) && (
                <button className="btn-ghost" onClick={() => onOpenGallery(project, 'before')}>
                  See Transformation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
