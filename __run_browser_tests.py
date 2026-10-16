import http.server
import json
import pathlib
import re
import shutil
import socket
import subprocess
import sys
import tempfile
import threading
import time
import traceback
import uuid

import requests
import websockets.sync.client

ROOT = pathlib.Path(__file__).resolve().parent
RUNNER = ROOT / "__browser-test-runner.html"
PROFILE = pathlib.Path(tempfile.gettempdir()) / f"hoc-cung-be-browser-tests-{uuid.uuid4().hex}"
REPORT = ROOT / "__full_regression_report.json"
DIAGNOSTIC = ROOT / "__browser_test_diagnostic.json"
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
DEBUG_PORT = 9342
HTTP_PORT = 8767
MIN_CHECKS = 497
CHROME_STDERR = pathlib.Path(tempfile.gettempdir()) / f"hoc-cung-be-chrome-{uuid.uuid4().hex}.stderr.txt"
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

probe = r'''
<script>
const runtimeErrors = [];
window.__hcbRegressionState = { stage: "J. suite hooks ready", hooksReady: false, pendingHooks: [], suitesComplete: false };
const originalConsoleError = console.error.bind(console);
console.error = (...args) => { runtimeErrors.push({ type: "console.error", message: args.map((value) => value instanceof Error ? value.stack || value.message : String(value)).join(" ") }); originalConsoleError(...args); };
window.addEventListener("error", (event) => {
  const target = event.target;
  if (target && target !== window && (target.tagName === "SCRIPT" || target.tagName === "LINK" || target.tagName === "IMG")) {
    runtimeErrors.push({ type: `failed-${target.tagName.toLowerCase()}-load`, source: target.src || target.href || "" });
    return;
  }
  runtimeErrors.push({ type: "pageerror", message: event.message || String(event.error || "Unknown error"), source: event.filename || "", line: event.lineno || 0 });
}, true);
window.addEventListener("unhandledrejection", (event) => runtimeErrors.push({ type: "unhandledrejection", message: String(event.reason || "Unknown rejection") }));
window.addEventListener("load", async () => {
  const registry = [
    ["Math clock", "__hocCungBeClockTests"],
    ["Math five-question lessons", "__hocCungBeFiveQuestionTests"],
    ["Math progress compatibility", "__hocCungBeProgressTests"],
    ["Math counting", "__hocCungBeCountingQuestionTests"],
    ["V34 original-content audit", "__hocCungBeContentPilotTests"],
    ["V35 quality fixes", "__hocCungBeV35QualityFixTests"],
    ["V36 small UX and retention", "__hocCungBeV36UxTests"],
    ["Math geometry and sequences", "__hocCungBeGeometryAndSequenceTests"],
    ["Audio and speech", "__hocCungBeAudioAndSpeechTests"],
    ["Mascot and results", "__hocCungBeMascotAndResultTests"],
    ["Parent dashboard", "__hocCungBeParentDashboardTests"],
    ["Dynamic curriculum", "__hocCungBeDynamicLevelTests"],
    ["Guest Trial", "__hocCungBeGuestTrialTests"],
    ["Multi-course and Vietnamese", "__hocCungBeMultiCourseTests"],
    ["English Grade 1 EN-01 to EN-40", "__hocCungBeEnglishGrade1Tests"],
    ["English skill analytics", "__hocCungBeLearningAnalyticsTests"],
    ["Parent Weekly Report", "__hocCungBeWeeklyReportTests"],
    ["PWA and offline", "__hocCungBePwaTests"],
    ["Branding and icons", "__hocCungBeBrandingTests"],
    ["Parent Auth, verification, recovery, password and phone", "__hocCungBeParentAuthTests"],
    ["Child Profiles", "__hocCungBeChildProfilesTests"],
    ["Cloud Sync", "__hocCungBeCloudSyncTests"],
    ["Parent PIN and feedback", "__hocCungBeParentPinFeedbackTests"],
    ["Child Settings and cross-course limits", "__hocCungBeChildSettingsTests"],
  ];
  const suites = {}, missingSuites = [];
  const hookReady = (hook) => Boolean(window[hook]) && window[hook]?.pending !== true;
  const hookDeadline = performance.now() + 10000;
  while (registry.some(([, hook]) => !hookReady(hook)) && performance.now() < hookDeadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  window.__hcbRegressionState.hooksReady = registry.every(([, hook]) => hookReady(hook));
  window.__hcbRegressionState.pendingHooks = registry.filter(([, hook]) => !hookReady(hook)).map(([suite, hook]) => ({ suite, hook, exists: hook in window, pending: window[hook]?.pending === true }));
  const state = () => ({ activeScreen: [...document.querySelectorAll(".screen")].find((screen) => !screen.hidden)?.id || null, course: document.body.dataset.course || null, authenticated: document.body.dataset.authenticated || null, topics: document.querySelectorAll("#topic-grid button").length, levels: document.querySelectorAll("#level-grid button").length, answers: document.querySelectorAll("#answer-grid button").length, quizHidden: document.querySelector("#quiz-screen")?.hidden });
  const isQuiz = () => { const screen = document.querySelector("#quiz-screen"); return Boolean(screen && !screen.hidden && document.querySelectorAll("#answer-grid button").length === 4 && document.querySelector("#question-count")?.textContent.includes("1 / 5")); };
  const click = (selector, root = document) => { const node = root.querySelector(selector); if (!node) throw new Error(`Missing clickable element: ${selector}`); if (node.disabled) throw new Error(`Clickable element is disabled: ${selector}`); node.click();
    const dialog = document.querySelector("#quiz-leave-dialog");
    if (dialog && !dialog.hidden && !node.closest("#quiz-leave-dialog")) {
      if (document.querySelector("#quiz-screen").hidden) throw new Error("Quiz left before confirmation");
      document.querySelector("#quiz-leave-confirm").click();
      if (!dialog.hidden) throw new Error("Leave confirmation did not close dialog");
    }
    return node; };
  const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  const expectScreen = (screenId, label) => { const actual = state(); if (actual.activeScreen !== screenId) throw new Error(`${label}: expected ${screenId}, got ${JSON.stringify(actual)}`); };
  const resetScreen = () => { click('[data-go="home"]'); expectScreen("home-screen", "reset screen"); };
  const resetGuest = () => {
    ["hoc-cung-be:guest-trial", "hoc-cung-be:math-grade-1-progress", "hoc-cung-be:progress:guest:vietnamese-grade-1", "hoc-cung-be:progress:testchild01:math-grade-1", "hoc-cung-be:progress:testchild01:vietnamese-grade-1", "hoc-cung-be:child-settings:testchild01"].forEach((key) => localStorage.removeItem(key));
    resetScreen();
    window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } }));
    expectScreen("home-screen", "reset guest auth");
  };
  const signedIn = () => {
    window.HocCungBeChildren = { ...window.HocCungBeChildren, getActiveChild: () => ({ id: "testchild01", name: "Bé Test", avatar: "🧒" }), getActiveChildId: () => "testchild01", openSelector: window.HocCungBeChildren?.openSelector || (() => {}) };
    window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: { uid: "test-parent", email: "test@example.com" } } }));
    if (document.body.dataset.authenticated !== "true") throw new Error("Mock authenticated state was not applied");
  };
  const enterQuiz = (courseId) => {
    click('[data-go="grade1"]');
    click(`button[data-course="${courseId}"]`);
    click("#topic-grid button");
    click("#level-grid button");
    if (courseId === "english-grade-1") { expectScreen("learn-screen", "English Learn"); click("#begin-practice-button"); }
    if (!isQuiz()) throw new Error(`${courseId} did not transition to quiz: ${JSON.stringify(state())}`);
  };

  const runV36InteractionTests = async () => {
    const results = [], test = async (id, fn) => { try { await wait(0); await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    const recommend = window.HocCungBeV36.recommendationForCourse;
    const child = { id: "v36-test" }, course = { id: "test", levels: [{ id: "a", topic: "t" }, { id: "b", topic: "t" }, { id: "c", topic: "t" }] };
    await test("A. New child recommendation says start", () => { if (recommend(child, course, { levels: { a: { unlocked: true } } }).reason !== "start") throw new Error("New child was labelled continue"); });
    await test("B. Unplayed incomplete does not override next after latest completion", () => { const got = recommend(child, course, { levels: { a: { unlocked: true }, b: { unlocked: true, completed: true, lastPlayedAt: "2026-10-15" }, c: { unlocked: true } } }); if (got.levelId !== "c" || got.reason !== "next") throw new Error(JSON.stringify(got)); });
    await test("C. Recently played incomplete has priority", () => { const got = recommend(child, course, { levels: { a: { unlocked: true, lastPlayedAt: "2026-10-14" }, b: { unlocked: true, completed: true, lastPlayedAt: "2026-10-15" }, c: { unlocked: true } } }); if (got.levelId !== "a" || got.reason !== "continue") throw new Error(JSON.stringify(got)); });
    await test("D. Leave dialog stay and confirm preserve attempt history", () => {
      resetGuest(); enterQuiz("math-grade-1");
      const history = JSON.stringify(window.eval("loadProgress().history"));
      document.querySelector("#quiz-back-button").click();
      const dialog = document.querySelector("#quiz-leave-dialog");
      if (dialog.hidden || document.querySelector("#quiz-screen").hidden) throw new Error("Navigation escaped before confirmation");
      document.querySelector("#quiz-leave-stay").click();
      if (!dialog.hidden || document.querySelector("#quiz-screen").hidden) throw new Error("Stay action failed");
      document.querySelector("#quiz-back-button").click(); document.querySelector("#quiz-leave-confirm").click();
      expectScreen("levels-screen", "V36 confirmed back");
      if (!dialog.hidden || JSON.stringify(window.eval("loadProgress().history")) !== history) throw new Error("Partial attempt persisted or dialog remained open");
    });
    await test("E. New child Home CTA says start", () => { resetGuest(); signedIn(); window.HocCungBeV36.refresh(); const card = document.querySelector("#home-continue-card"), button = document.querySelector("#home-continue-button"); if (card.hidden || !button.textContent.includes("Bắt đầu học")) throw new Error("New child Home CTA invalid"); });
    await test("F. Home CTA switches course before opening recommended lesson", () => {
      const originalLoad = window.HocCungBeLearning.loadProgressByCourse;
      try {
        window.eval('setActiveCourse("math-grade-1"); showScreen("home")');
        window.HocCungBeLearning.loadProgressByCourse = (courseId) => { const progress = originalLoad(courseId); if (courseId === "english-grade-1") progress.levels[window.HOC_CUNG_BE_ENGLISH_GRADE_1.levels[0].id].lastPlayedAt = "2026-10-16T10:00:00"; return progress; };
        window.HocCungBeV36.refresh(); const button = document.querySelector("#home-continue-button");
        if (button.dataset.courseId !== "english-grade-1") throw new Error("Latest course was not recommended");
        button.click(); expectScreen("learn-screen", "Home English CTA"); if (document.body.dataset.course !== "english-grade-1") throw new Error("Home CTA retained wrong course");
      } finally { window.HocCungBeLearning.loadProgressByCourse = originalLoad; }
    });
    await test("G. Home refresh is bounded and preserves course/topic/level", async () => {
      resetGuest(); signedIn();
      const before = window.eval('(() => { setActiveCourse("math-grade-1"); selectedTopic = Object.keys(TOPICS)[1]; selectedLevelId = getLevelsByTopic(selectedTopic)[0].id; return JSON.stringify([activeCourseId, selectedTopic, selectedLevelId]); })()');
      let changes = 0; const listener = () => { changes += 1; }; window.addEventListener("hoc-cung-be:course-changed", listener);
      try { window.HocCungBeV36.refresh(); await wait(120); if (changes > 4) throw new Error(`Refresh scheduled recursively: ${changes} course changes`); if (window.eval('JSON.stringify([activeCourseId, selectedTopic, selectedLevelId])') !== before) throw new Error("Recommendation read changed learning context"); }
      finally { window.removeEventListener("hoc-cung-be:course-changed", listener); }
    });
    const resultFixture = (score, finalLevel = false) => {
      resetGuest(); signedIn(); enterQuiz("math-grade-1");
      window.eval(`(() => { if (${finalLevel}) { quiz.level = getLevelsByTopic(selectedTopic).at(-1); selectedLevelId = quiz.level.id; } quiz.score = ${score}; quiz.correct = ${score} / 20; const progress = loadProgress(); const next = getNextLevelInTopic(quiz.level.id); if (next) progress.levels[next.id].unlocked = ${score} >= 80; localStorage.setItem(progressStorageKey(), JSON.stringify(progress)); showScreen("result"); renderResult(progress); })()`);
      window.HocCungBeV36.refresh();
    };
    await test("H. Below 80 result prioritizes retry", () => { resultFixture(40); const retry = document.querySelector("#retry-button"), next = document.querySelector("#continue-button"); if (!retry.classList.contains("primary-button") || !retry.textContent.includes("Học lại để mở bài tiếp") || next.dataset.action !== "topic") throw new Error("Below-80 CTA invalid"); });
    await test("I. Passing result offers unlocked next lesson", () => { resultFixture(80); const next = document.querySelector("#continue-button"); if (!next.classList.contains("primary-button") || !next.textContent.includes("Học bài tiếp theo") || next.dataset.action !== "next" || !document.querySelector("#retry-button").textContent.includes("Ôn lại")) throw new Error("Passing CTA invalid"); });
    await test("J. Final lesson offers topic and review", () => { resultFixture(100, true); const next = document.querySelector("#continue-button"); if (!next.classList.contains("primary-button") || next.textContent !== "Về chủ đề" || next.dataset.action !== "topic") throw new Error("Final CTA invalid"); });
    await test("K. Exhausted guest retains login continuation", () => {
      resetGuest(); enterQuiz("math-grade-1"); window.eval('(() => { saveGuestTrial({ completedLevelIds: ["counting-1", "counting-2"] }); quiz.score = 100; quiz.correct = 5; const progress = loadProgress(); progress.levels["counting-2"].unlocked = true; localStorage.setItem(progressStorageKey(), JSON.stringify(progress)); showScreen("result"); renderResult(progress); })()');
      window.HocCungBeV36.refresh(); const next = document.querySelector("#continue-button");
      if (document.querySelector("#trial-result-gate").hidden || next.dataset.action !== "auth" || !next.textContent.includes("Đăng nhập")) throw new Error("V36 replaced exhausted guest login CTA");
    });
    await test("L. Login event refreshes Home without an extra click", async () => {
      resetGuest(); await wait(30); signedIn(); await wait(30);
      if (document.querySelector("#home-continue-card").hidden || !document.querySelector("#home-continue-context").textContent.includes("Bé Test")) throw new Error("Login left the child recommendation hidden or stale");
    });
    await test("M. Logout event hides child recommendation without an extra click", async () => {
      resetGuest(); signedIn(); window.HocCungBeV36.refresh();
      if (document.querySelector("#home-continue-card").hidden) throw new Error("Signed-in fixture has no recommendation");
      window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } })); await wait(30);
      if (!document.querySelector("#home-continue-card").hidden) throw new Error("Logout retained the previous child's visible recommendation");
    });
    await test("N. Cloud sync restores recommendation marker after level re-render", async () => {
      resetGuest(); signedIn(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); await wait(30);
      if (document.querySelectorAll("#level-grid .level-card__recommendation").length !== 1) throw new Error("Initial recommendation marker missing");
      window.dispatchEvent(new CustomEvent("hoc-cung-be:cloud-synced")); await wait(30);
      if (document.querySelectorAll("#level-grid .level-card__recommendation").length !== 1) throw new Error("Cloud sync removed the recommendation marker");
    });
    await test("O. Leave dialog traps Tab and Escape restores quiz focus", () => {
      resetGuest(); enterQuiz("math-grade-1"); const back = document.querySelector("#quiz-back-button"); back.click();
      const dialog = document.querySelector("#quiz-leave-dialog"), stay = document.querySelector("#quiz-leave-stay"), leave = document.querySelector("#quiz-leave-confirm");
      if (document.activeElement !== stay) throw new Error("Dialog did not focus stay action");
      leave.focus(); leave.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
      if (document.activeElement !== stay) throw new Error("Tab escaped the modal");
      stay.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
      if (document.activeElement !== leave) throw new Error("Shift+Tab escaped the modal");
      leave.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
      if (!dialog.hidden || document.querySelector("#quiz-screen").hidden || document.activeElement !== back) throw new Error("Escape did not retain quiz and restore focus");
    });
    return { passed: results.every((item) => item.passed), results };
  };

  const runThinkingGameTests = async () => {
    const results = [], test = async (id, fn) => { try { await wait(0); await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    const game = window.HocCungBeThinkingGames;
    const fixture = () => game.createRound(() => 0);
    const partner = (state, index) => state.cards.findIndex((card, other) => other !== index && card.id === state.cards[index].id);
    const wrong = (state, index) => state.cards.findIndex((card) => card.id !== state.cards[index].id);
    const allPairs = (state) => [...new Set(state.cards.map(card => card.id))].map(id => state.cards.flatMap((card,index) => card.id === id ? [index] : []));
    const storage = () => JSON.stringify(Object.keys(localStorage).filter(key => key.startsWith("hoc-cung-be:")).sort().map(key => [key,localStorage.getItem(key)]));
    const tile = (index) => document.querySelector(`#memory-grid [data-memory-card="${index}"]`);
    const enter = () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-go="thinking-games"]'); expectScreen("thinking-games-screen", "Thinking game entry"); };
    const start = () => { const original = Math.random; try { Math.random = () => 0; click("#memory-start"); } finally { Math.random = original; } };
    const fresh = () => { enter(); start(); };
    const finish = () => { for (const [first,second] of allPairs(fixture())) { tile(first).click(); tile(second).click(); } };
    await test("A. Short round contains exactly eight cards", () => { if (fixture().cards.length !== 8) throw new Error("Expected eight cards"); });
    await test("B. Exactly four familiar pictures occur twice", () => { const counts = Object.values(fixture().cards.reduce((map,card) => ({...map,[card.id]:(map[card.id]||0)+1}),{})); if (counts.length !== 4 || counts.some(n => n !== 2)) throw new Error("Pair distribution invalid"); });
    await test("C. Shuffle preserves pair inventory across rounds", () => { const expected=fixture().cards.map(card=>card.id).sort().join(); for (let n=0;n<8;n++) if(game.createRound().cards.map(card=>card.id).sort().join()!==expected) throw new Error("Shuffle lost a card"); });
    await test("D. First flip does not award a pair or turn", () => { const state=fixture(); if(game.chooseCard(state,0)!=="first" || state.turns || state.matched.size || state.selected.length!==1) throw new Error("First flip mutated result"); });
    await test("E. Same card cannot pair with itself", () => { const state=fixture(); game.chooseCard(state,0); if(game.chooseCard(state,0)!=="ignored" || state.turns || state.matched.size) throw new Error("Self pairing allowed"); });
    await test("F. Correct two cards award one pair in one turn", () => { const state=fixture(); game.chooseCard(state,0); if(game.chooseCard(state,partner(state,0))!=="match" || state.turns!==1 || state.matched.size!==2 || state.selected.length) throw new Error("Match invalid"); });
    await test("G. Already matched card cannot be counted again", () => { const state=fixture(); game.chooseCard(state,0); game.chooseCard(state,partner(state,0)); if(game.chooseCard(state,0)!=="ignored" || state.matched.size!==2 || state.turns!==1) throw new Error("Repeated match scored"); });
    await test("H. Mismatch blocks a third flip", () => { const state=fixture(); game.chooseCard(state,0); if(game.chooseCard(state,wrong(state,0))!=="mismatch" || !state.waiting || game.chooseCard(state,partner(state,0))!=="ignored" || state.selected.length!==2) throw new Error("Third flip was accepted"); });
    await test("I. Mismatch clears safely without a pair", () => { const state=fixture(); game.chooseCard(state,0); game.chooseCard(state,wrong(state,0)); game.closeMismatch(state); if(state.waiting || state.selected.length || state.matched.size || state.turns!==1 || game.chooseCard(state,0)!=="first") throw new Error("Mismatch did not recover"); });
    await test("J. Round completes once all four pairs match", () => { const state=fixture(); let outcome; for(const [a,b] of allPairs(state)){game.chooseCard(state,a);outcome=game.chooseCard(state,b);} if(outcome!=="complete" || !state.complete || state.turns!==4 || state.matched.size!==8 || game.chooseCard(state,0)!=="ignored") throw new Error("Completion invalid"); });
    await test("K. Invalid positions do not mutate round", () => { const state=fixture(); for(const i of [-1,8,1.5,NaN]) if(game.chooseCard(state,i)!=="ignored") throw new Error("Invalid index accepted"); if(state.turns || state.selected.length) throw new Error("Invalid click mutated state"); });
    await test("L. Grade one exposes one playable thinking game", () => { enter(); if(document.querySelectorAll('#grade1-screen button[data-go="thinking-games"]').length!==1 || document.querySelectorAll('#grade1-screen button[data-course]').length!==3) throw new Error("Subject navigation changed"); });
    await test("M. Intro explains matching without time pressure", () => { if(document.querySelector("#memory-intro").hidden || !document.querySelector("#memory-intro").textContent.includes("không cần vội")) throw new Error("Intro missing"); });
    await test("N. Start renders eight concealed accessible cards", () => { start(); const cards=[...document.querySelectorAll("#memory-grid button")]; if(cards.length!==8 || cards.some(b=>b.textContent!=="?" || !b.getAttribute("aria-label").includes("chưa lật"))) throw new Error("Face exposed before flip"); });
    await test("O. First card reveals a labelled picture", () => { tile(0).click(); if(tile(0).textContent!==fixture().cards[0].icon || tile(0).getAttribute("aria-pressed")!=="true") throw new Error("Flip missing accessible face"); });
    await test("P. Double click does not increment turns", () => { tile(0).click(); if(document.querySelector("#memory-turns").textContent!=="0") throw new Error("Double click counted"); });
    await test("Q. Mismatch feedback locks input then hides both cards", async () => { const other=wrong(fixture(),0); tile(other).click(); const turns=game.getSummary().turns; tile(partner(fixture(),0)).click(); if(document.querySelector("#memory-grid").getAttribute("aria-busy")!=="true" || game.getSummary().turns!==turns || document.querySelectorAll("#memory-grid .is-open").length!==2) throw new Error("Mismatch lock missing"); await wait(1250); if(document.querySelectorAll("#memory-grid .is-open").length || game.getSummary().waiting || game.getSummary().pairs) throw new Error("Mismatch timeout invalid"); });
    await test("R. Matching UI retains two disabled matched faces", () => { fresh(); tile(0).click(); tile(partner(fixture(),0)).click(); if(document.querySelectorAll("#memory-grid .is-matched:disabled").length!==2 || document.querySelector("#memory-pairs").textContent!=="1 / 4") throw new Error("Matched pair not retained"); });
    await test("S. Completing UI shows positive result and replay", () => { fresh(); finish(); if(document.querySelector("#memory-result").hidden || game.getSummary().pairs!==4 || document.activeElement.id!=="memory-result-title" || !document.querySelector("#memory-restart").textContent.includes("ván mới")) throw new Error("Completion screen invalid"); });
    await test("T. Replay starts a new clean round", () => { click("#memory-restart"); if(game.getSummary().pairs || game.getSummary().turns || document.querySelectorAll("#memory-grid button").length!==8 || !document.querySelector("#memory-result").hidden) throw new Error("Replay retained old result"); });
    await test("U. Replay during mismatch cancels old flip timer", async () => { fresh();tile(0).click();tile(wrong(fixture(),0)).click();click("#memory-restart");await wait(1250);if(game.getSummary().turns || game.getSummary().waiting || document.querySelector("#memory-status").textContent!=="Con lật một thẻ nhé.") throw new Error("Stale timer altered new round"); });
    await test("V. Leaving during mismatch clears round and timer", async () => { fresh();tile(0).click();tile(wrong(fixture(),0)).click();click('#thinking-games-screen [data-go="grade1"]');await wait(1250);expectScreen("grade1-screen","leave game");if(game.getSummary()!==null || document.querySelector("#memory-grid").children.length) throw new Error("Round survived navigation"); });
    await test("W. Child switch clears current round", () => { fresh();tile(0).click();window.dispatchEvent(new CustomEvent("hoc-cung-be:child-will-change",{detail:{child:{id:"other-child"}}}));if(game.getSummary()!==null || document.querySelector("#memory-grid").children.length) throw new Error("Round leaked to next child"); });
    await test("X. Auth transition clears current round", () => { enter();signedIn();start();tile(0).click();window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}));if(game.getSummary()!==null || !document.querySelector("#memory-play").hidden) throw new Error("Round survived logout"); });
    await test("Y. Complete game does not persist lesson results or quota", async () => { fresh();await wait(30);const before=storage();finish();await wait(30);if(storage()!==before) throw new Error("Game changed application storage"); });
    await test("Z. Existing child settings can block game start", () => { enter();const original=window.HocCungBeChildSettings.canStartLesson;try{window.HocCungBeChildSettings.canStartLesson=()=>false;start();if(game.getSummary()!==null || document.querySelector("#memory-intro").hidden) throw new Error("Parent limit was bypassed");}finally{window.HocCungBeChildSettings.canStartLesson=original;} });
    await test("AA. Settings check preserves course topic and level context", () => { enter();const original=window.HocCungBeChildSettings.canStartLesson;const before=window.eval('(() => { selectedTopic=Object.keys(TOPICS)[1];selectedLevelId=getLevelsByTopic(selectedTopic)[0].id;return JSON.stringify([activeCourseId,selectedTopic,selectedLevelId]);})()');try{window.HocCungBeChildSettings.canStartLesson=()=>{for(const id of ["math-grade-1","vietnamese-grade-1","english-grade-1"])window.HocCungBeLearning.loadProgressByCourse(id);return true;};start();if(window.eval('JSON.stringify([activeCourseId,selectedTopic,selectedLevelId])')!==before)throw new Error("Game start changed lesson context");}finally{window.HocCungBeChildSettings.canStartLesson=original;} });
    await test("AB. PWA caches both game assets in V37", async () => { const sw=await fetch("service-worker.js",{cache:"no-store"}).then(r=>r.text());if(!sw.includes('"./thinking-games.js"') || !sw.includes('"./thinking-games.css"') || !sw.includes('hoc-cung-be-v37'))throw new Error("Game missing from offline cache"); });
    await test("AC. Cards meet touch target and reduced-motion support", async () => { const cards=[...document.querySelectorAll("#memory-grid button")];const css=await fetch("thinking-games.css",{cache:"no-store"}).then(r=>r.text());if(cards.length!==8 || cards.some(b=>b.getBoundingClientRect().height<44 || b.getBoundingClientRect().width<44) || !css.includes("prefers-reduced-motion"))throw new Error("Game accessibility sizing invalid"); });
    await test("AD. Hidden game cannot start from stale controls", () => { click('#thinking-games-screen [data-go="grade1"]');document.querySelector("#memory-start").click();if(game.getSummary()!==null || !document.querySelector("#thinking-games-screen").hidden)throw new Error("Hidden game restarted"); });
    await test("AE. Repeated guest auth event keeps the current round", () => { fresh();tile(0).click();window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state",{detail:{user:null}}));if(game.getSummary()===null || !tile(0).classList.contains("is-open"))throw new Error("Unchanged guest context reset the round"); });
    return {passed:results.every(item=>item.passed),results};
  };
  const runEnglishInteractionTests = async () => {
    const results = [], test = async (id, fn) => { try { await wait(0); await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    await test("A. English course opens Learn before Practice", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="english-grade-1"]'); click("#topic-grid button"); click("#level-grid button"); expectScreen("learn-screen", "English Learn"); if (!document.querySelector("#learn-word-grid button") || document.querySelectorAll("#learn-word-grid button").length < 3) throw new Error("English Learn cards missing"); });
    await test("B. English Learn audio control is clickable", () => { const button = click("#learn-word-grid button"); if (!button.getAttribute("aria-label")?.startsWith("Nghe")) throw new Error("Learn audio aria-label missing"); });
    await test("C. English Practice renders four choices", () => { click("#begin-practice-button"); if (!isQuiz()) throw new Error(`English Practice invalid: ${JSON.stringify(state())}`); });
    await test("D. Wrong English answer supports retry feedback", () => { const correct = window.eval("quiz.questions[quiz.index].answer"); const wrong = [...document.querySelectorAll("#answer-grid button")].find((button) => button.dataset.answer !== correct); wrong.click(); if (!wrong.classList.contains("is-wrong") || !document.querySelector("#feedback").textContent.includes("Thử lại")) throw new Error("English retry feedback missing"); });
    await test("E. Correct English answer advances feedback", () => { const correct = window.eval("quiz.questions[quiz.index].answer"); const button = [...document.querySelectorAll("#answer-grid button")].find((item) => item.dataset.answer === correct); button.click(); if (!button.classList.contains("is-correct") || document.querySelector("#next-button").hidden) throw new Error("English correct feedback missing"); });
    await test("F. English task remains responsive at mobile width", () => { const card = document.querySelector("#quiz-screen .quiz-card"), answer = document.querySelector("#answer-grid button"); if (!card || !answer || answer.getBoundingClientRect().height < 44 || document.documentElement.scrollWidth > document.documentElement.clientWidth) throw new Error("English mobile interaction target/overflow invalid"); });
    await test("G. Course switch Math to English to Vietnamese to English preserves progress keys", () => { signedIn(); const keys = ["math-grade-1", "english-grade-1", "vietnamese-grade-1", "english-grade-1"]; for (const courseId of keys) { click("#quiz-back-button"); click('[data-go="grade1"]'); click(`button[data-course="${courseId}"]`); if (document.body.dataset.course !== courseId) throw new Error(`Course switch failed: ${courseId}`); if (courseId === "english-grade-1") { click("#topic-grid button"); click("#level-grid button"); expectScreen("learn-screen", "English re-entry"); } else { click("#topic-grid button"); click("#level-grid button"); expectScreen("quiz-screen", `${courseId} quiz`); } } if (localStorage.getItem("hoc-cung-be:progress:testchild01:english-grade-1") === localStorage.getItem("hoc-cung-be:progress:testchild01:math-grade-1") && localStorage.getItem("hoc-cung-be:progress:testchild01:english-grade-1")) throw new Error("Progress keys collided"); });
    return { passed: results.every((item) => item.passed), results };
  };
  const runEnglishVideoTests = async () => {
    const results = [], test = async (id, fn) => { try { await wait(0); await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    const manifest = await fetch("assets/english-grade-1/media-manifest.json", { cache: "no-store" }).then((response) => response.json());
    const loadMetadata = async (src, poster) => { const response = await fetch(src, { cache: "no-store" }), blob = await response.blob(), url = URL.createObjectURL(blob); return new Promise((resolve, reject) => { const video = document.createElement("video"); video.preload = "metadata"; video.poster = poster; video.playsInline = true; video.muted = true; video.onloadedmetadata = () => { const result = { duration: video.duration, width: video.videoWidth, height: video.videoHeight, readyState: video.readyState, error: video.error }; URL.revokeObjectURL(url); video.remove(); resolve(result); }; video.onerror = () => { URL.revokeObjectURL(url); video.remove(); reject(new Error(`Media error ${video.error?.code || "unknown"}: ${src}`)); }; video.src = url; document.body.append(video); video.load(); video.play().catch(() => {}); }); };
    await test("A. Seven real WebM files have valid MIME, EBML signature and size budget", async () => { if (manifest.version !== 2 || manifest.clips.length !== 7) throw new Error("v30 media manifest invalid"); const responses = await Promise.all(manifest.clips.map((clip) => fetch(clip.webm, { cache: "no-store" }))); const bodies = await Promise.all(responses.map((response) => response.arrayBuffer())); responses.forEach((response, index) => { const bytes = new Uint8Array(bodies[index]), clip = manifest.clips[index], signature = [...bytes.slice(0, 4)].map((value) => value.toString(16).padStart(2, "0")).join(""); if (!response.ok || !response.headers.get("content-type")?.includes("video/webm") || signature !== "1a45dfa3" || bytes.length <= 0 || bytes.length >= 2 * 1024 * 1024 || !clip.available) throw new Error(`${clip.levelId}: status=${response.status} mime=${response.headers.get("content-type")} signature=${signature} bytes=${bytes.length}`); }); if (bodies.reduce((sum, body) => sum + body.byteLength, 0) >= 4 * 1024 * 1024) throw new Error("Combined video budget exceeded"); });
    await test("B. All WebM metadata loads without media errors", async () => { const metadata = await Promise.all(manifest.clips.map((clip) => loadMetadata(clip.webm, clip.poster))); metadata.forEach((value, index) => { if (value.error || value.readyState < 1 || value.width !== 960 || value.height !== 540 || (!Number.isFinite(value.duration) && value.duration !== Infinity)) throw new Error(`${manifest.clips[index].levelId}: ${JSON.stringify(value)}`); }); });
    await test("C. Posters and fallback images exist", async () => { const paths = manifest.clips.flatMap((clip) => [clip.poster, clip.fallbackImage]), responses = await Promise.all(paths.map((path) => fetch(path, { cache: "no-store" }))); if (!responses.every((response) => response.ok && response.headers.get("content-type")?.includes("image/webp"))) throw new Error("Poster or fallback image invalid"); });
    await test("D. Missing video switches to animation and poster fallback without crash", () => { const host = document.createElement("div"), clip = manifest.clips[0]; document.body.append(host); renderEnglishMedia(host, { type: "video", available: false, poster: clip.poster, fallback: clip.fallbackImage, animationFallback: clip.animationFallback, ariaLabel: "Fallback test" }, "Fallback test"); if (host.querySelector("video") || !host.querySelector(".english-animation") || !host.querySelector(".english-media-poster")) throw new Error("Fallback state invalid"); host.remove(); });
    await test("E. Video quiz cues do not expose answer text", () => { const questions = window.HOC_CUNG_BE_ENGLISH_GRADE_1.levels.flatMap((item) => item.questions).filter((item) => item.type === "video-choice"); if (questions.length !== 5) throw new Error(`Expected 5 video questions, got ${questions.length}`); questions.forEach((question) => { const host = document.createElement("div"); renderEnglishMedia(host, question.video, "Video question"); if (host.textContent.toLowerCase().includes(question.answer.toLowerCase()) || host.querySelector("video")?.getAttribute("aria-label").toLowerCase().includes(question.answer.toLowerCase())) throw new Error(`Quiz answer leaked: ${question.id}`); }); });
    await test("F. Video component attributes and replay controls are present", () => { const host = document.createElement("div"), media = window.HOC_CUNG_BE_ENGLISH_GRADE_1.levels.find((item) => item.id === "EN-08").media.featured; renderEnglishMedia(host, media, "Greetings"); const video = host.querySelector("video"), source = host.querySelector("source"); if (!video?.controls || !video.playsInline || video.preload !== "metadata" || !video.poster || !video.getAttribute("aria-label") || source?.type !== "video/webm") throw new Error("Video attributes invalid"); });
    await test("G. Offline runtime video cache and v37 remain configured", async () => { const sw = await fetch("service-worker.js", { cache: "no-store" }).then((response) => response.text()); if (sw.match(/const CACHE_NAME = "([^"]+)"/)?.[1] !== "hoc-cung-be-v37" || !sw.includes('"./weekly-report.js"') || sw.includes("assets/english-grade-1/videos/") || !sw.includes('request.destination === "video"') || !sw.includes("cacheMediaRange") || !sw.includes("caches.match(request.url")) throw new Error("Offline video runtime cache invalid"); });
    return { passed: results.every((item) => item.passed), results };
  };
  const runCanEnterQuizTests = async () => {
    const results = [], test = async (id, fn) => { try { await wait(0); await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    await test("A. Guest can open first Math lesson", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); if (document.querySelector("#levels-screen").hidden || !document.querySelector("#level-grid button")) throw new Error(`Math first lesson did not open: ${JSON.stringify(state())}`); });
    await test("B. Guest can start Math quiz", () => { resetGuest(); enterQuiz("math-grade-1"); });
    await test("C. Guest can open first Vietnamese lesson", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); click("#topic-grid button"); if (document.querySelector("#levels-screen").hidden || !document.querySelector("#level-grid button")) throw new Error(`Vietnamese first lesson did not open: ${JSON.stringify(state())}`); });
    await test("D. Guest can start Vietnamese quiz", () => { resetGuest(); enterQuiz("vietnamese-grade-1"); });
    await test("E. Logged-in child can start Math quiz", () => { resetGuest(); signedIn(); enterQuiz("math-grade-1"); });
    await test("F. Logged-in child can start Vietnamese quiz", () => { resetGuest(); signedIn(); enterQuiz("vietnamese-grade-1"); });
    await test("G. Missing child settings uses defaults", () => { resetGuest(); signedIn(); localStorage.removeItem("hoc-cung-be:child-settings:testchild01"); if (!window.HocCungBeChildSettings.canStartLesson()) throw new Error("Missing settings blocked lesson"); enterQuiz("math-grade-1"); });
    await test("H. Missing cloud progress does not block start", () => { resetGuest(); signedIn(); localStorage.removeItem("hoc-cung-be:progress:testchild01:math-grade-1"); localStorage.removeItem("hoc-cung-be:progress:testchild01:vietnamese-grade-1"); enterQuiz("vietnamese-grade-1"); });
    await test("I. Course switch Math → Vietnamese → Math still starts quiz", () => { resetGuest(); signedIn(); enterQuiz("math-grade-1"); click("#quiz-back-button"); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); click("#topic-grid button"); click("#level-grid button"); if (!isQuiz()) throw new Error("Vietnamese did not start after switch"); click("#quiz-back-button"); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); click("#level-grid button"); if (!isQuiz()) throw new Error("Math did not restart after switch"); });
    await test("J. Refresh then start quiz works", () => { if (!isQuiz()) throw new Error("Refresh flow is executed by a dedicated fresh runner navigation"); });
    await test("K. v37 app shell includes required modules and shared artwork", async () => { const required = ["./script.js", "./learning-analytics.js", "./weekly-report.js", "./child-settings.js", "./parent-auth.js", "./child-profiles.js", "./data/vietnamese-grade-1.js", "./assets/backgrounds/van-mieu-quoc-tu-giam.webp", "./assets/english-grade-1/images/review-2.webp"]; const text = await fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()); if (text.match(/const CACHE_NAME = "([^"]+)"/)?.[1] !== "hoc-cung-be-v37" || !required.every((path) => text.includes(`"${path}"`))) throw new Error("v37 app shell is incomplete"); });
    await test("L. Math Back stays on Grade 1", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); expectScreen("math-screen", "Math course"); click('#math-screen .back-button[data-go="grade1"]'); expectScreen("grade1-screen", "Math Back immediate"); await wait(1100); expectScreen("grade1-screen", "Math Back stable"); });
    await test("M. Vietnamese Back stays on Grade 1", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Vietnamese course"); click('#math-screen .back-button[data-go="grade1"]'); expectScreen("grade1-screen", "Vietnamese Back immediate"); await wait(1100); expectScreen("grade1-screen", "Vietnamese Back stable"); });
    await test("N. Math quiz stays visible and Quiz Back returns to levels", async () => { resetGuest(); enterQuiz("math-grade-1"); await wait(1100); expectScreen("quiz-screen", "Math quiz stable"); click("#quiz-back-button"); expectScreen("levels-screen", "Quiz Back immediate"); await wait(1100); expectScreen("levels-screen", "Quiz Back stable"); });
    await test("O. Rapid Math Back then Vietnamese ends on Vietnamese", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click('#math-screen .back-button[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Rapid course immediate"); await wait(1100); const actual = state(); if (actual.activeScreen !== "math-screen" || actual.course !== "vietnamese-grade-1") throw new Error(`Rapid navigation ended incorrectly: ${JSON.stringify(actual)}`); });
    await test("P. Clicking a child element inside a level card starts quiz", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); click("#level-grid button strong"); if (!isQuiz()) throw new Error(`Level child click did not transition to quiz: ${JSON.stringify(state())}`); });
    return { passed: results.every((item) => item.passed), results };
  };
  const runAuthFunctionBackgroundTests = async () => {
    const results = [], test = async (id, fn) => { try { await wait(0); await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    const visibleNode = (node) => { if (!node) return false; for (let current = node; current; current = current.parentElement) { const style = getComputedStyle(current); if (current.hidden || style.display === "none" || style.visibility === "hidden") return false; } return true; };
    const visible = (selector) => visibleNode(document.querySelector(selector));
    const homeText = (selector) => document.querySelector(selector)?.textContent.trim() || "";
    const visibleHomeActions = (label) => [...document.querySelectorAll("#home-screen button, #home-screen a")].filter((node) => visibleNode(node) && node.textContent.trim() === label);
    const headerAuthActions = () => [...document.querySelectorAll('.site-header [data-auth-open="login"], .site-header [data-auth-open="register"]')];
    const checkResponsiveHome = async (width, height) => {
      const frame = document.createElement("iframe");
      frame.style.cssText = `position:absolute;left:-10000px;top:0;width:${width}px;height:${height}px;border:0`;
      try {
        frame.src = `index.html?responsive=${width}x${height}`;
        document.body.append(frame);
        const frameDeadline = performance.now() + 15000;
        while (performance.now() < frameDeadline) {
          const doc = frame.contentDocument;
          if (doc?.readyState === "complete" && doc.querySelector("#home-screen") && doc.querySelector("[data-home-learn-link]")) break;
          await wait(50);
        }
        if (frame.contentDocument?.readyState !== "complete" || !frame.contentDocument.querySelector("#home-screen") || !frame.contentDocument.querySelector("[data-home-learn-link]")) throw new Error(`Responsive ${width}x${height} app readiness timeout`);
        await wait(1200);
        const win = frame.contentWindow, doc = frame.contentDocument;
        win.dispatchEvent(new win.CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } }));
        await wait(200);
        const shown = (node) => { if (!node) return false; for (let current = node; current; current = current.parentElement) { const style = win.getComputedStyle(current); if (current.hidden || style.display === "none" || style.visibility === "hidden") return false; } return true; };
        const headerLabels = [...doc.querySelectorAll(".site-nav button")].filter(shown).map((node) => node.textContent.trim());
        const heroActions = [...doc.querySelectorAll("#home-screen button, #home-screen a")].filter((node) => shown(node));
        const authCounts = ["Đăng nhập", "Đăng ký"].map((label) => heroActions.filter((node) => node.textContent.trim() === label).length);
        const hiddenSections = [doc.querySelector("#home-parent-section"), doc.querySelector("#parent-account-entry")];
        const trial = doc.querySelector("[data-home-learn-link]"), trialRect = trial?.getBoundingClientRect();
        if (doc.documentElement.scrollWidth > width || doc.body.scrollWidth > width) throw new Error(`Horizontal overflow ${doc.documentElement.scrollWidth}/${doc.body.scrollWidth}`);
        if (JSON.stringify(headerLabels) !== JSON.stringify(["Home", "Học thử"])) throw new Error(`Guest header labels: ${headerLabels.join(", ")}`);
        if (authCounts[0] !== 1 || authCounts[1] !== 1 || !trialRect || trialRect.left < 0 || trialRect.right > width) throw new Error(`Hero actions invalid: ${authCounts.join("/")} trial=${trialRect?.left}-${trialRect?.right}`);
        hiddenSections.forEach((section) => { const rect = section?.getBoundingClientRect(); if (!section?.hidden || rect?.width !== 0 || rect?.height !== 0) throw new Error(`Responsive redundant section visible: ${section?.id}`); });
        win.dispatchEvent(new win.CustomEvent("hoc-cung-be:auth-state", { detail: { user: { uid: "responsive-user", email: "parent@example.com", displayName: "Phụ huynh", emailVerified: true } } }));
        const loggedInReady = () => shown(doc.querySelector("#function-menu-button")) && !shown(doc.querySelector("#home-login-button")) && !shown(doc.querySelector("#home-register-button")) && doc.querySelector("[data-home-learn-link]")?.textContent.trim() === "Bắt đầu học →";
        for (let attempt = 0; attempt < 10 && !loggedInReady(); attempt += 1) await wait(100);
        if (!loggedInReady()) throw new Error(`Responsive logged-in Home is invalid: menu=${shown(doc.querySelector("#function-menu-button"))} login=${shown(doc.querySelector("#home-login-button"))} register=${shown(doc.querySelector("#home-register-button"))} learn=${doc.querySelector("[data-home-learn-link]")?.textContent.trim()}`);
      } finally { frame.remove(); }
    };
    const redundantSections = () => [...document.querySelectorAll("[data-home-auth-redundant]")];
    const assertRedundantSectionsHidden = () => { const sections = redundantSections(); if (sections.length !== 2) throw new Error(`Expected 2 redundant Home sections, got ${sections.length}`); sections.forEach((section) => { const rect = section.getBoundingClientRect(), style = getComputedStyle(section); if (!section.hidden || style.display !== "none" || rect.width !== 0 || rect.height !== 0) throw new Error(`Redundant section occupies layout: ${section.id} hidden=${section.hidden} display=${style.display} rect=${rect.width}x${rect.height}`); }); };
    const assertLoggedInHome = () => { if (visibleHomeActions("Đăng nhập").length || visibleHomeActions("Đăng ký").length || visibleHomeActions("Học thử").length || visible("#home-login-button") || visible("#home-register-button")) throw new Error("Logged-in Home still has guest actions"); if (homeText("[data-home-learn-link]") !== "Bắt đầu học →" || homeText("#grade-choice-eyebrow") !== "CHỌN LỚP" || homeText("#grade-choice-title") !== "Bé muốn học lớp nào?") throw new Error(`Logged-in Home labels are invalid: ${homeText("[data-home-learn-link]")} / ${homeText("#grade-choice-eyebrow")} / ${homeText("#grade-choice-title")}`); assertRedundantSectionsHidden(); };
    const guestTrial = '.site-nav [data-go="grade1"][data-guest-only]';
    await test("A. Guest Header has no Đăng nhập", () => { resetGuest(); if (headerAuthActions().some((node) => node.dataset.authOpen === "login")) throw new Error("Header login entry remains"); });
    await test("B. Guest Header has no Đăng ký", () => { resetGuest(); if (headerAuthActions().some((node) => node.dataset.authOpen === "register")) throw new Error("Header register entry remains"); });
    await test("C. Guest Hero has exactly one Đăng nhập", () => { resetGuest(); if (visibleHomeActions("Đăng nhập").length !== 1 || !visible("#home-login-button")) throw new Error(`Guest login count is ${visibleHomeActions("Đăng nhập").length}`); });
    await test("D. Guest Hero has exactly one Đăng ký", () => { resetGuest(); if (visibleHomeActions("Đăng ký").length !== 1 || !visible("#home-register-button")) throw new Error(`Guest register count is ${visibleHomeActions("Đăng ký").length}`); });
    await test("E. Guest Hero and Header keep Học thử", () => { resetGuest(); if (!visible(guestTrial) || homeText("[data-home-learn-link]") !== "Học thử →") throw new Error("Guest trial action is missing"); });
    await test("F. Guest Home actionable auth counts are one each", () => { resetGuest(); const login = visibleHomeActions("Đăng nhập").length, register = visibleHomeActions("Đăng ký").length; if (login !== 1 || register !== 1) throw new Error(`Guest auth counts ${login}/${register}`); });
    await test("G. Guest home-parent-section is hidden at 0x0", () => { resetGuest(); const section = document.querySelector("#home-parent-section"), rect = section?.getBoundingClientRect(); if (!section?.hidden || rect?.width !== 0 || rect?.height !== 0) throw new Error(`home-parent-section is visible: ${rect?.width}x${rect?.height}`); });
    await test("H. Guest parent-account-entry is hidden at 0x0", () => { resetGuest(); const section = document.querySelector("#parent-account-entry"), rect = section?.getBoundingClientRect(); if (!section?.hidden || rect?.width !== 0 || rect?.height !== 0) throw new Error(`parent-account-entry is visible: ${rect?.width}x${rect?.height}`); });
    await test("I. Hero Đăng nhập reuses login flow", () => { resetGuest(); click("#home-login-button"); expectScreen("account-login-screen", "Hero login"); });
    await test("I1. Hero Đăng ký reuses register flow", () => { resetGuest(); click("#home-register-button"); expectScreen("account-register-screen", "Hero register"); });
    await test("I2. Hero Học thử reuses guest navigation", () => { resetGuest(); click("[data-home-learn-link]"); if (location.hash !== "#grade-choices") throw new Error(`Guest trial hash is ${location.hash}`); });
    await test("J. Logged-in Home has no Đăng nhập", () => { resetGuest(); signedIn(); if (visibleHomeActions("Đăng nhập").length) throw new Error("Login remains visible"); });
    await test("K. Logged-in Home has no Đăng ký", () => { resetGuest(); signedIn(); if (visibleHomeActions("Đăng ký").length) throw new Error("Register remains visible"); });
    await test("L. Logged-in Home has no Học thử and uses Bắt đầu học", () => { resetGuest(); signedIn(); if (visible(guestTrial) || visibleHomeActions("Học thử").length || homeText("[data-home-learn-link]") !== "Bắt đầu học →") throw new Error("Logged-in trial state is invalid"); });
    await test("M. Logged-in menu is visible", () => { resetGuest(); signedIn(); if (!visible("#function-menu-button")) throw new Error("Function menu is hidden"); });
    await test("N. Logged-in sees CHỌN LỚP and correct title", () => { resetGuest(); signedIn(); if (homeText("#grade-choice-eyebrow") !== "CHỌN LỚP" || homeText("#grade-choice-title") !== "Bé muốn học lớp nào?") throw new Error("Logged-in grade heading is invalid"); });
    await test("N1. Logged-in hides both parent Home sections and their text", () => { resetGuest(); signedIn(); assertRedundantSectionsHidden(); const visibleHomeText = [...document.querySelectorAll("#home-screen *")].filter(visibleNode).map((node) => node.textContent.trim()); const forbidden = ["DÀNH CHO PHỤ HUYNH", "Quản lý hành trình của bé", "DÀNH CHO NGƯỜI LỚN", "Tài khoản phụ huynh"]; if (forbidden.some((text) => visibleHomeText.includes(text))) throw new Error("A redundant Home label remains visible"); });
    await test("K. Logged-in still sees and enters Lớp 1", () => { resetGuest(); signedIn(); const card = document.querySelector('#grade-choices [data-go="grade1"]'); if (!visibleNode(card) || !card.textContent.includes("Lớp 1")) throw new Error("Lớp 1 card is missing"); card.click(); expectScreen("grade1-screen", "logged-in Lớp 1"); });
    await test("L. Logged-in Home survives Lớp 1 Back", () => { resetGuest(); signedIn(); click('#grade-choices [data-go="grade1"]'); click('#grade1-screen [data-go="home"]'); expectScreen("home-screen", "Lớp 1 Back Home"); assertLoggedInHome(); });
    await test("M. Logged-in Home survives child change", () => { resetGuest(); signedIn(); window.dispatchEvent(new CustomEvent("hoc-cung-be:child-changed", { detail: { child: { id: "testchild02", name: "Bé Hai", avatar: "👧" } } })); expectScreen("home-screen", "child change Home"); assertLoggedInHome(); });
    await test("N. Logged-in Home survives Parent Dashboard Back", () => { resetGuest(); signedIn(); window.eval('showScreen("parent-dashboard")'); expectScreen("parent-dashboard-screen", "Parent Dashboard"); click('#parent-dashboard-screen [data-go="home"]'); expectScreen("home-screen", "Parent Dashboard Back Home"); assertLoggedInHome(); });
    await test("O. Auth-ready refresh render does not recreate guest controls", async () => { resetGuest(); signedIn(); window.eval('installExperienceUi(); showScreen("home"); renderHeader();'); await wait(50); if (document.body.dataset.authResolved !== "true") throw new Error("Auth was not resolved"); assertLoggedInHome(); });
    await test("P. Logout restores only Hero auth controls", () => { resetGuest(); signedIn(); window.addEventListener("hoc-cung-be:sign-out", () => window.dispatchEvent(new CustomEvent("hoc-cung-be:auth-state", { detail: { user: null } })), { once: true }); click("#function-menu-button"); click('[data-function-action="logout"]'); if (visibleHomeActions("Đăng nhập").length !== 1 || visibleHomeActions("Đăng ký").length !== 1 || headerAuthActions().length || homeText("#grade-choice-eyebrow") !== "HỌC THỬ" || homeText("#grade-choice-title") !== "Học thử cùng bé" || visible("#function-menu-button")) throw new Error("Guest UI was not restored as Hero-only auth"); assertRedundantSectionsHidden(); });
    await test("P1. Login again keeps redundant Home sections hidden", () => { signedIn(); assertLoggedInHome(); });
    await test("Q. Logged-in sees Chức năng", () => { resetGuest(); signedIn(); const button = document.querySelector("#function-menu-button"); if (!visible("#function-menu-button") || button.getAttribute("aria-label") !== "Chức năng" || button.getAttribute("aria-controls") !== "function-menu") throw new Error("Function button is invalid"); });
    await test("R. Guest hides Chức năng", () => { resetGuest(); if (visible("#function-menu-button")) throw new Error("Guest sees function button"); });
    await test("S. Menu opens", () => { resetGuest(); signedIn(); click("#function-menu-button"); if (document.querySelector("#function-menu-backdrop").hidden || document.querySelector("#function-menu-button").getAttribute("aria-expanded") !== "true") throw new Error("Menu did not open"); });
    await test("T. Menu closes with X", () => { click("#function-menu-close"); if (!document.querySelector("#function-menu-backdrop").hidden) throw new Error("Menu did not close with X"); });
    await test("U. Menu closes with outside click", () => { click("#function-menu-button"); document.querySelector("#function-menu-backdrop").click(); if (!document.querySelector("#function-menu-backdrop").hidden) throw new Error("Menu did not close outside"); });
    await test("V. Menu closes with Escape", () => { click("#function-menu-button"); window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); if (!document.querySelector("#function-menu-backdrop").hidden || document.querySelector("#function-menu-button").getAttribute("aria-expanded") !== "false") throw new Error("Menu did not close with Escape"); });
    await test("W. Menu contains all 7 functions in order", () => { const labels = [...document.querySelectorAll("[data-function-action] span")].map((node) => node.textContent.trim()); const expected = ["Thông tin cá nhân", "Phân tích kết quả học tập", "Hồ sơ của bé", "Cài đặt", "Đồng bộ dữ liệu", "Tài khoản của tôi", "Đăng xuất"]; if (JSON.stringify(labels) !== JSON.stringify(expected)) throw new Error(`Menu labels invalid: ${labels.join(", ")}`); });
    await test("W1. Sync menu closes then calls existing syncNow", async () => { resetGuest(); signedIn(); const original = window.HocCungBeCloudSync?.syncNow; if (typeof original !== "function") throw new Error("Existing syncNow is unavailable"); let call = null; window.HocCungBeCloudSync.syncNow = (reason) => { call = { reason, menuHidden: document.querySelector("#function-menu-backdrop").hidden }; return Promise.resolve({}); }; try { click("#function-menu-button"); click('[data-function-action="sync"]'); await wait(0); if (!call || call.reason !== "manual" || !call.menuHidden) throw new Error(`Sync action invalid: ${JSON.stringify(call)}`); } finally { window.HocCungBeCloudSync.syncNow = original; } });
    await test("W2. Responsive Home passes at 375x812", () => checkResponsiveHome(375, 812));
    await test("W3. Responsive Home passes at 768x1024", () => checkResponsiveHome(768, 1024));
    await test("W4. Responsive Home passes at 1280x900", () => checkResponsiveHome(1280, 900));
    await test("X. Hidden backdrop does not intercept clicks", () => { const backdrop = document.querySelector("#function-menu-backdrop"), style = getComputedStyle(backdrop); if (!backdrop.hidden || (style.display !== "none" && style.pointerEvents !== "none")) throw new Error(`Hidden backdrop intercepts: ${style.display}/${style.pointerEvents}`); });
    await test("Y. prefers-reduced-motion exists", async () => { const css = await fetch("styles.css", { cache: "no-store" }).then((r) => r.text()); if (!css.includes("@media (prefers-reduced-motion: reduce)")) throw new Error("Reduced motion CSS missing"); });
    await test("Z. Background clarity and overlays are tuned", async () => { const [response, css] = await Promise.all([fetch("assets/backgrounds/van-mieu-quoc-tu-giam.webp", { cache: "no-store" }), fetch("styles.css", { cache: "no-store" }).then((r) => r.text())]), bytes = new Uint8Array(await response.arrayBuffer()), signature = String.fromCharCode(...bytes.slice(0, 4)) + String.fromCharCode(...bytes.slice(8, 12)); const expected = ["filter: none", "opacity: .72", "rgba(251, 252, 255, .18)", "rgba(251, 252, 255, .72)", "rgba(255,255,255,.90)", "rgba(255,255,255,.93)", "pointer-events: none"]; if (!response.ok || signature !== "RIFFWEBP" || bytes.length < 250000 || bytes.length > 500000 || !expected.every((value) => css.includes(value))) throw new Error(`WebP/background CSS invalid: ${signature}, ${bytes.length}`); });
    await test("AA. Background WebP is in v37 APP_SHELL", async () => { const sw = await fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()); if (!sw.includes('const CACHE_NAME = "hoc-cung-be-v37"') || !sw.includes('"./learning-analytics.js"') || !sw.includes('"./weekly-report.js"') || !sw.includes('"./assets/backgrounds/van-mieu-quoc-tu-giam.webp"')) throw new Error("v37 APP_SHELL is invalid"); });
    await test("AB. No old double-extension references", async () => { const files = ["index.html", "styles.css", "script.js", "child-settings.js", "service-worker.js", "README.md", "__run_browser_tests.py"], forbidden = ".webp" + ".png"; const texts = await Promise.all(files.map((path) => fetch(path, { cache: "no-store" }).then((r) => r.text()))); if (texts.some((text) => text.includes(forbidden))) throw new Error("Old double extension remains"); });
    await test("AC. Math navigation passes", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); expectScreen("math-screen", "Math navigation"); });
    await test("AD. Vietnamese navigation passes", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Vietnamese navigation"); if (document.body.dataset.course !== "vietnamese-grade-1") throw new Error("Vietnamese course not active"); });
    await test("AE. Math level to Quiz passes", () => { resetGuest(); enterQuiz("math-grade-1"); });
    await test("AF. Vietnamese level to Quiz passes", () => { resetGuest(); enterQuiz("vietnamese-grade-1"); });
    await test("AG. Back navigation passes", () => { resetGuest(); enterQuiz("math-grade-1"); click("#quiz-back-button"); expectScreen("levels-screen", "Quiz back"); click('#levels-screen .back-button'); expectScreen("math-screen", "Levels back"); });
    return { passed: results.every((item) => item.passed), results };
  };
  const asChecks = (suite) => {
    if (Array.isArray(suite)) return suite;
    if (Array.isArray(suite?.results)) return suite.results;
    if (suite && typeof suite === "object") return Object.entries(suite.results || suite).filter(([key]) => key !== "passed" && key !== "samples" && key !== "error").map(([id, passed]) => ({ id, passed: Boolean(passed) }));
    return [];
  };
  for (const [suiteName, hook] of registry) {
    if (!(hook in window)) { missingSuites.push({ suite: suiteName, hook }); continue; }
    try { suites[suiteName] = await Promise.resolve(window[hook]); }
    catch (error) { suites[suiteName] = { passed: false, error: String(error), results: [{ id: "suite", passed: false }] }; }
  }
  suites["V36 interaction and recommendation"] = await runV36InteractionTests();
  suites["Thinking game memory pairs"] = await runThinkingGameTests();
  suites["Can Enter Quiz"] = await runCanEnterQuizTests();
  suites["English Learn and interaction flow"] = await runEnglishInteractionTests();
  // A clean navigation validates that no state from the flow tests is required for entry.
  if (!location.search.includes("fresh-quiz")) {
    location.replace(`${location.pathname}?fresh-quiz=1`);
    return;
  }
  const freshQuiz = [];
  try { resetGuest(); enterQuiz("math-grade-1"); freshQuiz.push({ id: "J. Refresh then start quiz works", passed: true }); }
  catch (error) { freshQuiz.push({ id: "J. Refresh then start quiz works", passed: false, error: String(error?.stack || error) }); }
  suites["Can Enter Quiz"].results = suites["Can Enter Quiz"].results.filter((item) => !item.id.startsWith("J." )).concat(freshQuiz);
  suites["Can Enter Quiz"].passed = suites["Can Enter Quiz"].results.every((item) => item.passed);
  suites["Auth, function menu, shared background and required navigation"] = await runAuthFunctionBackgroundTests();
  suites["English real video media"] = await runEnglishVideoTests();
  const all = Object.entries(suites).flatMap(([suite, value]) => asChecks(value).map((check) => ({ suite, ...check })));
  const failed = all.filter((item) => item && item.passed === false);
  missingSuites.forEach((item) => runtimeErrors.push({ type: "missing-suite", message: `${item.suite}: ${item.hook}` }));
  if (all.length < 497 || Object.keys(suites).length < 30) runtimeErrors.push({ type: "incomplete-coverage", message: `Expected at least 30 suites / 497 checks, got ${Object.keys(suites).length} / ${all.length}` });
  const realExitCode = failed.length || runtimeErrors.length || missingSuites.length ? 1 : 0;
  window.__hcbRegressionState = { ...window.__hcbRegressionState, stage: "L. report extraction", suitesComplete: true, suiteCount: Object.keys(suites).length, totalChecks: all.length, failedCount: failed.length, runtimeErrorCount: runtimeErrors.length, missingSuites };
  document.body.innerHTML = `<pre id="test-output">${JSON.stringify({ realExitCode, suiteCount: Object.keys(suites).length, suiteNames: Object.keys(suites), total: all.length, failedCount: failed.length, failed, runtimeErrorCount: runtimeErrors.length, runtimeErrors, missingSuites })}</pre>`;
  await fetch("/__regression_report", { method: "POST", headers: { "Content-Type": "application/json" }, body: document.querySelector("#test-output").textContent });
});
</script>
'''

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/__regression_report":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > 2000000:
            self.send_error(400)
            return
        self.server.regression_report = self.rfile.read(length).decode("utf-8")
        self.send_response(204)
        self.end_headers()

    def log_message(self, *_args):
        pass


