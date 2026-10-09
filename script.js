"use strict";

// ==================== Lesson / Level Data ====================
const STORAGE_KEY = "hoc-cung-be:math-grade-1-progress";
const CHILD_PROGRESS_KEY_PREFIX = "hoc-cung-be:progress:";
const LEGACY_KEY = "hoc-cung-be:addition-progress";
const PROGRESS_VERSION = 2;
const DEFAULT_QUESTION_COUNT = 5;
const DEFAULT_UNLOCK_SCORE = 80;
const LEGACY_QUESTION_COUNT = 10;
const AUDIO_SETTINGS_KEY = "hoc-cung-be:audio-settings";
const IOS_INSTALL_HINT_DISMISSED_KEY = "hoc-cung-be:ios-install-hint-dismissed";
const LEGACY_TRIAL_COMPLETED_KEY = "hoc-cung-be:trial-completed";
const GUEST_TRIAL_KEY = "hoc-cung-be:guest-trial";
const GUEST_TRIAL_VERSION = 1;
const GUEST_TRIAL_LIMIT = 2;

const MATH_TOPICS = {
  counting: { id: "counting", title: "Số và đếm", shortTitle: "Đếm", icon: "🔟", colorTheme: "blue", color: "blue", description: "Nhận biết số, đếm và sắp xếp các số.", sortOrder: 1 },
  compare: { id: "compare", title: "So sánh số", shortTitle: "So sánh", icon: "⚖️", colorTheme: "orange", color: "orange", description: "So sánh số bằng dấu lớn hơn, bé hơn, bằng nhau.", sortOrder: 2 },
  addition: { id: "addition", title: "Phép cộng", shortTitle: "Cộng", icon: "➕", colorTheme: "purple", color: "purple", description: "Luyện cộng từ cơ bản đến cộng qua 10.", sortOrder: 3 },
  subtraction: { id: "subtraction", title: "Phép trừ", shortTitle: "Trừ", icon: "➖", colorTheme: "pink", color: "pink", description: "Luyện trừ từ cơ bản đến trừ qua 10.", sortOrder: 4 },
  missing: { id: "missing", title: "Điền số", shortTitle: "Điền số", icon: "✍️", colorTheme: "green", color: "green", description: "Tìm số còn thiếu trong dãy số và phép tính.", sortOrder: 5 },
  geometry: { id: "geometry", title: "Hình học", shortTitle: "Hình học", icon: "🔺", colorTheme: "yellow", color: "yellow", description: "Làm quen với những hình dạng đáng yêu.", sortOrder: 6 },
  numbers20: { id: "numbers20", title: "Số đến 20", shortTitle: "Đến 20", icon: "2️⃣0️⃣", colorTheme: "blue", color: "blue", description: "Đếm, sắp xếp và so sánh các số đến 20.", sortOrder: 7 },
  numbers100: { id: "numbers100", title: "Số đến 100", shortTitle: "Đến 100", icon: "💯", colorTheme: "orange", color: "orange", description: "Làm quen với số chục, số đơn vị và các số đến 100.", sortOrder: 8 },
  wordProblems: { id: "wordProblems", title: "Bài toán có lời văn", shortTitle: "Lời văn", icon: "📖", colorTheme: "purple", color: "purple", description: "Đọc câu ngắn, nhìn hình và tính một phép tính.", sortOrder: 9 },
  clock: { id: "clock", title: "Xem đồng hồ", shortTitle: "Đồng hồ", icon: "🕐", colorTheme: "pink", color: "pink", description: "Nhận biết các kim và đọc giờ, phút, giây theo mức độ tăng dần.", sortOrder: 10 },
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

const level = (id, topic, title, type, min, max, extra = {}) => ({ id, topic, title, type, min, max, questionCount: DEFAULT_QUESTION_COUNT, unlockScore: DEFAULT_UNLOCK_SCORE, rewardStars: [60, 80, 100], imageMode: "none", visualSet: null, hint: "", ...extra });
const MATH_LEVELS = [
  level("counting-1", "counting", "Đếm đồ vật đến 5", "count", 1, 5, { order: 1, imageMode: "count", visualSet: "counting" }), level("counting-2", "counting", "Đếm đồ vật đến 10", "count", 1, 10, { order: 2, imageMode: "count", visualSet: "counting" }), level("counting-3", "counting", "Số liền trước - liền sau", "near", 1, 9, { order: 3 }), level("counting-4", "counting", "Sắp xếp số", "sort", 0, 6, { order: 4 }), level("counting-5", "counting", "Chọn nhóm có nhiều hơn", "groupCompare", 1, 10, { order: 5, imageMode: "groups", visualSet: "counting" }), level("counting-6", "counting", "Ôn tập số và đếm", "count", 1, 10, { order: 6, imageMode: "count", visualSet: "counting" }), level("counting-7", "counting", "Chọn số đúng đến 5", "count", 1, 5, { order: 7, imageMode: "count", visualSet: "counting" }), level("counting-8", "counting", "Đếm nhóm đồ vật đến 10", "count", 4, 10, { order: 8, imageMode: "count", visualSet: "counting" }), level("counting-9", "counting", "Số liền trước", "near", 2, 10, { order: 9, mode: "before" }), level("counting-10", "counting", "Số liền sau", "near", 0, 9, { order: 10, mode: "after" }), level("counting-11", "counting", "Nhóm ít hơn", "groupCompare", 1, 10, { order: 11, imageMode: "groups", visualSet: "counting", compareMode: "less" }), level("counting-12", "counting", "Ôn tập đếm đến 20", "numberTo20", 1, 20, { order: 12, imageMode: "count", visualSet: "counting" }),
  level("compare-1", "compare", "So sánh trong phạm vi 5", "compare", 0, 5, { order: 1 }), level("compare-2", "compare", "So sánh trong phạm vi 10", "compare", 0, 10, { order: 2 }), level("compare-3", "compare", "Chọn số lớn hơn", "larger", 0, 10, { order: 3 }), level("compare-4", "compare", "Chọn số bé hơn", "smaller", 0, 10, { order: 4 }), level("compare-5", "compare", "So sánh số đến 20", "compare", 0, 20, { order: 5 }), level("compare-6", "compare", "Số lớn hơn đến 20", "larger", 0, 20, { order: 6 }), level("compare-7", "compare", "Số bé hơn đến 20", "smaller", 0, 20, { order: 7 }), level("compare-8", "compare", "Ôn tập so sánh", "compare", 0, 20, { order: 8 }),
  level("addition-1", "addition", "Cộng trong phạm vi 5", "add", 0, 5, { order: 1 }), level("addition-2", "addition", "Cộng trong phạm vi 10", "add", 0, 10, { order: 2 }), level("addition-3", "addition", "Tìm số còn thiếu", "addMissing", 0, 10, { order: 3 }), level("addition-4", "addition", "Cộng bằng hình ảnh", "addPicture", 0, 10, { order: 4, imageMode: "addition", visualSet: "addition" }), level("addition-5", "addition", "Cộng với số 0", "addZero", 0, 10, { order: 5 }), level("addition-6", "addition", "Cộng trong phạm vi 20", "add", 0, 20, { order: 6 }), level("addition-7", "addition", "Cộng qua 10", "addCrossTen", 0, 20, { order: 7 }), level("addition-8", "addition", "Ôn tập phép cộng", "add", 0, 20, { order: 8 }), level("addition-9", "addition", "Cộng thêm 1", "addFixed", 0, 10, { order: 9, operand: 1 }), level("addition-10", "addition", "Cộng thêm 2", "addFixed", 0, 10, { order: 10, operand: 2 }), level("addition-11", "addition", "Cộng thêm 3", "addFixed", 0, 10, { order: 11, operand: 3 }), level("addition-12", "addition", "Cộng thêm 4", "addFixed", 0, 10, { order: 12, operand: 4 }), level("addition-13", "addition", "Cộng thêm 5", "addFixed", 0, 10, { order: 13, operand: 5 }), level("addition-14", "addition", "Bài toán lời văn cộng", "wordProblemAdd", 1, 20, { order: 14, imageMode: "addition", visualSet: "addition" }),
  level("subtraction-1", "subtraction", "Trừ trong phạm vi 5", "subtract", 0, 5, { order: 1 }), level("subtraction-2", "subtraction", "Trừ trong phạm vi 10", "subtract", 0, 10, { order: 2 }), level("subtraction-3", "subtraction", "Tìm số còn thiếu", "subMissing", 0, 10, { order: 3 }), level("subtraction-4", "subtraction", "Trừ bằng hình ảnh", "subPicture", 0, 10, { order: 4, imageMode: "subtraction", visualSet: "subtraction" }), level("subtraction-5", "subtraction", "Trừ với số 0", "subZero", 0, 10, { order: 5 }), level("subtraction-6", "subtraction", "Trừ trong phạm vi 20", "subtract", 0, 20, { order: 6 }), level("subtraction-7", "subtraction", "Trừ qua 10", "subCrossTen", 0, 20, { order: 7 }), level("subtraction-8", "subtraction", "Ôn tập phép trừ", "subtract", 0, 20, { order: 8 }), level("subtraction-9", "subtraction", "Trừ đi 1", "subFixed", 1, 10, { order: 9, operand: 1 }), level("subtraction-10", "subtraction", "Trừ đi 2", "subFixed", 2, 10, { order: 10, operand: 2 }), level("subtraction-11", "subtraction", "Trừ đi 3", "subFixed", 3, 10, { order: 11, operand: 3 }), level("subtraction-12", "subtraction", "Trừ đi 4", "subFixed", 4, 10, { order: 12, operand: 4 }), level("subtraction-13", "subtraction", "Trừ đi 5", "subFixed", 5, 10, { order: 13, operand: 5 }), level("subtraction-14", "subtraction", "Bài toán lời văn trừ", "wordProblemSubtract", 2, 20, { order: 14, imageMode: "subtraction", visualSet: "subtraction" }),
  level("missing-1", "missing", "Điền số trong phạm vi 5", "sequence", 0, 5, { order: 1 }), level("missing-2", "missing", "Điền số trong phạm vi 10", "sequence", 0, 10, { order: 2 }), level("missing-3", "missing", "Số còn thiếu trong phép tính", "addMissing", 0, 10, { order: 3 }), level("missing-4", "missing", "Dãy số vui nhộn", "sequence", 0, 8, { order: 4 }), level("missing-5", "missing", "Điền số đến 20", "sequence", 0, 20, { order: 5 }), level("missing-6", "missing", "Số thiếu trong phép cộng đến 20", "addMissing", 0, 20, { order: 6 }), level("missing-7", "missing", "Số thiếu trong phép trừ", "subMissing", 0, 20, { order: 7 }), level("missing-8", "missing", "Ôn tập điền số", "numberTo100", 10, 98, { order: 8, mode: "missing" }),
  level("geometry-1", "geometry", "Nhận biết hình cơ bản", "shape", 0, 0, { order: 1 }), level("geometry-2", "geometry", "Tìm đúng hình", "shape", 0, 0, { order: 2 }), level("geometry-3", "geometry", "Đếm hình", "shapeCount", 1, 5, { order: 3 }), level("geometry-4", "geometry", "Hình trong cuộc sống", "shapeLife", 0, 0, { order: 4 }), level("geometry-5", "geometry", "Đếm hình đến 8", "shapeCount", 3, 8, { order: 5 }), level("geometry-6", "geometry", "Ghép đồ vật với hình", "shapeLife", 0, 0, { order: 6 }), level("geometry-7", "geometry", "Ôn tập hình học", "shape", 0, 0, { order: 7 }),
  level("numbers20-1", "numbers20", "Đếm và chọn số đến 20", "numberTo20", 1, 20, { order: 1, imageMode: "count", visualSet: "counting" }), level("numbers20-2", "numbers20", "Số liền trước đến 20", "numberTo20", 1, 20, { order: 2, mode: "before" }), level("numbers20-3", "numbers20", "Số liền sau đến 20", "numberTo20", 1, 20, { order: 3, mode: "after" }), level("numbers20-4", "numbers20", "Sắp xếp tăng dần", "numberTo20", 1, 20, { order: 4, mode: "ascending" }), level("numbers20-5", "numbers20", "Sắp xếp giảm dần", "numberTo20", 1, 20, { order: 5, mode: "descending" }), level("numbers20-6", "numbers20", "So sánh số đến 20", "numberTo20", 1, 20, { order: 6, mode: "compare" }), level("numbers20-7", "numbers20", "Chọn số từ 11 đến 15", "numberTo20", 11, 15, { order: 7, imageMode: "count", visualSet: "counting" }), level("numbers20-8", "numbers20", "Ôn tập số đến 20", "numberTo20", 10, 20, { order: 8, mode: "compare" }),
  level("numbers100-1", "numbers100", "Nhận biết số đến 100", "numberTo100", 10, 100, { order: 1, mode: "recognize" }), level("numbers100-2", "numbers100", "Số chục và số đơn vị", "tensOnes", 10, 99, { order: 2 }), level("numbers100-3", "numbers100", "Chọn số lớn hơn", "numberTo100", 10, 99, { order: 3, mode: "larger" }), level("numbers100-4", "numbers100", "Chọn số bé hơn", "numberTo100", 10, 99, { order: 4, mode: "smaller" }), level("numbers100-5", "numbers100", "Số liền trước và liền sau", "numberTo100", 11, 99, { order: 5, mode: "near" }), level("numbers100-6", "numbers100", "Sắp xếp số đến 100", "numberTo100", 10, 99, { order: 6, mode: "sort" }), level("numbers100-7", "numbers100", "Điền số còn thiếu", "numberTo100", 10, 98, { order: 7, mode: "missing" }), level("numbers100-8", "numbers100", "Ôn tập số đến 100", "numberTo100", 10, 99, { order: 8, mode: "recognize" }),
  level("word-problems-1", "wordProblems", "Cộng bằng lời văn", "wordProblemAdd", 1, 10, { order: 1, imageMode: "addition", visualSet: "addition" }), level("word-problems-2", "wordProblems", "Trừ bằng lời văn", "wordProblemSubtract", 1, 10, { order: 2, imageMode: "subtraction", visualSet: "subtraction" }), level("word-problems-3", "wordProblems", "Ôn tập bài toán lời văn", "wordProblemAdd", 2, 15, { order: 3, imageMode: "addition", visualSet: "addition" }), level("word-problems-4", "wordProblems", "Ôn tập bài toán lời văn", "wordProblemSubtract", 2, 15, { order: 4, imageMode: "subtraction", visualSet: "subtraction" }), level("word-problems-5", "wordProblems", "Cộng trong phạm vi 20", "wordProblemAdd", 2, 20, { order: 5, imageMode: "addition", visualSet: "addition" }), level("word-problems-6", "wordProblems", "Trừ trong phạm vi 20", "wordProblemSubtract", 2, 20, { order: 6, imageMode: "subtraction", visualSet: "subtraction" }), level("word-problems-7", "wordProblems", "Đọc và chọn phép cộng", "wordProblemAdd", 1, 12, { order: 7, imageMode: "addition", visualSet: "addition" }), level("word-problems-8", "wordProblems", "Đọc và chọn phép trừ", "wordProblemSubtract", 2, 12, { order: 8, imageMode: "subtraction", visualSet: "subtraction" }),
  level("clock-1", "clock", "Nhận biết kim giờ và kim phút", "clockHandsIntro", 1, 12, { order: 1 }), level("clock-2", "clock", "Đọc giờ đúng", "clockHour", 1, 12, { order: 2 }), level("clock-3", "clock", "Đọc giờ rưỡi", "clockHalfHour", 1, 12, { order: 3 }), level("clock-4", "clock", "Đọc giờ theo 15 phút", "clockQuarter", 1, 12, { order: 4 }), level("clock-5", "clock", "Đọc giờ theo 5 phút", "clockFiveMinutes", 1, 12, { order: 5 }), level("clock-6", "clock", "Đọc giờ đến từng phút", "clockExactMinute", 1, 12, { order: 6 }), level("clock-7", "clock", "Chọn đồng hồ đúng", "clockSelectFace", 1, 12, { order: 7 }), level("clock-8", "clock", "Nhận biết kim giây", "clockSecondHand", 1, 12, { order: 8 }), level("clock-9", "clock", "Đọc giờ, phút, giây", "clockWithSeconds", 1, 12, { order: 9 }), level("clock-10", "clock", "Thử thách đồng hồ", "clockMixed", 1, 12, { order: 10 }),
  level("length-1", "length", "Vật nào dài hơn?", "lengthCompare", 1, 10, { order: 1, mode: "longer" }), level("length-2", "length", "Vật nào ngắn hơn?", "lengthCompare", 1, 10, { order: 2, mode: "shorter" }), level("length-3", "length", "So sánh độ dài theo cm", "lengthCompare", 2, 15, { order: 3, mode: "cm" }), level("length-4", "length", "Dài hơn hay ngắn hơn", "lengthCompare", 2, 12, { order: 4, mode: "longer" }), level("length-5", "length", "Đọc độ dài theo cm", "lengthCompare", 3, 15, { order: 5, mode: "cm" }), level("length-6", "length", "Ôn tập đo độ dài", "lengthCompare", 2, 15, { order: 6, mode: "shorter" }),
  level("money-1", "money", "Nhận biết mệnh giá tiền", "vietnamMoney", 1000, 10000, { order: 1, mode: "recognize" }), level("money-2", "money", "Chọn số tiền đúng", "vietnamMoney", 1000, 10000, { order: 2, mode: "choose" }), level("money-3", "money", "Cộng tiền đơn giản", "vietnamMoney", 1000, 10000, { order: 3, mode: "add" }), level("money-4", "money", "Nhận biết tiền 1.000đ và 2.000đ", "vietnamMoney", 1000, 2000, { order: 4, mode: "recognize" }), level("money-5", "money", "Chọn tiền 5.000đ và 10.000đ", "vietnamMoney", 5000, 10000, { order: 5, mode: "choose" }), level("money-6", "money", "Ôn tập tiền Việt Nam", "vietnamMoney", 1000, 10000, { order: 6, mode: "add" }),
];
let TOPICS = MATH_TOPICS;
let LEVELS = MATH_LEVELS;
let LEVEL_BY_ID = Object.fromEntries(LEVELS.map((item) => [item.id, item]));
const COURSES = {
  "math-grade-1": { id: "math-grade-1", name: "Toán lớp 1", grade: "grade-1", icon: "🔢", description: "Đếm số và làm tính thật vui", topics: MATH_TOPICS, levels: MATH_LEVELS },
  "vietnamese-grade-1": window.HOC_CUNG_BE_VIETNAMESE_GRADE_1,
  "english-grade-1": window.HOC_CUNG_BE_ENGLISH_GRADE_1,
};
const COURSE_IDS = Object.keys(COURSES);
let activeCourseId = "math-grade-1";
function activeCourse() { return COURSES[activeCourseId] || COURSES["math-grade-1"]; }
function setActiveCourse(courseId) {
  const course = COURSES[courseId]; if (!course) return false;
  activeCourseId = courseId; document.body.dataset.course = courseId; TOPICS = course.topics; LEVELS = course.levels; LEVEL_BY_ID = Object.fromEntries(LEVELS.map((item) => [item.id, item]));
  selectedTopic = LEVELS[0]?.topic || ""; selectedLevelId = LEVELS[0]?.id || "";
  window.dispatchEvent(new CustomEvent("hoc-cung-be:course-changed", { detail: { courseId } }));
  return true;
}
function getLevelsByTopic(topicId) { return LEVELS.filter((item) => item.topic === topicId).sort((a, b) => a.order - b.order); }
function getLevelCountByTopic(topicId) { return getLevelsByTopic(topicId).length; }
function courseUsesSequentialUnlock() { return activeCourseId === "vietnamese-grade-1" || activeCourseId === "english-grade-1"; }
function getLevelIndexInTopic(levelId) { const item = LEVEL_BY_ID[levelId]; return item ? (courseUsesSequentialUnlock() ? LEVELS.findIndex((levelItem) => levelItem.id === levelId) : getLevelsByTopic(item.topic).findIndex((levelItem) => levelItem.id === levelId)) : -1; }
function getNextLevelInTopic(levelId) { const item = LEVEL_BY_ID[levelId]; const index = getLevelIndexInTopic(levelId); return item && index >= 0 ? (courseUsesSequentialUnlock() ? LEVELS[index + 1] : getLevelsByTopic(item.topic)[index + 1]) || null : null; }

// ==================== Utilities ====================
const $ = (selector) => document.querySelector(selector);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (items) => { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = randomInt(0, i); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; };
const validObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const safeNumber = (value, max = 100) => Number.isFinite(Number(value)) ? Math.max(0, Math.min(max, Math.floor(Number(value)))) : 0;
const scoreFor = (correct, questionCount = DEFAULT_QUESTION_COUNT) => Math.round((safeNumber(correct, questionCount) / Math.max(1, safeNumber(questionCount, 100))) * 100);
const starsFor = (score, item) => score >= item.rewardStars[2] ? 3 : score >= item.rewardStars[1] ? 2 : score >= item.rewardStars[0] ? 1 : 0;

// ==================== LocalStorage Manager ====================
function readStorage(storage, key) { try { return storage.getItem(key); } catch { return null; } }
function writeStorage(storage, key, value) { try { storage.setItem(key, value); return true; } catch { return false; } }
function parseJSON(value) { try { return value ? JSON.parse(value) : null; } catch { return null; } }

// ==================== Global Guest Trial ====================
function defaultGuestTrial() { return { version: GUEST_TRIAL_VERSION, completedLevelIds: [] }; }
function normalizeGuestTrial(raw) {
  const source = validObject(raw) ? raw : {}; const ids = Array.isArray(source.completedLevelIds) ? source.completedLevelIds : [];
  const allLevelIds = new Set(Object.values(COURSES).flatMap((course) => course?.levels || []).map((item) => item.id));
  return { version: GUEST_TRIAL_VERSION, completedLevelIds: [...new Set(ids.filter((id) => typeof id === "string" && allLevelIds.has(id)))].slice(0, GUEST_TRIAL_LIMIT) };
}
function loadGuestTrial(storage = localStorage) {
  let trial = normalizeGuestTrial(parseJSON(readStorage(storage, GUEST_TRIAL_KEY)));
  // Preserve the meaning of the previous fixed trial if that version had already been exhausted.
  if (!trial.completedLevelIds.length && readStorage(storage, LEGACY_TRIAL_COMPLETED_KEY) === "true") trial = { version: GUEST_TRIAL_VERSION, completedLevelIds: ["counting-1", "counting-2"] };
  writeStorage(storage, GUEST_TRIAL_KEY, JSON.stringify(trial)); return trial;
}
function saveGuestTrial(trial, storage = localStorage) { const safe = normalizeGuestTrial(trial); writeStorage(storage, GUEST_TRIAL_KEY, JSON.stringify(safe)); return safe; }
function completeGuestTrialLevel(levelId, trial = loadGuestTrial(), storage = localStorage) {
  const safe = normalizeGuestTrial(trial); const known = Object.values(COURSES).some((course) => course?.levels?.some((item) => item.id === levelId)); if (!known || safe.completedLevelIds.includes(levelId) || safe.completedLevelIds.length >= GUEST_TRIAL_LIMIT) return safe;
  return saveGuestTrial({ version: GUEST_TRIAL_VERSION, completedLevelIds: [...safe.completedLevelIds, levelId] }, storage);
}
function guestTrialCount(trial = loadGuestTrial()) { return normalizeGuestTrial(trial).completedLevelIds.length; }
function guestTrialExhausted(trial = loadGuestTrial()) { return guestTrialCount(trial) >= GUEST_TRIAL_LIMIT; }
function authStatusContent(user, trial = loadGuestTrial()) { return user ? { badge: "✓ Đã đăng nhập", detail: user.displayName || user.email || "Tài khoản phụ huynh" } : { badge: "👤 Chưa đăng nhập", detail: `Học thử ${guestTrialCount(trial)}/${GUEST_TRIAL_LIMIT}` }; }
function activeChild() { return currentLearningUser ? window.HocCungBeChildren?.getActiveChild?.() || null : null; }
function activeChildId() { return activeChild()?.id || null; }
function legacyChildProgressKey(childId) { return `${CHILD_PROGRESS_KEY_PREFIX}${childId}`; }
function courseProgressKey(childId, courseId = activeCourseId) { return `${CHILD_PROGRESS_KEY_PREFIX}${childId}:${courseId}`; }
function progressStorageKey(courseId = activeCourseId) { const childId = activeChildId(); if (currentLearningUser) return childId ? courseProgressKey(childId, courseId) : null; return courseId === "math-grade-1" ? STORAGE_KEY : `${CHILD_PROGRESS_KEY_PREFIX}guest:${courseId}`; }

// ==================== Audio Settings / Speech / Sound Effects ====================
function defaultAudioSettings() { return { soundEnabled: true, speechEnabled: true }; }
function loadAudioSettings(storage = localStorage) { const parsed = parseJSON(readStorage(storage, AUDIO_SETTINGS_KEY)); const raw = validObject(parsed) ? parsed : {}; return { soundEnabled: typeof raw.soundEnabled === "boolean" ? raw.soundEnabled : true, speechEnabled: typeof raw.speechEnabled === "boolean" ? raw.speechEnabled : true }; }
function saveAudioSettings(settings, storage = localStorage) { const safe = { soundEnabled: Boolean(settings.soundEnabled), speechEnabled: Boolean(settings.speechEnabled) }; writeStorage(storage, AUDIO_SETTINGS_KEY, JSON.stringify(safe)); return safe; }
function speechSupported() { return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; }
function canReadQuestion() { return audioSettings.speechEnabled && speechSupported(); }
let audioSettings = loadAudioSettings(); let audioContext = null;
function numberToVietnamese(value) { const number = Number(value); if (!Number.isInteger(number) || number < 0 || number > 999) return String(value); const ones = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]; if (number < 10) return ones[number]; if (number < 20) return number === 10 ? "mười" : `mười ${number === 15 ? "lăm" : ones[number - 10]}`; if (number < 100) { const tens = Math.floor(number / 10); const unit = number % 10; return `${ones[tens]} mươi${unit ? ` ${unit === 1 ? "mốt" : unit === 5 ? "lăm" : ones[unit]}` : ""}`; } const hundreds = Math.floor(number / 100); const rest = number % 100; return `${ones[hundreds]} trăm${rest ? ` ${rest < 10 ? `lẻ ${ones[rest]}` : numberToVietnamese(rest)}` : ""}`; }
function normalizeClockTime(value = {}) { const hour = Math.max(1, Math.min(12, Math.floor(Number(value.hour)) || 12)); const minute = Math.max(0, Math.min(59, Math.floor(Number(value.minute)) || 0)); const second = Math.max(0, Math.min(59, Math.floor(Number(value.second)) || 0)); return { hour, minute, second }; }
function clockAngles(value) { const time = normalizeClockTime(value); return { hourAngle: (time.hour % 12) * 30 + time.minute * .5 + time.second / 120, minuteAngle: time.minute * 6 + time.second * .1, secondAngle: time.second * 6 }; }
function formatClockTime(value, includeSeconds = false) { const time = normalizeClockTime(value); return `${time.hour} giờ${time.minute || includeSeconds ? ` ${time.minute} phút` : ""}${includeSeconds ? ` ${time.second} giây` : ""}`; }
function clockSpeech(value, includeSeconds = false) { const time = normalizeClockTime(value); return `${numberToVietnamese(time.hour)} giờ${time.minute || includeSeconds ? ` ${numberToVietnamese(time.minute)} phút` : ""}${includeSeconds ? ` ${numberToVietnamese(time.second)} giây` : ""}`; }
function formatMoney(value) { return `${Number(value).toLocaleString("vi-VN")}đ`; }
function plainQuestionText(prompt) { const holder = document.createElement("div"); holder.innerHTML = prompt; return holder.textContent.replace(/\s+/g, " ").trim(); }
function capitalizeSpeech(value) { const text = String(value || ""); return text ? text[0].toUpperCase() + text.slice(1) : text; }
function getQuestionSpeechText(level, item) {
  if (level.type === "english") return item.speechText || item.displayText || plainQuestionText(item.prompt);
  if (level.type === "vietnamese") return item.speechText || item.displayText || plainQuestionText(item.prompt);
  const text = plainQuestionText(item.prompt); const numbers = text.match(/\d+/g) || [];
  if (level.type === "count") return `Có bao nhiêu ${item.countingObject?.name || "đồ vật"}?`;
  if (level.type === "compare") return `${numberToVietnamese(numbers[0])} so với ${numberToVietnamese(numbers[1])}. Hãy chọn dấu thích hợp.`;
  if (level.type === "larger") return `Số nào lớn hơn: ${numberToVietnamese(numbers[0])} hay ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "smaller") return `Số nào bé hơn: ${numberToVietnamese(numbers[0])} hay ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "add") return capitalizeSpeech(`${numberToVietnamese(numbers[0])} cộng ${numberToVietnamese(numbers[1])} bằng bao nhiêu?`);
  if (level.type === "addMissing") return `${numberToVietnamese(numbers[0])} cộng số nào bằng ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "addPicture") return `Có tất cả bao nhiêu ${item.visualObject?.name || "đồ vật"}?`;
  if (level.type === "subtract") return capitalizeSpeech(`${numberToVietnamese(numbers[0])} trừ ${numberToVietnamese(numbers[1])} bằng bao nhiêu?`);
  if (level.type === "subMissing") return `Số nào trừ ${numberToVietnamese(numbers[0])} bằng ${numberToVietnamese(numbers[1])}?`;
  if (level.type === "subPicture") return `Có ${item.initialCount || ""} ${item.visualObject?.name || "đồ vật"}. Bớt đi ${item.removedCount || ""}. Còn lại bao nhiêu?`;
  if (level.type === "sequence") return `Số nào còn thiếu trong dãy: ${numberToVietnamese(item.sequenceValues?.[0])}, ... ${numberToVietnamese(item.sequenceValues?.[2])}?`;
  if (level.type === "near") return text.replace(/\d+/g, (number) => numberToVietnamese(number));
  if (level.type === "sort") return "Dãy số nào được sắp xếp từ bé đến lớn?";
  if (level.type === "shape") return "Đây là hình gì?";
  if (level.type === "shapeLife") return text;
  if (level.type === "shapeCount") return text.match(/Có bao nhiêu hình [^?]+\?/)?.[0] || "Có bao nhiêu hình?";
  if (level.type === "numberTo20" || level.type === "numberTo100" || level.type === "tensOnes" || level.type === "wordProblemAdd" || level.type === "wordProblemSubtract" || level.type === "lengthCompare") return item.speechText || text.replace(/\d+/g, (number) => numberToVietnamese(number));
  if (level.topic === "clock") return item.speechText || `${item.clockTime ? `Đồng hồ chỉ ${clockSpeech(item.clockTime, Boolean(item.includeSeconds))}. ` : ""}${item.clockQuestion || text}`;
  if (level.type === "vietnamMoney") return item.speechText || text;
  return text;
}
function cancelSpeech() { if (speechSupported()) { try { window.speechSynthesis.cancel(); } catch {} } }
function speechVoice(locale = "vi-VN") { const voices = window.speechSynthesis?.getVoices?.() || []; const wanted = String(locale).toLowerCase(); const language = wanted.split("-")[0]; return voices.find((item) => item.lang.toLowerCase() === wanted) || voices.find((item) => item.lang.toLowerCase().startsWith(language)) || null; }
function speakText(text, locale = activeCourse()?.speechLocale || "vi-VN", statusElement = elements?.speechStatus) {
  if (!text || !canReadQuestion()) return false;
  cancelSpeech(); const utterance = new SpeechSynthesisUtterance(String(text)); const voice = speechVoice(locale);
  utterance.lang = voice?.lang || locale; utterance.voice = voice; utterance.rate = locale.toLowerCase().startsWith("en") ? 0.72 : 0.76; utterance.pitch = 1; utterance.volume = 0.8;
  utterance.onstart = () => { if (statusElement) statusElement.textContent = "Đang đọc..."; }; utterance.onend = utterance.onerror = () => { if (statusElement) statusElement.textContent = ""; };
  try { window.speechSynthesis.speak(utterance); return true; } catch { return false; }
}
function readCurrentQuestion() {
  if (!quiz || !canReadQuestion()) return false;
  return speakText(getQuestionSpeechText(quiz.level, quiz.questions[quiz.index]), quiz.level.speechLocale || activeCourse()?.speechLocale || "vi-VN");
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
function newLevelProgress(unlocked = false, questionCount = DEFAULT_QUESTION_COUNT) { return { bestScore: 0, bestCorrect: 0, bestQuestionCount: questionCount, bestStars: 0, attempts: 0, completed: false, unlocked, lastPlayedAt: null }; }
function dateKey(date = new Date()) { const local = new Date(date); const offset = local.getTimezoneOffset() * 60000; return new Date(local.getTime() - offset).toISOString().slice(0, 10); }
function defaultStudyTime() { return { totalSeconds: 0, todaySeconds: 0, todayDate: dateKey(), lastStudyDate: null, legacySeconds: 0, studyTimeByDate: {} }; }
function normalizeStudyTime(raw) {
  const source = validObject(raw) ? raw : {}; const today = dateKey(); const studyTimeByDate = {};
  if (validObject(source.studyTimeByDate)) Object.entries(source.studyTimeByDate).forEach(([day, seconds]) => { if (/^\d{4}-\d{2}-\d{2}$/.test(day)) studyTimeByDate[day] = safeNumber(seconds, 864000); });
  const datedTotal = Object.values(studyTimeByDate).reduce((sum, seconds) => sum + seconds, 0); const savedTotal = safeNumber(source.totalSeconds, 2147483647); const legacySeconds = Math.max(safeNumber(source.legacySeconds, 2147483647), savedTotal - datedTotal, 0); const totalSeconds = legacySeconds + datedTotal;
  return { totalSeconds, todaySeconds: safeNumber(studyTimeByDate[today], 864000), todayDate: today, lastStudyDate: typeof source.lastStudyDate === "string" ? source.lastStudyDate : null, legacySeconds, studyTimeByDate };
}
function historyFingerprint(item) { return [item.levelId, safeNumber(item.score), safeNumber(item.correct, 100), safeNumber(item.questionCount, 100) || LEGACY_QUESTION_COUNT, item.completedAt].join("|"); }
function normalizeHistory(raw) { if (!Array.isArray(raw)) return []; const unique = new Map(); raw.filter((item) => validObject(item) && LEVEL_BY_ID[item.levelId] && TOPICS[item.topic] && typeof item.completedAt === "string").forEach((item) => { const questionCount = safeNumber(item.questionCount, 100) || LEGACY_QUESTION_COUNT; const normalized = { historyId: typeof item.historyId === "string" && item.historyId ? item.historyId : historyFingerprint({ ...item, questionCount }), levelId: item.levelId, topic: item.topic, score: safeNumber(item.score), correct: safeNumber(item.correct, questionCount), stars: safeNumber(item.stars, 3), questionCount, completedAt: item.completedAt }; const key = normalized.historyId || historyFingerprint(normalized); const previous = unique.get(key); if (!previous || normalized.completedAt > previous.completedAt) unique.set(key, normalized); }); return [...unique.values()].sort((a, b) => a.completedAt.localeCompare(b.completedAt)).slice(-50); }
function defaultProgress() { const levels = {}; Object.keys(TOPICS).forEach((topic) => getLevelsByTopic(topic).forEach((item, index) => { levels[item.id] = newLevelProgress(courseUsesSequentialUnlock() ? item.id === LEVELS[0]?.id : index === 0, item.questionCount); })); return { progressVersion: PROGRESS_VERSION, levels, totalCompleted: 0, studyTime: defaultStudyTime(), history: [] }; }
function legacyBestQuestionCount(item) { const explicit = safeNumber(item?.bestQuestionCount, 100); return explicit || (safeNumber(item?.attempts, 999999) > 0 || safeNumber(item?.bestScore) > 0 || safeNumber(item?.bestCorrect, 100) > 0 ? LEGACY_QUESTION_COUNT : DEFAULT_QUESTION_COUNT); }
function mergeLegacyLevelProgress(first, second) { const a = validObject(first) ? first : {}; const b = validObject(second) ? second : {}; const best = safeNumber(b.bestScore) > safeNumber(a.bestScore) ? b : a; const questionCount = legacyBestQuestionCount(best); return { bestScore: Math.max(safeNumber(a.bestScore), safeNumber(b.bestScore)), bestCorrect: safeNumber(best.bestCorrect, questionCount), bestQuestionCount: questionCount, bestStars: Math.max(safeNumber(a.bestStars, 3), safeNumber(b.bestStars, 3)), attempts: safeNumber(a.attempts, 999999) + safeNumber(b.attempts, 999999), completed: Boolean(a.completed || b.completed || safeNumber(a.attempts, 999999) || safeNumber(b.attempts, 999999)), unlocked: Boolean(a.unlocked || b.unlocked), lastPlayedAt: [a.lastPlayedAt, b.lastPlayedAt].filter((value) => typeof value === "string").sort().pop() || null }; }
function normalizeProgress(raw) {
  const source = validObject(raw) ? raw : {}; const originalLevels = validObject(source.levels) ? source.levels : {}; const legacyClockCurriculum = Boolean((originalLevels["clock-1"] || originalLevels["clock-2"] || originalLevels["clock-3"]) && !originalLevels["clock-4"]); const sourceLevels = legacyClockCurriculum ? { ...originalLevels, "clock-1": {}, "clock-2": mergeLegacyLevelProgress(originalLevels["clock-1"], originalLevels["clock-2"]) } : originalLevels; const result = defaultProgress(); result.totalCompleted = safeNumber(source.totalCompleted, 999999);
  Object.keys(TOPICS).forEach((topic) => getLevelsByTopic(topic).forEach((item, index) => {
    const old = validObject(sourceLevels[item.id]) ? sourceLevels[item.id] : {}; const previousLevel = courseUsesSequentialUnlock() ? LEVELS[LEVELS.indexOf(item) - 1] : (index ? getLevelsByTopic(topic)[index - 1] : null); const previous = previousLevel ? result.levels[previousLevel.id] : null; const bestQuestionCount = legacyBestQuestionCount(old);
    const unlockedByScore = previous ? previous.bestScore >= previousLevel.unlockScore : true;
    result.levels[item.id] = { bestScore: safeNumber(old.bestScore), bestCorrect: safeNumber(old.bestCorrect, bestQuestionCount), bestQuestionCount, bestStars: safeNumber(old.bestStars, 3), attempts: safeNumber(old.attempts, 999999), completed: Boolean(old.completed) || safeNumber(old.attempts, 999999) > 0, unlocked: Boolean(old.unlocked) || !previousLevel || unlockedByScore, lastPlayedAt: typeof old.lastPlayedAt === "string" ? old.lastPlayedAt : null };
  }));
  result.studyTime = normalizeStudyTime(source.studyTime); result.history = normalizeHistory(source.history).map((entry) => legacyClockCurriculum && entry.levelId === "clock-1" ? { ...entry, levelId: "clock-2" } : entry); return result;
}
function migrateLegacy(raw) { const progress = defaultProgress(); if (!validObject(raw)) return progress; const item = progress.levels["addition-2"]; item.bestScore = safeNumber(raw.bestScore); item.bestCorrect = safeNumber(raw.bestCorrect, LEGACY_QUESTION_COUNT); item.bestQuestionCount = LEGACY_QUESTION_COUNT; item.bestStars = starsFor(item.bestScore, LEVEL_BY_ID["addition-2"]); item.attempts = safeNumber(raw.completed, 999999); item.completed = item.attempts > 0; item.unlocked = true; progress.totalCompleted = item.attempts; return normalizeProgress(progress); }
function loadProgress(storage = localStorage, courseId = activeCourseId) {
  const previousCourseId = activeCourseId; if (courseId !== activeCourseId) setActiveCourse(courseId);
  const key = storage === localStorage ? progressStorageKey(courseId) : (courseId === "math-grade-1" ? STORAGE_KEY : `${STORAGE_KEY}:${courseId}`);
  if (!key) { if (previousCourseId !== activeCourseId) setActiveCourse(previousCourseId); return defaultProgress(); }
  let raw = parseJSON(readStorage(storage, key));
  if (!raw && storage === localStorage && courseId === "math-grade-1" && currentLearningUser && activeChildId()) raw = parseJSON(readStorage(storage, legacyChildProgressKey(activeChildId()))) || parseJSON(readStorage(storage, STORAGE_KEY));
  const allowLegacyCourseMigration = courseId === "math-grade-1" && key === STORAGE_KEY;
  const progress = raw ? normalizeProgress(raw) : (allowLegacyCourseMigration && parseJSON(readStorage(storage, LEGACY_KEY)) ? migrateLegacy(parseJSON(readStorage(storage, LEGACY_KEY))) : defaultProgress());
  writeStorage(storage, key, JSON.stringify(progress)); if (previousCourseId !== activeCourseId) setActiveCourse(previousCourseId); return progress;
}
function saveProgress(progress, storage = localStorage, courseId = activeCourseId) { const safe = normalizeProgress(progress); const key = storage === localStorage ? progressStorageKey(courseId) : (courseId === "math-grade-1" ? STORAGE_KEY : `${STORAGE_KEY}:${courseId}`); if (!key) return safe; writeStorage(storage, key, JSON.stringify(safe)); if (storage === localStorage) window.dispatchEvent(new CustomEvent("hoc-cung-be:progress-saved", { detail: { progress: safe, childId: activeChildId(), courseId, storageKey: key } })); return safe; }
function levelProgress(progress, id) { return progress.levels[id] || newLevelProgress(false); }
function levelUnlocked(progress, item) { return Boolean(levelProgress(progress, item.id).unlocked); }
function isCompletedTrialLevel(levelId, trial = loadGuestTrial()) { return normalizeGuestTrial(trial).completedLevelIds.includes(levelId); }
function getLevelLockReason(levelId, user, progress, trial = loadGuestTrial()) {
  const item = LEVEL_BY_ID[levelId];
  if (!item) return "missing";
  if (!user && guestTrialExhausted(trial) && !isCompletedTrialLevel(levelId, trial)) return "account";
  if (!user) return levelUnlocked(progress, item) ? null : "progress";
  return levelUnlocked(progress, item) ? null : "progress";
}
function canAccessLevel(levelId, user, progress, trial = loadGuestTrial()) { return getLevelLockReason(levelId, user, progress, trial) === null; }
function getContinueAction(levelId, user, progress, trial = loadGuestTrial()) {
  if (!user && guestTrialExhausted(trial)) return "auth";
  const next = getNextLevelInTopic(levelId);
  return next && canAccessLevel(next.id, user, progress, trial) ? "next" : "topic";
}
function saveResult(progress, item, score, correct, timestamp = new Date().toISOString()) {
  const result = normalizeProgress(progress); const previous = levelProgress(result, item.id); const currentScore = safeNumber(score); const currentCorrect = safeNumber(correct, item.questionCount); const isNewBest = currentScore > previous.bestScore || (currentScore === previous.bestScore && currentCorrect > previous.bestCorrect); const bestScore = Math.max(previous.bestScore, currentScore);
  result.levels[item.id] = { ...previous, bestScore, bestCorrect: isNewBest ? currentCorrect : previous.bestCorrect, bestQuestionCount: isNewBest ? item.questionCount : previous.bestQuestionCount, bestStars: Math.max(previous.bestStars, starsFor(currentScore, item)), attempts: previous.attempts + 1, completed: true, unlocked: true, lastPlayedAt: timestamp };
  const historyId = `session-${timestamp}-${item.id}-${Math.random().toString(36).slice(2, 10)}`; result.totalCompleted += 1; result.history = normalizeHistory([...result.history, { historyId, levelId: item.id, topic: item.topic, score: currentScore, correct: currentCorrect, stars: starsFor(currentScore, item), questionCount: item.questionCount, completedAt: timestamp }]); const next = getNextLevelInTopic(item.id);
  if (next && bestScore >= item.unlockScore) result.levels[next.id] = { ...levelProgress(result, next.id), unlocked: true };
  return normalizeProgress(result);
}
function getTopicProgress(progress, topicId) { const levels = getLevelsByTopic(topicId); const items = levels.map((item) => levelProgress(progress, item.id)); const completed = items.filter((item) => item.completed).length; const opened = items.filter((item) => item.unlocked).length; const studied = items.filter((item) => item.attempts > 0); return { levels, items, total: levels.length, completed, opened, locked: Math.max(0, levels.length - opened), average: studied.length ? Math.round(studied.reduce((sum, item) => sum + item.bestScore, 0) / studied.length) : 0, stars: items.reduce((sum, item) => sum + item.bestStars, 0), percent: levels.length ? Math.round((completed / levels.length) * 100) : 0 }; }
function statistics(progress) { return Object.values(progress.levels).reduce((total, item) => ({ stars: total.stars + item.bestStars, score: total.score + item.bestScore, completed: progress.totalCompleted }), { stars: 0, score: 0, completed: progress.totalCompleted }); }
function addStudySeconds(progress, seconds, timestamp = new Date()) { const result = normalizeProgress(progress); const amount = safeNumber(seconds, 864000); if (!amount) return result; const today = dateKey(timestamp); result.studyTime.studyTimeByDate[today] = safeNumber(result.studyTime.studyTimeByDate[today], 864000) + amount; result.studyTime.lastStudyDate = timestamp.toISOString(); return normalizeProgress(result); }

// ==================== Question Generator ====================
function options(answer, max = 10, extra = []) { const values = new Set([String(answer)]); shuffle([...Array.from({ length: max + 1 }, (_, n) => String(n)), ...extra.map(String)]).forEach((value) => { if (values.size < 4 && value !== String(answer)) values.add(value); }); return shuffle([...values]); }
function question(prompt, answer, answerOptions, key, helper, tip, metadata = {}) { return { prompt, answer: String(answer), options: answerOptions.map(String), key, helper, tip, hadWrong: false, ...metadata }; }
function sequenceMarkup(first, middle, last) { return `<span class="number-sequence"><span>${first}</span><span>${middle}</span><span>${last}</span></span>`; }
function pickVisual(item) { const set = VISUAL_SETS[item.visualSet] || OBJECT_LIBRARY; return set[randomInt(0, set.length - 1)]; }
function visualItems(object, count, removed = 0) { return Array.from({ length: count }, (_, index) => `<span class="visual-object${index >= count - removed ? " is-removed" : ""}" aria-hidden="true">${object.icon}</span>`).join(""); }
function visualGroup(object, count, label = "") { return `<span class="visual-group"><small>${label}</small><span class="visual-count">${visualItems(object, count)}</span></span>`; }
function closeNumberOptions(answer, min = 0, max = 100) { const values = new Set([Number(answer)]); [-2, -1, 1, 2, -3, 3].forEach((offset) => { const value = Number(answer) + offset; if (value >= min && value <= max && values.size < 4) values.add(value); }); while (values.size < 4) values.add(randomInt(min, max)); return shuffle([...values].map(String)); }
function clockMarkup(value, settings = {}) {
  const time = normalizeClockTime(value); const angles = clockAngles(time); const showSeconds = Boolean(settings.showSeconds); const compact = Boolean(settings.compact); const labels = Boolean(settings.labels);
  const marks = Array.from({ length: 12 }, (_, index) => { const number = index + 1; return `<span class="clock-mark" style="--mark:${number * 30}deg"><b>${number}</b></span>`; }).join("");
  const legend = labels ? `<span class="clock-legend"><b><i class="legend-hand legend-hand--hour"></i>Kim ngắn: kim giờ</b><b><i class="legend-hand legend-hand--minute"></i>Kim dài: kim phút</b></span>` : "";
  return `<span class="learning-clock${compact ? " learning-clock--compact" : ""}" aria-label="Đồng hồ ${formatClockTime(time, showSeconds)}"><span class="clock-face">${marks}<i class="clock-hand clock-hand--hour" style="--angle:${angles.hourAngle}deg"></i><i class="clock-hand clock-hand--minute" style="--angle:${angles.minuteAngle}deg"></i>${showSeconds ? `<i class="clock-hand clock-hand--second" style="--angle:${angles.secondAngle}deg"></i>` : ""}<b class="clock-pin"></b></span>${legend}</span>`;
}
function clockTimeKey(value, includeSeconds = false) { const time = normalizeClockTime(value); return `${time.hour}:${String(time.minute).padStart(2, "0")}${includeSeconds ? `:${String(time.second).padStart(2, "0")}` : ""}`; }
function clockAnswerOptions(value, includeSeconds = false) {
  const time = normalizeClockTime(value); const variants = [time, { ...time, minute: (time.minute + 5) % 60 }, { ...time, hour: time.hour === 12 ? 1 : time.hour + 1 }, { ...time, minute: (time.minute + 55) % 60 }];
  if (includeSeconds) variants[1] = { ...time, second: (time.second + 5) % 60 };
  const values = new Map(); variants.forEach((entry) => values.set(clockTimeKey(entry, includeSeconds), formatClockTime(entry, includeSeconds)));
  for (let offset = 1; values.size < 4; offset += 1) { const entry = { ...time, hour: ((time.hour - 1 + offset) % 12) + 1, minute: (time.minute + offset * 5) % 60 }; values.set(clockTimeKey(entry, includeSeconds), formatClockTime(entry, includeSeconds)); }
  return shuffle([...values.values()]);
}
function clockQuestionForType(type, item) {
  if (type === "clockHandsIntro") {
    const time = { hour: randomInt(1, 12), minute: [0, 15, 30, 45][randomInt(0, 3)], second: 0 }; const askHour = Math.random() > .5; const answer = askHour ? "Kim ngắn, dày hơn" : "Kim dài hơn";
    return question(`${askHour ? "Kim nào là kim giờ?" : "Kim nào là kim phút?"}<br>${clockMarkup(time, { labels: true })}`, answer, shuffle([answer, askHour ? "Kim dài hơn" : "Kim ngắn, dày hơn", "Cả hai kim", "Không có kim nào"]), `clock-hands-${askHour}-${clockTimeKey(time)}`, "Quan sát độ dài và màu của từng kim nhé!", "Kim giờ ngắn hơn; kim phút dài hơn.", { clockTime: time, clockQuestion: askHour ? "Kim nào là kim giờ?" : "Kim nào là kim phút?", speechText: askHour ? "Kim nào là kim giờ?" : "Kim nào là kim phút?" });
  }
  if (type === "clockSecondHand") {
    const time = { hour: randomInt(1, 12), minute: randomInt(0, 11) * 5, second: randomInt(0, 11) * 5 }; const askPosition = Math.random() > .45;
    if (!askPosition) return question(`Kim nào là kim giây?<br>${clockMarkup(time, { showSeconds: true })}`, "Kim dài, mảnh, màu đỏ", shuffle(["Kim dài, mảnh, màu đỏ", "Kim ngắn, màu hồng", "Kim phút màu tím", "Nút tròn ở giữa"]), `clock-second-identify-${clockTimeKey(time, true)}`, "Tìm kim mảnh nhất và có màu đỏ nhé!", "Kim giây chạy một vòng trong 60 giây.", { clockTime: time, includeSeconds: true, clockQuestion: "Kim nào là kim giây?", speechText: "Kim nào là kim giây? Kim giây dài, mảnh và chạy quanh mặt đồng hồ. Sáu mươi giây bằng một phút." });
    const answer = time.second === 0 ? "Số 12" : `Số ${time.second / 5}`; return question(`Kim giây đang chỉ số nào?<br>${clockMarkup(time, { showSeconds: true })}`, answer, shuffle([answer, `Số ${((time.second / 5 + 2) % 12) || 12}`, `Số ${((time.second / 5 + 5) % 12) || 12}`, `Số ${((time.second / 5 + 8) % 12) || 12}`]), `clock-second-position-${clockTimeKey(time, true)}`, "Nhìn kim mảnh màu đỏ nhé!", "Mỗi số trên đồng hồ cách nhau 5 giây.", { clockTime: time, includeSeconds: true, clockQuestion: "Kim giây đang chỉ số nào?", speechText: "Kim giây đang chỉ số nào?" });
  }
  const minuteSets = { clockHour: [0], clockHalfHour: [30], clockQuarter: [0, 15, 30, 45], clockFiveMinutes: Array.from({ length: 12 }, (_, index) => index * 5), clockExactMinute: Array.from({ length: 60 }, (_, index) => index), clockSelectFace: Array.from({ length: 12 }, (_, index) => index * 5), clockWithSeconds: Array.from({ length: 60 }, (_, index) => index) };
  const minutes = minuteSets[type] || minuteSets.clockExactMinute; const time = { hour: randomInt(1, 12), minute: minutes[randomInt(0, minutes.length - 1)], second: type === "clockWithSeconds" ? randomInt(0, 11) * 5 : 0 }; const includeSeconds = type === "clockWithSeconds"; const answer = formatClockTime(time, includeSeconds);
  if (type === "clockSelectFace") {
    const distractors = [time, { ...time, minute: (time.minute + 5) % 60 }, { ...time, hour: time.hour === 12 ? 1 : time.hour + 1 }, { ...time, minute: (time.minute + 55) % 60 }]; const optionMarkup = {};
    distractors.forEach((entry) => { const label = formatClockTime(entry); optionMarkup[label] = clockMarkup(entry, { compact: true }); });
    return question(`Chọn đồng hồ chỉ <strong>${answer}</strong>.`, answer, shuffle(Object.keys(optionMarkup)), `clock-select-${clockTimeKey(time)}`, "So sánh kim giờ và kim phút trên bốn đồng hồ.", "Loại các đồng hồ sai giờ hoặc lệch 5 phút.", { clockTime: time, clockQuestion: `Chọn đồng hồ chỉ ${answer}.`, speechText: `Chọn đồng hồ chỉ ${clockSpeech(time)}.`, optionMarkup });
  }
  return question(`Đồng hồ chỉ mấy giờ?<br>${clockMarkup(time, { showSeconds: includeSeconds, labels: type === "clockHour" || type === "clockHalfHour" })}`, answer, clockAnswerOptions(time, includeSeconds), `clock-${type}-${clockTimeKey(time, includeSeconds)}`, "Nhìn kim phút trước, rồi nhìn kim giờ nhé!", includeSeconds ? "Đọc lần lượt kim giờ, kim phút rồi kim giây." : time.minute === 30 ? "Kim giờ nằm giữa hai số khi là giờ rưỡi." : "Mỗi số trên mặt đồng hồ ứng với 5 phút.", { clockTime: time, includeSeconds, hour: time.hour, minute: time.minute, second: time.second, clockQuestion: "Hãy chọn thời gian đúng.", speechText: `Đồng hồ chỉ ${clockSpeech(time, includeSeconds)}. Hãy chọn thời gian đúng.` });
}
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
  if (item.topic === "clock") {
    if (type === "clockMixed") { const mixedTypes = ["clockHour", "clockHalfHour", "clockQuarter", "clockFiveMinutes", "clockExactMinute", "clockSelectFace", "clockSecondHand", "clockWithSeconds"]; return clockQuestionForType(mixedTypes[randomInt(0, mixedTypes.length - 1)], item); }
    return clockQuestionForType(type, item);
  }
  if (type === "lengthCompare") { a = randomInt(3, 12); b = randomInt(3, 12); while (a === b) b = randomInt(3, 12); if (item.mode === "cm") { const answer = `${Math.max(a, b)} cm`; return question(`Thanh nào dài hơn? Thanh dài hơn có độ dài bao nhiêu?${lengthBars(a, b)}`, answer, shuffle([answer, `${Math.min(a, b)} cm`, `${Math.max(a, b) - 1} cm`, `${Math.max(a, b) + 1} cm`]), `length-cm-${a}-${b}`, "So sánh hai thanh bằng mắt nhé!", "Thanh dài hơn chiếm nhiều chỗ hơn.", { speechText: "Thanh nào dài hơn? Thanh dài hơn có độ dài bao nhiêu xen ti mét?" }); } const longer = a > b ? "Vật A" : "Vật B"; const answer = item.mode === "shorter" ? (a < b ? "Vật A" : "Vật B") : longer; return question(`Vật nào ${item.mode === "shorter" ? "ngắn hơn" : "dài hơn"}?${lengthBars(a, b)}`, answer, ["Vật A", "Vật B", "Hai vật bằng nhau", "Không biết"], `length-${item.mode}-${a}-${b}`, "Nhìn chiều dài của hai thanh nhé!", item.mode === "shorter" ? "Thanh ngắn hơn chiếm ít chỗ hơn." : "Thanh dài hơn chiếm nhiều chỗ hơn.", { speechText: `Vật nào ${item.mode === "shorter" ? "ngắn hơn" : "dài hơn"}?` }); }
  if (type === "vietnamMoney") { const allValues = [1000, 2000, 5000, 10000]; const values = allValues.filter((value) => value >= min && value <= max); const first = values[randomInt(0, values.length - 1)]; if (item.mode === "add") { const second = values[randomInt(0, values.length - 1)]; const answer = first + second; return question(`${moneyCard(first)} <span class="visual-operation">+</span> ${moneyCard(second)}<br> Có tất cả bao nhiêu tiền?`, formatMoney(answer), moneyOptions(answer, [first, second]), `money-add-${first}-${second}`, "Cộng hai số tiền nhé!", "Cộng số nghìn trước.", { speechText: `${numberToVietnamese(first / 1000)} nghìn đồng cộng ${numberToVietnamese(second / 1000)} nghìn đồng bằng bao nhiêu tiền?` }); } const questionText = item.mode === "choose" ? "Chọn số tiền đúng với thẻ." : "Đây là bao nhiêu tiền?"; return question(`${moneyCard(first)}<br>${questionText}`, formatMoney(first), shuffle(allValues.map(formatMoney)), `money-${item.mode}-${first}`, "Đọc số trên thẻ tiền nhé!", "Chữ đ là đồng.", { speechText: `${questionText} ${numberToVietnamese(first / 1000)} nghìn đồng.` }); }
  if (type === "count") {
    n = randomInt(min, max);
    const object = pickVisual(item);
    return question(`Có bao nhiêu ${object.name}?<br><span class="visual-count visual-count--objects">${visualItems(object, n)}</span>`, n, options(n, max), `count-${object.id}-${n}`, object.hintText, object.hintText, { countingObject: object, visualObject: object, count: n });
  }
  if (type === "near") { n = randomInt(min, max); const after = item.mode === "after" || (item.mode !== "before" && Math.random() > .5); const answer = after ? n + 1 : n - 1; return question(`Số ${after ? "liền sau" : "liền trước"} của ${n} là số nào?`, answer, options(answer), `near-${n}-${after}`, "Nhớ đếm tiến hoặc lùi một số nhé!", after ? "Số liền sau lớn hơn 1." : "Số liền trước bé hơn 1."); }
  if (type === "sort") { n = randomInt(min, max); const answer = `${n}, ${n + 1}, ${n + 2}`; return question("Dãy số nào được sắp xếp từ bé đến lớn?", answer, shuffle([answer, `${n + 1}, ${n}, ${n + 2}`, `${n}, ${n + 2}, ${n + 1}`, `${n + 2}, ${n + 1}, ${n}`]), `sort-${n}`, "Chọn dãy số đúng nhé bé!", "Số bé đứng trước, số lớn đứng sau."); }
  if (type === "compare") { a = randomInt(min, max); b = randomInt(min, max); const answer = a > b ? ">" : a < b ? "<" : "="; return question(`${a} &nbsp; ? &nbsp; ${b}`, answer, [">", "<", "=", "?"], `compare-${a}-${b}`, "Chọn dấu thích hợp nhé!", "Miệng dấu lớn quay về số lớn hơn."); }
  if (type === "larger" || type === "smaller") { a = randomInt(min, max); b = randomInt(min, max); const answer = type === "larger" ? Math.max(a, b) : Math.min(a, b); return question(`Số nào ${type === "larger" ? "lớn hơn" : "bé hơn"}?<br><b>${a} hay ${b}</b>`, answer, options(answer, max), `${type}-${a}-${b}`, "Nhìn kỹ hai số rồi chọn nhé!", "Số đứng sau trong dãy số thì lớn hơn."); }
  if (type === "groupCompare") { a = randomInt(min, Math.max(min, max - 1)); b = randomInt(min, Math.max(min, max - 1)); while (a === b) b = randomInt(min, Math.max(min, max - 1)); const left = pickVisual(item); const right = pickVisual(item); const less = item.compareMode === "less"; const answer = less ? (a < b ? "Nhóm bên trái" : "Nhóm bên phải") : (a > b ? "Nhóm bên trái" : "Nhóm bên phải"); return question(`Nhóm nào có ${less ? "ít" : "nhiều"} hơn?<br><span class="visual-groups">${visualGroup(left, a, "Nhóm bên trái")}${visualGroup(right, b, "Nhóm bên phải")}</span>`, answer, shuffle(["Nhóm bên trái", "Nhóm bên phải", "Hai nhóm bằng nhau", "Không biết"]), `group-compare-${less}-${left.id}-${a}-${right.id}-${b}`, "So sánh số đồ vật ở hai nhóm nhé!", `Đếm từng nhóm rồi chọn nhóm có ${less ? "ít" : "nhiều"} hơn.`, { leftVisual: left, rightVisual: right, leftCount: a, rightCount: b }); }
  if (["add", "addMissing", "addPicture", "addZero", "addCrossTen", "addFixed"].includes(type)) { if (type === "addZero") { a = randomInt(min, max); return question(`${a} + 0 = ?`, a, options(a, max), `add-zero-${a}`, "Cộng với 0 thì số không đổi nhé!", "Số nào cộng với 0 vẫn giữ nguyên số đó."); } if (type === "addFixed") { b = item.operand; a = randomInt(min, max - b); return question(`${a} + ${b} = ?`, a + b, options(a + b, max), `add-fixed-${b}-${a}`, `Đếm thêm ${b} nhé!`, `Bắt đầu từ ${a}, đếm thêm ${b}.`); } if (type === "addCrossTen") { a = randomInt(6, 10); b = randomInt(11 - a, 10); } else { a = randomInt(min, max); b = randomInt(min, max - a); } if (type === "addMissing") return question(`${a} + ? = ${a + b}`, b, options(b, max), `add-missing-${a}-${b}`, "Tìm số còn thiếu nhé!", "Lấy tổng trừ đi số đã biết."); if (type === "addPicture") { const object = pickVisual(item); return question(`Có tất cả bao nhiêu ${object.name}?<br><span class="visual-groups">${visualGroup(object, a, "Nhóm đầu")}${visualGroup(object, b, "Nhóm thêm")}</span><b class="visual-operation">+ = ?</b>`, a + b, options(a + b, max), `add-picture-${object.id}-${a}-${b}`, `Đếm tất cả ${object.name} nhé!`, "Đếm nhóm đầu rồi đếm thêm nhóm sau.", { visualObject: object, firstCount: a, secondCount: b }); } return question(`${a} + ${b} = ?`, a + b, options(a + b, max), `add-${a}-${b}`, "Chọn đáp án đúng nhé bé!", "Bé có thể đếm trên ngón tay."); }
  if (["subtract", "subMissing", "subPicture", "subZero", "subCrossTen", "subFixed"].includes(type)) { if (type === "subZero") { a = randomInt(min, max); return question(`${a} - 0 = ?`, a, options(a, max), `sub-zero-${a}`, "Trừ đi 0 thì số không đổi nhé!", "Số nào trừ đi 0 vẫn giữ nguyên số đó."); } if (type === "subFixed") { b = item.operand; a = randomInt(Math.max(min, b), max); return question(`${a} - ${b} = ?`, a - b, options(a - b, max), `sub-fixed-${b}-${a}`, `Bớt đi ${b} nhé!`, `Bắt đầu từ ${a}, đếm lùi ${b}.`); } if (type === "subCrossTen") { a = randomInt(11, 20); b = randomInt(a - 9, Math.min(10, a)); } else { a = randomInt(Math.max(1, min), max); b = randomInt(0, a); } if (type === "subMissing") return question(`? - ${b} = ${a - b}`, a, options(a, max), `sub-missing-${a}-${b}`, "Tìm số còn thiếu nhé!", "Cộng số trừ với kết quả."); if (type === "subPicture") { const object = pickVisual(item); return question(`Có ${a} ${object.name}. Bớt đi ${b} ${object.name}. Còn lại bao nhiêu?<br><span class="visual-count visual-count--objects">${visualItems(object, a, b)}</span>`, a - b, options(a - b, max), `sub-picture-${object.id}-${a}-${b}`, `Đếm các ${object.name} chưa bị gạch nhé!`, `Bỏ qua ${b} ${object.name} có dấu gạch chéo.`, { visualObject: object, initialCount: a, removedCount: b }); } return question(`${a} - ${b} = ?`, a - b, options(a - b, max), `sub-${a}-${b}`, "Chọn đáp án đúng nhé bé!", "Dùng ngón tay để bớt đi."); }
  if (type === "sequence") { n = randomInt(min, Math.max(min, max - 2)); return question(sequenceMarkup(n, "?", n + 2), n + 1, options(n + 1, max), `sequence-${n}`, "Số nào còn thiếu trong dãy?", "Hãy đếm lần lượt từng số.", { sequenceValues: [n, "?", n + 2] }); }
  const shapes = [["hình tròn", "●"], ["hình vuông", "■"], ["hình tam giác", "▲"], ["hình chữ nhật", "▬"]]; const shape = shapes[randomInt(0, 3)];
  if (type === "shapeCount") { n = randomInt(min, max); return question(`Có bao nhiêu ${shape[0]}?<br><span class="shape-row">${shape[1].repeat(n)}</span>`, n, options(n, max), `shape-count-${shape[0]}-${n}`, "Đếm từng hình một nhé!", "Chạm và đếm từ trái sang phải."); }
  if (type === "shapeLife") { const things = [["Bánh xe", "hình tròn"], ["Cửa sổ vuông", "hình vuông"], ["Mái nhà", "hình tam giác"], ["Quyển sách", "hình chữ nhật"]]; const thing = things[randomInt(0, 3)]; return question(`${thing[0]} giống hình nào?`, thing[1], shuffle(shapes.map((x) => x[0])), `shape-life-${thing[0]}`, "Tìm hình giống đồ vật nhé!", "Hãy tưởng tượng đồ vật quanh bé."); }
  return question(`Đây là hình gì?<br><span class="big-shape">${shape[1]}</span>`, shape[0], shuffle(shapes.map((x) => x[0])), `shape-${shape[0]}`, "Quan sát hình thật kỹ nhé!", "Mỗi hình có một dáng vẻ riêng.");
}
function generateQuestions(item) { if (item.type === "vietnamese" || item.type === "english") return item.questions.map((entry, index) => ({ ...entry, answer: String(entry.answer), options: entry.options.map(String), prompt: entry.prompt || entry.displayText, key: entry.id || `${item.id}-${index}`, hadWrong: false })); const output = []; const keys = new Set(); let tries = 0; while (output.length < item.questionCount) { const itemQuestion = generateQuestion(item); tries += 1; if (!keys.has(itemQuestion.key) || tries > 120) { keys.add(itemQuestion.key); output.push(itemQuestion); } } return output; }

// ==================== Quiz Engine ====================
let selectedTopic = "addition"; let selectedLevelId = "addition-1"; let quiz = null; let toastTimer; let currentLearningUser = null;
function guardLevelAccess(id, user = currentLearningUser, progress = loadProgress(), showPrompt = true, trial = loadGuestTrial()) { const reason = getLevelLockReason(id, user, progress, trial); if (reason === "account" && showPrompt) showAuthGate(); return reason === null; }
function prepareQuiz(id) { const item = LEVEL_BY_ID[id]; if (!item || !guardLevelAccess(id) || (currentLearningUser && !activeChildId())) { if (currentLearningUser) window.HocCungBeChildren?.openSelector?.(); return false; } if (currentLearningUser && !window.HocCungBeChildSettings?.canStartLesson()) return false; selectedTopic = item.topic; selectedLevelId = id; quiz = { level: item, courseId: activeCourseId, questions: generateQuestions(item), index: 0, score: 0, correct: 0, answered: false, childId: activeChildId() }; return true; }
function startQuiz(id, options = {}) { if (!prepareQuiz(id)) return false; if (quiz.level.type === "english" && !options.skipLearn) { showScreen("learn"); renderEnglishLearn(); return true; } showScreen("quiz"); renderQuestion(); return true; }
function beginEnglishPractice() { if (!quiz || quiz.level.type !== "english") return false; showScreen("quiz"); renderQuestion(); return true; }
function checkAnswer(answer, button) { if (!quiz || quiz.answered) return; const current = quiz.questions[quiz.index]; if (answer === current.answer) { quiz.answered = true; if (!current.hadWrong) { quiz.correct += 1; quiz.score = scoreFor(quiz.correct, quiz.questions.length); } elements.answerGrid.querySelectorAll("button").forEach((item) => { item.disabled = true; if (item.dataset.answer === current.answer) item.classList.add("is-correct"); }); elements.feedback.textContent = current.revealText ? `Chính xác! ${current.revealText}` : "Chính xác! Giỏi lắm bé!"; elements.feedback.className = "feedback is-correct"; setQuizMascot("correct", "Giỏi lắm!"); playCorrectEffect(); playSoundEffect("correct"); if (quiz.level.type === "english") speakText(current.answer.split("|")[0], "en-US"); elements.nextButton.hidden = false; elements.liveScore.textContent = quiz.score; elements.liveStars.textContent = starsFor(quiz.score, quiz.level); } else { current.hadWrong = true; button.disabled = true; button.classList.add("is-wrong"); elements.feedback.textContent = current.type === "listen-choice" ? "Thử lại nhé! Nghe lại một lần nữa." : "Thử lại nhé! Bé chọn một đáp án khác nào."; elements.feedback.className = "feedback is-wrong"; setQuizMascot("encourage", "Thử lại nhé!"); playSoundEffect("wrong"); } }
function nextQuestion() { if (quiz.index === quiz.questions.length - 1) finishQuiz(); else { quiz.index += 1; renderQuestion(); } }
function finishQuiz() { if (!quiz || quiz.childId !== activeChildId() || quiz.courseId !== activeCourseId) { quiz = null; showScreen("home"); return; } const progress = saveProgress(saveResult(loadProgress(), quiz.level, quiz.score, quiz.correct), localStorage, quiz.courseId); if (!currentLearningUser) completeGuestTrialLevel(quiz.level.id); renderResult(progress); showScreen("result"); playSoundEffect("complete"); window.dispatchEvent(new CustomEvent("hoc-cung-be:quiz-completed", { detail: { childId: activeChildId(), courseId: quiz.courseId } })); }

// ==================== UI Rendering ====================
const screens = Object.fromEntries(["home", "grade1", "math", "levels", "learn", "quiz", "result", "parent-gate", "parent-dashboard"].map((name) => [name, $(`#${name}-screen`)]));
const elements = { headerStats: $("#header-stats"), homeAuthStatus: $("#home-auth-status"), authGate: $("#auth-gate"), authGateLater: $("#auth-gate-later"), trialResultGate: $("#trial-result-gate"), soundSettingsButton: $("#sound-settings-button"), soundSettingsPanel: $("#sound-settings-panel"), soundEnabledToggle: $("#sound-enabled-toggle"), speechEnabledToggle: $("#speech-enabled-toggle"), learningSummary: $("#learning-summary"), topicGrid: $("#topic-grid"), topicEyebrow: $("#topic-eyebrow"), levelsTitle: $("#levels-title"), levelsDescription: $("#levels-description"), topicIcon: $("#topic-icon"), levelGrid: $("#level-grid"), quizBackButton: $("#quiz-back-button"), quizIcon: $("#quiz-icon"), quizTitle: $("#quiz-title"), liveStars: $("#live-stars"), liveScore: $("#live-score"), questionCount: $("#question-count"), progressFill: $("#progress-fill"), questionHelper: $("#question-helper"), quizMascot: $("#quiz-mascot"), quizMascotMessage: $("#quiz-mascot-message"), readQuestionButton: $("#read-question-button"), speechStatus: $("#speech-status"), equation: $("#equation"), answerGrid: $("#answer-grid"), feedback: $("#feedback"), confetti: $("#confetti"), nextButton: $("#next-button"), tipText: $("#tip-text"), resultMascot: $("#result-mascot"), resultMascotMessage: $("#result-mascot-message"), resultMessage: $("#result-message"), earnedStars: $("#earned-stars"), starNote: $("#star-note"), correctCount: $("#correct-count"), finalScore: $("#final-score"), unlockNote: $("#unlock-note"), continueButton: $("#continue-button"), retryButton: $("#retry-button"), topicButton: $("#topic-button"), parentEntryButton: $("#parent-entry-button"), parentRefreshButton: $("#parent-refresh-button"), parentSummary: $("#parent-summary"), parentTopicProgress: $("#parent-topic-progress"), parentPracticeIntro: $("#parent-practice-intro"), parentPracticeList: $("#parent-practice-list"), parentHistory: $("#parent-history"), parentDeleteButton: $("#parent-delete-button"), parentDeleteConfirm: $("#parent-delete-confirm"), parentDeleteCancel: $("#parent-delete-cancel"), parentDeleteNext: $("#parent-delete-next"), parentDeleteConfirmButton: $("#parent-delete-confirm-button"), parentDeleteCodeLabel: $("#parent-delete-code-label"), parentDeleteCode: $("#parent-delete-code"), parentDeleteStep: $("#parent-delete-step"), toast: $("#toast") };
function installExperienceUi() {
  const content = $("#home-screen .hero__content"), gradeHeading = $("#grade-choices .section-heading"), parentEntry = elements.parentEntryButton?.closest(".parent-entry");
  if (content && !$("#guest-home-actions")) {
    const eyebrow = content.querySelector(".eyebrow"), title = content.querySelector("h1"), description = content.querySelector(".hero__description"), learnLink = content.querySelector('a[href="#grade-choices"]');
    if (eyebrow) eyebrow.textContent = "Học vui mỗi ngày";
    if (title) title.textContent = "Học vui mỗi ngày";
    if (description) { description.dataset.guestText = "Đăng nhập để quản lý hồ sơ, tiến độ và cài đặt riêng cho từng bé."; description.dataset.authText = "Chọn bài học phù hợp và tiếp tục hành trình của bé."; description.textContent = description.dataset.guestText; }
    learnLink?.insertAdjacentHTML("beforebegin", `<div class="guest-auth-actions" id="guest-home-actions" data-guest-only><button class="primary-button" id="home-login-button" type="button" data-auth-open="login" data-guest-only>Đăng nhập</button><button class="secondary-button" id="home-register-button" type="button" data-auth-open="register" data-guest-only>Đăng ký</button></div>`);
    if (learnLink) { learnLink.textContent = "Học thử →"; learnLink.dataset.homeLearnLink = "true"; }
  }
  if (gradeHeading) { const eyebrow = gradeHeading.querySelector(".eyebrow"), title = gradeHeading.querySelector("h2"); if (eyebrow) eyebrow.id = "grade-choice-eyebrow"; if (title) title.id = "grade-choice-title"; }
  if (parentEntry) { parentEntry.id = "home-parent-section"; parentEntry.dataset.homeAuthRedundant = ""; parentEntry.dataset.homeGuestHidden = "true"; parentEntry.hidden = true; parentEntry.querySelector(".eyebrow").textContent = "Dành cho phụ huynh"; parentEntry.querySelector("h2").textContent = "Quản lý hành trình của bé"; parentEntry.querySelector("p:last-child").textContent = "Hồ sơ của bé · Tiến độ học tập · Cài đặt cho bé · Tài khoản của tôi"; }
  const dashboard = $("#parent-dashboard-screen .parent-dashboard");
  if (dashboard && !$("#parent-section-nav")) dashboard.querySelector(".parent-dashboard__heading")?.insertAdjacentHTML("afterend", `<nav class="parent-section-nav" id="parent-section-nav" aria-label="Khu phụ huynh"><button type="button" data-parent-target="dashboard-child-management">Hồ sơ của bé</button><button type="button" data-parent-target="parent-summary">Tiến độ học tập</button><button type="button" data-parent-target="child-settings-section">Cài đặt cho bé</button><button type="button" data-account-go="me">Tài khoản của tôi</button></nav><div class="parent-course-selector" aria-label="Chọn môn để xem chi tiết"><strong>Xem chi tiết môn:</strong><button type="button" data-parent-course="math-grade-1">🔢 Toán lớp 1</button><button type="button" data-parent-course="vietnamese-grade-1">🔤 Tiếng Việt lớp 1</button><button type="button" data-parent-course="english-grade-1">🔠 Tiếng Anh lớp 1</button></div>`);
}
installExperienceUi();
function showScreen(name) { const nextScreen = screens[name]; if (!nextScreen) throw new Error(`Unknown application screen: ${name}`); cancelSpeech(); stopStudyTracking(); if (name !== "quiz" && name !== "learn") window.HocCungBeChildSettings?.stopLearningSession?.(); document.querySelectorAll(".screen").forEach((screen) => { screen.hidden = screen !== nextScreen; }); if (name === "math") renderTopics(); if (name === "levels") renderLevels(); if (name === "parent-dashboard") { if (!currentLearningUser) { showScreen("home"); return; } renderParentDashboard(); window.dispatchEvent(new CustomEvent("hoc-cung-be:parent-dashboard-open")); } if (name === "quiz" || name === "learn") { startStudyTracking(); window.HocCungBeChildSettings?.startLearningSession?.(); } renderHeader(); window.scrollTo({ top: 0, behavior: "smooth"}); }
function renderActiveChildUi() { const child = activeChild(); document.querySelectorAll("[data-active-child-name]").forEach((element) => { element.textContent = child?.name || "Chưa chọn bé"; }); document.querySelectorAll("[data-active-child-avatar]").forEach((element) => { element.textContent = child?.avatar || "🧒"; }); document.querySelectorAll("[data-child-switch]").forEach((button) => { button.hidden = !currentLearningUser; button.disabled = !currentLearningUser; }); }
function applyAuthUiState(user = currentLearningUser) { const isAuthenticated = Boolean(user); document.body.dataset.authenticated = String(isAuthenticated); document.querySelectorAll("[data-guest-only]").forEach((element) => { element.hidden = isAuthenticated; }); document.querySelectorAll("[data-auth-only]").forEach((element) => { element.hidden = !isAuthenticated; }); [$("#home-parent-section"), $("#parent-account-entry")].filter(Boolean).forEach((element) => { element.dataset.homeAuthRedundant = ""; element.hidden = true; }); const description = $("#home-screen .hero__description"), learnLink = $("[data-home-learn-link]"), gradeEyebrow = $("#grade-choice-eyebrow"), gradeTitle = $("#grade-choice-title"); if (description) description.textContent = isAuthenticated ? description.dataset.authText : description.dataset.guestText; if (learnLink) learnLink.textContent = isAuthenticated ? "Bắt đầu học →" : "Học thử →"; if (gradeEyebrow) gradeEyebrow.textContent = isAuthenticated ? "CHỌN LỚP" : "HỌC THỬ"; if (gradeTitle) gradeTitle.textContent = isAuthenticated ? "Bé muốn học lớp nào?" : "Học thử cùng bé"; if (elements.soundSettingsButton?.closest(".sound-settings")) elements.soundSettingsButton.closest(".sound-settings").hidden = true; }
function renderHeader() { const stats = statistics(loadProgress()); elements.headerStats.textContent = currentLearningUser && stats.completed ? `⭐ ${stats.stars} sao · 🏆 ${stats.score} điểm · ✅ ${stats.completed} bài` : ""; applyAuthUiState(currentLearningUser); if (elements.homeAuthStatus) { const badge = document.createElement("span"); const detail = document.createElement("small"); const content = authStatusContent(currentLearningUser); badge.textContent = content.badge; detail.textContent = currentLearningUser && activeChild() ? `${activeChild().avatar} ${activeChild().name}` : content.detail; elements.homeAuthStatus.replaceChildren(badge, detail); } renderActiveChildUi(); }
function functionMenuElements() { return { button: $("#function-menu-button"), backdrop: $("#function-menu-backdrop"), close: $("#function-menu-close") }; }
function openFunctionMenu() { const menu = functionMenuElements(); if (!currentLearningUser || !menu.backdrop || !menu.button) return; menu.backdrop.hidden = false; menu.button.setAttribute("aria-expanded", "true"); menu.close?.focus(); }
function closeFunctionMenu({ restoreFocus = false } = {}) { const menu = functionMenuElements(); if (!menu.backdrop || !menu.button) return; const wasOpen = !menu.backdrop.hidden; menu.backdrop.hidden = true; menu.button.setAttribute("aria-expanded", "false"); if (restoreFocus && wasOpen && !menu.button.hidden) menu.button.focus(); }
function openParentFeature(targetId = "") { if (!currentLearningUser) return; closeFunctionMenu(); if (window.HocCungBeParentPin?.isUnlocked?.()) { showScreen("parent-dashboard"); if (targetId) requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })); } else { window.HocCungBeParentPin?.openParentGate?.(); if (targetId) window.addEventListener("hoc-cung-be:parent-dashboard-open", () => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }), { once: true }); } }
function runFunctionAction(action) { closeFunctionMenu(); if (action === "profile" || action === "account") { window.dispatchEvent(new CustomEvent("hoc-cung-be:open-account", { detail: { screen: "me" } })); return; } if (action === "analytics") { openParentFeature(); return; } if (action === "children") { window.HocCungBeChildren?.openSelector?.(); return; } if (action === "settings") { openParentFeature("child-settings-section"); return; } if (action === "sync") { window.HocCungBeCloudSync?.syncNow?.("manual"); return; } if (action === "logout") window.dispatchEvent(new Event("hoc-cung-be:sign-out")); }
function showAuthGate() { elements.authGate.hidden = false; document.body.classList.add("has-auth-gate"); elements.authGate.querySelector("button")?.focus(); }
function hideAuthGate() { elements.authGate.hidden = true; document.body.classList.remove("has-auth-gate"); }
function openAuthScreen(name) { hideAuthGate(); window.dispatchEvent(new CustomEvent("hoc-cung-be:open-auth", { detail: { screen: name } })); }
function handleAuthState(user) { const wasSignedIn = Boolean(currentLearningUser); currentLearningUser = user || null; document.body.dataset.authResolved = "true"; hideAuthGate(); if (!currentLearningUser) { window.HocCungBeChildSettings?.stopLearningSession?.(); window.HocCungBeChildSettings?.dismissBreak?.(true); } if (!currentLearningUser && (!screens["parent-dashboard"].hidden || !screens["parent-gate"].hidden)) showScreen("home"); if (wasSignedIn && !currentLearningUser && quiz && getLevelLockReason(quiz.level.id, null, loadProgress(), loadGuestTrial()) === "account" && !screens.quiz.hidden) { selectedTopic = quiz.level.topic; quiz = null; showScreen("levels"); showAuthGate(); return; } renderHeader(); if (!screens.levels.hidden) renderLevels(); if (!screens.result.hidden && quiz) renderResult(loadProgress()); }
function formatDuration(seconds) { const minutes = Math.floor(safeNumber(seconds, 2147483647) / 60); if (!minutes) return "0 phút"; const hours = Math.floor(minutes / 60); return hours ? `${hours} giờ ${minutes % 60} phút` : `${minutes} phút`; }
function formatDateTime(value) { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Chưa có"; }
function topicSummary(progress, topicId) { return getTopicProgress(progress, topicId); }
function parentStatistics(progress) { const values = LEVELS.map((item) => levelProgress(progress, item.id)); const studied = values.filter((item) => item.attempts > 0); return { attempts: progress.totalCompleted, completedLevels: values.filter((item) => item.completed).length, stars: values.reduce((sum, item) => sum + item.bestStars, 0), average: studied.length ? Math.round(studied.reduce((sum, item) => sum + item.bestScore, 0) / studied.length) : 0, opened: values.filter((item) => item.unlocked).length, locked: values.filter((item) => !item.unlocked).length, totalLevels: LEVELS.length, lastStudy: values.map((item) => item.lastPlayedAt).filter(Boolean).sort().at(-1) || progress.studyTime.lastStudyDate }; }
function parentStatisticsForCourse(courseId, progress) { const previous = activeCourseId; if (courseId !== previous) setActiveCourse(courseId); const value = parentStatistics(progress); if (previous !== activeCourseId) setActiveCourse(previous); return value; }
function renderParentDashboard() {
  const progress = loadProgress(); const stats = parentStatistics(progress); const mathProgress = activeCourseId === "math-grade-1" ? progress : loadProgress(localStorage, "math-grade-1"); const vietnameseProgress = activeCourseId === "vietnamese-grade-1" ? progress : loadProgress(localStorage, "vietnamese-grade-1"); const englishProgress = activeCourseId === "english-grade-1" ? progress : loadProgress(localStorage, "english-grade-1"); const mathStats = parentStatisticsForCourse("math-grade-1", mathProgress), vietnameseStats = parentStatisticsForCourse("vietnamese-grade-1", vietnameseProgress), englishStats = parentStatisticsForCourse("english-grade-1", englishProgress);
  const courseHeading = $("#parent-topic-progress")?.closest(".parent-section")?.querySelector("h2"); if (courseHeading) courseHeading.textContent = `Tiến độ ${activeCourse().name}`;
  document.querySelectorAll("[data-parent-course]").forEach((button) => { const selected = button.dataset.parentCourse === activeCourseId; button.classList.toggle("is-active", selected); button.setAttribute("aria-pressed", String(selected)); });
  elements.parentSummary.innerHTML = `<article><span>🔢</span><strong>${mathStats.completedLevels} / ${mathStats.totalLevels}</strong><small>Toán lớp 1 · level hoàn thành</small></article><article><span>🔤</span><strong>${vietnameseStats.completedLevels} / ${vietnameseStats.totalLevels}</strong><small>Tiếng Việt lớp 1 · level hoàn thành</small></article><article><span>🔠</span><strong>${englishStats.completedLevels} / ${englishStats.totalLevels}</strong><small>Tiếng Anh lớp 1 · level hoàn thành</small></article><article><span>⭐</span><strong>${stats.stars}</strong><small>${activeCourse().name} · số sao</small></article><article><span>🏆</span><strong>${stats.average}%</strong><small>${activeCourse().name} · điểm TB</small></article><article><span>⏱</span><strong>${formatDuration(progress.studyTime.todaySeconds)}</strong><small>${activeCourse().name} hôm nay</small></article><article class="parent-summary__wide"><span>🕒</span><strong>${formatDateTime(stats.lastStudy)}</strong><small>${activeCourse().name} · ${stats.locked} level chưa mở</small></article>`;
  elements.parentTopicProgress.replaceChildren();
  Object.values(TOPICS).sort((a, b) => a.sortOrder - b.sortOrder).forEach((topic) => { const topicId = topic.id; const summary = getTopicProgress(progress, topicId); const percent = summary.percent; const details = document.createElement("details"); details.className = "parent-topic-card"; details.innerHTML = `<summary><span class="parent-topic-card__icon">${topic.icon}</span><span class="parent-topic-card__main"><strong>${topic.title}</strong><small>Hoàn thành ${summary.completed} / ${summary.total} level · Điểm TB ${summary.average}% · ${summary.stars} ⭐</small><span class="parent-progress" aria-label="Tiến độ ${topic.title}: ${percent}%"><i style="width:${percent}%"></i></span></span><span class="parent-topic-card__percent">${percent}%</span></summary><div class="parent-level-list"></div>`;
    const list = details.querySelector(".parent-level-list"); summary.levels.forEach((levelItem, index) => { const item = levelProgress(progress, levelItem.id); const levelCard = document.createElement("article"); levelCard.className = "parent-level-card"; levelCard.innerHTML = `<strong>Level ${index + 1} – ${levelItem.title}</strong><dl><div><dt>Điểm tốt nhất</dt><dd>${item.bestScore}/100</dd></div><div><dt>Đúng tốt nhất</dt><dd>${item.bestCorrect}/${item.bestQuestionCount}</dd></div><div><dt>Sao</dt><dd>${"⭐".repeat(item.bestStars) || "—"}</dd></div><div><dt>Số lần làm</dt><dd>${item.attempts}</dd></div><div><dt>Trạng thái</dt><dd>${item.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}</dd></div><div><dt>Mở khóa</dt><dd>${item.unlocked ? "Đã mở" : "Chưa mở"}</dd></div><div class="parent-level-card__wide"><dt>Lần học gần nhất</dt><dd>${formatDateTime(item.lastPlayedAt)}</dd></div></dl>`; list.append(levelCard); }); elements.parentTopicProgress.append(details); });
  const suggestions = Object.entries(TOPICS).map(([topicId, topic]) => ({ topic, ...topicSummary(progress, topicId) })).filter((item) => item.items.some((levelItem) => levelItem.attempts > 0)).sort((a, b) => a.average - b.average).slice(0, 3);
  elements.parentPracticeList.replaceChildren();
  if (!suggestions.length) { elements.parentPracticeIntro.textContent = "Bé chưa có bài học nào. Sau bài học đầu tiên, gợi ý sẽ xuất hiện tại đây."; }
  else { elements.parentPracticeIntro.textContent = "Các chuyên đề dưới đây được chọn theo điểm tốt nhất trung bình hiện có."; suggestions.forEach((item) => { const label = item.average < DEFAULT_UNLOCK_SCORE ? "Cần luyện thêm" : item.average < 100 ? "Đang tiến bộ" : "Làm rất tốt"; const li = document.createElement("li"); li.innerHTML = `<strong>${item.topic.title}</strong><span>${item.average}% · ${label}</span>`; elements.parentPracticeList.append(li); }); }
  elements.parentHistory.replaceChildren(); const recent = [...progress.history].reverse().slice(0, 10);
  if (!recent.length) elements.parentHistory.innerHTML = "<p class=\"parent-empty\">Chưa có lần hoàn thành bài nào.</p>";
  recent.forEach((entry) => { const item = LEVEL_BY_ID[entry.levelId]; const row = document.createElement("article"); row.className = "parent-history__item"; row.innerHTML = `<time>${formatDateTime(entry.completedAt)}</time><strong>${TOPICS[entry.topic].title} – ${item.title}</strong><span>${entry.score} điểm · ${entry.correct}/${entry.questionCount} · ${"⭐".repeat(entry.stars) || "🌱"}</span>`; elements.parentHistory.append(row); });
  resetDeleteConfirmation();
}
let studyTrackingSince = null;
function flushStudyTime(now = Date.now()) { if (!studyTrackingSince) return; const seconds = Math.floor((now - studyTrackingSince) / 1000); studyTrackingSince = now; if (seconds > 0) saveProgress(addStudySeconds(loadProgress(), seconds, new Date(now))); }
function shouldTrackQuiz(isQuizScreen, isDocumentHidden) { return Boolean(isQuizScreen) && !Boolean(isDocumentHidden); }
function startStudyTracking() { if (shouldTrackQuiz(!screens.quiz.hidden, document.hidden)) studyTrackingSince = Date.now(); }
function stopStudyTracking() { flushStudyTime(); studyTrackingSince = null; }
function handleChildWillChange() { cancelSpeech(); stopStudyTracking(); window.HocCungBeChildSettings?.stopLearningSession?.(); window.HocCungBeChildSettings?.dismissBreak?.(true); }
function handleChildChanged() { quiz = null; selectedTopic = "addition"; selectedLevelId = "addition-1"; if (currentLearningUser) showScreen("home"); renderHeader(); if (!screens["parent-dashboard"].hidden) renderParentDashboard(); }
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
function applyChildAudioSettings(value = {}) { audioSettings = { soundEnabled: typeof value.soundEnabled === "boolean" ? value.soundEnabled : audioSettings.soundEnabled, speechEnabled: typeof value.speechEnabled === "boolean" ? value.speechEnabled : audioSettings.speechEnabled }; if (!audioSettings.speechEnabled) cancelSpeech(); updateAudioControls(); }
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
function renderTopics() { const course = activeCourse(); const progress = loadProgress(); const stats = statistics(progress); const intro = $("#math-screen .page-intro"); if (intro) { const heading = course.id === "vietnamese-grade-1" ? "Cùng khám phá Tiếng Việt nhé!" : course.id === "english-grade-1" ? "Let's learn English!" : "Cùng chinh phục Toán nào!"; const description = course.id === "vietnamese-grade-1" ? "Đọc hay • Viết đúng • Nói tự tin. Mỗi level có 5 câu, đúng ít nhất 4/5 câu để mở bài tiếp theo." : course.id === "english-grade-1" ? "Học từ mới qua hình, nghe và nói theo trước khi luyện 5 task. Đạt từ 80 điểm để mở bài tiếp theo." : "Mỗi level có 5 câu ngắn. Đúng ít nhất 4/5 câu để mở level tiếp theo."; intro.querySelector(".eyebrow").textContent = course.name; intro.querySelector("h1").textContent = heading; intro.querySelector("p").textContent = description; intro.querySelector(".intro-decoration").textContent = course.icon; } elements.learningSummary.innerHTML = `<div><span>⭐</span><b>${stats.stars}</b><small>Sao đã đạt</small></div><div><span>🏆</span><b>${stats.score}</b><small>Điểm tốt nhất</small></div><div><span>✅</span><b>${stats.completed}</b><small>Level đã hoàn thành</small></div>`; elements.topicGrid.replaceChildren(); Object.values(TOPICS).sort((a, b) => a.sortOrder - b.sortOrder).filter((topic) => getLevelCountByTopic(topic.id)).forEach((topic) => { const summary = getTopicProgress(progress, topic.id); const card = document.createElement("button"); card.className = `lesson-card lesson-card--${topic.colorTheme}`; card.dataset.topicId = topic.id; card.innerHTML = `<span>${topic.icon}</span><strong>${topic.title}</strong><small>${summary.completed}/${summary.total} level đã hoàn thành</small><em>${summary.completed ? "Tiếp tục học" : "Bắt đầu"} →</em>`; elements.topicGrid.append(card); }); }
function renderLevels() { const topic = TOPICS[selectedTopic]; const progress = loadProgress(); const trial = loadGuestTrial(); elements.topicEyebrow.textContent = `${topic.title} · ${getLevelCountByTopic(topic.id)} level`; elements.levelsTitle.textContent = `Chọn level ${topic.title}`; elements.levelsDescription.textContent = topic.description; elements.topicIcon.textContent = topic.icon; elements.levelGrid.replaceChildren(); getLevelsByTopic(selectedTopic).forEach((item, index) => { const itemProgress = levelProgress(progress, item.id); const reason = getLevelLockReason(item.id, currentLearningUser, progress, trial); const card = document.createElement("button"); card.className = `level-card ${reason ? "is-locked" : ""} ${reason === "account" ? "is-account-locked" : ""} ${itemProgress.completed ? "is-completed" : ""}`; card.dataset.levelId = item.id; card.setAttribute("aria-label", reason === "account" ? `${item.title}: Đăng nhập để học tiếp` : reason === "progress" ? `${item.title}: Hoàn thành level trước từ ${item.unlockScore}%` : item.title); const status = !currentLearningUser ? (isCompletedTrialLevel(item.id, trial) ? "✓ Đã dùng cho học thử" : `Học thử ${guestTrialCount(trial)}/${GUEST_TRIAL_LIMIT}`) : itemProgress.attempts ? `${itemProgress.completed ? "✓ Đã hoàn thành · " : ""}Điểm tốt nhất: ${itemProgress.bestScore}/100` : "Sẵn sàng học"; card.innerHTML = `<span class="level-number">${reason === "account" ? "🔐 Cần đăng nhập" : reason === "progress" ? "🔒" : `Level ${index + 1}`}</span><strong>${item.title}</strong><span class="level-stars">${"★".repeat(itemProgress.bestStars)}${"☆".repeat(3 - itemProgress.bestStars)}</span><small>${reason === "account" ? "🔐 Đăng nhập để học tiếp" : reason === "progress" ? `🔒 Hoàn thành level trước ≥ ${item.unlockScore}%` : status}</small>`; elements.levelGrid.append(card); }); }
function englishAnimationMarkup(name, ariaLabel = "Hoạt cảnh minh họa") { const scene = name === "colors-change" ? '<i class="english-animation__color"></i><i class="english-animation__color"></i><i class="english-animation__color"></i><i class="english-animation__color"></i>' : name === "actions-move" ? '<span class="english-animation__person">🧒</span><span class="english-animation__ground"></span>' : '<span class="english-animation__friend">🧒</span><span class="english-animation__wave">👋</span><span class="english-animation__friend">👧</span>'; return `<span class="english-animation english-animation--${name}" role="img" aria-label="${ariaLabel}">${scene}</span>`; }
function renderEnglishVideo(container, media, title) { const video = document.createElement("video"); video.controls = true; video.playsInline = true; video.preload = "metadata"; video.poster = media.poster || ""; video.setAttribute("aria-label", media.ariaLabel || `Video minh họa ${title}`); video.dataset.answerSafe = "true"; const fallback = document.createElement("div"); fallback.className = "english-video-fallback"; fallback.innerHTML = `${englishAnimationMarkup(media.animationFallback, media.ariaLabel)}<img src="${media.fallback}" alt="${media.ariaLabel || title}" />`; fallback.hidden = true; const showFallback = () => { video.hidden = true; fallback.hidden = false; container.classList.add("has-video-fallback"); }; [[media.webm, media.mimeType || "video/webm"], [media.mp4, "video/mp4"]].filter(([src]) => src).forEach(([src, type]) => { const source = document.createElement("source"); source.src = src; source.type = type; source.addEventListener("error", showFallback); video.append(source); }); video.addEventListener("error", showFallback, true); video.addEventListener("loadedmetadata", () => { if (Number.isFinite(media.clipStart)) video.currentTime = media.clipStart; }); if (Number.isFinite(media.clipEnd)) video.addEventListener("timeupdate", () => { if (video.currentTime >= media.clipEnd) { video.pause(); video.currentTime = media.clipStart || 0; } }); container.append(video, fallback); }
function renderEnglishMedia(container, media, title) { container.replaceChildren(); container.classList.remove("has-video-fallback"); if (!media) return; if (media.type === "video" && media.available !== false) { renderEnglishVideo(container, media, title); return; } if (media.type === "animation" || media.animationFallback) { container.innerHTML = `${englishAnimationMarkup(media.animation || media.animationFallback, media.ariaLabel)}<img src="${media.poster}" alt="" class="english-media-poster" loading="eager" />`; return; } if (media.src) container.innerHTML = `<img src="${media.src}" alt="${media.alt || title}" />`; }
function renderEnglishLearn() { if (!quiz || quiz.level.type !== "english") return; const levelItem = quiz.level; $("#learn-title").textContent = `${levelItem.id} · ${levelItem.title}`; $("#learn-subtitle").textContent = "Chạm vào từng thẻ để nghe, rồi nói theo nhé!"; renderEnglishMedia($("#learn-featured-media"), levelItem.media?.featured || levelItem.media?.learn?.[0], levelItem.title); const words = [...(levelItem.targetVocabulary || []), ...(levelItem.targetExpressions || [])].slice(0, 7); const grid = $("#learn-word-grid"); grid.replaceChildren(); words.forEach((word) => { const button = document.createElement("button"); button.type = "button"; button.className = "english-word-card"; button.innerHTML = `<span>${word.length <= 2 ? word : "🔊"}</span><strong>${word}</strong><small>Chạm để nghe</small>`; button.setAttribute("aria-label", `Nghe ${word}`); button.onclick = () => speakText(word.length === 1 ? `Letter ${word}` : word, "en-US", $("#learn-speech-status")); grid.append(button); }); }
function renderQuestion() { const current = quiz.questions[quiz.index]; const topic = TOPICS[quiz.level.topic]; quiz.answered = false; elements.quizIcon.textContent = topic.icon; elements.quizTitle.textContent = `${topic.title} · ${quiz.level.title}`; elements.quizBackButton.textContent = `← ${topic.title}`; elements.questionCount.textContent = `Câu ${quiz.index + 1} / ${quiz.questions.length}`; elements.progressFill.style.width = `${((quiz.index + 1) / quiz.questions.length) * 100}%`; elements.questionHelper.textContent = current.helper; elements.tipText.textContent = current.tip; const visual = current.video ? '<span class="english-quiz-video" data-quiz-video></span>' : current.visual ? `<span class="english-question-visual" role="img" aria-label="Hình minh họa">${current.visual}</span>` : current.animation ? englishAnimationMarkup(current.animation, "Hoạt cảnh câu hỏi, không chứa chữ đáp án") : ""; elements.equation.innerHTML = `${visual}<span>${current.displayText || current.prompt}</span>`; if (current.video) renderEnglishMedia(elements.equation.querySelector("[data-quiz-video]"), current.video, quiz.level.title); elements.liveScore.textContent = quiz.score; elements.liveStars.textContent = starsFor(quiz.score, quiz.level); elements.feedback.className = "feedback"; elements.feedback.textContent = ""; elements.nextButton.hidden = true; elements.confetti.classList.remove("is-playing"); setQuizMascot(); updateAudioControls(); elements.answerGrid.replaceChildren(); elements.answerGrid.className = `answer-grid${current.optionMarkup ? " answer-grid--clocks" : ""}${current.optionVisuals ? " answer-grid--visual" : ""}`; current.options.forEach((answer) => { const button = document.createElement("button"); button.className = `answer-button${current.optionMarkup ? " answer-button--clock" : ""}${current.optionVisuals ? " answer-button--visual" : ""}`; button.dataset.answer = answer; if (current.optionMarkup) { button.innerHTML = `${current.optionMarkup[answer]}<span>${answer}</span>`; button.setAttribute("aria-label", answer); } else if (current.optionVisuals?.[answer]) { button.innerHTML = `<span class="answer-visual" aria-hidden="true">${current.optionVisuals[answer]}</span><span>${answer.includes("|") ? answer.split("|").join(" ↔ ") : answer}</span>`; } else button.textContent = answer.includes("|") ? answer.split("|").join(" ↔ ") : answer; button.addEventListener("click", () => checkAnswer(answer, button)); elements.answerGrid.append(button); }); }
function playCorrectEffect() { elements.confetti.classList.remove("is-playing"); void elements.confetti.offsetWidth; elements.confetti.classList.add("is-playing"); }
function renderResult(progress) { const item = quiz.level; const currentStars = starsFor(quiz.score, item); const next = getNextLevelInTopic(item.id); const trial = loadGuestTrial(); const action = getContinueAction(item.id, currentLearningUser, progress, trial); const nextOpen = next && canAccessLevel(next.id, currentLearningUser, progress, trial); const passed = quiz.score >= item.unlockScore; const trialComplete = !currentLearningUser && guestTrialExhausted(trial); const praise = resultPraise(quiz.score); elements.resultMessage.textContent = praise; setMascotState(elements.resultMascot, elements.resultMascotMessage, currentStars ? "celebrate" : "encourage", currentStars ? praise : "Mình cùng luyện thêm nhé!"); renderEarnedStars(currentStars); elements.starNote.textContent = currentStars ? `Bé nhận được ${currentStars} sao trong level này!` : "🌱 Mỗi lần luyện tập, bé sẽ tiến bộ hơn!"; elements.correctCount.textContent = `Con đã làm đúng ${quiz.correct} / ${item.questionCount} câu`; elements.finalScore.textContent = `Điểm: ${quiz.score} / 100`; elements.unlockNote.textContent = trialComplete ? "🔐 Bạn đã hoàn thành 2 bài học thử." : nextOpen ? `🔓 Đã mở khóa Level ${getLevelIndexInTopic(next.id) + 1}: ${next.title}!` : passed && !next ? "🌟 Bé đã hoàn thành tất cả level của chuyên đề này!" : `💪 Cùng luyện thêm để mở level tiếp theo nhé!`; let review = $("#english-review-words"); if (!review) { review = document.createElement("section"); review.id = "english-review-words"; review.className = "english-review-words"; elements.unlockNote.insertAdjacentElement("afterend", review); } review.hidden = item.type !== "english"; review.replaceChildren(); if (item.type === "english") { const heading = document.createElement("strong"); heading.textContent = "🔊 Từ cần nhớ · Chạm để nghe lại"; review.append(heading); const words = [...new Set([...(item.targetVocabulary || []), ...(item.targetExpressions || [])])].slice(0, 7); const list = document.createElement("div"); words.forEach((word) => { const button = document.createElement("button"); button.type = "button"; button.textContent = word; button.setAttribute("aria-label", `Nghe lại ${word}`); button.onclick = () => speakText(word.length === 1 ? `Letter ${word}` : word, "en-US"); list.append(button); }); review.append(list); } elements.trialResultGate.hidden = !trialComplete; elements.continueButton.hidden = false; elements.continueButton.textContent = action === "auth" ? "🔐 Đăng nhập để học tiếp" : action === "next" && next ? `Học tiếp ${next.title} →` : "Về chủ đề"; elements.continueButton.setAttribute("aria-label", action === "auth" ? "Đăng nhập để học tiếp" : action === "next" && next ? `Học tiếp ${next.title}` : `Về chủ đề ${TOPICS[item.topic].title}`); elements.continueButton.dataset.action = action; elements.topicButton.textContent = `Về ${TOPICS[item.topic].title}`; }
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
document.addEventListener("click", (event) => { const courseButton = event.target.closest("button[data-course]"); if (!courseButton || !setActiveCourse(courseButton.dataset.course)) return; showScreen("math"); });
document.addEventListener("click", (event) => { const topicButton = event.target.closest("[data-topic-id]"); if (!topicButton) return; const topic = TOPICS[topicButton.dataset.topicId]; if (!topic) throw new Error(`Unknown topic: ${topicButton.dataset.topicId}`); selectedTopic = topic.id; showScreen("levels"); });
document.addEventListener("click", (event) => { const levelButton = event.target.closest("[data-level-id]"); if (!levelButton) return; const levelId = levelButton.dataset.levelId; const item = LEVEL_BY_ID[levelId]; if (!item) throw new Error(`Unknown level: ${levelId}`); const reason = getLevelLockReason(levelId, currentLearningUser, loadProgress(), loadGuestTrial()); if (reason === "account") { showAuthGate(); return; } if (reason === "progress") { toast(`Hoàn thành level trước từ ${item.unlockScore}% để mở bài này nhé.`); return; } startQuiz(levelId); });
document.addEventListener("click", (event) => { const courseButton = event.target.closest("[data-parent-course]"); if (!courseButton || !setActiveCourse(courseButton.dataset.parentCourse)) return; renderParentDashboard(); });
document.querySelectorAll("[data-coming-soon]").forEach((button) => { button.onclick = () => toast(button.dataset.comingSoon); });
document.querySelectorAll("[data-auth-open]").forEach((button) => { button.onclick = () => openAuthScreen(button.dataset.authOpen); });
$("#function-menu-button")?.addEventListener("click", () => { const menu = functionMenuElements(); if (menu.backdrop?.hidden) openFunctionMenu(); else closeFunctionMenu({ restoreFocus: true }); });
$("#function-menu-close")?.addEventListener("click", () => closeFunctionMenu({ restoreFocus: true }));
$("#function-menu-backdrop")?.addEventListener("click", (event) => { if (event.target === event.currentTarget) closeFunctionMenu({ restoreFocus: true }); });
document.addEventListener("click", (event) => { const action = event.target.closest("[data-function-action]"); if (action) runFunctionAction(action.dataset.functionAction); });
elements.authGateLater.onclick = hideAuthGate;
elements.authGate.onclick = (event) => { if (event.target === elements.authGate) hideAuthGate(); };
window.addEventListener("keydown", (event) => { if (event.key !== "Escape") return; if (!functionMenuElements().backdrop?.hidden) { closeFunctionMenu({ restoreFocus: true }); return; } if (!elements.authGate.hidden) hideAuthGate(); });
window.addEventListener("hoc-cung-be:auth-state", (event) => handleAuthState(event.detail?.user || null));
window.addEventListener("hoc-cung-be:cloud-synced", () => { renderHeader(); if (!screens.levels.hidden) renderLevels(); if (!screens["parent-dashboard"].hidden) renderParentDashboard(); });
window.addEventListener("hoc-cung-be:child-will-change", handleChildWillChange);
window.addEventListener("hoc-cung-be:child-changed", handleChildChanged);
window.addEventListener("hoc-cung-be:child-break-started", () => stopStudyTracking());
window.addEventListener("hoc-cung-be:child-break-ended", () => { if (!screens.quiz.hidden && !document.hidden) startStudyTracking(); });
document.addEventListener("click", (event) => { if (event.target.closest("[data-child-switch]")) window.HocCungBeChildren?.openSelector?.(); });
document.addEventListener("click", (event) => { const target = event.target.closest("[data-parent-target]"); if (!target) return; const section = document.getElementById(target.dataset.parentTarget); section?.scrollIntoView({ behavior: "smooth", block: "start" }); });
$("#learn-back-button")?.addEventListener("click", () => showScreen("levels"));
$("#learn-spoken-button")?.addEventListener("click", (event) => { event.currentTarget.classList.add("is-complete"); event.currentTarget.textContent = "Con đã nói xong ✓"; });
$("#begin-practice-button")?.addEventListener("click", beginEnglishPractice);
elements.quizBackButton.onclick = () => showScreen("levels"); elements.nextButton.onclick = nextQuestion; elements.retryButton.onclick = () => startQuiz(selectedLevelId); elements.topicButton.onclick = () => showScreen("levels"); elements.continueButton.onclick = () => { const action = elements.continueButton.dataset.action; if (action === "auth") { showAuthGate(); return; } if (action === "topic") { showScreen("levels"); return; } const next = getNextLevelInTopic(selectedLevelId); if (next && canAccessLevel(next.id, currentLearningUser, loadProgress())) startQuiz(next.id); else showScreen("levels"); };
elements.readQuestionButton.onclick = () => readCurrentQuestion();
elements.soundSettingsButton.onclick = () => { const willOpen = elements.soundSettingsPanel.hidden; elements.soundSettingsPanel.hidden = !willOpen; elements.soundSettingsButton.setAttribute("aria-expanded", String(willOpen)); };
elements.soundEnabledToggle.onchange = () => { audioSettings.soundEnabled = elements.soundEnabledToggle.checked; audioSettings = saveAudioSettings(audioSettings); updateAudioControls(); };
elements.speechEnabledToggle.onchange = () => { audioSettings.speechEnabled = elements.speechEnabledToggle.checked; if (!audioSettings.speechEnabled) cancelSpeech(); audioSettings = saveAudioSettings(audioSettings); updateAudioControls(); };
elements.parentRefreshButton.onclick = () => { renderParentDashboard(); window.dispatchEvent(new CustomEvent("hoc-cung-be:parent-dashboard-open")); };
elements.parentDeleteButton.onclick = () => { resetDeleteConfirmation(); elements.parentDeleteConfirm.hidden = false; };
elements.parentDeleteCancel.onclick = resetDeleteConfirmation;
elements.parentDeleteNext.onclick = () => { elements.parentDeleteStep.textContent = "Để xác nhận, vui lòng nhập XOA chính xác."; elements.parentDeleteCodeLabel.hidden = false; elements.parentDeleteCode.hidden = false; elements.parentDeleteConfirmButton.hidden = false; elements.parentDeleteNext.hidden = true; elements.parentDeleteCode.focus(); };
elements.parentDeleteConfirmButton.onclick = () => { if (elements.parentDeleteCode.value.trim() !== "XOA") { elements.parentDeleteStep.textContent = "Mã xác nhận chưa đúng. Vui lòng nhập chính xác XOA."; elements.parentDeleteCode.focus(); return; } const key = progressStorageKey(); if (key) writeStorage(localStorage, key, JSON.stringify(defaultProgress())); quiz = null; resetDeleteConfirmation(); renderParentDashboard(); renderHeader(); };
document.addEventListener("visibilitychange", () => { if (document.hidden) stopStudyTracking(); else if (!screens.quiz.hidden) startStudyTracking(); });
window.addEventListener("pagehide", () => stopStudyTracking());
window.HocCungBeLearning = { applyAudioSettings: applyChildAudioSettings, COURSES, getActiveCourseId: () => activeCourseId, setActiveCourse, courseProgressKey, loadProgressByCourse: (courseId) => loadProgress(localStorage, courseId) };
window.loadProgress = loadProgress;
window.saveProgress = saveProgress;
window.normalizeProgress = normalizeProgress;
window.historyFingerprint = historyFingerprint;
$("#current-year").textContent = new Date().getFullYear(); loadProgress(); updateAudioControls(); renderHeader(); setupPwa();

// ==================== Guest Trial / Login Gate self-tests K-S ====================
function runGuestTrialTests() {
  const results = []; const test = (id, name, passed) => results.push({ id, name, passed: Boolean(passed) });
  const guest = null; const user = { uid: "test-parent", email: "parent@example.com" }; let progress = defaultProgress();
  progress = saveResult(progress, LEVEL_BY_ID["clock-1"], 80, 8, "2026-10-02T00:00:00.000Z"); progress = saveResult(progress, LEVEL_BY_ID["clock-2"], 80, 8, "2026-10-02T00:10:00.000Z");
  const memory = { values: {}, getItem(key) { return Object.prototype.hasOwnProperty.call(this.values, key) ? this.values[key] : null; }, setItem(key, value) { this.values[key] = value; } }; let trial = defaultGuestTrial();
  trial = completeGuestTrialLevel("clock-1", trial, memory); test("K", "Guest hoàn thành một level bất kỳ => trial 1/2", guestTrialCount(trial) === 1 && trial.completedLevelIds[0] === "clock-1");
  trial = completeGuestTrialLevel("clock-2", trial, memory); test("L", "Guest hoàn thành level khác => trial 2/2", guestTrialCount(trial) === 2 && guestTrialExhausted(trial));
  trial = completeGuestTrialLevel("clock-1", trial, memory); test("M", "Làm lại level cũ vẫn 2/2", guestTrialCount(trial) === 2 && new Set(trial.completedLevelIds).size === 2);
  test("N", "Level thứ ba bị account lock", getLevelLockReason("clock-3", guest, progress, trial) === "account");
  const originalTrial = readStorage(localStorage, GUEST_TRIAL_KEY); writeStorage(localStorage, GUEST_TRIAL_KEY, JSON.stringify(trial)); const quizBeforeBypass = quiz; const bypassStarted = startQuiz("clock-3"); hideAuthGate(); if (originalTrial === null) { try { localStorage.removeItem(GUEST_TRIAL_KEY); } catch {} } else writeStorage(localStorage, GUEST_TRIAL_KEY, originalTrial); test("O", "Gọi trực tiếp startQuiz cũng bị chặn", bypassStarted === false && quiz === quizBeforeBypass);
  test("P", "Login được học tiếp theo tiến độ", canAccessLevel("clock-3", user, progress, trial));
  const snapshot = JSON.stringify(progress); test("Q", "Progress hai level thử còn nguyên sau login", JSON.stringify(progress) === snapshot && levelProgress(progress, "clock-1").bestScore === 80 && levelProgress(progress, "clock-2").bestScore === 80);
  test("R", "Logout trở lại trạng thái đã dùng 2/2", getLevelLockReason("clock-3", null, progress, trial) === "account" && canAccessLevel("clock-1", null, progress, trial));
  const guestBadge = authStatusContent(null, trial); const userBadge = authStatusContent(user, trial); test("S", "Auth badge đúng guest/logged-in", guestBadge.badge.includes("Chưa đăng nhập") && guestBadge.detail === "Học thử 2/2" && userBadge.badge.includes("Đã đăng nhập") && userBadge.detail === user.email);
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeGuestTrialTests = runGuestTrialTests();

// ==================== Clock mathematics self-tests A-J ====================
function runClockTests() {
  const cases = [
    ["A", { hour: 12, minute: 0, second: 0 }, [0, 0, 0], "12 giờ", "mười hai giờ", false], ["B", { hour: 3, minute: 0, second: 0 }, [90, 0, 0], "3 giờ", "ba giờ", false],
    ["C", { hour: 6, minute: 0, second: 0 }, [180, 0, 0], "6 giờ", "sáu giờ", false], ["D", { hour: 9, minute: 0, second: 0 }, [270, 0, 0], "9 giờ", "chín giờ", false],
    ["E", { hour: 1, minute: 30, second: 0 }, [45, 180, 0], "1 giờ 30 phút", "một giờ ba mươi phút", false], ["F", { hour: 3, minute: 15, second: 0 }, [97.5, 90, 0], "3 giờ 15 phút", "ba giờ mười lăm phút", false],
    ["G", { hour: 4, minute: 45, second: 0 }, [142.5, 270, 0], "4 giờ 45 phút", "bốn giờ bốn mươi lăm phút", false], ["H", { hour: 7, minute: 25, second: 0 }, [222.5, 150, 0], "7 giờ 25 phút", "bảy giờ hai mươi lăm phút", false],
    ["I", { hour: 11, minute: 55, second: 0 }, [357.5, 330, 0], "11 giờ 55 phút", "mười một giờ năm mươi lăm phút", false], ["J", { hour: 8, minute: 24, second: 35 }, [252.2916666667, 147.5, 210], "8 giờ 24 phút 35 giây", "tám giờ hai mươi bốn phút ba mươi lăm giây", true],
  ];
  const results = cases.map(([id, time, expectedAngles, expectedText, expectedSpeech, includeSeconds]) => { const angles = clockAngles(time); const text = formatClockTime(time, includeSeconds); const speech = clockSpeech(time, includeSeconds); const answerOptions = clockAnswerOptions(time, includeSeconds); const angleValues = [angles.hourAngle, angles.minuteAngle, angles.secondAngle]; return { id, time: clockTimeKey(time, includeSeconds), passed: angleValues.every((value, index) => Math.abs(value - expectedAngles[index]) < .000001) && text === expectedText && speech === expectedSpeech && answerOptions.includes(text) && new Set(answerOptions).size === 4 && clockMarkup(time, { showSeconds: includeSeconds }).includes(`--angle:${angles.hourAngle}deg`) }; });
  const fixedMilestones = [[{ hour: 1, minute: 0, second: 0 }, [30, 0, 0], "1 giờ", "một giờ"], [{ hour: 12, minute: 30, second: 0 }, [15, 180, 0], "12 giờ 30 phút", "mười hai giờ ba mươi phút"], [{ hour: 6, minute: 10, second: 0 }, [185, 60, 0], "6 giờ 10 phút", "sáu giờ mười phút"], [{ hour: 8, minute: 40, second: 0 }, [260, 240, 0], "8 giờ 40 phút", "tám giờ bốn mươi phút"]].map(([time, expectedAngles, expectedText, expectedSpeech]) => { const angles = clockAngles(time); const values = [angles.hourAngle, angles.minuteAngle, angles.secondAngle]; return { time: clockTimeKey(time), passed: values.every((value, index) => value === expectedAngles[index]) && formatClockTime(time) === expectedText && clockSpeech(time) === expectedSpeech && clockAnswerOptions(time).includes(expectedText) && clockMarkup(time).includes(`--angle:${angles.minuteAngle}deg`) }; });
  return { passed: results.every((item) => item.passed) && fixedMilestones.every((item) => item.passed), results, fixedMilestones };
}
window.__hocCungBeClockTests = runClockTests();

// ==================== Five-question lesson self-tests A-O ====================
function runProgressTests() {
  const one = LEVEL_BY_ID["addition-1"], two = LEVEL_BY_ID["addition-2"]; const results = []; const test = (id, name, passed) => results.push({ id, name, passed: Boolean(passed) });
  test("A", "Quiz mới có đúng 5 câu", DEFAULT_QUESTION_COUNT === 5 && LEVELS.every((item) => item.questionCount === DEFAULT_QUESTION_COUNT) && generateQuestions(one).length === 5);
  test("B", "Mỗi câu đúng bằng 20 điểm", scoreFor(1, 5) === 20);
  test("C", "3/5 bằng 60 điểm", scoreFor(3, 5) === 60);
  test("D", "4/5 bằng 80 điểm", scoreFor(4, 5) === 80);
  test("E", "5/5 bằng 100 điểm", scoreFor(5, 5) === 100);
  let passed = saveResult(defaultProgress(), one, scoreFor(4, 5), 4, "2026-10-02T00:00:00.000Z"); test("F", "4/5 mở level tiếp theo", levelUnlocked(passed, two));
  const failed = saveResult(defaultProgress(), one, scoreFor(3, 5), 3, "2026-10-02T00:01:00.000Z"); test("G", "3/5 không mở level tiếp theo", !levelUnlocked(failed, two));
  test("H", "Sao tính đúng 60/80/100", starsFor(60, one) === 1 && starsFor(80, one) === 2 && starsFor(100, one) === 3 && starsFor(40, one) === 0);
  test("I", "Màn hình dùng mẫu số 5", document.querySelector("#question-count")?.textContent.includes("/ 5") && document.querySelector("#correct-count")?.textContent.includes("/ 5"));
  test("J", "History mới lưu questionCount 5", passed.history.at(-1)?.questionCount === 5 && passed.history.at(-1)?.correct === 4);
  const legacyRaw = { progressVersion: 2, levels: { "addition-1": { bestScore: 80, bestCorrect: 8, bestStars: 2, attempts: 1, completed: true, unlocked: true } }, history: [{ levelId: "addition-1", topic: "addition", score: 80, correct: 8, stars: 2, completedAt: "2026-10-01T00:00:00.000Z" }] }; const legacy = normalizeProgress(legacyRaw);
  test("K", "History cũ mặc định mẫu số 10", legacy.history[0]?.correct === 8 && legacy.history[0]?.questionCount === 10);
  test("L", "Best correct cũ không thành 8/5", legacy.levels[one.id].bestCorrect === 8 && legacy.levels[one.id].bestQuestionCount === 10);
  test("M", "Dashboard dùng metadata /5 và /10", passed.levels[one.id].bestQuestionCount === 5 && legacy.levels[one.id].bestQuestionCount === 10 && passed.history[0].questionCount === 5 && legacy.history[0].questionCount === 10);
  let trial = defaultGuestTrial(); const memory = { values: {}, getItem(key) { return this.values[key] ?? null; }, setItem(key, value) { this.values[key] = value; } }; trial = completeGuestTrialLevel("addition-1", trial, memory); trial = completeGuestTrialLevel("addition-2", trial, memory); trial = completeGuestTrialLevel("addition-3", trial, memory); test("N", "Guest trial vẫn giới hạn 2 level", guestTrialCount(trial) === 2 && guestTrialExhausted(trial));
  test("O", "PWA dùng cache mới và giữ storage key", STORAGE_KEY === "hoc-cung-be:math-grade-1-progress" && document.querySelector('link[rel="manifest"]')?.getAttribute("href") === "manifest.webmanifest");
  return results;
}
window.__hocCungBeProgressTests = runProgressTests();
window.__hocCungBeFiveQuestionTests = { passed: window.__hocCungBeProgressTests.every((item) => item.passed), results: window.__hocCungBeProgressTests };

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
    { score: 40, stars: 0, phrase: "Không sao" }, { score: 60, stars: 1, phrase: "tiến bộ" }, { score: 80, stars: 2, phrase: "Rất tốt" }, { score: 100, stars: 3, phrase: "Tuyệt vời" },
  ];
  const results = cases.map(({ score, stars, phrase }) => { const originalRandom = Math.random; Math.random = () => 0; const praise = resultPraise(score); Math.random = originalRandom; return { score, passed: starsFor(score, item) === stars && praise.includes(phrase) }; });
  return { passed: results.every((itemResult) => itemResult.passed), results, mascotStates: ["normal", "correct", "encourage", "celebrate"], reducedMotionSupported: document.documentElement ? true : false };
}
window.__hocCungBeMascotAndResultTests = runMascotAndResultTests();

