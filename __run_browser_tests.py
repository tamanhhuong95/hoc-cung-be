import http.server
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
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
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

probe = r'''
<script>
const runtimeErrors = [];
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
    ["Math geometry and sequences", "__hocCungBeGeometryAndSequenceTests"],
    ["Audio and speech", "__hocCungBeAudioAndSpeechTests"],
    ["Mascot and results", "__hocCungBeMascotAndResultTests"],
    ["Parent dashboard", "__hocCungBeParentDashboardTests"],
    ["Dynamic curriculum", "__hocCungBeDynamicLevelTests"],
    ["Guest Trial", "__hocCungBeGuestTrialTests"],
    ["Multi-course and Vietnamese", "__hocCungBeMultiCourseTests"],
    ["English Grade 1 EN-01 to EN-40", "__hocCungBeEnglishGrade1Tests"],
    ["PWA and offline", "__hocCungBePwaTests"],
    ["Branding and icons", "__hocCungBeBrandingTests"],
    ["Parent Auth, verification, recovery, password and phone", "__hocCungBeParentAuthTests"],
    ["Child Profiles", "__hocCungBeChildProfilesTests"],
    ["Cloud Sync", "__hocCungBeCloudSyncTests"],
    ["Parent PIN and feedback", "__hocCungBeParentPinFeedbackTests"],
    ["Child Settings and cross-course limits", "__hocCungBeChildSettingsTests"],
  ];
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const suites = {}, missingSuites = [];
  const state = () => ({ activeScreen: [...document.querySelectorAll(".screen")].find((screen) => !screen.hidden)?.id || null, course: document.body.dataset.course || null, authenticated: document.body.dataset.authenticated || null, topics: document.querySelectorAll("#topic-grid button").length, levels: document.querySelectorAll("#level-grid button").length, answers: document.querySelectorAll("#answer-grid button").length, quizHidden: document.querySelector("#quiz-screen")?.hidden });
  const isQuiz = () => { const screen = document.querySelector("#quiz-screen"); return Boolean(screen && !screen.hidden && document.querySelectorAll("#answer-grid button").length === 4 && document.querySelector("#question-count")?.textContent.includes("1 / 5")); };
  const click = (selector, root = document) => { const node = root.querySelector(selector); if (!node) throw new Error(`Missing clickable element: ${selector}`); if (node.disabled) throw new Error(`Clickable element is disabled: ${selector}`); node.click(); return node; };
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
  const runEnglishInteractionTests = async () => {
    const results = [], test = async (id, fn) => { try { await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
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
    const results = [], test = async (id, fn) => { try { await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    const manifest = await fetch("assets/english-grade-1/media-manifest.json", { cache: "no-store" }).then((response) => response.json());
    const loadMetadata = async (src, poster) => { const response = await fetch(src, { cache: "no-store" }), blob = await response.blob(), url = URL.createObjectURL(blob); return new Promise((resolve, reject) => { const video = document.createElement("video"); video.preload = "metadata"; video.poster = poster; video.playsInline = true; video.muted = true; video.onloadedmetadata = () => { const result = { duration: video.duration, width: video.videoWidth, height: video.videoHeight, readyState: video.readyState, error: video.error }; URL.revokeObjectURL(url); video.remove(); resolve(result); }; video.onerror = () => { URL.revokeObjectURL(url); video.remove(); reject(new Error(`Media error ${video.error?.code || "unknown"}: ${src}`)); }; video.src = url; document.body.append(video); video.load(); video.play().catch(() => {}); }); };
    await test("A. Seven real WebM files have valid MIME, EBML signature and size budget", async () => { if (manifest.version !== 2 || manifest.clips.length !== 7) throw new Error("v30 media manifest invalid"); const responses = await Promise.all(manifest.clips.map((clip) => fetch(clip.webm, { cache: "no-store" }))); const bodies = await Promise.all(responses.map((response) => response.arrayBuffer())); responses.forEach((response, index) => { const bytes = new Uint8Array(bodies[index]), clip = manifest.clips[index], signature = [...bytes.slice(0, 4)].map((value) => value.toString(16).padStart(2, "0")).join(""); if (!response.ok || !response.headers.get("content-type")?.includes("video/webm") || signature !== "1a45dfa3" || bytes.length <= 0 || bytes.length >= 2 * 1024 * 1024 || !clip.available) throw new Error(`${clip.levelId}: status=${response.status} mime=${response.headers.get("content-type")} signature=${signature} bytes=${bytes.length}`); }); if (bodies.reduce((sum, body) => sum + body.byteLength, 0) >= 4 * 1024 * 1024) throw new Error("Combined video budget exceeded"); });
    await test("B. All WebM metadata loads without media errors", async () => { const metadata = await Promise.all(manifest.clips.map((clip) => loadMetadata(clip.webm, clip.poster))); metadata.forEach((value, index) => { if (value.error || value.readyState < 1 || value.width !== 960 || value.height !== 540 || (!Number.isFinite(value.duration) && value.duration !== Infinity)) throw new Error(`${manifest.clips[index].levelId}: ${JSON.stringify(value)}`); }); });
    await test("C. Posters and fallback images exist", async () => { const paths = manifest.clips.flatMap((clip) => [clip.poster, clip.fallbackImage]), responses = await Promise.all(paths.map((path) => fetch(path, { cache: "no-store" }))); if (!responses.every((response) => response.ok && response.headers.get("content-type")?.includes("image/webp"))) throw new Error("Poster or fallback image invalid"); });
    await test("D. Missing video switches to animation and poster fallback without crash", () => { const host = document.createElement("div"), clip = manifest.clips[0]; document.body.append(host); renderEnglishMedia(host, { type: "video", available: false, poster: clip.poster, fallback: clip.fallbackImage, animationFallback: clip.animationFallback, ariaLabel: "Fallback test" }, "Fallback test"); if (host.querySelector("video") || !host.querySelector(".english-animation") || !host.querySelector(".english-media-poster")) throw new Error("Fallback state invalid"); host.remove(); });
    await test("E. Video quiz cues do not expose answer text", () => { const questions = window.HOC_CUNG_BE_ENGLISH_GRADE_1.levels.flatMap((item) => item.questions).filter((item) => item.type === "video-choice"); if (questions.length !== 5) throw new Error(`Expected 5 video questions, got ${questions.length}`); questions.forEach((question) => { const host = document.createElement("div"); renderEnglishMedia(host, question.video, "Video question"); if (host.textContent.toLowerCase().includes(question.answer.toLowerCase()) || host.querySelector("video")?.getAttribute("aria-label").toLowerCase().includes(question.answer.toLowerCase())) throw new Error(`Quiz answer leaked: ${question.id}`); }); });
    await test("F. Video component attributes and replay controls are present", () => { const host = document.createElement("div"), media = window.HOC_CUNG_BE_ENGLISH_GRADE_1.levels.find((item) => item.id === "EN-08").media.featured; renderEnglishMedia(host, media, "Greetings"); const video = host.querySelector("video"), source = host.querySelector("source"); if (!video?.controls || !video.playsInline || video.preload !== "metadata" || !video.poster || !video.getAttribute("aria-label") || source?.type !== "video/webm") throw new Error("Video attributes invalid"); });
    await test("G. Offline runtime video cache and v30 remain configured", async () => { const sw = await fetch("service-worker.js", { cache: "no-store" }).then((response) => response.text()); if (sw.match(/const CACHE_NAME = "([^"]+)"/)?.[1] !== "hoc-cung-be-v30" || sw.includes("assets/english-grade-1/videos/") || !sw.includes('request.destination === "video"') || !sw.includes("cacheMediaRange") || !sw.includes("caches.match(request.url")) throw new Error("Offline video runtime cache invalid"); });
    return { passed: results.every((item) => item.passed), results };
  };
  const runCanEnterQuizTests = async () => {
    const results = [], test = async (id, fn) => { try { await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
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
    await test("K. v30 app shell includes required modules and shared artwork", async () => { const required = ["./script.js", "./child-settings.js", "./parent-auth.js", "./child-profiles.js", "./data/vietnamese-grade-1.js", "./assets/backgrounds/van-mieu-quoc-tu-giam.webp", "./assets/english-grade-1/images/review-2.webp"]; const text = await fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()); if (text.match(/const CACHE_NAME = "([^"]+)"/)?.[1] !== "hoc-cung-be-v30" || !required.every((path) => text.includes(`"${path}"`))) throw new Error("v30 app shell is incomplete"); });
    await test("L. Math Back stays on Grade 1", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); expectScreen("math-screen", "Math course"); click('#math-screen .back-button[data-go="grade1"]'); expectScreen("grade1-screen", "Math Back immediate"); await wait(1100); expectScreen("grade1-screen", "Math Back stable"); });
    await test("M. Vietnamese Back stays on Grade 1", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Vietnamese course"); click('#math-screen .back-button[data-go="grade1"]'); expectScreen("grade1-screen", "Vietnamese Back immediate"); await wait(1100); expectScreen("grade1-screen", "Vietnamese Back stable"); });
    await test("N. Math quiz stays visible and Quiz Back returns to levels", async () => { resetGuest(); enterQuiz("math-grade-1"); await wait(1100); expectScreen("quiz-screen", "Math quiz stable"); click("#quiz-back-button"); expectScreen("levels-screen", "Quiz Back immediate"); await wait(1100); expectScreen("levels-screen", "Quiz Back stable"); });
    await test("O. Rapid Math Back then Vietnamese ends on Vietnamese", async () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click('#math-screen .back-button[data-go="grade1"]'); click('button[data-course="vietnamese-grade-1"]'); expectScreen("math-screen", "Rapid course immediate"); await wait(1100); const actual = state(); if (actual.activeScreen !== "math-screen" || actual.course !== "vietnamese-grade-1") throw new Error(`Rapid navigation ended incorrectly: ${JSON.stringify(actual)}`); });
    await test("P. Clicking a child element inside a level card starts quiz", () => { resetGuest(); click('[data-go="grade1"]'); click('button[data-course="math-grade-1"]'); click("#topic-grid button"); click("#level-grid button strong"); if (!isQuiz()) throw new Error(`Level child click did not transition to quiz: ${JSON.stringify(state())}`); });
    return { passed: results.every((item) => item.passed), results };
  };
  const runAuthFunctionBackgroundTests = async () => {
    const results = [], test = async (id, fn) => { try { await fn(); results.push({ id, passed: true }); } catch (error) { results.push({ id, passed: false, error: String(error?.stack || error) }); } };
    const visibleNode = (node) => { if (!node) return false; for (let current = node; current; current = current.parentElement) { const style = getComputedStyle(current); if (current.hidden || style.display === "none" || style.visibility === "hidden") return false; } return true; };
    const visible = (selector) => visibleNode(document.querySelector(selector));
    const homeText = (selector) => document.querySelector(selector)?.textContent.trim() || "";
    const visibleHomeActions = (label) => [...document.querySelectorAll("#home-screen button, #home-screen a")].filter((node) => visibleNode(node) && node.textContent.trim() === label);
    const headerAuthActions = () => [...document.querySelectorAll('.site-header [data-auth-open="login"], .site-header [data-auth-open="register"]')];
    const checkResponsiveHome = async (width, height) => {
      const frame = document.createElement("iframe");
      frame.style.cssText = `position:absolute;left:-10000px;top:0;width:${width}px;height:${height}px;border:0`;
      frame.src = `index.html?responsive=${width}x${height}`;
      document.body.append(frame);
      try {
        await new Promise((resolve, reject) => { frame.addEventListener("load", resolve, { once: true }); setTimeout(() => reject(new Error(`Responsive ${width}x${height} load timeout`)), 5000); });
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
    await test("AA. Background WebP is in v30 APP_SHELL", async () => { const sw = await fetch("service-worker.js", { cache: "no-store" }).then((r) => r.text()); if (!sw.includes('const CACHE_NAME = "hoc-cung-be-v30"') || !sw.includes('"./assets/backgrounds/van-mieu-quoc-tu-giam.webp"')) throw new Error("v30 APP_SHELL is invalid"); });
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
  suites["Can Enter Quiz"] = await runCanEnterQuizTests();
  suites["English Learn and interaction flow"] = await runEnglishInteractionTests();
  suites["English real video media"] = await runEnglishVideoTests();
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
  const all = Object.entries(suites).flatMap(([suite, value]) => asChecks(value).map((check) => ({ suite, ...check })));
  const failed = all.filter((item) => item && item.passed === false);
  missingSuites.forEach((item) => runtimeErrors.push({ type: "missing-suite", message: `${item.suite}: ${item.hook}` }));
  const realExitCode = failed.length || runtimeErrors.length || missingSuites.length ? 1 : 0;
  document.body.innerHTML = `<pre id="test-output">${JSON.stringify({ realExitCode, suiteCount: Object.keys(suites).length, suiteNames: Object.keys(suites), total: all.length, failedCount: failed.length, failed, runtimeErrorCount: runtimeErrors.length, runtimeErrors, missingSuites })}</pre>`;
});
</script>
'''

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class Cdp:
    def __init__(self, url):
        self.ws = websockets.sync.client.connect(url, open_timeout=10)
        self.next_id = 0

    def call(self, method, params=None):
        self.next_id += 1
        request_id = self.next_id
        self.ws.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self.ws.recv(timeout=20))
            if message.get("id") != request_id:
                continue
            if "error" in message:
                raise RuntimeError(f"{method}: {message['error']}")
            return message.get("result", {})

    def evaluate(self, expression):
        result = self.call("Runtime.evaluate", {"expression": expression, "returnByValue": True})
        remote = result.get("result", {})
        if remote.get("subtype") == "error":
            raise RuntimeError(remote.get("description", "Runtime evaluation error"))
        return remote.get("value")

    def close(self):
        self.ws.close()


