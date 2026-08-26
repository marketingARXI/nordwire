const partnerModal = document.querySelector('[data-partner-modal]');
const partnerModalOpen = document.querySelector('[data-partner-modal-open]');
const partnerModalClose = document.querySelector('[data-partner-modal-close]');
const partnerModalScroll = document.querySelector('[data-partner-modal-scroll]');
const partnerApplication = document.querySelector('[data-partner-application]');
const partnerTypeCards = Array.from(document.querySelectorAll('[data-partner-type]'));
const partnerTypeSelect = document.querySelector('[data-partner-type-select]');
const partnerForm = document.querySelector('[data-partner-form]');
const partnerStatus = document.querySelector('[data-partner-status]');
const partnerReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (
  partnerModal
  && partnerModalOpen
  && partnerModalClose
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
  const modalDocumentRoot = document.documentElement;
  const modalBody = document.body;
  const pageMain = document.querySelector('main');
  let selectedPartnerType = 'integrator';
  let opener = null;
  let closeTimer;
  let savedWindowScrollY = 0;
  let savedMainScrollLeft = 0;

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

  const openModal = () => {
    if (partnerModal.open) {
      return;
    }

    opener = document.activeElement;
    lockBackgroundScroll();
    partnerModal.showModal();
    partnerModalScroll.scrollTop = 0;
    window.requestAnimationFrame(() => partnerModal.classList.add('is-open'));
  };

  const finishClose = () => {
    partnerModal.classList.remove('is-open', 'is-closing');
    partnerModal.close();
  };

  const closeModal = () => {
    if (!partnerModal.open || partnerModal.classList.contains('is-closing')) {
      return;
    }

    partnerModal.classList.add('is-closing');
    partnerModal.classList.remove('is-open');
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(finishClose, partnerReducedMotion ? 0 : 260);
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

  partnerModalOpen.addEventListener('click', openModal);
  partnerModalClose.addEventListener('click', closeModal);

  partnerModal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && partnerModal.open) {
      event.preventDefault();
      closeModal();
    }
  });

  partnerModal.addEventListener('click', (event) => {
    if (event.target === partnerModal) {
      closeModal();
    }
  });

  partnerModal.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    unlockBackgroundScroll();
    if (opener instanceof HTMLElement) {
      opener.focus({ preventScroll: true });
    }
    opener = null;
  });

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
