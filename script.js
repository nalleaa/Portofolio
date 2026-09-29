// Nalasyifa A. — interactive portfolio logic (vanilla JS, modular)
(function(){
"use strict";
/* 1. Typing effect — 5 roles */
var roles = ["Software Engineering Student","SIC Stage 3 (AI & IoT) Alumni","Android UI & Front-End Developer","Creative Designer & Marketing TEFA","Public Speaker & Event Host (MC)"];
var prefix = "11th-Grade ";
var typedEl = document.getElementById('typed');
var ri = 0, ci = 0, deleting = false, firstShown = false;
function tick(){
  if(!typedEl) return;
  var word = roles[ri];
  var shown = word.slice(0, ci);
  typedEl.textContent = (ri === 0 && !firstShown ? prefix : "") + shown;
  if(ri === 0 && !deleting && ci >= word.length) firstShown = true;
  var speed = deleting ? 30 : 60;
  if(!deleting && ci === word.length){ speed = 1700; deleting = true; }
  else if(deleting && ci === 0){ deleting = false; ri = (ri + 1) % roles.length; speed = 350; }
  else { ci += deleting ? -1 : 1; }
  setTimeout(tick, speed);
}
if(typedEl) tick();

/* 2. Cursor spotlight */
var spot = document.getElementById('spotlight');
var sx = -9999, sy = -9999, tx = -9999, ty = -9999;
window.addEventListener('pointermove', function(e){ tx = e.clientX; ty = e.clientY; }, { passive: true });
(function glow(){
  sx += (tx - sx) * 0.12; sy += (ty - sy) * 0.12;
  if(spot) spot.style.transform = 'translate(' + sx + 'px,' + sy + 'px)';
  requestAnimationFrame(glow);
})();

/* 3. 3D tilt */
function tilt(el, max){
  var m = max || 10;
  el.addEventListener('pointermove', function(e){
    var r = el.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - 0.5;
    var py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = 'perspective(900px) rotateY(' + (px * m) + 'deg) rotateX(' + (-py * m) + 'deg) translateY(-4px)';
  });
  el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
}
document.querySelectorAll('.tilt').forEach(function(el){ tilt(el, el.id === 'avatar-tilt' ? 12 : 8); });

/* 4. Skills filter */
var btns = document.querySelectorAll('.filter-btn');
var cards = document.querySelectorAll('#skills-grid .skill-card');
btns.forEach(function(b){
  b.addEventListener('click', function(){
    btns.forEach(function(x){ x.classList.remove('active'); x.setAttribute('aria-selected','false'); });
    b.classList.add('active'); b.setAttribute('aria-selected','true');
    var f = b.getAttribute('data-filter');
    cards.forEach(function(c){
      var show = (f === 'all' || c.getAttribute('data-cat') === f);
      c.classList.toggle('hide', !show);
    });
  });
});

/* Menu, sticky nav, scrollspy, to-top */
var menuBtn = document.getElementById('menu-btn'), mobileMenu = document.getElementById('mobile-menu');
var iconOpen = document.getElementById('icon-open'), iconClose = document.getElementById('icon-close');
function setMenu(o){
  if(!mobileMenu) return;
  mobileMenu.classList.toggle('open', o);
  if(iconOpen) iconOpen.classList.toggle('hidden', o);
  if(iconClose) iconClose.classList.toggle('hidden', !o);
  if(menuBtn) menuBtn.setAttribute('aria-expanded', String(o));
}
if(menuBtn) menuBtn.addEventListener('click', function(){ setMenu(!mobileMenu.classList.contains('open')); });
document.querySelectorAll('.m-link').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
var navbar = document.getElementById('navbar'), toTop = document.getElementById('to-top');
function onScroll(){
  var y = window.scrollY || 0;
  if(navbar) navbar.classList.toggle('scrolled', y > 24);
  if(toTop) toTop.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
if(toTop) toTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
var io = new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
var navLinks = document.querySelectorAll('.nav-link');
var spy = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(e.isIntersecting) navLinks.forEach(function(l){ l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
['hero','about','skills','contact'].forEach(function(id){ var s = document.getElementById(id); if(s) spy.observe(s); });

/* Copy email + toast 3s */
var copyBtn = document.getElementById('copy-email'), toast = document.getElementById('toast'), tT = null;
function showToast(){
  if(!toast) return;
  toast.classList.add('show');
  if(tT) clearTimeout(tT);
  tT = setTimeout(function(){ toast.classList.remove('show'); }, 3000);
}
if(copyBtn) copyBtn.addEventListener('click', function(){
  var email = copyBtn.getAttribute('data-email') || 'ininallea@gmail.com';
  function done(){ copyBtn.textContent = '✓ Tersalin!'; showToast(); setTimeout(function(){ copyBtn.textContent = '⧉ Salin Email'; }, 3000); }
  function fb(){
    var ta = document.createElement('textarea'); ta.value = email;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch(e){ showToast(); }
    document.body.removeChild(ta);
  }
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done).catch(fb);
  else fb();
});
var form = document.getElementById('contact-form');
if(form) form.addEventListener('submit', function(){ var n = document.getElementById('form-note'); if(n) n.classList.remove('hidden'); });
})();
