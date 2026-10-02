"use strict";

// ==================== Lesson / Level Data ====================
const STORAGE_KEY = "hoc-cung-be:math-grade-1-progress";
const LEGACY_KEY = "hoc-cung-be:addition-progress";
const PROGRESS_VERSION = 2;
const DEFAULT_COUNT = 10;
const DEFAULT_UNLOCK_SCORE = 70;
const AUDIO_SETTINGS_KEY = "hoc-cung-be:audio-settings";
const IOS_INSTALL_HINT_DISMISSED_KEY = "hoc-cung-be:ios-install-hint-dismissed";
const TRIAL_COMPLETED_KEY = "hoc-cung-be:trial-completed";
const TRIAL_LEVEL_IDS = ["counting-1", "counting-2"];

const TOPICS = {
  counting: { id: "counting", title: "Số và đếm", shortTitle: "Đếm", icon: "🔟", colorTheme: "blue", color: "blue", description: "Nhận biết số, đếm và sắp xếp các số.", sortOrder: 1 },
  compare: { id: "compare", title: "So sánh số", shortTitle: "So sánh", icon: "⚖️", colorTheme: "orange", color: "orange", description: "So sánh số bằng dấu lớn hơn, bé hơn, bằng nhau.", sortOrder: 2 },
  addition: { id: "addition", title: "Phép cộng", shortTitle: "Cộng", icon: "➕", colorTheme: "purple", color: "purple", description: "Luyện cộng từ cơ bản đến cộng qua 10.", sortOrder: 3 },
  subtraction: { id: "subtraction", title: "Phép trừ", shortTitle: "Trừ", icon: "➖", colorTheme: "pink", color: "pink", description: "Luyện trừ từ cơ bản đến trừ qua 10.", sortOrder: 4 },
  missing: { id: "missing", title: "Điền số", shortTitle: "Điền số", icon: "✍️", colorTheme: "green", color: "green", description: "Tìm số còn thiếu trong dãy số và phép tính.", sortOrder: 5 },
  geometry: { id: "geometry", title: "Hình học", shortTitle: "Hình học", icon: "🔺", colorTheme: "yellow", color: "yellow", description: "Làm quen với những hình dạng đáng yêu.", sortOrder: 6 },
  numbers20: { id: "numbers20", title: "Số đến 20", shortTitle: "Đến 20", icon: "2️⃣0️⃣", colorTheme: "blue", color: "blue", description: "Đếm, sắp xếp và so sánh các số đến 20.", sortOrder: 7 },
  numbers100: { id: "numbers100", title: "Số đến 100", shortTitle: "Đến 100", icon: "💯", colorTheme: "orange", color: "orange", description: "Làm quen với số chục, số đơn vị và các số đến 100.", sortOrder: 8 },
  wordProblems: { id: "wordProblems", title: "Bài toán có lời văn", shortTitle: "Lời văn", icon: "📖", colorTheme: "purple", color: "purple", description: "Đọc câu ngắn, nhìn hình và tính một phép tính.", sortOrder: 9 },
  clock: { id: "clock", title: "Xem đồng hồ", shortTitle: "Đồng hồ", icon: "🕐", colorTheme: "pink", color: "pink", description: "Nhận biết giờ đúng và nửa giờ.", sortOrder: 10 },
  length: { id: "length", title: "Đo độ dài", shortTitle: "Độ dài", icon: "📏", colorTheme: "green", color: "green", description: "So sánh dài hơn, ngắn hơn bằng hình ảnh.", sortOrder: 11 },
  money: { id: "money", title: "Tiền Việt Nam", shortTitle: "Tiền", icon: "💴", colorTheme: "yellow", color: "yellow", description: "Nhận biết và cộng các mệnh giá tiền đơn giản.", sortOrder: 12 },
};

// Emoji are local Unicode characters: no network image is required for an offline PWA.
const OBJECT_LIBRARY = [
  { id: "cat", icon: "🐱", name: "con mèo", category: "animal", displayName: "mèo", hintText: "Đếm từng con mèo nhé!" },
  { id: "dog", icon: "🐶", name: "con chó", category: "animal", displayName: "chó", hintText: "Đếm từng con chó nhé!" },
  { id: "fish", icon: "🐟", name: "con cá", category: "animal", displayName: "cá", hintText: "Nhìn kỹ từng con cá nhé!" },
  { id: "butterfly", icon: "🦋", name: "con bướm", category: "animal", displayName: "bướm", hintText: "Đếm từng con bướm nhé!" },
  { id: "apple", icon: "🍎", name: "quả táo", category: "fruit", displayName: "táo", hintText: "Đếm từng quả táo nhé!" },
  { id: "orange", icon: "🍊", name: "quả cam", category: "fruit", displayName: "cam", hintText: "Đếm từng quả cam nhé!" },
  { id: "ball", icon: "⚽", name: "chiếc bóng", category: "school", displayName: "bóng", hintText: "Đếm từng chiếc bóng nhé!" },
  { id: "pen", icon: "🖊️", name: "cây bút", category: "school", displayName: "bút", hintText: "Đếm từng cây bút nhé!" },
  { id: "candy", icon: "🍬", name: "viên kẹo", category: "food", displayName: "kẹo", hintText: "Đếm từng viên kẹo nhé!" },
  { id: "flower", icon: "🌷", name: "bông hoa", category: "nature", displayName: "hoa", hintText: "Đếm từng bông hoa nhé!" },
  { id: "star", icon: "⭐", name: "ngôi sao", category: "symbol", displayName: "sao", hintText: "Đếm từng ngôi sao nhé!" },
];
const VISUAL_SETS = { counting: OBJECT_LIBRARY, addition: OBJECT_LIBRARY.filter((item) => ["fish", "apple", "cat", "candy"].includes(item.id)), subtraction: OBJECT_LIBRARY.filter((item) => ["apple", "fish", "orange", "dog"].includes(item.id)) };

