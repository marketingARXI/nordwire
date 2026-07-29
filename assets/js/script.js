// Forge One interaction layer: sticky header, mobile navigation, active section state, and reveal-on-scroll.

const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const revealItems = document.querySelectorAll('[data-reveal]');
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const closeNav = () => {
  body.classList.remove('nav-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
};

menuToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => closeNav());
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav();
  }
});

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

const setActiveLink = () => {
  const scrollPoint = window.scrollY + window.innerHeight * 0.32;

  let currentId = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= scrollPoint) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('is-active', active);
  });
};

updateHeader();
setActiveLink();

window.addEventListener('scroll', () => {
  updateHeader();
  setActiveLink();
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

const rotatingWord = document.querySelector('[data-rotating-word]');
const rotatingSequence = ['onde', 'quando', 'como', 'onde', 'quando', 'como', 'onde'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (rotatingWord && !reduceMotion) {
  let wordIndex = 0;

  const rotationTimer = window.setInterval(() => {
    rotatingWord.classList.add('is-fading');

    window.setTimeout(() => {
      wordIndex += 1;
      rotatingWord.textContent = rotatingSequence[wordIndex];
      rotatingWord.classList.remove('is-fading');

      if (wordIndex === rotatingSequence.length - 1) {
        window.clearInterval(rotationTimer);
      }
    }, 320);
  }, 2000);
}

if (nav) {
  nav.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('a')) {
      closeNav();
    }
  });
}
