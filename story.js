/* ================================================
   STORY PAGE — story.js
================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR scroll effect ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── HAMBURGER ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  /* ── AOS (scroll reveal) ── */
  const aosEls = document.querySelectorAll('[data-aos]');
  const aosObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-in');
        aosObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  aosEls.forEach(el => aosObs.observe(el));

  /* ── TOC active on scroll ── */
  const sections  = document.querySelectorAll('.story-section[id]');
  const tocLinks  = document.querySelectorAll('.toc-link');

  const tocObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => tocObs.observe(s));

  /* ── Smooth scroll for TOC & breadcrumb links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Reading progress bar ── */
  const bar = document.createElement('div');
  bar.id = 'read-progress';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0;
    background: linear-gradient(90deg, #1a6cf6, #4a90f8);
    z-index: 2000; transition: width .1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const doc    = document.documentElement;
    const total  = doc.scrollHeight - doc.clientHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  });

});
