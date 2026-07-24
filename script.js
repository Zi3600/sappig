/* SAPPIG. — interactions
   sample by _ziyad._ @ code-caffeine */
(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const fsmenu = document.getElementById('fsmenu');
  const hasHero = document.body.classList.contains('has-hero');

  /* --- Shared scroll lock ---------------------------------------------
     The fullscreen menu and the popup can both be open, so count holders
     instead of clobbering body.overflow from two places. */
  let locks = 0;
  function lockScroll(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    document.body.style.overflow = locks > 0 ? 'hidden' : '';
  }
  window.SappigUI = { lockScroll };

  /* --- Nav solid state on scroll --- */
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('nav--solid', window.scrollY > 40 || !hasHero);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Fullscreen menu --- */
  if (toggle && fsmenu) {
    let open = false;
    const setMenu = (next) => {
      if (next === open) return;
      open = next;
      fsmenu.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      fsmenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      lockScroll(open);
    };
    toggle.addEventListener('click', () => setMenu(!open));
    fsmenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* --- Scroll reveal ---
     Exposed so content rendered later (the Sanity-driven menu) reveals the
     same way rather than popping in fully formed. */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      )
    : null;

  function observeReveals(root) {
    (root || document).querySelectorAll('.reveal:not(.in)').forEach((el) => {
      if (io) io.observe(el);
      else el.classList.add('in');
    });
  }
  observeReveals();
  window.SappigUI.observeReveals = observeReveals;

  /* --- Rotating carousels (reviews + featured), 5s each --- */
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const slides = root.querySelectorAll('[data-slide]');
    const dots = root.querySelectorAll('[data-dot]');
    if (slides.length < 2) return;

    let i = 0;
    let timer = null;
    const show = (n) => {
      slides[i].classList.remove('active');
      if (dots[i]) dots[i].classList.remove('on');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active');
      if (dots[i]) dots[i].classList.add('on');
    };
    const start = () => { timer = timer || setInterval(() => show(i + 1), 5000); };
    const stop = () => { clearInterval(timer); timer = null; };

    /* dots double as controls */
    dots.forEach((dot, n) => {
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.addEventListener('click', () => { show(n); stop(); start(); });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(n); stop(); start(); }
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
  });

  /* --- Instagram strip: arrows, mouse wheel, drag --- */
  document.querySelectorAll('[data-strip]').forEach((wrapper) => {
    const strip = wrapper.querySelector('.ig-strip');
    if (!strip) return;

    const step = () => {
      const card = strip.querySelector('.ig-card');
      return card ? card.getBoundingClientRect().width + 16 : 320;
    };
    const maxScroll = () => strip.scrollWidth - strip.clientWidth;

    wrapper.querySelectorAll('[data-strip-prev]').forEach((b) =>
      b.addEventListener('click', () => strip.scrollBy({ left: -step(), behavior: 'smooth' }))
    );
    wrapper.querySelectorAll('[data-strip-next]').forEach((b) =>
      b.addEventListener('click', () => strip.scrollBy({ left: step(), behavior: 'smooth' }))
    );

    /* grey out arrows at the ends */
    const syncArrows = () => {
      const max = maxScroll();
      wrapper.querySelectorAll('[data-strip-prev]').forEach((b) => b.toggleAttribute('disabled', strip.scrollLeft <= 1));
      wrapper.querySelectorAll('[data-strip-next]').forEach((b) => b.toggleAttribute('disabled', strip.scrollLeft >= max - 1));
    };
    strip.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows, { passive: true });
    syncArrows();

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    /* Mouse wheel -> horizontal. Hands scrolling back to the page once the
       strip hits an end, so the page never feels stuck. */
    strip.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return;                       // pinch zoom
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;  // trackpad swipe: native
      const max = maxScroll();
      if (max <= 1) return;
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if ((delta < 0 && strip.scrollLeft <= 0) || (delta > 0 && strip.scrollLeft >= max - 1)) return;
      e.preventDefault();
      strip.scrollLeft += delta;
    }, { passive: false });

    /* Click and drag to pan */
    let down = false, startX = 0, startLeft = 0, moved = 0;
    strip.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      down = true; moved = 0;
      startX = e.clientX;
      startLeft = strip.scrollLeft;
      strip.classList.add('is-dragging');
    });
    strip.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) strip.setPointerCapture(e.pointerId);
      strip.scrollLeft = startLeft - dx;
    });
    const endDrag = () => { down = false; strip.classList.remove('is-dragging'); };
    strip.addEventListener('pointerup', endDrag);
    strip.addEventListener('pointercancel', endDrag);
    /* swallow the click that ends a drag so images don't act on it */
    strip.addEventListener('click', (e) => { if (moved > 4) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* --- Footer year ---
     Re-applied on language change: the footer.rights translation rewrites
     the whole line, hardcoded year included. */
  function setYear() {
    document.querySelectorAll('#year').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }
  setYear();
  document.addEventListener('sappig:lang', setYear);
})();