class Cdp:
    def __init__(self, url):
        self.ws = websockets.sync.client.connect(url, open_timeout=10, ping_interval=None, max_queue=None)
        self.next_id = 0

    def call(self, method, params=None):
        self.next_id += 1
        request_id = self.next_id
        self.ws.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
        deadline = time.monotonic() + 20
        while time.monotonic() < deadline:
            message = json.loads(self.ws.recv(timeout=max(0.1, deadline - time.monotonic())))
            if message.get("id") != request_id:
                continue
            if "error" in message:
                raise RuntimeError(f"{method}: {message['error']}")
            return message.get("result", {})
        raise TimeoutError(f"CDP request exceeded 20 seconds: {method}")

    def evaluate(self, expression):
        result = self.call("Runtime.evaluate", {"expression": expression, "returnByValue": True})
        remote = result.get("result", {})
        if remote.get("subtype") == "error":
            raise RuntimeError(remote.get("description", "Runtime evaluation error"))
        return remote.get("value")

    def close(self):
        self.ws.close()


def wait_for_page(chrome):
    deadline = time.time() + 15
    while time.time() < deadline:
        try:
            pages = requests.get(f"http://127.0.0.1:{DEBUG_PORT}/json", timeout=1).json()
            page = next((item for item in pages if item.get("type") == "page"), None)
            if page:
                return page
        except (requests.RequestException, ValueError):
            if chrome.poll() is not None:
                raise RuntimeError(f"Chrome exited before CDP endpoint became ready (exit code {chrome.returncode})")
        time.sleep(0.1)
    raise RuntimeError("Chrome remote debugging endpoint did not become available")


