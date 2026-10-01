/**
 * Navigation Module
 * Portfolio Engineering Team
 * Lead Personas: @UXArchitect, @FrontendEng, @AccessibilityAuditor
 *
 * Handles:
 * - Mobile navigation drawer toggle with aria-expanded & body scroll lock
 * - Keyboard Escape key dismiss & focus restoration
 * - Click-outside and nav link click auto-dismiss
 * - Sticky header dynamic blur & scrolled state (.is-scrolled) past hero
 * - Active section scroll-spy indicator via IntersectionObserver + Scroll monitoring
 * - Footer dynamic year synchronization
 */

export function initNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.querySelector('.site-header');
  const heroSection = document.getElementById('hero');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
  const internalNavLinks = Array.from(document.querySelectorAll('.site-nav .nav-link[href^="#"]'));

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

    toggleBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggleBtn.focus();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (toggleBtn.getAttribute('aria-expanded') === 'true') {
          closeMenu();
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (
        toggleBtn.getAttribute('aria-expanded') === 'true' &&
        !navMenu.contains(event.target) &&
        !toggleBtn.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  }

  // ==========================================================================
  // 2. Sticky Header Scrolled State with Dynamic Blur
  // ==========================================================================
  if (header) {
    let ticking = false;

    const updateHeaderState = () => {
      const scrollY = window.scrollY;
      const heroThreshold = heroSection ? Math.min(heroSection.offsetHeight - 120, 150) : 60;
      const isScrolled = scrollY > 20;
      const isPastHero = scrollY > heroThreshold;

      header.classList.toggle('is-scrolled', isScrolled);
      header.classList.toggle('is-past-hero', isPastHero);
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

    updateHeaderState();
  }

  // ==========================================================================
  // 3. Active Section Scroll-Spy (IntersectionObserver & Scroll Coordinate sync)
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

  if (trackedSections.length > 0 && internalNavLinks.length > 0) {
    const navLinkMap = new Map();
    internalNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        navLinkMap.set(href.slice(1), link);
      }
    });

    function setActiveSection(activeId) {
      navLinkMap.forEach((link, id) => {
        if (id === activeId) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });
    }

    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, observerOptions);

      trackedSections.forEach((section) => sectionObserver.observe(section));
    }

    // Scroll fallback to clear active when scrolled back to hero top
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY < 120) {
          navLinkMap.forEach((link) => {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          });
        }
      },
      { passive: true }
    );
  }

  // ==========================================================================
  // 4. Dynamic Footer Year Updater
  // ==========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
}
