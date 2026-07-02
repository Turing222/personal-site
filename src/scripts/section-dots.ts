let controller: AbortController | undefined;
let pendingFrame = 0;

function setupSectionDots() {
  // AbortController clears listeners, but a queued rAF must be cancelled separately.
  controller?.abort();
  if (pendingFrame) {
    window.cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
  }

  // This module stays loaded after client-side navigating away from the
  // homepage, so bail out when the current page has no section nav.
  const nav = document.querySelector('[data-section-nav]');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-id]'));
  const links = Array.from(document.querySelectorAll('[data-section-link]'));
  if (!nav || sections.length === 0 || links.length === 0) {
    return;
  }

  controller = new AbortController();
  const { signal } = controller;

  function setActive(id: string) {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  const hashId = window.location.hash.replace('#', '');
  setActive(hashId || sections[0].id);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateActiveSection() {
    const viewportCenter = window.innerHeight / 2;
    let nearestSection = sections[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSection = section;
      }
    });

    if (nearestSection?.id) {
      setActive(nearestSection.id);
    }
  }

  const scheduleUpdate = () => {
    if (pendingFrame) {
      return;
    }
    pendingFrame = window.requestAnimationFrame(() => {
      pendingFrame = 0;
      updateActiveSection();
    });
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true, signal });
  window.addEventListener('resize', scheduleUpdate, { passive: true, signal });

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) {
        return;
      }

      const target = document.getElementById(href.slice(1));
      if (!target) {
        return;
      }

      event.preventDefault();
      setActive(target.id);
      history.replaceState(null, '', href);
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, { signal });
  });

  updateActiveSection();
}

document.addEventListener('astro:page-load', setupSectionDots);
