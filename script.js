"use strict";

// ==================== Lesson / Level Data ====================
const STORAGE_KEY = "hoc-cung-be:math-grade-1-progress";
const LEGACY_KEY = "hoc-cung-be:addition-progress";
const PROGRESS_VERSION = 2;
const DEFAULT_COUNT = 10;
const DEFAULT_UNLOCK_SCORE = 70;
const AUDIO_SETTINGS_KEY = "hoc-cung-be:audio-settings";

const TOPICS = {
  counting: { title: "Số và đếm", icon: "🔟", color: "blue", description: "Nhận biết số, đếm và sắp xếp các số." },
  compare: { title: "So sánh số", icon: "⚖️", color: "orange", description: "So sánh số bằng dấu lớn hơn, bé hơn, bằng nhau." },
  addition: { title: "Phép cộng", icon: "➕", color: "purple", description: "Luyện cộng thật vui trong phạm vi 10." },
  subtraction: { title: "Phép trừ", icon: "➖", color: "pink", description: "Luyện trừ thật dễ hiểu trong phạm vi 10." },
  missing: { title: "Điền số", icon: "✍️", color: "green", description: "Tìm số còn thiếu trong dãy số và phép tính." },
  geometry: { title: "Hình học", icon: "🔺", color: "yellow", description: "Làm quen với những hình dạng đáng yêu." },
};

const COUNTING_OBJECTS = [
  { icon: "🍎", name: "quả táo" },
  { icon: "🍊", name: "quả cam" },
  { icon: "🐟", name: "con cá" },
  { icon: "🦋", name: "con bướm" },
  { icon: "⭐", name: "ngôi sao" },
  { icon: "🖊️", name: "cây bút" },
  { icon: "⚽", name: "chiếc bóng" },
  { icon: "🍬", name: "viên kẹo" },
];

const level = (id, topic, title, type, min, max) => ({ id, topic, title, type, min, max, questionCount: DEFAULT_COUNT, unlockScore: DEFAULT_UNLOCK_SCORE, rewardStars: [70, 90, 100] });
const LEVELS = [
  level("counting-1", "counting", "Đếm đồ vật đến 5", "count", 0, 5), level("counting-2", "counting", "Đếm đồ vật đến 10", "count", 0, 10), level("counting-3", "counting", "Số liền trước - liền sau", "near", 1, 9), level("counting-4", "counting", "Sắp xếp số", "sort", 0, 6),
  level("compare-1", "compare", "So sánh trong phạm vi 5", "compare", 0, 5), level("compare-2", "compare", "So sánh trong phạm vi 10", "compare", 0, 10), level("compare-3", "compare", "Chọn số lớn hơn", "larger", 0, 10), level("compare-4", "compare", "Chọn số bé hơn", "smaller", 0, 10),
  level("addition-1", "addition", "Cộng trong phạm vi 5", "add", 0, 5), level("addition-2", "addition", "Cộng trong phạm vi 10", "add", 0, 10), level("addition-3", "addition", "Tìm số còn thiếu", "addMissing", 0, 10), level("addition-4", "addition", "Cộng bằng hình ảnh", "addPicture", 0, 10),
  level("subtraction-1", "subtraction", "Trừ trong phạm vi 5", "subtract", 0, 5), level("subtraction-2", "subtraction", "Trừ trong phạm vi 10", "subtract", 0, 10), level("subtraction-3", "subtraction", "Tìm số còn thiếu", "subMissing", 0, 10), level("subtraction-4", "subtraction", "Trừ bằng hình ảnh", "subPicture", 0, 10),
  level("missing-1", "missing", "Điền số trong phạm vi 5", "sequence", 0, 5), level("missing-2", "missing", "Điền số trong phạm vi 10", "sequence", 0, 10), level("missing-3", "missing", "Số còn thiếu trong phép tính", "addMissing", 0, 10), level("missing-4", "missing", "Dãy số vui nhộn", "sequence", 0, 8),
  level("geometry-1", "geometry", "Nhận biết hình cơ bản", "shape", 0, 0), level("geometry-2", "geometry", "Tìm đúng hình", "shape", 0, 0), level("geometry-3", "geometry", "Đếm hình", "shapeCount", 1, 5), level("geometry-4", "geometry", "Hình trong cuộc sống", "shapeLife", 0, 0),
];
const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((item) => [item.id, item]));
const LEVELS_BY_TOPIC = Object.fromEntries(Object.keys(TOPICS).map((topic) => [topic, LEVELS.filter((item) => item.topic === topic)]));

// ==================== Utilities ====================
const $ = (selector) => document.querySelector(selector);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (items) => { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = randomInt(0, i); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; };
const validObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const safeNumber = (value, max = 100) => Number.isFinite(Number(value)) ? Math.max(0, Math.min(max, Math.floor(Number(value)))) : 0;
const starsFor = (score, item) => score >= item.rewardStars[2] ? 3 : score >= item.rewardStars[1] ? 2 : score >= item.rewardStars[0] ? 1 : 0;

// ==================== LocalStorage Manager ====================
function readStorage(storage, key) { try { return storage.getItem(key); } catch { return null; } }
function writeStorage(storage, key, value) { try { storage.setItem(key, value); return true; } catch { return false; } }
function parseJSON(value) { try { return value ? JSON.parse(value) : null; } catch { return null; } }

