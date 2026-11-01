/* =========================================================
   TEAMUP — INTERACTIONS
   Vanilla JavaScript + Bootstrap 5 components
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.site-navbar');
  const backToTopButton = document.getElementById('backToTop');
  const navbarCollapse = document.getElementById('mainNavbar');
  const registrationForm = document.getElementById('registrationForm');
  const registrationModalElement = document.getElementById('registerModal');
  const registrationToastElement = document.getElementById('registrationToast');
  const selectedPlanField = document.getElementById('selectedPlan');

  // Keep the copyright year current without manual edits.
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Navbar and back-to-top visibility respond to the page scroll position.
  const updateScrollUI = () => {
    const scrollPosition = window.scrollY;

    if (navbar) {
      navbar.classList.toggle('is-scrolled', scrollPosition > 24);
    }

    if (backToTopButton) {
      backToTopButton.classList.toggle('is-visible', scrollPosition > 420);
    }
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  // Smooth-scroll links that point to a section on the current page.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close the Bootstrap mobile menu after choosing a section.
      if (navbarCollapse && navbarCollapse.classList.contains('show') && window.bootstrap) {
        const collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        collapseInstance.hide();
      }
    });
  });

  // Also close the mobile menu when a same-site page link is selected.
  if (navbarCollapse && window.bootstrap) {
    navbarCollapse.querySelectorAll('a.nav-link[href]:not([href^="#"])').forEach((link) => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
        }
      });
    });
  }

  // Back-to-top control.
  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reveal content as it enters the viewport. Falls back gracefully on older browsers.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // Pricing buttons preselect a plan before opening the registration demo modal.
  document.querySelectorAll('[data-plan-name]').forEach((planButton) => {
    planButton.addEventListener('click', () => {
      if (selectedPlanField) {
        selectedPlanField.value = planButton.dataset.planName || 'ฟรี — ฿0 / เดือน';
      }
    });
  });

  // Registration is a front-end demonstration only. No data is transmitted or stored.
  if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      registrationForm.classList.add('was-validated');

      if (!registrationForm.checkValidity()) {
        registrationForm.querySelector(':invalid')?.focus();
        return;
      }

      const fullName = registrationForm.elements.fullName.value.trim();
      const firstName = fullName.split(/\s+/)[0] || 'คุณ';
      const selectedPlan = registrationForm.elements.selectedPlan.value || 'ฟรี';
      const toastMessage = document.getElementById('toastMessage');

      if (toastMessage) {
        toastMessage.textContent = `ขอบคุณ ${firstName}! ข้อมูลสมัครแพ็กเกจ ${selectedPlan} ผ่านการตรวจสอบแล้ว`;
      }

      // Close the modal and show a Bootstrap toast. Form values are not submitted.
      if (registrationModalElement && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(registrationModalElement).hide();
      }

      if (registrationToastElement && window.bootstrap) {
        window.bootstrap.Toast.getOrCreateInstance(registrationToastElement, { delay: 5000 }).show();
      }

      registrationForm.reset();
      registrationForm.classList.remove('was-validated');
    });

    // Clear old validation styles when the user reopens the registration form.
    if (registrationModalElement) {
      registrationModalElement.addEventListener('hidden.bs.modal', () => {
        registrationForm.classList.remove('was-validated');
      });
    }
  }
});
