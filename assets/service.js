/* bilal builds. · shared behaviour for the service pages: menu, nav theme, scroll line, pointer dot, magnetic buttons */
(() => {
  'use strict';
  const html = document.documentElement;
  const reduce = html.classList.contains('reduce');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const css = (el, k, v) => el.style.setProperty(k, v);
  html.classList.add('sjs');

  /* after the first paint, the sections below the first screen are shown one per frame (see service.css);
     a link straight to a section (#contact) shows them all at once, so it lands where it should */
  const later = $$('main > section:not(.s-hero), .foot');
  const showNext = () => { const s = later.shift(); if (s) { s.classList.add('shown'); requestAnimationFrame(() => setTimeout(showNext)); } };
  if (location.hash) html.classList.add('cv-off');

  /* menu */
  const nav = $('#nav'), menuBtn = $('#menuBtn'), sheet = $('#sheet');
  const setMenu = open => {
    html.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
    /* while the sheet covers the page, Tab and screen readers stay in the nav and the sheet */
    $$('main, footer, .skip').forEach(el => { el.inert = open; });
  };
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
    $$('a', sheet).forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !html.classList.contains('menu-open')) return;
      const inSheet = sheet.contains(document.activeElement);
      setMenu(false);
      if (inSheet) menuBtn.focus();
    });
    matchMedia('(min-width: 861px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  /* nav turns to night over dark sections; a thin line shows how far down the page you are */
  /* demos tip up into place as they scroll in (all reads first, then the writes) */
  const dark = $$('[data-dark]');
  const tilts = reduce ? [] : $$('[data-tilt]');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = 34, h = innerHeight;
    const isDark = dark.some(el => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const rv = tilts.map(el => Math.min(1, Math.max(0, (h - el.getBoundingClientRect().top) / (h * 0.55))));
    const max = document.documentElement.scrollHeight - h;
    nav.classList.toggle('dark', isDark);
    css(nav, '--sp', (max > 0 ? scrollY / max : 0).toFixed(4));
    tilts.forEach((el, i) => css(el, '--rv', rv[i].toFixed(3)));
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  /* the first read waits until the browser has laid the page out by itself (just before it paints);
     reading layout any earlier forces an extra full layout while the page is still loading */
  if ('ResizeObserver' in window) {
    const first = new ResizeObserver(() => { first.disconnect(); onScroll(); requestAnimationFrame(() => setTimeout(showNext)); });
    first.observe(html);
  } else { onScroll(); showNext(); }

  /* cards and closing headings rise once, the first time they come into view */
  const rises = $$('[data-rise], .rise');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    rises.forEach(el => io.observe(el));
  } else rises.forEach(el => el.classList.add('in'));

  /* the dot follows the pointer */
  if (fine && !reduce) {
    const c = document.createElement('div');
    c.className = 'cursor';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    let x = -60, y = -60, cx = -60, cy = -60, raf = 0, shown = false;
    const loop = () => {
      cx += (x - cx) * 0.24; cy += (y - cy) * 0.24;
      css(c, '--cx', cx.toFixed(1) + 'px'); css(c, '--cy', cy.toFixed(1) + 'px');
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; cx = x; cy = y; c.classList.add('on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    html.addEventListener('mouseleave', () => { shown = false; c.classList.remove('on'); });
    addEventListener('pointerover', e => c.classList.toggle('big', !!(e.target.closest && e.target.closest('a, button, summary, input, select, label'))));
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        css(el, '--mx', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px');
        css(el, '--my', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', () => { css(el, '--mx', '0px'); css(el, '--my', '0px'); });
    });
  }
})();