// ==================== Audio Settings / Speech / Sound Effects ====================
function defaultAudioSettings() { return { soundEnabled: true, speechEnabled: true }; }
function loadAudioSettings(storage = localStorage) { const parsed = parseJSON(readStorage(storage, AUDIO_SETTINGS_KEY)); const raw = validObject(parsed) ? parsed : {}; return { soundEnabled: typeof raw.soundEnabled === "boolean" ? raw.soundEnabled : true, speechEnabled: typeof raw.speechEnabled === "boolean" ? raw.speechEnabled : true }; }
function saveAudioSettings(settings, storage = localStorage) { const safe = { soundEnabled: Boolean(settings.soundEnabled), speechEnabled: Boolean(settings.speechEnabled) }; writeStorage(storage, AUDIO_SETTINGS_KEY, JSON.stringify(safe)); return safe; }
function speechSupported() { return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; }
function canReadQuestion() { return audioSettings.speechEnabled && speechSupported(); }
let audioSettings = loadAudioSettings(); let audioContext = null;
function numberToVietnamese(value) { const words = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười"]; return words[Number(value)] || String(value); }
function plainQuestionText(prompt) { const holder = document.createElement("div"); holder.innerHTML = prompt; return holder.textContent.replace(/\s+/g, " ").trim(); }
function getQuestionSpeechText(level, item) {
  const text = plainQuestionText(item.prompt); const numbers = text.match(/\d+/g) || [];
  if (level.type === "count") return `Có bao nhiêu ${item.countingObject?.name || "đồ vật"}?`;
  if (level.type === "compare") return `${numberToVietnamese(numbers[0])} so với ${numberToVietnamese(numbers[1])}. Hãy chọn dấu thích hợp.`;
  if (level.type === "larger") return `Số nào lớn hơn: ${numberToVietnamese(numbers[0])} hay ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "smaller") return `Số nào bé hơn: ${numberToVietnamese(numbers[0])} hay ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "add") return `${numberToVietnamese(numbers[0])} cộng ${numberToVietnamese(numbers[1])} bằng bao nhiêu?`;
  if (level.type === "addMissing") return `${numberToVietnamese(numbers[0])} cộng số nào bằng ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "addPicture") return "Có tất cả bao nhiêu quả dâu?";
  if (level.type === "subtract") return `${numberToVietnamese(numbers[0])} trừ ${numberToVietnamese(numbers[1])} bằng bao nhiêu?`;
  if (level.type === "subMissing") return `Số nào trừ ${numberToVietnamese(numbers[0])} bằng ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "subPicture") return "Bớt đi số bánh đã cho. Còn lại bao nhiêu chiếc bánh?";
  if (level.type === "sequence") return `Số nào còn thiếu trong dãy: ${numberToVietnamese(item.sequenceValues?.[0])}, ... ${numberToVietnamese(item.sequenceValues?.[2])}?`;
  if (level.type === "near") return text.replace(/\d+/g, (number) => numberToVietnamese(number));
  if (level.type === "sort") return "Dãy số nào được sắp xếp từ bé đến lớn?";
  if (level.type === "shape") return "Đây là hình gì?";
  if (level.type === "shapeLife") return text;
  if (level.type === "shapeCount") return text.match(/Có bao nhiêu hình [^?]+\?/)?.[0] || "Có bao nhiêu hình?";
  return text;
}
function cancelSpeech() { if (speechSupported()) { try { window.speechSynthesis.cancel(); } catch {} } }
function readCurrentQuestion() {
  if (!quiz || !canReadQuestion()) return false;
  cancelSpeech(); const utterance = new SpeechSynthesisUtterance(getQuestionSpeechText(quiz.level, quiz.questions[quiz.index])); const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase() === "vi-vn") || window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("vi"));
  utterance.lang = voice?.lang || "vi-VN"; utterance.voice = voice || null; utterance.rate = 0.76; utterance.pitch = 1; utterance.volume = 0.8; utterance.onstart = () => { if (elements.speechStatus) elements.speechStatus.textContent = "Đang đọc..."; }; utterance.onend = () => { if (elements.speechStatus) elements.speechStatus.textContent = ""; }; utterance.onerror = () => { if (elements.speechStatus) elements.speechStatus.textContent = ""; };
  try { window.speechSynthesis.speak(utterance); return true; } catch { return false; }
}
function getAudioContext() { try { if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)(); if (audioContext.state === "suspended") audioContext.resume(); return audioContext; } catch { return null; } }
function playTone(context, frequency, start, duration, volume, type = "sine") { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start); gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(volume, start + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, start + duration); oscillator.connect(gain).connect(context.destination); oscillator.start(start); oscillator.stop(start + duration + 0.03); }
function playSoundEffect(kind) {
  if (!audioSettings.soundEnabled || !(window.AudioContext || window.webkitAudioContext)) return;
  const context = getAudioContext(); if (!context) return; const now = context.currentTime;
  if (kind === "correct") { playTone(context, 740, now, .16, .08, "sine"); playTone(context, 988, now + .13, .24, .08, "sine"); }
  if (kind === "wrong") { playTone(context, 350, now, .15, .045, "sine"); playTone(context, 310, now + .12, .18, .04, "sine"); }
  if (kind === "complete") { [523, 659, 784, 1047].forEach((frequency, index) => playTone(context, frequency, now + index * .22, .34, .075, "triangle")); }
}

// ==================== Progress Manager ====================
function newLevelProgress(unlocked = false) { return { bestScore: 0, bestCorrect: 0, bestStars: 0, attempts: 0, completed: false, unlocked, lastPlayedAt: null }; }
function dateKey(date = new Date()) { const local = new Date(date); const offset = local.getTimezoneOffset() * 60000; return new Date(local.getTime() - offset).toISOString().slice(0, 10); }
function defaultStudyTime() { return { totalSeconds: 0, todaySeconds: 0, todayDate: dateKey(), lastStudyDate: null }; }
function normalizeStudyTime(raw) { const source = validObject(raw) ? raw : {}; const today = dateKey(); return { totalSeconds: safeNumber(source.totalSeconds, 2147483647), todaySeconds: source.todayDate === today ? safeNumber(source.todaySeconds, 864000) : 0, todayDate: today, lastStudyDate: typeof source.lastStudyDate === "string" ? source.lastStudyDate : null }; }
function normalizeHistory(raw) { if (!Array.isArray(raw)) return []; return raw.filter((item) => validObject(item) && LEVEL_BY_ID[item.levelId] && TOPICS[item.topic] && typeof item.completedAt === "string").slice(-50).map((item) => ({ levelId: item.levelId, topic: item.topic, score: safeNumber(item.score), correct: safeNumber(item.correct, LEVEL_BY_ID[item.levelId].questionCount), stars: safeNumber(item.stars, 3), completedAt: item.completedAt })); }
function defaultProgress() { const levels = {}; Object.keys(TOPICS).forEach((topic) => LEVELS_BY_TOPIC[topic].forEach((item, index) => { levels[item.id] = newLevelProgress(index === 0); })); return { progressVersion: PROGRESS_VERSION, levels, totalCompleted: 0, studyTime: defaultStudyTime(), history: [] }; }
function normalizeProgress(raw) {
  const source = validObject(raw) ? raw : {}; const sourceLevels = validObject(source.levels) ? source.levels : {}; const result = defaultProgress(); result.totalCompleted = safeNumber(source.totalCompleted, 999999);
  Object.keys(TOPICS).forEach((topic) => LEVELS_BY_TOPIC[topic].forEach((item, index) => {
    const old = validObject(sourceLevels[item.id]) ? sourceLevels[item.id] : {}; const previous = index ? result.levels[LEVELS_BY_TOPIC[topic][index - 1].id] : null;
    const unlockedByScore = previous ? previous.bestScore >= LEVELS_BY_TOPIC[topic][index - 1].unlockScore : true;
    result.levels[item.id] = { bestScore: safeNumber(old.bestScore), bestCorrect: safeNumber(old.bestCorrect, item.questionCount), bestStars: safeNumber(old.bestStars, 3), attempts: safeNumber(old.attempts, 999999), completed: Boolean(old.completed) || safeNumber(old.attempts, 999999) > 0, unlocked: Boolean(old.unlocked) || index === 0 || unlockedByScore, lastPlayedAt: typeof old.lastPlayedAt === "string" ? old.lastPlayedAt : null };
  }));
  result.studyTime = normalizeStudyTime(source.studyTime); result.history = normalizeHistory(source.history); return result;
}
function migrateLegacy(raw) { const progress = defaultProgress(); if (!validObject(raw)) return progress; const item = progress.levels["addition-2"]; item.bestScore = safeNumber(raw.bestScore); item.bestCorrect = safeNumber(raw.bestCorrect, 10); item.bestStars = starsFor(item.bestScore, LEVEL_BY_ID["addition-2"]); item.attempts = safeNumber(raw.completed, 999999); item.completed = item.attempts > 0; item.unlocked = true; progress.totalCompleted = item.attempts; return normalizeProgress(progress); }
function loadProgress(storage = localStorage) { const raw = parseJSON(readStorage(storage, STORAGE_KEY)); const progress = raw ? normalizeProgress(raw) : (parseJSON(readStorage(storage, LEGACY_KEY)) ? migrateLegacy(parseJSON(readStorage(storage, LEGACY_KEY))) : defaultProgress()); writeStorage(storage, STORAGE_KEY, JSON.stringify(progress)); return progress; }
function saveProgress(progress, storage = localStorage) { const safe = normalizeProgress(progress); writeStorage(storage, STORAGE_KEY, JSON.stringify(safe)); return safe; }
function levelProgress(progress, id) { return progress.levels[id] || newLevelProgress(false); }
function levelUnlocked(progress, item) { return Boolean(levelProgress(progress, item.id).unlocked); }
function saveResult(progress, item, score, correct, timestamp = new Date().toISOString()) {
  const result = normalizeProgress(progress); const previous = levelProgress(result, item.id); const bestScore = Math.max(previous.bestScore, safeNumber(score));
  result.levels[item.id] = { ...previous, bestScore, bestCorrect: Math.max(previous.bestCorrect, safeNumber(correct, item.questionCount)), bestStars: Math.max(previous.bestStars, starsFor(score, item)), attempts: previous.attempts + 1, completed: true, unlocked: true, lastPlayedAt: timestamp };
  result.totalCompleted += 1; result.history = [...result.history, { levelId: item.id, topic: item.topic, score: safeNumber(score), correct: safeNumber(correct, item.questionCount), stars: starsFor(score, item), completedAt: timestamp }].slice(-50); const items = LEVELS_BY_TOPIC[item.topic]; const next = items[items.findIndex((x) => x.id === item.id) + 1];
  if (next && bestScore >= item.unlockScore) result.levels[next.id] = { ...levelProgress(result, next.id), unlocked: true };
  return normalizeProgress(result);
}
function statistics(progress) { return Object.values(progress.levels).reduce((total, item) => ({ stars: total.stars + item.bestStars, score: total.score + item.bestScore, completed: progress.totalCompleted }), { stars: 0, score: 0, completed: progress.totalCompleted }); }
function addStudySeconds(progress, seconds, timestamp = new Date()) { const result = normalizeProgress(progress); const amount = safeNumber(seconds, 864000); if (!amount) return result; const today = dateKey(timestamp); if (result.studyTime.todayDate !== today) { result.studyTime.todayDate = today; result.studyTime.todaySeconds = 0; } result.studyTime.totalSeconds += amount; result.studyTime.todaySeconds += amount; result.studyTime.lastStudyDate = timestamp.toISOString(); return normalizeProgress(result); }