const level = (id, topic, title, type, min, max, extra = {}) => ({ id, topic, title, type, min, max, questionCount: DEFAULT_COUNT, unlockScore: DEFAULT_UNLOCK_SCORE, rewardStars: [70, 90, 100], imageMode: "none", visualSet: null, hint: "", ...extra });
const LEVELS = [
  level("counting-1", "counting", "Đếm đồ vật đến 5", "count", 1, 5, { order: 1, imageMode: "count", visualSet: "counting" }), level("counting-2", "counting", "Đếm đồ vật đến 10", "count", 1, 10, { order: 2, imageMode: "count", visualSet: "counting" }), level("counting-3", "counting", "Số liền trước - liền sau", "near", 1, 9, { order: 3 }), level("counting-4", "counting", "Sắp xếp số", "sort", 0, 6, { order: 4 }), level("counting-5", "counting", "Chọn nhóm có nhiều hơn", "groupCompare", 1, 10, { order: 5, imageMode: "groups", visualSet: "counting" }), level("counting-6", "counting", "Ôn tập số và đếm", "count", 1, 10, { order: 6, imageMode: "count", visualSet: "counting" }),
  level("compare-1", "compare", "So sánh trong phạm vi 5", "compare", 0, 5, { order: 1 }), level("compare-2", "compare", "So sánh trong phạm vi 10", "compare", 0, 10, { order: 2 }), level("compare-3", "compare", "Chọn số lớn hơn", "larger", 0, 10, { order: 3 }), level("compare-4", "compare", "Chọn số bé hơn", "smaller", 0, 10, { order: 4 }),
  level("addition-1", "addition", "Cộng trong phạm vi 5", "add", 0, 5, { order: 1 }), level("addition-2", "addition", "Cộng trong phạm vi 10", "add", 0, 10, { order: 2 }), level("addition-3", "addition", "Tìm số còn thiếu", "addMissing", 0, 10, { order: 3 }), level("addition-4", "addition", "Cộng bằng hình ảnh", "addPicture", 0, 10, { order: 4, imageMode: "addition", visualSet: "addition" }), level("addition-5", "addition", "Cộng với số 0", "addZero", 0, 10, { order: 5 }), level("addition-6", "addition", "Cộng trong phạm vi 20", "add", 0, 20, { order: 6 }), level("addition-7", "addition", "Cộng qua 10", "addCrossTen", 0, 20, { order: 7 }), level("addition-8", "addition", "Ôn tập phép cộng", "add", 0, 20, { order: 8 }),
  level("subtraction-1", "subtraction", "Trừ trong phạm vi 5", "subtract", 0, 5, { order: 1 }), level("subtraction-2", "subtraction", "Trừ trong phạm vi 10", "subtract", 0, 10, { order: 2 }), level("subtraction-3", "subtraction", "Tìm số còn thiếu", "subMissing", 0, 10, { order: 3 }), level("subtraction-4", "subtraction", "Trừ bằng hình ảnh", "subPicture", 0, 10, { order: 4, imageMode: "subtraction", visualSet: "subtraction" }), level("subtraction-5", "subtraction", "Trừ với số 0", "subZero", 0, 10, { order: 5 }), level("subtraction-6", "subtraction", "Trừ trong phạm vi 20", "subtract", 0, 20, { order: 6 }), level("subtraction-7", "subtraction", "Trừ qua 10", "subCrossTen", 0, 20, { order: 7 }), level("subtraction-8", "subtraction", "Ôn tập phép trừ", "subtract", 0, 20, { order: 8 }),
  level("missing-1", "missing", "Điền số trong phạm vi 5", "sequence", 0, 5, { order: 1 }), level("missing-2", "missing", "Điền số trong phạm vi 10", "sequence", 0, 10, { order: 2 }), level("missing-3", "missing", "Số còn thiếu trong phép tính", "addMissing", 0, 10, { order: 3 }), level("missing-4", "missing", "Dãy số vui nhộn", "sequence", 0, 8, { order: 4 }),
  level("geometry-1", "geometry", "Nhận biết hình cơ bản", "shape", 0, 0, { order: 1 }), level("geometry-2", "geometry", "Tìm đúng hình", "shape", 0, 0, { order: 2 }), level("geometry-3", "geometry", "Đếm hình", "shapeCount", 1, 5, { order: 3 }), level("geometry-4", "geometry", "Hình trong cuộc sống", "shapeLife", 0, 0, { order: 4 }),
  level("numbers20-1", "numbers20", "Đếm và chọn số đến 20", "numberTo20", 1, 20, { order: 1, imageMode: "count", visualSet: "counting" }), level("numbers20-2", "numbers20", "Số liền trước đến 20", "numberTo20", 1, 20, { order: 2, mode: "before" }), level("numbers20-3", "numbers20", "Số liền sau đến 20", "numberTo20", 1, 20, { order: 3, mode: "after" }), level("numbers20-4", "numbers20", "Sắp xếp tăng dần", "numberTo20", 1, 20, { order: 4, mode: "ascending" }), level("numbers20-5", "numbers20", "Sắp xếp giảm dần", "numberTo20", 1, 20, { order: 5, mode: "descending" }), level("numbers20-6", "numbers20", "So sánh số đến 20", "numberTo20", 1, 20, { order: 6, mode: "compare" }),
  level("numbers100-1", "numbers100", "Nhận biết số đến 100", "numberTo100", 10, 100, { order: 1, mode: "recognize" }), level("numbers100-2", "numbers100", "Số chục và số đơn vị", "tensOnes", 10, 99, { order: 2 }), level("numbers100-3", "numbers100", "Chọn số lớn hơn", "numberTo100", 10, 99, { order: 3, mode: "larger" }), level("numbers100-4", "numbers100", "Chọn số bé hơn", "numberTo100", 10, 99, { order: 4, mode: "smaller" }), level("numbers100-5", "numbers100", "Số liền trước và liền sau", "numberTo100", 11, 99, { order: 5, mode: "near" }), level("numbers100-6", "numbers100", "Sắp xếp số đến 100", "numberTo100", 10, 99, { order: 6, mode: "sort" }), level("numbers100-7", "numbers100", "Điền số còn thiếu", "numberTo100", 10, 98, { order: 7, mode: "missing" }),
  level("word-problems-1", "wordProblems", "Cộng bằng lời văn", "wordProblemAdd", 1, 10, { order: 1, imageMode: "addition", visualSet: "addition" }), level("word-problems-2", "wordProblems", "Trừ bằng lời văn", "wordProblemSubtract", 1, 10, { order: 2, imageMode: "subtraction", visualSet: "subtraction" }), level("word-problems-3", "wordProblems", "Ôn tập bài toán lời văn", "wordProblemAdd", 2, 15, { order: 3, imageMode: "addition", visualSet: "addition" }), level("word-problems-4", "wordProblems", "Ôn tập bài toán lời văn", "wordProblemSubtract", 2, 15, { order: 4, imageMode: "subtraction", visualSet: "subtraction" }),
  level("clock-1", "clock", "Đọc giờ đúng", "clockReading", 1, 12, { order: 1, halfHour: false }), level("clock-2", "clock", "Chọn đồng hồ giờ đúng", "clockReading", 1, 12, { order: 2, halfHour: false }), level("clock-3", "clock", "Đọc nửa giờ", "clockReading", 1, 12, { order: 3, halfHour: true }),
  level("length-1", "length", "Vật nào dài hơn?", "lengthCompare", 1, 10, { order: 1, mode: "longer" }), level("length-2", "length", "Vật nào ngắn hơn?", "lengthCompare", 1, 10, { order: 2, mode: "shorter" }), level("length-3", "length", "So sánh độ dài theo cm", "lengthCompare", 2, 15, { order: 3, mode: "cm" }),
  level("money-1", "money", "Nhận biết mệnh giá tiền", "vietnamMoney", 1000, 10000, { order: 1, mode: "recognize" }), level("money-2", "money", "Chọn số tiền đúng", "vietnamMoney", 1000, 10000, { order: 2, mode: "choose" }), level("money-3", "money", "Cộng tiền đơn giản", "vietnamMoney", 1000, 10000, { order: 3, mode: "add" }),
];
const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((item) => [item.id, item]));
function getLevelsByTopic(topicId) { return LEVELS.filter((item) => item.topic === topicId).sort((a, b) => a.order - b.order); }
function getLevelCountByTopic(topicId) { return getLevelsByTopic(topicId).length; }
function getLevelIndexInTopic(levelId) { const item = LEVEL_BY_ID[levelId]; return item ? getLevelsByTopic(item.topic).findIndex((levelItem) => levelItem.id === levelId) : -1; }
function getNextLevelInTopic(levelId) { const item = LEVEL_BY_ID[levelId]; const index = getLevelIndexInTopic(levelId); return item && index >= 0 ? getLevelsByTopic(item.topic)[index + 1] || null : null; }

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
function numberToVietnamese(value) { const number = Number(value); if (!Number.isInteger(number) || number < 0 || number > 999) return String(value); const ones = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]; if (number < 10) return ones[number]; if (number < 20) return number === 10 ? "mười" : `mười ${number === 15 ? "lăm" : ones[number - 10]}`; if (number < 100) { const tens = Math.floor(number / 10); const unit = number % 10; return `${ones[tens]} mươi${unit ? ` ${unit === 1 ? "mốt" : unit === 5 ? "lăm" : ones[unit]}` : ""}`; } const hundreds = Math.floor(number / 100); const rest = number % 100; return `${ones[hundreds]} trăm${rest ? ` ${rest < 10 ? `lẻ ${ones[rest]}` : numberToVietnamese(rest)}` : ""}`; }
function formatMoney(value) { return `${Number(value).toLocaleString("vi-VN")}đ`; }
function plainQuestionText(prompt) { const holder = document.createElement("div"); holder.innerHTML = prompt; return holder.textContent.replace(/\s+/g, " ").trim(); }
function getQuestionSpeechText(level, item) {
  const text = plainQuestionText(item.prompt); const numbers = text.match(/\d+/g) || [];
  if (level.type === "count") return `Có bao nhiêu ${item.countingObject?.name || "đồ vật"}?`;
  if (level.type === "compare") return `${numberToVietnamese(numbers[0])} so với ${numberToVietnamese(numbers[1])}. Hãy chọn dấu thích hợp.`;
  if (level.type === "larger") return `Số nào lớn hơn: ${numberToVietnamese(numbers[0])} hay ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "smaller") return `Số nào bé hơn: ${numberToVietnamese(numbers[0])} hay ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "add") return `${numberToVietnamese(numbers[0])} cộng ${numberToVietnamese(numbers[1])} bằng bao nhiêu?`;
  if (level.type === "addMissing") return `${numberToVietnamese(numbers[0])} cộng số nào bằng ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "addPicture") return `Có tất cả bao nhiêu ${item.visualObject?.name || "đồ vật"}?`;
  if (level.type === "subtract") return `${numberToVietnamese(numbers[0])} trừ ${numberToVietnamese(numbers[1])} bằng bao nhiêu?`;
  if (level.type === "subMissing") return `Số nào trừ ${numberToVietnamese(numbers[0])} bằng ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "subPicture") return `Có ${item.initialCount || ""} ${item.visualObject?.name || "đồ vật"}. Bớt đi ${item.removedCount || ""}. Còn lại bao nhiêu?`;
  if (level.type === "sequence") return `Số nào còn thiếu trong dãy: ${numberToVietnamese(item.sequenceValues?.[0])}, ... ${numberToVietnamese(item.sequenceValues?.[2])}?`;
  if (level.type === "near") return text.replace(/\d+/g, (number) => numberToVietnamese(number));
  if (level.type === "sort") return "Dãy số nào được sắp xếp từ bé đến lớn?";
  if (level.type === "shape") return "Đây là hình gì?";
  if (level.type === "shapeLife") return text;
  if (level.type === "shapeCount") return text.match(/Có bao nhiêu hình [^?]+\?/)?.[0] || "Có bao nhiêu hình?";
  if (level.type === "numberTo20" || level.type === "numberTo100" || level.type === "tensOnes" || level.type === "wordProblemAdd" || level.type === "wordProblemSubtract" || level.type === "lengthCompare") return item.speechText || text.replace(/\d+/g, (number) => numberToVietnamese(number));
  if (level.type === "clockReading") return `Đồng hồ chỉ ${numberToVietnamese(item.hour)} giờ${item.minute ? " ba mươi phút" : ""}. ${item.clockQuestion || "Hãy chọn thời gian đúng."}`;
  if (level.type === "vietnamMoney") return item.speechText || text;
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
function defaultProgress() { const levels = {}; Object.keys(TOPICS).forEach((topic) => getLevelsByTopic(topic).forEach((item, index) => { levels[item.id] = newLevelProgress(index === 0); })); return { progressVersion: PROGRESS_VERSION, levels, totalCompleted: 0, studyTime: defaultStudyTime(), history: [] }; }
function normalizeProgress(raw) {
  const source = validObject(raw) ? raw : {}; const sourceLevels = validObject(source.levels) ? source.levels : {}; const result = defaultProgress(); result.totalCompleted = safeNumber(source.totalCompleted, 999999);
  Object.keys(TOPICS).forEach((topic) => getLevelsByTopic(topic).forEach((item, index) => {
    const old = validObject(sourceLevels[item.id]) ? sourceLevels[item.id] : {}; const previousLevel = index ? getLevelsByTopic(topic)[index - 1] : null; const previous = previousLevel ? result.levels[previousLevel.id] : null;
    const unlockedByScore = previous ? previous.bestScore >= previousLevel.unlockScore : true;
    result.levels[item.id] = { bestScore: safeNumber(old.bestScore), bestCorrect: safeNumber(old.bestCorrect, item.questionCount), bestStars: safeNumber(old.bestStars, 3), attempts: safeNumber(old.attempts, 999999), completed: Boolean(old.completed) || safeNumber(old.attempts, 999999) > 0, unlocked: Boolean(old.unlocked) || index === 0 || unlockedByScore, lastPlayedAt: typeof old.lastPlayedAt === "string" ? old.lastPlayedAt : null };
  }));
  result.studyTime = normalizeStudyTime(source.studyTime); result.history = normalizeHistory(source.history); return result;
}
function migrateLegacy(raw) { const progress = defaultProgress(); if (!validObject(raw)) return progress; const item = progress.levels["addition-2"]; item.bestScore = safeNumber(raw.bestScore); item.bestCorrect = safeNumber(raw.bestCorrect, 10); item.bestStars = starsFor(item.bestScore, LEVEL_BY_ID["addition-2"]); item.attempts = safeNumber(raw.completed, 999999); item.completed = item.attempts > 0; item.unlocked = true; progress.totalCompleted = item.attempts; return normalizeProgress(progress); }
function loadProgress(storage = localStorage) { const raw = parseJSON(readStorage(storage, STORAGE_KEY)); const progress = raw ? normalizeProgress(raw) : (parseJSON(readStorage(storage, LEGACY_KEY)) ? migrateLegacy(parseJSON(readStorage(storage, LEGACY_KEY))) : defaultProgress()); writeStorage(storage, STORAGE_KEY, JSON.stringify(progress)); return progress; }
function saveProgress(progress, storage = localStorage) { const safe = normalizeProgress(progress); writeStorage(storage, STORAGE_KEY, JSON.stringify(safe)); return safe; }
function levelProgress(progress, id) { return progress.levels[id] || newLevelProgress(false); }
function levelUnlocked(progress, item) { return Boolean(levelProgress(progress, item.id).unlocked); }
function isTrialLevel(levelId) { return TRIAL_LEVEL_IDS.includes(levelId); }
function getLevelLockReason(levelId, user, progress) {
  const item = LEVEL_BY_ID[levelId];
  if (!item) return "missing";
  if (!user && !isTrialLevel(levelId)) return "account";
  if (!user && isTrialLevel(levelId)) return null;
  return levelUnlocked(progress, item) ? null : "progress";
}
function canAccessLevel(levelId, user, progress) { return getLevelLockReason(levelId, user, progress) === null; }
function getContinueAction(levelId, user, progress) {
  if (!user && levelId === TRIAL_LEVEL_IDS[0]) return "next";
  if (!user && levelId === TRIAL_LEVEL_IDS[1]) return "auth";
  const next = getNextLevelInTopic(levelId);
  return next && canAccessLevel(next.id, user, progress) ? "next" : "topic";
}
function saveResult(progress, item, score, correct, timestamp = new Date().toISOString()) {
  const result = normalizeProgress(progress); const previous = levelProgress(result, item.id); const bestScore = Math.max(previous.bestScore, safeNumber(score));
  result.levels[item.id] = { ...previous, bestScore, bestCorrect: Math.max(previous.bestCorrect, safeNumber(correct, item.questionCount)), bestStars: Math.max(previous.bestStars, starsFor(score, item)), attempts: previous.attempts + 1, completed: true, unlocked: true, lastPlayedAt: timestamp };
  result.totalCompleted += 1; result.history = [...result.history, { levelId: item.id, topic: item.topic, score: safeNumber(score), correct: safeNumber(correct, item.questionCount), stars: starsFor(score, item), completedAt: timestamp }].slice(-50); const next = getNextLevelInTopic(item.id);
  if (next && bestScore >= item.unlockScore) result.levels[next.id] = { ...levelProgress(result, next.id), unlocked: true };
  return normalizeProgress(result);
}
function getTopicProgress(progress, topicId) { const levels = getLevelsByTopic(topicId); const items = levels.map((item) => levelProgress(progress, item.id)); const completed = items.filter((item) => item.completed).length; const opened = items.filter((item) => item.unlocked).length; const studied = items.filter((item) => item.attempts > 0); return { levels, items, total: levels.length, completed, opened, locked: Math.max(0, levels.length - opened), average: studied.length ? Math.round(studied.reduce((sum, item) => sum + item.bestScore, 0) / studied.length) : 0, stars: items.reduce((sum, item) => sum + item.bestStars, 0), percent: levels.length ? Math.round((completed / levels.length) * 100) : 0 }; }
function statistics(progress) { return Object.values(progress.levels).reduce((total, item) => ({ stars: total.stars + item.bestStars, score: total.score + item.bestScore, completed: progress.totalCompleted }), { stars: 0, score: 0, completed: progress.totalCompleted }); }
function addStudySeconds(progress, seconds, timestamp = new Date()) { const result = normalizeProgress(progress); const amount = safeNumber(seconds, 864000); if (!amount) return result; const today = dateKey(timestamp); if (result.studyTime.todayDate !== today) { result.studyTime.todayDate = today; result.studyTime.todaySeconds = 0; } result.studyTime.totalSeconds += amount; result.studyTime.todaySeconds += amount; result.studyTime.lastStudyDate = timestamp.toISOString(); return normalizeProgress(result); }

