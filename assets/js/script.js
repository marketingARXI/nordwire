const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

const capturePortuguese = () => {
  const messages = {};
  document.querySelectorAll('[data-i18n]').forEach((node) => { messages[node.dataset.i18n] = node.textContent.trim(); });
  document.querySelectorAll('[data-i18n-lines]').forEach((node) => {
    messages[node.dataset.i18nLines] = [...node.querySelectorAll('.controlled-line')].map((line) => line.textContent.trim());
  });
  const attributes = [
    ['data-i18n-content', 'content'], ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-alt', 'alt'], ['data-i18n-success-message', 'data-success-message']
  ];
  attributes.forEach(([selector, attribute]) => document.querySelectorAll(`[${selector}]`).forEach((node) => {
    messages[node.getAttribute(selector)] = node.getAttribute(attribute) || '';
  }));
  return messages;
};

const en = {
  'meta.title': 'NordWire - Electronic systems for industry',
  'meta.description': 'NordWire develops electronic systems, industrial monitoring and tailored solutions for the factory floor.',
  'preloader.label': 'Loading site', 'backToTop.label': 'Back to top',
  'hero.title': 'It all starts on the factory floor.',
  'hero.subtitle': 'NordWire builds electronic systems that capture everything happening on your production line - turning every second into useful information.',
  'cta.explore': 'Explore More', 'cta.partner': 'Become a Partner',
  'whatWeDo.eyebrow': 'What we do', 'whatWeDo.title': 'Every machine has a story to tell.',
  'whatWeDo.subtitle': ['Every day, your factory floor generates thousands of data points.', "The question isn't whether they exist, it's whether you're making the most of them."],
  'whatWeDo.cardsLabel': 'What we do highlights',
  'whatWeDo.card1Title': 'Real time', 'whatWeDo.card1Text': 'Data captured as it happens.',
  'whatWeDo.card2Title': 'Remote access', 'whatWeDo.card2Text': 'Production accessible wherever you are.',
  'whatWeDo.card3Title': 'Tailored to you', 'whatWeDo.card3Text': 'Solutions made for your factory.',
  'monitoring.eyebrow': 'Monitoring', 'monitoring.title': ['The sensors capture.', 'Nothing gets lost.'],
  'monitoring.subtitle': "Sensors we develop record each machine's activity in real time. Access to the information is simple and immediate, right next to each piece of equipment.",
  'monitoring.dashboardCta': 'See how sensors capture activity',
  'monitoring.dashboardAlt': 'NordWire monitoring dashboard with real-time production data.',
  'cloud.eyebrow': 'Cloud', 'cloud.title': ['From the factory floor', 'to wherever you are.'],
  'cloud.subtitle': 'Information travels from the sensor to the cloud in seconds, becoming accessible from any computer or phone. What happens in production no longer stays trapped in production.',
  'nordgo.eyebrow': 'NordGo', 'nordgo.title': 'NordGo - your factory in your pocket.',
  'nordgo.subtitle': 'Track everything in real time, review the history and get what matters, wherever you are. Your production, always a tap away.',
  'nordgo.cardsLabel': 'NordGo features',
  'nordgo.card1Title': 'Real time', 'nordgo.card1Text': 'Follow production by the minute, wherever you are.',
  'nordgo.card2Title': 'History', 'nordgo.card2Text': 'Review what happened and compare periods.',
  'nordgo.card3Title': 'Notifications', 'nordgo.card3Text': 'Get alerts about what really matters.',
  'prototyping.eyebrow': 'Prototyping', 'prototyping.title': ['From concept', 'to the finished product.'],
  'prototyping.subtitle': 'Every solution is built from scratch for your factory floor - from the circuit to the enclosure. Hardware and software designed for your case, not just any case.',
  'prototyping.cardsLabel': 'Prototyping stages',
  'prototyping.card1Title': 'Hardware', 'prototyping.card1Text': 'From circuit to enclosure, built from scratch.',
  'prototyping.card2Title': 'Software', 'prototyping.card2Text': 'Firmware and interface designed for your case.',
  'prototyping.card3Title': 'Production', 'prototyping.card3Text': 'From prototype to finished product, with us.',
  'prototyping.modelAlt': 'Interactive 3D model of the NordWire prototype device.',
  'prototyping.modelLabel': 'Interactive 3D model of the NordWire prototype device. Rotate it with the mouse, touch or arrow keys.',
  'partners.eyebrow': 'Partner Programme', 'partners.title': 'We grow better when we grow together.',
  'partners.subtitle': 'Bring NordWire industrial technology to more factories, with technical support, training and conditions designed to create value together.',
  'partners.openModal': 'I want to be a partner',
  'contact.eyebrow': 'Contact', 'contact.title': "Let's take your data further.",
  'contact.subtitle': "Tell us what's happening on your factory floor. We'll handle the rest.",
  'contact.submit': 'Send', 'contact.success': 'Message received. Thank you for contacting us!',
  'contact.formLabel': 'Contact form', 'form.name': 'Name', 'form.company': 'Company',
  'form.email': 'Email', 'form.message': 'Message',
  'dashboardModal.kicker': 'NordWire Dashboard', 'dashboardModal.position': 'Real-time industrial monitoring.',
  'dashboardModal.closeLabel': 'Close dashboard', 'dashboardModal.featuresLabel': 'NordWire dashboard features',
  'dashboardModal.title': 'From the machine to the screen, in real time',
  'dashboardModal.subtitle': "NordWire sensors capture each machine's activity and turn it into the information you see on the dashboard.",
  'dashboardModal.oee.title': 'Sensors on every line',
  'dashboardModal.oee.description': "NordWire devices connected to the machines continuously capture activity, feeding the counters and each machine's status on the dashboard.",
  'dashboardModal.downtime.title': 'Automatic collection',
  'dashboardModal.downtime.description': 'Data is captured by the second, with no manual input, so the OEE and downtime you see are always real and up to date.',
  'dashboardModal.multiline.title': 'Sent to the cloud',
  'dashboardModal.multiline.description': 'The information is streamed in real time to the NordWire platform, letting you follow everything remotely on a single screen.',
  'dashboardModal.history.title': 'From signal to screen',
  'dashboardModal.history.description': 'Every captured signal turns into the charts, timeline and indicators you see on the dashboard.',
  'partnerModal.kicker': 'NordWire Partner Programme', 'partnerModal.position': 'Explore the programme and submit your application.',
  'partnerModal.closeLabel': 'Close partner programme',
  'partnerModal.benefits.eyebrow': 'Benefits', 'partnerModal.benefits.title': 'Everything you need to move forward.',
  'partnerModal.benefits.subtitle': 'A close relationship, with the tools and knowledge to respond better to every industrial project.',
  'partnerModal.benefits.support.title': 'Dedicated technical support', 'partnerModal.benefits.support.description': 'Direct access to our team to prepare integrations and solve challenges in the field.',
  'partnerModal.benefits.commercial.title': 'Commercial conditions', 'partnerModal.benefits.commercial.description': 'Conditions aligned with your business model and the growth of the partnership.',
  'partnerModal.benefits.training.title': 'Training and certification', 'partnerModal.benefits.training.description': 'Technical and commercial knowledge to present, install and support every solution.',
  'partnerModal.benefits.regional.title': 'Regional support', 'partnerModal.benefits.regional.description': 'Joint planning to develop opportunities and build a presence in your market.',
  'partnerModal.types.eyebrow': 'Partner types', 'partnerModal.types.title': 'Choose how you want to work with us.',
  'partnerModal.types.subtitle': 'Select the model that best represents your activity. You can change it in the form.',
  'partnerModal.types.integrator.title': 'Integrator', 'partnerModal.types.integrator.description': 'Designs and implements complete solutions, connecting NordWire technology to each factory process.',
  'partnerModal.types.distributor.title': 'Distributor', 'partnerModal.types.distributor.description': 'Represents and supplies the NordWire portfolio, bringing products closer to new markets and customers.',
  'partnerModal.process.eyebrow': 'How it works', 'partnerModal.process.title': 'A simple path to partnership.',
  'partnerModal.process.subtitle': 'From the first conversation to supporting your projects, we move forward one step at a time.',
  'partnerModal.process.step1.title': 'Application', 'partnerModal.process.step1.description': 'Tell us about your activity, market and objectives.',
  'partnerModal.process.step2.title': 'Alignment', 'partnerModal.process.step2.description': 'Together, we assess the model and the opportunities for collaboration.',
  'partnerModal.process.step3.title': 'Preparation', 'partnerModal.process.step3.description': 'We provide training, documentation and support so you can start with confidence.',
  'partnerModal.process.step4.title': 'Official partnership', 'partnerModal.process.step4.description': 'We activate the partnership and support your projects and growth.',
  'partnerModal.application.eyebrow': 'Application', 'partnerModal.application.title': "Let's build the next opportunity.",
  'partnerModal.application.subtitle': 'Tell us who you are and how you would like to work with NordWire. Our team will review the fit and follow up on your application.',
  'partnerModal.application.formLabel': 'Partner application form', 'partnerModal.application.submit': 'Submit application',
  'partnerModal.form.region': 'Country / Region', 'partnerModal.form.type': 'Partnership type', 'partnerModal.form.note': 'Note / Message'
};

