/**
 * Navigation Module
 * Portfolio Engineering Team
 * Personas: @UXArchitect, @FrontendEng, @AccessibilityAuditor
 *
 * Handles:
 * - Mobile navigation drawer toggle with aria-expanded & body scroll lock
 * - Keyboard Escape key dismiss & focus restoration
 * - Click-outside and nav link click auto-dismiss
 * - Sticky header scroll state (.is-scrolled)
 * - Active section scroll-spy indicator via IntersectionObserver
 * - Footer dynamic year synchronization
 */

export function initNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
  const internalNavLinks = document.querySelectorAll('.site-nav .nav-link[href^="#"], .site-nav .nav-cta[href^="#"]');

  // ==========================================================================
  // 1. Mobile Menu Drawer Management (WCAG 2.2 AA compliant)
  // ==========================================================================
  if (toggleBtn && navMenu) {
    function openMenu() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-open');
      document.body.classList.add('nav-open');
    }

    function closeMenu() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }

    function toggleMenu() {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
        toggleBtn.focus();
      } else {
        openMenu();
      }
    }

    // Toggle button click listener
    toggleBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    // Close menu on pressing Escape key and return focus to toggle button
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggleBtn.focus();
      }
    });

    // Close menu when clicking on any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (toggleBtn.getAttribute('aria-expanded') === 'true') {
          closeMenu();
        }
      });
    });

    // Close menu when clicking outside of the navigation container
    document.addEventListener('click', (event) => {
      if (
        toggleBtn.getAttribute('aria-expanded') === 'true' &&
        !navMenu.contains(event.target) &&
        !toggleBtn.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close mobile drawer automatically if viewport resized beyond mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  }

  // ==========================================================================
  // 2. Sticky Header Scrolled State (Subtle border & elevated background)
  // ==========================================================================
  if (header) {
    let ticking = false;

    const updateHeaderState = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeaderState);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial check on page load
    updateHeaderState();
  }

  // ==========================================================================
  // 3. Active Section Scroll-Spy via IntersectionObserver
  // ==========================================================================
  const trackedSectionIds = [
    'about',
    'skills',
    'experience',
    'projects',
    'services',
    'process',
    'contact'
  ];

  const trackedSections = trackedSectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const navLinkMap = new Map();
    document.querySelectorAll('.site-nav .nav-link[href^="#"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.slice(1);
        navLinkMap.set(id, link);
      }
    });

    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          navLinkMap.forEach((link, id) => {
            if (id === currentId) {
              link.classList.add('is-active');
              link.setAttribute('aria-current', 'page');
            } else {
              link.classList.remove('is-active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  // ==========================================================================
  // 4. Dynamic Footer Year Updater
  // ==========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
}
