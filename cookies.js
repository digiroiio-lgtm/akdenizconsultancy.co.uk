(() => {
  'use strict';

  const key = 'akdeniz-cookie-choice-v2';
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.setAttribute('role', 'region');
  banner.innerHTML = `
    <div class="cookie-copy">
      <p><strong>Your cookie choices</strong></p>
      <p>We use essential browser storage to remember your choice. Optional analytics or advertising technologies will remain off unless you accept them. <a href="/privacy#cookies">Privacy Policy</a></p>
      <div class="cookie-details" hidden>
        <p><strong>Essential storage:</strong> always active where needed for security, accessibility and remembering this preference.</p>
        <p><strong>Optional analytics and advertising:</strong> off by default. None are currently loaded on this website.</p>
      </div>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-reject" data-choice="essential">Reject non-essential</button>
      <button type="button" class="cookie-manage" data-settings aria-expanded="false">Cookie settings</button>
      <button type="button" class="cookie-accept" data-choice="all">Accept all</button>
    </div>`;

  document.body.appendChild(banner);

  const footerSettings = document.querySelector('.cookie-settings');
  const details = banner.querySelector('.cookie-details');
  const manageButton = banner.querySelector('[data-settings]');
  let choice = null;

  try { choice = localStorage.getItem(key); } catch (_) {}

  function resize() {
    document.body.style.paddingBottom = banner.hidden ? '' : banner.offsetHeight + 'px';
  }

  function close() {
    banner.hidden = true;
    details.hidden = true;
    manageButton.setAttribute('aria-expanded', 'false');
    resize();
  }

  function open(showDetails = false) {
    banner.hidden = false;
    details.hidden = !showDetails;
    manageButton.setAttribute('aria-expanded', String(showDetails));
    resize();
    (showDetails ? manageButton : banner.querySelector('[data-choice]')).focus();
  }

  function setChoice(value) {
    try { localStorage.setItem(key, value); } catch (_) {}
    window.dispatchEvent(new CustomEvent('akdeniz:cookie-consent', { detail: { optional: value === 'all' } }));
    close();
    if (footerSettings) footerSettings.focus({ preventScroll: true });
  }

  if (choice === 'all' || choice === 'essential') close();

  if (footerSettings) {
    footerSettings.hidden = false;
    footerSettings.addEventListener('click', () => open(true));
  }

  manageButton.addEventListener('click', () => {
    const showDetails = details.hidden;
    details.hidden = !showDetails;
    manageButton.setAttribute('aria-expanded', String(showDetails));
    resize();
  });

  banner.addEventListener('click', (event) => {
    const button = event.target.closest('[data-choice]');
    if (button) setChoice(button.dataset.choice);
  });

  // Optional scripts must check this function or the consent event before loading.
  window.akdenizCookieConsent = {
    hasOptionalConsent: () => {
      try { return localStorage.getItem(key) === 'all'; } catch (_) { return false; }
    },
    openSettings: () => open(true)
  };

  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(banner);
  resize();
})();
