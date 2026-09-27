/**
 * Main JavaScript Module (ES6)
 * Portfolio Engineering Team
 * Lead Persona: @FrontendEng
 */

import { initNavigation } from './modules/navigation.js';
import { initContact } from './modules/contact.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize responsive accessible navigation
  initNavigation();

  // Initialize secure contact form and copy utility
  initContact();

  console.info('Portfolio Engineering System initialized. WCAG 2.2 AA compliant.');
});