def wait_for_server(server, server_thread, timeout=15):
    deadline = time.time() + timeout
    urls = [f"http://127.0.0.1:{HTTP_PORT}/", f"http://127.0.0.1:{HTTP_PORT}/service-worker.js", f"http://127.0.0.1:{HTTP_PORT}/{RUNNER.name}"]
    last_error = None
    while time.time() < deadline:
        if not server_thread.is_alive():
            raise RuntimeError("Local test server stopped before browser startup")
        try:
            responses = [requests.get(url, timeout=1) for url in urls]
            if all(response.status_code == 200 for response in responses) and "hoc-cung-be-v37" in responses[1].text:
                return responses
            last_error = RuntimeError(f"Unexpected readiness status: {[response.status_code for response in responses]}")
        except requests.RequestException as error:
            last_error = error
        time.sleep(0.1)
    raise RuntimeError(f"Local test server was not ready within {timeout}s: {last_error}")

def port_owner(port):
    try:
        output = subprocess.run(["netstat", "-ano", "-p", "tcp"], capture_output=True, text=True, timeout=5, check=False).stdout
        match = next((line for line in output.splitlines() if re.search(rf"127\.0\.0\.1:{port}\s+.*LISTENING\s+(\d+)\s*$", line)), None)
        if not match:
            return None
        pid = int(match.split()[-1])
        process = subprocess.run(["tasklist", "/FI", f"PID eq {pid}", "/FO", "CSV", "/NH"], capture_output=True, text=True, timeout=5, check=False).stdout.strip()
        return {"pid": pid, "process": process}
    except (OSError, subprocess.SubprocessError, ValueError):
        return None


