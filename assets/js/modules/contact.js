/**
 * Contact & Inquiries Module
 * Portfolio Engineering Team
 * Personas: @SecurityEng, @FrontendEng, @AccessibilityEng
 *
 * Handles:
 * - 1-Click Email Copy-to-Clipboard with accessible inline feedback
 * - Client-side validation for required fields, email format, and message length
 * - Anti-spam Honeypot detection to silently reject automated bot submissions
 * - Zero hardcoded secrets / endpoint hookup with graceful mailto fallback
 */

export function initContact() {
  initEmailCopy();
  initContactForm();
}

/**
 * 1-Click Copy Email to Clipboard
 */
function initEmailCopy() {
  const copyBtn = document.getElementById('btn-copy-email');
  const emailTextEl = document.getElementById('contact-email-text');

  if (!copyBtn || !emailTextEl) return;

  const email = emailTextEl.textContent.trim();
  const copyTextSpan = copyBtn.querySelector('.copy-text');
  let copyTimeout = null;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        fallbackCopyText(email);
      }

      // Visual feedback
      copyBtn.classList.add('is-copied');
      if (copyTextSpan) copyTextSpan.textContent = 'Email Copied!';
      copyBtn.setAttribute('aria-label', 'Email address copied to clipboard');

      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        if (copyTextSpan) copyTextSpan.textContent = 'Copy Email';
        copyBtn.setAttribute('aria-label', 'Copy email address to clipboard');
      }, 2000);
    } catch (err) {
      console.warn('Clipboard write failed, falling back:', err);
      fallbackCopyText(email);
    }
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
      if (el) el.textContent = '';
    });
    statusBox.textContent = '';
    statusBox.className = 'form-status';
  }

  function validateEmail(email) {
    // Standard RFC 5322 compliant regex for practical client validation
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(String(email).toLowerCase());
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    // 1. Honeypot check: If the hidden gotcha field has content, bot detected!
    if (gotchaInput && gotchaInput.value.trim() !== '') {
      // Silent drop: Act like it succeeded so bot does not retry with different vectors
      statusBox.className = 'form-status status-success';
      statusBox.textContent = 'Thank you! Your message has been received.';
      form.reset();
      return;
    }

    // 2. Validate Fields
    let isValid = true;
    let firstInvalid = null;

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const typeVal = typeSelect ? typeSelect.value : '';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    if (!nameVal || nameVal.length < 2) {
      isValid = false;
      nameInput.classList.add('is-invalid');
      if (errorName) errorName.textContent = 'Please enter your name (minimum 2 characters).';
      if (!firstInvalid) firstInvalid = nameInput;
    }

    if (!emailVal || !validateEmail(emailVal)) {
      isValid = false;
      emailInput.classList.add('is-invalid');
      if (errorEmail) errorEmail.textContent = 'Please enter a valid email address.';
      if (!firstInvalid) firstInvalid = emailInput;
    }

    if (!typeVal) {
      isValid = false;
      typeSelect.classList.add('is-invalid');
      if (errorType) errorType.textContent = 'Please select an inquiry type.';
      if (!firstInvalid) firstInvalid = typeSelect;
    }

    if (!messageVal || messageVal.length < 10) {
      isValid = false;
      messageInput.classList.add('is-invalid');
      if (errorMessage) errorMessage.textContent = 'Please enter your message (minimum 10 characters).';
      if (!firstInvalid) firstInvalid = messageInput;
    }

    if (!isValid) {
      statusBox.className = 'form-status status-error';
      statusBox.textContent = 'Please correct the highlighted errors above.';
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // 3. Graceful Client-Side Handshake & Mailto Dispatch
    // Allows immediate zero-backend inquiry routing while keeping user in control
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Dispatching...</span>
      <span class="status-dot" aria-hidden="true"></span>
    `;

    setTimeout(() => {
      const typeText = typeSelect.options[typeSelect.selectedIndex].text;
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${typeText} — ${nameVal}`);
      const body = encodeURIComponent(
        `Hello Shayan,\n\nName: ${nameVal}\nEmail: ${emailVal}\nInquiry Type: ${typeText}\n\nMessage:\n${messageVal}\n\n---\nSent via portfolio contact system.`
      );

      statusBox.className = 'form-status status-success';
      statusBox.textContent = 'Inquiry generated! Opening your email client to send...';

      // Launch mailto
      window.location.href = `mailto:ghourishayan09@gmail.com?subject=${subject}&body=${body}`;

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Send Message</span>
        <svg class="icon-svg-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      `;
    }, 600);
  });
}
