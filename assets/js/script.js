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
const preloaderModel = document.querySelector('#prototype-model');
const preloader = document.querySelector('.site-preloader');
const backToTopButton = document.querySelector('.back-to-top');
const revealGroups = Array.from(document.querySelectorAll('[data-reveal]'))
  .filter((group) => (
    !group.closest('#inicio')
    && !group.matches('.prototype-model-column')
  ));
const hotspotButtons = Array.from(document.querySelectorAll('[data-hotspot]'));
const demoForms = Array.from(document.querySelectorAll('[data-demo-form]'));
const placeholderLinks = Array.from(document.querySelectorAll('[data-placeholder-link]'));
const languageButtons = Array.from(document.querySelectorAll('[data-language]'));
const ambientLayers = Array.from(document.querySelectorAll('[data-ambient-background]'));
const customCursor = document.querySelector('.custom-cursor');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const horizontalMedia = window.matchMedia('(min-width: 768px)');
const staticHeroMedia = window.matchMedia('(max-width: 1024px)');
const ambientPointerMedia = window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
const customCursorMedia = window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
const sections = Array.from(main?.querySelectorAll(':scope > section') ?? []);
const countUpNumbers = Array.from(document.querySelectorAll('[data-count-up]'));
const sectionByHash = new Map(sections.map((section) => [`#${section.id}`, section]));
const sectionLinks = Array.from(document.querySelectorAll('a[href^="#"]'))
  .filter((link) => sectionByHash.has(link.getAttribute('href')));
const initialSectionTarget = sectionByHash.get(window.location.hash);

if (initialSectionTarget && initialSectionTarget !== homeSection) {
  header?.classList.add('is-hero-visible');
}

let activeSectionIndex = 0;
let horizontalProgress;
let horizontalProgressButtons = [];
let wheelLocked = false;
let wheelLockTimer;
let wheelGestureDelta = 0;
let wheelGestureLastAt = 0;
let wheelLockUntil = 0;
let horizontalScrollFrame;
let horizontalAnimationFrame;
let horizontalAnimationTargetIndex;
let heroRevealTimer;
let preloaderDismissTimer;
let preloaderDismissScheduled = false;
let ambientGlowFrame;
let activeAmbientLayer;
let ambientGlowX = 68;
let ambientGlowY = 34;
let ambientTargetX = 68;
let ambientTargetY = 34;
let languageTransitionTimer;
let customCursorFrame;
let customCursorX = 0;
let customCursorY = 0;
let customCursorTargetX = 0;
let customCursorTargetY = 0;
let customCursorHasPosition = false;
let refreshModelLocalization = () => {};

