import { useCallback, useEffect, useMemo, useState } from 'react';

const PHASE_LABELS = {
  before:     'לפני',
  during:     'במהלך העבודות',
  after:      'אחרי',
  renderings: 'הדמיות',
  drone:      'צילומי רחפן',
};

const PHASE_ORDER = ['before', 'during', 'after', 'renderings', 'drone'];

export default function Lightbox({ project, initialPhase = null, onClose }) {
  const availablePhases = useMemo(
    () => PHASE_ORDER.filter(p => project?.gallery?.[p]?.length),
    [project]
  );

  const [activePhase, setActivePhase] = useState(() => {
    if (initialPhase && availablePhases.includes(initialPhase)) return initialPhase;
    return availablePhases[0] ?? null;
  });
  const [zoomedIdx, setZoomedIdx] = useState(null);

  const phaseImages = activePhase ? (project.gallery[activePhase] || []) : [];

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') {
      if (zoomedIdx !== null) setZoomedIdx(null);
      else onClose();
    } else if (zoomedIdx !== null) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setZoomedIdx(i => (i + 1) % phaseImages.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setZoomedIdx(i => (i - 1 + phaseImages.length) % phaseImages.length);
      }
    }
  }, [onClose, zoomedIdx, phaseImages.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!project) return null;

  return (
    <div className="lightbox-backdrop" role="dialog" aria-modal="true" aria-label={`גלריה — ${project.name}`} dir="rtl">
      {/* Header */}
      <header className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/10">
        <div>
          <div className="eyebrow mb-1">{project.location}</div>
          <h3 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
            {project.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-3xl leading-none px-3"
          aria-label="סגור"
        >×</button>
      </header>

      {/* Phase tabs */}
      <div className="flex flex-wrap gap-2 px-5 md:px-8 py-4 border-b border-white/10">
        {availablePhases.map(p => (
          <button
            key={p}
            onClick={() => { setActivePhase(p); setZoomedIdx(null); }}
            className={`lightbox-tab ${p === activePhase ? 'is-active' : ''}`}
          >
            {PHASE_LABELS[p]}
            <span className="mr-2 text-white/50 text-xs">({project.gallery[p].length})</span>
          </button>
        ))}
      </div>

      {/* Thumbnail grid */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {phaseImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setZoomedIdx(i)}
              className="group relative aspect-[4/3] overflow-hidden bg-white/5 rounded-sm"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[var(--color-gold)]/50 transition-all" />
            </button>
          ))}
        </div>
        {phaseImages.length === 0 && (
          <div className="text-white/50 text-center py-12">אין תמונות בקטגוריה זו</div>
        )}
      </div>

      {/* Zoom overlay */}
      {zoomedIdx !== null && phaseImages[zoomedIdx] && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center"
          onClick={() => setZoomedIdx(null)}
        >
          <img
            src={phaseImages[zoomedIdx]}
            alt=""
            className="max-w-[95vw] max-h-[92vh] object-contain"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setZoomedIdx(null); }}
            className="absolute top-5 right-5 text-white/80 hover:text-white text-4xl leading-none"
            aria-label="סגור"
          >×</button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoomedIdx(i => (i - 1 + phaseImages.length) % phaseImages.length); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl p-3"
            aria-label="הקודם"
          >→</button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoomedIdx(i => (i + 1) % phaseImages.length); }}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl p-3"
            aria-label="הבא"
          >←</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {zoomedIdx + 1} / {phaseImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
