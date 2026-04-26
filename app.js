// Logique de l'application : navigation, génération des étapes, progression
(function () {
  "use strict";

  const state = {
    set: null,            // jeu de mystères en cours
    steps: [],            // séquence des étapes du chapelet
    index: 0              // étape courante
  };

  // ----- Construction de la séquence de prière -----
  function buildSteps(set) {
    const steps = [];

    // Ouverture
    steps.push({ kind: "prayer", prayer: PRAYERS.signe, label: "Ouverture" });
    steps.push({ kind: "prayer", prayer: PRAYERS.credo, label: "Sur le crucifix", bead: "cross" });
    steps.push({ kind: "prayer", prayer: PRAYERS.pater, label: "Premier grain", bead: "pater" });

    // 3 Ave introductifs (Foi, Espérance, Charité)
    INITIAL_AVE_INTENTIONS.forEach((intention) => {
      steps.push({
        kind: "prayer",
        prayer: PRAYERS.ave,
        label: intention,
        bead: "ave"
      });
    });

    steps.push({ kind: "prayer", prayer: PRAYERS.gloria, label: "Doxologie" });

    // 5 dizaines
    set.mysteries.forEach((mystery, mIdx) => {
      const decadeNum = mIdx + 1;
      // Annonce + méditation + Notre Père
      steps.push({
        kind: "prayer",
        prayer: PRAYERS.pater,
        label: `${decadeNum}ᵉ dizaine`,
        bead: "pater",
        mystery: mystery,
        mysteryIndex: mIdx
      });
      // 10 Je vous salue Marie
      for (let i = 0; i < 10; i++) {
        steps.push({
          kind: "prayer",
          prayer: PRAYERS.ave,
          label: `${decadeNum}ᵉ dizaine — Ave ${i + 1}/10`,
          bead: "ave",
          mystery: mystery,
          mysteryIndex: mIdx
        });
      }
      // Gloria + prière de Fatima
      steps.push({
        kind: "prayer",
        prayer: PRAYERS.gloria,
        label: `${decadeNum}ᵉ dizaine — Gloire au Père`,
        mystery: mystery,
        mysteryIndex: mIdx
      });
      steps.push({
        kind: "prayer",
        prayer: PRAYERS.fatima,
        label: `${decadeNum}ᵉ dizaine — Prière de Fatima`,
        mystery: mystery,
        mysteryIndex: mIdx
      });
    });

    // Clôture
    steps.push({ kind: "prayer", prayer: PRAYERS.salveRegina, label: "Conclusion" });
    steps.push({ kind: "prayer", prayer: PRAYERS.signe, label: "Clôture" });

    return steps;
  }

  // ----- Visualisation du chapelet (séquence de billes) -----
  function buildRosaryVisual() {
    const container = document.getElementById("rosary-visual");
    container.innerHTML = "";
    state.steps.forEach((step, i) => {
      if (!step.bead) return; // on ne représente que les billes
      const dot = document.createElement("span");
      dot.className = `bead ${step.bead}`;
      dot.dataset.idx = String(i);
      container.appendChild(dot);
    });
  }

  function updateRosaryVisual() {
    const beads = document.querySelectorAll("#rosary-visual .bead");
    beads.forEach((b) => {
      const i = Number(b.dataset.idx);
      b.classList.toggle("done", i < state.index);
      b.classList.toggle("current", i === state.index);
    });
  }

  // ----- Affichage de l'étape courante -----
  function renderStep() {
    const step = state.steps[state.index];
    if (!step) return;

    document.getElementById("prayer-mystery-set").textContent = state.set.name;
    document.getElementById("prayer-step-title").textContent = step.label;
    document.getElementById("prayer-name").textContent = step.prayer.name;
    document.getElementById("prayer-body").textContent = step.prayer.body;

    const med = document.getElementById("mystery-meditation");
    if (step.mystery) {
      med.classList.remove("hidden");
      document.getElementById("meditation-title").textContent =
        `${step.mysteryIndex + 1}. ${step.mystery.title}`;
      document.getElementById("meditation-fruit").textContent = step.mystery.fruit;
      document.getElementById("meditation-text").textContent = step.mystery.text;
    } else {
      med.classList.add("hidden");
    }

    const total = state.steps.length;
    const done = state.index;
    document.getElementById("progress-fill").style.width =
      `${(done / (total - 1)) * 100}%`;
    document.getElementById("progress-text").textContent =
      `${done + 1} / ${total}`;

    document.querySelector('[data-action="prev"]').disabled = state.index === 0;
    const nextBtn = document.querySelector('[data-action="next"]');
    nextBtn.textContent = state.index === total - 1 ? "Terminer" : "Suivant";

    updateRosaryVisual();
  }

  // ----- Navigation entre écrans -----
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startPrayer(set) {
    state.set = set;
    state.steps = buildSteps(set);
    state.index = 0;
    buildRosaryVisual();
    renderStep();
    showScreen("screen-prayer");
  }

  function next() {
    if (state.index < state.steps.length - 1) {
      state.index++;
      renderStep();
    } else {
      showScreen("screen-end");
    }
  }

  function prev() {
    if (state.index > 0) {
      state.index--;
      renderStep();
    }
  }

  // ----- Accueil -----
  function renderHome() {
    const suggested = getSuggestedSet();
    document.getElementById("suggested-title").textContent = suggested.name;
    document.getElementById("suggested-day").textContent =
      `Aujourd'hui, ${getDayName().toLowerCase()}, l'Église médite ces mystères.`;
    document.getElementById("suggested-card").style.borderColor = suggested.accent;

    const grid = document.getElementById("mystery-cards");
    grid.innerHTML = "";
    Object.values(MYSTERY_SETS).forEach((set) => {
      const card = document.createElement("button");
      card.className = "mystery-card";
      card.style.borderLeft = `4px solid ${set.accent}`;
      card.innerHTML = `
        <span class="icon" style="color:${set.accent}">${set.icon}</span>
        <p class="name">${set.name}</p>
        <p class="days">${set.days.join(" · ")}</p>
      `;
      card.addEventListener("click", () => startPrayer(set));
      grid.appendChild(card);
    });
  }

  // ----- Liaison des actions -----
  function bindActions() {
    document.body.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      switch (action) {
        case "start-suggested":
          startPrayer(getSuggestedSet());
          break;
        case "back":
          if (confirm("Quitter la prière en cours ?")) showScreen("screen-home");
          break;
        case "info":
          showInfo();
          break;
        case "prev": prev(); break;
        case "next": next(); break;
        case "home": showScreen("screen-home"); break;
      }
    });

    // Raccourcis clavier
    document.addEventListener("keydown", (e) => {
      if (!document.getElementById("screen-prayer").classList.contains("active")) return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    });
  }

  function showInfo() {
    const step = state.steps[state.index];
    if (step && step.mystery) {
      alert(`${step.mystery.title}\n\n${step.mystery.fruit}\n\n${step.mystery.text}`);
    } else {
      alert("Récitez la prière à votre rythme. Utilisez « Suivant » ou la flèche droite pour avancer.");
    }
  }

  // ----- Démarrage -----
  document.addEventListener("DOMContentLoaded", () => {
    renderHome();
    bindActions();
  });
})();