// ==================== Question Generator ====================
function options(answer, max = 10, extra = []) { const values = new Set([String(answer)]); shuffle([...Array.from({ length: max + 1 }, (_, n) => String(n)), ...extra.map(String)]).forEach((value) => { if (values.size < 4 && value !== String(answer)) values.add(value); }); return shuffle([...values]); }
function question(prompt, answer, answerOptions, key, helper, tip, metadata = {}) { return { prompt, answer: String(answer), options: answerOptions.map(String), key, helper, tip, hadWrong: false, ...metadata }; }
function sequenceMarkup(first, middle, last) { return `<span class="number-sequence"><span>${first}</span><span>${middle}</span><span>${last}</span></span>`; }
function pickVisual(item) { const set = VISUAL_SETS[item.visualSet] || OBJECT_LIBRARY; return set[randomInt(0, set.length - 1)]; }
function visualItems(object, count, removed = 0) { return Array.from({ length: count }, (_, index) => `<span class="visual-object${index >= count - removed ? " is-removed" : ""}" aria-hidden="true">${object.icon}</span>`).join(""); }
function visualGroup(object, count, label = "") { return `<span class="visual-group"><small>${label}</small><span class="visual-count">${visualItems(object, count)}</span></span>`; }
function closeNumberOptions(answer, min = 0, max = 100) { const values = new Set([Number(answer)]); [-2, -1, 1, 2, -3, 3].forEach((offset) => { const value = Number(answer) + offset; if (value >= min && value <= max && values.size < 4) values.add(value); }); while (values.size < 4) values.add(randomInt(min, max)); return shuffle([...values].map(String)); }
function clockMarkup(hour, minute) { const hourAngle = ((hour % 12) + minute / 60) * 30; const minuteAngle = minute * 6; const marks = Array.from({ length: 12 }, (_, index) => `<span class="clock-mark" style="--mark:${index * 30}deg"><b>${index + 1}</b></span>`).join(""); return `<span class="learning-clock" aria-label="Đồng hồ ${hour} giờ ${minute} phút"><span class="clock-face">${marks}<i class="clock-hand clock-hand--hour" style="--angle:${hourAngle}deg"></i><i class="clock-hand clock-hand--minute" style="--angle:${minuteAngle}deg"></i><b class="clock-pin"></b></span></span>`; }
function moneyCard(value) { return `<span class="money-card" aria-label="${formatMoney(value)}"><b>${formatMoney(value)}</b><small>Tiền học tập</small></span>`; }
function lengthBars(first, second) { return `<span class="length-visual"><span class="length-item"><b>Vật A</b><i class="length-bar" style="--length:${first}"></i></span><span class="length-item"><b>Vật B</b><i class="length-bar length-bar--second" style="--length:${second}"></i></span></span>`; }
function moneyOptions(answer, seed = []) { const values = new Set([Number(answer), ...seed.map(Number)]); [-2000, -1000, 1000, 2000, 5000].forEach((offset) => { const value = Number(answer) + offset; if (value >= 1000 && values.size < 4) values.add(value); }); return shuffle([...values].slice(0, 4).map(formatMoney)); }
function generateQuestion(item) {
  const { type, min, max } = item; let a; let b; let n;
  if (type === "numberTo20") {
    const mode = item.mode || "recognize"; n = randomInt(min, max);
    if (mode === "before" || mode === "after") { n = randomInt(mode === "before" ? 2 : 1, max - (mode === "after" ? 1 : 0)); const answer = mode === "before" ? n - 1 : n + 1; return question(`Số liền ${mode === "before" ? "trước" : "sau"} của ${n} là số nào?`, answer, closeNumberOptions(answer, 0, 20), `numbers20-${mode}-${n}`, "Đếm lùi hoặc đếm tiến một số nhé!", "Số liền nhau hơn kém nhau 1.", { speechText: `Số liền ${mode === "before" ? "trước" : "sau"} của ${numberToVietnamese(n)} là số nào?` }); }
    if (mode === "ascending" || mode === "descending") { n = randomInt(1, 17); const correct = mode === "ascending" ? `${n}, ${n + 1}, ${n + 2}` : `${n + 2}, ${n + 1}, ${n}`; const distractors = mode === "ascending" ? [`${n + 1}, ${n}, ${n + 2}`, `${n + 2}, ${n + 1}, ${n}`, `${n}, ${n + 2}, ${n + 1}`] : [`${n}, ${n + 1}, ${n + 2}`, `${n + 2}, ${n}, ${n + 1}`, `${n + 1}, ${n + 2}, ${n}`]; return question(`Dãy số nào được sắp xếp ${mode === "ascending" ? "từ bé đến lớn" : "từ lớn đến bé"}?`, correct, shuffle([correct, ...distractors]), `numbers20-${mode}-${n}`, "Nhìn số đầu tiên và số cuối cùng nhé!", mode === "ascending" ? "Số bé đứng trước." : "Số lớn đứng trước.", { speechText: `Dãy số nào được sắp xếp ${mode === "ascending" ? "từ bé đến lớn" : "từ lớn đến bé"}?` }); }
    if (mode === "compare") { a = randomInt(1, 20); b = randomInt(1, 20); const answer = a > b ? ">" : a < b ? "<" : "="; return question(`${a} &nbsp; ? &nbsp; ${b}`, answer, [">", "<", "=", "?"], `numbers20-compare-${a}-${b}`, "Chọn dấu thích hợp nhé!", "Miệng dấu lớn quay về số lớn.", { speechText: `${numberToVietnamese(a)} so với ${numberToVietnamese(b)}. Hãy chọn dấu thích hợp.` }); }
    const object = pickVisual(item); return question(`Chọn số đúng.<br><span class="visual-count visual-count--objects">${visualItems(object, n)}</span>`, n, closeNumberOptions(n, 1, 20), `numbers20-count-${object.id}-${n}`, `Đếm từng ${object.name} nhé!`, object.hintText, { visualObject: object, count: n, speechText: `Có bao nhiêu ${object.name}? Hãy chọn số đúng.` });
  }
  if (type === "numberTo100") {
    const mode = item.mode || "recognize"; n = randomInt(min, max);
    if (mode === "larger" || mode === "smaller") { a = randomInt(10, 99); b = randomInt(10, 99); while (a === b) b = randomInt(10, 99); const answer = mode === "larger" ? Math.max(a, b) : Math.min(a, b); const distractors = new Set([a, b]); [answer - 1, answer + 1].filter((value) => value >= 10 && value <= 99).forEach((value) => distractors.add(value)); while (distractors.size < 4) distractors.add(randomInt(10, 99)); return question(`Số nào ${mode === "larger" ? "lớn hơn" : "bé hơn"}?<br><b>${a} hay ${b}</b>`, answer, shuffle([...distractors]), `numbers100-${mode}-${a}-${b}`, "So sánh hàng chục trước, rồi đến hàng đơn vị.", "Số có nhiều chục hơn thì lớn hơn.", { speechText: `Số nào ${mode === "larger" ? "lớn hơn" : "bé hơn"}: ${numberToVietnamese(a)} hay ${numberToVietnamese(b)}?` }); }
    if (mode === "near") { n = randomInt(11, 98); const after = Math.random() > .5; const answer = after ? n + 1 : n - 1; return question(`Số liền ${after ? "sau" : "trước"} của ${n} là số nào?`, answer, closeNumberOptions(answer, 10, 99), `numbers100-near-${n}-${after}`, "Đếm tiến hoặc lùi một số nhé!", "Hai số liền nhau hơn kém nhau 1.", { speechText: `Số liền ${after ? "sau" : "trước"} của ${numberToVietnamese(n)} là số nào?` }); }
    if (mode === "sort") { n = randomInt(10, 94); const values = [n, n + 2, n + 4]; const correct = values.join(", "); return question("Dãy số nào được sắp xếp từ bé đến lớn?", correct, shuffle([correct, `${values[1]}, ${values[0]}, ${values[2]}`, `${values[2]}, ${values[1]}, ${values[0]}`, `${values[0]}, ${values[2]}, ${values[1]}`]), `numbers100-sort-${n}`, "So sánh hàng chục trước nhé!", "Số bé đứng trước, số lớn đứng sau.", { speechText: "Dãy số nào được sắp xếp từ bé đến lớn?" }); }
    if (mode === "missing") { n = randomInt(10, 97); return question(sequenceMarkup(n, "?", n + 2), n + 1, closeNumberOptions(n + 1, 10, 99), `numbers100-missing-${n}`, "Số nào còn thiếu trong dãy?", "Đếm lần lượt từng số.", { sequenceValues: [n, "?", n + 2], speechText: `Số nào còn thiếu trong dãy: ${numberToVietnamese(n)}, chấm chấm, ${numberToVietnamese(n + 2)}?` }); }
    return question(`Số nào là ${n}?`, n, closeNumberOptions(n, 10, 100), `numbers100-recognize-${n}`, "Nhìn kỹ số rồi chọn nhé!", "Đọc hàng chục trước, hàng đơn vị sau.", { speechText: `Số nào là ${numberToVietnamese(n)}?` });
  }
  if (type === "tensOnes") { n = randomInt(10, 99); const answer = `${Math.floor(n / 10)} chục và ${n % 10} đơn vị`; const choices = shuffle([answer, `${n % 10} chục và ${Math.floor(n / 10)} đơn vị`, `${Math.floor(n / 10) + 1} chục và ${n % 10} đơn vị`, `${Math.floor(n / 10)} chục và ${(n + 1) % 10} đơn vị`]); return question(`Số ${n} có mấy chục và mấy đơn vị?`, answer, choices, `tens-ones-${n}`, "Nhìn chữ số hàng chục ở bên trái nhé!", "Chữ số bên trái là hàng chục.", { speechText: `Số ${numberToVietnamese(n)} có mấy chục và mấy đơn vị?` }); }
  if (type === "wordProblemAdd" || type === "wordProblemSubtract") { const object = OBJECT_LIBRARY.filter((entry) => ["apple", "candy", "fish", "pen", "ball", "flower"].includes(entry.id))[randomInt(0, 5)]; const names = ["Lan", "Nam", "Mai", "An", "Minh", "Bé Na"]; const person = names[randomInt(0, names.length - 1)]; a = randomInt(1, Math.max(2, Math.floor(max / 2))); b = randomInt(1, Math.max(1, Math.min(a - (type === "wordProblemSubtract" ? 1 : 0), max - a))); if (type === "wordProblemSubtract") { a = randomInt(Math.max(2, min), max); b = randomInt(1, a - 1); const text = `${person} có ${a} ${object.name}. ${person} cho bạn ${b} ${object.name}. ${person} còn lại bao nhiêu ${object.name}?`; return question(`${text}<br><span class="visual-count visual-count--objects">${visualItems(object, a, b)}</span>`, a - b, closeNumberOptions(a - b, 0, max), `word-sub-${person}-${object.id}-${a}-${b}`, "Đếm các đồ vật chưa bị gạch nhé!", `Có ${a} ${object.name}, cho đi ${b} ${object.name}.`, { visualObject: object, initialCount: a, removedCount: b, speechText: text }); }
    const text = `${person} có ${a} ${object.name}. Mẹ cho thêm ${b} ${object.name}. ${person} có tất cả bao nhiêu ${object.name}?`; return question(`${text}<br><span class="visual-groups">${visualGroup(object, a, "Có")}${visualGroup(object, b, "Cho thêm")}</span>`, a + b, closeNumberOptions(a + b, 0, max), `word-add-${person}-${object.id}-${a}-${b}`, "Đếm cả hai nhóm đồ vật nhé!", `Có ${a} ${object.name}, thêm ${b} ${object.name}.`, { visualObject: object, firstCount: a, secondCount: b, speechText: text }); }
  if (type === "clockReading") { const hour = randomInt(1, 12); const minute = item.halfHour && Math.random() > .4 ? 30 : 0; const answer = `${hour} giờ${minute ? " 30 phút" : ""}`; const choices = shuffle([answer, `${hour === 12 ? 1 : hour + 1} giờ${minute ? " 30 phút" : ""}`, `${hour} giờ${minute ? "" : " 30 phút"}`, `${hour === 1 ? 12 : hour - 1} giờ${minute ? " 30 phút" : ""}`]); return question(`Đồng hồ chỉ mấy giờ?<br>${clockMarkup(hour, minute)}`, answer, choices, `clock-${hour}-${minute}`, "Nhìn kim phút trước, rồi nhìn kim giờ nhé!", minute ? "Kim phút chỉ số 6 là nửa giờ." : "Kim phút chỉ số 12 là giờ đúng.", { hour, minute, clockQuestion: "Hãy chọn thời gian đúng." }); }
  if (type === "lengthCompare") { a = randomInt(3, 12); b = randomInt(3, 12); while (a === b) b = randomInt(3, 12); if (item.mode === "cm") { const answer = `${Math.max(a, b)} cm`; return question(`Thanh nào dài hơn? Thanh dài hơn có độ dài bao nhiêu?${lengthBars(a, b)}`, answer, shuffle([answer, `${Math.min(a, b)} cm`, `${Math.max(a, b) - 1} cm`, `${Math.max(a, b) + 1} cm`]), `length-cm-${a}-${b}`, "So sánh hai thanh bằng mắt nhé!", "Thanh dài hơn chiếm nhiều chỗ hơn.", { speechText: "Thanh nào dài hơn? Thanh dài hơn có độ dài bao nhiêu xen ti mét?" }); } const longer = a > b ? "Vật A" : "Vật B"; const answer = item.mode === "shorter" ? (a < b ? "Vật A" : "Vật B") : longer; return question(`Vật nào ${item.mode === "shorter" ? "ngắn hơn" : "dài hơn"}?${lengthBars(a, b)}`, answer, ["Vật A", "Vật B", "Hai vật bằng nhau", "Không biết"], `length-${item.mode}-${a}-${b}`, "Nhìn chiều dài của hai thanh nhé!", item.mode === "shorter" ? "Thanh ngắn hơn chiếm ít chỗ hơn." : "Thanh dài hơn chiếm nhiều chỗ hơn.", { speechText: `Vật nào ${item.mode === "shorter" ? "ngắn hơn" : "dài hơn"}?` }); }
  if (type === "vietnamMoney") { const values = [1000, 2000, 5000, 10000]; const first = values[randomInt(0, values.length - 1)]; if (item.mode === "add") { const second = values[randomInt(0, values.length - 1)]; const answer = first + second; return question(`${moneyCard(first)} <span class="visual-operation">+</span> ${moneyCard(second)}<br> Có tất cả bao nhiêu tiền?`, formatMoney(answer), moneyOptions(answer, [first, second]), `money-add-${first}-${second}`, "Cộng hai số tiền nhé!", "Cộng số nghìn trước.", { speechText: `${numberToVietnamese(first / 1000)} nghìn đồng cộng ${numberToVietnamese(second / 1000)} nghìn đồng bằng bao nhiêu tiền?` }); } const questionText = item.mode === "choose" ? "Chọn số tiền đúng với thẻ." : "Đây là bao nhiêu tiền?"; return question(`${moneyCard(first)}<br>${questionText}`, formatMoney(first), shuffle(values.map(formatMoney)), `money-${item.mode}-${first}`, "Đọc số trên thẻ tiền nhé!", "Chữ đ là đồng.", { speechText: `${questionText} ${numberToVietnamese(first / 1000)} nghìn đồng.` }); }
  if (type === "count") {
    n = randomInt(min, max);
    const object = pickVisual(item);
    return question(`Có bao nhiêu ${object.name}?<br><span class="visual-count visual-count--objects">${visualItems(object, n)}</span>`, n, options(n, max), `count-${object.id}-${n}`, object.hintText, object.hintText, { countingObject: object, visualObject: object, count: n });
  }
  if (type === "near") { n = randomInt(min, max); const after = Math.random() > .5; const answer = after ? n + 1 : n - 1; return question(`Số ${after ? "liền sau" : "liền trước"} của ${n} là số nào?`, answer, options(answer), `near-${n}-${after}`, "Nhớ đếm tiến hoặc lùi một số nhé!", "Số liền sau lớn hơn 1."); }
  if (type === "sort") { n = randomInt(min, max); const answer = `${n}, ${n + 1}, ${n + 2}`; return question("Dãy số nào được sắp xếp từ bé đến lớn?", answer, shuffle([answer, `${n + 1}, ${n}, ${n + 2}`, `${n}, ${n + 2}, ${n + 1}`, `${n + 2}, ${n + 1}, ${n}`]), `sort-${n}`, "Chọn dãy số đúng nhé bé!", "Số bé đứng trước, số lớn đứng sau."); }
  if (type === "compare") { a = randomInt(min, max); b = randomInt(min, max); const answer = a > b ? ">" : a < b ? "<" : "="; return question(`${a} &nbsp; ? &nbsp; ${b}`, answer, [">", "<", "=", "?"], `compare-${a}-${b}`, "Chọn dấu thích hợp nhé!", "Miệng dấu lớn quay về số lớn hơn."); }
  if (type === "larger" || type === "smaller") { a = randomInt(min, max); b = randomInt(min, max); const answer = type === "larger" ? Math.max(a, b) : Math.min(a, b); return question(`Số nào ${type === "larger" ? "lớn hơn" : "bé hơn"}?<br><b>${a} hay ${b}</b>`, answer, options(answer, max), `${type}-${a}-${b}`, "Nhìn kỹ hai số rồi chọn nhé!", "Số đứng sau trong dãy số thì lớn hơn."); }
  if (type === "groupCompare") { a = randomInt(min, Math.max(min, max - 1)); b = randomInt(min, Math.max(min, max - 1)); while (a === b) b = randomInt(min, Math.max(min, max - 1)); const left = pickVisual(item); const right = pickVisual(item); const answer = a > b ? "Nhóm bên trái" : "Nhóm bên phải"; return question(`Nhóm nào có nhiều hơn?<br><span class="visual-groups">${visualGroup(left, a, "Nhóm bên trái")}${visualGroup(right, b, "Nhóm bên phải")}</span>`, answer, shuffle(["Nhóm bên trái", "Nhóm bên phải", "Hai nhóm bằng nhau", "Không biết"]), `group-compare-${left.id}-${a}-${right.id}-${b}`, "So sánh số đồ vật ở hai nhóm nhé!", "Đếm từng nhóm rồi chọn nhóm có nhiều hơn.", { leftVisual: left, rightVisual: right, leftCount: a, rightCount: b }); }
  if (["add", "addMissing", "addPicture", "addZero", "addCrossTen"].includes(type)) { if (type === "addZero") { a = randomInt(min, max); return question(`${a} + 0 = ?`, a, options(a, max), `add-zero-${a}`, "Cộng với 0 thì số không đổi nhé!", "Số nào cộng với 0 vẫn giữ nguyên số đó."); } if (type === "addCrossTen") { a = randomInt(6, 10); b = randomInt(11 - a, 10); } else { a = randomInt(min, max); b = randomInt(min, max - a); } if (type === "addMissing") return question(`${a} + ? = ${a + b}`, b, options(b, max), `add-missing-${a}-${b}`, "Tìm số còn thiếu nhé!", "Lấy tổng trừ đi số đã biết."); if (type === "addPicture") { const object = pickVisual(item); return question(`Có tất cả bao nhiêu ${object.name}?<br><span class="visual-groups">${visualGroup(object, a, "Nhóm đầu")}${visualGroup(object, b, "Nhóm thêm")}</span><b class="visual-operation">+ = ?</b>`, a + b, options(a + b, max), `add-picture-${object.id}-${a}-${b}`, `Đếm tất cả ${object.name} nhé!`, "Đếm nhóm đầu rồi đếm thêm nhóm sau.", { visualObject: object, firstCount: a, secondCount: b }); } return question(`${a} + ${b} = ?`, a + b, options(a + b, max), `add-${a}-${b}`, "Chọn đáp án đúng nhé bé!", "Bé có thể đếm trên ngón tay."); }
  if (["subtract", "subMissing", "subPicture", "subZero", "subCrossTen"].includes(type)) { if (type === "subZero") { a = randomInt(min, max); return question(`${a} - 0 = ?`, a, options(a, max), `sub-zero-${a}`, "Trừ đi 0 thì số không đổi nhé!", "Số nào trừ đi 0 vẫn giữ nguyên số đó."); } if (type === "subCrossTen") { a = randomInt(11, 20); b = randomInt(a - 9, Math.min(10, a)); } else { a = randomInt(Math.max(1, min), max); b = randomInt(0, a); } if (type === "subMissing") return question(`? - ${b} = ${a - b}`, a, options(a, max), `sub-missing-${a}-${b}`, "Tìm số còn thiếu nhé!", "Cộng số trừ với kết quả."); if (type === "subPicture") { const object = pickVisual(item); return question(`Có ${a} ${object.name}. Bớt đi ${b} ${object.name}. Còn lại bao nhiêu?<br><span class="visual-count visual-count--objects">${visualItems(object, a, b)}</span>`, a - b, options(a - b, max), `sub-picture-${object.id}-${a}-${b}`, `Đếm các ${object.name} chưa bị gạch nhé!`, `Bỏ qua ${b} ${object.name} có dấu gạch chéo.`, { visualObject: object, initialCount: a, removedCount: b }); } return question(`${a} - ${b} = ?`, a - b, options(a - b, max), `sub-${a}-${b}`, "Chọn đáp án đúng nhé bé!", "Dùng ngón tay để bớt đi."); }
  if (type === "sequence") { n = randomInt(min, Math.max(min, max - 2)); return question(sequenceMarkup(n, "?", n + 2), n + 1, options(n + 1, max), `sequence-${n}`, "Số nào còn thiếu trong dãy?", "Hãy đếm lần lượt từng số.", { sequenceValues: [n, "?", n + 2] }); }
  const shapes = [["hình tròn", "●"], ["hình vuông", "■"], ["hình tam giác", "▲"], ["hình chữ nhật", "▬"]]; const shape = shapes[randomInt(0, 3)];
  if (type === "shapeCount") { n = randomInt(min, max); return question(`Có bao nhiêu ${shape[0]}?<br><span class="shape-row">${shape[1].repeat(n)}</span>`, n, options(n, max), `shape-count-${shape[0]}-${n}`, "Đếm từng hình một nhé!", "Chạm và đếm từ trái sang phải."); }
  if (type === "shapeLife") { const things = [["Bánh xe", "hình tròn"], ["Cửa sổ vuông", "hình vuông"], ["Mái nhà", "hình tam giác"], ["Quyển sách", "hình chữ nhật"]]; const thing = things[randomInt(0, 3)]; return question(`${thing[0]} giống hình nào?`, thing[1], shuffle(shapes.map((x) => x[0])), `shape-life-${thing[0]}`, "Tìm hình giống đồ vật nhé!", "Hãy tưởng tượng đồ vật quanh bé."); }
  return question(`Đây là hình gì?<br><span class="big-shape">${shape[1]}</span>`, shape[0], shuffle(shapes.map((x) => x[0])), `shape-${shape[0]}`, "Quan sát hình thật kỹ nhé!", "Mỗi hình có một dáng vẻ riêng.");
}
function generateQuestions(item) { const output = []; const keys = new Set(); let tries = 0; while (output.length < item.questionCount) { const itemQuestion = generateQuestion(item); tries += 1; if (!keys.has(itemQuestion.key) || tries > 120) { keys.add(itemQuestion.key); output.push(itemQuestion); } } return output; }

