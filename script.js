// ============================================================
// INIT – no lucide dependency needed (all icons are inline SVG)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initActiveNav();
  initAOS();
  initSkillBars();
  initSlider();
  initModal();
  initContactForm();
  initSmoothScroll();
});

// ============================================================
// NAVBAR scroll effect
// ============================================================
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ============================================================
// HAMBURGER
// ============================================================
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('open');
      links.classList.remove('open');
    }
  });
}

// ============================================================
// ACTIVE NAV on scroll
// ============================================================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-66px 0px 0px 0px' });

  sections.forEach(s => obs.observe(s));
}

// ============================================================
// AOS – scroll reveal
// ============================================================
function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay) || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
          obs.unobserve(entry.target);
        }, delay);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => obs.observe(el));
}

// ============================================================
// SKILL BARS
// ============================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.sk-bar');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.sk-fill');
        const pct  = entry.target.dataset.pct || 0;
        setTimeout(() => { fill.style.width = pct + '%'; }, 160);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  bars.forEach(b => obs.observe(b));
}

// ============================================================
// SLIDER
// ============================================================
function initSlider() {
  const track    = document.getElementById('sliderTrack');
  const viewport = document.getElementById('sliderViewport');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.proj-card'));
  let current = 0;
  let auto    = null;

  function getVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function totalSlides() {
    return Math.max(1, Math.ceil(cards.length / getVisible()));
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const d = document.createElement('button');
      d.className = 'dot-btn' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.dot-btn').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function cardWidth() {
    if (!cards[0]) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 22;
    return cards[0].offsetWidth + gap;
  }

  function goTo(index) {
    const slides = totalSlides();
    current = Math.max(0, Math.min(index, slides - 1));
    track.style.transform = `translateX(-${current * getVisible() * cardWidth()}px)`;
    updateDots();
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= slides - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch swipe
  let startX = 0;
  if (viewport) {
    viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 45) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });
    viewport.addEventListener('mouseenter', () => clearInterval(auto));
    viewport.addEventListener('mouseleave', startAutoPlay);
  }

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  function startAutoPlay() {
    clearInterval(auto);
    auto = setInterval(() => {
      goTo(current + 1 < totalSlides() ? current + 1 : 0);
    }, 5000);
  }

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { current = 0; buildDots(); goTo(0); }, 150);
  });

  buildDots();
  goTo(0);
  startAutoPlay();
}

// ============================================================
// MODAL
// ============================================================
function initModal() {
  const modal    = document.getElementById('allProjectsModal');
  const openBtn  = document.getElementById('viewAllBtn');
  const closeBtn = document.getElementById('modalClose');
  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const btn = document.getElementById('sendBtn');
  const fb  = document.getElementById('formFeedback');
  if (!btn || !fb) return;

  btn.addEventListener('click', () => {
    const name  = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const msg   = document.getElementById('formMsg').value.trim();

    fb.style.color = '#f87171';
    if (!name)  { fb.textContent = 'Please enter your name.'; return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fb.textContent = 'Please enter a valid email.'; return; }
    if (!msg)   { fb.textContent = 'Please enter a message.'; return; }

    const subject    = encodeURIComponent('Portfolio Contact from ' + name);
    const body       = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + msg);
    const mailtoLink = 'mailto:tapidham@gmail.com?subject=' + subject + '&body=' + body;

    const a = document.createElement('a');
    a.href = mailtoLink;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    fb.style.color = '#4ade80';
    fb.textContent = '✓ Membuka aplikasi email untuk mengirim pesan!';
    document.getElementById('formName').value  = '';
    document.getElementById('formEmail').value = '';
    document.getElementById('formMsg').value   = '';
    setTimeout(() => { fb.textContent = ''; }, 6000);
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 66;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
