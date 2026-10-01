/**
 * Motion & Animation Module
 * Portfolio Engineering Team
 * Personas: @UXArchitect, @VisualDesigner, @FrontendEng, @AccessibilityAuditor
 *
 * Implements Step 13:
 * - JavaScript failure safety (progressive enhancement via .js-motion)
 * - prefers-reduced-motion honor & suppression
 * - IntersectionObserver viewport reveal system
 * - Subtle staggered delays on card groups (capped at 300ms)
 * - Immediate reveal of above-the-fold elements
 * - Zero layout thrashing, hardware-accelerated transforms
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
    // If not supported, leave content visible without hiding
    return;
  }

  // Progressive enhancement: add .js-motion ONLY when JS is verified and running
  document.documentElement.classList.add('js-motion');

  // Candidate selectors for major content blocks to receive subtle reveal
  const revealSelectors = [
    // Section header intros
    '.section-header-block',
    '.about-intro-header',
    '.skills-header-block',
    '.experience-intro-header',
    '.projects-intro-header',
    '.services-header-block',
    '.process-intro-header',
    '.proof-intro-header',
    '.contact-intro-header',
    
    // Major cards and groupings
    '.about-philosophy-card',
    '.about-currently-card',
    '.about-meta-grid',
    '.skills-category-card',
    '.tech-category-card',
    '.timeline-card',
    '.selected-work-card',
    '.project-showcase-card',
    '.service-card',
    '.process-step-card',
    '.proof-card',
    '.contact-method-card',
    '.contact-form',
    '.footer-grid'
  ];

  // Group container selectors for staggered children
  const staggeredGroupSelectors = [
    '.skills-grid',
    '.tech-categories-grid',
    '.selected-work-grid',
    '.services-grid',
    '.process-steps-list',
    '.proof-grid',
    '.contact-methods-grid',
    '.about-meta-grid'
  ];

  // Apply staggered transition delays to children within group containers
  staggeredGroupSelectors.forEach((groupSelector) => {
    const containers = document.querySelectorAll(groupSelector);
    containers.forEach((container) => {
      const children = Array.from(container.children);
      children.forEach((child, index) => {
        child.classList.add('reveal-on-scroll');
        // Cap maximum stagger delay at 280ms so users never wait
        const delay = Math.min(index * 60, 280);
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
      // Don't duplicate if already marked
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
    });
  });

  const allRevealElements = document.querySelectorAll('.reveal-on-scroll');

  // Viewport intersection observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Unobserve immediately to optimize performance and prevent repeated work
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  allRevealElements.forEach((element) => {
    // If element is already in or above initial viewport, reveal immediately
    const rect = element.getBoundingClientRect();
    if (rect.top < windowHeight - 30) {
      element.classList.add('is-revealed');
    } else {
      revealObserver.observe(element);
    }
  });

  // Failsafe: Ensure everything becomes visible after 3s under any unforeseen condition
  setTimeout(() => {
    allRevealElements.forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        el.classList.add('is-revealed');
      }
    });
  }, 3000);
}
