/**
 * Interactive Developer Workspace Terminal Module
 * Portfolio Engineering Team
 * Lead Persona: @FrontendEng, @UXArchitect, @AccessibilityAuditor
 * 
 * Features:
 * - WAI-ARIA compliant tabbed navigation (profile.ts, architecture.ts, api-demo.json)
 * - Keyboard navigation (ArrowLeft, ArrowRight, Home, End)
 * - 1-Click code clipboard copy with live feedback state
 * - Automatic plain-text extraction from syntax-highlighted code blocks
 */

export function initTerminal() {
  const terminal = document.querySelector('.hero-code-window');
  if (!terminal) return;

  const tabs = Array.from(terminal.querySelectorAll('.terminal-tab'));
  const panels = Array.from(terminal.querySelectorAll('.code-tab-panel'));
  const copyBtn = terminal.querySelector('#btn-copy-terminal');

  if (tabs.length === 0 || panels.length === 0) return;

  /**
   * Switch active tab and associated panel
   * @param {HTMLElement} targetTab
   * @param {boolean} setFocus - Whether to shift keyboard focus to the target tab
   */
  function switchTab(targetTab, setFocus = true) {
    const targetPanelId = targetTab.getAttribute('aria-controls');
    const targetPanel = terminal.querySelector(`#${targetPanelId}`);
    if (!targetPanel) return;

    // Update Tabs
    tabs.forEach((tab) => {
      const isActive = tab === targetTab;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // Update Panels
    panels.forEach((panel) => {
      const isActive = panel === targetPanel;
      panel.classList.toggle('is-active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    if (setFocus) {
      targetTab.focus();
    }
  }

  // Bind Tab Click Handlers
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(tab, false);
    });

    // Keyboard Arrow & Home/End Navigation per W3C Tablist Pattern
    tab.addEventListener('keydown', (e) => {
      const currentIndex = tabs.indexOf(tab);
      let newIndex = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabs.length - 1;
      }

      if (newIndex !== null) {
        switchTab(tabs[newIndex], true);
      }
    });
  });

  // Extract clean code snippet from active panel (stripping line numbers)
  function getActiveSnippetText() {
    const activePanel = terminal.querySelector('.code-tab-panel.is-active');
    if (!activePanel) return '';

    // If pre-stored raw text exists, use it
    if (activePanel.dataset.rawCode) {
      return activePanel.dataset.rawCode;
    }

    // Otherwise extract from code lines, stripping .line-no spans
    const lines = activePanel.querySelectorAll('.code-block .cl');
    if (lines.length > 0) {
      return Array.from(lines)
        .map((line) => {
          const clone = line.cloneNode(true);
          const lineNo = clone.querySelector('.line-no');
          if (lineNo) lineNo.remove();
          return clone.textContent.replace(/\r?\n$/, '');
        })
        .join('\n');
    }

    return activePanel.textContent.trim();
  }

  // Copy Code to Clipboard Utility
  if (copyBtn) {
    let copyTimeout = null;

    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const codeText = getActiveSnippetText();
      if (!codeText) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(codeText);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = codeText;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Visual feedback
        clearTimeout(copyTimeout);
        copyBtn.classList.add('is-copied');
        const textSpan = copyBtn.querySelector('.copy-text');
        if (textSpan) textSpan.textContent = 'Copied!';
        copyBtn.setAttribute('aria-label', 'Code copied to clipboard successfully');

        copyTimeout = setTimeout(() => {
          copyBtn.classList.remove('is-copied');
          if (textSpan) textSpan.textContent = 'Copy';
          copyBtn.setAttribute('aria-label', 'Copy active code snippet to clipboard');
        }, 2200);
      } catch (err) {
        console.warn('Clipboard copy failed:', err);
      }
    });
  }
}
