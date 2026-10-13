(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-fx');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.section-head, .intro-grid, .essence-links, .achievements-grid, .teacher-row, .mundinho-spaces, .archive-section-heading, .archive-filters').forEach((el, i) => { el.classList.add('fx'); io.observe(el); });
  document.querySelectorAll('.moment-grid a, .mundinho-gallery a, .stage-image, .team-collage').forEach((el, i) => { el.classList.add('fx-img'); el.style.transitionDelay = (i % 5) * 80 + 'ms'; io.observe(el); });
  // contadores
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const el = e.target, end = +el.dataset.count; if (reduce) return;
    const t0 = performance.now(), d = 1400;
    const step = t => { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));
  // parallax
  const px = [...document.querySelectorAll('[data-parallax]')];
  if (!reduce && px.length) {
    let ticking = false;
    const run = () => { const y = scrollY; px.forEach(el => { el.style.transform = `translate3d(0,${y * +el.dataset.parallax}px,0)`; }); ticking = false; };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  }
  const v = document.querySelector('.hx-card video');
  if (v && reduce) { v.removeAttribute('autoplay'); v.pause(); }
})();
