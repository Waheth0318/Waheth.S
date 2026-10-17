(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches) {
    document.documentElement.classList.add('motion');
    setTimeout(() => document.querySelector('.opening').remove(), 2200);
  }
  const sections = [...document.querySelectorAll('main > section')];
  const caption = document.querySelector('#scene-caption');
  const links = [...document.querySelectorAll('nav a')];
  if ('IntersectionObserver' in window) {
    const scenes = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        caption.textContent = entry.target.dataset.scene;
        links.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -50% 0px' });
    sections.forEach(section => scenes.observe(section));
    if (!reducedMotion.matches) {
      const reveals = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            reveals.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.about-grid, .section-heading, .skill-row, .project, .journey-grid').forEach(el => {
        el.classList.add('reveal');
        reveals.observe(el);
      });
      reducedMotion.addEventListener('change', event => {
        if (event.matches) document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      });
    }
  }
  const started = Date.now();
  const timecode = document.querySelector('#timecode');
  setInterval(() => {
    if (document.hidden) return;
    const seconds = Math.floor((Date.now() - started) / 1000);
    timecode.textContent = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
  }, 1000);
  const hear = document.querySelector('#hear-greeting');
  if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
    hear.hidden = false;
    hear.addEventListener('click', () => {
      speechSynthesis.cancel();
      const greeting = new SpeechSynthesisUtterance("Hi, my name is Waheth! Welcome to my portfolio. Let's explore.");
      greeting.rate = 1.05;
      speechSynthesis.speak(greeting);
    });
  }
  const clapper = document.querySelector('#clapper');
  function showClapper() { if (!clapper.open) clapper.showModal(); }
  document.querySelector('#monogram').addEventListener('click', showClapper);
  clapper.addEventListener('click', event => { if (event.target === clapper) clapper.close(); });
  let buffer = '';
  window.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (event.key.length !== 1) return;
    buffer = (buffer + event.key.toLowerCase()).slice(-6);
    if (buffer === 'action') showClapper();
    if (buffer.endsWith('cut')) clapper.close();
  });
})();