// ==================== Question Generator ====================
function options(answer, max = 10, extra = []) { const values = new Set([String(answer)]); shuffle([...Array.from({ length: max + 1 }, (_, n) => String(n)), ...extra.map(String)]).forEach((value) => { if (values.size < 4 && value !== String(answer)) values.add(value); }); return shuffle([...values]); }
function question(prompt, answer, answerOptions, key, helper, tip, metadata = {}) { return { prompt, answer: String(answer), options: answerOptions.map(String), key, helper, tip, hadWrong: false, ...metadata }; }
function sequenceMarkup(first, middle, last) { return `<span class="number-sequence"><span>${first}</span><span>${middle}</span><span>${last}</span></span>`; }
function generateQuestion(item) {
  const { type, min, max } = item; let a; let b; let n;
  if (type === "count") {
    n = randomInt(min, max);
    const object = COUNTING_OBJECTS[randomInt(0, COUNTING_OBJECTS.length - 1)];
    return question(`Có bao nhiêu ${object.name}?<br><span class="visual-count">${object.icon.repeat(n)}</span>`, n, options(n, max), `count-${object.name}-${n}`, `Đếm từng ${object.name} nhé!`, "Chạm và đếm từng đồ vật một.", { countingObject: object, count: n });
  }
  if (type === "near") { n = randomInt(min, max); const after = Math.random() > .5; const answer = after ? n + 1 : n - 1; return question(`Số ${after ? "liền sau" : "liền trước"} của ${n} là số nào?`, answer, options(answer), `near-${n}-${after}`, "Nhớ đếm tiến hoặc lùi một số nhé!", "Số liền sau lớn hơn 1."); }
  if (type === "sort") { n = randomInt(min, max); const answer = `${n}, ${n + 1}, ${n + 2}`; return question("Dãy số nào được sắp xếp từ bé đến lớn?", answer, shuffle([answer, `${n + 1}, ${n}, ${n + 2}`, `${n}, ${n + 2}, ${n + 1}`, `${n + 2}, ${n + 1}, ${n}`]), `sort-${n}`, "Chọn dãy số đúng nhé bé!", "Số bé đứng trước, số lớn đứng sau."); }
  if (type === "compare") { a = randomInt(min, max); b = randomInt(min, max); const answer = a > b ? ">" : a < b ? "<" : "="; return question(`${a} &nbsp; ? &nbsp; ${b}`, answer, [">", "<", "=", "?"], `compare-${a}-${b}`, "Chọn dấu thích hợp nhé!", "Miệng dấu lớn quay về số lớn hơn."); }
  if (type === "larger" || type === "smaller") { a = randomInt(min, max); b = randomInt(min, max); const answer = type === "larger" ? Math.max(a, b) : Math.min(a, b); return question(`Số nào ${type === "larger" ? "lớn hơn" : "bé hơn"}?<br><b>${a} hay ${b}</b>`, answer, options(answer, max), `${type}-${a}-${b}`, "Nhìn kỹ hai số rồi chọn nhé!", "Số đứng sau trong dãy số thì lớn hơn."); }
  if (["add", "addMissing", "addPicture"].includes(type)) { a = randomInt(min, max); b = randomInt(min, max - a); if (type === "addMissing") return question(`${a} + ? = ${a + b}`, b, options(b, max), `add-missing-${a}-${b}`, "Tìm số còn thiếu nhé!", "Lấy tổng trừ đi số đã biết."); if (type === "addPicture") return question(`<span class="visual-count">${"🍓".repeat(a)}</span> + <span class="visual-count">${"🍓".repeat(b)}</span><br>= ?`, a + b, options(a + b, max), `add-picture-${a}-${b}`, "Đếm tất cả quả dâu nhé!", "Đếm nhóm đầu rồi đếm thêm nhóm sau."); return question(`${a} + ${b} = ?`, a + b, options(a + b, max), `add-${a}-${b}`, "Chọn đáp án đúng nhé bé!", "Bé có thể đếm trên ngón tay."); }
  if (["subtract", "subMissing", "subPicture"].includes(type)) { a = randomInt(Math.max(1, min), max); b = randomInt(0, a); if (type === "subMissing") return question(`? - ${b} = ${a - b}`, a, options(a, max), `sub-missing-${a}-${b}`, "Tìm số còn thiếu nhé!", "Cộng số trừ với kết quả."); if (type === "subPicture") return question(`<span class="visual-count">${"🍪".repeat(a)}</span><br>Bớt đi ${b} chiếc bánh. Còn lại?`, a - b, options(a - b, max), `sub-picture-${a}-${b}`, "Đếm số bánh còn lại nhé!", "Gạch bỏ số bánh đã bớt đi."); return question(`${a} - ${b} = ?`, a - b, options(a - b, max), `sub-${a}-${b}`, "Chọn đáp án đúng nhé bé!", "Dùng ngón tay để bớt đi."); }
  if (type === "sequence") { n = randomInt(min, Math.max(min, max - 2)); return question(sequenceMarkup(n, "?", n + 2), n + 1, options(n + 1, max), `sequence-${n}`, "Số nào còn thiếu trong dãy?", "Hãy đếm lần lượt từng số.", { sequenceValues: [n, "?", n + 2] }); }
  const shapes = [["hình tròn", "●"], ["hình vuông", "■"], ["hình tam giác", "▲"], ["hình chữ nhật", "▬"]]; const shape = shapes[randomInt(0, 3)];
  if (type === "shapeCount") { n = randomInt(min, max); return question(`Có bao nhiêu ${shape[0]}?<br><span class="shape-row">${shape[1].repeat(n)}</span>`, n, options(n, max), `shape-count-${shape[0]}-${n}`, "Đếm từng hình một nhé!", "Chạm và đếm từ trái sang phải."); }
  if (type === "shapeLife") { const things = [["Bánh xe", "hình tròn"], ["Cửa sổ vuông", "hình vuông"], ["Mái nhà", "hình tam giác"], ["Quyển sách", "hình chữ nhật"]]; const thing = things[randomInt(0, 3)]; return question(`${thing[0]} giống hình nào?`, thing[1], shuffle(shapes.map((x) => x[0])), `shape-life-${thing[0]}`, "Tìm hình giống đồ vật nhé!", "Hãy tưởng tượng đồ vật quanh bé."); }
  return question(`Đây là hình gì?<br><span class="big-shape">${shape[1]}</span>`, shape[0], shuffle(shapes.map((x) => x[0])), `shape-${shape[0]}`, "Quan sát hình thật kỹ nhé!", "Mỗi hình có một dáng vẻ riêng.");
}
function generateQuestions(item) { const output = []; const keys = new Set(); let tries = 0; while (output.length < item.questionCount) { const itemQuestion = generateQuestion(item); tries += 1; if (!keys.has(itemQuestion.key) || tries > 120) { keys.add(itemQuestion.key); output.push(itemQuestion); } } return output; }