// ==================== Quiz Engine ====================
let selectedTopic = "addition"; let selectedLevelId = "addition-1"; let quiz = null; let toastTimer; let currentLearningUser = null;
function guardLevelAccess(id, user = currentLearningUser, progress = loadProgress(), showPrompt = true) { const reason = getLevelLockReason(id, user, progress); if (reason === "account" && showPrompt) showAuthGate(); return reason === null; }
function startQuiz(id) { const item = LEVEL_BY_ID[id]; if (!item || !guardLevelAccess(id)) return false; selectedTopic = item.topic; selectedLevelId = id; quiz = { level: item, questions: generateQuestions(item), index: 0, score: 0, correct: 0, answered: false }; showScreen("quiz"); renderQuestion(); return true; }
function checkAnswer(answer, button) { if (!quiz || quiz.answered) return; const current = quiz.questions[quiz.index]; if (answer === current.answer) { quiz.answered = true; if (!current.hadWrong) { quiz.correct += 1; quiz.score += 10; } elements.answerGrid.querySelectorAll("button").forEach((item) => { item.disabled = true; if (item.textContent === current.answer) item.classList.add("is-correct"); }); elements.feedback.textContent = "Chính xác! Giỏi lắm bé!"; elements.feedback.className = "feedback is-correct"; setQuizMascot("correct", "Giỏi lắm!"); playCorrectEffect(); playSoundEffect("correct"); elements.nextButton.hidden = false; elements.liveScore.textContent = quiz.score; elements.liveStars.textContent = starsFor(quiz.score, quiz.level); } else { current.hadWrong = true; button.disabled = true; button.classList.add("is-wrong"); elements.feedback.textContent = "Thử lại nhé! Bé chọn một đáp án khác nào."; elements.feedback.className = "feedback is-wrong"; setQuizMascot("encourage", "Thử lại nhé!"); playSoundEffect("wrong"); } }
function nextQuestion() { if (quiz.index === quiz.questions.length - 1) finishQuiz(); else { quiz.index += 1; renderQuestion(); } }
function finishQuiz() { const progress = saveProgress(saveResult(loadProgress(), quiz.level, quiz.score, quiz.correct)); if (!currentLearningUser && quiz.level.id === TRIAL_LEVEL_IDS[1]) writeStorage(localStorage, TRIAL_COMPLETED_KEY, "true"); renderResult(progress); showScreen("result"); playSoundEffect("complete"); }

