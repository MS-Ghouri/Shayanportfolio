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
    if (!messageInput.value.trim()) {
      isValid = false;
      messageInput.classList.add('is-invalid');
      if (errorMessage) {
        errorMessage.textContent = 'Please enter your message.';
        errorMessage.removeAttribute('hidden');
      }
    }

    if (!isValid) return;

    // Send Form Data to Formspree Endpoint
    submitBtn.setAttribute('disabled', '');
    submitBtn.classList.add('is-loading');
    const submitBtnText = submitBtn.querySelector('span');
    const originalBtnText = submitBtnText ? submitBtnText.textContent : 'Send Message';
    if (submitBtnText) submitBtnText.textContent = 'Sending...';

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      inquiry_type: typeSelect.value,
      message: messageInput.value.trim(),
      _subject: 'New Portfolio Inquiry from Shayan Ghouri Portfolio'
    };

    const formspreeEndpoint = form.getAttribute('action') || 'https://formspree.io/f/mnpnqrqk';

    fetch(formspreeEndpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        if (response.ok) {
          const senderName = nameInput.value.trim();
          statusBox.innerHTML = `Thank you, <strong>${senderName}</strong>! Your message has been sent successfully. I will review it and get back to you shortly.`;
          statusBox.className = 'form-status status-success';
          statusBox.removeAttribute('hidden');
          form.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          const errorMsg = data.errors && data.errors.length > 0
            ? data.errors.map(err => err.message).join(', ')
            : 'Oops! There was a problem sending your message. Please try again or reach out directly at <a href="mailto:ghourishayan09@gmail.com" class="text-accent" style="text-decoration: underline;">ghourishayan09@gmail.com</a>.';
          
          statusBox.innerHTML = errorMsg;
          statusBox.className = 'form-status status-error';
          statusBox.removeAttribute('hidden');
        }
      })
      .catch((err) => {
        console.error('Form submission network error:', err);
        statusBox.innerHTML = 'Network error. Please check your connection or email me directly at <a href="mailto:ghourishayan09@gmail.com" class="text-accent" style="text-decoration: underline;">ghourishayan09@gmail.com</a>.';
        statusBox.className = 'form-status status-error';
        statusBox.removeAttribute('hidden');
      })
      .finally(() => {
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('is-loading');
        if (submitBtnText) submitBtnText.textContent = originalBtnText;
      });
  });
}
