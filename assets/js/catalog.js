const root = document.documentElement;
const page = document.body;
const productGrid = document.querySelector('[data-product-grid]');
const resultsSummary = document.querySelector('[data-results-summary]');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const languageButtons = Array.from(document.querySelectorAll('[data-language]'));
const filterToggle = document.querySelector('[data-filter-toggle]');
const filterClose = document.querySelector('[data-filter-close]');
const productDialog = document.querySelector('[data-product-dialog]');
const quoteDialog = document.querySelector('[data-quote-dialog]');
const quoteForm = document.querySelector('[data-quote-form]');
const quoteStatus = document.querySelector('[data-quote-status]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileFilters = window.matchMedia('(max-width: 767px)');
const languageStorageKey = 'nordwire-language';

const translations = {
  pt: {
    'meta.title': 'Catálogo NordWire - Hardware industrial',
    'meta.description': 'Catálogo de sensores, gateways e acessórios industriais NordWire.',
    'language.groupLabel': 'Seleção de idioma',
    'language.ptLabel': 'Usar Português',
    'language.enLabel': 'Usar Inglês',
    'header.back': 'Voltar',
    'header.backLabel': 'Voltar ao site NordWire',
    'catalog.eyebrow': 'Catálogo',
    'catalog.title': 'Hardware preparado para a indústria.',
    'catalog.subtitle': 'Explora uma seleção de soluções NordWire para captar, ligar e proteger os dados do chão de fábrica.',
    'catalog.regionLabel': 'Produtos e filtros',
    'filters.eyebrow': 'Filtros',
    'filters.title': 'Categoria',
    'filters.open': 'Filtrar produtos',
    'filters.close': 'Fechar filtros',
    'filters.groupLabel': 'Categorias de produto',
    'filters.all': 'Todos',
    'category.sensors': 'Sensores',
    'category.gateways': 'Gateways',
    'category.accessories': 'Acessórios',
    'results.one': '1 produto',
    'results.many': '{count} produtos',
    'card.open': 'Ver detalhe de {product}',
    'detail.close': 'Fechar detalhe',
    'detail.quote': 'Pedir orçamento',
    'quote.close': 'Fechar formulário',
    'quote.eyebrow': 'Pedido de orçamento',
    'quote.title': 'Fala-nos do que precisas.',
    'quote.product': 'Produto:',
    'quote.submit': 'Enviar pedido',
    'quote.success': 'Pedido enviado com sucesso.',
    'form.name': 'Nome',
    'form.email': 'Email',
    'form.quantity': 'Quantidade',
    'form.note': 'Nota / Mensagem',
    'validation.name': 'Indica o teu nome.',
    'validation.emailRequired': 'Indica o teu email.',
    'validation.emailInvalid': 'Introduz um email válido.',
    'validation.quantity': 'Indica uma quantidade válida, igual ou superior a 1.',
    'price.onRequest': 'Preço sob consulta',
  },
  en: {
    'meta.title': 'NordWire Catalogue - Industrial hardware',
    'meta.description': 'NordWire catalogue of industrial sensors, gateways and accessories.',
    'language.groupLabel': 'Language selection',
    'language.ptLabel': 'Use Portuguese',
    'language.enLabel': 'Use English',
    'header.back': 'Back',
    'header.backLabel': 'Back to the NordWire website',
    'catalog.eyebrow': 'Catalogue',
    'catalog.title': 'Hardware ready for industry.',
    'catalog.subtitle': 'Explore a selection of NordWire solutions built to capture, connect and protect factory-floor data.',
    'catalog.regionLabel': 'Products and filters',
    'filters.eyebrow': 'Filters',
    'filters.title': 'Category',
    'filters.open': 'Filter products',
    'filters.close': 'Close filters',
    'filters.groupLabel': 'Product categories',
    'filters.all': 'All',
    'category.sensors': 'Sensors',
    'category.gateways': 'Gateways',
    'category.accessories': 'Accessories',
    'results.one': '1 product',
    'results.many': '{count} products',
    'card.open': 'View details for {product}',
    'detail.close': 'Close details',
    'detail.quote': 'Request a quote',
    'quote.close': 'Close form',
    'quote.eyebrow': 'Quote request',
    'quote.title': 'Tell us what you need.',
    'quote.product': 'Product:',
    'quote.submit': 'Send request',
    'quote.success': 'Request sent successfully.',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.quantity': 'Quantity',
    'form.note': 'Note / Message',
    'validation.name': 'Enter your name.',
    'validation.emailRequired': 'Enter your email.',
    'validation.emailInvalid': 'Enter a valid email address.',
    'validation.quantity': 'Enter a valid quantity of 1 or more.',
    'price.onRequest': 'Price on request',
  },
};

const products = [
  {
    id: 'nordsense-t1',
    category: 'sensors',
    price: { pt: '189 €', en: '€189' },
    name: { pt: 'NordSense T1', en: 'NordSense T1' },
    short: {
      pt: 'Sensor compacto de temperatura e vibração.',
      en: 'Compact temperature and vibration sensor.',
    },
    description: {
      pt: 'Sensor industrial compacto para acompanhar temperatura e vibração em motores, bombas e redutores, com instalação simples e leitura contínua junto do equipamento.',
      en: 'A compact industrial sensor for tracking temperature and vibration in motors, pumps and gearboxes, with simple installation and continuous readings at the machine.',
    },
  },
  {
    id: 'nordsense-p4',
    category: 'sensors',
    price: { pt: '249 €', en: '€249' },
    name: { pt: 'NordSense P4', en: 'NordSense P4' },
    short: {
      pt: 'Módulo de pressão para ambientes exigentes.',
      en: 'Pressure module for demanding environments.',
    },
    description: {
      pt: 'Módulo robusto para recolha de pressão em linhas industriais, preparado para ciclos de trabalho intensivos e integração com sistemas de monitorização existentes.',
      en: 'A robust pressure-acquisition module for industrial lines, designed for intensive duty cycles and integration with existing monitoring systems.',
    },
  },
  {
    id: 'nordvision-o2',
    category: 'sensors',
    price: { pt: 'Preço sob consulta', en: 'Price on request' },
    name: { pt: 'NordVision O2', en: 'NordVision O2' },
    short: {
      pt: 'Sensor ótico para contagem e presença.',
      en: 'Optical sensor for counting and presence.',
    },
    description: {
      pt: 'Sensor ótico configurável para deteção de presença, contagem de peças e validação de passagem em linhas de produção de diferentes velocidades.',
      en: 'A configurable optical sensor for presence detection, part counting and pass-through validation across production lines running at different speeds.',
    },
  },
  {
    id: 'nordgate-edge-200',
    category: 'gateways',
    price: { pt: '469 €', en: '€469' },
    name: { pt: 'NordGate Edge 200', en: 'NordGate Edge 200' },
    short: {
      pt: 'Gateway industrial para dados em tempo real.',
      en: 'Industrial gateway for real-time data.',
    },
    description: {
      pt: 'Gateway de edge computing para recolher, normalizar e encaminhar sinais de várias máquinas, mantendo baixa latência e operação local resiliente.',
      en: 'An edge-computing gateway that collects, normalises and routes signals from multiple machines while maintaining low latency and resilient local operation.',
    },
  },
  {
    id: 'nordgate-connect-lte',
    category: 'gateways',
    price: { pt: 'Preço sob consulta', en: 'Price on request' },
    name: { pt: 'NordGate Connect LTE', en: 'NordGate Connect LTE' },
    short: {
      pt: 'Conectividade remota segura por rede móvel.',
      en: 'Secure remote connectivity over mobile networks.',
    },
    description: {
      pt: 'Gateway com conectividade LTE para instalações remotas ou sem infraestrutura de rede disponível, com comunicação segura e gestão preparada para a cloud.',
      en: 'An LTE-enabled gateway for remote sites or facilities without available network infrastructure, with secure communications and cloud-ready management.',
    },
  },
  {
    id: 'nordcore-io-16',
    category: 'gateways',
    price: { pt: '329 €', en: '€329' },
    name: { pt: 'NordCore IO 16', en: 'NordCore IO 16' },
    short: {
      pt: 'Controlador de entradas e saídas industriais.',
      en: 'Industrial input and output controller.',
    },
    description: {
      pt: 'Controlador modular com entradas e saídas configuráveis para ligar sensores e equipamentos legados a uma camada moderna de recolha de dados.',
      en: 'A modular controller with configurable inputs and outputs that connects sensors and legacy equipment to a modern data-acquisition layer.',
    },
  },
  {
    id: 'railmount-flex-kit',
    category: 'accessories',
    price: { pt: '59 €', en: '€59' },
    name: { pt: 'RailMount Flex Kit', en: 'RailMount Flex Kit' },
    short: {
      pt: 'Kit de montagem modular para calha DIN.',
      en: 'Modular DIN-rail mounting kit.',
    },
    description: {
      pt: 'Conjunto de suportes e adaptadores para montagem segura de módulos NordWire em quadros elétricos e armários industriais com calha DIN.',
      en: 'A set of brackets and adapters for securely mounting NordWire modules in electrical panels and industrial DIN-rail enclosures.',
    },
  },
  {
    id: 'shieldpower-24',
    category: 'accessories',
    price: { pt: '89 €', en: '€89' },
    name: { pt: 'ShieldPower 24', en: 'ShieldPower 24' },
    short: {
      pt: 'Proteção e alimentação estabilizada a 24 V.',
      en: 'Protected and stabilised 24 V power.',
    },
    description: {
      pt: 'Módulo de alimentação protegido contra variações, inversão e picos de tensão, desenvolvido para aumentar a fiabilidade dos dispositivos no terreno.',
      en: 'A power module protected against voltage variation, reverse polarity and spikes, designed to improve device reliability in the field.',
    },
  },
];

const getStoredLanguage = () => {
  try {
    return window.localStorage.getItem(languageStorageKey) === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
};

let currentLanguage = getStoredLanguage();
let activeFilter = 'all';
let selectedProduct = products[0];
let languageTimer;

const translate = (key, replacements = {}) => {
  const source = translations[currentLanguage]?.[key] ?? translations.pt[key] ?? key;
  return Object.entries(replacements).reduce(
    (value, [name, replacement]) => value.replace(`{${name}}`, replacement),
    source,
  );
};

const getCategoryLabel = (category) => translate(`category.${category}`);

const createProductCard = (product, index) => {
  const card = document.createElement('button');
  card.className = 'product-card';
  card.type = 'button';
  card.dataset.productId = product.id;
  card.setAttribute('aria-label', translate('card.open', { product: product.name[currentLanguage] }));

  const visual = document.createElement('span');
  visual.className = 'product-card-visual';
  const image = document.createElement('img');
  image.src = 'assets/images/catalog-product-placeholder.svg';
  image.alt = '';
  image.loading = 'lazy';
  const productIndex = document.createElement('span');
  productIndex.className = 'product-index';
  productIndex.setAttribute('aria-hidden', 'true');
  productIndex.textContent = String(index + 1).padStart(2, '0');
  visual.append(image, productIndex);

  const copy = document.createElement('span');
  copy.className = 'product-card-copy';
  const category = document.createElement('span');
  category.className = 'product-category';
  category.textContent = getCategoryLabel(product.category);
  const name = document.createElement('h2');
  name.textContent = product.name[currentLanguage];
  const description = document.createElement('span');
  description.className = 'product-card-description';
  description.textContent = product.short[currentLanguage];
  const price = document.createElement('span');
  price.className = 'product-card-price';
  price.textContent = product.price[currentLanguage];
  copy.append(category, name, description, price);
  card.append(visual, copy);

  card.addEventListener('click', () => openProductDetail(product));
  return card;
};

const renderProducts = () => {
  const visibleProducts = products.filter(
    (product) => activeFilter === 'all' || product.category === activeFilter,
  );
  const fragment = document.createDocumentFragment();

  visibleProducts.forEach((product) => {
    fragment.append(createProductCard(product, products.indexOf(product)));
  });

  productGrid.replaceChildren(fragment);
  resultsSummary.textContent = visibleProducts.length === 1
    ? translate('results.one')
    : translate('results.many', { count: visibleProducts.length });
};

const updateProductDetail = () => {
  productDialog.querySelector('[data-detail-category]').textContent = getCategoryLabel(selectedProduct.category);
  productDialog.querySelector('[data-detail-name]').textContent = selectedProduct.name[currentLanguage];
  productDialog.querySelector('[data-detail-description]').textContent = selectedProduct.description[currentLanguage];
  productDialog.querySelector('[data-detail-price]').textContent = selectedProduct.price[currentLanguage];
  quoteDialog.querySelector('[data-quote-product]').textContent = selectedProduct.name[currentLanguage];
  quoteDialog.querySelector('[data-quote-product-input]').value = selectedProduct.name[currentLanguage];
};

const openProductDetail = (product) => {
  selectedProduct = product;
  updateProductDetail();
  productDialog.showModal();
};

const setFiltersOpen = (open) => {
  page.classList.toggle('filters-open', open);
  filterToggle.setAttribute('aria-expanded', String(open));

  if (!mobileFilters.matches) {
    return;
  }

  if (open) {
    filterClose.focus();
  } else if (document.activeElement?.closest('.catalog-filters')) {
    filterToggle.focus();
  }
};

const clearFormState = () => {
  quoteStatus.textContent = '';
  quoteForm.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
    field.removeAttribute('aria-invalid');
  });
  quoteForm.querySelectorAll('.field-error').forEach((error) => {
    error.textContent = '';
  });
};

