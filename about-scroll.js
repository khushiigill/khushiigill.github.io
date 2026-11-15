(() => {
  const envelope = document.querySelector('.about-envelope');
  const photo = envelope?.querySelector('.envelope-polaroid');
  if (!envelope || !photo) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  function update() {
    scheduled = false;
    if (reducedMotion.matches) {
      photo.style.removeProperty('--photo-rise');
      photo.style.removeProperty('--photo-tilt');
      return;
    }
    const top = envelope.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.95 - top) / (window.innerHeight * 0.65)));
    const step = Math.round(progress * 8);
    const steppedProgress = step / 8;
    photo.style.setProperty('--photo-rise', `${28 - steppedProgress * 36}%`);
    photo.style.setProperty('--photo-tilt', `${[3, 5, 1, 5, 1, 5, 1, 4, 3][step]}deg`);
  }

  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  reducedMotion.addEventListener('change', scheduleUpdate);
  update();
})();
