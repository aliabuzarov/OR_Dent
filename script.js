/**
 * OR DENT STOMATOLOJİ KLİNİKA - JAVASCRIPT
 * Interactivity: Mobile menu, carousel, booking modal, direct WhatsApp sender, search, ScrollSpy
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSpecialitiesCarousel();
  initStickyHeader();
  initScrollSpy();
});

/* ==================== NAVBAR & MOBILE MENU ==================== */
function initNavbar() {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggleBtn && mobileDrawer) {
    menuToggleBtn.addEventListener('click', () => {
      const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
      menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
      menuToggleBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        menuToggleBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }
}

/* ==================== STICKY HEADER & SCROLLSPY ==================== */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initScrollSpy() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .mobile-link');
  
  // Section mappings
  const sections = [
    { id: 'hero', el: document.getElementById('hero') },
    { id: 'about', el: document.getElementById('about') },
    { id: 'specialities', el: document.getElementById('specialities') },
    { id: 'team', el: document.getElementById('team') },
    { id: 'credit', el: document.getElementById('credit') },
    { id: 'blogs', el: document.getElementById('blogs') }
  ].filter(item => item.el !== null);

  function setActiveLink(activeId) {
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      if (targetId === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      if (targetId === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function handleScrollSpy() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = (document.getElementById('siteHeader')?.offsetHeight || 70) + 80;

    // Check if scrolled near bottom of page
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
      setActiveLink('blogs');
      return;
    }

    let currentActiveId = 'hero';

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.el.offsetTop - headerOffset;
      const sectionHeight = section.el.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentActiveId = section.id;
        break;
      } else if (scrollPosition >= sectionTop) {
        currentActiveId = section.id;
      }
    }

    setActiveLink(currentActiveId);
  }

  // Smooth scroll click handler
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = document.getElementById('siteHeader')?.offsetHeight || 70;
          const targetPosition = targetEl.offsetTop - headerHeight + 10;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          setActiveLink(targetId);
        }
      }
    });
  });

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();
}

/* ==================== SPECIALITIES CAROUSEL ==================== */
function initSpecialitiesCarousel() {
  const track = document.getElementById('specialitiesTrack');
  const prevBtn = document.getElementById('specPrevBtn');
  const nextBtn = document.getElementById('specNextBtn');
  const dotsContainer = document.getElementById('specCarouselDots');
  const pageText = document.getElementById('specPageText');

  if (!track) return;

  function updateCarouselState() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;

    // Arrow button states
    if (prevBtn) {
      if (currentScroll <= 15) {
        prevBtn.classList.add('disabled');
      } else {
        prevBtn.classList.remove('disabled');
      }
    }

    if (nextBtn) {
      if (currentScroll >= maxScroll - 15) {
        nextBtn.classList.add('disabled');
      } else {
        nextBtn.classList.remove('disabled');
      }
    }

    // Precise 3-Dot Pagination Calculation
    const totalDots = 3;
    let activeDotIndex = 0;

    if (maxScroll > 10) {
      const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));
      if (progress < 0.25) {
        activeDotIndex = 0;
      } else if (progress > 0.70 || currentScroll >= maxScroll - 20) {
        activeDotIndex = 2; // Always activate 3rd dot at the end
      } else {
        activeDotIndex = 1;
      }
    }

    if (pageText) {
      pageText.textContent = `${activeDotIndex + 1} / ${totalDots}`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.spec-dot');
      dots.forEach((dot, idx) => {
        if (idx === activeDotIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  // Next Click (Navigates through 3 sections)
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const step = maxScroll / 2;
      if (track.scrollLeft >= maxScroll - 20) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollTo({ left: Math.min(maxScroll, track.scrollLeft + step), behavior: 'smooth' });
      }
    });
  }

  // Prev Click
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const step = maxScroll / 2;
      if (track.scrollLeft <= 20) {
        track.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        track.scrollTo({ left: Math.max(0, track.scrollLeft - step), behavior: 'smooth' });
      }
    });
  }

  // Dot Click Navigation (Directly scrolls to 0%, 50%, 100%)
  window.goToSpecSlide = function(index) {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const targetScroll = (index / 2) * maxScroll;
    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  // Mouse Drag to Scroll
  let isDown = false;
  let startX;
  let scrollLeft;
  let isDragging = false;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    track.classList.add('active-drag');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('active-drag');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('active-drag');
    setTimeout(() => { isDragging = false; }, 50);
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      isDragging = true;
    }
    track.scrollLeft = scrollLeft - walk;
    updateCarouselState();
  });

  // Prevent card click trigger during drag
  track.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // Mouse Wheel horizontal scroll
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      track.scrollLeft += e.deltaY;
      updateCarouselState();
    }
  }, { passive: false });

  // Scroll listener
  track.addEventListener('scroll', updateCarouselState);
  window.addEventListener('resize', updateCarouselState);

  // Initial call
  setTimeout(updateCarouselState, 100);
}

