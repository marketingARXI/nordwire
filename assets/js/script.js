// Forge One interaction layer: sticky header, mobile navigation, active section state, and reveal-on-scroll.

const body = document.body;
const header = document.querySelector('.site-header');
const headerBrand = document.querySelector('.header-brand');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const homeSection = document.querySelector('#home');
const revealGroups = Array.from(document.querySelectorAll('[data-reveal]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const closeNav = ({ restoreFocus = false } = {}) => {
  body.classList.remove('nav-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu de navegação');

  if (restoreFocus) {
    menuToggle?.focus();
  }
};

menuToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute(
    'aria-label',
    open ? 'Fechar menu de navegação' : 'Abrir menu de navegação',
  );
});

const headerLinks = [headerBrand, ...navLinks].filter(Boolean);

headerLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetSelector = link.getAttribute('href');
    const target = targetSelector ? document.querySelector(targetSelector) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    closeNav();
    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    window.history.replaceState(null, '', targetSelector);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && body.classList.contains('nav-open')) {
    closeNav({ restoreFocus: true });
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && body.classList.contains('nav-open')) {
    closeNav();
  }
});

const updateHeader = () => {
  if (!header || !homeSection) {
    return;
  }

  const heroBottom = homeSection.getBoundingClientRect().bottom;
  header.classList.toggle('is-compact', heroBottom <= header.offsetHeight);
};

const setActiveLink = () => {
  const headerOffset = header?.offsetHeight ?? 0;
  const scrollPoint = window.scrollY + headerOffset + window.innerHeight * 0.28;

  let currentId = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= scrollPoint) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('is-active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

updateHeader();
setActiveLink();

window.addEventListener('scroll', () => {
  updateHeader();
  setActiveLink();
}, { passive: true });

const revealTargetSelector = [
  '.eyebrow',
  'h1',
  'h2',
  '.section-copy > p',
  '.promo-copy > p',
  '.hero-actions',
  '.feature-item',
  '.prototype-model-column',
  '.copy-actions',
  '.stat-block',
  '.promo-copy > .button',
  '.promo-visual',
].join(',');

const revealCounts = new WeakMap();
const revealTargets = revealGroups.flatMap((group) => {
  const nestedTargets = Array.from(group.querySelectorAll(revealTargetSelector));
  const targets = nestedTargets.length ? nestedTargets : [group];
  const section = group.closest('section') ?? group;
  let targetIndex = revealCounts.get(section) ?? 0;

  targets.forEach((target) => {
    target.classList.add('reveal-item');
    target.style.setProperty(
      '--reveal-delay',
      `${Math.min(targetIndex, 7) * 65}ms`,
    );
    targetIndex += 1;
  });

  revealCounts.set(section, targetIndex);
  return targets;
});

if (
  !reduceMotion
  && 'IntersectionObserver' in window
  && revealTargets.length
) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  });

  revealTargets.forEach((target) => revealObserver.observe(target));
  document.documentElement.classList.add('reveal-enabled');
}

const rotatingWord = document.querySelector('[data-rotating-word]');
const rotatingSequence = ['onde', 'quando', 'como', 'onde', 'quando', 'como', 'onde'];

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

const prototypeModel = document.querySelector('#prototype-model');

if (prototypeModel) {
  customElements.whenDefined('model-viewer').then(() => {
    const idleDelay = 3500;
    const repeatDelay = 1400;
    let idleTimer;
    let modelReady = false;
    let userInteracting = false;
    let oscillating = false;

    const clearIdleTimer = () => {
      window.clearTimeout(idleTimer);
    };

    const cancelOscillation = () => {
      if (!oscillating || !modelReady) {
        return;
      }

      oscillating = false;
      prototypeModel.classList.remove('is-oscillating');
      const orbit = prototypeModel.getCameraOrbit();
      prototypeModel.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius}m`;
    };

    const playOscillation = () => {
      if (
        reduceMotion ||
        !modelReady ||
        userInteracting ||
        !prototypeModel.modelIsVisible
      ) {
        return;
      }

      oscillating = true;
      prototypeModel.classList.add('is-oscillating');
      prototypeModel.interact(2200, {
        x: {
          initialValue: 0.5,
          keyframes: [
            { frames: 1, value: 0.485 },
            { frames: 2, value: 0.515 },
            { frames: 1, value: 0.5 },
          ],
        },
        y: {
          initialValue: 0.5,
          keyframes: [{ frames: 1, value: 0.5 }],
        },
      });
    };

    const queueOscillation = (delay = idleDelay) => {
      clearIdleTimer();

      if (reduceMotion || userInteracting || !modelReady) {
        return;
      }

      idleTimer = window.setTimeout(playOscillation, delay);
    };

    const beginInteraction = () => {
      userInteracting = true;
      prototypeModel.classList.add('is-interacting');
      clearIdleTimer();
      cancelOscillation();
    };

    const endInteraction = () => {
      userInteracting = false;
      prototypeModel.classList.remove('is-interacting');
      queueOscillation();
    };

    prototypeModel.addEventListener('load', () => {
      modelReady = true;
      prototypeModel.classList.add('is-ready');
      queueOscillation();
    });

    prototypeModel.addEventListener('pointerdown', beginInteraction);
    prototypeModel.addEventListener('pointerup', endInteraction);
    prototypeModel.addEventListener('pointercancel', endInteraction);
    prototypeModel.addEventListener('keydown', beginInteraction);
    prototypeModel.addEventListener('keyup', endInteraction);
    prototypeModel.addEventListener('wheel', () => {
      beginInteraction();
      endInteraction();
    }, { passive: true });

    prototypeModel.addEventListener('camera-change', (event) => {
      if (event.detail.source === 'user-interaction') {
        userInteracting = false;
        oscillating = false;
        prototypeModel.classList.remove('is-interacting', 'is-oscillating');
        queueOscillation();
      }
    });

    prototypeModel.addEventListener('interact-stopped', (event) => {
      oscillating = false;
      prototypeModel.classList.remove('is-oscillating');

      if (event.detail.source === 'automatic' && !userInteracting) {
        queueOscillation(repeatDelay);
      }
    });

    prototypeModel.addEventListener('model-visibility', (event) => {
      if (event.detail.visible) {
        queueOscillation();
      } else {
        clearIdleTimer();
        cancelOscillation();
      }
    });
  });
}