const languageStorageKey = 'nordwire-language';
const translations = {
  pt: {
    'meta.title': 'NordWire - Sistemas eletrónicos para a indústria',
    'meta.description': 'A NordWire desenvolve sistemas eletrónicos, monitorização industrial e soluções à medida para o chão de fábrica.',
    'language.groupLabel': 'Seleção de idioma',
    'language.ptLabel': 'Usar Português',
    'language.enLabel': 'Usar Inglês',
    'preloader.label': 'A carregar o site',
    'backToTop.label': 'Voltar ao início',
    'cursor.drag': 'Arrastar',
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
    'whatWeDo.card1Text': 'Dados capturados no momento.',
    'whatWeDo.card2Title': 'Acesso remoto',
    'whatWeDo.card2Text': 'Produção acessível onde estiveres.',
    'whatWeDo.card3Title': 'À tua medida',
    'whatWeDo.card3Text': 'Soluções feitas para a tua fábrica.',
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
    'products.subtitle': 'Explora a nossa gama de produtos, criada para ligar o chão de fábrica a decisões mais rápidas.',
    'products.storeButton': 'Ver catálogo completo',
    'products.showcaseLabel': 'Produtos em destaque',
    'products.feature1Category': 'Sensores',
    'products.feature1Text': 'Sensor compacto de temperatura e vibração.',
    'products.feature2Category': 'Sensores',
    'products.feature2Text': 'Sensor ótico para contagem e presença.',
    'products.feature3Category': 'Gateways',
    'products.feature3Text': 'Gateway industrial para dados em tempo real.',
    'products.feature4Category': 'Gateways',
    'products.feature4Text': 'Controlador de entradas e saídas industriais.',
    'products.priceOnRequest': 'Preço sob consulta',
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
    'partners.eyebrow': 'Programa de Parceiros',
    'partners.title': 'Crescemos melhor quando crescemos juntos.',
    'partners.subtitle': 'Leva tecnologia industrial NordWire a mais fábricas, com apoio técnico, formação e condições pensadas para criar valor em conjunto.',
    'partners.openModal': 'Quero ser parceiro',
    'partnerModal.kicker': 'Programa de Parceiros NordWire',
    'partnerModal.position': 'Descobre o programa e envia a tua candidatura.',
    'partnerModal.closeLabel': 'Fechar programa de parceiros',
    'partnerModal.benefits.eyebrow': 'Benefícios',
    'partnerModal.benefits.title': 'Tudo o que precisas para avançar.',
    'partnerModal.benefits.subtitle': 'Uma relação próxima, com ferramentas e conhecimento para responder melhor a cada projeto industrial.',
    'partnerModal.benefits.support.title': 'Apoio técnico dedicado',
    'partnerModal.benefits.support.description': 'Acesso direto à nossa equipa para preparar integrações e resolver desafios no terreno.',
    'partnerModal.benefits.commercial.title': 'Condições comerciais',
    'partnerModal.benefits.commercial.description': 'Condições ajustadas ao teu modelo de negócio e ao crescimento da parceria.',
    'partnerModal.benefits.training.title': 'Formação e certificação',
    'partnerModal.benefits.training.description': 'Conhecimento técnico e comercial para apresentar, instalar e acompanhar cada solução.',
    'partnerModal.benefits.regional.title': 'Apoio regional',
    'partnerModal.benefits.regional.description': 'Planeamento conjunto para desenvolver oportunidades e criar presença no teu mercado.',
    'partnerModal.types.eyebrow': 'Tipos de parceiro',
    'partnerModal.types.title': 'Escolhe como queres trabalhar connosco.',
    'partnerModal.types.subtitle': 'Seleciona o modelo que melhor representa a tua atividade. Podes alterar a opção no formulário.',
    'partnerModal.types.integrator.title': 'Integrador',
    'partnerModal.types.integrator.description': 'Desenha e implementa soluções completas, ligando a tecnologia NordWire aos processos de cada fábrica.',
    'partnerModal.types.distributor.title': 'Distribuidor',
    'partnerModal.types.distributor.description': 'Representa e disponibiliza o portefólio NordWire, aproximando os produtos de novos mercados e clientes.',
    'partnerModal.process.eyebrow': 'Como funciona',
    'partnerModal.process.title': 'Um caminho simples até à parceria.',
    'partnerModal.process.subtitle': 'Da primeira conversa ao acompanhamento dos teus projetos, avançamos etapa a etapa.',
    'partnerModal.process.step1.title': 'Candidatura',
    'partnerModal.process.step1.description': 'Partilha connosco a tua atividade, mercado e objetivos.',
    'partnerModal.process.step2.title': 'Alinhamento',
    'partnerModal.process.step2.description': 'Analisamos em conjunto o modelo e as oportunidades de colaboração.',
    'partnerModal.process.step3.title': 'Preparação',
    'partnerModal.process.step3.description': 'Damos formação, documentação e apoio para começares com confiança.',
    'partnerModal.process.step4.title': 'Parceria oficial',
    'partnerModal.process.step4.description': 'Ativamos a parceria e acompanhamos os projetos e o crescimento.',
    'partnerModal.application.eyebrow': 'Candidatura',
    'partnerModal.application.title': 'Vamos construir a próxima oportunidade.',
    'partnerModal.application.subtitle': 'Conta-nos quem és e como gostarias de trabalhar com a NordWire. A nossa equipa analisará o enquadramento e dará seguimento à candidatura.',
    'partnerModal.application.formLabel': 'Formulário de candidatura a parceiro',
    'partnerModal.application.submit': 'Enviar candidatura',
    'partnerModal.form.region': 'País / Região',
    'partnerModal.form.type': 'Tipo de parceria',
    'partnerModal.form.note': 'Nota / Mensagem',
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
    'preloader.label': 'Loading website',
    'backToTop.label': 'Back to top',
    'cursor.drag': 'Drag',
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
    'whatWeDo.card1Text': 'Data captured as it happens.',
    'whatWeDo.card2Title': 'Remote access',
    'whatWeDo.card2Text': 'Production accessible anywhere.',
    'whatWeDo.card3Title': 'Tailored to you',
    'whatWeDo.card3Text': 'Solutions built for your factory.',
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
    'products.subtitle': 'Explore our product range, built to connect the factory floor to faster decisions.',
    'products.storeButton': 'View full catalogue',
    'products.showcaseLabel': 'Featured products',
    'products.feature1Category': 'Sensors',
    'products.feature1Text': 'Compact temperature and vibration sensor.',
    'products.feature2Category': 'Sensors',
    'products.feature2Text': 'Optical sensor for counting and presence.',
    'products.feature3Category': 'Gateways',
    'products.feature3Text': 'Industrial gateway for real-time data.',
    'products.feature4Category': 'Gateways',
    'products.feature4Text': 'Industrial input and output controller.',
    'products.priceOnRequest': 'Price on request',
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
    'partners.eyebrow': 'Partner Programme',
    'partners.title': 'We grow better when we grow together.',
    'partners.subtitle': 'Bring NordWire industrial technology to more factories with technical support, training and conditions designed to create value together.',
    'partners.openModal': 'I want to be a partner',
    'partnerModal.kicker': 'NordWire Partner Programme',
    'partnerModal.position': 'Explore the programme and submit your application.',
    'partnerModal.closeLabel': 'Close partner programme',
    'partnerModal.benefits.eyebrow': 'Benefits',
    'partnerModal.benefits.title': 'Everything you need to move forward.',
    'partnerModal.benefits.subtitle': 'A close relationship, with the tools and knowledge to respond better to every industrial project.',
    'partnerModal.benefits.support.title': 'Dedicated technical support',
    'partnerModal.benefits.support.description': 'Direct access to our team to prepare integrations and solve challenges in the field.',
    'partnerModal.benefits.commercial.title': 'Commercial conditions',
    'partnerModal.benefits.commercial.description': 'Conditions aligned with your business model and the growth of the partnership.',
    'partnerModal.benefits.training.title': 'Training and certification',
    'partnerModal.benefits.training.description': 'Technical and commercial knowledge to present, install and support every solution.',
    'partnerModal.benefits.regional.title': 'Regional support',
    'partnerModal.benefits.regional.description': 'Joint planning to develop opportunities and build a presence in your market.',
    'partnerModal.types.eyebrow': 'Partner types',
    'partnerModal.types.title': 'Choose how you want to work with us.',
    'partnerModal.types.subtitle': 'Select the model that best represents your activity. You can change it in the form.',
    'partnerModal.types.integrator.title': 'Integrator',
    'partnerModal.types.integrator.description': 'Designs and implements complete solutions, connecting NordWire technology to each factory process.',
    'partnerModal.types.distributor.title': 'Distributor',
    'partnerModal.types.distributor.description': 'Represents and supplies the NordWire portfolio, bringing products closer to new markets and customers.',
    'partnerModal.process.eyebrow': 'How it works',
    'partnerModal.process.title': 'A simple path to partnership.',
    'partnerModal.process.subtitle': 'From the first conversation to supporting your projects, we move forward one step at a time.',
    'partnerModal.process.step1.title': 'Application',
    'partnerModal.process.step1.description': 'Tell us about your activity, market and objectives.',
    'partnerModal.process.step2.title': 'Alignment',
    'partnerModal.process.step2.description': 'Together, we assess the model and the opportunities for collaboration.',
    'partnerModal.process.step3.title': 'Preparation',
    'partnerModal.process.step3.description': 'We provide training, documentation and support so you can start with confidence.',
    'partnerModal.process.step4.title': 'Official partnership',
    'partnerModal.process.step4.description': 'We activate the partnership and support your projects and growth.',
    'partnerModal.application.eyebrow': 'Application',
    'partnerModal.application.title': 'Let’s build the next opportunity.',
    'partnerModal.application.subtitle': 'Tell us who you are and how you would like to work with NordWire. Our team will review the fit and follow up on your application.',
    'partnerModal.application.formLabel': 'Partner application form',
    'partnerModal.application.submit': 'Submit application',
    'partnerModal.form.region': 'Country / Region',
    'partnerModal.form.type': 'Partnership type',
    'partnerModal.form.note': 'Note / Message',
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

if (!reduceMotion) {
  documentRoot.classList.add('language-fade-ready');
}

const switchLanguage = (language) => {
  const nextLanguage = language === 'en' ? 'en' : 'pt';

  if (nextLanguage === currentLanguage) {
    return;
  }

  window.clearTimeout(languageTransitionTimer);

  if (reduceMotion) {
    applyLanguage(nextLanguage);
    return;
  }

  documentRoot.classList.add('language-switching');
  languageTransitionTimer = window.setTimeout(() => {
    applyLanguage(nextLanguage);
    window.requestAnimationFrame(() => {
      documentRoot.classList.remove('language-switching');
    });
  }, 130);
};

const hidePreloader = (reason) => {
  if (!documentRoot.classList.contains('preloader-pending') || preloaderDismissScheduled) {
    return;
  }

  preloaderDismissScheduled = true;
  const startedAt = Number(window.__nordwirePreloaderStartedAt) || performance.now();
  const remainingMinimum = Math.max(0, 1000 - (performance.now() - startedAt));

  preloaderDismissTimer = window.setTimeout(() => {
    documentRoot.classList.remove('preloader-pending');
    preloader?.setAttribute('data-dismiss-reason', reason);
    window.setTimeout(() => {
      if (preloader) {
        preloader.hidden = true;
      }
    }, reduceMotion ? 0 : 450);
  }, remainingMinimum);
};

const waitForHeroMedia = () => new Promise((resolve) => {
  if (!heroVideo || staticHeroMedia.matches || heroVideo.readyState >= 2) {
    resolve('hero-ready');
    return;
  }

  const finish = () => resolve('hero-ready');
  heroVideo.addEventListener('loadeddata', finish, { once: true });
  heroVideo.addEventListener('error', finish, { once: true });
});

const waitForModelComponent = () => {
  if (!preloaderModel || !window.customElements?.whenDefined) {
    return Promise.resolve('model-fallback');
  }

  return window.customElements.whenDefined('model-viewer');
};

if (reduceMotion) {
  hidePreloader('reduced-motion');
} else {
  Promise.race([
    Promise.all([waitForHeroMedia(), waitForModelComponent()]),
    new Promise((resolve) => window.setTimeout(resolve, 4200)),
  ]).then(() => hidePreloader('essential-content-ready'));
}

const renderAmbientGlow = () => {
  ambientGlowX += (ambientTargetX - ambientGlowX) * 0.09;
  ambientGlowY += (ambientTargetY - ambientGlowY) * 0.09;
  activeAmbientLayer?.style.setProperty('--ambient-glow-x', `${ambientGlowX.toFixed(2)}%`);
  activeAmbientLayer?.style.setProperty('--ambient-glow-y', `${ambientGlowY.toFixed(2)}%`);

  const stillMoving = Math.abs(ambientTargetX - ambientGlowX) > 0.05
    || Math.abs(ambientTargetY - ambientGlowY) > 0.05;
  ambientGlowFrame = stillMoving
    ? window.requestAnimationFrame(renderAmbientGlow)
    : undefined;
};

const handleAmbientPointer = (event) => {
  if (reduceMotion || !ambientPointerMedia.matches || !ambientLayers.length) {
    return;
  }

  const section = event.target.closest?.('section');
  const layer = section?.querySelector('[data-ambient-background]');
  if (!layer) {
    return;
  }

  const sectionRect = section.getBoundingClientRect();
  ambientTargetX = Math.max(0, Math.min(100, ((event.clientX - sectionRect.left) / sectionRect.width) * 100));
  ambientTargetY = Math.max(0, Math.min(100, ((event.clientY - sectionRect.top) / sectionRect.height) * 100));

  if (activeAmbientLayer !== layer) {
    activeAmbientLayer = layer;
    const layerStyles = getComputedStyle(layer);
    ambientGlowX = Number.parseFloat(layerStyles.getPropertyValue('--ambient-glow-x')) || 50;
    ambientGlowY = Number.parseFloat(layerStyles.getPropertyValue('--ambient-glow-y')) || 50;
  }

  if (!ambientGlowFrame) {
    ambientGlowFrame = window.requestAnimationFrame(renderAmbientGlow);
  }
};

main?.addEventListener('pointermove', handleAmbientPointer, { passive: true });

const renderCustomCursor = () => {
  customCursorX += (customCursorTargetX - customCursorX) * 0.22;
  customCursorY += (customCursorTargetY - customCursorY) * 0.22;
  customCursor.style.transform = `translate3d(${customCursorX.toFixed(2)}px, ${customCursorY.toFixed(2)}px, 0)`;

  const stillMoving = Math.abs(customCursorTargetX - customCursorX) > 0.08
    || Math.abs(customCursorTargetY - customCursorY) > 0.08;
  customCursorFrame = stillMoving
    ? window.requestAnimationFrame(renderCustomCursor)
    : undefined;
};

const syncCustomCursor = () => {
  const enabled = Boolean(customCursor) && customCursorMedia.matches && !reduceMotion;
  documentRoot.classList.toggle('custom-cursor-enabled', enabled);

  if (!enabled) {
    customCursor?.classList.remove('is-visible', 'is-interactive', 'is-drag', 'is-dragging');
    customCursorHasPosition = false;
    window.cancelAnimationFrame(customCursorFrame);
    customCursorFrame = undefined;
  }
};

const handleCustomCursorMove = (event) => {
  if (!documentRoot.classList.contains('custom-cursor-enabled')) {
    return;
  }

  const eventPath = event.composedPath();
  const isModel = eventPath.some((node) => (
    node === preloaderModel
    || node?.classList?.contains?.('prototype-model-viewer')
  ));
  const isInteractive = Boolean(event.target.closest?.(
    'a, button, input, textarea, select, [role="button"], [data-hotspot]',
  ));
  const shouldShow = isModel || isInteractive;

  if (!shouldShow) {
    customCursor.classList.remove('is-visible', 'is-interactive', 'is-drag', 'is-dragging');
    customCursorHasPosition = false;
    window.cancelAnimationFrame(customCursorFrame);
    customCursorFrame = undefined;
    return;
  }

  customCursorTargetX = event.clientX;
  customCursorTargetY = event.clientY;

  if (!customCursorHasPosition) {
    customCursorX = customCursorTargetX;
    customCursorY = customCursorTargetY;
    customCursorHasPosition = true;
  }

  customCursor.classList.add('is-visible');
  customCursor.classList.toggle('is-drag', isModel);
  customCursor.classList.toggle('is-interactive', isInteractive && !isModel);

  if (!customCursorFrame) {
    customCursorFrame = window.requestAnimationFrame(renderCustomCursor);
  }
};

syncCustomCursor();
customCursorMedia.addEventListener('change', syncCustomCursor);
document.addEventListener('pointermove', handleCustomCursorMove, { passive: true });
document.addEventListener('pointerdown', (event) => {
  if (event.composedPath().includes(preloaderModel)) {
    customCursor?.classList.add('is-dragging');
  }
});
document.addEventListener('pointerup', () => {
  customCursor?.classList.remove('is-dragging');
});
document.addEventListener('pointerout', (event) => {
  if (!event.relatedTarget) {
    customCursor?.classList.remove('is-visible', 'is-dragging');
  }
});
window.addEventListener('blur', () => {
  customCursor?.classList.remove('is-visible', 'is-dragging');
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    closeHotspots();
    switchLanguage(button.dataset.language);
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

const heroRevealLeadSeconds = 1.5;

const revealHeroIntro = (reason) => {
  window.clearTimeout(heroRevealTimer);
  heroCopy?.classList.add('is-hero-visible');
  header?.classList.add('is-hero-visible');

  if (heroCopy) {
    heroCopy.dataset.revealReason = reason;
  }
};

const maybeRevealHeroIntro = () => {
  if (!heroVideo || !Number.isFinite(heroVideo.duration) || heroVideo.duration <= 0) {
    return;
  }

  const revealAt = Math.max(0, heroVideo.duration - heroRevealLeadSeconds);
  if (heroVideo.currentTime >= revealAt) {
    revealHeroIntro('video-final-window');
    heroVideo.removeEventListener('timeupdate', maybeRevealHeroIntro);
    heroVideo.removeEventListener('durationchange', maybeRevealHeroIntro);
  }
};

const freezeHeroOnFinalFrame = () => {
  if (!heroVideo) {
    return;
  }

  heroVideo.pause();
  revealHeroIntro('video-ended');
};

if (!heroCopy) {
  documentRoot.classList.remove('hero-reveal-pending');
} else if (reduceMotion) {
  revealHeroIntro('reduced-motion');
} else if (!heroVideo || staticHeroMedia.matches) {
  revealHeroIntro('static-background');
} else {
  heroVideo.loop = false;
  heroVideo.addEventListener('loadedmetadata', maybeRevealHeroIntro, { once: true });
  heroVideo.addEventListener('durationchange', maybeRevealHeroIntro);
  heroVideo.addEventListener('timeupdate', maybeRevealHeroIntro);
  heroVideo.addEventListener('ended', freezeHeroOnFinalFrame, { once: true });
  heroRevealTimer = window.setTimeout(() => {
    revealHeroIntro('video-timing-fallback');
  }, 7000);

  if (heroVideo.ended) {
    freezeHeroOnFinalFrame();
  } else {
    maybeRevealHeroIntro();
  }
}

staticHeroMedia.addEventListener('change', (event) => {
  if (event.matches) {
    revealHeroIntro('static-background');
  }
});

const closeNav = ({ restoreFocus = false } = {}) => {
  body.classList.remove('nav-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', translate('header.openMenu'));
  const showBackToTop = activeSectionIndex > 0;
  backToTopButton?.setAttribute('tabindex', showBackToTop ? '0' : '-1');
  backToTopButton?.setAttribute('aria-hidden', String(!showBackToTop));

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
  backToTopButton?.setAttribute('tabindex', open || activeSectionIndex === 0 ? '-1' : '0');
  backToTopButton?.setAttribute('aria-hidden', String(open || activeSectionIndex === 0));
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
  sections.forEach((section, sectionIndex) => {
    section.classList.toggle('is-ambient-active', sectionIndex === activeSectionIndex);
  });
  const showBackToTop = activeSectionIndex > 0 && !body.classList.contains('nav-open');
  backToTopButton?.classList.toggle('is-visible', showBackToTop);
  backToTopButton?.setAttribute('tabindex', showBackToTop ? '0' : '-1');
  backToTopButton?.setAttribute('aria-hidden', String(!showBackToTop));

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

backToTopButton?.addEventListener('click', () => navigateToSection(0));

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

const touchpadGestureThreshold = 42;
const wheelGestureIdleMs = 180;
const wheelNavigationLockMs = 1000;

const scheduleWheelUnlock = () => {
  window.clearTimeout(wheelLockTimer);

  const now = performance.now();
  const animationDelay = horizontalAnimationFrame ? 80 : 0;
  const remainingDelay = Math.max(
    wheelLockUntil - now,
    (wheelGestureLastAt + wheelGestureIdleMs) - now,
    animationDelay,
  );

  if (remainingDelay > 0) {
    wheelLockTimer = window.setTimeout(
      scheduleWheelUnlock,
      Math.max(32, remainingDelay),
    );
    return;
  }

  wheelLocked = false;
  wheelGestureDelta = 0;
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

  const eventTime = performance.now();
  if (eventTime - wheelGestureLastAt > wheelGestureIdleMs) {
    wheelGestureDelta = 0;
  }
  wheelGestureLastAt = eventTime;

  const rawDirection = Math.sign(event.deltaY);
  const currentIndex = getHorizontalSectionIndex();
  const currentSection = sections[currentIndex];
  if (!currentSection || !rawDirection) {
    return;
  }

  if (hasScrollableVerticalContent(currentSection)) {
    const atTop = currentSection.scrollTop <= 1;
    const atBottom = (
      currentSection.scrollTop + currentSection.clientHeight
      >= currentSection.scrollHeight - 2
    );

    if ((rawDirection > 0 && !atBottom) || (rawDirection < 0 && !atTop)) {
      wheelGestureDelta = 0;
      return;
    }
  }

  event.preventDefault();
  if (wheelLocked) {
    scheduleWheelUnlock();
    return;
  }

  const isLikelyTouchpad = (
    event.deltaMode === WheelEvent.DOM_DELTA_PIXEL
    && Math.abs(event.deltaY) < 48
  );

  if (isLikelyTouchpad) {
    if (
      wheelGestureDelta
      && Math.sign(wheelGestureDelta) !== rawDirection
    ) {
      wheelGestureDelta = event.deltaY;
    } else {
      wheelGestureDelta += event.deltaY;
    }

    if (Math.abs(wheelGestureDelta) < touchpadGestureThreshold) {
      return;
    }
  }

  const direction = isLikelyTouchpad
    ? Math.sign(wheelGestureDelta)
    : rawDirection;
  if (!direction) {
    return;
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= sections.length) {
    wheelGestureDelta = 0;
    return;
  }

  wheelLocked = true;
  wheelGestureDelta = 0;
  wheelLockUntil = eventTime + (reduceMotion ? 120 : wheelNavigationLockMs);
  const targetSection = sections[nextIndex];
  const targetHasScrollableContent = hasScrollableVerticalContent(targetSection);
  targetSection.scrollTop = direction < 0 && targetHasScrollableContent
    ? Math.max(0, targetSection.scrollHeight - targetSection.clientHeight)
    : 0;
  navigateToSection(nextIndex, { resetVertical: false });
  scheduleWheelUnlock();
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
  wheelGestureDelta = 0;
  wheelLockUntil = 0;
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

const restoreSectionFromLocation = () => {
  const target = sectionByHash.get(window.location.hash);
  const targetIndex = sections.indexOf(target);

  if (targetIndex < 0) {
    return;
  }

  if (targetIndex > 0) {
    header?.classList.add('is-hero-visible');
    documentRoot.classList.remove('section-entry');
  }

  if (isHorizontalLayout()) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    positionHorizontalSection(targetIndex);
  } else {
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  updateNavigationState(targetIndex);
};

const scheduleSectionRestore = () => {
  restoreSectionFromLocation();
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(restoreSectionFromLocation);
  });
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
scheduleSectionRestore();
updateHeader();
setActiveLink();
window.addEventListener('load', scheduleSectionRestore, { once: true });
window.addEventListener('pageshow', scheduleSectionRestore);

const revealTargetSelector = [
  '.eyebrow',
  'h1',
  'h2',
  '.hero-subtitle',
  '.section-copy > p',
  '.hero-actions',
  '.feature-item',
  '.value-highlight',
  '.featured-product-card',
  '.product-actions',
  '.prototype-model-column',
  '.copy-actions',
  '.stat-block',
].join(',');

const revealCounts = new WeakMap();
const revealTargets = revealGroups.flatMap((group) => {
  const revealAsGroup = group.classList.contains('what-we-do-note-list');
  const nestedTargets = revealAsGroup
    ? []
    : Array.from(group.querySelectorAll(revealTargetSelector));
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