def wait_for_page():
    deadline = time.time() + 15
    while time.time() < deadline:
        try:
            pages = requests.get(f"http://127.0.0.1:{DEBUG_PORT}/json", timeout=1).json()
            page = next((item for item in pages if item.get("type") == "page"), None)
            if page:
                return page
        except requests.RequestException:
            pass
        time.sleep(0.1)
    raise RuntimeError("Chrome remote debugging endpoint did not become available")

try:
    app_html = (ROOT / "index.html").read_text(encoding="utf-8")
    RUNNER.write_text(re.sub(r"(<body\b[^>]*>)", r"\1" + probe, app_html, count=1, flags=re.I), encoding="utf-8")
    shutil.rmtree(PROFILE, ignore_errors=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 8767), lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    time.sleep(0.5)
    chrome = subprocess.Popen([
        str(CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--autoplay-policy=no-user-gesture-required", "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
        f"--user-data-dir={PROFILE}", f"--remote-debugging-port={DEBUG_PORT}", "about:blank",
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    cdp = Cdp(wait_for_page()["webSocketDebuggerUrl"])
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")
    cdp.call("Page.navigate", {"url": "http://127.0.0.1:8767/__browser-test-runner.html"})
    deadline = time.time() + 55
    report_text = None
    while time.time() < deadline:
        report_text = cdp.evaluate("document.querySelector('#test-output')?.textContent || null")
        if report_text:
            break
        time.sleep(0.1)
    if not report_text:
        DIAGNOSTIC.write_text(json.dumps({"error": "Chrome did not produce test output within 55 seconds"}, ensure_ascii=False, indent=2), encoding="utf-8")
        raise RuntimeError("Chrome did not produce test output")
    report = json.loads(report_text)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report.get("realExitCode", 1):
        raise SystemExit(1)
finally:
    if "cdp" in globals():
        cdp.close()
    if "chrome" in globals():
        chrome.terminate()
        try:
            chrome.wait(timeout=5)
        except subprocess.TimeoutExpired:
            chrome.kill()
    if "server" in globals():
        server.shutdown()
        server.server_close()
    RUNNER.unlink(missing_ok=True)
    shutil.rmtree(PROFILE, ignore_errors=True)
