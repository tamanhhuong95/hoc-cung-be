"use strict";
(() => {
  const screen = document.querySelector('#thinking-games-screen');
  if (!screen) return;
  const $ = s => screen.querySelector(s);
  const games = {
    pattern: { title: 'Đoàn tàu quy luật', icon: '🚂', hint: 'Nhìn các toa tàu. Hình nào sẽ đi tiếp?' },
    odd: { title: 'Thám tử tí hon', icon: '🔎', hint: 'Chạm vào hình khác với những hình còn lại.' },
    count: { title: 'Khu vườn biết đếm', icon: '🌷', hint: 'Đếm những bạn nhỏ trong khu vườn rồi chọn số.' },
    order: { title: 'Bậc thang cầu vồng', icon: '🌈', hint: 'Chạm các số từ bé đến lớn để xây cầu vồng.' }
  };
  const symbols = ['🌷', '🌻', '🍎', '🍓', '🐝', '🦋', '🐢', '🐞'];
  let active = null, uid = null;
  const shuffle = (items, random = Math.random) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
    return result;
  };
  function createChallenge(kind, step = 0, random = Math.random) {
    if (!games[kind]) return null;
    const faces = shuffle(symbols, random), size = 2 + (step % 3);
    if (kind === 'pattern') {
      const units = step % 3 === 0 ? [faces[0], faces[1]] : step % 3 === 1 ? [faces[0], faces[0], faces[1]] : [faces[0], faces[1], faces[2]];
      const sequence = Array.from({ length: 5 + step % 2 }, (_, i) => units[i % units.length]);
      const answer = units[sequence.length % units.length];
      return { kind, items: sequence, options: shuffle([answer, ...faces.filter(x => x !== answer).slice(0, 2)], random), answer };
    }
    if (kind === 'odd') {
      const answer = Math.floor(random() * 6);
      return { kind, items: Array.from({ length: 6 }, (_, i) => i === answer ? faces[1] : faces[0]), options: [], answer };
    }
    if (kind === 'count') {
      const answer = 3 + Math.floor(random() * 7);
      return { kind, items: Array(answer).fill(faces[0]), options: shuffle([answer - 1, answer, answer + 1], random), answer };
    }
    const numbers = shuffle(Array.from({ length: 10 }, (_, i) => i + 1), random).slice(0, size + 2);
    return { kind, items: shuffle(numbers, random), options: [], answer: [...numbers].sort((a, b) => a - b) };
  }
  function createSession(kind, random = Math.random) {
    return games[kind] ? { kind, step: 0, solved: false, complete: false, chosen: [], challenge: createChallenge(kind, 0, random) } : null;
  }
  function answer(state, value) {
    if (!state || state.solved || state.complete) return 'ignored';
    const q = state.challenge;
    if (q.kind === 'order') {
      if (!q.items.includes(value) || state.chosen.includes(value)) return 'ignored';
      if (value !== q.answer[state.chosen.length]) return 'retry';
      state.chosen.push(value);
      if (state.chosen.length < q.answer.length) return 'partial';
    } else {
      if (q.kind === 'odd' ? !Number.isInteger(value) || value < 0 || value >= q.items.length : !q.options.includes(value)) return 'ignored';
      if (value !== q.answer) return 'retry';
    }
    state.solved = true;
    state.complete = state.step === 4;
    return state.complete ? 'complete' : 'solved';
  }
  function next(state, random = Math.random) {
    if (!state || !state.solved || state.complete) return false;
    state.step++; state.solved = false; state.chosen = []; state.challenge = createChallenge(state.kind, state.step, random);
    return true;
  }
  function reset() {
    active = null;
    $('#games-gallery').hidden = false;
    $('#playground-stage').hidden = true;
    $('#playground-board').replaceChildren(); $('#playground-options').replaceChildren();
    $('#playground-feedback').textContent = '';
  }
  function home() {
    window.HocCungBeThinkingGames.reset(); reset();
    $('#thinking-title').focus({ preventScroll: true });
  }
  function button(label, value, container, className = '') {
    const node = document.createElement('button'); node.type = 'button'; node.className = className;
    node.textContent = label; node.addEventListener('click', () => choose(value, node)); container.append(node);
    return node;
  }
  function render() {
    const q = active.challenge, meta = games[active.kind];
    $('#playground-title').textContent = `${meta.icon} ${meta.title}`;
    $('#playground-hint').textContent = meta.hint;
    $('#playground-counter').textContent = `Chặng ${active.step + 1} / 5`;
    $('#playground-progress').value = active.step;
    $('#playground-board').replaceChildren(); $('#playground-options').replaceChildren();
    $('#playground-board').className = `playground-board board-${active.kind}`;
    $('#playground-feedback').textContent = 'Mình cùng khám phá nhé!';
    $('#playground-next').hidden = true; $('#playground-replay').hidden = true;
    q.items.forEach((item, i) => {
      if (q.kind === 'odd' || q.kind === 'order') {
        const b = button(String(item), q.kind === 'odd' ? i : item, $('#playground-board'), 'playground-tile');
        b.setAttribute('aria-label', q.kind === 'odd' ? `Hình ${i + 1}: ${item}` : `Số ${item}`);
      } else {
        const node = document.createElement('span'); node.textContent = item; node.className = 'garden-object'; $('#playground-board').append(node);
      }
    });
    if (q.kind === 'pattern') { const blank = document.createElement('span'); blank.className = 'train-missing'; blank.textContent = '?'; blank.setAttribute('aria-label', 'Toa tàu còn thiếu'); $('#playground-board').append(blank); }
    q.options.forEach(value => button(String(value), value, $('#playground-options'), 'playground-choice'));
  }
  function start(kind) {
    if (screen.hidden || !games[kind] || window.HocCungBeLearning?.canStartThinkingGame?.() === false) return false;
    window.HocCungBeThinkingGames.reset(); reset(); active = createSession(kind);
    $('#games-gallery').hidden = true; $('#memory-intro').hidden = true;
    $('#playground-stage').hidden = false; render();
    $('#playground-title').focus({ preventScroll: true }); return true;
  }
  function choose(value, node) {
    if (screen.hidden || $('#playground-stage').hidden) return;
    const outcome = answer(active, value);
    if (outcome === 'ignored') return;
    if (outcome === 'retry') { $('#playground-feedback').textContent = active.kind === 'order' ? 'Mình tìm số bé nhất còn lại nhé. Con thử lại nào!' : 'Chưa đúng rồi. Con quan sát thêm rồi thử lại nhé!'; return; }
    node.classList.add('is-correct'); node.disabled = true;
    if (outcome === 'partial') { $('#playground-feedback').textContent = `Được rồi! Con tìm số tiếp theo nhé.`; $('#playground-board button:not(:disabled)')?.focus({ preventScroll: true }); return; }
    [...$('#playground-board').querySelectorAll('button'), ...$('#playground-options').querySelectorAll('button')].forEach(b => b.disabled = true);
    $('#playground-progress').value = active.step + 1;
    $('#playground-feedback').textContent = active.complete ? '🎉 Con đã đi hết năm chặng! Cảm ơn con đã kiên trì khám phá.' : '✨ Đúng rồi! Mình khám phá chặng tiếp theo nhé.';
    $('#playground-next').hidden = active.complete; $('#playground-replay').hidden = !active.complete;
    (active.complete ? $('#playground-replay') : $('#playground-next')).focus({ preventScroll: true });
  }
  screen.querySelectorAll('[data-thinking-game]').forEach(b => b.addEventListener('click', () => start(b.dataset.thinkingGame)));
  $('#memory-start').addEventListener('click', () => { if (window.HocCungBeThinkingGames.getSummary()) { reset(); $('#games-gallery').hidden = true; } });
  $('#playground-next').addEventListener('click', () => { if (next(active)) { render(); $('#playground-title').focus({ preventScroll: true }); } });
  $('#playground-replay').addEventListener('click', () => { if (active) start(active.kind); });
  screen.querySelectorAll('[data-game-home]').forEach(b => b.addEventListener('click', home));
  ['hoc-cung-be:screen-changed', 'hoc-cung-be:child-will-change', 'hoc-cung-be:child-changed'].forEach(name => window.addEventListener(name, reset));
  window.addEventListener('hoc-cung-be:auth-state', e => { const nextUid = e.detail?.user?.uid || null; if (uid !== nextUid) reset(); uid = nextUid; });
  window.HocCungBePlayground = { createChallenge, createSession, answer, next, start, reset: home, getSummary: () => active ? { kind: active.kind, step: active.step, solved: active.solved, complete: active.complete, chosen: active.chosen.length } : null };
  reset();
})();

