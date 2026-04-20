import { useCallback, useEffect, useMemo, useState } from 'react';

// initialPhaseHint: substring to match against gallery titles (e.g. "before")
export default function Lightbox({ project, initialPhaseHint = null, onClose }) {
  const galleries = project?.galleries || [];

  const initialIdx = useMemo(() => {
    if (!initialPhaseHint) return 0;
    const idx = galleries.findIndex(g => new RegExp(initialPhaseHint, 'i').test(g.title));
    return idx >= 0 ? idx : 0;
  }, [galleries, initialPhaseHint]);

  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const [zoomedIdx, setZoomedIdx] = useState(null);

  useEffect(() => { setActiveIdx(initialIdx); }, [initialIdx]);

  const activeGallery = galleries[activeIdx];
  const images = activeGallery?.images || [];

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') {
      if (zoomedIdx !== null) setZoomedIdx(null);
      else onClose();
    } else if (zoomedIdx !== null) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setZoomedIdx(i => (i + 1) % images.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setZoomedIdx(i => (i - 1 + images.length) % images.length);
      }
    }
  }, [onClose, zoomedIdx, images.length]);

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
    <div className="lightbox-backdrop" role="dialog" aria-modal="true" aria-label={`Gallery — ${project.name}`}>
      <header className="flex items-center justify-between px-5 md:px-10 py-5 border-b border-white/10">
        <div>
          <div className="eyebrow mb-2">{project.location}</div>
          <h3 className="text-2xl md:text-3xl font-light uppercase" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.04em' }}>
            {project.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-3xl leading-none px-3"
          aria-label="Close"
        >×</button>
      </header>

      <div className="flex flex-wrap gap-2 px-5 md:px-10 py-4 border-b border-white/10">
        {galleries.map((g, i) => (
          <button
            key={g.id}
            onClick={() => { setActiveIdx(i); setZoomedIdx(null); }}
            className={`lightbox-tab ${i === activeIdx ? 'is-active' : ''}`}
          >
            {g.title}
            <span className="count">({g.count})</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <button
              key={img.thumb}
              onClick={() => setZoomedIdx(i)}
              className="group relative aspect-[4/3] overflow-hidden bg-white/5"
            >
              <img
                src={img.thumb}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[var(--color-gold)]/55 transition-all" />
            </button>
          ))}
        </div>
        {images.length === 0 && (
          <div className="text-white/50 text-center py-12">No images in this category</div>
        )}
      </div>

      {zoomedIdx !== null && images[zoomedIdx] && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center"
          onClick={() => setZoomedIdx(null)}
        >
          <img
            src={images[zoomedIdx].full}
            alt=""
            className="max-w-[95vw] max-h-[92vh] object-contain"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setZoomedIdx(null); }}
            className="absolute top-5 right-5 text-white/80 hover:text-white text-4xl leading-none"
            aria-label="Close"
          >×</button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoomedIdx(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl p-3"
            aria-label="Previous"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoomedIdx(i => (i + 1) % images.length); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl p-3"
            aria-label="Next"
          >›</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wider">
            {zoomedIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
