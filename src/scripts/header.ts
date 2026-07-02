let controller: AbortController | undefined;
let frameId = 0;

function setupHeaderState() {
  // AbortController clears listeners, but a queued rAF must be cancelled separately.
  controller?.abort();
  if (frameId) {
    window.cancelAnimationFrame(frameId);
    frameId = 0;
  }

  const header = document.querySelector('[data-site-header]');
  if (!header) {
    return;
  }

  controller = new AbortController();

  function updateHeaderState() {
    header!.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  updateHeaderState();
  window.addEventListener('scroll', () => {
    if (frameId) {
      return;
    }
    frameId = window.requestAnimationFrame(() => {
      frameId = 0;
      updateHeaderState();
    });
  }, { passive: true, signal: controller.signal });
}

document.addEventListener('astro:page-load', setupHeaderState);

export {};
