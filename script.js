(function () {
  'use strict';
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // Intersection Observer for .reveal
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { 
        e.target.classList.add('visible'); 
        observer.unobserve(e.target); 
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.reveal').forEach(function (el) { 
    observer.observe(el); 
  });

  document.querySelectorAll('.sp-grid').forEach(function (grid) {
    grid.querySelectorAll('.reveal').forEach(function (card, i) {
      card.style.transitionDelay = (i * 55) + 'ms';
    });
  });

  // Mobile menu
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('mobileDrawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
})();
