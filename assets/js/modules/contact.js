/**
 * Contact & Inquiries Module
 * Portfolio Engineering Team
 * Lead Personas: @SecurityEng, @FrontendEng, @AccessibilityEng
 *
 * Handles:
 * - 1-Click Email Copy-to-Clipboard with interactive tooltip feedback state
 * - Unified trigger handler across Hero, Contact section, and Footer
 * - Client-side validation for required fields, email format, and message length
 * - Anti-spam Honeypot detection to silently reject automated bot submissions
 * - Zero hardcoded secrets / endpoint hookup with graceful mailto fallback
 */

export function initContact() {
  initEmailCopy();
  initContactForm();
}

/**
 * 1-Click Copy Email to Clipboard with Tooltip Feedback State
 */
function initEmailCopy() {
  const copyTriggers = document.querySelectorAll('.btn-copy-trigger, #btn-copy-email');
  if (copyTriggers.length === 0) return;

  const defaultEmail = 'ghourishayan09@gmail.com';

  copyTriggers.forEach((trigger) => {
    let copyTimeout = null;

    trigger.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailToCopy = trigger.getAttribute('data-copy-text') || defaultEmail;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          fallbackCopyText(emailToCopy);
        }

        // Apply visual feedback & tooltip state
        trigger.classList.add('is-copied');
        const tooltip = trigger.querySelector('.copy-tooltip');
        if (tooltip) {
          tooltip.textContent = 'Email Copied!';
        }
        const textSpan = trigger.querySelector('.copy-text');
        if (textSpan) {
          textSpan.textContent = 'Copied!';
        }

        trigger.setAttribute('aria-label', `Email ${emailToCopy} copied to clipboard!`);

        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          trigger.classList.remove('is-copied');
          if (tooltip) {
            tooltip.textContent = 'Email Copied!';
          }
          if (textSpan) {
            textSpan.textContent = 'Copy';
          }
          trigger.setAttribute('aria-label', 'Copy email address to clipboard');
        }, 2200);
      } catch (err) {
        console.warn('Clipboard write failed, falling back:', err);
        fallbackCopyText(emailToCopy);
      }
    });
  });
}

/**
 * Fallback copy method for older browsers or restricted permissions
 */
function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback execCommand copy failed:', err);
  }
  document.body.removeChild(textarea);
}

/**
 * Client-Side Form Validation & Honeypot Spam Protection
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  const submitBtn = document.getElementById('btn-submit-form');

  if (!form || !statusBox || !submitBtn) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const typeSelect = document.getElementById('contact-type');
  const messageInput = document.getElementById('contact-message');
  const gotchaInput = document.getElementById('contact-gotcha');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorType = document.getElementById('error-type');
  const errorMessage = document.getElementById('error-message');

  function clearErrors() {
    [nameInput, emailInput, typeSelect, messageInput].forEach((el) => {
      if (el) el.classList.remove('is-invalid');
    });
    [errorName, errorEmail, errorType, errorMessage].forEach((el) => {
      if (el) {
        el.textContent = '';
        el.setAttribute('hidden', '');
      }
    });
    statusBox.textContent = '';
    statusBox.setAttribute('hidden', '');
    statusBox.className = 'form-status';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    // 1. Honeypot check (Spam bot trap)
    if (gotchaInput && gotchaInput.value.trim() !== '') {
      console.warn('Bot submission blocked.');
      statusBox.textContent = 'Submission processed.';
      statusBox.classList.add('status-success');
      statusBox.removeAttribute('hidden');
      form.reset();
      return;
    }

    let isValid = true;

    // Name validation
    if (!nameInput.value.trim()) {
      isValid = false;
      nameInput.classList.add('is-invalid');
      if (errorName) {
        errorName.textContent = 'Please enter your name.';
        errorName.removeAttribute('hidden');
      }
    }

    // Email validation
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      isValid = false;
      emailInput.classList.add('is-invalid');
      if (errorEmail) {
        errorEmail.textContent = 'Please provide a valid email address.';
        errorEmail.removeAttribute('hidden');
      }
    }

    // Project type validation
    if (!typeSelect.value) {
      isValid = false;
      typeSelect.classList.add('is-invalid');
      if (errorType) {
        errorType.textContent = 'Please select a project type.';
        errorType.removeAttribute('hidden');
      }
    }

    // Message validation
    if (!messageInput.value.trim() || messageInput.value.trim().length < 15) {
      isValid = false;
      messageInput.classList.add('is-invalid');
      if (errorMessage) {
        errorMessage.textContent = 'Please describe your inquiry (at least 15 characters).';
        errorMessage.removeAttribute('hidden');
      }
    }

    if (!isValid) return;

    // Simulate sending / route to mailto fallback
    submitBtn.setAttribute('disabled', '');
    submitBtn.classList.add('is-loading');

    setTimeout(() => {
      submitBtn.removeAttribute('disabled');
      submitBtn.classList.remove('is-loading');

      const subject = encodeURIComponent(`[Portfolio Inquiry] ${typeSelect.value}: ${nameInput.value.trim()}`);
      const body = encodeURIComponent(
        `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\nProject Type: ${typeSelect.value}\n\nMessage:\n${messageInput.value.trim()}`
      );

      statusBox.innerHTML = `Thank you, <strong>${nameInput.value.trim()}</strong>! Your message is ready. Opening your email client...`;
      statusBox.classList.add('status-success');
      statusBox.removeAttribute('hidden');

      // Launch native mailto
      window.location.href = `mailto:ghourishayan09@gmail.com?subject=${subject}&body=${body}`;

      form.reset();
    }, 600);
  });
}
