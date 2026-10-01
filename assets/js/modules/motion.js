/**
 * Motion & Animation Module
 * Portfolio Engineering Team
 * Lead Personas: @UXArchitect, @VisualDesigner, @FrontendEng, @AccessibilityAuditor
 *
 * Implements Final UX Polish:
 * - IntersectionObserver viewport reveal system (fade-in & translateY(20px) -> 0)
 * - Subtle staggered delays on grid items (50ms increments, max 250ms)
 * - Hardware acceleration with will-change cleanup for optimal memory
 * - Immediate reveal of above-the-fold elements
 * - Full prefers-reduced-motion honor & suppression
 */

export function initMotion() {
  // Check user motion preferences first
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
    return;
  }

  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    return;
  }

  // Progressive enhancement: add .js-motion ONLY when JS is verified and running
  document.documentElement.classList.add('js-motion');

  // Candidate selectors for major content blocks to receive smooth scroll entrance
  const revealSelectors = [
    // Section intros
    '.section-eyebrow',
    '.section-title',
    '.section-subtitle',
    '.about-intro-header',
    '.about-philosophy-card',
    '.about-currently-card',
    
    // Grids & Cards
    '.about-meta-card',
    '.tech-category-card',
    '.timeline-card',
    '.timeline-entry',
    '.project-showcase-card',
    '.service-card',
    '.process-step-card',
    '.trust-strip-item',
    '.contact-card',
    '.contact-method-card',
    '.form-card-header',
    '.footer-grid'
  ];

  // Group container selectors for staggered children
  const staggeredGroupSelectors = [
    '.about-meta-grid',
    '.tech-stack-grid',
    '.projects-showcase',
    '.secondary-projects-grid',
    '.services-grid',
    '.process-steps-list',
    '.contact-methods-grid',
    '.trust-strip'
  ];

  // Apply staggered transition delays to children within group containers
  staggeredGroupSelectors.forEach((groupSelector) => {
    const containers = document.querySelectorAll(groupSelector);
    containers.forEach((container) => {
      const children = Array.from(container.children);
      children.forEach((child, index) => {
        child.classList.add('reveal-on-scroll');
        // Cap maximum stagger delay at 250ms so users never wait
        const delay = Math.min(index * 50, 250);
        if (delay > 0) {
          child.style.transitionDelay = `${delay}ms`;
        }
      });
    });
  });

  // Query all other reveal candidates and mark them
  revealSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
    });
  });

  const allRevealElements = document.querySelectorAll('.reveal-on-scroll');

  // Viewport intersection observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.classList.add('is-revealed');

        // Cleanup will-change after transition completes to release GPU memory
        const cleanUp = () => {
          target.style.willChange = 'auto';
          target.removeEventListener('transitionend', cleanUp);
        };
        target.addEventListener('transitionend', cleanUp);

        // Fallback cleanup
        setTimeout(cleanUp, 450);

        // Unobserve immediately
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  allRevealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    // If element is already in or above initial viewport, reveal immediately without delay
    if (rect.top < windowHeight - 40) {
      element.classList.add('is-revealed');
    } else {
      revealObserver.observe(element);
    }
  });

  // Failsafe: Ensure everything becomes visible after 2.5s under any unforeseen condition
  setTimeout(() => {
    allRevealElements.forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        el.classList.add('is-revealed');
      }
    });
  }, 2500);
}
