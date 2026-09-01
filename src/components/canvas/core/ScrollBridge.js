/**
 * ScrollBridge: Non-reactive passive scroll tracker.
 * Avoids any React state re-renders on scroll.
 */
export const scrollBridge = {
  target: 0,
  current: 0,
};

let listenerCount = 0;

function updateScrollTarget() {
  const doc = document.documentElement;
  const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
  scrollBridge.target = progress;
}

export function initScrollBridge() {
  if (typeof window === 'undefined') return () => {};

  if (listenerCount === 0) {
    updateScrollTarget();
    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', updateScrollTarget, { passive: true });
  }
  listenerCount++;

  return () => {
    listenerCount--;
    if (listenerCount <= 0) {
      listenerCount = 0;
      window.removeEventListener('scroll', updateScrollTarget);
      window.removeEventListener('resize', updateScrollTarget);
    }
  };
}
