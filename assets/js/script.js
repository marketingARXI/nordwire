// Forge One interaction layer: fixed header, responsive section navigation, and reveal-on-scroll.

const documentRoot = document.documentElement;
const body = document.body;
const main = document.querySelector('main');
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const homeSection = document.querySelector('#inicio');
const heroVideo = document.querySelector('.hero-background-video');
const heroCopy = document.querySelector('.hero-copy');
const revealGroups = Array.from(document.querySelectorAll('[data-reveal]'))
  .filter((group) => (
    !group.closest('#inicio')
    && !group.matches('.prototype-model-column')
  ));
const hotspotButtons = Array.from(document.querySelectorAll('[data-hotspot]'));
const demoForms = Array.from(document.querySelectorAll('[data-demo-form]'));
const placeholderLinks = Array.from(document.querySelectorAll('[data-placeholder-link]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const horizontalMedia = window.matchMedia('(min-width: 768px)');
const staticHeroMedia = window.matchMedia('(max-width: 1024px)');
const sections = Array.from(main?.querySelectorAll(':scope > section') ?? []);
const sectionByHash = new Map(sections.map((section) => [`#${section.id}`, section]));
const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'))
  .filter((link) => sectionByHash.has(link.getAttribute('href')));

let activeSectionIndex = 0;
let horizontalProgress;
let horizontalProgressButtons = [];
let wheelLocked = false;
let wheelLockTimer;
let horizontalScrollFrame;
let heroRevealTimer;

placeholderLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
  });
});

demoForms.forEach((form) => {
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = form.dataset.successMessage
      ?? 'Obrigado! A tua mensagem foi registada.';
    form.reset();
  });

  form.addEventListener('input', () => {
    status.textContent = '';
  });
});

const closeHotspots = ({ except, restoreFocus = false } = {}) => {
  hotspotButtons.forEach((button) => {
    if (button === except || !button.classList.contains('is-open')) {
      return;
    }

    button.classList.remove('is-open', 'tooltip-below');
    button.setAttribute('aria-expanded', 'false');
    button.querySelector('.product-hotspot-tooltip')
      ?.style.removeProperty('--tooltip-shift-x');

    if (restoreFocus) {
      button.focus();
    }
  });
};

const positionHotspotTooltip = (button) => {
  const tooltip = button.querySelector('.product-hotspot-tooltip');
  if (!tooltip) {
    return;
  }

  const viewportPadding = 12;
  const transitionBuffer = 8;
  const viewportWidth = document.documentElement.clientWidth;
  tooltip.style.setProperty('--tooltip-shift-x', '0px');
  button.classList.remove('tooltip-below');

  const buttonRect = button.getBoundingClientRect();
  const tooltipHeight = tooltip.getBoundingClientRect().height;
  if (buttonRect.top < tooltipHeight + viewportPadding + 12) {
    button.classList.add('tooltip-below');
  }

  const tooltipRect = tooltip.getBoundingClientRect();
  let shiftX = 0;

  if (tooltipRect.left < viewportPadding) {
    shiftX += viewportPadding - tooltipRect.left + transitionBuffer;
  }

  if (tooltipRect.right > viewportWidth - viewportPadding) {
    shiftX -= tooltipRect.right - (viewportWidth - viewportPadding)
      + transitionBuffer;
  }

  tooltip.style.setProperty('--tooltip-shift-x', `${shiftX}px`);
};

hotspotButtons.forEach((button) => {
  button.addEventListener('pointerenter', () => {
    positionHotspotTooltip(button);
  });

  button.addEventListener('focus', () => {
    positionHotspotTooltip(button);
  });

  button.addEventListener('click', () => {
    if (documentRoot.classList.contains('horizontal-ready')) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    const willOpen = !button.classList.contains('is-open');
    closeHotspots({ except: button });
    button.classList.toggle('is-open', willOpen);
    button.setAttribute('aria-expanded', String(willOpen));

    if (willOpen) {
      positionHotspotTooltip(button);
    } else {
      button.classList.remove('tooltip-below');
    }
  });
});