const setFieldError = (field, message) => {
  field.setAttribute('aria-invalid', 'true');
  const error = document.getElementById(field.getAttribute('aria-describedby'));
  if (error) {
    error.textContent = message;
  }
};

const validateQuoteForm = () => {
  clearFormState();
  const name = quoteForm.elements.nome;
  const email = quoteForm.elements.email;
  const quantity = quoteForm.elements.quantidade;
  const quantityValue = Number(quantity.value);

  if (!name.value.trim()) {
    setFieldError(name, translate('validation.name'));
  }

  if (!email.value.trim()) {
    setFieldError(email, translate('validation.emailRequired'));
  } else if (!email.validity.valid) {
    setFieldError(email, translate('validation.emailInvalid'));
  }

  if (!quantity.value || !Number.isInteger(quantityValue) || quantityValue < 1) {
    setFieldError(quantity, translate('validation.quantity'));
  }

  const firstInvalid = quoteForm.querySelector('[aria-invalid="true"]');
  firstInvalid?.focus();
  return !firstInvalid;
};

const applyLanguage = (language, { persist = true } = {}) => {
  currentLanguage = language === 'en' ? 'en' : 'pt';
  root.lang = currentLanguage === 'en' ? 'en' : 'pt-PT';
  root.dataset.language = currentLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
  });

  document.title = translate('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', translate('meta.description'));

  languageButtons.forEach((button) => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  renderProducts();
  updateProductDetail();
  clearFormState();

  if (persist) {
    try {
      window.localStorage.setItem(languageStorageKey, currentLanguage);
    } catch {
      // Language still changes when storage is unavailable.
    }
  }
};