// ==================== Quiz Engine ====================
let selectedTopic = "addition"; let selectedLevelId = "addition-1"; let quiz = null; let toastTimer;
function startQuiz(id) { const item = LEVEL_BY_ID[id]; if (!item || !levelUnlocked(loadProgress(), item)) return; selectedTopic = item.topic; selectedLevelId = id; quiz = { level: item, questions: generateQuestions(item), index: 0, score: 0, correct: 0, answered: false }; showScreen("quiz"); renderQuestion(); }
function checkAnswer(answer, button) { if (!quiz || quiz.answered) return; const current = quiz.questions[quiz.index]; if (answer === current.answer) { quiz.answered = true; if (!current.hadWrong) { quiz.correct += 1; quiz.score += 10; } elements.answerGrid.querySelectorAll("button").forEach((item) => { item.disabled = true; if (item.textContent === current.answer) item.classList.add("is-correct"); }); elements.feedback.textContent = "Chính xác! Giỏi lắm bé!"; elements.feedback.className = "feedback is-correct"; setQuizMascot("correct", "Giỏi lắm!"); playCorrectEffect(); playSoundEffect("correct"); elements.nextButton.hidden = false; elements.liveScore.textContent = quiz.score; elements.liveStars.textContent = starsFor(quiz.score, quiz.level); } else { current.hadWrong = true; button.disabled = true; button.classList.add("is-wrong"); elements.feedback.textContent = "Thử lại nhé! Bé chọn một đáp án khác nào."; elements.feedback.className = "feedback is-wrong"; setQuizMascot("encourage", "Thử lại nhé!"); playSoundEffect("wrong"); } }
function nextQuestion() { if (quiz.index === quiz.questions.length - 1) finishQuiz(); else { quiz.index += 1; renderQuestion(); } }
function finishQuiz() { const progress = saveProgress(saveResult(loadProgress(), quiz.level, quiz.score, quiz.correct)); renderResult(progress); showScreen("result"); playSoundEffect("complete"); }

