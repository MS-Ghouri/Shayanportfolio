/**
 * Navigation Module
 * Portfolio Engineering Team
 * Personas: @UXArchitect, @FrontendEng, @AccessibilityEng
 *
 * Handles:
 * - Mobile navigation drawer toggle with aria-expanded
 * - Keyboard Escape key trap dismiss & focus restoration
 * - Click-outside and nav link click auto-dismiss
 * - Body scroll lock management
 */

export function initNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (!toggleBtn || !navMenu) return;

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
    if (window.innerWidth > 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}
