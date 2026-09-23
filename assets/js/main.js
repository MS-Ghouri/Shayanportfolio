/**
 * Main JavaScript Module (ES6)
 * Portfolio Engineering Team
 * Lead Persona: @FrontendEng
 */

import { initNavigation } from './modules/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize responsive accessible navigation
  initNavigation();

  console.info('Portfolio Engineering System initialized. WCAG 2.2 AA compliant.');
});