const switchLanguage = (language) => {
  const nextLanguage = language === 'en' ? 'en' : 'pt';
  if (nextLanguage === currentLanguage) {
    return;
  }

  window.clearTimeout(languageTimer);
  if (reduceMotion) {
    applyLanguage(nextLanguage);
    return;
  }

  root.classList.add('language-switching');
  languageTimer = window.setTimeout(() => {
    applyLanguage(nextLanguage);
    window.requestAnimationFrame(() => root.classList.remove('language-switching'));
  }, 130);
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((option) => {
      const active = option === button;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-pressed', String(active));
    });
    renderProducts();
    setFiltersOpen(false);
  });
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => switchLanguage(button.dataset.language));
});

filterToggle.addEventListener('click', () => {
  setFiltersOpen(!page.classList.contains('filters-open'));
});
filterClose.addEventListener('click', () => setFiltersOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && page.classList.contains('filters-open')) {
    setFiltersOpen(false);
  }
});

document.querySelector('[data-close-product]').addEventListener('click', () => productDialog.close());
document.querySelector('[data-close-quote]').addEventListener('click', () => quoteDialog.close());
document.querySelector('[data-open-quote]').addEventListener('click', () => {
  productDialog.close();
  clearFormState();
  updateProductDetail();
  quoteDialog.showModal();
  quoteForm.elements.nome.focus();
});

[productDialog, quoteDialog].forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

quoteForm.addEventListener('input', (event) => {
  quoteStatus.textContent = '';
  if (event.target.matches('input, textarea')) {
    event.target.removeAttribute('aria-invalid');
    const error = document.getElementById(event.target.getAttribute('aria-describedby'));
    if (error) {
      error.textContent = '';
    }
  }
});

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateQuoteForm()) {
    return;
  }

  quoteStatus.textContent = translate('quote.success');
  const productName = selectedProduct.name[currentLanguage];
  quoteForm.reset();
  quoteForm.querySelector('[data-quote-product-input]').value = productName;
});

if (!reduceMotion) {
  root.classList.add('language-fade-ready');
}

applyLanguage(currentLanguage, { persist: false });
