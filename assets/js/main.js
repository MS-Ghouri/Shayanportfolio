/**
 * Main JavaScript Module (ES6)
 * Portfolio Engineering Team
 * Lead Persona: @FrontendEng
 */

import { initNavigation } from './modules/navigation.js';
import { initContact } from './modules/contact.js';
import { initMotion } from './modules/motion.js';
import { initTerminal } from './modules/terminal.js';
import { initProjects } from './modules/projects.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize responsive accessible navigation
  initNavigation();

  // Initialize interactive developer workspace terminal
  initTerminal();

  // Initialize project filtering and interactive case study modal
  initProjects();

  // Initialize secure contact form and copy utility
  initContact();

  // Initialize restrained, accessible motion system
  initMotion();

  console.info('Portfolio Engineering System initialized. WCAG 2.2 AA compliant.');
});