document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest?.('[data-hotspot]')) {
    closeHotspots();
  }
});

const revealHeroCopy = (reason) => {
  window.clearTimeout(heroRevealTimer);
  heroCopy?.classList.add('is-hero-visible');

  if (heroCopy) {
    heroCopy.dataset.revealReason = reason;
  }
};

const handleHeroRevealFallback = () => {
  const remainingSeconds = heroVideo
    ? heroVideo.duration - heroVideo.currentTime
    : 0;
  const videoIsProgressing = Boolean(
    heroVideo
    && !heroVideo.paused
    && heroVideo.currentTime > 0
    && Number.isFinite(remainingSeconds)
    && remainingSeconds > 0.15,
  );

  if (videoIsProgressing) {
    heroRevealTimer = window.setTimeout(
      () => revealHeroCopy('timeout-fallback'),
      (remainingSeconds * 1000) + 250,
    );
    return;
  }

  revealHeroCopy('timeout-fallback');
};

if (!heroCopy) {
  documentRoot.classList.remove('hero-reveal-pending');
} else if (reduceMotion) {
  revealHeroCopy('reduced-motion');
} else if (!heroVideo || staticHeroMedia.matches) {
  revealHeroCopy('static-background');
} else {
  heroVideo.addEventListener('ended', () => revealHeroCopy('video-ended'), {
    once: true,
  });

  heroRevealTimer = window.setTimeout(
    handleHeroRevealFallback,
    6000,
  );

  if (heroVideo.ended) {
    revealHeroCopy('video-already-ended');
  }
}

staticHeroMedia.addEventListener('change', (event) => {
  if (event.matches) {
    revealHeroCopy('static-background');
  }
});

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

const isHorizontalLayout = () => documentRoot.classList.contains('horizontal-ready');

const updateHeader = () => {
  if (!header || !homeSection) {
    return;
  }

  if (isHorizontalLayout()) {
    header.classList.toggle(
      'is-compact',
      activeSectionIndex > 0 || window.scrollY > 4,
    );
    horizontalProgress?.classList.toggle('is-hidden', window.scrollY > 4);
    return;
  }

  const heroBottom = homeSection.getBoundingClientRect().bottom;
  header.classList.toggle('is-compact', heroBottom <= header.offsetHeight);
};

const updateNavigationState = (index) => {
  activeSectionIndex = Math.max(0, Math.min(index, sections.length - 1));
  const currentId = sections[activeSectionIndex]?.id;

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('is-active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  horizontalProgressButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === activeSectionIndex;
    button.classList.toggle('is-active', active);
    if (active) {
      button.setAttribute('aria-current', 'step');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  body.classList.toggle(
    'footer-visible',
    isHorizontalLayout() && currentId === 'contactos',
  );

  updateHeader();
};

const getVerticalSectionIndex = () => {
  const headerOffset = header?.offsetHeight ?? 0;
  const scrollPoint = window.scrollY + headerOffset + window.innerHeight * 0.28;
  let currentIndex = 0;

  sections.forEach((section, index) => {
    if (section.offsetTop <= scrollPoint) {
      currentIndex = index;
    }
  });

  return currentIndex;
};

const getHorizontalSectionIndex = () => {
  if (!main?.clientWidth) {
    return 0;
  }

  return Math.round(main.scrollLeft / main.clientWidth);
};

const setActiveLink = () => {
  updateNavigationState(
    isHorizontalLayout()
      ? getHorizontalSectionIndex()
      : getVerticalSectionIndex(),
  );
};

const positionHorizontalSection = (index) => {
  if (!main) {
    return;
  }

  const previousBehavior = main.style.scrollBehavior;
  main.style.scrollBehavior = 'auto';
  main.scrollLeft = index * main.clientWidth;
  main.style.scrollBehavior = previousBehavior;
};

const navigateToSection = (index, { resetVertical = true } = {}) => {
  const target = sections[index];
  if (!target) {
    return;
  }

  const behavior = reduceMotion ? 'auto' : 'smooth';

  if (isHorizontalLayout() && main) {
    if (resetVertical) {
      target.scrollTo({ top: 0, behavior: 'auto' });
    }

    window.scrollTo({ top: 0, behavior });
    main.scrollTo({
      left: index * main.clientWidth,
      behavior,
    });
  } else {
    target.scrollIntoView({
      behavior,
      block: 'start',
    });
  }

  updateNavigationState(index);
  window.history.replaceState(null, '', `#${target.id}`);
};

sectionLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = sectionByHash.get(link.getAttribute('href'));
    const targetIndex = sections.indexOf(target);

    if (targetIndex < 0) {
      return;
    }

    event.preventDefault();
    closeNav();
    navigateToSection(targetIndex);
  });
});

