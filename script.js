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
  const images = document.querySelectorAll('.max-img');

  images.forEach(img => {
    img.addEventListener('click', function() {
      modal.style.display = 'flex';
      modalImg.src = this.src;
      modalImg.alt = this.alt;
    });
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
