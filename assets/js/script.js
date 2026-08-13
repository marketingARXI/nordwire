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
const languageButtons = Array.from(document.querySelectorAll('[data-language]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const horizontalMedia = window.matchMedia('(min-width: 768px)');
const staticHeroMedia = window.matchMedia('(max-width: 1024px)');
const sections = Array.from(main?.querySelectorAll(':scope > section') ?? []);
const countUpNumbers = Array.from(document.querySelectorAll('[data-count-up]'));
const sectionByHash = new Map(sections.map((section) => [`#${section.id}`, section]));
const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'))
  .filter((link) => sectionByHash.has(link.getAttribute('href')));

let activeSectionIndex = 0;
let horizontalProgress;
let horizontalProgressButtons = [];
let wheelLocked = false;
let wheelLockTimer;
let horizontalScrollFrame;
let horizontalAnimationFrame;
let horizontalAnimationTargetIndex;
let heroRevealTimer;
let refreshModelLocalization = () => {};

const languageStorageKey = 'nordwire-language';
const translations = {
  pt: {
    'meta.title': 'NordWire - Sistemas eletrónicos para a indústria',
    'meta.description': 'A NordWire desenvolve sistemas eletrónicos, monitorização industrial e soluções à medida para o chão de fábrica.',
    'language.groupLabel': 'Seleção de idioma',
    'language.ptLabel': 'Usar Português',
    'language.enLabel': 'Usar Inglês',
    'header.homeLabel': 'NordWire - ir para o início',
    'header.navLabel': 'Navegação principal',
    'header.openMenu': 'Abrir menu de navegação',
    'header.closeMenu': 'Fechar menu de navegação',
    'nav.home': 'Início',
    'nav.whatWeDo': 'O que fazemos',
    'nav.monitoring': 'Monitorização',
    'nav.cloud': 'Nuvem',
    'nav.nordgo': 'NordGo',
    'nav.prototyping': 'Prototipagem',
    'nav.products': 'Produtos',
    'nav.partners': 'Parceiros',
    'nav.contact': 'Contactos',
    'progress.label': 'Posição nas secções',
    'progress.goTo': 'Ir para {section}',
    'hero.title': 'Tudo começa no chão de fábrica.',
    'hero.subtitle': 'A NordWire desenvolve sistemas eletrónicos que capturam tudo o que acontece na tua produção - e transformam cada segundo em informação útil.',
    'cta.explore': 'Explorar Mais',
    'cta.partner': 'Tornar-me Parceiro',
    'whatWeDo.eyebrow': 'O que fazemos',
    'whatWeDo.title': 'Cada máquina tem uma história para contar.',
    'whatWeDo.subtitle': ['Todos os dias, o teu chão de fábrica gera milhares de dados.', 'A questão não é se eles existem, é se estás a aproveitá-los.'],
    'whatWeDo.cardsLabel': 'Destaques do que fazemos',
    'whatWeDo.card1Title': 'Tempo real',
    'whatWeDo.card1Text': 'Dados capturados no momento em que acontecem.',
    'whatWeDo.card2Title': 'Acesso remoto',
    'whatWeDo.card2Text': 'A tua produção acessível onde quer que estejas.',
    'whatWeDo.card3Title': 'À tua medida',
    'whatWeDo.card3Text': 'Cada solução desenhada para o teu chão de fábrica.',
    'monitoring.eyebrow': 'Monitorização',
    'monitoring.title': ['Os sensores captam.', 'Nada se perde.'],
    'monitoring.subtitle': 'Sensores desenvolvidos por nós registam a atividade de cada máquina em tempo real. E o acesso à informação é simples e imediato, diretamente junto de cada equipamento.',
    'monitoring.statsLabel': 'Estatísticas de monitorização',
    'monitoring.stat1': ['Disponibilidade', 'das máquinas', 'monitorizadas'],
    'monitoring.stat2': 'Dispositivos visíveis nos painéis em tempo real',
    'monitoring.stat3': 'Tempo médio de resposta',
    'cloud.eyebrow': 'Nuvem',
    'cloud.title': ['Do chão de fábrica', 'até onde tu estiveres.'],
    'cloud.subtitle': 'A informação sobe do sensor para a nuvem em segundos, ficando acessível a partir de qualquer PC ou telemóvel. O que acontece na produção deixa de ficar preso na produção.',
    'nordgo.eyebrow': 'NordGo',
    'nordgo.title': 'NordGo - a tua fábrica no bolso.',
    'nordgo.subtitle': 'Acompanha tudo em tempo real, consulta o histórico e recebe o que interessa, onde quer que estejas. A tua produção, sempre à distância de um toque.',
    'nordgo.cardsLabel': 'Funcionalidades da NordGo',
    'nordgo.card1Title': 'Tempo real',
    'nordgo.card1Text': 'Acompanha a produção ao minuto, onde quer que estejas.',
    'nordgo.card2Title': 'Histórico',
    'nordgo.card2Text': 'Consulta o que aconteceu e compara períodos.',
    'nordgo.card3Title': 'Notificações',
    'nordgo.card3Text': 'Recebe alertas do que realmente importa.',
    'prototyping.eyebrow': 'Prototipagem',
    'prototyping.title': ['Do conceito', 'ao produto final.'],
    'prototyping.subtitle': 'Cada solução é desenhada de raiz para o teu chão de fábrica - do circuito à caixa. Hardware e software pensados para o teu caso, e não para um caso qualquer.',
    'prototyping.cardsLabel': 'Etapas da prototipagem',
    'prototyping.card1Title': 'Hardware',
    'prototyping.card1Text': 'Do circuito à caixa, desenhado de raiz.',
    'prototyping.card2Title': 'Software',
    'prototyping.card2Text': 'Firmware e interface pensados para o teu caso.',
    'prototyping.card3Title': 'Produção',
    'prototyping.card3Text': 'Do protótipo ao produto final, connosco.',
    'prototyping.modelAlt': 'Modelo 3D interativo do dispositivo protótipo da NordWire.',
    'prototyping.modelLabel': 'Modelo 3D interativo do dispositivo protótipo da NordWire. Rode o modelo com o rato, toque ou teclas de seta.',
    'prototyping.viewSpace': 'Ver no seu espaço',
    'prototyping.exitAr': 'Sair da realidade aumentada',
    'prototyping.liveAnnouncements': 'Avisos em direto',
    'products.eyebrow': 'Produtos',
    'products.title': 'Os nossos produtos.',
    'products.subtitle': 'Hardware desenhado à medida da produção real. Explora as soluções que já desenvolvemos.',
    'products.storeButton': 'Ver Loja',
    'products.hotspotsLabel': 'Detalhes interativos da placa NordCore',
    'products.imageAlt': 'Placa eletrónica NordCore vista de cima.',
    'products.processingTitle': 'Módulo de processamento',
    'products.processingText': 'O cérebro do sistema - processa os dados recolhidos no chão de fábrica em tempo real.',
    'products.networkTitle': 'Ligação à rede',
    'products.networkText': 'Ligação de rede estável para comunicar com a infraestrutura da fábrica.',
    'products.powerTitle': 'Alimentação e configuração',
    'products.powerText': 'Alimentação e configuração simples, prontas a integrar em qualquer ambiente.',
    'products.memoryTitle': 'Memória de segurança',
    'products.memoryText': 'Mantém as definições e o registo temporal seguros, mesmo sem energia.',
    'products.expansionTitle': 'Expansão',
    'products.expansionText': 'Preparado para expansão e armazenamento adicional, à medida das necessidades.',
    'products.coolingTitle': 'Arrefecimento',
    'products.coolingText': 'Arrefecimento ativo para um funcionamento fiável e contínuo.',
    'partners.title': 'Crescemos com quem trabalha connosco.',
    'partners.subtitle': 'Nós desenvolvemos a tecnologia. Os nossos parceiros levam-na às fábricas de todo o lado. Juntos, transformamos dados em decisões.',
    'partners.formLabel': 'Formulário de parceria',
    'partners.submit': 'Quero ser parceiro',
    'partners.success': 'Obrigado! Entraremos em contacto para falar sobre a parceria.',
    'contact.eyebrow': 'Contactos',
    'contact.title': 'Vamos levar os teus dados mais longe.',
    'contact.subtitle': 'Conta-nos o que se passa no teu chão de fábrica. Nós tratamos do resto.',
    'contact.formLabel': 'Formulário de contacto',
    'contact.submit': 'Enviar',
    'contact.success': 'Mensagem registada. Obrigado pelo teu contacto!',
    'form.name': 'Nome',
    'form.company': 'Empresa',
    'form.email': 'Email',
    'form.message': 'Mensagem',
    'footer.heading': 'VAMOS CRIAR ALGO',
    'footer.homeLabel': 'Página inicial da NordWire',
    'footer.navLabel': 'Navegação do rodapé',
    'footer.socialLabel': 'Redes sociais',
    'footer.copyright': '2026 NordWire. Todos os direitos reservados.',
  },
  en: {
    'meta.title': 'NordWire - Electronic systems for industry',
    'meta.description': 'NordWire develops electronic systems, industrial monitoring and tailored solutions for the factory floor.',
    'language.groupLabel': 'Language selection',
    'language.ptLabel': 'Use Portuguese',
    'language.enLabel': 'Use English',
    'header.homeLabel': 'NordWire - go to home',
    'header.navLabel': 'Main navigation',
    'header.openMenu': 'Open navigation menu',
    'header.closeMenu': 'Close navigation menu',
    'nav.home': 'Home',
    'nav.whatWeDo': 'What we do',
    'nav.monitoring': 'Monitoring',
    'nav.cloud': 'Cloud',
    'nav.nordgo': 'NordGo',
    'nav.prototyping': 'Prototyping',
    'nav.products': 'Products',
    'nav.partners': 'Partners',
    'nav.contact': 'Contact',
    'progress.label': 'Section position',
    'progress.goTo': 'Go to {section}',
    'hero.title': 'It all starts on the factory floor.',
    'hero.subtitle': 'NordWire builds electronic systems that capture everything happening on your production line - turning every second into useful information.',
    'cta.explore': 'Explore More',
    'cta.partner': 'Become a partner',
    'whatWeDo.eyebrow': 'What we do',
    'whatWeDo.title': 'Every machine has a story to tell.',
    'whatWeDo.subtitle': ["Every day, your factory floor generates thousands of data points.", "The question isn't whether they exist, it's whether you're making the most of them."],
    'whatWeDo.cardsLabel': 'What we do highlights',
    'whatWeDo.card1Title': 'Real time',
    'whatWeDo.card1Text': 'Data captured the moment it happens.',
    'whatWeDo.card2Title': 'Remote access',
    'whatWeDo.card2Text': 'Your production accessible wherever you are.',
    'whatWeDo.card3Title': 'Tailored to you',
    'whatWeDo.card3Text': 'Every solution designed for your factory floor.',
    'monitoring.eyebrow': 'Monitoring',
    'monitoring.title': ['The sensors capture.', 'Nothing gets lost.'],
    'monitoring.subtitle': "Sensors we develop record each machine's activity in real time. And access to the information is simple and immediate, right next to each piece of equipment.",
    'monitoring.statsLabel': 'Monitoring statistics',
    'monitoring.stat1': ['Uptime of', 'monitored', 'machines'],
    'monitoring.stat2': 'Devices visible on live dashboards',
    'monitoring.stat3': 'Average response time',
    'cloud.eyebrow': 'Cloud',
    'cloud.title': ['From the factory floor', 'to wherever you are.'],
    'cloud.subtitle': 'Information travels from the sensor to the cloud in seconds, becoming accessible from any computer or phone. What happens in production no longer stays trapped in production.',
    'nordgo.eyebrow': 'NordGo',
    'nordgo.title': 'NordGo - your factory in your pocket.',
    'nordgo.subtitle': 'Track everything in real time, review the history and get what matters, wherever you are. Your production, always a tap away.',
    'nordgo.cardsLabel': 'NordGo features',
    'nordgo.card1Title': 'Real time',
    'nordgo.card1Text': 'Follow production by the minute, wherever you are.',
    'nordgo.card2Title': 'History',
    'nordgo.card2Text': 'Review what happened and compare periods.',
    'nordgo.card3Title': 'Notifications',
    'nordgo.card3Text': 'Get alerts about what really matters.',
    'prototyping.eyebrow': 'Prototyping',
    'prototyping.title': ['From concept', 'to the finished product.'],
    'prototyping.subtitle': 'Every solution is built from scratch for your factory floor - from the circuit to the enclosure. Hardware and software designed for your case, not just any case.',
    'prototyping.cardsLabel': 'Prototyping stages',
    'prototyping.card1Title': 'Hardware',
    'prototyping.card1Text': 'From circuit to enclosure, built from scratch.',
    'prototyping.card2Title': 'Software',
    'prototyping.card2Text': 'Firmware and interface designed for your case.',
    'prototyping.card3Title': 'Production',
    'prototyping.card3Text': 'From prototype to finished product, with us.',
    'prototyping.modelAlt': 'Interactive 3D model of the NordWire prototype device.',
    'prototyping.modelLabel': 'Interactive 3D model of the NordWire prototype device. Rotate the model with the mouse, touch or arrow keys.',
    'prototyping.viewSpace': 'View in your space',
    'prototyping.exitAr': 'Exit AR',
    'prototyping.liveAnnouncements': 'Live announcements',
    'products.eyebrow': 'Products',
    'products.title': 'Our products.',
    'products.subtitle': "Hardware built to fit real production. Explore the solutions we've already developed.",
    'products.storeButton': 'Visit Store',
    'products.hotspotsLabel': 'Interactive details of the NordCore board',
    'products.imageAlt': 'NordCore electronic board viewed from above.',
    'products.processingTitle': 'Processing module',
    'products.processingText': 'The brain of the system - processes data collected on the factory floor in real time.',
    'products.networkTitle': 'Network connection',
    'products.networkText': "Stable network connection for communicating with the factory's infrastructure.",
    'products.powerTitle': 'Power and configuration',
    'products.powerText': 'Simple power and configuration, ready to integrate into any environment.',
    'products.memoryTitle': 'Backup memory',
    'products.memoryText': 'Keeps settings and time records safe, even without power.',
    'products.expansionTitle': 'Expansion',
    'products.expansionText': 'Ready for expansion and additional storage as needs grow.',
    'products.coolingTitle': 'Cooling',
    'products.coolingText': 'Active cooling for reliable, continuous operation.',
    'partners.title': 'We grow with those who work with us.',
    'partners.subtitle': 'We develop the technology. Our partners bring it to factories everywhere. Together, we turn data into decisions.',
    'partners.formLabel': 'Partnership form',
    'partners.submit': 'Become a partner',
    'partners.success': 'Thank you! We will get in touch to discuss the partnership.',
    'contact.eyebrow': 'Contact',
    'contact.title': "Let's take your data further.",
    'contact.subtitle': "Tell us what's happening on your factory floor. We'll handle the rest.",
    'contact.formLabel': 'Contact form',
    'contact.submit': 'Send',
    'contact.success': 'Message received. Thank you for contacting us!',
    'form.name': 'Name',
    'form.company': 'Company',
    'form.email': 'Email',
    'form.message': 'Message',
    'footer.heading': "LET'S CREATE SOMETHING",
    'footer.homeLabel': 'NordWire home page',
    'footer.navLabel': 'Footer navigation',
    'footer.socialLabel': 'Social media',
    'footer.copyright': '2026 NordWire. All rights reserved.',
  },
};

const getStoredLanguage = () => {
  try {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    return storedLanguage === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
};

let currentLanguage = getStoredLanguage();

const translate = (key, replacements = {}) => {
  const value = translations[currentLanguage]?.[key]
    ?? translations.pt[key]
    ?? key;

  const textValue = Array.isArray(value) ? value.join(' ') : value;

  return Object.entries(replacements).reduce(
    (text, [placeholder, replacement]) => (
      text.replace(`{${placeholder}}`, replacement)
    ),
    textValue,
  );
};

const renderTranslatedLines = (element, key) => {
  const translatedValue = translations[currentLanguage]?.[key]
    ?? translations.pt[key]
    ?? key;
  const lines = Array.isArray(translatedValue)
    ? translatedValue
    : [translatedValue];
  const fragment = document.createDocumentFragment();

  lines.forEach((line, index) => {
    if (index > 0) {
      const lineBreak = document.createElement('br');
      lineBreak.className = 'controlled-break';
      const mobileSpace = document.createElement('span');
      mobileSpace.className = 'mobile-line-space';
      mobileSpace.textContent = ' ';
      fragment.append(lineBreak, mobileSpace);
    }

    const lineElement = document.createElement('span');
    lineElement.className = 'controlled-line';
    lineElement.textContent = line;
    fragment.append(lineElement);
  });

  element.replaceChildren(fragment);
};

const updateProgressTranslations = () => {
  horizontalProgress?.setAttribute('aria-label', translate('progress.label'));

  horizontalProgressButtons.forEach((button, index) => {
    const sectionLabel = sections[index]?.dataset.navLabel ?? sections[index]?.id;
    button.dataset.label = sectionLabel;
    button.setAttribute(
      'aria-label',
      translate('progress.goTo', { section: sectionLabel }),
    );
  });
};

const applyLanguage = (language, { persist = true } = {}) => {
  currentLanguage = language === 'en' ? 'en' : 'pt';
  documentRoot.lang = currentLanguage === 'en' ? 'en' : 'pt-PT';
  documentRoot.dataset.language = currentLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-lines]').forEach((element) => {
    renderTranslatedLines(element, element.dataset.i18nLines);
  });

  [
    ['aria-label', 'i18nAriaLabel'],
    ['alt', 'i18nAlt'],
    ['content', 'i18nContent'],
    ['data-nav-label', 'i18nNavLabel'],
    ['data-success-message', 'i18nSuccessMessage'],
  ].forEach(([attribute, datasetKey]) => {
    const dataAttribute = datasetKey.replace(
      /[A-Z]/g,
      (letter) => `-${letter.toLowerCase()}`,
    );

    document.querySelectorAll(`[data-${dataAttribute}]`)
      .forEach((element) => {
        element.setAttribute(attribute, translate(element.dataset[datasetKey]));
      });
  });

  languageButtons.forEach((button) => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  menuToggle?.setAttribute(
    'aria-label',
    translate(body.classList.contains('nav-open')
      ? 'header.closeMenu'
      : 'header.openMenu'),
  );
  updateProgressTranslations();
  refreshModelLocalization();

  demoForms.forEach((form) => {
    const status = form.querySelector('.form-status');
    if (status) {
      status.textContent = '';
    }
  });

  if (persist) {
    try {
      window.localStorage.setItem(languageStorageKey, currentLanguage);
    } catch {
      // The language still changes when storage is unavailable.
    }
  }
};

applyLanguage(currentLanguage, { persist: false });

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    closeHotspots();
    applyLanguage(button.dataset.language);
  });
});

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
      ?? translate('contact.success');
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
  menuToggle?.setAttribute('aria-label', translate('header.openMenu'));

  if (restoreFocus) {
    menuToggle?.focus();
  }
};

menuToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute(
    'aria-label',
    translate(open ? 'header.closeMenu' : 'header.openMenu'),
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

const sectionTransitionEasing = (progress) => (
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - (Math.pow((-2 * progress) + 2, 3) / 2)
);

const cancelHorizontalAnimation = () => {
  if (horizontalAnimationFrame) {
    window.cancelAnimationFrame(horizontalAnimationFrame);
    horizontalAnimationFrame = undefined;
  }

  horizontalAnimationTargetIndex = undefined;
  main?.classList.remove('is-programmatic-scroll');
};

const animateHorizontalSection = (index) => {
  if (!main) {
    return;
  }

  cancelHorizontalAnimation();
  const targetLeft = index * main.clientWidth;

  if (reduceMotion || Math.abs(targetLeft - main.scrollLeft) < 1) {
    main.scrollLeft = targetLeft;
    updateNavigationState(index);
    return;
  }

  const startLeft = main.scrollLeft;
  const distance = targetLeft - startLeft;
  const duration = 900;
  const startTime = performance.now();
  horizontalAnimationTargetIndex = index;
  main.classList.add('is-programmatic-scroll');

  const step = (timestamp) => {
    const elapsed = Math.min(1, (timestamp - startTime) / duration);
    main.scrollLeft = startLeft + (distance * sectionTransitionEasing(elapsed));

    if (elapsed < 1) {
      horizontalAnimationFrame = window.requestAnimationFrame(step);
      return;
    }

    main.scrollLeft = targetLeft;
    horizontalAnimationFrame = undefined;
    main.classList.remove('is-programmatic-scroll');
    updateNavigationState(horizontalAnimationTargetIndex ?? index);
    horizontalAnimationTargetIndex = undefined;
  };

  horizontalAnimationFrame = window.requestAnimationFrame(step);
};

const positionHorizontalSection = (index) => {
  if (!main) {
    return;
  }

  cancelHorizontalAnimation();
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

    window.scrollTo({ top: 0, behavior: 'auto' });
    updateNavigationState(index);
    animateHorizontalSection(index);
  } else {
    target.scrollIntoView({
      behavior,
      block: 'start',
    });
  }

  if (!isHorizontalLayout()) {
    updateNavigationState(index);
  }
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
  horizontalProgress.setAttribute('aria-label', translate('progress.label'));

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
      translate('progress.goTo', { section: sectionLabel }),
    );
    button.dataset.label = sectionLabel;
    button.addEventListener('click', () => navigateToSection(index));
    horizontalProgress.append(button);
    return button;
  });

  body.append(horizontalProgress);
};

