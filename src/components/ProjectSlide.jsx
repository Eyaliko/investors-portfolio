import { useScrollReveal } from '../hooks/useScrollReveal.js';

const STATUS_COLORS = {
  'הושלם':  'bg-[var(--color-gold)] text-[var(--color-navy-dark)]',
  'בבנייה': 'bg-white/20 text-white border border-white/40',
  'בתכנון': 'bg-white/10 text-white/80 border border-white/30',
  'למכירה': 'bg-[var(--color-gold)] text-[var(--color-navy-dark)]',
};

// Full-bleed "after" photo with floating details card.
export default function ProjectSlide({ project, index, total, onOpenGallery, eager = false }) {
  const revealRef = useScrollReveal({ threshold: 0.35 });
  const { name, location, units, year, status, description, hero } = project;

  const statusClass = STATUS_COLORS[status] || 'bg-white/15 text-white border border-white/30';

  return (
    <section className="slide" data-slide={project.slug}>
      <div className="slide-media">
        <picture>
          <source srcSet={`${hero[640]} 640w, ${hero[1280]} 1280w, ${hero[1920]} 1920w`} sizes="100vw" />
          <img
            src={hero[1280]}
            alt={`${name} — ${location}`}
            loading={eager ? 'eager' : 'lazy'}
            fetchpriority={eager ? 'high' : 'auto'}
            decoding="async"
          />
        </picture>
        <div className="slide-overlay" />
      </div>

      <div className="relative h-full w-full flex items-end md:items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-20">
          <div
            ref={revealRef}
            className="reveal reveal-up details-card md:mr-auto md:ml-0"
            dir="rtl"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="eyebrow">פרויקט {String(index + 1).padStart(2, '0')}</span>
              <span className={`text-[.65rem] px-2 py-1 rounded-sm font-semibold tracking-wider ${statusClass}`}>
                {status}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold mb-1" style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
              {name}
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-5">{location}</p>

            <div className="flex flex-wrap gap-5 mb-5 text-sm">
              {units && (
                <div>
                  <div className="display-num text-xl md:text-2xl" style={{ color: 'var(--color-gold)' }}>{units}</div>
                  <div className="text-xs text-white/60 tracking-wider">יחידות</div>
                </div>
              )}
              {year && (
                <div>
                  <div className="display-num text-xl md:text-2xl" style={{ color: 'var(--color-gold)' }}>{year}</div>
                  <div className="text-xs text-white/60 tracking-wider">שנה</div>
                </div>
              )}
            </div>

            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 max-w-md">
              {description}
            </p>

            <div className="flex flex-wrap gap-3">
              <button className="btn-gold" onClick={() => onOpenGallery(project)}>
                גלריה מלאה
                <span aria-hidden>←</span>
              </button>
              <button className="btn-ghost" onClick={() => onOpenGallery(project, 'before')}>
                ראה תהליך
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 text-white/50 text-xs tracking-[.3em] font-light select-none">
        <span className="display-num text-sm text-white/80">{String(index + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(total).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