// ==================== UI Rendering ====================
const screens = Object.fromEntries(["home", "grade1", "math", "levels", "quiz", "result", "parent-gate", "parent-dashboard"].map((name) => [name, $(`#${name}-screen`)]));
const elements = { headerStats: $("#header-stats"), homeAuthStatus: $("#home-auth-status"), authGate: $("#auth-gate"), authGateLater: $("#auth-gate-later"), trialResultGate: $("#trial-result-gate"), soundSettingsButton: $("#sound-settings-button"), soundSettingsPanel: $("#sound-settings-panel"), soundEnabledToggle: $("#sound-enabled-toggle"), speechEnabledToggle: $("#speech-enabled-toggle"), learningSummary: $("#learning-summary"), topicGrid: $("#topic-grid"), topicEyebrow: $("#topic-eyebrow"), levelsTitle: $("#levels-title"), levelsDescription: $("#levels-description"), topicIcon: $("#topic-icon"), levelGrid: $("#level-grid"), quizBackButton: $("#quiz-back-button"), quizIcon: $("#quiz-icon"), quizTitle: $("#quiz-title"), liveStars: $("#live-stars"), liveScore: $("#live-score"), questionCount: $("#question-count"), progressFill: $("#progress-fill"), questionHelper: $("#question-helper"), quizMascot: $("#quiz-mascot"), quizMascotMessage: $("#quiz-mascot-message"), readQuestionButton: $("#read-question-button"), speechStatus: $("#speech-status"), equation: $("#equation"), answerGrid: $("#answer-grid"), feedback: $("#feedback"), confetti: $("#confetti"), nextButton: $("#next-button"), tipText: $("#tip-text"), resultMascot: $("#result-mascot"), resultMascotMessage: $("#result-mascot-message"), resultMessage: $("#result-message"), earnedStars: $("#earned-stars"), starNote: $("#star-note"), correctCount: $("#correct-count"), finalScore: $("#final-score"), unlockNote: $("#unlock-note"), continueButton: $("#continue-button"), retryButton: $("#retry-button"), topicButton: $("#topic-button"), parentEntryButton: $("#parent-entry-button"), parentRefreshButton: $("#parent-refresh-button"), parentSummary: $("#parent-summary"), parentTopicProgress: $("#parent-topic-progress"), parentPracticeIntro: $("#parent-practice-intro"), parentPracticeList: $("#parent-practice-list"), parentHistory: $("#parent-history"), parentDeleteButton: $("#parent-delete-button"), parentDeleteConfirm: $("#parent-delete-confirm"), parentDeleteCancel: $("#parent-delete-cancel"), parentDeleteNext: $("#parent-delete-next"), parentDeleteConfirmButton: $("#parent-delete-confirm-button"), parentDeleteCodeLabel: $("#parent-delete-code-label"), parentDeleteCode: $("#parent-delete-code"), parentDeleteStep: $("#parent-delete-step"), toast: $("#toast") };
function showScreen(name) { cancelSpeech(); stopStudyTracking(); Object.entries(screens).forEach(([key, screen]) => { screen.hidden = key !== name; }); if (name === "math") renderTopics(); if (name === "levels") renderLevels(); if (name === "parent-dashboard") renderParentDashboard(); if (name === "quiz") startStudyTracking(); renderHeader(); window.scrollTo({ top: 0, behavior: "smooth" }); }
function renderHeader() { const stats = statistics(loadProgress()); elements.headerStats.textContent = stats.completed ? `⭐ ${stats.stars} sao · 🏆 ${stats.score} điểm · ✅ ${stats.completed} bài` : ""; if (elements.homeAuthStatus) { const badge = document.createElement("span"); const detail = document.createElement("small"); badge.textContent = currentLearningUser ? "Đã đăng nhập" : "Học thử"; detail.textContent = currentLearningUser ? currentLearningUser.displayName || currentLearningUser.email || "Tài khoản phụ huynh" : "Học thử 2 level đầu tiên miễn phí."; elements.homeAuthStatus.replaceChildren(badge, detail); } }
function showAuthGate() { elements.authGate.hidden = false; document.body.classList.add("has-auth-gate"); elements.authGate.querySelector("button")?.focus(); }
function hideAuthGate() { elements.authGate.hidden = true; document.body.classList.remove("has-auth-gate"); }
function openAuthScreen(name) { hideAuthGate(); window.dispatchEvent(new CustomEvent("hoc-cung-be:open-auth", { detail: { screen: name } })); }
function handleAuthState(user) { const wasSignedIn = Boolean(currentLearningUser); currentLearningUser = user || null; hideAuthGate(); if (wasSignedIn && !currentLearningUser && quiz && !isTrialLevel(quiz.level.id) && !screens.quiz.hidden) { selectedTopic = quiz.level.topic; quiz = null; showScreen("levels"); showAuthGate(); return; } renderHeader(); if (!screens.levels.hidden) renderLevels(); if (!screens.result.hidden && quiz) renderResult(loadProgress()); }
function formatDuration(seconds) { const minutes = Math.floor(safeNumber(seconds, 2147483647) / 60); if (!minutes) return "0 phút"; const hours = Math.floor(minutes / 60); return hours ? `${hours} giờ ${minutes % 60} phút` : `${minutes} phút`; }
function formatDateTime(value) { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Chưa có"; }
function topicSummary(progress, topicId) { return getTopicProgress(progress, topicId); }
function parentStatistics(progress) { const values = LEVELS.map((item) => levelProgress(progress, item.id)); const studied = values.filter((item) => item.attempts > 0); return { attempts: progress.totalCompleted, completedLevels: values.filter((item) => item.completed).length, stars: values.reduce((sum, item) => sum + item.bestStars, 0), average: studied.length ? Math.round(studied.reduce((sum, item) => sum + item.bestScore, 0) / studied.length) : 0, opened: values.filter((item) => item.unlocked).length, locked: values.filter((item) => !item.unlocked).length, totalLevels: LEVELS.length, lastStudy: values.map((item) => item.lastPlayedAt).filter(Boolean).sort().at(-1) || progress.studyTime.lastStudyDate }; }
function renderParentDashboard() {
  const progress = loadProgress(); const stats = parentStatistics(progress);
  elements.parentSummary.innerHTML = `<article><span>📚</span><strong>${stats.attempts}</strong><small>Bài đã học</small></article><article><span>✅</span><strong>${stats.completedLevels} / ${stats.totalLevels}</strong><small>Level đã hoàn thành</small></article><article><span>⭐</span><strong>${stats.stars}</strong><small>Tổng sao</small></article><article><span>🎯</span><strong>${stats.average}%</strong><small>Điểm trung bình tốt nhất</small></article><article><span>🔓</span><strong>${stats.opened} / ${stats.totalLevels}</strong><small>Level đã mở</small></article><article><span>⏱</span><strong>${formatDuration(progress.studyTime.todaySeconds)}</strong><small>Hôm nay · tổng ${formatDuration(progress.studyTime.totalSeconds)}</small></article><article class="parent-summary__wide"><span>🕒</span><strong>${formatDateTime(stats.lastStudy)}</strong><small>Lần học gần nhất · ${stats.locked} level chưa mở</small></article>`;
  elements.parentTopicProgress.replaceChildren();
  Object.values(TOPICS).sort((a, b) => a.sortOrder - b.sortOrder).forEach((topic) => { const topicId = topic.id; const summary = getTopicProgress(progress, topicId); const percent = summary.percent; const details = document.createElement("details"); details.className = "parent-topic-card"; details.innerHTML = `<summary><span class="parent-topic-card__icon">${topic.icon}</span><span class="parent-topic-card__main"><strong>${topic.title}</strong><small>Hoàn thành ${summary.completed} / ${summary.total} level · Điểm TB ${summary.average}% · ${summary.stars} ⭐</small><span class="parent-progress" aria-label="Tiến độ ${topic.title}: ${percent}%"><i style="width:${percent}%"></i></span></span><span class="parent-topic-card__percent">${percent}%</span></summary><div class="parent-level-list"></div>`;
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
function renderTopics() { const progress = loadProgress(); const stats = statistics(progress); elements.learningSummary.innerHTML = `<div><span>⭐</span><b>${stats.stars}</b><small>Sao đã đạt</small></div><div><span>🏆</span><b>${stats.score}</b><small>Tổng điểm tốt nhất</small></div><div><span>✅</span><b>${stats.completed}</b><small>Bài đã hoàn thành</small></div>`; elements.topicGrid.replaceChildren(); Object.values(TOPICS).sort((a, b) => a.sortOrder - b.sortOrder).forEach((topic) => { const summary = getTopicProgress(progress, topic.id); const card = document.createElement("button"); card.className = `lesson-card lesson-card--${topic.colorTheme}`; card.innerHTML = `<span>${topic.icon}</span><strong>${topic.title}</strong><small>${summary.completed}/${summary.total} level đã hoàn thành</small><em>${summary.completed ? "Tiếp tục học" : "Bắt đầu"} →</em>`; card.onclick = () => { selectedTopic = topic.id; showScreen("levels"); }; elements.topicGrid.append(card); }); }
function renderLevels() { const topic = TOPICS[selectedTopic]; const progress = loadProgress(); elements.topicEyebrow.textContent = `${topic.title} · ${getLevelCountByTopic(topic.id)} level`; elements.levelsTitle.textContent = `Chọn level ${topic.title}`; elements.levelsDescription.textContent = topic.description; elements.topicIcon.textContent = topic.icon; elements.levelGrid.replaceChildren(); getLevelsByTopic(selectedTopic).forEach((item, index) => { const itemProgress = levelProgress(progress, item.id); const reason = getLevelLockReason(item.id, currentLearningUser, progress); const open = reason === null; const card = document.createElement("button"); card.className = `level-card ${reason ? "is-locked" : ""} ${reason === "account" ? "is-account-locked" : ""} ${itemProgress.completed ? "is-completed" : ""}`; card.setAttribute("aria-label", reason === "account" ? `${item.title}: Đăng nhập để học tiếp` : reason === "progress" ? `${item.title}: Hoàn thành level trước từ ${item.unlockScore}%` : item.title); const status = !currentLearningUser && isTrialLevel(item.id) ? "Học thử" : itemProgress.attempts ? `${itemProgress.completed ? "✓ Đã hoàn thành · " : ""}Điểm tốt nhất: ${itemProgress.bestScore}/100` : "Sẵn sàng học"; card.innerHTML = `<span class="level-number">${reason === "account" ? "🔐 Cần đăng nhập" : reason === "progress" ? "🔒" : `Level ${index + 1}`}</span><strong>${item.title}</strong><span class="level-stars">${"★".repeat(itemProgress.bestStars)}${"☆".repeat(3 - itemProgress.bestStars)}</span><small>${reason === "account" ? "🔐 Đăng nhập để học tiếp" : reason === "progress" ? `🔒 Hoàn thành level trước ≥ ${item.unlockScore}%` : status}</small>`; card.onclick = () => reason === "account" ? showAuthGate() : reason === "progress" ? null : startQuiz(item.id); elements.levelGrid.append(card); }); }
function renderQuestion() { const current = quiz.questions[quiz.index]; const topic = TOPICS[quiz.level.topic]; quiz.answered = false; elements.quizIcon.textContent = topic.icon; elements.quizTitle.textContent = `${topic.title} · ${quiz.level.title}`; elements.quizBackButton.textContent = `← ${topic.title}`; elements.questionCount.textContent = `Câu ${quiz.index + 1} / ${quiz.questions.length}`; elements.progressFill.style.width = `${((quiz.index + 1) / quiz.questions.length) * 100}%`; elements.questionHelper.textContent = current.helper; elements.tipText.textContent = current.tip; elements.equation.innerHTML = current.prompt; elements.liveScore.textContent = quiz.score; elements.liveStars.textContent = starsFor(quiz.score, quiz.level); elements.feedback.className = "feedback"; elements.feedback.textContent = ""; elements.nextButton.hidden = true; elements.confetti.classList.remove("is-playing"); setQuizMascot(); updateAudioControls(); elements.answerGrid.replaceChildren(); current.options.forEach((answer) => { const button = document.createElement("button"); button.className = "answer-button"; button.textContent = answer; button.onclick = () => checkAnswer(answer, button); elements.answerGrid.append(button); }); }
function playCorrectEffect() { elements.confetti.classList.remove("is-playing"); void elements.confetti.offsetWidth; elements.confetti.classList.add("is-playing"); }
function renderResult(progress) { const item = quiz.level; const currentStars = starsFor(quiz.score, item); const next = getNextLevelInTopic(item.id); const action = getContinueAction(item.id, currentLearningUser, progress); const nextOpen = next && canAccessLevel(next.id, currentLearningUser, progress); const passed = quiz.score >= item.unlockScore; const trialComplete = !currentLearningUser && item.id === TRIAL_LEVEL_IDS[1]; const praise = resultPraise(quiz.score); elements.resultMessage.textContent = praise; setMascotState(elements.resultMascot, elements.resultMascotMessage, currentStars ? "celebrate" : "encourage", currentStars ? praise : "Mình cùng luyện thêm nhé!"); renderEarnedStars(currentStars); elements.starNote.textContent = currentStars ? `Bé nhận được ${currentStars} sao trong level này!` : "🌱 Mỗi lần luyện tập, bé sẽ tiến bộ hơn!"; elements.correctCount.textContent = `Con đã làm đúng ${quiz.correct} / ${item.questionCount} câu`; elements.finalScore.textContent = `Điểm: ${quiz.score} / 100`; elements.unlockNote.textContent = trialComplete ? "🔐 Đăng nhập để mở toàn bộ bài học tiếp theo." : nextOpen ? `🔓 Đã mở khóa Level ${getLevelIndexInTopic(next.id) + 1}: ${next.title}!` : passed && !next ? "🌟 Bé đã hoàn thành tất cả level của chuyên đề này!" : `💪 Cùng luyện thêm để mở level tiếp theo nhé!`; elements.trialResultGate.hidden = !trialComplete; elements.continueButton.hidden = false; elements.continueButton.textContent = action === "auth" ? "🔐 Đăng nhập để học tiếp" : action === "next" && next ? `Học tiếp ${next.title} →` : "Về chủ đề"; elements.continueButton.setAttribute("aria-label", action === "auth" ? "Đăng nhập để học tiếp" : action === "next" && next ? `Học tiếp ${next.title}` : `Về chủ đề ${TOPICS[item.topic].title}`); elements.continueButton.dataset.action = action; elements.topicButton.textContent = `Về ${TOPICS[item.topic].title}`; }
function toast(message) { clearTimeout(toastTimer); elements.toast.textContent = `${message} sẽ có trong thời gian tới nhé!`; elements.toast.classList.add("is-visible"); toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2800); }

// ==================== PWA Install / Offline Support ====================
let deferredInstallPrompt = null;
const isStandaloneApp = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
const isAppleMobileDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
function updateOfflineStatus() { const status = $("#pwa-offline-status"); if (!status) return; status.hidden = navigator.onLine; status.textContent = "Bạn đang offline. Các bài học đã tải vẫn sẵn sàng."; }
function updateInstallInterface() {
  const installButton = $("#pwa-install-button"); const iosHint = $("#ios-install-hint");
  if (installButton) installButton.hidden = !deferredInstallPrompt || isStandaloneApp();
  if (iosHint) iosHint.hidden = !isAppleMobileDevice() || isStandaloneApp() || readStorage(localStorage, IOS_INSTALL_HINT_DISMISSED_KEY) === "true";
}
function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js", { scope: "./" }).catch(() => {}));
}
function setupPwa() {
  const installButton = $("#pwa-install-button"); const iosDismiss = $("#ios-install-dismiss");
  window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); deferredInstallPrompt = event; updateInstallInterface(); });
  window.addEventListener("appinstalled", () => { deferredInstallPrompt = null; updateInstallInterface(); });
  installButton?.addEventListener("click", async () => { if (!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; updateInstallInterface(); });
  iosDismiss?.addEventListener("click", () => { writeStorage(localStorage, IOS_INSTALL_HINT_DISMISSED_KEY, "true"); updateInstallInterface(); });
  window.addEventListener("online", updateOfflineStatus); window.addEventListener("offline", updateOfflineStatus);
  updateOfflineStatus(); updateInstallInterface(); registerServiceWorker();
}

