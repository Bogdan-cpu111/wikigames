/* ===== WIKIGAMES — MAIN SCRIPT ===== */

/* ─── INTRO SCREEN ─────────────────────────────────────────── */
(function initIntro() {
  const intro = document.getElementById('intro-screen');
  const main  = document.getElementById('main-content');
  if (!intro) return;

  // Auto-dismiss after loading bar finishes (~4.4s total)
  setTimeout(() => {
    intro.classList.add('hide');
    setTimeout(() => {
      intro.style.display = 'none';
      if (main) main.classList.add('visible');
    }, 800);
  }, 4400);

  // Click to skip
  intro.addEventListener('click', () => {
    intro.classList.add('hide');
    setTimeout(() => {
      intro.style.display = 'none';
      if (main) main.classList.add('visible');
    }, 800);
  });
})();

/* ─── PARTICLES ────────────────────────────────────────────── */
(function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const colors = ['#00f5ff', '#ff6b00', '#00ff88', '#ff0040'];

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = Math.random() * 14 + 8;

    p.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
(function initScrollReveal() {
  const items = document.querySelectorAll('.history-section, .game-card, .stat-item, .contact-info-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

/* ─── STATS COUNTER ─────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ─── NAVBAR ACTIVE LINK ────────────────────────────────────── */
(function initNavActive() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    const isActive =
      (href === 'index.html' && (path.endsWith('/') || path.endsWith('index.html'))) ||
      (href !== 'index.html' && path.endsWith(href));
    if (isActive) a.classList.add('active');
  });
})();

/* ─── CONTACT FORM ──────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('success-msg');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      shakeForm(form);
      showFormError('Будь ласка, заповніть усі поля.');
      return;
    }

    if (!emailRe.test(email)) {
      shakeForm(form);
      showFormError('Будь ласка, введіть коректну email-адресу.');
      return;
    }

    clearFormError();

    // Simulate sending
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Надсилаємо...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 1200);
  });

  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'formShake .4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  function showFormError(msg) {
    let err = form.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      err.style.cssText = 'color:#ff0040;font-size:.85rem;margin-bottom:16px;font-family:var(--font-mono);letter-spacing:.1em;';
      form.insertBefore(err, form.querySelector('.form-submit'));
    }
    err.textContent = '⚠ ' + msg;
  }

  function clearFormError() {
    const err = form.querySelector('.form-error');
    if (err) err.remove();
  }

  // Add shake keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes formShake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ─── CARD HOVER 3D TILT ────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.game-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── TYPING EFFECT FOR HERO SUBTITLE ──────────────────────── */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Твоя ігрова енциклопедія',
    'Історії культових ігор',
    'Поринь у світ геймінгу',
    'Знання про відеоігри'
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }

  setTimeout(type, 2000);
})();

/* ─── SMOOTH SCROLL ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
