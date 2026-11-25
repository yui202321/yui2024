(() => {
  // -------- mobile nav toggle --------
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
    // close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('is-open');
      }
    });
  }

  // -------- fade-in on scroll --------
  const targets = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-visible'));
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------- equalizer bars --------
  const eq = document.getElementById('eq');
  if (eq) {
    const colors = ['var(--pink)', 'var(--cyan)', 'var(--yellow)', 'var(--mint)', 'var(--purple)'];
    const count = window.innerWidth < 520 ? 18 : 28;
    for (let i = 0; i < count; i++) {
      const bar = document.createElement('span');
      const envelope = Math.sin((i + 0.5) / count * Math.PI);
      bar.style.height = Math.round(25 + envelope * 55 + Math.random() * 20) + '%';
      bar.style.background = colors[i % colors.length];
      bar.style.animationDuration = (0.55 + Math.random() * 0.8).toFixed(2) + 's';
      bar.style.animationDelay = (-Math.random() * 1.2).toFixed(2) + 's';
      eq.appendChild(bar);
    }
  }

  // -------- terminal typewriter --------
  const tw = document.querySelector('[data-typewriter]');
  if (tw && !reduceMotion) {
    tw.style.minHeight = tw.offsetHeight + 'px';

    const walker = document.createTreeWalker(tw, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.length) nodes.push(walker.currentNode);
    }
    const texts = nodes.map((n) => n.textContent);
    nodes.forEach((n) => { n.textContent = ''; });

    const endCursor = tw.querySelector('.brand-underscore');
    if (endCursor) endCursor.style.visibility = 'hidden';

    const caret = document.createElement('span');
    caret.className = 'tw-caret';
    caret.setAttribute('aria-hidden', 'true');

    let ni = 0;
    let ci = 0;
    const step = () => {
      if (ni >= nodes.length) {
        caret.remove();
        if (endCursor) endCursor.style.visibility = '';
        return;
      }
      const node = nodes[ni];
      const ch = texts[ni][ci];
      node.textContent += ch;
      node.parentNode.insertBefore(caret, node.nextSibling);
      ci++;
      if (ci >= texts[ni].length) { ni++; ci = 0; }
      setTimeout(step, ch === '\n' ? 140 : 16);
    };
    setTimeout(step, 500);
  }

  // -------- konami-style easter egg: press "y" 3 times to toggle party mode --------
  let buf = '';
  document.addEventListener('keydown', (e) => {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-3);
    if (buf === 'yui') {
      document.body.classList.toggle('party');
      buf = '';
    }
  });
})();