const buildHorizontalProgress = () => {
  if (horizontalProgress || !sections.length) {
    return;
  }

  horizontalProgress = document.createElement('nav');
  horizontalProgress.className = 'horizontal-progress';
  horizontalProgress.setAttribute('aria-label', 'Posição nas secções');

  horizontalProgressButtons = sections.map((section, index) => {
    const matchingLink = navLinks.find(
      (link) => link.getAttribute('href') === `#${section.id}`,
    );
    const sectionLabel = section.dataset.navLabel
      ?? matchingLink?.textContent.trim()
      ?? section.id;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute(
      'aria-label',
      `Ir para ${sectionLabel}`,
    );
    button.dataset.label = sectionLabel;
    button.addEventListener('click', () => navigateToSection(index));
    horizontalProgress.append(button);
    return button;
  });

  body.append(horizontalProgress);
};

const handleHorizontalWheel = (event) => {
  if (
    !isHorizontalLayout()
    || event.ctrlKey
    || Math.abs(event.deltaX) > Math.abs(event.deltaY)
    || event.composedPath().some((node) => node?.localName === 'model-viewer')
  ) {
    return;
  }

  const direction = Math.sign(event.deltaY);
  if (!direction) {
    return;
  }

  const currentSection = sections[activeSectionIndex];
  if (!currentSection) {
    return;
  }

  const atTop = currentSection.scrollTop <= 1;
  const atBottom = (
    currentSection.scrollTop + currentSection.clientHeight
    >= currentSection.scrollHeight - 2
  );

  if ((direction > 0 && !atBottom) || (direction < 0 && !atTop)) {
    return;
  }

  const nextIndex = activeSectionIndex + direction;
  if (nextIndex < 0 || nextIndex >= sections.length) {
    return;
  }

  event.preventDefault();
  if (wheelLocked) {
    return;
  }

  wheelLocked = true;
  const targetSection = sections[nextIndex];
  targetSection.scrollTop = direction > 0
    ? 0
    : Math.max(0, targetSection.scrollHeight - targetSection.clientHeight);
  navigateToSection(nextIndex, { resetVertical: false });

  window.clearTimeout(wheelLockTimer);
  wheelLockTimer = window.setTimeout(
    releaseWheelLock,
    reduceMotion ? 80 : 2400,
  );
};

const handleHorizontalScroll = () => {
  if (horizontalScrollFrame) {
    return;
  }

  horizontalScrollFrame = window.requestAnimationFrame(() => {
    horizontalScrollFrame = undefined;
    setActiveLink();
  });
};

const releaseWheelLock = () => {
  wheelLocked = false;
  window.clearTimeout(wheelLockTimer);
};