def port_available(port):
    probe_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        probe_socket.bind(("127.0.0.1", port))
        return True
    except OSError:
        return False
    finally:
        probe_socket.close()


def browser_diagnostic(cdp):
    expression = """(() => ({
      readyState: document.readyState,
      currentUrl: location.href,
      outputPresent: Boolean(document.querySelector('#test-output')),
      runnerState: window.__hcbRegressionState || null,
      runtimeErrors: typeof runtimeErrors !== 'undefined' ? runtimeErrors : []
    }))()"""
    try:
        return cdp.evaluate(expression)
    except Exception as error:
        return {"diagnosticError": f"{type(error).__name__}: {error}"}


def print_final_summary(summary):
    print("FINAL SUMMARY")
    for key in [
        "RUNNER_STAGE", "PYTHON_EXCEPTION", "PORT_8767_IN_USE", "PORT_8767_OWNER",
        "SERVER_READY", "SERVICE_WORKER_READY", "RUNNER_HTML_READY", "CHROME_READY",
        "CHROME_PID", "CHROME_ALIVE", "CDP_READY", "CDP_URL", "PAGE_READY",
        "SUITE_HOOKS_READY", "SUITE_COUNT", "TOTAL_CHECKS", "FAILED_COUNT",
        "RUNTIME_ERROR_COUNT", "MISSING_SUITES", "COVERAGE_GUARD_FAILED", "MIN_CHECKS",
        "REPORT_GENERATED", "REPORT_PATH", "REAL_EXIT_CODE",
        "CLEANUP_ERRORS",
    ]:
        value = summary.get(key)
        if isinstance(value, (dict, list)):
            value = json.dumps(value, ensure_ascii=False)
        print(f"{key}={value}")