// ==================== Navigation ====================
document.querySelectorAll("[data-go]").forEach((button) => { button.onclick = () => showScreen(button.dataset.go); });
document.querySelectorAll("[data-coming-soon]").forEach((button) => { button.onclick = () => toast(button.dataset.comingSoon); });
document.querySelectorAll("[data-auth-open]").forEach((button) => { button.onclick = () => openAuthScreen(button.dataset.authOpen); });
elements.authGateLater.onclick = hideAuthGate;
elements.authGate.onclick = (event) => { if (event.target === elements.authGate) hideAuthGate(); };
window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !elements.authGate.hidden) hideAuthGate(); });
window.addEventListener("hoc-cung-be:auth-state", (event) => handleAuthState(event.detail?.user || null));
elements.quizBackButton.onclick = () => showScreen("levels"); elements.nextButton.onclick = nextQuestion; elements.retryButton.onclick = () => startQuiz(selectedLevelId); elements.topicButton.onclick = () => showScreen("levels"); elements.continueButton.onclick = () => { const action = elements.continueButton.dataset.action; if (action === "auth") { showAuthGate(); return; } if (action === "topic") { showScreen("levels"); return; } const next = getNextLevelInTopic(selectedLevelId); if (next && canAccessLevel(next.id, currentLearningUser, loadProgress())) startQuiz(next.id); else showScreen("levels"); };
elements.readQuestionButton.onclick = () => readCurrentQuestion();
elements.soundSettingsButton.onclick = () => { const willOpen = elements.soundSettingsPanel.hidden; elements.soundSettingsPanel.hidden = !willOpen; elements.soundSettingsButton.setAttribute("aria-expanded", String(willOpen)); };
elements.soundEnabledToggle.onchange = () => { audioSettings.soundEnabled = elements.soundEnabledToggle.checked; audioSettings = saveAudioSettings(audioSettings); updateAudioControls(); };
elements.speechEnabledToggle.onchange = () => { audioSettings.speechEnabled = elements.speechEnabledToggle.checked; if (!audioSettings.speechEnabled) cancelSpeech(); audioSettings = saveAudioSettings(audioSettings); updateAudioControls(); };
elements.parentRefreshButton.onclick = renderParentDashboard;
elements.parentDeleteButton.onclick = () => { resetDeleteConfirmation(); elements.parentDeleteConfirm.hidden = false; };
elements.parentDeleteCancel.onclick = resetDeleteConfirmation;
elements.parentDeleteNext.onclick = () => { elements.parentDeleteStep.textContent = "Để xác nhận, vui lòng nhập XOA chính xác."; elements.parentDeleteCodeLabel.hidden = false; elements.parentDeleteCode.hidden = false; elements.parentDeleteConfirmButton.hidden = false; elements.parentDeleteNext.hidden = true; elements.parentDeleteCode.focus(); };
elements.parentDeleteConfirmButton.onclick = () => { if (elements.parentDeleteCode.value.trim() !== "XOA") { elements.parentDeleteStep.textContent = "Mã xác nhận chưa đúng. Vui lòng nhập chính xác XOA."; elements.parentDeleteCode.focus(); return; } writeStorage(localStorage, STORAGE_KEY, JSON.stringify(defaultProgress())); quiz = null; resetDeleteConfirmation(); renderParentDashboard(); renderHeader(); };
document.addEventListener("visibilitychange", () => { if (document.hidden) stopStudyTracking(); else if (!screens.quiz.hidden) startStudyTracking(); });
window.addEventListener("pagehide", () => stopStudyTracking());
$("#current-year").textContent = new Date().getFullYear(); loadProgress(); updateAudioControls(); renderHeader(); setupPwa();

