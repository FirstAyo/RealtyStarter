// assets/js/main.js  (ES5-compatible)
(function () {
  var doc = document.documentElement;
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var initial = saved || (prefersDark ? 'dark' : 'light');
  doc.setAttribute('data-theme', initial);

  function setTheme(mode) {
    doc.setAttribute('data-theme', mode);
    try {
      localStorage.setItem('theme', mode);
    } catch (e) {}
    var btn = document.getElementById('themeToggle');
    if (btn) { btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false'); }
  }

  window.toggleTheme = function () {
    var current = doc.getAttribute('data-theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
  };

  // Hamburger
  var nav = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburger');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      var firstLink = nav.querySelector('a');
      if (open && firstLink) { firstLink.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Utils
  window.$qs = function (s, el) { if (!el) el = document; return el.querySelector(s); };
  window.$qsa = function (s, el) { if (!el) el = document; return Array.prototype.slice.call(el.querySelectorAll(s)); };
  window.$params = new URLSearchParams(location.search);
  window.$formatPrice = function (n) {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
    } catch (e) {
      return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };
  window.$formatDate = function (iso) {
    try { return new Date(iso).toLocaleDateString(); } catch (e) { return iso; }
  };
  window.$slug = function (s) {
    s = String(s || '').toLowerCase();
    s = s.replace(/[^a-z0-9]+/g, '-');
    s = s.replace(/(^-|-$)/g, '');
    return s;
  };
})();

// jQuery helper for fetching JSON (define AFTER jQuery script tag)
function loadJSON(url){
  return $.getJSON(url);
}
