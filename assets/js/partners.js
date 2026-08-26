const root = document.documentElement;
const languageButtons = Array.from(document.querySelectorAll('[data-language]'));
const partnerTypeCards = Array.from(document.querySelectorAll('[data-partner-type]'));
const partnerTypeSelect = document.querySelector('[data-partner-type-select]');
const partnerForm = document.querySelector('[data-partner-form]');
const partnerStatus = document.querySelector('[data-partner-status]');
const applicationSection = document.querySelector('#candidatura');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const languageStorageKey = 'nordwire-language';

const translations = {
  pt: {
    'meta.title': 'Parceiros NordWire - Crescer em conjunto',
    'meta.description': 'Programa de parceiros NordWire para integradores e distribuidores de tecnologia industrial.',
    'language.groupLabel': 'Seleção de idioma',
    'language.ptLabel': 'Usar Português',
    'language.enLabel': 'Usar Inglês',
    'header.back': 'Voltar ao site',
    'header.backLabel': 'Voltar ao site NordWire',
    'hero.eyebrow': 'Programa de Parceiros',
    'hero.title': 'Crescemos melhor quando crescemos juntos.',
    'hero.subtitle': 'Leva tecnologia industrial NordWire a mais fábricas, com apoio técnico, formação e condições pensadas para criar valor em conjunto.',
    'hero.cta': 'Quero ser parceiro',
    'benefits.eyebrow': 'Benefícios',
    'benefits.title': 'Tudo o que precisas para avançar.',
    'benefits.subtitle': 'Uma relação próxima, com ferramentas e conhecimento para responder melhor a cada projeto industrial.',
    'benefits.support.title': 'Apoio técnico dedicado',
    'benefits.support.description': 'Acesso direto à nossa equipa para preparar integrações e resolver desafios no terreno.',
    'benefits.commercial.title': 'Condições comerciais',
    'benefits.commercial.description': 'Condições ajustadas ao teu modelo de negócio e ao crescimento da parceria.',
    'benefits.training.title': 'Formação e certificação',
    'benefits.training.description': 'Conhecimento técnico e comercial para apresentar, instalar e acompanhar cada solução.',
    'benefits.regional.title': 'Apoio regional',
    'benefits.regional.description': 'Planeamento conjunto para desenvolver oportunidades e criar presença no teu mercado.',
    'types.eyebrow': 'Tipos de parceiro',
    'types.title': 'Escolhe como queres trabalhar connosco.',
    'types.subtitle': 'Seleciona o modelo que melhor representa a tua atividade. Podes alterar a opção no formulário.',
    'types.integrator.title': 'Integrador',
    'types.integrator.description': 'Desenha e implementa soluções completas, ligando a tecnologia NordWire aos processos de cada fábrica.',
    'types.distributor.title': 'Distribuidor',
    'types.distributor.description': 'Representa e disponibiliza o portefólio NordWire, aproximando os produtos de novos mercados e clientes.',
    'process.eyebrow': 'Como funciona',
    'process.title': 'Um caminho simples até à parceria.',
    'process.subtitle': 'Da primeira conversa ao acompanhamento dos teus projetos, avançamos etapa a etapa.',
    'process.step1.title': 'Candidatura',
    'process.step1.description': 'Partilha connosco a tua atividade, mercado e objetivos.',
    'process.step2.title': 'Alinhamento',
    'process.step2.description': 'Analisamos em conjunto o modelo e as oportunidades de colaboração.',
    'process.step3.title': 'Preparação',
    'process.step3.description': 'Damos formação, documentação e apoio para começares com confiança.',
    'process.step4.title': 'Parceria oficial',
    'process.step4.description': 'Ativamos a parceria e acompanhamos os projetos e o crescimento.',
    'application.eyebrow': 'Candidatura',
    'application.title': 'Vamos construir a próxima oportunidade.',
    'application.subtitle': 'Conta-nos quem és e como gostarias de trabalhar com a NordWire. A nossa equipa analisará o enquadramento e dará seguimento à candidatura.',
    'application.formLabel': 'Formulário de candidatura a parceiro',
    'application.submit': 'Enviar candidatura',
    'application.success': 'Candidatura registada com sucesso. Obrigado pelo teu interesse!',
    'form.name': 'Nome',
    'form.company': 'Empresa',
    'form.email': 'Email',
    'form.region': 'País / Região',
    'form.type': 'Tipo de parceria',
    'form.note': 'Nota / Mensagem',
    'validation.name': 'Indica o teu nome.',
    'validation.emailRequired': 'Indica o teu email.',
    'validation.emailInvalid': 'Introduz um email válido.',
  },
  en: {
    'meta.title': 'NordWire Partners - Growing together',
    'meta.description': 'The NordWire partner programme for industrial technology integrators and distributors.',
    'language.groupLabel': 'Language selection',
    'language.ptLabel': 'Use Portuguese',
    'language.enLabel': 'Use English',
    'header.back': 'Back to website',
    'header.backLabel': 'Back to the NordWire website',
    'hero.eyebrow': 'Partner Programme',
    'hero.title': 'We grow better when we grow together.',
    'hero.subtitle': 'Bring NordWire industrial technology to more factories with technical support, training and conditions designed to create value together.',
    'hero.cta': 'Become a partner',
    'benefits.eyebrow': 'Benefits',
    'benefits.title': 'Everything you need to move forward.',
    'benefits.subtitle': 'A close relationship, with the tools and knowledge to respond better to every industrial project.',
    'benefits.support.title': 'Dedicated technical support',
    'benefits.support.description': 'Direct access to our team to prepare integrations and solve challenges in the field.',
    'benefits.commercial.title': 'Commercial conditions',
    'benefits.commercial.description': 'Conditions aligned with your business model and the growth of the partnership.',
    'benefits.training.title': 'Training and certification',
    'benefits.training.description': 'Technical and commercial knowledge to present, install and support every solution.',
    'benefits.regional.title': 'Regional support',
    'benefits.regional.description': 'Joint planning to develop opportunities and build a presence in your market.',
    'types.eyebrow': 'Partner types',
    'types.title': 'Choose how you want to work with us.',
    'types.subtitle': 'Select the model that best represents your activity. You can change it in the form.',
    'types.integrator.title': 'Integrator',
    'types.integrator.description': 'Designs and implements complete solutions, connecting NordWire technology to each factory process.',
    'types.distributor.title': 'Distributor',
    'types.distributor.description': 'Represents and supplies the NordWire portfolio, bringing products closer to new markets and customers.',
    'process.eyebrow': 'How it works',
    'process.title': 'A simple path to partnership.',
    'process.subtitle': 'From the first conversation to supporting your projects, we move forward one step at a time.',
    'process.step1.title': 'Application',
    'process.step1.description': 'Tell us about your activity, market and objectives.',
    'process.step2.title': 'Alignment',
    'process.step2.description': 'Together, we assess the model and the opportunities for collaboration.',
    'process.step3.title': 'Preparation',
    'process.step3.description': 'We provide training, documentation and support so you can start with confidence.',
    'process.step4.title': 'Official partnership',
    'process.step4.description': 'We activate the partnership and support your projects and growth.',
    'application.eyebrow': 'Application',
    'application.title': 'Let’s build the next opportunity.',
    'application.subtitle': 'Tell us who you are and how you would like to work with NordWire. Our team will review the fit and follow up on your application.',
    'application.formLabel': 'Partner application form',
    'application.submit': 'Submit application',
    'application.success': 'Application registered successfully. Thank you for your interest!',
    'form.name': 'Name',
    'form.company': 'Company',
    'form.email': 'Email',
    'form.region': 'Country / Region',
    'form.type': 'Partnership type',
    'form.note': 'Note / Message',
    'validation.name': 'Enter your name.',
    'validation.emailRequired': 'Enter your email.',
    'validation.emailInvalid': 'Enter a valid email address.',
  },
};