const enableHorizontalLayout = () => {
  if (!main || isHorizontalLayout()) {
    return;
  }

  const currentIndex = getVerticalSectionIndex();
  buildHorizontalProgress();
  main.addEventListener('wheel', handleHorizontalWheel, {
    passive: false,
    capture: true,
  });
  main.addEventListener('scroll', handleHorizontalScroll, { passive: true });
  main.addEventListener('scrollend', releaseWheelLock);
  documentRoot.classList.add('horizontal-ready');
  window.scrollTo({ top: 0, behavior: 'auto' });
  positionHorizontalSection(currentIndex);
  updateNavigationState(currentIndex);
};

const disableHorizontalLayout = () => {
  if (!main || !isHorizontalLayout()) {
    return;
  }

  const currentIndex = getHorizontalSectionIndex();
  main.removeEventListener('wheel', handleHorizontalWheel, { capture: true });
  main.removeEventListener('scroll', handleHorizontalScroll);
  main.removeEventListener('scrollend', releaseWheelLock);
  documentRoot.classList.remove('horizontal-ready');
  body.classList.remove('footer-visible');
  main.scrollLeft = 0;
  releaseWheelLock();

  window.requestAnimationFrame(() => {
    sections[currentIndex]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    updateNavigationState(currentIndex);
  });
};

const syncHorizontalLayout = () => {
  if (horizontalMedia.matches) {
    enableHorizontalLayout();
  } else {
    disableHorizontalLayout();
  }
};

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeHotspots({ restoreFocus: true });

    if (body.classList.contains('nav-open')) {
      closeNav({ restoreFocus: true });
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && body.classList.contains('nav-open')) {
    closeNav();
  }

  if (isHorizontalLayout()) {
    window.requestAnimationFrame(() => {
      positionHorizontalSection(activeSectionIndex);
    });
  }

  hotspotButtons
    .filter((button) => button.classList.contains('is-open'))
    .forEach(positionHotspotTooltip);
});

window.addEventListener('scroll', () => {
  updateHeader();
  if (!isHorizontalLayout()) {
    setActiveLink();
  }
}, { passive: true });

horizontalMedia.addEventListener('change', syncHorizontalLayout);
buildHorizontalProgress();
syncHorizontalLayout();
updateHeader();
setActiveLink();

const revealTargetSelector = [
  '.eyebrow',
  'h1',
  'h2',
  '.hero-subtitle',
  '.section-copy > p',
  '.hero-actions',
  '.feature-item',
  '.value-highlight',
  '.product-actions',
  '.prototype-model-column',
  '.copy-actions',
  '.stat-block',
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
      `${Math.min(targetIndex, 7) * 110}ms`,
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

const prototypeModel = document.querySelector('#prototype-model');

if (prototypeModel) {
  customElements.whenDefined('model-viewer').then(() => {
    const idleDelay = 3500;
    const repeatDelay = 1400;
    let idleTimer;
    let modelReady = false;
    let userInteracting = false;
    let oscillating = false;

    const localizeModelControls = () => {
      const shadowRoot = prototypeModel.shadowRoot;
      if (!shadowRoot) {
        return;
      }

      shadowRoot.querySelectorAll('[aria-label]').forEach((element) => {
        const label = element.getAttribute('aria-label') || '';

        if (label.includes('Use mouse, touch or arrow keys to move.')) {
          element.setAttribute('aria-label', 'Modelo 3D interativo do dispositivo protótipo da NordWire. Rode o modelo com o rato, toque ou teclas de seta.');
        } else if (label === 'View in your space') {
          element.setAttribute('aria-label', 'Ver no seu espaço');
        } else if (label === 'Exit AR') {
          element.setAttribute('aria-label', 'Sair da realidade aumentada');
        } else if (label === 'Live announcements') {
          element.setAttribute('aria-label', 'Avisos em direto');
        }
      });
    };

    localizeModelControls();
    const modelLocalizationObserver = new MutationObserver(localizeModelControls);
    if (prototypeModel.shadowRoot) {
      modelLocalizationObserver.observe(prototypeModel.shadowRoot, {
        attributes: true,
        attributeFilter: ['aria-label'],
        childList: true,
        subtree: true,
      });
    }

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
      localizeModelControls();
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