// ==================== UI Rendering ====================
const screens = Object.fromEntries(["home", "grade1", "math", "levels", "quiz", "result", "parent-gate", "parent-dashboard"].map((name) => [name, $(`#${name}-screen`)]));
const elements = { headerStats: $("#header-stats"), soundSettingsButton: $("#sound-settings-button"), soundSettingsPanel: $("#sound-settings-panel"), soundEnabledToggle: $("#sound-enabled-toggle"), speechEnabledToggle: $("#speech-enabled-toggle"), learningSummary: $("#learning-summary"), topicGrid: $("#topic-grid"), topicEyebrow: $("#topic-eyebrow"), levelsTitle: $("#levels-title"), levelsDescription: $("#levels-description"), topicIcon: $("#topic-icon"), levelGrid: $("#level-grid"), quizBackButton: $("#quiz-back-button"), quizIcon: $("#quiz-icon"), quizTitle: $("#quiz-title"), liveStars: $("#live-stars"), liveScore: $("#live-score"), questionCount: $("#question-count"), progressFill: $("#progress-fill"), questionHelper: $("#question-helper"), quizMascot: $("#quiz-mascot"), quizMascotMessage: $("#quiz-mascot-message"), readQuestionButton: $("#read-question-button"), speechStatus: $("#speech-status"), equation: $("#equation"), answerGrid: $("#answer-grid"), feedback: $("#feedback"), confetti: $("#confetti"), nextButton: $("#next-button"), tipText: $("#tip-text"), resultMascot: $("#result-mascot"), resultMascotMessage: $("#result-mascot-message"), resultMessage: $("#result-message"), earnedStars: $("#earned-stars"), starNote: $("#star-note"), correctCount: $("#correct-count"), finalScore: $("#final-score"), unlockNote: $("#unlock-note"), continueButton: $("#continue-button"), retryButton: $("#retry-button"), topicButton: $("#topic-button"), parentEntryButton: $("#parent-entry-button"), parentGateQuestion: $("#parent-gate-question"), parentGateAnswer: $("#parent-gate-answer"), parentGateFeedback: $("#parent-gate-feedback"), parentGateSubmit: $("#parent-gate-submit"), parentRefreshButton: $("#parent-refresh-button"), parentSummary: $("#parent-summary"), parentTopicProgress: $("#parent-topic-progress"), parentPracticeIntro: $("#parent-practice-intro"), parentPracticeList: $("#parent-practice-list"), parentHistory: $("#parent-history"), parentDeleteButton: $("#parent-delete-button"), parentDeleteConfirm: $("#parent-delete-confirm"), parentDeleteStep: $("#parent-delete-step"), parentDeleteCancel: $("#parent-delete-cancel"), parentDeleteNext: $("#parent-delete-next"), parentDeleteCodeLabel: $("#parent-delete-code-label"), parentDeleteCode: $("#parent-delete-code"), parentDeleteConfirmButton: $("#parent-delete-confirm-button"), toast: $("#toast") };
function showScreen(name) { cancelSpeech(); stopStudyTracking(); Object.entries(screens).forEach(([key, screen]) => { screen.hidden = key !== name; }); if (name === "math") renderTopics(); if (name === "levels") renderLevels(); if (name === "parent-dashboard") renderParentDashboard(); if (name === "quiz") startStudyTracking(); renderHeader(); window.scrollTo({ top: 0, behavior: "smooth" }); }
function renderHeader() { const stats = statistics(loadProgress()); elements.headerStats.textContent = stats.completed ? `⭐ ${stats.stars} sao · 🏆 ${stats.score} điểm · ✅ ${stats.completed} bài` : ""; }
function formatDuration(seconds) { const minutes = Math.floor(safeNumber(seconds, 2147483647) / 60); if (!minutes) return "0 phút"; const hours = Math.floor(minutes / 60); return hours ? `${hours} giờ ${minutes % 60} phút` : `${minutes} phút`; }
function formatDateTime(value) { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Chưa có"; }
function topicSummary(progress, topicId) { const levels = LEVELS_BY_TOPIC[topicId]; const items = levels.map((item) => levelProgress(progress, item.id)); const completed = items.filter((item) => item.completed).length; const opened = items.filter((item) => item.unlocked).length; const studied = items.filter((item) => item.attempts > 0); const average = studied.length ? Math.round(studied.reduce((sum, item) => sum + item.bestScore, 0) / studied.length) : 0; return { completed, opened, average, stars: items.reduce((sum, item) => sum + item.bestStars, 0), levels, items }; }
function parentStatistics(progress) { const values = Object.values(progress.levels); const studied = values.filter((item) => item.attempts > 0); return { attempts: progress.totalCompleted, completedLevels: values.filter((item) => item.completed).length, stars: values.reduce((sum, item) => sum + item.bestStars, 0), average: studied.length ? Math.round(studied.reduce((sum, item) => sum + item.bestScore, 0) / studied.length) : 0, opened: values.filter((item) => item.unlocked).length, locked: values.filter((item) => !item.unlocked).length, lastStudy: values.map((item) => item.lastPlayedAt).filter(Boolean).sort().at(-1) || progress.studyTime.lastStudyDate }; }
function setParentGateQuestion() { const a = randomInt(5, 20); const b = randomInt(5, 20); elements.parentGateQuestion.textContent = `${a} + ${b} = ?`; elements.parentGateQuestion.dataset.answer = String(a + b); elements.parentGateAnswer.value = ""; elements.parentGateFeedback.textContent = ""; }
function openParentGate() { setParentGateQuestion(); showScreen("parent-gate"); setTimeout(() => elements.parentGateAnswer.focus(), 0); }
function renderParentDashboard() {
  const progress = loadProgress(); const stats = parentStatistics(progress);
  elements.parentSummary.innerHTML = `<article><span>📚</span><strong>${stats.attempts}</strong><small>Bài đã học</small></article><article><span>✅</span><strong>${stats.completedLevels}</strong><small>Level đã hoàn thành</small></article><article><span>⭐</span><strong>${stats.stars}</strong><small>Tổng sao</small></article><article><span>🎯</span><strong>${stats.average}%</strong><small>Điểm trung bình tốt nhất</small></article><article><span>🔓</span><strong>${stats.opened} / ${LEVELS.length}</strong><small>Level đã mở</small></article><article><span>⏱</span><strong>${formatDuration(progress.studyTime.todaySeconds)}</strong><small>Hôm nay · tổng ${formatDuration(progress.studyTime.totalSeconds)}</small></article><article class="parent-summary__wide"><span>🕒</span><strong>${formatDateTime(stats.lastStudy)}</strong><small>Lần học gần nhất · ${stats.locked} level chưa mở</small></article>`;
  elements.parentTopicProgress.replaceChildren();
  Object.entries(TOPICS).forEach(([topicId, topic]) => { const summary = topicSummary(progress, topicId); const percent = Math.round((summary.completed / summary.levels.length) * 100); const details = document.createElement("details"); details.className = "parent-topic-card"; details.innerHTML = `<summary><span class="parent-topic-card__icon">${topic.icon}</span><span class="parent-topic-card__main"><strong>${topic.title}</strong><small>Hoàn thành ${summary.completed} / ${summary.levels.length} level · Điểm TB ${summary.average}% · ${summary.stars} ⭐</small><span class="parent-progress" aria-label="Tiến độ ${topic.title}: ${percent}%"><i style="width:${percent}%"></i></span></span><span class="parent-topic-card__percent">${percent}%</span></summary><div class="parent-level-list"></div>`;
    const list = details.querySelector(".parent-level-list"); summary.levels.forEach((levelItem, index) => { const item = levelProgress(progress, levelItem.id); const levelCard = document.createElement("article"); levelCard.className = "parent-level-card"; levelCard.innerHTML = `<strong>Level ${index + 1} – ${levelItem.title}</strong><dl><div><dt>Điểm tốt nhất</dt><dd>${item.bestScore}/100</dd></div><div><dt>Đúng tốt nhất</dt><dd>${item.bestCorrect}/${levelItem.questionCount}</dd></div><div><dt>Sao</dt><dd>${"⭐".repeat(item.bestStars) || "—"}</dd></div><div><dt>Số lần làm</dt><dd>${item.attempts}</dd></div><div><dt>Trạng thái</dt><dd>${item.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}</dd></div><div><dt>Mở khóa</dt><dd>${item.unlocked ? "Đã mở" : "Chưa mở"}</dd></div><div class="parent-level-card__wide"><dt>Lần học gần nhất</dt><dd>${formatDateTime(item.lastPlayedAt)}</dd></div></dl>`; list.append(levelCard); }); elements.parentTopicProgress.append(details); });
  const suggestions = Object.entries(TOPICS).map(([topicId, topic]) => ({ topic, ...topicSummary(progress, topicId) })).filter((item) => item.items.some((levelItem) => levelItem.attempts > 0)).sort((a, b) => a.average - b.average).slice(0, 3);
  elements.parentPracticeList.replaceChildren();
  if (!suggestions.length) { elements.parentPracticeIntro.textContent = "Bé chưa có bài học nào. Sau bài học đầu tiên, gợi ý sẽ xuất hiện tại đây."; }
  else { elements.parentPracticeIntro.textContent = "Các chuyên đề dưới đây được chọn theo điểm tốt nhất trung bình hiện có."; suggestions.forEach((item) => { const label = item.average < 70 ? "Cần luyện thêm" : item.average < 90 ? "Đang tiến bộ" : "Làm rất tốt"; const li = document.createElement("li"); li.innerHTML = `<strong>${item.topic.title}</strong><span>${item.average}% · ${label}</span>`; elements.parentPracticeList.append(li); }); }
  elements.parentHistory.replaceChildren(); const recent = [...progress.history].reverse().slice(0, 10);
  if (!recent.length) elements.parentHistory.innerHTML = "<p class=\"parent-empty\">Chưa có lần hoàn thành bài nào.</p>";
  recent.forEach((entry) => { const item = LEVEL_BY_ID[entry.levelId]; const row = document.createElement("article"); row.className = "parent-history__item"; row.innerHTML = `<time>${formatDateTime(entry.completedAt)}</time><strong>${TOPICS[entry.topic].title} – ${item.title}</strong><span>${entry.score} điểm · ${entry.correct}/${item.questionCount} · ${"⭐".repeat(entry.stars) || "🌱"}</span>`; elements.parentHistory.append(row); });
  resetDeleteConfirmation();
}
let studyTrackingSince = null;
function flushStudyTime(now = Date.now()) { if (!studyTrackingSince) return; const seconds = Math.floor((now - studyTrackingSince) / 1000); studyTrackingSince = now; if (seconds > 0) saveProgress(addStudySeconds(loadProgress(), seconds, new Date(now))); }
function shouldTrackQuiz(isQuizScreen, isDocumentHidden) { return Boolean(isQuizScreen) && !Boolean(isDocumentHidden); }
function startStudyTracking() { if (shouldTrackQuiz(!screens.quiz.hidden, document.hidden)) studyTrackingSince = Date.now(); }
function stopStudyTracking() { flushStudyTime(); studyTrackingSince = null; }
function resetDeleteConfirmation() { elements.parentDeleteConfirm.hidden = true; elements.parentDeleteStep.textContent = "Bạn có chắc muốn xóa toàn bộ tiến độ học?"; elements.parentDeleteCodeLabel.hidden = true; elements.parentDeleteCode.hidden = true; elements.parentDeleteCode.value = ""; elements.parentDeleteConfirmButton.hidden = true; elements.parentDeleteNext.hidden = false; }
function updateAudioControls() {
  if (!elements.soundEnabledToggle) return;
  elements.soundEnabledToggle.checked = audioSettings.soundEnabled;
  elements.speechEnabledToggle.checked = audioSettings.speechEnabled;
  const canSpeak = speechSupported();
  elements.speechEnabledToggle.disabled = !canSpeak;
  elements.readQuestionButton.disabled = !canReadQuestion();
  elements.readQuestionButton.hidden = !canSpeak;
  elements.readQuestionButton.setAttribute("aria-disabled", String(elements.readQuestionButton.disabled));
  if (elements.speechStatus) elements.speechStatus.textContent = canSpeak ? "" : "Trình duyệt chưa hỗ trợ đọc câu hỏi.";
}
function setMascotState(mascot, message, state, text) { if (!mascot || !message) return; mascot.className = `mascot mascot--${state}`; message.textContent = text; }
function setQuizMascot(state = "normal", text = "Cùng làm bài nào!") { setMascotState(elements.quizMascot, elements.quizMascotMessage, state, text); }
function resultPraise(score) {
  if (score === 100) return "Tuyệt vời! Bé đã trả lời đúng tất cả!";
  if (score >= 90) return ["Xuất sắc! Bé làm rất tốt!", "Thật giỏi! Bé gần như đúng tất cả rồi!"][randomInt(0, 1)];
  if (score >= 70) return ["Rất tốt! Bé đã hoàn thành bài!", "Giỏi lắm! Bé đã chinh phục bài học này!"][randomInt(0, 1)];
  if (score >= 50) return ["Bé đang tiến bộ rồi!", "Cố gắng tốt lắm, mình luyện thêm nhé!"][randomInt(0, 1)];
  return ["Không sao, mình cùng luyện thêm nhé!", "Bé đã rất cố gắng, thử lại cùng Bạn Gấu nhé!"][randomInt(0, 1)];
}
function renderEarnedStars(count) {
  elements.earnedStars.replaceChildren();
  elements.earnedStars.setAttribute("aria-label", count ? `Bé nhận được ${count} sao` : "Biểu tượng động viên: Bé sẽ tiến bộ hơn sau mỗi lần luyện tập");
  if (!count) { const encouragement = document.createElement("span"); encouragement.className = "encouragement-badge"; encouragement.textContent = "🌱"; elements.earnedStars.append(encouragement); return; }
  Array.from({ length: count }, (_, index) => { const star = document.createElement("span"); star.className = "earned-star"; star.textContent = "⭐"; star.style.animationDelay = `${index * 260}ms`; elements.earnedStars.append(star); });
}
function renderTopics() { const progress = loadProgress(); const stats = statistics(progress); elements.learningSummary.innerHTML = `<div><span>⭐</span><b>${stats.stars}</b><small>Sao đã đạt</small></div><div><span>🏆</span><b>${stats.score}</b><small>Tổng điểm tốt nhất</small></div><div><span>✅</span><b>${stats.completed}</b><small>Bài đã hoàn thành</small></div>`; elements.topicGrid.replaceChildren(); Object.entries(TOPICS).forEach(([id, topic]) => { const done = LEVELS_BY_TOPIC[id].filter((item) => levelProgress(progress, item.id).bestScore >= item.unlockScore).length; const card = document.createElement("button"); card.className = `lesson-card lesson-card--${topic.color}`; card.innerHTML = `<span>${topic.icon}</span><strong>${topic.title}</strong><small>${done}/4 level đã hoàn thành</small><em>${done ? "Tiếp tục học" : "Bắt đầu"} →</em>`; card.onclick = () => { selectedTopic = id; showScreen("levels"); }; elements.topicGrid.append(card); }); }
function renderLevels() { const topic = TOPICS[selectedTopic]; const progress = loadProgress(); elements.topicEyebrow.textContent = topic.title; elements.levelsTitle.textContent = `Chọn level ${topic.title}`; elements.levelsDescription.textContent = topic.description; elements.topicIcon.textContent = topic.icon; elements.levelGrid.replaceChildren(); LEVELS_BY_TOPIC[selectedTopic].forEach((item, index) => { const itemProgress = levelProgress(progress, item.id); const open = levelUnlocked(progress, item); const card = document.createElement("button"); card.className = `level-card ${open ? "" : "is-locked"}`; card.disabled = !open; card.innerHTML = `<span class="level-number">${open ? `Level ${index + 1}` : "🔒"}</span><strong>${item.title}</strong><span class="level-stars">${"★".repeat(itemProgress.bestStars)}${"☆".repeat(3 - itemProgress.bestStars)}</span><small>${open ? (itemProgress.attempts ? `Điểm tốt nhất: ${itemProgress.bestScore}/100` : "Sẵn sàng học") : `Hoàn thành level trước ≥ ${item.unlockScore}%`}</small>`; if (open) card.onclick = () => startQuiz(item.id); elements.levelGrid.append(card); }); }
function renderQuestion() { const current = quiz.questions[quiz.index]; const topic = TOPICS[quiz.level.topic]; quiz.answered = false; elements.quizIcon.textContent = topic.icon; elements.quizTitle.textContent = `${topic.title} · ${quiz.level.title}`; elements.quizBackButton.textContent = `← ${topic.title}`; elements.questionCount.textContent = `Câu ${quiz.index + 1} / ${quiz.questions.length}`; elements.progressFill.style.width = `${((quiz.index + 1) / quiz.questions.length) * 100}%`; elements.questionHelper.textContent = current.helper; elements.tipText.textContent = current.tip; elements.equation.innerHTML = current.prompt; elements.liveScore.textContent = quiz.score; elements.liveStars.textContent = starsFor(quiz.score, quiz.level); elements.feedback.className = "feedback"; elements.feedback.textContent = ""; elements.nextButton.hidden = true; elements.confetti.classList.remove("is-playing"); setQuizMascot(); updateAudioControls(); elements.answerGrid.replaceChildren(); current.options.forEach((answer) => { const button = document.createElement("button"); button.className = "answer-button"; button.textContent = answer; button.onclick = () => checkAnswer(answer, button); elements.answerGrid.append(button); }); }
function playCorrectEffect() { elements.confetti.classList.remove("is-playing"); void elements.confetti.offsetWidth; elements.confetti.classList.add("is-playing"); }
function renderResult(progress) { const item = quiz.level; const currentStars = starsFor(quiz.score, item); const levels = LEVELS_BY_TOPIC[item.topic]; const next = levels[levels.findIndex((x) => x.id === item.id) + 1]; const nextOpen = next && levelUnlocked(progress, next); const passed = quiz.score >= item.unlockScore; const praise = resultPraise(quiz.score); elements.resultMessage.textContent = praise; setMascotState(elements.resultMascot, elements.resultMascotMessage, currentStars ? "celebrate" : "encourage", currentStars ? praise : "Mình cùng luyện thêm nhé!"); renderEarnedStars(currentStars); elements.starNote.textContent = currentStars ? `Bé nhận được ${currentStars} sao trong level này!` : "🌱 Mỗi lần luyện tập, bé sẽ tiến bộ hơn!"; elements.correctCount.textContent = `Con đã làm đúng ${quiz.correct} / ${item.questionCount} câu`; elements.finalScore.textContent = `Điểm: ${quiz.score} / 100`; elements.unlockNote.textContent = nextOpen ? `🔓 Đã mở khóa Level ${levels.findIndex((x) => x.id === next.id) + 1}: ${next.title}!` : passed && !next ? "🌟 Bé đã hoàn thành tất cả level của chuyên đề này!" : `💪 Cùng luyện thêm để mở level tiếp theo nhé!`; elements.continueButton.hidden = false; elements.continueButton.textContent = nextOpen ? `Học tiếp ${next.title} →` : "Về chủ đề"; elements.continueButton.setAttribute("aria-label", nextOpen ? `Học tiếp ${next.title}` : `Về chủ đề ${TOPICS[item.topic].title}`); elements.continueButton.dataset.action = nextOpen ? "next" : "topic"; elements.topicButton.textContent = `Về ${TOPICS[item.topic].title}`; }
function toast(message) { clearTimeout(toastTimer); elements.toast.textContent = `${message} sẽ có trong thời gian tới nhé!`; elements.toast.classList.add("is-visible"); toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2800); }

