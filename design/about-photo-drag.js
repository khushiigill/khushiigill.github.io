// Keep the photographs movable without disturbing their original rotations.
document.querySelectorAll('.about-photography .about-photo-stack figure').forEach((photo) => {
  let x = 0;
  let y = 0;
  let drag = null;
  const section = photo.closest('.about-photography');

  photo.tabIndex = 0;
  photo.setAttribute('aria-label', `${photo.querySelector('img').alt}. Drag to move, or use the arrow keys.`);
  photo.querySelector('img').draggable = false;

  function move(nextX, nextY) {
    const bounds = section.getBoundingClientRect();
    const rect = photo.getBoundingClientRect();
    const originalLeft = rect.left - x;
    const originalTop = rect.top - y;
    x = Math.max(bounds.left - originalLeft, Math.min(nextX, bounds.right - originalLeft - rect.width));
    y = Math.max(bounds.top - originalTop, Math.min(nextY, bounds.bottom - originalTop - rect.height));
    photo.style.translate = `${x}px ${y}px`;
  }

  function bringForward() {
    document.querySelectorAll('.about-photography .about-photo-stack figure').forEach((item) => {
      if (item !== photo && item.style.zIndex === '10') item.style.zIndex = '9';
    });
    photo.style.zIndex = '10';
  }

  photo.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y };
    bringForward();
    photo.classList.add('is-dragging');
    photo.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  photo.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    move(drag.x + event.clientX - drag.startX, drag.y + event.clientY - drag.startY);
  });
  function stop(event) {
    if (!drag || event.pointerId !== drag.id) return;
    drag = null;
    photo.classList.remove('is-dragging');
  }
  photo.addEventListener('pointerup', stop);
  photo.addEventListener('pointercancel', stop);
  photo.addEventListener('lostpointercapture', stop);
  photo.addEventListener('keydown', (event) => {
    const offsets = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    if (!offsets[event.key]) return;
    event.preventDefault();
    bringForward();
    move(x + offsets[event.key][0], y + offsets[event.key][1]);
  });
});
