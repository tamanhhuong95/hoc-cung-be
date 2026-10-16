"use strict";

(() => {
  const screen = document.querySelector("#thinking-games-screen");
  if (!screen) return;
  const $ = (selector) => screen.querySelector(selector);
  const faces = [
    { id: "cat", label: "Mèo", icon: "🐱" },
    { id: "dog", label: "Chó", icon: "🐶" },
    { id: "rabbit", label: "Thỏ", icon: "🐰" },
    { id: "bear", label: "Gấu", icon: "🐻" },
  ];
  let round = null, mismatchTimer = null, generation = 0, accountUid = null;

  function createRound(random = Math.random) {
    const cards = faces.flatMap((face) => [{ ...face }, { ...face }]);
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [cards[index], cards[other]] = [cards[other], cards[index]];
    }
    return { cards, selected: [], matched: new Set(), turns: 0, waiting: false, complete: false };
  }

  function chooseCard(state, index) {
    if (!state || !Number.isInteger(index) || !state.cards[index] || state.complete || state.waiting || state.matched.has(index) || state.selected.includes(index)) return "ignored";
    state.selected.push(index);
    if (state.selected.length === 1) return "first";
    state.turns += 1;
    const [first, second] = state.selected;
    if (state.cards[first].id !== state.cards[second].id) { state.waiting = true; return "mismatch"; }
    state.matched.add(first); state.matched.add(second); state.selected = [];
    state.complete = state.matched.size === state.cards.length;
    return state.complete ? "complete" : "match";
  }

  function closeMismatch(state) {
    if (!state?.waiting) return;
    state.selected = []; state.waiting = false;
  }

  function reset() {
    generation += 1; clearTimeout(mismatchTimer); mismatchTimer = null; round = null;
    $("#memory-intro").hidden = false; $("#memory-play").hidden = true; $("#memory-result").hidden = true;
    $("#memory-grid").replaceChildren(); $("#memory-grid").setAttribute("aria-busy", "false");
    $("#memory-status").textContent = "";
    $("#memory-pairs").textContent = "0 / 4"; $("#memory-turns").textContent = "0";
  }

  function updateCards() {
    for (const button of $("#memory-grid").querySelectorAll("button")) {
      const index = Number(button.dataset.memoryCard), face = round.cards[index];
      const matched = round.matched.has(index), open = matched || round.selected.includes(index);
      button.classList.toggle("is-open", open); button.classList.toggle("is-matched", matched);
      button.textContent = open ? face.icon : "?";
      button.disabled = matched || round.waiting;
      button.setAttribute("aria-pressed", String(open));
      button.setAttribute("aria-label", open ? `${face.label}${matched ? ", đã ghép" : ", đang lật"}` : `Thẻ số ${index + 1}, chưa lật`);
    }
    $("#memory-grid").setAttribute("aria-busy", String(round.waiting));
    $("#memory-pairs").textContent = `${round.matched.size / 2} / 4`;
    $("#memory-turns").textContent = String(round.turns);
  }

  function start() {
    if (screen.hidden || window.HocCungBeLearning?.canStartThinkingGame?.() === false) return false;
    reset(); round = createRound();
    $("#memory-intro").hidden = true; $("#memory-play").hidden = false;
    $("#memory-restart").textContent = "Chơi lại từ đầu";
    round.cards.forEach((_, index) => {
      const button = document.createElement("button"); button.type = "button";
      button.className = "memory-card"; button.dataset.memoryCard = String(index);
      $("#memory-grid").append(button);
    });
    updateCards(); $("#memory-status").textContent = "Con lật một thẻ nhé.";
    $("#memory-grid button").focus({ preventScroll: true });
    return true;
  }

  function play(index) {
    if (screen.hidden) return;
    const outcome = chooseCard(round, index);
    if (outcome === "ignored") return;
    updateCards();
    if (outcome === "first") { $("#memory-status").textContent = `Con tìm hình ${round.cards[index].label.toLowerCase()} giống thế nhé.`; return; }
    if (outcome === "mismatch") {
      $("#memory-status").textContent = "Hai hình khác nhau. Mình thử lại nhé!";
      const current = generation;
      mismatchTimer = setTimeout(() => {
        if (generation !== current || !round || screen.hidden) return;
        closeMismatch(round); updateCards(); $("#memory-status").textContent = "Con lật hai thẻ khác nhé.";
        $(`[data-memory-card="${index}"]`)?.focus({ preventScroll: true });
      }, 1100);
      return;
    }
    if (outcome === "complete") {
      $("#memory-status").textContent = "Con đã tìm đủ bốn cặp!";
      $("#memory-result").hidden = false; $("#memory-result-title").focus({ preventScroll: true });
      $("#memory-restart").textContent = "Chơi ván mới";
    } else {
      $("#memory-status").textContent = "Đúng một cặp rồi! Con tìm tiếp nhé.";
      $("#memory-grid button:not(:disabled)")?.focus({ preventScroll: true });
    }
  }

  $("#memory-start").addEventListener("click", start);
  $("#memory-restart").addEventListener("click", start);
  $("#memory-grid").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-memory-card]");
    if (button) play(Number(button.dataset.memoryCard));
  });
  window.addEventListener("hoc-cung-be:screen-changed", (event) => {
    reset();
    if (event.detail?.name === "thinking-games") $("#thinking-title").focus({ preventScroll: true });
  });
  ["hoc-cung-be:child-will-change", "hoc-cung-be:child-changed"].forEach((name) => window.addEventListener(name, reset));
  window.addEventListener("hoc-cung-be:auth-state", (event) => {
    const nextUid = event.detail?.user?.uid || null;
    if (nextUid !== accountUid) reset();
    accountUid = nextUid;
  });
  reset();
  window.HocCungBeThinkingGames = { createRound, chooseCard, closeMismatch, reset, getSummary: () => round ? { pairs: round.matched.size / 2, turns: round.turns, waiting: round.waiting, complete: round.complete } : null };
})();
