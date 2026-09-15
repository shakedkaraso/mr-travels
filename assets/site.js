(function () {
  var STEP = 10;
  var MIN = 80;
  var MAX = 150;
  var TOGGLE_CLASSES = ['a11y-contrast', 'a11y-grayscale', 'a11y-underline'];

  function applyFontScale(pct) {
    document.documentElement.style.fontSize = pct + '%';
    localStorage.setItem('a11yFontScale', pct);
  }

  function setToggle(cls, on) {
    document.documentElement.classList.toggle(cls, on);
    localStorage.setItem('a11y_' + cls, on ? '1' : '0');
  }

  function initA11y() {
    var savedScale = parseInt(localStorage.getItem('a11yFontScale'), 10) || 100;
    applyFontScale(savedScale);
    TOGGLE_CLASSES.forEach(function (cls) {
      if (localStorage.getItem('a11y_' + cls) === '1') {
        document.documentElement.classList.add(cls);
      }
    });

    var toggle = document.createElement('button');
    toggle.className = 'a11y-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'פתיחת תפריט נגישות');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '♿';

    var panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'הגדרות נגישות');
    panel.innerHTML =
      '<h2>נגישות</h2>' +
      '<div class="a11y-row"><span>גודל טקסט</span><div class="a11y-btns">' +
      '<button type="button" class="a11y-opt" data-action="font-dec" aria-label="הקטן טקסט">א-</button>' +
      '<button type="button" class="a11y-opt" data-action="font-inc" aria-label="הגדל טקסט">א+</button>' +
      '</div></div>' +
      '<div class="a11y-row"><span>ניגודיות גבוהה</span><button type="button" class="a11y-opt" data-toggle="a11y-contrast" aria-pressed="false">הפעל</button></div>' +
      '<div class="a11y-row"><span>גווני אפור</span><button type="button" class="a11y-opt" data-toggle="a11y-grayscale" aria-pressed="false">הפעל</button></div>' +
      '<div class="a11y-row"><span>הדגשת קישורים</span><button type="button" class="a11y-opt" data-toggle="a11y-underline" aria-pressed="false">הפעל</button></div>' +
      '<button type="button" class="a11y-reset" data-action="reset">איפוס הגדרות נגישות</button>';

    document.body.appendChild(panel);
    document.body.appendChild(toggle);

    var toggleButtons = panel.querySelectorAll('[data-toggle]');
    toggleButtons.forEach(function (btn) {
      var cls = btn.getAttribute('data-toggle');
      var active = document.documentElement.classList.contains(cls);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.textContent = active ? 'כבה' : 'הפעל';
      btn.addEventListener('click', function () {
        var isActive = document.documentElement.classList.contains(cls);
        setToggle(cls, !isActive);
        btn.setAttribute('aria-pressed', !isActive ? 'true' : 'false');
        btn.textContent = !isActive ? 'כבה' : 'הפעל';
      });
    });

    panel.querySelector('[data-action="font-inc"]').addEventListener('click', function () {
      var cur = parseInt(document.documentElement.style.fontSize, 10) || 100;
      applyFontScale(Math.min(MAX, cur + STEP));
    });
    panel.querySelector('[data-action="font-dec"]').addEventListener('click', function () {
      var cur = parseInt(document.documentElement.style.fontSize, 10) || 100;
      applyFontScale(Math.max(MIN, cur - STEP));
    });
    panel.querySelector('[data-action="reset"]').addEventListener('click', function () {
      applyFontScale(100);
      TOGGLE_CLASSES.forEach(function (cls) {
        setToggle(cls, false);
      });
      toggleButtons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = 'הפעל';
      });
    });

    function openPanel() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      if (panel.hidden) { openPanel(); } else { closePanel(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        closePanel();
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) {
        closePanel();
      }
    });
  }

  function initCookieConsent() {
    if (document.body.classList.contains('legal-page')) return;
    if (sessionStorage.getItem('cookieConsent') === '1') return;
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'הודעת עוגיות ופרטיות');
    banner.innerHTML =
      '<p>האתר משתמש בעוגיות (cookies) לצורך תפעול בסיסי ושיפור החוויה. בהמשך הגלישה את/ה מאשר/ת שימוש בעוגיות בהתאם ל' +
      '<a href="/privacy.html">מדיניות הפרטיות</a> שלנו.</p>' +
      '<button type="button">מאשר/ת</button>';
    document.body.appendChild(banner);
    document.body.classList.add('has-cookie-banner');
    banner.querySelector('button').addEventListener('click', function () {
      sessionStorage.setItem('cookieConsent', '1');
      banner.remove();
      document.body.classList.remove('has-cookie-banner');
    });
  }

  function init() {
    initA11y();
    initCookieConsent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