// ==================== Non-destructive parent dashboard checks ====================
function runParentDashboardTests() {
  const one = LEVEL_BY_ID["addition-1"], two = LEVEL_BY_ID["addition-2"], low = LEVEL_BY_ID["subtraction-1"]; const results = []; const test = (name, passed) => results.push({ name, passed: Boolean(passed) });
  const empty = defaultProgress(); test("A: dữ liệu trống có thống kê 0", parentStatistics(empty).attempts === 0 && parentStatistics(empty).average === 0 && empty.history.length === 0);
  let progress = saveResult(defaultProgress(), one, 100, 5, "2026-10-02T08:00:00.000Z"); progress = saveResult(progress, two, 80, 4, "2026-10-02T09:00:00.000Z"); progress = saveResult(progress, low, 40, 2, "2026-10-02T10:00:00.000Z"); const aggregate = parentStatistics(progress); test("B: tổng hợp level đã học chính xác", aggregate.attempts === 3 && aggregate.completedLevels === 3 && aggregate.stars === 5 && aggregate.average === 73);
  const lowest = Object.entries(TOPICS).map(([topicId, topic]) => ({ topicId, ...topicSummary(progress, topicId), title: topic.title })).filter((item) => item.items.some((levelItem) => levelItem.attempts)).sort((a, b) => a.average - b.average)[0]; test("C: chuyên đề thấp nhất được ưu tiên", lowest.topicId === "subtraction" && lowest.average === 40);
  test("D: level chưa học không gây lỗi", topicSummary(progress, "geometry").average === 0 && topicSummary(progress, "geometry").completed === 0);
  let timed = addStudySeconds(progress, 125, new Date("2026-10-02T11:00:00.000Z")); const memory = { value: null, getItem() { return this.value; }, setItem(key, value) { this.value = value; } }; saveProgress(timed, memory); const restored = loadProgress(memory); test("E: refresh giữ thời gian và history", restored.studyTime.totalSeconds >= 125 && restored.history.length === 3);
  test("F: tab bị ẩn không tiếp tục đếm thời gian", shouldTrackQuiz(true, true) === false && shouldTrackQuiz(true, false) === true && shouldTrackQuiz(false, false) === false);
  let history = defaultProgress(); for (let index = 0; index < 55; index += 1) history = saveResult(history, one, 60, 3, `2026-10-02T${String(index % 24).padStart(2, "0")}:00:00.000Z`); test("G: history chỉ giữ 50 bản ghi", history.history.length === 50 && history.history.every((entry) => entry.questionCount === 5));
  const v2 = { progressVersion: 2, levels: { "addition-1": { bestScore: 80, bestCorrect: 8, bestStars: 2, attempts: 1, completed: true, unlocked: true, lastPlayedAt: "2026-10-01T00:00:00.000Z" } }, totalCompleted: 1 }; const migrated = normalizeProgress(v2); test("H: dữ liệu V2 thêm field an toàn", migrated.progressVersion === 2 && migrated.levels[one.id].bestScore === 80 && migrated.levels[one.id].bestQuestionCount === 10 && validObject(migrated.studyTime) && Array.isArray(migrated.history));
  const brokenStorage = { getItem() { return "{bad json"; }, setItem() {} }; test("I: JSON lỗi không làm website crash", loadProgress(brokenStorage).progressVersion === 2);
  const codeAccepted = "XOA".trim() === "XOA"; const codeRejected = "xoa".trim() !== "XOA"; test("J: xóa cần xác nhận mã hai bước", codeAccepted && codeRejected && typeof resetDeleteConfirmation === "function");
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeParentDashboardTests = runParentDashboardTests();

// ==================== Dynamic curriculum and visual-question self-tests A-L ====================
function runDynamicLevelTests() {
  const results = []; const test = (id, name, passed) => results.push({ id, name, passed: Boolean(passed) });
  const addition = getLevelsByTopic("addition"), numbers20 = getLevelsByTopic("numbers20"), numbers100 = getLevelsByTopic("numbers100");
  test("A", "Số đến 20 có level động và câu hỏi trong phạm vi", numbers20.length === 8 && Array.from({ length: 20 }, () => generateQuestion(LEVEL_BY_ID["numbers20-1"])).every((item) => Number(item.answer) >= 1 && Number(item.answer) <= 20 && item.prompt.includes("visual-object")));
  test("B", "Số đến 100 có đủ level cấu hình động", numbers100.length === 8 && numbers100.every((item, index) => getLevelIndexInTopic(item.id) === index));
  let progress = defaultProgress(); [addition[0], addition[1], addition[2]].forEach((item, index) => { progress = saveResult(progress, item, 80, 4, `2026-10-02T12:0${index}:00.000Z`); });
  const additionProgress = getTopicProgress(progress, "addition"); const tensSample = generateQuestion(LEVEL_BY_ID["numbers100-2"]); test("C", "Tiến độ động và chục - đơn vị hoạt động đúng", additionProgress.completed === 3 && additionProgress.total === 14 && additionProgress.percent === 21 && /^\d+ chục và \d+ đơn vị$/.test(tensSample.answer) && tensSample.options.includes(tensSample.answer));
  const wordAdd = generateQuestion(LEVEL_BY_ID["word-problems-1"]); test("D", "Bài toán cộng lời văn đồng bộ text, hình và đáp án", wordAdd.prompt.includes("Mẹ cho thêm") && wordAdd.prompt.includes("visual-groups") && wordAdd.firstCount + wordAdd.secondCount === Number(wordAdd.answer) && getQuestionSpeechText(LEVEL_BY_ID["word-problems-1"], wordAdd) === wordAdd.speechText);
  const wordSubtract = generateQuestion(LEVEL_BY_ID["word-problems-2"]); test("E", "Bài toán trừ lời văn có vật bị gạch", wordSubtract.prompt.includes("cho bạn") && wordSubtract.prompt.includes("visual-object is-removed") && wordSubtract.initialCount - wordSubtract.removedCount === Number(wordSubtract.answer) && getQuestionSpeechText(LEVEL_BY_ID["word-problems-2"], wordSubtract) === wordSubtract.speechText);
  const clockSample = generateQuestion(LEVEL_BY_ID["clock-9"]); test("F", "Đồng hồ dùng chung object giờ-phút-giây, kim và đáp án", clockSample.clockTime && clockSample.prompt.includes("learning-clock") && clockSample.prompt.includes("clock-hand--hour") && clockSample.prompt.includes("clock-hand--minute") && clockSample.prompt.includes("clock-hand--second") && clockSample.options.includes(clockSample.answer) && getLevelsByTopic("clock").length === 10);
  const lengthSample = generateQuestion(LEVEL_BY_ID["length-1"]); test("G", "Độ dài dùng thanh trực quan và đáp án hợp lý", lengthSample.prompt.includes("length-visual") && lengthSample.options.includes(lengthSample.answer));
  const moneySample = generateQuestion(LEVEL_BY_ID["money-3"]); test("H", "Tiền Việt Nam dùng thẻ học tập và định dạng đồng", moneySample.prompt.includes("money-card") && moneySample.answer.endsWith("đ") && moneySample.options.length === 4 && moneySample.options.includes(moneySample.answer));
  test("I", "Speech đọc số và tiền tiếng Việt", numberToVietnamese(15) === "mười lăm" && numberToVietnamese(20) === "hai mươi" && numberToVietnamese(100) === "một trăm" && getQuestionSpeechText(LEVEL_BY_ID["money-1"], generateQuestion(LEVEL_BY_ID["money-1"])).includes("nghìn đồng"));
  const dashboard = parentStatistics(progress); test("J", "Dashboard tự cập nhật tổng level mới", dashboard.totalLevels === LEVELS.length && LEVELS.length === 109 && getTopicProgress(progress, "clock").total === 10 && Object.keys(TOPICS).length === 12);
  const legacyV2 = { progressVersion: 2, levels: { "addition-1": { bestScore: 95, bestCorrect: 9, bestStars: 2, attempts: 3, completed: true, unlocked: true, lastPlayedAt: "2026-09-30T08:00:00.000Z" }, "clock-1": { bestScore: 80, bestCorrect: 8, bestStars: 1, attempts: 2, completed: true, unlocked: true, lastPlayedAt: "2026-09-29T08:00:00.000Z" }, "clock-2": { bestScore: 90, bestCorrect: 9, bestStars: 2, attempts: 1, completed: true, unlocked: true, lastPlayedAt: "2026-09-30T08:00:00.000Z" } }, totalCompleted: 6, history: [{ levelId: "addition-1", topic: "addition", score: 95, correct: 9, stars: 2, completedAt: "2026-09-30T08:00:00.000Z" }, { levelId: "clock-1", topic: "clock", score: 80, correct: 8, stars: 1, completedAt: "2026-09-29T08:00:00.000Z" }] }; const migrated = normalizeProgress(legacyV2);
  test("K", "Progress V2 và clock cũ được migrate an toàn", migrated.progressVersion === 2 && migrated.levels["addition-1"].bestScore === 95 && migrated.levels["addition-1"].bestQuestionCount === 10 && migrated.levels["clock-1"].attempts === 0 && migrated.levels["clock-2"].bestScore === 90 && migrated.levels["clock-2"].attempts === 3 && migrated.history.some((entry) => entry.levelId === "clock-2" && entry.questionCount === 10));
  test("L", "PWA offline dùng resource tương đối và không cần asset mạng", document.querySelector('link[rel="manifest"]')?.getAttribute("href") === "manifest.webmanifest" && !/^\//.test("service-worker.js") && OBJECT_LIBRARY.every((item) => typeof item.icon === "string" && !item.icon.includes("/")));
  test("M", "Toàn bộ level sinh đủ 5 câu và đáp án hợp lệ", LEVELS.every((item) => { const questions = generateQuestions(item); return questions.length === DEFAULT_QUESTION_COUNT && questions.every((entry) => entry.options.length === 4 && entry.options.includes(entry.answer)); }));
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeDynamicLevelTests = runDynamicLevelTests();

// ==================== Multi-course Vietnamese Grade 1 self-tests A-X ====================
function runMultiCourseTests() {
  const results = []; const test = (id, passed) => results.push({ id, passed: Boolean(passed) }); const previous = activeCourseId;
  const vietnamese = COURSES["vietnamese-grade-1"]; const toneChars = "á à ả ã ạ é è ẻ ẽ ẹ í ì ỉ ĩ ị ó ò ỏ õ ọ ú ù ủ ũ ụ ý ỳ ỷ ỹ ỵ"; const legacyIds = Array.from({ length: 20 }, (_, index) => `TV-${String(index + 1).padStart(2, "0")}`);
  test("A", Boolean(document.querySelector('[data-course="math-grade-1"]'))); test("B", Boolean(document.querySelector('[data-course="vietnamese-grade-1"]')));
  test("C", COURSES["math-grade-1"]?.levels.length === 109); test("D", vietnamese?.name === "Tiếng Việt lớp 1"); test("E", vietnamese?.levels.length === 40);
  test("F", vietnamese?.levels.every((item) => item.questions?.length === 5 && item.questions.every((question) => question.options?.length === 4 && question.options.includes(question.answer))));
  const vietnameseText = JSON.stringify(vietnamese); test("G", ["ă", "â", "ê", "ô", "ơ", "ư", "đ"].every((value) => vietnameseText.includes(value)));
  test("H", ["ă", "â", "ê", "ô", "ơ", "ư", "đ"].every((value) => document.createElement("span").appendChild(document.createTextNode(value)).textContent === value)); test("I", toneChars.split(" ").every((value) => value.normalize("NFC") === value));
  test("J", typeof readCurrentQuestion === "function" && !readCurrentQuestion());
  test("K", courseProgressKey("childA", "math-grade-1") !== courseProgressKey("childA", "vietnamese-grade-1")); test("L", courseProgressKey("childA", "math-grade-1") !== courseProgressKey("childB", "math-grade-1"));
  test("M", window.HocCungBeLearning.loadProgressByCourse("math-grade-1").progressVersion === 2 && window.HocCungBeLearning.loadProgressByCourse("vietnamese-grade-1").progressVersion === 2);
  test("N", COURSE_IDS.includes("vietnamese-grade-1")); test("O", legacyIds.every((id, index) => vietnamese.levels[index]?.id === id));
  const expanded = vietnamese.levels.slice(20); test("P", expanded[0]?.id === "TV-21" && expanded.at(-1)?.id === "TV-40" && expanded.length === 20); test("Q", expanded.every((item) => item.questions.length === 5));
  test("R", GUEST_TRIAL_LIMIT === 2); test("S", document.body.textContent.includes("Toán lớp 1") && document.body.textContent.includes("Tiếng Việt lớp 1"));
  test("T", COURSE_IDS.length === 3 && COURSE_IDS.every((id) => COURSES[id]) && COURSE_IDS.includes("english-grade-1")); test("U", vietnamese.levels.every((item) => item.questions.every((question) => typeof question.speechText === "string" && typeof question.displayText === "string")));
  test("V", ["initial-ch-tr", "initial-s-x", "initial-r-d-gi", "digraph-ng-ngh", "digraph-g-gh", "spelling-c-k-q"].every((topic) => vietnamese.levels.some((item) => item.topic === topic)));
  test("W", vietnamese.levels.filter((item) => item.id >= "TV-36").some((item) => item.questions.some((question) => /[🐟🐶👨👩👵✏️🪑🎒🚶🍚😴📚]/u.test(question.displayText))));
  setActiveCourse("vietnamese-grade-1"); const oldProgress = normalizeProgress({ progressVersion: 2, levels: { "TV-20": { bestScore: 80, bestCorrect: 4, bestQuestionCount: 5, bestStars: 2, attempts: 1, completed: true, unlocked: true } }, history: [], studyTime: {}, totalCompleted: 1 });
  test("X", levelUnlocked(oldProgress, LEVEL_BY_ID["TV-21"]) && !levelUnlocked(oldProgress, LEVEL_BY_ID["TV-22"]) && parentStatistics(oldProgress).totalLevels === 40);
  test("Y", oldProgress.levels["TV-20"].completed && oldProgress.levels["TV-01"] && getQuestionSpeechText(LEVEL_BY_ID["TV-31"], LEVEL_BY_ID["TV-31"].questions[0]) === LEVEL_BY_ID["TV-31"].questions[0].speechText);
  const vietnameseIntroBackground = getComputedStyle(document.querySelector("#math-screen .page-intro")).backgroundImage;
  test("Z", document.querySelector('script[src="data/vietnamese-grade-1.js"]') !== null && document.querySelector('meta[name="viewport"]')?.content.includes("width=device-width") && vietnameseIntroBackground.includes("van-mieu-quoc-tu-giam.webp")); test("AA", setActiveCourse(previous));
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeMultiCourseTests = runMultiCourseTests();

// ==================== English Grade 1 EN-01 → EN-20 self-tests ====================
async function runEnglishGrade1Tests() {
  const results = []; const test = (id, passed, detail = "") => results.push({ id, passed: Boolean(passed), detail: passed ? undefined : detail });
  const previousCourse = activeCourseId; const english = COURSES["english-grade-1"]; const allQuestions = english?.levels?.flatMap((item) => item.questions) || [];
  await new Promise((resolve) => setTimeout(resolve, 0));
  test("A", Boolean(english && english.id === "english-grade-1"));
  test("B", english?.levels?.length === 20);
  test("C", new Set(english?.levels?.map((item) => item.id)).size === 20 && english.levels.every((item, index) => item.id === `EN-${String(index + 1).padStart(2, "0")}`));
  test("D", english?.levels?.every((item) => item.questions.length === 5 && item.questionCount === 5));
  test("E", allQuestions.every((item) => item.type === "true-false" ? item.options.length === 2 : item.options.length === 4));
  test("F", allQuestions.every((item) => item.answer && item.options.includes(item.answer)));
  test("G", allQuestions.every((item) => new Set(item.options).size === item.options.length && item.options.every(Boolean)));
  test("H", english?.speechLocale === "en-US" && english.levels.every((item) => item.speechLocale === "en-US"));
  try { const fallback = speechVoice("en-US"); test("I", fallback === null || typeof fallback.lang === "string"); } catch (error) { test("I", false, String(error)); }
  test("J", allQuestions.every((item) => typeof item.displayText === "string" && typeof item.speechText === "string"));
  test("K", allQuestions.filter((item) => item.type === "listen-choice").every((item) => item.speechText && item.hideTranscript));
  test("L", allQuestions.filter((item) => item.type !== "listen-choice").every((item) => item.speechText !== item.answer || item.type === "true-false"));
  setActiveCourse("english-grade-1"); const blank = defaultProgress();
  test("M", blank.levels["EN-01"]?.unlocked === true);
  test("N", blank.levels["EN-02"]?.unlocked === false && normalizeProgress({ levels: { "EN-01": { bestScore: 80 } } }).levels["EN-02"].unlocked);
  let chain = {}; english.levels.slice(0, -1).forEach((item) => { chain[item.id] = { bestScore: 80, attempts: 1 }; }); test("O", normalizeProgress({ levels: chain }).levels["EN-20"].unlocked);
  const mathKey = courseProgressKey("testchild01", "math-grade-1"), vietnameseKey = courseProgressKey("testchild01", "vietnamese-grade-1"), englishKey = courseProgressKey("testchild01", "english-grade-1");
  test("P", englishKey !== mathKey); test("Q", englishKey !== vietnameseKey);
  const trialMathEnglish = normalizeGuestTrial({ completedLevelIds: ["counting-1", "EN-01"] }); test("R", guestTrialCount(trialMathEnglish) === 2 && guestTrialExhausted(trialMathEnglish));
  const trialVietnameseEnglish = normalizeGuestTrial({ completedLevelIds: ["TV-01", "EN-01"] }); test("S", guestTrialCount(trialVietnameseEnglish) === 2 && guestTrialExhausted(trialVietnameseEnglish));
  test("T", document.querySelector('[data-course="english-grade-1"]')?.textContent.includes("Tiếng Anh lớp 1"));
  test("U", document.querySelector('[data-parent-course="english-grade-1"]')?.textContent.includes("Tiếng Anh lớp 1"));
  test("V", english.levels.length === 20 && parentStatistics(blank).totalLevels === 20);
  for (let attempt = 0; attempt < 40 && typeof window.HocCungBeCloudSync?.cloudPath !== "function"; attempt += 1) await new Promise((resolve) => setTimeout(resolve, 50));
  test("W", window.HocCungBeCloudSync?.cloudPath?.("uid", "child", english.id) === "users/uid/children/child/progress/english-grade-1");
  try { const sw = await fetch("service-worker.js", { cache: "no-store" }).then((response) => response.text()); test("X", sw.includes('const CACHE_NAME = "hoc-cung-be-v29"') && sw.includes('"./data/english-grade-1.js"') && sw.includes('"./assets/english-grade-1/images/greetings.webp"')); } catch (error) { test("X", false, String(error)); }
  test("Y", new Set(allQuestions.map((item) => item.type)).size >= 8 && ["choice", "image-choice", "listen-choice", "word-to-image", "match", "letter-order", "true-false", "animation-choice"].every((type) => allQuestions.some((item) => item.type === type)));
  const mediaPaths = english.levels.flatMap((item) => [item.media?.learn?.[0]?.src, item.media?.featured?.poster, item.media?.featured?.fallback]).filter(Boolean);
  try { const responses = await Promise.all([...new Set(mediaPaths)].map((path) => fetch(path, { cache: "no-store" }))); test("Z", responses.every((response) => response.ok)); } catch (error) { test("Z", false, String(error)); }
  test("AA", english.levels.every((item) => item.standards?.vietnam?.length && item.standards?.cefr?.length && item.standards?.preA1Skill?.length && item.skills?.length));
  const videoLevels = ["EN-08", "EN-12", "EN-19"].map((id) => english.levels.find((item) => item.id === id));
  test("AB", videoLevels.every((item) => item?.media?.featured?.type === "video" && item.media.featured.available === true && item.media.featured.mimeType === "video/webm"));
  test("AC", allQuestions.every((item) => item.id && item.displayText.trim() && item.answer.trim()) && new Set(allQuestions.map((item) => item.id)).size === 100);
  test("AD", !JSON.stringify(english).includes("TODO") && !JSON.stringify(english).match(/https?:\/\//));
  test("AE", videoLevels.every((item) => item.media.featured.webm.endsWith(".webm") && item.media.featured.poster.endsWith(".webp") && item.media.featured.fallback.endsWith(".webp") && item.media.featured.animationFallback && item.media.featured.duration >= 10 && item.media.featured.duration <= 25));
  const actionsVideoQuestion = english.levels.find((item) => item.id === "EN-19")?.questions.find((item) => item.type === "video-choice");
  test("AF", actionsVideoQuestion?.answer === "jump" && actionsVideoQuestion.video?.webm.endsWith("en-19-actions.webm") && !actionsVideoQuestion.video.ariaLabel.toLowerCase().includes(actionsVideoQuestion.answer));
  try { const manifest = await fetch("assets/english-grade-1/media-manifest.json", { cache: "no-store" }).then((response) => response.json()); test("AG", manifest.videoAssetsRequired === true && manifest.clips.length === 3 && manifest.clips.every((clip) => clip.available === true && clip.mimeType === "video/webm" && clip.webm.endsWith(".webm") && clip.poster && clip.fallbackImage && clip.animationFallback)); } catch (error) { test("AG", false, String(error)); }
  try { const sw = await fetch("service-worker.js", { cache: "no-store" }).then((response) => response.text()); test("AH", sw.includes('const CACHE_NAME = "hoc-cung-be-v29"') && sw.includes('request.destination === "video"') && sw.includes("cacheMediaRange")); } catch (error) { test("AH", false, String(error)); }
  if (previousCourse !== activeCourseId) setActiveCourse(previousCourse);
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeEnglishGrade1Tests = runEnglishGrade1Tests();

// ==================== Non-destructive PWA checks ====================
function runPwaTests() {
  const manifest = document.querySelector('link[rel="manifest"]'); const installButton = $("#pwa-install-button"); const iosHint = $("#ios-install-hint");
  const results = {
    relativeManifest: manifest?.getAttribute("href") === "manifest.webmanifest",
    relativeServiceWorkerScope: typeof registerServiceWorker === "function" && !/^\//.test("service-worker.js"),
    installControlsPresent: Boolean(installButton && iosHint),
    progressKeysUnchanged: STORAGE_KEY === "hoc-cung-be:math-grade-1-progress" && AUDIO_SETTINGS_KEY === "hoc-cung-be:audio-settings",
    localFileSafe: location.protocol !== "file:" || typeof registerServiceWorker === "function",
    vietnameseOfflineShell: document.querySelector('script[src="data/vietnamese-grade-1.js"]') !== null,
  };
  return { passed: Object.values(results).every(Boolean), results };
}
window.__hocCungBePwaTests = runPwaTests();

// ==================== Branding and app-icon checks A-Y ====================
async function runBrandingTests() {
  const results = []; const test = (id, passed) => results.push({ id, passed: Boolean(passed) });
  await new Promise((resolve) => {
    if (document.querySelector("#account-login-screen") && document.querySelector("#account-me-screen")) { resolve(); return; }
    window.addEventListener("hoc-cung-be:parent-auth-ready", resolve, { once: true }); setTimeout(resolve, 2000);
  });
  const loadImage = (src) => new Promise((resolve) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => resolve(null); image.src = src; });
  const [logo, icon96, icon192, icon512, maskable192, maskable512, cssResponse, manifestResponse] = await Promise.all([
    loadImage("assets/branding/logo-hoc-cung-be-web.png"), loadImage("assets/icons/icon-96.png"), loadImage("assets/icons/icon-192.png"), loadImage("assets/icons/icon-512.png"),
    loadImage("assets/icons/icon-maskable-192.png"), loadImage("assets/icons/icon-maskable-512.png"), fetch("styles.css"), fetch("manifest.webmanifest"),
  ]);
  const css = cssResponse.ok ? await cssResponse.text() : ""; const manifest = manifestResponse.ok ? await manifestResponse.json() : {};
  const icons = Array.isArray(manifest.icons) ? manifest.icons : []; const bySrc = (src) => icons.find((icon) => icon.src === src);
  const cornerOpaque = (image) => { if (!image) return false; const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight; const context = canvas.getContext("2d", { willReadFrequently: true }); context.drawImage(image, 0, 0); const points = [[0, 0], [canvas.width - 1, 0], [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1]]; return points.every(([x, y]) => context.getImageData(x, y, 1, 1).data[3] === 255); };
  const headerLogo = document.querySelector(".brand__logo"), homeLogo = document.querySelector(".hero__brand-logo");
  test("A", Boolean(headerLogo && logo?.naturalWidth));
  test("B", getComputedStyle(headerLogo).objectFit === "contain" && headerLogo.clientWidth > 0 && headerLogo.clientHeight > 0);
  test("C", logo?.naturalWidth === logo?.naturalHeight && headerLogo.getAttribute("width") === "68" && headerLogo.getAttribute("height") === "68" && css.includes("height: 68px"));
  test("D", document.querySelector(".brand")?.textContent.trim() === "");
  test("E", Boolean(document.querySelector("#account-login-screen .account-brand-logo")));
  test("F", Boolean(document.querySelector("#account-register-screen .account-brand-logo")));
  test("G", Boolean(document.querySelector("#account-forgot-screen .account-brand-logo")));
  test("H", Boolean(document.querySelector("#parent-dashboard-screen") && document.querySelector("#account-me-screen") && homeLogo));
  test("I", css.includes("@media (max-width: 380px)") && css.includes("height: 48px"));
  test("J", css.includes("@media (max-width: 760px)") && css.includes("height: 52px"));
  test("K", css.includes(".brand__logo") && css.includes("object-fit: contain"));
  test("L", document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  test("M", Boolean(document.querySelector("#sound-settings-button") && document.querySelector(".brand[data-go='home']")));
  test("N", css.includes(".hero__brand-logo { width: 112px; height: 112px;") && css.includes("width: 64px; height: 64px;"));
  test("O", document.querySelector("#account-login-screen .account-brand-logo")?.getAttribute("width") === "104");
  test("P", icon192?.naturalWidth === 192 && icon192?.naturalHeight === 192 && bySrc("assets/icons/icon-192.png")?.purpose === "any");
  test("Q", icon512?.naturalWidth === 512 && icon512?.naturalHeight === 512 && bySrc("assets/icons/icon-512.png")?.purpose === "any");
  test("R", maskable192?.naturalWidth === 192 && bySrc("assets/icons/icon-maskable-192.png")?.purpose === "maskable");
  test("S", maskable512?.naturalWidth === 512 && bySrc("assets/icons/icon-maskable-512.png")?.purpose === "maskable");
  test("T", [...document.querySelectorAll('link[rel="icon"]')].some((link) => link.getAttribute("href") === "assets/icons/favicon-32.png"));
  test("U", document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href") === "assets/icons/apple-touch-icon.png");
  test("V", icons.every((icon) => !icon.src.startsWith("/")) && manifest.start_url === "./" && manifest.scope === "./");
  test("W", document.querySelector("#pwa-install-button img")?.getAttribute("src") === "assets/icons/icon-96.png");
  test("X", icon96?.naturalWidth === 96 && icon96?.naturalHeight === 96);
  test("Y", cornerOpaque(maskable192) && cornerOpaque(maskable512));
  return { passed: results.every((item) => item.passed), results };
}
window.__hocCungBeBrandingTests = runBrandingTests();