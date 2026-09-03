(() => {
  const root = document.documentElement;
  const body = document.body;
  const storageKey = 'nordwire-language';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sharedTranslations = {
    pt: {
      'language.groupLabel': 'Seleção de idioma',
      'language.ptLabel': 'Usar Português',
      'language.enLabel': 'Usar Inglês',
      'header.homeLabel': 'NordWire - página inicial',
      'header.navLabel': 'Navegação principal',
      'header.openMenu': 'Abrir menu',
      'header.closeMenu': 'Fechar menu',
      'header.product': 'Produto',
      'header.technology': 'Tecnologia',
      'header.benefits': 'Benefícios',
      'header.company': 'Empresa',
      'header.hardware': 'Hardware',
      'header.nordgo': 'NordGo',
      'header.howItWorks': 'Como funciona',
      'header.integrations': 'Integrações',
      'header.security': 'Segurança',
      'header.partners': 'Parceiros',
      'header.factories': 'Fábricas',
      'header.prototyping': 'Prototipagem',
      'header.about': 'Sobre nós',
      'header.partnership': 'Parceria',
      'header.contact': 'Contactos',
      'footer.summary': 'Tecnologia industrial criada para transformar atividade em decisões.',
      'footer.navigation': 'Navegação',
      'footer.rights': 'Todos os direitos reservados.',
      'page.preparing': 'Conteúdo em preparação',
      'page.hardware.title': 'Hardware',
      'page.hardware.description': 'Soluções físicas NordWire para monitorização industrial.',
      'page.hardware.metaTitle': 'Hardware | NordWire',
      'page.nordgo.title': 'NordGo',
      'page.nordgo.description': 'A plataforma NordWire para acompanhar a produção onde estiveres.',
      'page.nordgo.metaTitle': 'NordGo | NordWire',
      'page.howItWorks.title': 'Como funciona',
      'page.howItWorks.description': 'Da máquina à informação útil, conhece a tecnologia NordWire.',
      'page.howItWorks.metaTitle': 'Como funciona | NordWire',
      'page.integrations.title': 'Integrações',
      'page.integrations.description': 'Integrações preparadas para o ecossistema industrial.',
      'page.integrations.metaTitle': 'Integrações | NordWire',
      'page.security.title': 'Segurança',
      'page.security.description': 'Segurança e continuidade para dados industriais.',
      'page.security.metaTitle': 'Segurança | NordWire',
      'page.partnerBenefits.title': 'Benefícios para parceiros',
      'page.partnerBenefits.description': 'Tecnologia, suporte e capacitação para os parceiros NordWire.',
      'page.partnerBenefits.metaTitle': 'Benefícios para parceiros | NordWire',
      'page.factoryBenefits.title': 'Benefícios para fábricas',
      'page.factoryBenefits.description': 'Visibilidade operacional para decisões mais rápidas na fábrica.',
      'page.factoryBenefits.metaTitle': 'Benefícios para fábricas | NordWire',
      'page.prototyping.title': 'Prototipagem',
      'page.prototyping.description': 'Do conceito ao sistema industrial pronto a implementar.',
      'page.prototyping.metaTitle': 'Prototipagem | NordWire',
      'page.about.title': 'Sobre nós',
      'page.about.description': 'Conhece a NordWire e a nossa abordagem à tecnologia industrial.',
      'page.about.metaTitle': 'Sobre nós | NordWire',
      'page.partnership.title': 'Parceria',
      'page.partnership.description': 'Leva a tecnologia NordWire a mais fábricas.',
      'page.partnership.metaTitle': 'Parceria | NordWire',
      'page.contact.title': 'Contactos',
      'page.contact.description': 'Fala com a equipa NordWire.',
      'page.contact.metaTitle': 'Contactos | NordWire',
    },
    en: {
      'language.groupLabel': 'Language selection',
      'language.ptLabel': 'Use Portuguese',
      'language.enLabel': 'Use English',
      'header.homeLabel': 'NordWire - homepage',
      'header.navLabel': 'Main navigation',
      'header.openMenu': 'Open menu',
      'header.closeMenu': 'Close menu',
      'header.product': 'Product',
      'header.technology': 'Technology',
      'header.benefits': 'Benefits',
      'header.company': 'Company',
      'header.hardware': 'Hardware',
      'header.nordgo': 'NordGo',
      'header.howItWorks': 'How it works',
      'header.integrations': 'Integrations',
      'header.security': 'Security',
      'header.partners': 'Partners',
      'header.factories': 'Factories',
      'header.prototyping': 'Prototyping',
      'header.about': 'About us',
      'header.partnership': 'Partnership',
      'header.contact': 'Contact',
      'footer.summary': 'Industrial technology built to turn activity into decisions.',
      'footer.navigation': 'Navigation',
      'footer.rights': 'All rights reserved.',
      'page.preparing': 'Content in preparation',
      'page.hardware.title': 'Hardware',
      'page.hardware.description': 'NordWire physical solutions for industrial monitoring.',
      'page.hardware.metaTitle': 'Hardware | NordWire',
      'page.nordgo.title': 'NordGo',
      'page.nordgo.description': 'The NordWire platform for following production wherever you are.',
      'page.nordgo.metaTitle': 'NordGo | NordWire',
      'page.howItWorks.title': 'How it works',
      'page.howItWorks.description': 'From machine activity to useful information, discover NordWire technology.',
      'page.howItWorks.metaTitle': 'How it works | NordWire',
      'page.integrations.title': 'Integrations',
      'page.integrations.description': 'Integrations built for the industrial ecosystem.',
      'page.integrations.metaTitle': 'Integrations | NordWire',
      'page.security.title': 'Security',
      'page.security.description': 'Security and continuity for industrial data.',
      'page.security.metaTitle': 'Security | NordWire',
      'page.partnerBenefits.title': 'Partner benefits',
      'page.partnerBenefits.description': 'Technology, support and enablement for NordWire partners.',
      'page.partnerBenefits.metaTitle': 'Partner benefits | NordWire',
      'page.factoryBenefits.title': 'Factory benefits',
      'page.factoryBenefits.description': 'Operational visibility for faster decisions on the factory floor.',
      'page.factoryBenefits.metaTitle': 'Factory benefits | NordWire',
      'page.prototyping.title': 'Prototyping',
      'page.prototyping.description': 'From concept to an industrial system ready to implement.',
      'page.prototyping.metaTitle': 'Prototyping | NordWire',
      'page.about.title': 'About us',
      'page.about.description': 'Meet NordWire and our approach to industrial technology.',
      'page.about.metaTitle': 'About us | NordWire',
      'page.partnership.title': 'Partnership',
      'page.partnership.description': 'Bring NordWire technology to more factories.',
      'page.partnership.metaTitle': 'Partnership | NordWire',
      'page.contact.title': 'Contact',
      'page.contact.description': 'Talk to the NordWire team.',
      'page.contact.metaTitle': 'Contact | NordWire',
    },
  };

  const translations = {
    pt: { ...sharedTranslations.pt },
    en: { ...sharedTranslations.en },
  };

  const languageMarkup = () => `
    <div class="language-switcher" role="group" data-i18n-aria-label="language.groupLabel" aria-label="Seleção de idioma">
      <button class="language-option" type="button" data-language="pt" aria-pressed="false" data-i18n-aria-label="language.ptLabel" aria-label="Usar Português"><span aria-hidden="true">PT</span></button>
      <button class="language-option" type="button" data-language="en" aria-pressed="false" data-i18n-aria-label="language.enLabel" aria-label="Usar Inglês"><span aria-hidden="true">EN</span></button>
    </div>`;

  const groupMarkup = (key, links) => `
    <div class="nav-group" data-nav-group>
      <button class="nav-group-toggle" type="button" aria-expanded="false">
        <span data-i18n="${key}"></span>
        <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5"/></svg>
      </button>
      <div class="nav-dropdown">
        ${links.map(([href, label]) => `<a href="${href}" data-page-link data-i18n="${label}"></a>`).join('')}
      </div>
    </div>`;

  const headerTarget = document.querySelector('#site-header');
  if (headerTarget) {
    headerTarget.innerHTML = `
      <header class="site-header" data-shared-header>
        <div class="header-shell">
          <a class="header-brand" href="index.html" data-page-link data-i18n-aria-label="header.homeLabel" aria-label="NordWire - página inicial">
            <img src="assets/images/nordwire-logo.png" alt="NordWire">
          </a>
          <nav class="site-nav" id="site-nav" data-i18n-aria-label="header.navLabel" aria-label="Navegação principal">
            <div class="nav-groups">
              ${groupMarkup('header.product', [['hardware.html', 'header.hardware'], ['nordgo.html', 'header.nordgo']])}
              ${groupMarkup('header.technology', [['como-funciona.html', 'header.howItWorks'], ['integracoes.html', 'header.integrations'], ['seguranca.html', 'header.security']])}
              ${groupMarkup('header.benefits', [['beneficios-parceiros.html', 'header.partners'], ['beneficios-fabricas.html', 'header.factories']])}
              ${groupMarkup('header.company', [['prototipagem.html', 'header.prototyping'], ['sobre-nos.html', 'header.about']])}
            </div>
            <div class="mobile-nav-actions">
              <a class="header-text-link" href="parceria.html" data-page-link data-i18n="header.partnership"></a>
              <a class="button button-primary header-contact-link" href="contactos.html" data-page-link data-i18n="header.contact"></a>
              ${languageMarkup()}
            </div>
          </nav>
          <div class="header-actions">
            <a class="header-text-link" href="parceria.html" data-page-link data-i18n="header.partnership"></a>
            <a class="button button-primary header-contact-link" href="contactos.html" data-page-link data-i18n="header.contact"></a>
            ${languageMarkup()}
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-i18n-aria-label="header.openMenu" aria-label="Abrir menu"><span></span><span></span><span></span></button>
          </div>
        </div>
      </header>`;
  }

  const footerTarget = document.querySelector('#site-footer');
  if (footerTarget) {
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="footer-shell">
          <div class="footer-brand-block">
            <a class="footer-brand" href="index.html" data-page-link><img src="assets/images/nordwire-logo.png" alt="NordWire"></a>
            <p data-i18n="footer.summary"></p>
          </div>
          <div class="footer-links">
            <p class="eyebrow" data-i18n="footer.navigation"></p>
            <a href="hardware.html" data-page-link data-i18n="header.hardware"></a>
            <a href="como-funciona.html" data-page-link data-i18n="header.howItWorks"></a>
            <a href="beneficios-parceiros.html" data-page-link data-i18n="header.partners"></a>
            <a href="sobre-nos.html" data-page-link data-i18n="header.about"></a>
            <a href="contactos.html" data-page-link data-i18n="header.contact"></a>
          </div>
          <p class="footer-legal">© ${new Date().getFullYear()} NordWire. <span data-i18n="footer.rights"></span></p>
        </div>
      </footer>`;
  }

  const readStoredLanguage = () => {
    try {
      return window.localStorage.getItem(storageKey) === 'en' ? 'en' : 'pt';
    } catch {
      return 'pt';
    }
  };

  let currentLanguage = readStoredLanguage();

  const translate = (key, fallback = '') => translations[currentLanguage]?.[key] ?? fallback ?? key;

  const setControlledLines = (element, lines) => {
    const values = Array.isArray(lines) ? lines : [lines];
    const fragment = document.createDocumentFragment();
    values.forEach((line, index) => {
      if (index) {
        const br = document.createElement('br');
        br.className = 'controlled-break';
        fragment.append(br);
        const spacer = document.createElement('span');
        spacer.className = 'mobile-line-space';
        spacer.textContent = ' ';
        fragment.append(spacer);
      }
      const span = document.createElement('span');
      span.className = 'controlled-line';
      span.textContent = line;
      fragment.append(span);
    });
    element.replaceChildren(fragment);
  };

  const applyLanguage = (language, { persist = true } = {}) => {
    currentLanguage = language === 'en' ? 'en' : 'pt';
    root.lang = currentLanguage === 'en' ? 'en' : 'pt-PT';
    root.dataset.language = currentLanguage;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = translate(element.dataset.i18n, element.textContent);
    });
    document.querySelectorAll('[data-i18n-lines]').forEach((element) => {
      setControlledLines(element, translate(element.dataset.i18nLines, element.textContent));
    });
    document.querySelectorAll('[data-i18n-content]').forEach((element) => {
      element.setAttribute('content', translate(element.dataset.i18nContent, element.getAttribute('content')));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel, element.getAttribute('aria-label')));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
      element.setAttribute('alt', translate(element.dataset.i18nAlt, element.getAttribute('alt')));
    });
    document.querySelectorAll('[data-i18n-success-message]').forEach((element) => {
      element.dataset.successMessage = translate(element.dataset.i18nSuccessMessage, element.dataset.successMessage);
    });

    document.querySelectorAll('[data-language]').forEach((button) => {
      const active = button.dataset.language === currentLanguage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (persist) {
      try {
        window.localStorage.setItem(storageKey, currentLanguage);
      } catch {
        // Storage can be unavailable in privacy modes; the page still works.
      }
    }

    window.dispatchEvent(new CustomEvent('nordwire:languagechange', { detail: { language: currentLanguage } }));
  };

  const register = (bundle) => {
    ['pt', 'en'].forEach((language) => Object.assign(translations[language], bundle?.[language] ?? {}));
    applyLanguage(currentLanguage, { persist: false });
  };

  window.NordWireI18n = {
    apply: applyLanguage,
    get language() { return currentLanguage; },
    register,
    translate,
  };

  document.addEventListener('click', (event) => {
    const languageButton = event.target.closest('[data-language]');
    if (languageButton) {
      applyLanguage(languageButton.dataset.language);
    }
  });

  const header = document.querySelector('[data-shared-header]');
  const nav = document.querySelector('#site-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const groups = Array.from(document.querySelectorAll('[data-nav-group]'));

  const closeGroups = (except) => {
    groups.forEach((group) => {
      if (group === except) return;
      group.classList.remove('is-open');
      group.querySelector('.nav-group-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };

  groups.forEach((group) => {
    const toggle = group.querySelector('.nav-group-toggle');
    const firstLink = group.querySelector('.nav-dropdown a');
    toggle?.addEventListener('click', () => {
      const open = !group.classList.contains('is-open');
      closeGroups(group);
      group.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    toggle?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        group.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        firstLink?.focus();
      }
    });
  });

  const closeMenu = ({ restoreFocus = false } = {}) => {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.dataset.i18nAriaLabel = 'header.openMenu';
    menuToggle?.setAttribute('aria-label', translate('header.openMenu'));
    closeGroups();
    if (restoreFocus) menuToggle?.focus();
  };

  menuToggle?.addEventListener('click', () => {
    const open = !body.classList.contains('menu-open');
    body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.dataset.i18nAriaLabel = open ? 'header.closeMenu' : 'header.openMenu';
    menuToggle.setAttribute('aria-label', translate(open ? 'header.closeMenu' : 'header.openMenu'));
  });

  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!header?.contains(event.target)) closeGroups();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (body.classList.contains('menu-open')) closeMenu({ restoreFocus: true });
    else closeGroups();
  });

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page-link]').forEach((link) => {
    const href = link.getAttribute('href')?.split('#')[0];
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
      link.closest('[data-nav-group]')?.classList.add('has-current');
    }
  });

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', syncHeader, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && body.classList.contains('menu-open')) closeMenu();
  });
  syncHeader();
  applyLanguage(currentLanguage, { persist: false });
})();