const hasScrollableVerticalContent = (section) => {
  const { overflowY } = window.getComputedStyle(section);
  const allowsVerticalScroll = overflowY === 'auto' || overflowY === 'scroll';

  return (
    allowsVerticalScroll
    && section.scrollHeight > section.clientHeight + 2
  );
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

  const currentIndex = getHorizontalSectionIndex();
  const currentSection = sections[currentIndex];
  if (!currentSection) {
    return;
  }

  if (hasScrollableVerticalContent(currentSection)) {
    const atTop = currentSection.scrollTop <= 1;
    const atBottom = (
      currentSection.scrollTop + currentSection.clientHeight
      >= currentSection.scrollHeight - 2
    );

    if ((direction > 0 && !atBottom) || (direction < 0 && !atTop)) {
      return;
    }
  }

  const nextIndex = currentIndex + direction;
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
    reduceMotion ? 80 : 1050,
  );
};

const handleHorizontalScroll = () => {
  if (horizontalScrollFrame) {
    return;
  }

  horizontalScrollFrame = window.requestAnimationFrame(() => {
    horizontalScrollFrame = undefined;
    if (!main?.classList.contains('is-programmatic-scroll')) {
      setActiveLink();
    }
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
  cancelHorizontalAnimation();
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

  if (
    !isHorizontalLayout()
    || event.defaultPrevented
    || event.target.closest?.('a, button, input, textarea, select, model-viewer')
  ) {
    return;
  }

  const direction = ['ArrowRight', 'PageDown'].includes(event.key)
    ? 1
    : ['ArrowLeft', 'PageUp'].includes(event.key)
      ? -1
      : 0;

  if (!direction) {
    return;
  }

  const nextIndex = Math.max(
    0,
    Math.min(sections.length - 1, activeSectionIndex + direction),
  );

  if (nextIndex !== activeSectionIndex) {
    event.preventDefault();
    navigateToSection(nextIndex);
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
    const revealDelay = Math.min(targetIndex, 7) * 120;
    target.classList.add('reveal-item');
    target.style.setProperty(
      '--reveal-delay',
      `${revealDelay}ms`,
    );
    target.dataset.revealDelay = String(revealDelay);
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
        window.setTimeout(() => {
          entry.target.classList.add('reveal-complete');
        }, Number(entry.target.dataset.revealDelay ?? 0) + 680);
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

const formatCountUpValue = (element, value) => {
  const decimals = Number(element.dataset.countDecimals ?? 0);
  const suffix = element.dataset.countSuffix ?? '';
  return `${value.toFixed(decimals)}${suffix}`;
};

const showFinalCountUpValues = () => {
  countUpNumbers.forEach((element) => {
    const targetValue = Number(element.dataset.countTarget ?? 0);
    element.textContent = formatCountUpValue(element, targetValue);
  });
};

const runCountUp = (element) => {
  if (element.dataset.counted === 'true') {
    return;
  }

  const targetValue = Number(element.dataset.countTarget ?? 0);
  const finalValue = formatCountUpValue(element, targetValue);
  const duration = 1350;
  const startTime = performance.now();
  element.dataset.counted = 'true';
  element.setAttribute('aria-label', finalValue);

  const step = (timestamp) => {
    const progress = Math.min(1, (timestamp - startTime) / duration);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatCountUpValue(
      element,
      targetValue * easedProgress,
    );

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = finalValue;
    }
  };

  window.requestAnimationFrame(step);
};

const monitoringSection = document.querySelector('#monitorizacao');

if (reduceMotion || !monitoringSection || !countUpNumbers.length) {
  showFinalCountUpValues();
} else if ('IntersectionObserver' in window) {
  countUpNumbers.forEach((element) => {
    element.textContent = formatCountUpValue(element, 0);
  });

  const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      countUpNumbers.forEach(runCountUp);
      observer.disconnect();
    });
  }, { threshold: 0.35 });

  countUpObserver.observe(monitoringSection);
} else {
  showFinalCountUpValues();
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

      const setLocalizedLabel = (element, key) => {
        const localizedLabel = translate(key);
        if (element.getAttribute('aria-label') !== localizedLabel) {
          element.setAttribute('aria-label', localizedLabel);
        }
      };

      shadowRoot.querySelectorAll('[aria-label]').forEach((element) => {
        const label = element.getAttribute('aria-label') || '';

        if (
          label.includes('Use mouse, touch or arrow keys to move.')
          || label.includes('Rode o modelo com o rato')
          || label.includes('Rotate the model with the mouse')
        ) {
          setLocalizedLabel(element, 'prototyping.modelLabel');
        } else if ([
          translations.pt['prototyping.viewSpace'],
          translations.en['prototyping.viewSpace'],
        ].includes(label)) {
          setLocalizedLabel(element, 'prototyping.viewSpace');
        } else if ([
          translations.pt['prototyping.exitAr'],
          translations.en['prototyping.exitAr'],
        ].includes(label)) {
          setLocalizedLabel(element, 'prototyping.exitAr');
        } else if ([
          translations.pt['prototyping.liveAnnouncements'],
          translations.en['prototyping.liveAnnouncements'],
        ].includes(label)) {
          setLocalizedLabel(element, 'prototyping.liveAnnouncements');
        }
      });
    };

    refreshModelLocalization = localizeModelControls;
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
