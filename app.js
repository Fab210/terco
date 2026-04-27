(function () {
  "use strict";

  // ─── État ────────────────────────────────────────────────
  const state = { set: null, steps: [], index: 0 };

  // ─── Séquence de prière ───────────────────────────────────
  function buildSteps(set) {
    const steps = [];
    const push = (prayer, label, opts = {}) =>
      steps.push(Object.assign({ prayer, label }, opts));

    push(PRAYERS.signe,   "Ouverture");
    push(PRAYERS.credo,   "Sur le crucifix",   { beadRef: "cross" });
    push(PRAYERS.pater,   "Premier grain",     { beadRef: "tail-pater" });

    INITIAL_AVE_INTENTIONS.forEach((intention, i) =>
      push(PRAYERS.ave, intention, { beadRef: `tail-ave-${i}` })
    );
    push(PRAYERS.gloria, "Doxologie");

    set.mysteries.forEach((mystery, mIdx) => {
      const d = mIdx + 1;
      const base = mIdx * 11;
      push(PRAYERS.pater, `${d}ᵉ mystère — Notre Père`,
        { beadRef: `loop-${base}`, mystery, mysteryIndex: mIdx });
      for (let i = 0; i < 10; i++)
        push(PRAYERS.ave, `${d}ᵉ mystère — Ave ${i + 1}/10`,
          { beadRef: `loop-${base + 1 + i}`, mystery, mysteryIndex: mIdx });
      push(PRAYERS.gloria, `${d}ᵉ mystère — Gloire au Père`,
        { mystery, mysteryIndex: mIdx });
      push(PRAYERS.fatima, `${d}ᵉ mystère — Fatima`,
        { mystery, mysteryIndex: mIdx });
    });

    push(PRAYERS.salveRegina, "Conclusion");
    push(PRAYERS.signe, "Clôture");
    return steps;
  }

  // ─── Construction SVG du chapelet ────────────────────────
  function buildRosarySVG(container) {
    const W = 360, H = 470;
    const cx = W / 2, cy = 188;
    const rx = 138, ry = 150;
    const LOOP_N = 55;

    /* helpers SVG */
    const ns = 'http://www.w3.org/2000/svg';
    const el  = (tag, attrs) => {
      const e = document.createElementNS(ns, tag);
      if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
      return e;
    };
    const app = (parent, ...children) => { children.forEach(c => parent.appendChild(c)); return parent; };

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Chapelet' });

    /* ── Dégradés ── */
    const defs = el('defs');

    const mkRG = (id, stops) => {
      const g = el('radialGradient', { id, cx: '35%', cy: '35%', r: '65%' });
      stops.forEach(([off, col]) => app(g, el('stop', { offset: off, 'stop-color': col })));
      return g;
    };
    app(defs,
      mkRG('g-ave',   [['0%','#e8edf8'],['55%','#b0bcdc'],['100%','#7a88b4']]),
      mkRG('g-pater', [['0%','#90c8ff'],['55%','#1a72d4'],['100%','#082a8a']]),
      mkRG('g-gold',  [['0%','#fff176'],['50%','#ffc830'],['100%','#a06800']])
    );

    /* Filtre lueur pour le grain courant */
    const filt = el('filter', { id: 'f-glow', x: '-60%', y: '-60%', width: '220%', height: '220%' });
    const blur = el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '3.5', result: 'b' });
    const merge = el('feMerge');
    app(merge, el('feMergeNode', { in: 'b' }), el('feMergeNode', { in: 'SourceGraphic' }));
    app(filt, blur, merge);
    defs.appendChild(filt);
    svg.appendChild(defs);

    /* ── Fond étoilé décoratif ── */
    for (let i = 0; i < 28; i++) {
      const sx = 20 + Math.random() * 320;
      const sy = 10 + Math.random() * 460;
      const sr = .4 + Math.random() * .9;
      svg.appendChild(el('circle', { cx: sx, cy: sy, r: sr,
        fill: `rgba(255,255,255,${(.1 + Math.random() * .25).toFixed(2)})` }));
    }

    /* ── Fil du chapelet ── */
    svg.appendChild(el('ellipse', { cx, cy, rx, ry,
      fill: 'none', stroke: 'rgba(160,190,255,0.22)', 'stroke-width': '1.5' }));

    const tailTop = cy + ry;
    const crossCy = tailTop + 112;
    svg.appendChild(el('line', { x1: cx, y1: tailTop, x2: cx, y2: crossCy - 8,
      stroke: 'rgba(160,190,255,0.22)', 'stroke-width': '1.5' }));

    /* ── Grains de la couronne (55) ── */
    for (let i = 0; i < LOOP_N; i++) {
      const angle = Math.PI / 2 + (2 * Math.PI * i / LOOP_N);
      const bx = cx + rx * Math.cos(angle);
      const by = cy + ry * Math.sin(angle);
      const isPater = (i % 11 === 0);
      svg.appendChild(makeBead(`loop-${i}`, bx, by, isPater ? 9 : 6.2, isPater ? 'pater' : 'ave'));
    }

    /* ── Grains du pendant ── */
    const tail = [
      ['tail-pater',  cx, tailTop + 26, 9,   'pater'],
      ['tail-ave-0',  cx, tailTop + 50, 6.2, 'ave'],
      ['tail-ave-1',  cx, tailTop + 72, 6.2, 'ave'],
      ['tail-ave-2',  cx, tailTop + 94, 6.2, 'ave'],
    ];
    tail.forEach(args => svg.appendChild(makeBead(...args)));

    /* ── Croix ── */
    const crossG = el('g', { id: 'cross' });
    // halo de la croix
    crossG.appendChild(el('circle', {
      cx, cy: crossCy, r: 15,
      fill: 'rgba(240,192,96,0.4)', class: 'cross-glow'
    }));
    // barre verticale
    crossG.appendChild(el('line', {
      x1: cx, y1: crossCy - 10, x2: cx, y2: crossCy + 14,
      stroke: 'url(#g-gold)', 'stroke-width': '3.5', 'stroke-linecap': 'round'
    }));
    // barre horizontale
    crossG.appendChild(el('line', {
      x1: cx - 9, y1: crossCy - 1, x2: cx + 9, y2: crossCy - 1,
      stroke: 'url(#g-gold)', 'stroke-width': '3.5', 'stroke-linecap': 'round'
    }));
    svg.appendChild(crossG);

    container.innerHTML = '';
    container.appendChild(svg);

    /* ── Helper: dessine un grain ── */
    function makeBead(id, bx, by, r, type) {
      const g = el('g', { id });
      // halo pulsant (caché par défaut via CSS .bead-halo)
      g.appendChild(el('circle', {
        cx: bx, cy: by, r: r + 5,
        fill: type === 'pater' ? 'rgba(100,180,255,0.5)' : 'rgba(255,230,120,0.45)',
        class: 'bead-halo'
      }));
      // corps du grain
      const body = el('circle', { cx: bx, cy: by, r,
        fill: `url(#g-${type})`,
        class: `bead-body-${type}`
      });
      g.appendChild(body);
      // reflet brillant
      g.appendChild(el('ellipse', {
        cx: bx - r * .3, cy: by - r * .3,
        rx: r * .38, ry: r * .26,
        fill: 'rgba(255,255,255,0.5)'
      }));
      return g;
    }
  }

  // ─── Mise à jour des grains ───────────────────────────────
  function updateBeads() {
    // Réinitialise tous les états
    document.querySelectorAll('#rosary-stage [id^="loop-"], #rosary-stage [id^="tail-"]')
      .forEach(g => g.classList.remove('bead-done', 'bead-current'));
    const crossEl = document.getElementById('cross');
    if (crossEl) crossEl.classList.remove('cross-current');

    // Applique état à chaque étape
    state.steps.forEach((step, i) => {
      if (!step.beadRef) return;
      const el = document.getElementById(step.beadRef);
      if (!el) return;
      if (i < state.index) {
        if (step.beadRef === 'cross') el.classList.add('cross-current');
        else el.classList.add('bead-done');
      } else if (i === state.index) {
        if (step.beadRef === 'cross') el.classList.add('cross-current');
        else el.classList.add('bead-current');
      }
    });
  }

  // ─── Rendu de l'étape courante ────────────────────────────
  function renderStep() {
    const step = state.steps[state.index];
    if (!step) return;

    document.getElementById('prayer-mystery-set').textContent = state.set.name;
    document.getElementById('prayer-step-title').textContent = step.label;
    document.getElementById('prayer-name').textContent = step.prayer.name;
    document.getElementById('prayer-body').textContent = step.prayer.body;

    const med = document.getElementById('mystery-meditation');
    if (step.mystery) {
      med.classList.remove('hidden');
      document.getElementById('meditation-title').textContent =
        `${step.mysteryIndex + 1}. ${step.mystery.title}`;
      document.getElementById('meditation-fruit').textContent = step.mystery.fruit;
    } else {
      med.classList.add('hidden');
    }

    const total = state.steps.length;
    document.getElementById('progress-fill').style.width =
      `${(state.index / (total - 1)) * 100}%`;
    document.getElementById('progress-text').textContent =
      `${state.index + 1} / ${total}`;

    document.querySelector('[data-action="prev"]').disabled = state.index === 0;
    document.querySelector('[data-action="next"]').textContent =
      state.index === total - 1 ? '✓' : '▶';

    updateBeads();
  }

  // ─── Navigation entre écrans ──────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startPrayer(set) {
    state.set = set;
    state.steps = buildSteps(set);
    state.index = 0;
    buildRosarySVG(document.getElementById('rosary-stage'));
    renderStep();
    showScreen('screen-prayer');
  }

  function next() {
    if (state.index < state.steps.length - 1) { state.index++; renderStep(); }
    else showScreen('screen-end');
  }
  function prev() {
    if (state.index > 0) { state.index--; renderStep(); }
  }

  // ─── Accueil ──────────────────────────────────────────────
  function renderHome() {
    const suggested = getSuggestedSet();
    document.getElementById('suggested-title').textContent = suggested.name;
    document.getElementById('suggested-day').textContent =
      `Aujourd'hui, ${getDayName().toLowerCase()}, l'Église médite ces mystères.`;
    document.getElementById('suggested-card').style.borderColor = suggested.accent;

    const grid = document.getElementById('mystery-cards');
    grid.innerHTML = '';
    Object.values(MYSTERY_SETS).forEach(set => {
      const card = document.createElement('button');
      card.className = 'mystery-card';
      card.style.borderLeft = `4px solid ${set.accent}`;
      card.innerHTML = `<span class="icon" style="color:${set.accent}">${set.icon}</span>
        <p class="name">${set.name}</p><p class="days">${set.days.join(' · ')}</p>`;
      card.addEventListener('click', () => startPrayer(set));
      grid.appendChild(card);
    });
  }

  // ─── Événements ──────────────────────────────────────────
  document.body.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    switch (t.dataset.action) {
      case 'start-suggested': startPrayer(getSuggestedSet()); break;
      case 'back':
        if (confirm('Quitter la prière en cours ?')) showScreen('screen-home');
        break;
      case 'info': showMeditation(); break;
      case 'prev': prev(); break;
      case 'next': next(); break;
      case 'home': showScreen('screen-home'); break;
    }
  });

  document.addEventListener('keydown', e => {
    if (!document.getElementById('screen-prayer').classList.contains('active')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  function showMeditation() {
    const step = state.steps[state.index];
    if (step && step.mystery) {
      alert(`${step.mystery.title}\n\n${step.mystery.fruit}\n\n${step.mystery.text}`);
    }
  }

  // ─── Démarrage ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderHome();
  });
})();
