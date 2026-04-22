document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  animateCounters();
  wirePasswordToggle();
});

function initThemeToggle() {
  const btn = document.querySelector('[data-theme-toggle-btn]');
  if (!btn) {
    return;
  }

  const stored = localStorage.getItem('lms-jinja-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');

  applyTheme(theme, btn);

  btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme, btn);
    localStorage.setItem('lms-jinja-theme', theme);
  });
}

function applyTheme(theme, btn) {
  document.documentElement.setAttribute('data-theme', theme);
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  btn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  btn.setAttribute('data-theme-state', theme);
}

function animateCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = String(current);
    }, 24);
  });
}

function wirePasswordToggle() {
  const toggle = document.querySelector('[data-toggle-password]');
  if (!toggle) {
    return;
  }

  const targetId = toggle.getAttribute('data-target');
  const input = document.getElementById(targetId);
  if (!input) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggle.innerHTML = isPassword
      ? '<i class="fa-solid fa-eye-slash"></i>'
      : '<i class="fa-solid fa-eye"></i>';
  });
}