const getStoredLanguage = () => {
  try {
    return window.localStorage.getItem(languageStorageKey) === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
};

let currentLanguage = getStoredLanguage();
let selectedPartnerType = 'integrator';
let languageTimer;
let focusTimer;

const translate = (key) => translations[currentLanguage]?.[key] ?? translations.pt[key] ?? key;

const clearFormState = () => {
  partnerStatus.textContent = '';
  partnerForm.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
    field.removeAttribute('aria-invalid');
  });
  partnerForm.querySelectorAll('.partners-field-error').forEach((error) => {
    error.textContent = '';
  });
};

const updatePartnerType = (type, { moveToForm = false } = {}) => {
  selectedPartnerType = type === 'distributor' ? 'distributor' : 'integrator';
  partnerTypeSelect.value = selectedPartnerType;

  partnerTypeCards.forEach((card) => {
    const active = card.dataset.partnerType === selectedPartnerType;
    card.classList.toggle('is-selected', active);
    card.setAttribute('aria-pressed', String(active));
  });

  if (!moveToForm) {
    return;
  }

  applicationSection.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  });

  window.clearTimeout(focusTimer);
  focusTimer = window.setTimeout(() => {
    partnerTypeSelect.focus({ preventScroll: true });
  }, reduceMotion ? 0 : 450);
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

const setFieldError = (field, message) => {
  field.setAttribute('aria-invalid', 'true');
  const error = document.getElementById(field.getAttribute('aria-describedby'));
  if (error) {
    error.textContent = message;
  }
};

const validatePartnerForm = () => {
  clearFormState();
  const name = partnerForm.elements.nome;
  const email = partnerForm.elements.email;

  if (!name.value.trim()) {
    setFieldError(name, translate('validation.name'));
  }

  if (!email.value.trim()) {
    setFieldError(email, translate('validation.emailRequired'));
  } else if (!email.validity.valid) {
    setFieldError(email, translate('validation.emailInvalid'));
  }

  const firstInvalid = partnerForm.querySelector('[aria-invalid="true"]');
  firstInvalid?.focus();
  return !firstInvalid;
};

languageButtons.forEach((button) => {
  button.addEventListener('click', () => switchLanguage(button.dataset.language));
});

partnerTypeCards.forEach((card) => {
  card.addEventListener('click', () => updatePartnerType(card.dataset.partnerType, { moveToForm: true }));
});

partnerTypeSelect.addEventListener('change', () => updatePartnerType(partnerTypeSelect.value));

partnerForm.addEventListener('input', (event) => {
  partnerStatus.textContent = '';
  if (!event.target.matches('input, textarea')) {
    return;
  }

  event.target.removeAttribute('aria-invalid');
  const error = document.getElementById(event.target.getAttribute('aria-describedby'));
  if (error) {
    error.textContent = '';
  }
});

partnerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validatePartnerForm()) {
    return;
  }

  partnerStatus.textContent = translate('application.success');
  partnerForm.reset();
  updatePartnerType(selectedPartnerType);
});

if (!reduceMotion) {
  root.classList.add('language-fade-ready');
}

applyLanguage(currentLanguage, { persist: false });
updatePartnerType(selectedPartnerType);