// ==================== Navigation ====================
document.querySelectorAll("[data-go]").forEach((button) => { button.onclick = () => showScreen(button.dataset.go); });
document.querySelectorAll("[data-coming-soon]").forEach((button) => { button.onclick = () => toast(button.dataset.comingSoon); });
elements.quizBackButton.onclick = () => showScreen("levels"); elements.nextButton.onclick = nextQuestion; elements.retryButton.onclick = () => startQuiz(selectedLevelId); elements.topicButton.onclick = () => showScreen("levels"); elements.continueButton.onclick = () => { if (elements.continueButton.dataset.action === "topic") { showScreen("levels"); return; } const levels = LEVELS_BY_TOPIC[selectedTopic]; const next = levels[levels.findIndex((item) => item.id === selectedLevelId) + 1]; if (next && levelUnlocked(loadProgress(), next)) startQuiz(next.id); else showScreen("levels"); };
elements.readQuestionButton.onclick = () => readCurrentQuestion();
elements.soundSettingsButton.onclick = () => { const willOpen = elements.soundSettingsPanel.hidden; elements.soundSettingsPanel.hidden = !willOpen; elements.soundSettingsButton.setAttribute("aria-expanded", String(willOpen)); };
elements.soundEnabledToggle.onchange = () => { audioSettings.soundEnabled = elements.soundEnabledToggle.checked; audioSettings = saveAudioSettings(audioSettings); updateAudioControls(); };
elements.speechEnabledToggle.onchange = () => { audioSettings.speechEnabled = elements.speechEnabledToggle.checked; if (!audioSettings.speechEnabled) cancelSpeech(); audioSettings = saveAudioSettings(audioSettings); updateAudioControls(); };
elements.parentEntryButton.onclick = openParentGate;
elements.parentGateSubmit.onclick = () => { if (Number(elements.parentGateAnswer.value) === Number(elements.parentGateQuestion.dataset.answer)) { showScreen("parent-dashboard"); } else { elements.parentGateFeedback.textContent = "Chưa đúng, vui lòng thử lại."; elements.parentGateAnswer.select(); } };
elements.parentGateAnswer.onkeydown = (event) => { if (event.key === "Enter") elements.parentGateSubmit.click(); };
elements.parentRefreshButton.onclick = renderParentDashboard;
elements.parentDeleteButton.onclick = () => { resetDeleteConfirmation(); elements.parentDeleteConfirm.hidden = false; };
elements.parentDeleteCancel.onclick = resetDeleteConfirmation;
elements.parentDeleteNext.onclick = () => { elements.parentDeleteStep.textContent = "Để xác nhận, vui lòng nhập XOA chính xác."; elements.parentDeleteCodeLabel.hidden = false; elements.parentDeleteCode.hidden = false; elements.parentDeleteConfirmButton.hidden = false; elements.parentDeleteNext.hidden = true; elements.parentDeleteCode.focus(); };
elements.parentDeleteConfirmButton.onclick = () => { if (elements.parentDeleteCode.value.trim() !== "XOA") { elements.parentDeleteStep.textContent = "Mã xác nhận chưa đúng. Vui lòng nhập chính xác XOA."; elements.parentDeleteCode.focus(); return; } writeStorage(localStorage, STORAGE_KEY, JSON.stringify(defaultProgress())); quiz = null; resetDeleteConfirmation(); renderParentDashboard(); renderHeader(); };
document.addEventListener("visibilitychange", () => { if (document.hidden) stopStudyTracking(); else if (!screens.quiz.hidden) startStudyTracking(); });
window.addEventListener("pagehide", () => stopStudyTracking());
$("#current-year").textContent = new Date().getFullYear(); loadProgress(); updateAudioControls(); renderHeader();

