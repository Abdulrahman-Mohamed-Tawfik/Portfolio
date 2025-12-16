// Smooth Scroll for Navigation Links
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Highlight Active Section in Navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 70) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(currentSection)) {
      link.classList.add('active');
    }
  });
});

// Fade-in animation on scroll
const faders = document.querySelectorAll('.section');
const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(section => {
  appearOnScroll.observe(section);
});

// Image maximization modal logic
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalImg');
  const closeBtn = document.getElementById('imgModalClose');

  // Delegate so any future .max-img (unlimited galleries) still opens the modal.
  document.addEventListener('click', function(e) {
    const img = e.target.closest && e.target.closest('.max-img');
    if (!img) return;
    modal.style.display = 'flex';
    modalImg.src = img.src;
    modalImg.alt = img.alt;
  });

  // Project gallery navigation (scroll one image at a time)
  const galleries = document.querySelectorAll('.project-gallery');
  galleries.forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const prevBtn = gallery.querySelector('.gallery-nav.prev');
    const nextBtn = gallery.querySelector('.gallery-nav.next');
    if (!track || !prevBtn || !nextBtn) return;

    function getScrollAmount() {
      const firstImg = track.querySelector('img');
      if (!firstImg) return track.clientWidth;
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return firstImg.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 1;
      nextBtn.disabled = track.scrollLeft >= (maxScrollLeft - 1);
    }

    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });

  closeBtn.onclick = function() {
    modal.style.display = 'none';
    modalImg.src = '';
  };

  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalImg.src = '';
    }
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modal.style.display = 'none';
      modalImg.src = '';
    }
  });
});