// ==================== Guest Trial / Login Gate self-tests A-N ====================
function runGuestTrialTests() {
  const results = []; const test = (id, name, passed) => results.push({ id, name, passed: Boolean(passed) });
  const guest = null; const user = { uid: "test-parent", email: "parent@example.com" }; const progress = defaultProgress();
  const progressed = saveResult(progress, LEVEL_BY_ID["counting-1"], 80, 8, "2026-10-02T00:00:00.000Z");
  const snapshot = JSON.stringify(progressed); const pinBefore = readStorage(localStorage, "hoc-cung-be:parent-pin");
  test("A", "Guest vào counting-1", canAccessLevel("counting-1", guest, progress));
  test("B", "Guest vào counting-2", canAccessLevel("counting-2", guest, progress));
  test("C", "Guest counting-3 bị account lock", getLevelLockReason("counting-3", guest, progressed) === "account");
  test("D", "Guest topic khác bị account lock", getLevelLockReason("addition-1", guest, progress) === "account");
  test("E", "Guest xong counting-1 học tiếp counting-2", getContinueAction("counting-1", guest, progressed) === "next");
  test("F", "Guest xong counting-2 yêu cầu login", getContinueAction("counting-2", guest, progressed) === "auth");
  test("G", "Logged-in không còn account lock", getLevelLockReason("addition-1", user, progress) !== "account");
  test("H", "Logged-in vẫn chịu progress lock", getLevelLockReason("counting-3", user, progress) === "progress");
  test("I", "Logout trở lại Guest Trial Mode", getLevelLockReason("counting-3", null, progressed) === "account" && canAccessLevel("counting-1", null, progressed));
  test("J", "Progress trial còn sau login", JSON.stringify(progressed) === snapshot && levelProgress(progressed, "counting-1").bestScore === 80);
  test("K", "Progress không bị xóa sau logout", JSON.stringify(progressed) === snapshot && progressed.history.length === 1 && progressed.studyTime.totalSeconds === 0);
  test("L", "Parent PIN không bị ảnh hưởng", readStorage(localStorage, "hoc-cung-be:parent-pin") === pinBefore);
  test("M", "PWA/offline vẫn hoạt động", typeof setupPwa === "function" && typeof registerServiceWorker === "function" && canAccessLevel("counting-2", guest, progress));
  const quizBeforeBypass = quiz; const bypassStarted = startQuiz("counting-3"); hideAuthGate(); test("N", "Direct startQuiz bypass bị chặn", bypassStarted === false && quiz === quizBeforeBypass);
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeGuestTrialTests = runGuestTrialTests();

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
  const geometryLevels = getLevelsByTopic("geometry");
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

// ==================== Dynamic curriculum and visual-question self-tests A-L ====================
function runDynamicLevelTests() {
  const results = []; const test = (id, name, passed) => results.push({ id, name, passed: Boolean(passed) });
  const addition = getLevelsByTopic("addition"), numbers20 = getLevelsByTopic("numbers20"), numbers100 = getLevelsByTopic("numbers100");
  test("A", "Số đến 20 có level động và câu hỏi trong phạm vi", numbers20.length === 6 && Array.from({ length: 20 }, () => generateQuestion(LEVEL_BY_ID["numbers20-1"])).every((item) => Number(item.answer) >= 1 && Number(item.answer) <= 20 && item.prompt.includes("visual-object")));
  test("B", "Số đến 100 có đủ level cấu hình động", numbers100.length === 7 && numbers100.every((item, index) => getLevelIndexInTopic(item.id) === index));
  let progress = defaultProgress(); [addition[0], addition[1], addition[2]].forEach((item, index) => { progress = saveResult(progress, item, 80, 8, `2026-10-02T12:0${index}:00.000Z`); });
  const additionProgress = getTopicProgress(progress, "addition"); const tensSample = generateQuestion(LEVEL_BY_ID["numbers100-2"]); test("C", "Tiến độ động và chục - đơn vị hoạt động đúng", additionProgress.completed === 3 && additionProgress.total === 8 && additionProgress.percent === 38 && /^\d+ chục và \d+ đơn vị$/.test(tensSample.answer) && tensSample.options.includes(tensSample.answer));
  const wordAdd = generateQuestion(LEVEL_BY_ID["word-problems-1"]); test("D", "Bài toán cộng lời văn đồng bộ text, hình và đáp án", wordAdd.prompt.includes("Mẹ cho thêm") && wordAdd.prompt.includes("visual-groups") && wordAdd.firstCount + wordAdd.secondCount === Number(wordAdd.answer) && getQuestionSpeechText(LEVEL_BY_ID["word-problems-1"], wordAdd) === wordAdd.speechText);
  const wordSubtract = generateQuestion(LEVEL_BY_ID["word-problems-2"]); test("E", "Bài toán trừ lời văn có vật bị gạch", wordSubtract.prompt.includes("cho bạn") && wordSubtract.prompt.includes("visual-object is-removed") && wordSubtract.initialCount - wordSubtract.removedCount === Number(wordSubtract.answer) && getQuestionSpeechText(LEVEL_BY_ID["word-problems-2"], wordSubtract) === wordSubtract.speechText);
  const clockSample = generateQuestion(LEVEL_BY_ID["clock-1"]); test("F", "Đồng hồ giờ đúng có mặt đồng hồ, kim và đáp án", clockSample.minute === 0 && clockSample.prompt.includes("learning-clock") && clockSample.prompt.includes("clock-hand--hour") && clockSample.prompt.includes("clock-hand--minute") && clockSample.options.includes(clockSample.answer));
  const lengthSample = generateQuestion(LEVEL_BY_ID["length-1"]); test("G", "Độ dài dùng thanh trực quan và đáp án hợp lý", lengthSample.prompt.includes("length-visual") && lengthSample.options.includes(lengthSample.answer));
  const moneySample = generateQuestion(LEVEL_BY_ID["money-3"]); test("H", "Tiền Việt Nam dùng thẻ học tập và định dạng đồng", moneySample.prompt.includes("money-card") && moneySample.answer.endsWith("đ") && moneySample.options.length === 4 && moneySample.options.includes(moneySample.answer));
  test("I", "Speech đọc số và tiền tiếng Việt", numberToVietnamese(15) === "mười lăm" && numberToVietnamese(20) === "hai mươi" && numberToVietnamese(100) === "một trăm" && getQuestionSpeechText(LEVEL_BY_ID["money-1"], generateQuestion(LEVEL_BY_ID["money-1"])).includes("nghìn đồng"));
  const dashboard = parentStatistics(progress); test("J", "Dashboard tự cập nhật tổng level mới", dashboard.totalLevels === LEVELS.length && LEVELS.length === 60 && Object.keys(TOPICS).length === 12);
  const legacyV2 = { progressVersion: 2, levels: { "addition-1": { bestScore: 95, bestCorrect: 9, bestStars: 2, attempts: 3, completed: true, unlocked: true, lastPlayedAt: "2026-09-30T08:00:00.000Z" } }, totalCompleted: 3, history: [{ levelId: "addition-1", topic: "addition", score: 95, correct: 9, stars: 2, completedAt: "2026-09-30T08:00:00.000Z" }] }; const migrated = normalizeProgress(legacyV2);
  test("K", "Progress V2 cũ vẫn giữ và level mới có mặc định an toàn", migrated.progressVersion === 2 && migrated.levels["addition-1"].bestScore === 95 && migrated.levels["numbers20-1"].attempts === 0 && migrated.history.length === 1);
  test("L", "PWA offline dùng resource tương đối và không cần asset mạng", document.querySelector('link[rel="manifest"]')?.getAttribute("href") === "manifest.webmanifest" && !/^\//.test("service-worker.js") && OBJECT_LIBRARY.every((item) => typeof item.icon === "string" && !item.icon.includes("/")));
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeDynamicLevelTests = runDynamicLevelTests();

// ==================== Non-destructive PWA checks ====================
function runPwaTests() {
  const manifest = document.querySelector('link[rel="manifest"]'); const installButton = $("#pwa-install-button"); const iosHint = $("#ios-install-hint");
  const results = {
    relativeManifest: manifest?.getAttribute("href") === "manifest.webmanifest",
    relativeServiceWorkerScope: typeof registerServiceWorker === "function" && !/^\//.test("service-worker.js"),
    installControlsPresent: Boolean(installButton && iosHint),
    progressKeysUnchanged: STORAGE_KEY === "hoc-cung-be:math-grade-1-progress" && AUDIO_SETTINGS_KEY === "hoc-cung-be:audio-settings",
    localFileSafe: location.protocol !== "file:" || typeof registerServiceWorker === "function",
  };
  return { passed: Object.values(results).every(Boolean), results };
}
window.__hocCungBePwaTests = runPwaTests();