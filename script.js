(function () {
  'use strict';

  var translations = {
    fr: {
      menu: 'Ouvrir le menu', home: 'Accueil', vehicles: 'Véhicules', tires: 'Pneumatiques', logistics: 'Logistique', about: 'À propos', faq: 'FAQ', contact: 'Contact',
      eyebrow: 'Racino Trading International', titleFirst: 'De l’Europe au monde,', titleSecond: 'sans frontières', heroServices: 'Véhicules • Pneumatiques • Logistique',
      cta: 'Nous contacter', aboutEyebrow: "L'essentiel, bien presente", aboutTitle: 'Une base claire pour raconter votre histoire.',
      footerText: 'Racino Trading International, une presence en ligne claire et professionnelle.', footerNav: 'Navigation', footerContact: 'Contact',
      footerCta: 'Demander un rendez-vous', copyright: '© 2026 RTI. Tous droits reserves.', tagline: 'Concu avec intention.'
    },
    en: {
      menu: 'Open menu', home: 'Home', vehicles: 'Vehicles', tires: 'Tires', logistics: 'Logistics', about: 'About', faq: 'FAQ', contact: 'Contact',
      eyebrow: 'Racino Trading International', titleFirst: 'From Europe to the world,', titleSecond: 'without borders', heroServices: 'Vehicles • Tires • Logistics',
      cta: 'Contact us', aboutEyebrow: 'The essentials, beautifully presented', aboutTitle: 'A clear foundation for telling your story.',
      footerText: 'Racino Trading International, a clear and professional online presence.', footerNav: 'Navigation', footerContact: 'Contact',
      footerCta: 'Book an appointment', copyright: '© 2026 RTI. All rights reserved.', tagline: 'Designed with intention.'
    }
  };

  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav-panel');
  var languageButtons = document.querySelectorAll('.language-button');
  var filterForm = document.querySelector('#vehicle-filters');
  var vehicleCards = document.querySelectorAll('.vehicle-card');
  var emptyState = document.querySelector('#empty-state');
  var filterSummary = document.querySelector('#filter-summary');
  var projectForm = document.querySelector('#project-form');
  var formStatus = document.querySelector('#form-status');
  var testimonialTrack = document.querySelector('.testimonial-track');
  var testimonialCards = document.querySelectorAll('.testimonial-card');
  var testimonialDots = document.querySelector('.testimonial-dots');
  var testimonialPrevious = document.querySelector('.testimonial-previous');
  var testimonialNext = document.querySelector('.testimonial-next');

  function setLanguage(language) {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      element.textContent = translations[language][element.dataset.i18n];
    });
    languageButtons.forEach(function (button) {
      var active = button.dataset.language === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('new-site-language', language); } catch (error) { /* private browsing */ }
  }

  menuButton.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      menuButton.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  languageButtons.forEach(function (button) {
    button.addEventListener('click', function () { setLanguage(button.dataset.language); });
  });

  function filterVehicles() {
    var formData = new FormData(filterForm);
    var visibleCount = 0;
    vehicleCards.forEach(function (card) {
      var matches = (!formData.get('brand') || card.dataset.brand === formData.get('brand')) &&
        (!formData.get('model') || card.dataset.model === formData.get('model')) &&
        (!formData.get('condition') || card.dataset.condition === formData.get('condition')) &&
        (!formData.get('fuel') || card.dataset.fuel === formData.get('fuel')) &&
        (!formData.get('gearbox') || card.dataset.gearbox === formData.get('gearbox')) &&
        (!formData.get('yearMin') || Number(card.dataset.year) >= Number(formData.get('yearMin'))) &&
        (!formData.get('yearMax') || Number(card.dataset.year) <= Number(formData.get('yearMax'))) &&
        (!formData.get('mileageMin') || Number(card.dataset.mileage) >= Number(formData.get('mileageMin'))) &&
        (!formData.get('mileageMax') || Number(card.dataset.mileage) <= Number(formData.get('mileageMax'))) &&
        (!formData.get('priceMin') || Number(card.dataset.price) >= Number(formData.get('priceMin'))) &&
        (!formData.get('priceMax') || Number(card.dataset.price) <= Number(formData.get('priceMax')));
      card.hidden = !matches;
      if (matches) { visibleCount += 1; }
    });
    emptyState.hidden = visibleCount > 0;
    filterSummary.textContent = visibleCount + (visibleCount > 1 ? ' véhicules correspondants' : ' véhicule correspondant');
  }

  filterForm.addEventListener('input', filterVehicles);
  filterForm.addEventListener('change', filterVehicles);
  filterForm.addEventListener('reset', function () { window.setTimeout(filterVehicles, 0); });

  projectForm.addEventListener('submit', function (event) {
    event.preventDefault();
    formStatus.textContent = 'Merci, votre demande a bien été préparée. Notre équipe vous répondra rapidement.';
    projectForm.reset();
  });

  var testimonialIndex = 0;
  var testimonialTimer;

  function showTestimonial(index) {
    testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
    testimonialTrack.style.transform = 'translateX(-' + (testimonialIndex * 100) + '%)';
    testimonialCards.forEach(function (card, cardIndex) {
      card.classList.toggle('is-active', cardIndex === testimonialIndex);
    });
    testimonialDots.querySelectorAll('button').forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === testimonialIndex);
      dot.setAttribute('aria-current', dotIndex === testimonialIndex ? 'true' : 'false');
    });
  }

  testimonialCards.forEach(function (card, cardIndex) {
    var dot = document.createElement('button');
    dot.className = 'testimonial-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Afficher le témoignage ' + (cardIndex + 1));
    dot.addEventListener('click', function () {
      showTestimonial(cardIndex);
      restartTestimonials();
    });
    testimonialDots.appendChild(dot);
  });

  function restartTestimonials() {
    window.clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(function () { showTestimonial(testimonialIndex + 1); }, 5000);
  }

  testimonialPrevious.addEventListener('click', function () {
    showTestimonial(testimonialIndex - 1);
    restartTestimonials();
  });
  testimonialNext.addEventListener('click', function () {
    showTestimonial(testimonialIndex + 1);
    restartTestimonials();
  });
  showTestimonial(0);
  restartTestimonials();

  var savedLanguage = 'fr';
  try { savedLanguage = localStorage.getItem('new-site-language') || 'fr'; } catch (error) { /* private browsing */ }
  setLanguage(savedLanguage === 'en' ? 'en' : 'fr');
})();
