(function () {
  const header = document.querySelector('.header');
  const reveals = () => document.querySelectorAll('.reveal');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);

    const vh = window.innerHeight;
    reveals().forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.88) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  setTimeout(onScroll, 120);
})();
