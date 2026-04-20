export default function ScrollProgress({ total, activeIdx, onJump }) {
  return (
    <nav className="progress-rail" aria-label="Portfolio navigation">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`progress-dot ${i === activeIdx ? 'is-active' : ''}`}
          onClick={() => onJump(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === activeIdx ? 'true' : 'false'}
        />
      ))}
    </nav>
  );
}
