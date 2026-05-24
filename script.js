/* ==========================================================================
   CHORON LLC — script.js

   STRIPE SETUP
   ─────────────────────────────────────────────────────────────────────────
   1. Create a Stripe account at stripe.com
   2. Dashboard → Payments → Payment Links → Create Link
   3. Create one link per package (Starter $999, Growth $2499, Premium $4999)
   4. In index.html, replace these three placeholder href values:
        href="YOUR_STRIPE_LINK_STARTER"
        href="YOUR_STRIPE_LINK_GROWTH"
        href="YOUR_STRIPE_LINK_PREMIUM"
      with the actual URLs (e.g. https://buy.stripe.com/xxxx)
   Payment Links are public URLs — safe to put directly in HTML, no .env needed.

   DEPLOYMENT
   ─────────────────────────────────────────────────────────────────────────
   - Netlify: drag-and-drop this folder at app.netlify.com/drop
   - Vercel:  run `npx vercel` in this folder (requires Node.js)
   - GitHub Pages: push to GitHub → Settings → Pages → Deploy from main
   ========================================================================== */


/* ── Nav scroll state ─────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/* ── Smooth scroll for anchor links ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── Scroll-reveal animations ────────────────────────────────────────── */
function initReveal() {
  const selector = [
    '.service-card',
    '.process__step',
    '.pricing-card',
    '.testimonial',
    '.faq__item',
    '.section-header',
    '.contact__content',
    '.contact__form',
    '.stat',
  ].join(', ');

  document.querySelectorAll(selector).forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    // Stagger delay based on position within parent
    const siblings = Array.from(el.parentElement.querySelectorAll('[data-reveal]'));
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx <= 6) {
      el.setAttribute('data-reveal-delay', String(idx));
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}


/* ── Animated counters ────────────────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statsSection.querySelectorAll('[data-count]').forEach(animateCounter);
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}


/* ── FAQ accordion ────────────────────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq__item').forEach(item => {
    const btn  = item.querySelector('.faq__q');
    const wrap = item.querySelector('.faq__a-wrap');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq__item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq__a-wrap').style.maxHeight = '0';
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        wrap.style.maxHeight = wrap.scrollHeight + 'px';
      }
    });
  });
}


/* ── Init ─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initFaq();
});