// ==================== Non-destructive self-tests A-F ====================
function runProgressTests() {
  const one = LEVEL_BY_ID["addition-1"], two = LEVEL_BY_ID["addition-2"]; const results = []; const test = (name, passed) => results.push({ name, passed: Boolean(passed) });
  let progress = defaultProgress(); progress = saveResult(progress, one, 50, 5, "2026-10-02T00:00:00.000Z"); test("A1: 50 điểm chưa mở level sau", !levelUnlocked(progress, two)); progress = saveResult(progress, one, 80, 8, "2026-10-02T00:01:00.000Z"); test("A2: 80 điểm mở level sau", levelUnlocked(progress, two)); progress = saveResult(progress, one, 30, 3, "2026-10-02T00:02:00.000Z"); test("B: 30 điểm sau đó không khóa level", levelUnlocked(progress, two) && progress.levels[one.id].bestScore === 80);
  const memory = { value: null, getItem() { return this.value; }, setItem(key, value) { this.value = value; } }; saveProgress(progress, memory); const restored = loadProgress(memory); test("C: tải lại vẫn giữ tiến độ", restored.levels[one.id].bestScore === 80 && levelUnlocked(restored, two)); const empty = { getItem() { return null; }, setItem() {} }; test("D: localStorage trống khởi tạo được", loadProgress(empty).progressVersion === PROGRESS_VERSION); const broken = { getItem() { return "{bad json"; }, setItem() {} }; test("E: JSON lỗi tự phục hồi", loadProgress(broken).progressVersion === PROGRESS_VERSION); const old = { levels: { "addition-1": { bestScore: 80, bestCorrect: 8, attempts: 2 } }, totalCompleted: 2 }; const migrated = normalizeProgress(old); test("F: dữ liệu cũ migrate sang V2", migrated.progressVersion === PROGRESS_VERSION && migrated.levels[one.id].bestScore === 80 && migrated.levels[one.id].unlocked && migrated.levels[one.id].completed); return results;
}
window.__hocCungBeProgressTests = runProgressTests();

// ==================== Non-destructive counting-question checks ====================
function runCountingQuestionTests() {
  const countingLevels = [LEVEL_BY_ID["counting-1"], LEVEL_BY_ID["counting-2"]];
  const samples = Array.from({ length: 10 }, (_, index) => generateQuestion(countingLevels[index % countingLevels.length]));
  const genericQuestion = ["Có bao nhiêu", "đồ vật?"].join(" ");
  const passed = samples.every((item) => {
    const object = item.countingObject;
    const iconCount = item.prompt.split(object.icon).length - 1;
    return object && item.prompt.includes(`Có bao nhiêu ${object.name}?`) && iconCount === item.count && !item.prompt.includes(genericQuestion);
  });
  return { passed, samples: samples.map((item) => ({ prompt: item.prompt, object: item.countingObject.name, count: item.count })) };
}
window.__hocCungBeCountingQuestionTests = runCountingQuestionTests();

// ==================== Non-destructive geometry and sequence checks ====================
function runGeometryAndSequenceTests() {
  const geometryLevels = LEVELS_BY_TOPIC.geometry;
  const sequenceLevels = LEVELS.filter((item) => item.type === "sequence");
  const geometrySamples = Array.from({ length: 10 }, (_, index) => generateQuestion(geometryLevels[index % geometryLevels.length]));
  const sequenceSamples = Array.from({ length: 10 }, (_, index) => generateQuestion(sequenceLevels[index % sequenceLevels.length]));
  const geometryPassed = geometrySamples.every((item) => item.prompt.includes("big-shape") || item.prompt.includes("shape-row") || item.prompt.includes("giống hình nào?"));
  const sequencePassed = sequenceSamples.every((item) => item.prompt.includes("number-sequence") && !item.prompt.includes(",") && Array.isArray(item.sequenceValues) && item.sequenceValues.length === 3);
  return { passed: geometryPassed && sequencePassed, geometrySamples: geometrySamples.length, sequenceSamples: sequenceSamples.length, geometryPassed, sequencePassed };
}
window.__hocCungBeGeometryAndSequenceTests = runGeometryAndSequenceTests();

