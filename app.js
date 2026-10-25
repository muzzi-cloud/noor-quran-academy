(() => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');
  const navLinks = nav.querySelectorAll('a');

  function closeMenu() {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  // Course filters are keyboard-operable native buttons.
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    courseCards.forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
    });
  }));

  // Accessible single-open FAQ accordion.
  document.querySelectorAll('.faq-question').forEach(button => button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-question').forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.closest('.faq-item').querySelector('.faq-answer').hidden = true;
    });
    if (!isOpen) {
      button.setAttribute('aria-expanded', 'true');
      button.closest('.faq-item').querySelector('.faq-answer').hidden = false;
    }
  }));

  // Quick-contact drawer.
  const drawerToggle = document.getElementById('drawerToggle');
  const drawerPanel = document.getElementById('drawerPanel');
  drawerToggle.addEventListener('click', () => {
    const open = drawerToggle.getAttribute('aria-expanded') !== 'true';
    drawerToggle.setAttribute('aria-expanded', String(open));
    drawerPanel.hidden = !open;
  });
  drawerPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    drawerPanel.hidden = true;
    drawerToggle.setAttribute('aria-expanded', 'false');
  }));

  // Progressive entrance animations; content remains visible if unsupported.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 4800);
  }

  // Prepare an email draft locally. No form data is transmitted or stored by this demo.
  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Noor Quran Academy enquiry — ${data.get('fullName')}`;
    const body = [
      'Assalamu Alaikum Noor Quran Academy,',
      '',
      'I would like to enquire about a free introductory session.',
      '',
      `Full name: ${data.get('fullName')}`,
      `Email: ${data.get('email')}`,
      `WhatsApp / phone: ${data.get('phone')}`,
      `Student age group: ${data.get('ageGroup')}`,
      `Course of interest: ${data.get('course')}`,
      `Preferred days and times: ${data.get('schedule') || 'Not specified'}`,
      '',
      'Message / current level / goals:',
      data.get('message') || 'Not specified',
      '',
      'Please let me know the next steps and current class/package details.',
      '',
      'Jazakum Allahu Khairan'
    ].join('\n');
    const mailto = `mailto:info@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your enquiry is ready. Your email app should open with a draft; review it and press Send to contact the academy.';
    showToast('Enquiry prepared — review the email draft before sending.');
    window.location.href = mailto;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();