window.NordWireI18n?.register({ pt: capturePortuguese(), en });

const preloader = document.querySelector('.site-preloader');
const preloaderStart = window.__nordwirePreloaderStartedAt || performance.now();
let preloaderDismissed = false;
const dismissPreloader = () => {
  if (preloaderDismissed) return;
  preloaderDismissed = true;
  const delay = Math.max(0, 1000 - (performance.now() - preloaderStart));
  window.setTimeout(() => {
    preloader?.classList.add('is-hidden');
    document.documentElement.classList.remove('preloader-pending');
    window.setTimeout(() => preloader?.remove(), reduceMotion ? 0 : 450);
  }, delay);
};
window.addEventListener('load', dismissPreloader, { once: true });
window.setTimeout(dismissPreloader, 4000);

const heroVideo = document.querySelector('.hero-background-video');
const revealHero = () => document.documentElement.classList.remove('hero-reveal-pending');
if (reduceMotion || coarsePointer || !heroVideo) revealHero();
else {
  let revealed = false;
  const revealOnce = () => { if (!revealed) { revealed = true; revealHero(); } };
  heroVideo.addEventListener('timeupdate', () => {
    if (Number.isFinite(heroVideo.duration) && heroVideo.duration - heroVideo.currentTime <= 1.5) revealOnce();
  });
  heroVideo.addEventListener('ended', revealOnce, { once: true });
  window.setTimeout(revealOnce, 6000);
}

