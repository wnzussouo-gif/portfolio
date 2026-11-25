/* ═══════════════════════════════════════════
   N'SPACE DEZIGN — Portfolio JS
═══════════════════════════════════════════ */

/* ─── CUSTOM CURSOR ─── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .gallery-item, .service-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
    follower.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
    follower.classList.remove('hovered');
  });
});

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── MOBILE MENU ─── */
const menuBtn   = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // révèle le bloc avec sa transition CSS
      const item = e.target.closest('.stat-item');
      if (item) item.classList.add('stat-visible');
      // lance le compteur après un léger délai (laisse l'animation d'entrée démarrer)
      setTimeout(() => animateCounter(e.target), 200);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

/* ─── FILTER GALLERY ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;

    galleryItems.forEach((item, i) => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.classList.remove('hidden');
        item.style.transitionDelay = (i * 0.03) + 's';
      } else {
        item.classList.add('hidden');
        item.style.transitionDelay = '0s';
      }
    });
  });
});

/* ─── LIGHTBOX ─── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCat     = document.getElementById('lbCat');
const lbTitle   = document.getElementById('lbTitle');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

let currentIndex = 0;
let visibleItems  = [];

function getVisibleItems() {
  return [...galleryItems].filter(item => !item.classList.contains('hidden'));
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const item   = visibleItems[currentIndex];
  const img    = item.querySelector('img');
  const cat    = item.querySelector('.item-cat');
  const title  = item.querySelector('h3');

  lbImg.src   = img.src;
  lbImg.alt   = img.alt;
  lbCat.textContent   = cat  ? cat.textContent   : '';
  lbTitle.textContent = title ? title.textContent : '';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function prevItem() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

function nextItem() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  updateLightbox();
}

document.querySelectorAll('.item-zoom').forEach((btn, i) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const item = btn.closest('.gallery-item');
    const visible = getVisibleItems();
    const idx = visible.indexOf(item);
    if (idx !== -1) openLightbox(idx);
  });
});

document.querySelectorAll('.gallery-item__inner').forEach((inner) => {
  inner.addEventListener('click', () => {
    const item = inner.closest('.gallery-item');
    const visible = getVisibleItems();
    const idx = visible.indexOf(item);
    if (idx !== -1) openLightbox(idx);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevItem);
lbNext.addEventListener('click', nextItem);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   prevItem();
  if (e.key === 'ArrowRight')  nextItem();
});

/* ─── SWIPE SUPPORT (mobile) ─── */
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? nextItem() : prevItem();
});

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.05) + 's';
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.about__text, .about__visual, .service-card, .stat-item, .contact__text, .contact__form, .work__header'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* Gallery items reveal */
const galleryRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 60);
      galleryRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

galleryItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  galleryRevealObserver.observe(item);
});

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = 'Message envoyé ✓';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
    form.reset();
  }, 3000);
});

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'white' : '';
  });
}, { passive: true });

/* ─── SMOOTH PARALLAX HERO ─── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((blob, i) => {
    const speed = 0.1 + i * 0.05;
    blob.style.transform = `translateY(${scrolled * speed}px)`;
  });
}, { passive: true });

console.log('%cDeffo Audrey 🎨', 'font-size:24px; font-weight:bold; color:#a855f7;');
console.log('%cPortfolio by Kiro AI', 'color:#9999b3;');
