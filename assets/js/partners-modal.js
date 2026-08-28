const siteModals = Array.from(document.querySelectorAll('[data-site-modal]'));
const partnerModal = document.querySelector('[data-partner-modal]');
const partnerModalScroll = document.querySelector('[data-partner-modal-scroll]');
const partnerApplication = document.querySelector('[data-partner-application]');
const partnerTypeCards = Array.from(document.querySelectorAll('[data-partner-type]'));
const partnerTypeSelect = document.querySelector('[data-partner-type-select]');
const partnerForm = document.querySelector('[data-partner-form]');
const partnerStatus = document.querySelector('[data-partner-status]');
const partnerReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const modalDocumentRoot = document.documentElement;
const modalBody = document.body;
const pageMain = document.querySelector('main');
let activeSiteModal = null;
let activeModalOpener = null;
let siteModalCloseTimer;
let savedWindowScrollY = 0;
let savedMainScrollLeft = 0;

const lockBackgroundScroll = () => {
  savedWindowScrollY = window.scrollY;
  savedMainScrollLeft = pageMain?.scrollLeft ?? 0;
  modalBody.style.top = `-${savedWindowScrollY}px`;
  modalDocumentRoot.classList.add('partner-modal-open');
  modalBody.classList.add('partner-modal-open');
};

const unlockBackgroundScroll = () => {
  modalDocumentRoot.classList.remove('partner-modal-open');
  modalBody.classList.remove('partner-modal-open');
  modalBody.style.removeProperty('top');
  window.scrollTo({ top: savedWindowScrollY, behavior: 'auto' });
  if (pageMain) {
    pageMain.scrollLeft = savedMainScrollLeft;
  }
};

const finishSiteModalClose = (modal) => {
  modal.classList.remove('is-open', 'is-closing');
  modal.close();
};

const closeSiteModal = (modal = activeSiteModal) => {
  if (!modal?.open || modal.classList.contains('is-closing')) {
    return;
  }

  modal.classList.add('is-closing');
  modal.classList.remove('is-open');
  window.clearTimeout(siteModalCloseTimer);
  siteModalCloseTimer = window.setTimeout(
    () => finishSiteModalClose(modal),
    partnerReducedMotion ? 0 : 260,
  );
};

const openSiteModal = (modal, opener) => {
  if (!modal || modal.open || activeSiteModal?.open) {
    return;
  }

  const modalScroll = modal.querySelector('[data-site-modal-scroll]');
  activeSiteModal = modal;
  activeModalOpener = opener;
  lockBackgroundScroll();
  modal.showModal();
  if (modalScroll) {
    modalScroll.scrollTop = 0;
  }
  window.requestAnimationFrame(() => modal.classList.add('is-open'));
};

siteModals.forEach((modal) => {
  const modalName = modal.dataset.siteModal;
  const openers = Array.from(document.querySelectorAll(`[data-site-modal-open="${modalName}"]`));
  const closeButton = modal.querySelector('[data-site-modal-close]');

  openers.forEach((opener) => {
    opener.addEventListener('click', () => openSiteModal(modal, opener));
  });

  closeButton?.addEventListener('click', () => closeSiteModal(modal));

  modal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeSiteModal(modal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeSiteModal(modal);
    }
  });

  modal.addEventListener('close', () => {
    window.clearTimeout(siteModalCloseTimer);
    if (activeSiteModal === modal) {
      unlockBackgroundScroll();
      if (activeModalOpener instanceof HTMLElement) {
        activeModalOpener.focus({ preventScroll: true });
      }
      activeSiteModal = null;
      activeModalOpener = null;
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeSiteModal?.open) {
    event.preventDefault();
    closeSiteModal(activeSiteModal);
  }
});

if (
  partnerModal
  && partnerModalScroll
  && partnerApplication
  && partnerTypeSelect
  && partnerForm
  && partnerStatus
) {
  const copy = {
    pt: {
      nameRequired: 'Indica o teu nome.',
      emailRequired: 'Indica o teu email.',
      emailInvalid: 'Introduz um email válido.',
      success: 'Candidatura registada com sucesso. Obrigado pelo teu interesse!',
    },
    en: {
      nameRequired: 'Enter your name.',
      emailRequired: 'Enter your email.',
      emailInvalid: 'Enter a valid email address.',
      success: 'Application registered successfully. Thank you for your interest!',
    },
  };
  let selectedPartnerType = 'integrator';

  const currentCopy = () => copy[modalDocumentRoot.lang.startsWith('en') ? 'en' : 'pt'];

  const clearFormState = () => {
    partnerStatus.textContent = '';
    partnerForm.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
      field.removeAttribute('aria-invalid');
    });
    partnerForm.querySelectorAll('[data-partner-error]').forEach((error) => {
      error.textContent = '';
    });
  };

  const setFieldError = (field, message) => {
    field.setAttribute('aria-invalid', 'true');
    const errorId = field.getAttribute('aria-describedby');
    const error = errorId ? document.getElementById(errorId) : null;
    if (error) {
      error.textContent = message;
    }
  };

  const updatePartnerType = (type, { moveToForm = false } = {}) => {
    selectedPartnerType = type === 'distributor' ? 'distributor' : 'integrator';
    partnerTypeSelect.value = selectedPartnerType;

    partnerTypeCards.forEach((card) => {
      const isSelected = card.dataset.partnerType === selectedPartnerType;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-pressed', String(isSelected));
    });

    if (!moveToForm) {
      return;
    }

    const applicationTop = partnerApplication.getBoundingClientRect().top
      - partnerModalScroll.getBoundingClientRect().top
      + partnerModalScroll.scrollTop
      - 24;
    partnerModalScroll.scrollTo({
      top: applicationTop,
      behavior: partnerReducedMotion ? 'auto' : 'smooth',
    });

    window.setTimeout(() => {
      partnerTypeSelect.focus({ preventScroll: true });
    }, partnerReducedMotion ? 0 : 420);
  };

  const validateForm = () => {
    clearFormState();
    const localizedCopy = currentCopy();
    const name = partnerForm.elements.nome;
    const email = partnerForm.elements.email;

    if (!name.value.trim()) {
      setFieldError(name, localizedCopy.nameRequired);
    }

    if (!email.value.trim()) {
      setFieldError(email, localizedCopy.emailRequired);
    } else if (!email.validity.valid) {
      setFieldError(email, localizedCopy.emailInvalid);
    }

    const firstInvalid = partnerForm.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return !firstInvalid;
  };

  partnerTypeCards.forEach((card) => {
    card.addEventListener('click', () => {
      updatePartnerType(card.dataset.partnerType, { moveToForm: true });
    });
  });

  partnerTypeSelect.addEventListener('change', () => {
    updatePartnerType(partnerTypeSelect.value);
  });

  partnerForm.addEventListener('input', (event) => {
    partnerStatus.textContent = '';
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    event.target.removeAttribute('aria-invalid');
    const errorId = event.target.getAttribute('aria-describedby');
    const error = errorId ? document.getElementById(errorId) : null;
    if (error) {
      error.textContent = '';
    }
  });

  partnerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    partnerStatus.textContent = currentCopy().success;
    partnerForm.reset();
    updatePartnerType(selectedPartnerType);
  });

  const languageObserver = new MutationObserver(() => clearFormState());
  languageObserver.observe(modalDocumentRoot, {
    attributes: true,
    attributeFilter: ['lang'],
  });

  updatePartnerType(selectedPartnerType);
}