document.documentElement.classList.add('js-reveal');
const revealNodes = [...document.querySelectorAll('[data-reveal]')];
if (reduceMotion || !('IntersectionObserver' in window)) revealNodes.forEach((node) => node.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }), { threshold: 0.15 });
  revealNodes.forEach((node, index) => {
    node.style.setProperty('--reveal-delay', `${(index % 3) * 110}ms`);
    observer.observe(node);
  });
}

document.querySelectorAll('[data-demo-form]').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const status = form.querySelector('.form-status');
  if (status) status.textContent = form.dataset.successMessage || '';
}));

const backToTop = document.querySelector('.back-to-top');
const updateBackToTop = () => {
  const visible = window.scrollY > 500;
  backToTop?.classList.toggle('is-visible', visible);
  backToTop?.setAttribute('aria-hidden', String(!visible));
  if (backToTop) backToTop.tabIndex = visible ? 0 : -1;
};
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

const cursor = document.querySelector('.custom-cursor');
if (cursor && !coarsePointer && !reduceMotion) {
  document.addEventListener('pointermove', (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')));
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
}

const prototypeModel = document.querySelector('#prototype-model');
if (prototypeModel) {
  let timer;
  let frame;
  let active = !reduceMotion;
  const animate = (time) => {
    if (!active) return;
    prototypeModel.cameraOrbit = `${114 + Math.sin(time / 1800) * 2.2}deg 70deg 110%`;
    frame = requestAnimationFrame(animate);
  };
  const pause = () => { active = false; clearTimeout(timer); if (frame) cancelAnimationFrame(frame); };
  const resume = () => { if (!reduceMotion) timer = window.setTimeout(() => { active = true; frame = requestAnimationFrame(animate); }, 2800); };
  ['pointerdown', 'keydown'].forEach((type) => prototypeModel.addEventListener(type, pause));
  ['pointerup', 'pointercancel', 'blur'].forEach((type) => prototypeModel.addEventListener(type, resume));
  if (active) frame = requestAnimationFrame(animate);
}
