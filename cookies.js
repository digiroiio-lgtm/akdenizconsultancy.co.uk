(() => {
  'use strict';
  const key = 'akdeniz-cookie-choice-v1';
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = '<p>By using this website, you agree to our use of cookies. We use cookies to provide you with a great experience and to help our website run effectively. <a href="/privacy">Privacy Policy</a></p><div class="cookie-actions"><button type="button" data-choice="declined">Decline</button><button type="button" data-choice="accepted">Accept</button></div>';
  document.body.appendChild(banner);
  const settings = document.querySelector('.cookie-settings');
  let choice = null;
  try { choice = localStorage.getItem(key); } catch (_) {}
  function resize() {
    document.body.style.paddingBottom = banner.hidden ? '' : banner.offsetHeight + 'px';
  }
  function close() { banner.hidden = true; resize(); }
  if (choice === 'accepted' || choice === 'declined') close();
  if (settings) {
    settings.hidden = false;
    settings.addEventListener('click', () => {
      banner.hidden = false;
      resize();
      banner.querySelector('button').focus();
    });
  }
  banner.addEventListener('click', (event) => {
    const button = event.target.closest('[data-choice]');
    if (!button) return;
    try { localStorage.setItem(key, button.dataset.choice); } catch (_) {}
    close();
    if (settings) settings.focus({preventScroll:true});
  });
  // No analytics or optional cookies are loaded by this script.
  // Future optional scripts must check explicit acceptance before loading.
  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(banner);
  resize();
})();
