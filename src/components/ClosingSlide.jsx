import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { STATS, CONTACT } from '../data/projects.js';

export default function ClosingSlide({ onBackToTop }) {
  const ref = useScrollReveal({ threshold: 0.3 });
  return (
    <section className="slide" data-slide="closing" style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)' }}>
      <div className="slide-media"><div className="slide-overlay" style={{ background: 'transparent' }} /></div>
      <div className="relative h-full w-full flex items-center justify-center px-6">
        <div ref={ref} className="reveal reveal-up text-center max-w-3xl" dir="rtl">
          <div className="eyebrow mb-8 mx-auto">ליצירת קשר</div>
          <h2 className="text-4xl md:text-6xl font-semibold mb-10" style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.15 }}>
            הבא שלנו<br/>
            <span style={{ color: 'var(--color-gold)' }}>יכול להיות שלך</span>
          </h2>

          <div className="grid grid-cols-3 gap-6 md:gap-12 mb-12 max-w-xl mx-auto">
            <div>
              <div className="display-num text-4xl md:text-5xl" style={{ color: 'var(--color-gold)' }}>{STATS.projects}</div>
              <div className="text-xs md:text-sm text-white/65 tracking-wider mt-1">פרויקטים</div>
            </div>
            <div>
              <div className="display-num text-4xl md:text-5xl" style={{ color: 'var(--color-gold)' }}>{STATS.neighborhoods}</div>
              <div className="text-xs md:text-sm text-white/65 tracking-wider mt-1">אזורים</div>
            </div>
            <div>
              <div className="display-num text-4xl md:text-5xl" style={{ color: 'var(--color-gold)' }}>{STATS.yearsActive}+</div>
              <div className="text-xs md:text-sm text-white/65 tracking-wider mt-1">שנות ניסיון</div>
            </div>
          </div>

          <p className="text-white/75 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            מחפשים הזדמנות השקעה. שותפים. או רק לשוחח.<br/>
            נשמח לפגוש אתכם.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <a href={`tel:${CONTACT.phone}`} className="btn-gold">התקשרו</a>
            <a href={`mailto:${CONTACT.email}`} className="btn-ghost">אימייל</a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
          </div>

          <button
            onClick={onBackToTop}
            className="text-sm text-white/50 hover:text-white transition-colors tracking-[.2em] mt-6"
          >
            חזרה לתחילה ↑
          </button>
        </div>
      </div>
    </section>
  );
}