/* ==================== APPOINTMENT BOOKING MODAL ==================== */
function openAppointmentModal(serviceName = '') {
  const modal = document.getElementById('appointmentModal');
  if (!modal) return;

  if (serviceName) {
    const specSelect = document.getElementById('bookSpecialist');
    if (specSelect) {
      for (let option of specSelect.options) {
        if (option.text.toLowerCase().includes(serviceName.toLowerCase()) || 
            option.value.toLowerCase().includes(serviceName.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
  }

  // Set today as min date
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeAppointmentModal() {
  const modal = document.getElementById('appointmentModal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Close modal when clicking outside card
document.addEventListener('click', (e) => {
  const modal = document.getElementById('appointmentModal');
  if (modal && e.target === modal) {
    closeAppointmentModal();
  }
});

function handleBookingSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('bookName').value;
  const service = document.getElementById('bookSpecialist').value;

  closeAppointmentModal();
  showToast(`Təşəkkür edirik, ${name}! "${service}" üçün müraciətiniz qeydə alındı. Tezliklə sizinlə əlaqə saxlayacağıq.`);
  event.target.reset();
}

/* Direct WhatsApp Sender with prefilled patient booking information */
function sendViaWhatsApp() {
  const name = document.getElementById('bookName').value || 'Pasient';
  const phone = document.getElementById('bookPhone').value || '';
  const service = document.getElementById('bookSpecialist').value || 'Məsləhət';
  const date = document.getElementById('bookDate').value || 'Təcili';
  const notes = document.getElementById('bookNotes').value || '';

  const message = encodeURIComponent(
    `Salam, OR Dent Stomatoloji Klinikası!\n\n` +
    `Mən qəbula yazılmaq istəyirəm:\n` +
    `• Ad, Soyad: ${name}\n` +
    `• Əlaqə: ${phone}\n` +
    `• Xidmət/Həkim: ${service}\n` +
    `• Tarix: ${date}\n` +
    (notes ? `• Qeyd: ${notes}\n` : '') +
    `\n(Kredit imkanı barədə məlumat almaq istəyirəm)`
  );

  window.open(`https://wa.me/994775037575?text=${message}`, '_blank');
}

/* ==================== SEARCH & QUICK FILTERS ==================== */
function handleSearch(event) {
  event.preventDefault();
  const service = document.getElementById('searchService').value || 'Stomatoloji Müalicə';
  const specialist = document.getElementById('searchSpecialist').value || 'Həkimlərimiz';

  openAppointmentModal(service || specialist);
}

function quickFilter(category) {
  const serviceSelect = document.getElementById('searchService');
  if (serviceSelect) {
    for (let option of serviceSelect.options) {
      if (option.value.toLowerCase().includes(category.toLowerCase())) {
        option.selected = true;
        break;
      }
    }
  }

  showToast(`"${category}" xidməti seçildi.`);
  openAppointmentModal(category);
}

/* ==================== TOAST NOTIFICATION ==================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
