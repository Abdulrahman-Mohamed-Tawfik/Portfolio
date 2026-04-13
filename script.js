/* ============================================
   PORTFOLIO — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ===== MOBILE MENU =====
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // ===== SCROLL ANIMATIONS =====
  const animatedElements = document.querySelectorAll('[data-animate]');
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animateObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => animateObserver.observe(el));

  // ===== ANIMATED COUNTERS =====
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1500;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ===== IMAGE MODAL =====
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalImg');
  const modalClose = document.getElementById('imgModalClose');
  const modalPrev = document.getElementById('imgModalPrev');
  const modalNext = document.getElementById('imgModalNext');
  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0;

  const renderModalImage = () => {
    if (!modalImages.length) return;
    const current = modalImages[modalIndex];
    modalImg.src = current.src;
    modalImg.alt = current.alt || 'Maximized Image';
    const showNav = modalImages.length > 1;
    modalPrev.classList.toggle('hidden', !showNav);
    modalNext.classList.toggle('hidden', !showNav);
  };

  const openModal = (images, index) => {
    modalImages = images;
    modalIndex = index;
    renderModalImage();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const navigateModal = (direction) => {
    if (modalImages.length <= 1) return;
    const count = modalImages.length;
    modalIndex = (modalIndex + direction + count) % count;
    renderModalImage();
  };

  document.addEventListener('click', (e) => {
    let img = e.target.closest('.max-img');
    if (!img) {
      const certWrapper = e.target.closest('.cert-image-wrapper');
      if (certWrapper) {
        img = certWrapper.querySelector('.max-img');
      }
    }
    if (!img) return;

    const projectGallery = img.closest('.project-gallery');
    if (projectGallery) {
      const galleryImages = Array.from(projectGallery.querySelectorAll('.max-img'));
      const currentIndex = Math.max(galleryImages.indexOf(img), 0);
      openModal(galleryImages, currentIndex);
      return;
    }

    openModal([img], 0);
  });

  const closeModal = () => {
    modal.style.display = 'none';
    modalImg.src = '';
    document.body.style.overflow = '';
    modalImages = [];
    modalIndex = 0;
  };

  modalPrev.addEventListener('click', () => navigateModal(-1));
  modalNext.addEventListener('click', () => navigateModal(1));
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateModal(-1);
    if (e.key === 'ArrowRight') navigateModal(1);
  });

  modal.addEventListener('touchstart', (e) => {
    if (!e.changedTouches || !e.changedTouches.length) return;
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (!e.changedTouches || !e.changedTouches.length || !touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 40;
    if (Math.abs(deltaX) >= swipeThreshold) {
      navigateModal(deltaX < 0 ? 1 : -1);
    }
    touchStartX = 0;
  }, { passive: true });

  // ===== PROJECT GALLERY NAVIGATION =====
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const prevBtn = gallery.querySelector('.gallery-nav.prev');
    const nextBtn = gallery.querySelector('.gallery-nav.next');
    if (!track || !prevBtn || !nextBtn) return;

    const images = Array.from(track.querySelectorAll('img'));
    if (images.length <= 1) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const AUTO_SLIDE_MS = 3000;
    let currentIndex = 0;
    let autoSlideTimer = null;

    const getScrollAmount = () => {
      const firstImg = track.querySelector('img');
      if (!firstImg) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return firstImg.getBoundingClientRect().width + gap;
    };

    const scrollToIndex = (index, behavior = 'smooth') => {
      const safeIndex = ((index % images.length) + images.length) % images.length;
      currentIndex = safeIndex;
      track.scrollTo({ left: getScrollAmount() * safeIndex, behavior });
    };

    const goNext = () => {
      scrollToIndex(currentIndex + 1);
    };

    const goPrev = () => {
      scrollToIndex(currentIndex - 1);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(goNext, AUTO_SLIDE_MS);
    };

    const stopAutoSlide = () => {
      if (!autoSlideTimer) return;
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    };

    const updateButtons = () => {
      const scrollAmount = getScrollAmount();
      currentIndex = Math.round(track.scrollLeft / scrollAmount);
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    };

    prevBtn.addEventListener('click', () => {
      goPrev();
      startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      goNext();
      startAutoSlide();
    });

    track.addEventListener('scroll', updateButtons, { passive: true });
    gallery.addEventListener('mouseenter', stopAutoSlide);
    gallery.addEventListener('mouseleave', startAutoSlide);
    gallery.addEventListener('focusin', stopAutoSlide);
    gallery.addEventListener('focusout', startAutoSlide);
    track.addEventListener('touchstart', stopAutoSlide, { passive: true });
    track.addEventListener('touchend', startAutoSlide, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
    startAutoSlide();
  });

  // ===== BACK TO TOP =====
  const backToTopBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== TYPING EFFECT ON HERO (subtle) =====
  const heroGreeting = document.querySelector('.hero-greeting');
  if (heroGreeting) {
    const text = heroGreeting.textContent;
    heroGreeting.textContent = '';
    heroGreeting.style.opacity = '1';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        heroGreeting.textContent += text.charAt(i);
        i++;
        setTimeout(type, 60);
      }
    };
    // Start typing after a short delay
    setTimeout(type, 600);
  }

});