// ==================== Non-destructive audio and speech checks ====================
function runAudioAndSpeechTests() {
  const addition = LEVEL_BY_ID["addition-2"], subtraction = LEVEL_BY_ID["subtraction-2"], counting = LEVEL_BY_ID["counting-1"], sequence = LEVEL_BY_ID["missing-1"], geometry = LEVEL_BY_ID["geometry-1"];
  const addQuestion = question("3 + 2 = ?", 5, [5, 4, 3, 2], "test-add", "", "");
  const subQuestion = question("5 - 2 = ?", 3, [3, 2, 1, 4], "test-sub", "", "");
  const countQuestion = question("", 3, [3, 2, 1, 4], "test-count", "", "", { countingObject: { icon: "🍊", name: "quả cam" }, count: 3 });
  const sequenceQuestion = question("", 2, [2, 1, 3, 4], "test-sequence", "", "", { sequenceValues: [1, "?", 3] });
  const geometryQuestion = question("Đây là hình gì?", "hình tròn", ["hình tròn", "hình vuông", "hình tam giác", "hình chữ nhật"], "test-shape", "", "");
  const memory = { value: null, getItem() { return this.value; }, setItem(key, value) { this.value = value; } };
  saveAudioSettings({ soundEnabled: false, speechEnabled: false }, memory);
  const restored = loadAudioSettings(memory);
  const results = {
    addition: getQuestionSpeechText(addition, addQuestion) === "Ba cộng hai bằng bao nhiêu?",
    subtraction: getQuestionSpeechText(subtraction, subQuestion) === "Năm trừ hai bằng bao nhiêu?",
    counting: getQuestionSpeechText(counting, countQuestion) === "Có bao nhiêu quả cam?",
    sequence: getQuestionSpeechText(sequence, sequenceQuestion) === "Số nào còn thiếu trong dãy: một, ... ba?",
    geometry: getQuestionSpeechText(geometry, geometryQuestion) === "Đây là hình gì?",
    settingsPersistence: restored.soundEnabled === false && restored.speechEnabled === false,
    speechDisabledStopsReading: (() => { const before = audioSettings; audioSettings = { soundEnabled: true, speechEnabled: false }; const blocked = !canReadQuestion(); audioSettings = before; return blocked; })(),
    safeCompatibility: typeof speechSupported() === "boolean" && typeof playSoundEffect === "function",
  };
  return { passed: Object.values(results).every(Boolean), results };
}
window.__hocCungBeAudioAndSpeechTests = runAudioAndSpeechTests();

// ==================== Non-destructive mascot and result checks ====================
function runMascotAndResultTests() {
  const item = LEVEL_BY_ID["addition-1"]; const cases = [
    { score: 40, stars: 0, phrase: "Không sao" }, { score: 60, stars: 0, phrase: "tiến bộ" }, { score: 70, stars: 1, phrase: "Rất tốt" }, { score: 90, stars: 2, phrase: "Xuất sắc" }, { score: 100, stars: 3, phrase: "Tuyệt vời" },
  ];
  const results = cases.map(({ score, stars, phrase }) => { const originalRandom = Math.random; Math.random = () => 0; const praise = resultPraise(score); Math.random = originalRandom; return { score, passed: starsFor(score, item) === stars && praise.includes(phrase) }; });
  return { passed: results.every((itemResult) => itemResult.passed), results, mascotStates: ["normal", "correct", "encourage", "celebrate"], reducedMotionSupported: document.documentElement ? true : false };
}
window.__hocCungBeMascotAndResultTests = runMascotAndResultTests();

// ==================== Non-destructive parent dashboard checks ====================
function runParentDashboardTests() {
  const one = LEVEL_BY_ID["addition-1"], two = LEVEL_BY_ID["addition-2"], low = LEVEL_BY_ID["subtraction-1"]; const results = []; const test = (name, passed) => results.push({ name, passed: Boolean(passed) });
  const empty = defaultProgress(); test("A: dữ liệu trống có thống kê 0", parentStatistics(empty).attempts === 0 && parentStatistics(empty).average === 0 && empty.history.length === 0);
  let progress = saveResult(defaultProgress(), one, 90, 9, "2026-10-02T08:00:00.000Z"); progress = saveResult(progress, two, 80, 8, "2026-10-02T09:00:00.000Z"); progress = saveResult(progress, low, 40, 4, "2026-10-02T10:00:00.000Z"); const aggregate = parentStatistics(progress); test("B: tổng hợp level đã học chính xác", aggregate.attempts === 3 && aggregate.completedLevels === 3 && aggregate.stars === 3 && aggregate.average === 70);
  const lowest = Object.entries(TOPICS).map(([topicId, topic]) => ({ topicId, ...topicSummary(progress, topicId), title: topic.title })).filter((item) => item.items.some((levelItem) => levelItem.attempts)).sort((a, b) => a.average - b.average)[0]; test("C: chuyên đề thấp nhất được ưu tiên", lowest.topicId === "subtraction" && lowest.average === 40);
  test("D: level chưa học không gây lỗi", topicSummary(progress, "geometry").average === 0 && topicSummary(progress, "geometry").completed === 0);
  let timed = addStudySeconds(progress, 125, new Date("2026-10-02T11:00:00.000Z")); const memory = { value: null, getItem() { return this.value; }, setItem(key, value) { this.value = value; } }; saveProgress(timed, memory); const restored = loadProgress(memory); test("E: refresh giữ thời gian và history", restored.studyTime.totalSeconds >= 125 && restored.history.length === 3);
  test("F: tab bị ẩn không tiếp tục đếm thời gian", shouldTrackQuiz(true, true) === false && shouldTrackQuiz(true, false) === true && shouldTrackQuiz(false, false) === false);
  let history = defaultProgress(); for (let index = 0; index < 55; index += 1) history = saveResult(history, one, 70, 7, `2026-10-02T${String(index % 24).padStart(2, "0")}:00:00.000Z`); test("G: history chỉ giữ 50 bản ghi", history.history.length === 50);
  const v2 = { progressVersion: 2, levels: { "addition-1": { bestScore: 80, bestCorrect: 8, bestStars: 1, attempts: 1, completed: true, unlocked: true, lastPlayedAt: "2026-10-01T00:00:00.000Z" } }, totalCompleted: 1 }; const migrated = normalizeProgress(v2); test("H: dữ liệu V2 thêm field an toàn", migrated.progressVersion === 2 && migrated.levels[one.id].bestScore === 80 && validObject(migrated.studyTime) && Array.isArray(migrated.history));
  const brokenStorage = { getItem() { return "{bad json"; }, setItem() {} }; test("I: JSON lỗi không làm website crash", loadProgress(brokenStorage).progressVersion === 2);
  const codeAccepted = "XOA".trim() === "XOA"; const codeRejected = "xoa".trim() !== "XOA"; test("J: xóa cần xác nhận mã hai bước", codeAccepted && codeRejected && typeof resetDeleteConfirmation === "function");
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeParentDashboardTests = runParentDashboardTests();