def main():
    summary = {
        "RUNNER_STAGE": "A. Python startup", "PYTHON_EXCEPTION": "none",
        "PORT_8767_IN_USE": False, "PORT_8767_OWNER": None, "SERVER_READY": False,
        "SERVICE_WORKER_READY": False, "RUNNER_HTML_READY": False, "CHROME_READY": False,
        "CHROME_PID": None, "CHROME_ALIVE": False, "CDP_READY": False, "CDP_URL": None,
        "PAGE_READY": False, "SUITE_HOOKS_READY": False, "SUITE_COUNT": 0,
        "TOTAL_CHECKS": 0, "FAILED_COUNT": 0, "RUNTIME_ERROR_COUNT": 0,
        "MISSING_SUITES": [], "COVERAGE_GUARD_FAILED": False, "MIN_CHECKS": MIN_CHECKS,
        "REPORT_GENERATED": False, "REPORT_PATH": str(REPORT), "REAL_EXIT_CODE": 1,
        "CLEANUP_ERRORS": [],
    }
    server = server_thread = chrome = cdp = chrome_stderr_handle = None
    report = None
    try:
        summary["RUNNER_STAGE"] = "B. temporary runner HTML generation"
        app_html = (ROOT / "index.html").read_text(encoding="utf-8")
        runner_html = re.sub(r"(<body\b[^>]*>)", r"\1" + probe, app_html, count=1, flags=re.I)
        if runner_html == app_html:
            raise RuntimeError("Could not inject regression probe into runner HTML")
        RUNNER.write_text(runner_html, encoding="utf-8")
        if not RUNNER.is_file() or RUNNER.stat().st_size == 0:
            raise RuntimeError("Temporary runner HTML was not created")

        summary["RUNNER_STAGE"] = "C. local HTTP server start"
        if not port_available(HTTP_PORT):
            summary["PORT_8767_IN_USE"] = True
            summary["PORT_8767_OWNER"] = port_owner(HTTP_PORT)
            raise RuntimeError(f"Port {HTTP_PORT} is already in use: {summary['PORT_8767_OWNER']}")
        shutil.rmtree(PROFILE, ignore_errors=True)
        server = http.server.ThreadingHTTPServer(("127.0.0.1", HTTP_PORT), lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs))
        server_thread = threading.Thread(target=server.serve_forever, daemon=True)
        server_thread.start()

        summary["RUNNER_STAGE"] = "D-F. HTTP readiness"
        responses = wait_for_server(server, server_thread)
        summary["SERVER_READY"] = responses[0].status_code == 200
        summary["SERVICE_WORKER_READY"] = responses[1].status_code == 200
        summary["RUNNER_HTML_READY"] = responses[2].status_code == 200

        summary["RUNNER_STAGE"] = "F. Chrome launch"
        if not CHROME.is_file():
            raise FileNotFoundError(f"Chrome executable not found: {CHROME}")
        chrome_stderr_handle = CHROME_STDERR.open("w", encoding="utf-8")
        chrome = subprocess.Popen([
            str(CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--autoplay-policy=no-user-gesture-required", "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
            f"--user-data-dir={PROFILE}", f"--remote-debugging-port={DEBUG_PORT}", "about:blank",
        ], stdout=subprocess.DEVNULL, stderr=chrome_stderr_handle)
        summary["CHROME_PID"] = chrome.pid
        summary["CHROME_READY"] = True
        summary["CHROME_ALIVE"] = chrome.poll() is None

        summary["RUNNER_STAGE"] = "G-H. CDP endpoint and page target discovery"
        page = wait_for_page(chrome)
        summary["CDP_URL"] = page.get("webSocketDebuggerUrl")
        cdp = Cdp(summary["CDP_URL"])
        summary["CDP_READY"] = True
        cdp.call("Page.enable")
        cdp.call("Runtime.enable")

        summary["RUNNER_STAGE"] = "I. runner page navigation"
        cdp.call("Page.navigate", {"url": f"http://127.0.0.1:{HTTP_PORT}/{RUNNER.name}"})
        deadline = time.time() + 120
        report_text = None
        while time.time() < deadline:
            summary["RUNNER_STAGE"] = "J-K. suite hooks and async suites"
            report_text = getattr(server, "regression_report", None)
            if report_text:
                break
            time.sleep(0.1)
        summary["PAGE_READY"] = bool(report_text)
        if not report_text:
            diagnostic = browser_diagnostic(cdp)
            summary["SUITE_HOOKS_READY"] = bool(diagnostic.get("runnerState", {}).get("hooksReady"))
            DIAGNOSTIC.write_text(json.dumps(diagnostic, ensure_ascii=False, indent=2), encoding="utf-8")
            print("BROWSER_DIAGNOSTIC=" + json.dumps(diagnostic, ensure_ascii=False))
            raise RuntimeError("Chrome did not produce test output within 120 seconds")

        summary["RUNNER_STAGE"] = "L. report extraction"
        report = json.loads(report_text)
        REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        summary.update({
            "SUITE_HOOKS_READY": not report.get("missingSuites"),
            "SUITE_COUNT": report.get("suiteCount", 0), "TOTAL_CHECKS": report.get("total", 0),
            "FAILED_COUNT": report.get("failedCount", 0), "RUNTIME_ERROR_COUNT": report.get("runtimeErrorCount", 0),
            "MISSING_SUITES": report.get("missingSuites", []), "REPORT_GENERATED": True,
        })
        print(json.dumps(report, ensure_ascii=False, indent=2))

        summary["RUNNER_STAGE"] = "M. coverage guard"
        summary["COVERAGE_GUARD_FAILED"] = summary["TOTAL_CHECKS"] < MIN_CHECKS or summary["SUITE_COUNT"] < 30
        summary["REAL_EXIT_CODE"] = 1 if report.get("realExitCode", 1) or summary["COVERAGE_GUARD_FAILED"] else 0
    except BaseException as error:
        if isinstance(error, KeyboardInterrupt):
            raise
        summary["PYTHON_EXCEPTION"] = f"{type(error).__name__}: {error}"
        summary["REAL_EXIT_CODE"] = 1
        traceback.print_exc(file=sys.stderr)
    finally:
        summary["CHROME_ALIVE"] = bool(chrome and chrome.poll() is None)
        if chrome_stderr_handle:
            chrome_stderr_handle.flush()
        if summary["REAL_EXIT_CODE"] and CHROME_STDERR.exists():
            chrome_error = CHROME_STDERR.read_text(encoding="utf-8", errors="replace").strip()
            if chrome_error:
                print("CHROME_STDERR_BEGIN", file=sys.stderr)
                print(chrome_error, file=sys.stderr)
                print("CHROME_STDERR_END", file=sys.stderr)
        if cdp:
            try:
                cdp.close()
            except Exception as error:
                summary["CLEANUP_ERRORS"].append(f"CDP: {type(error).__name__}: {error}")
        if chrome:
            try:
                subprocess.run(["taskkill", "/PID", str(chrome.pid), "/T", "/F"], capture_output=True, text=True, timeout=10, check=False)
                chrome.wait(timeout=5)
            except (OSError, subprocess.SubprocessError) as error:
                summary["CLEANUP_ERRORS"].append(f"Chrome: {type(error).__name__}: {error}")
                if chrome.poll() is None:
                    chrome.kill()
                    chrome.wait(timeout=5)
        if chrome_stderr_handle:
            try:
                chrome_stderr_handle.close()
            except OSError as error:
                summary["CLEANUP_ERRORS"].append(f"Chrome stderr: {type(error).__name__}: {error}")
        if server:
            try:
                server.shutdown()
                server.server_close()
            except OSError as error:
                summary["CLEANUP_ERRORS"].append(f"Server: {type(error).__name__}: {error}")
        summary["CHROME_ALIVE"] = bool(chrome and chrome.poll() is None)
        print_final_summary(summary)
        summary["RUNNER_STAGE"] = "N. cleanup"
        try:
            RUNNER.unlink(missing_ok=True)
        except OSError as error:
            print(f"CLEANUP_RUNNER_ERROR={type(error).__name__}: {error}", file=sys.stderr)
        for attempt in range(10):
            try:
                CHROME_STDERR.unlink(missing_ok=True)
                break
            except PermissionError as error:
                if attempt == 9:
                    print(f"CLEANUP_CHROME_STDERR_ERROR={type(error).__name__}: {error}", file=sys.stderr)
                else:
                    time.sleep(0.2)
            except OSError as error:
                print(f"CLEANUP_CHROME_STDERR_ERROR={type(error).__name__}: {error}", file=sys.stderr)
                break
        try:
            shutil.rmtree(PROFILE, ignore_errors=False)
        except FileNotFoundError:
            pass
        except OSError as error:
            print(f"CLEANUP_PROFILE_ERROR={type(error).__name__}: {error}", file=sys.stderr)
    return summary["REAL_EXIT_CODE"]


if __name__ == "__main__":
    raise SystemExit(main())
