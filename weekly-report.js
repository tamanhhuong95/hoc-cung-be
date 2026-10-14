"use strict";

// V32 Parent Weekly Report: deterministic, derived and local-only.
(() => {
  const COURSE_IDS = Object.freeze(["math-grade-1", "vietnamese-grade-1", "english-grade-1"]);
  const DAY_LABELS = Object.freeze(["T2", "T3", "T4", "T5", "T6", "T7", "CN"]);
  const SKILL_IDS = Object.freeze(["listening", "speaking", "reading", "writing"]);
  const safeNumber = (value, maximum = Number.MAX_SAFE_INTEGER) => Math.min(maximum, Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0));
  const object = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));
  const dateValue = (value) => { const date = value instanceof Date ? new Date(value.getTime()) : new Date(value); return Number.isNaN(date.getTime()) ? null : date; };
  const localDateKey = (value) => { const date = dateValue(value); if (!date) return ""; return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
  const dateFromKey = (key) => /^\d{4}-\d{2}-\d{2}$/.test(String(key || "")) ? new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, Number(key.slice(8, 10)), 12) : null;
  const shortDate = (date) => `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  const inRange = (range, value) => { const date = dateValue(value); return Boolean(date && date >= range.start && date <= range.end); };
  const historyTime = (entry) => entry?.completedAt || "";
  const rangeHistory = (progress, range) => (Array.isArray(progress?.history) ? progress.history : []).filter((entry) => inRange(range, historyTime(entry)));
  const formatMinutes = (minutes) => { const value = Math.max(0, Math.round(minutes)); if (value < 60) return `${value} phút`; const remainder = value % 60; return `${Math.floor(value / 60)} giờ${remainder ? ` ${remainder} phút` : ""}`; };

  function getWeekRange(value = new Date()) {
    const now = dateValue(value) || new Date();
    const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23, 59, 59, 999);
    return { start, end, currentEnd: now < end ? now : end, label: `${shortDate(start)} – ${shortDate(end)}` };
  }

  function getPreviousWeekRange(value = new Date()) {
    const current = getWeekRange(value); const date = new Date(current.start); date.setDate(date.getDate() - 7); return getWeekRange(date);
  }

  function summarizeWeeklyStudy(progresses = {}, range = getWeekRange()) {
    const days = DAY_LABELS.map((label, index) => { const date = new Date(range.start); date.setDate(date.getDate() + index); return { label, date, key: localDateKey(date), seconds: 0 }; });
    let datedData = false;
    COURSE_IDS.forEach((courseId) => {
      const byDate = progresses?.[courseId]?.studyTime?.studyTimeByDate; if (!object(byDate)) return;
      days.forEach((day) => { if (Object.prototype.hasOwnProperty.call(byDate, day.key)) datedData = true; day.seconds += safeNumber(byDate[day.key], 864000); });
    });
    const totalSeconds = days.reduce((sum, day) => sum + day.seconds, 0); const studyDays = days.filter((day) => day.seconds > 0).length;
    const elapsedDays = Math.max(1, Math.min(7, Math.floor((range.currentEnd - range.start) / 86400000) + 1));
    return { totalStudySeconds: datedData ? totalSeconds : null, totalStudyMinutes: datedData ? Math.round(totalSeconds / 60) : null, studyDays: datedData ? studyDays : null, averageMinutesPerStudyDay: datedData && studyDays ? Math.round(totalSeconds / 60 / studyDays) : null, elapsedDays, rhythmText: datedData ? `Đã học ${studyDays}/${elapsedDays} ngày đã trôi qua trong tuần` : "Chưa đủ dữ liệu", dailyBreakdown: datedData ? days.map((day) => ({ ...day, minutes: Math.round(day.seconds / 60) })) : null };
  }

  function summarizeWeeklyCourses(progresses = {}, courses = {}, range = getWeekRange()) {
    return COURSE_IDS.map((courseId) => {
      const progress = progresses[courseId] || {}; const history = rangeHistory(progress, range); const course = courses[courseId] || { id: courseId, name: courseId, icon: "📘" };
      let seconds = 0; let hasTime = false; const byDate = progress?.studyTime?.studyTimeByDate;
      if (object(byDate)) Object.entries(byDate).forEach(([key, value]) => { const date = dateFromKey(key); if (date && inRange(range, date)) { hasTime = true; seconds += safeNumber(value, 864000); } });
      return { courseId, name: course.name, icon: course.icon || "📘", completedLessons: history.length, activityCount: history.length, studyMinutes: hasTime ? Math.round(seconds / 60) : null, bestScore: history.length ? Math.max(...history.map((entry) => safeNumber(entry.score, 100))) : null, recentScore: history.length ? safeNumber(history.at(-1)?.score, 100) : null, historyLimited: Array.isArray(progress.history) && progress.history.length >= 50 };
    });
  }

  function weeklyEnglishProgress(progress = {}, curriculum, range) {
    const history = rangeHistory(progress, range); const levels = {};
    history.forEach((entry) => { if (!entry?.levelId) return; levels[entry.levelId] = { completed: true, attempts: (levels[entry.levelId]?.attempts || 0) + 1, unlocked: Boolean(progress?.levels?.[entry.levelId]?.unlocked) }; });
    return { progressVersion: 2, history, levels, studyTime: progress.studyTime || {}, curriculum };
  }

  function summarizeWeeklyEnglishSkills(progress = {}, curriculum, range = getWeekRange()) {
    const filtered = weeklyEnglishProgress(progress, curriculum, range); const analytics = window.HocCungBeLearningAnalytics;
    const analysis = analytics?.analyzeEnglishSkills?.({ courseId: "english-grade-1", progress: filtered, curriculum, now: range.currentEnd });
    if (!analysis) return { hasData: false, skills: Object.fromEntries(SKILL_IDS.map((id) => [id, { id, label: id, icon: "", attemptedTasks: 0, accuracy: null }])) };
    const speakingSessions = filtered.history.filter((entry) => curriculum?.levels?.find((level) => level.id === entry.levelId)?.skills?.includes("speaking")).length;
    analysis.skills.speaking.weeklySessions = speakingSessions; analysis.skills.speaking.accuracy = null;
    analysis.hasData = ["listening", "reading", "writing"].some((id) => analysis.skills[id].attemptedTasks > 0) || speakingSessions > 0;
    return analysis;
  }

  function summarizeResult(progresses, courses, range) {
    const history = COURSE_IDS.flatMap((courseId) => rangeHistory(progresses[courseId], range));
    const attemptCount = history.reduce((sum, entry) => sum + safeNumber(entry.questionCount, 100), 0); const correctCount = history.reduce((sum, entry) => sum + safeNumber(entry.correct, safeNumber(entry.questionCount, 100) || 100), 0);
    return { lessonCount: courses.reduce((sum, course) => sum + course.completedLessons, 0), threeStarLessons: history.filter((entry) => safeNumber(entry.stars, 3) === 3).length, attemptCount, correctCount, sufficientSample: attemptCount >= 5, accuracy: attemptCount >= 5 ? Math.round((correctCount / attemptCount) * 100) : null };
  }

  function buildHighlights(report) {
    const values = [];
    if (report.study.studyDays >= 3) values.push(`Bé đã học đều ${report.study.studyDays} ngày trong tuần.`);
    if (report.result.threeStarLessons > 0) values.push(`Bé hoàn thành ${report.result.threeStarLessons} bài đạt 3 sao.`);
    const measured = ["listening", "reading", "writing"].filter((id) => report.english?.skills?.[id]?.attemptedTasks >= 5).sort((a, b) => report.english.skills[b].accuracy - report.english.skills[a].accuracy);
    if (measured[0]) values.push(`Kỹ năng ${report.english.skills[measured[0]].label} Tiếng Anh đang có kết quả tích cực.`);
    if (!values.length && report.result.lessonCount) values.push(`Bé đã hoàn thành ${report.result.lessonCount} bài trong tuần này.`);
    return values.slice(0, 3);
  }

  function buildPracticeAreas(report, courses = {}) {
    const values = [];
    (report.english?.errorPatterns || []).forEach((pattern) => { const topic = courses["english-grade-1"]?.topics?.[pattern.topic]; if (topic) values.push({ icon: topic.icon || "📍", text: topic.title, courseId: "english-grade-1", topicId: pattern.topic }); });
    ["listening", "reading", "writing"].filter((id) => report.english?.skills?.[id]?.attemptedTasks >= 5 && report.english.skills[id].accuracy < 70).forEach((id) => values.push({ icon: report.english.skills[id].icon, text: `${report.english.skills[id].label} Tiếng Anh`, courseId: "english-grade-1", skillId: id }));
    const seen = new Set(); return values.filter((item) => { const key = `${item.courseId}:${item.text}`; if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 3);
  }

  function levelSkills(level) {
    const values = new Set(Array.isArray(level?.skills) ? level.skills : []); const analytics = window.HocCungBeLearningAnalytics;
    (level?.questions || []).forEach((question) => analytics?.getQuestionSkills?.(question)?.forEach((skill) => values.add(skill))); return values;
  }

  function buildWeeklyRecommendations(report, { progresses = {}, courses = {} } = {}) {
    const skills = new Set(report.practiceAreas.map((item) => item.skillId).filter(Boolean)); const topics = new Set(report.practiceAreas.map((item) => item.topicId).filter(Boolean)); const candidates = [];
    COURSE_IDS.forEach((courseId, courseIndex) => (courses[courseId]?.levels || []).forEach((level, levelIndex) => {
      const state = progresses?.[courseId]?.levels?.[level.id] || {}; if (!state.unlocked) return;
      const priorityMatch = courseId === "english-grade-1" && (topics.has(level.topic) || [...levelSkills(level)].some((skill) => skills.has(skill)));
      candidates.push({ courseId, courseName: courses[courseId].name, levelId: level.id, title: level.title, completed: Boolean(state.completed), action: state.completed ? "Ôn lại" : "Học tiếp", directCta: true, priority: Number(!priorityMatch) * 1000 + Number(state.completed) * 100 + courseIndex * 10 + levelIndex });
    }));
    const seen = new Set(); return candidates.sort((a, b) => a.priority - b.priority || a.levelId.localeCompare(b.levelId)).filter((item) => { if (seen.has(item.levelId)) return false; seen.add(item.levelId); return true; }).slice(0, 3);
  }

  function compareWeeklyReports(current, previous) {
    if (!current?.hasDatedActivity || !previous?.hasDatedActivity) return { available: false, message: "Chưa đủ dữ liệu để so sánh với tuần trước." };
    const delta = (left, right) => left === null || right === null ? null : left - right;
    return { available: true, studyMinutes: delta(current.study.totalStudyMinutes, previous.study.totalStudyMinutes), studyDays: delta(current.study.studyDays, previous.study.studyDays), lessons: current.result.lessonCount - previous.result.lessonCount, accuracy: current.result.accuracy === null || previous.result.accuracy === null ? null : current.result.accuracy - previous.result.accuracy };
  }

  function buildRangeReport({ child, progresses, courses, englishCurriculum, range }) {
    const study = summarizeWeeklyStudy(progresses, range); const courseSummary = summarizeWeeklyCourses(progresses, courses, range); const result = summarizeResult(progresses, courseSummary, range); const english = summarizeWeeklyEnglishSkills(progresses["english-grade-1"] || {}, englishCurriculum, range);
    const report = { child: child ? { id: child.id, name: child.name || "Bé", avatar: child.avatar || "🧒" } : { id: null, name: "Bé", avatar: "🧒" }, range, study, courses: courseSummary, result, english, hasActivity: result.lessonCount > 0 || (study.totalStudySeconds || 0) > 0, hasDatedActivity: courseSummary.some((course) => course.completedLessons > 0 || (course.studyMinutes || 0) > 0), limitedHistory: courseSummary.some((course) => course.historyLimited), highlights: [], practiceAreas: [], recommendations: [] };
    report.highlights = buildHighlights(report); report.practiceAreas = buildPracticeAreas(report, courses); report.recommendations = buildWeeklyRecommendations(report, { progresses, courses }); return report;
  }

  function buildWeeklyReport({ child = null, progresses = {}, courses = {}, englishCurriculum = courses["english-grade-1"], now = new Date() } = {}) {
    const report = buildRangeReport({ child, progresses, courses, englishCurriculum, range: getWeekRange(now) });
    const previous = buildRangeReport({ child, progresses, courses, englishCurriculum, range: getPreviousWeekRange(now) }); report.comparison = compareWeeklyReports(report, previous); return report;
  }

  const html = (value) => String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  const summaryCard = (icon, value, label) => `<article><span aria-hidden="true">${icon}</span><strong>${html(value)}</strong><small>${html(label)}</small></article>`;
  const signed = (value, unit) => value === null ? "Chưa đủ dữ liệu" : `${value > 0 ? "+" : ""}${value} ${unit}`;
  function ensureSection() { let section = document.querySelector("#weekly-report"); if (!section) { section = document.createElement("section"); section.id = "weekly-report"; section.className = "parent-section weekly-report"; section.setAttribute("aria-labelledby", "weekly-report-title"); document.querySelector("#parent-summary")?.insertAdjacentElement("beforebegin", section); } return section; }

  function renderWeeklyReport(report) {
    const section = ensureSection(); if (!section) return report;
    const header = `<div class="weekly-report__header"><div><p class="eyebrow">Dựa trên hoạt động gần đây được lưu</p><h2 id="weekly-report-title">Báo cáo tuần của ${html(report.child.name)}</h2><strong>${html(report.range.label)}</strong><p>Đang cập nhật theo dữ liệu học gần đây</p></div><button class="secondary-button weekly-print-button" type="button" data-weekly-print>🖨 In báo cáo</button></div>`;
    if (!report.hasActivity) { section.innerHTML = `${header}<div class="weekly-empty" role="status"><strong>Tuần này chưa có hoạt động học tập.</strong><p>Khi bé hoàn thành bài học, báo cáo sẽ tự động cập nhật.</p><button class="primary-button" type="button" data-go="grade1">Bắt đầu học</button></div>`; return report; }
    const summary = [summaryCard("⏱", report.study.totalStudyMinutes === null ? "Chưa đủ dữ liệu" : formatMinutes(report.study.totalStudyMinutes), "Thời gian học"), summaryCard("📚", `${report.result.lessonCount} bài`, "Bài đã hoàn thành"), summaryCard("📅", report.study.studyDays === null ? "Chưa đủ dữ liệu" : `${report.study.studyDays} ngày`, "Số ngày có học"), summaryCard("⭐", report.result.lessonCount ? `${report.result.threeStarLessons} bài đạt 3 sao` : "Chưa đủ dữ liệu", "Kết quả nổi bật")].join("");
    const chart = report.study.dailyBreakdown ? `<section class="weekly-block" aria-labelledby="weekly-chart-title"><h3 id="weekly-chart-title">Thời gian học trong tuần</h3><div class="weekly-chart">${report.study.dailyBreakdown.map((day) => `<div class="weekly-chart__day"><div class="weekly-chart__track"><span style="height:${Math.max(day.minutes ? 8 : 2, Math.min(100, day.minutes * 3))}%" role="img" aria-label="${day.label}: ${day.minutes} phút"><b>${day.minutes}</b></span></div><strong>${day.label}</strong></div>`).join("")}</div><p class="weekly-rhythm"><strong>Nhịp học tuần này:</strong> ${html(report.study.rhythmText)}.</p></section>` : `<section class="weekly-block"><h3>Nhịp học tuần này</h3><p>Chưa đủ dữ liệu để hiển thị theo ngày.</p></section>`;
    const courseCards = report.courses.map((course) => `<article class="weekly-course-card"><span aria-hidden="true">${course.icon}</span><div><h3>${html(course.name)}</h3><strong>${course.completedLessons} bài hoàn thành</strong><p>${course.studyMinutes === null ? "Thời gian: Chưa đủ dữ liệu" : `Thời gian: ${formatMinutes(course.studyMinutes)}`}${course.bestScore === null ? "" : ` · Điểm tốt nhất: ${course.bestScore}%`}</p></div></article>`).join("");
    const accuracy = report.result.sufficientSample ? `Độ chính xác bài luyện gần đây: <strong>${report.result.accuracy}%</strong> (${report.result.correctCount}/${report.result.attemptCount})` : "Chưa đủ dữ liệu để đánh giá kết quả tuần";
    const skillCards = SKILL_IDS.map((id) => { const skill = report.english.skills[id]; const speaking = id === "speaking"; const metric = speaking ? `${skill.weeklySessions || 0} lần luyện nói` : skill.attemptedTasks ? `${skill.attemptedTasks} hoạt động${skill.accuracy === null ? "" : ` · ${skill.accuracy}%`}` : "Chưa đủ dữ liệu"; return `<article class="weekly-skill-card" data-skill="${id}"><h3><span aria-hidden="true">${skill.icon}</span> ${skill.label}</h3><strong>${metric}</strong><p>${speaking ? "Mức tham gia; không chấm độ chính xác phát âm" : skill.attemptedTasks >= 5 ? skill.status : "Chưa đủ dữ liệu"}</p></article>`; }).join("");
    const highlights = report.highlights.length ? report.highlights.map((value) => `<li>✓ ${html(value)}</li>`).join("") : "<li>Chưa đủ dữ liệu để tạo điểm nổi bật.</li>";
    const practice = report.practiceAreas.length ? report.practiceAreas.map((item) => `<li><span aria-hidden="true">${item.icon}</span> ${html(item.text)}</li>`).join("") : "<li>Chưa đủ dữ liệu; bé có thể tiếp tục các bài đã mở.</li>";
    const recommendations = report.recommendations.length ? report.recommendations.map((item) => `<article class="weekly-recommendation"><div><span>${html(item.courseName)}</span><h3>${html(item.levelId)} — ${html(item.title)}</h3></div><button class="secondary-button" type="button" data-weekly-course="${html(item.courseId)}" data-weekly-level="${html(item.levelId)}">${item.action}</button></article>`).join("") : "<p>Chưa đủ dữ liệu để tạo gợi ý phù hợp.</p>";
    const comparison = report.comparison.available ? `<dl class="weekly-comparison"><div><dt>Thời gian học</dt><dd>${signed(report.comparison.studyMinutes, "phút")}</dd></div><div><dt>Số ngày học</dt><dd>${signed(report.comparison.studyDays, "ngày")}</dd></div><div><dt>Bài hoàn thành</dt><dd>${signed(report.comparison.lessons, "bài")}</dd></div><div><dt>Độ chính xác gần đây</dt><dd>${report.comparison.accuracy === null ? "Chưa đủ dữ liệu" : signed(report.comparison.accuracy, "điểm %")}</dd></div></dl>` : `<p>${report.comparison.message}</p>`;
    section.innerHTML = `${header}<div class="weekly-summary" aria-label="Tóm tắt tuần">${summary}</div>${chart}<section class="weekly-block"><h3>Môn học trong tuần</h3><div class="weekly-course-grid">${courseCards}</div></section><section class="weekly-block"><h3>Kết quả học tập gần đây</h3><p>${accuracy}</p></section><section class="weekly-block" aria-labelledby="weekly-english-title"><h3 id="weekly-english-title">Tiếng Anh tuần này</h3><div class="weekly-skill-grid">${skillCards}</div></section><div class="weekly-two-column"><section class="weekly-block"><h3>Điểm nổi bật tuần này</h3><ul class="weekly-list">${highlights}</ul></section><section class="weekly-block"><h3>Nên luyện thêm</h3><ul class="weekly-list">${practice}</ul></section></div><section class="weekly-block"><h3>Gợi ý cho tuần tới</h3><div class="weekly-recommendations">${recommendations}</div></section><section class="weekly-block"><h3>So với tuần trước</h3>${comparison}</section>`;
    return report;
  }

  function buildCurrentReport(now = new Date()) { const learning = window.HocCungBeLearning; const courses = learning?.COURSES || {}; const progresses = Object.fromEntries(COURSE_IDS.map((courseId) => [courseId, learning?.loadProgressByCourse?.(courseId) || {}])); return buildWeeklyReport({ child: window.HocCungBeChildren?.getActiveChild?.() || null, progresses, courses, englishCurriculum: courses["english-grade-1"], now }); }
  function renderCurrentReport(now = new Date()) { return renderWeeklyReport(buildCurrentReport(now)); }

  document.addEventListener("click", (event) => { if (event.target.closest("[data-weekly-print]")) { window.print(); return; } const button = event.target.closest("[data-weekly-course][data-weekly-level]"); if (button) window.HocCungBeLearning?.openLevel?.(button.dataset.weeklyCourse, button.dataset.weeklyLevel); });

  async function runSelfTests() {
    const results = []; const test = (id, passed) => results.push({ id, passed: Boolean(passed) }); const now = new Date(2026, 9, 14, 10); const range = getWeekRange(now); const curriculum = window.HOC_CUNG_BE_ENGLISH_GRADE_1; const courses = window.HocCungBeLearning.COURSES;
    const blank = () => ({ progressVersion: 2, levels: {}, history: [], studyTime: { studyTimeByDate: {} } }); const progresses = Object.fromEntries(COURSE_IDS.map((id) => [id, blank()]));
    const add = (courseId, level, completedAt, score = 100, correct = 5, questionCount = 5, stars = 3) => progresses[courseId].history.push({ levelId: level.id, topic: level.topic, completedAt, score, correct, questionCount, stars });
    add("math-grade-1", courses["math-grade-1"].levels[0], "2026-10-12T08:00:00"); add("vietnamese-grade-1", courses["vietnamese-grade-1"].levels[0], "2026-10-13T08:00:00", 80, 4, 5, 2);
    const listening = curriculum.levels.flatMap((level) => level.questions.map((question) => ({ level, question }))).find((item) => window.HocCungBeLearningAnalytics.getQuestionSkills(item.question).includes("listening"));
    progresses["english-grade-1"].history.push(...Array.from({ length: 5 }, (_, index) => ({ questionId: listening.question.id, levelId: listening.level.id, topic: listening.level.topic, correct: index > 0, completedAt: `2026-10-14T0${index + 1}:00:00`, score: index > 0 ? 100 : 0, questionCount: 1, stars: index > 0 ? 3 : 0 })));
    COURSE_IDS.forEach((id) => { const level = courses[id].levels[0]; progresses[id].levels[level.id] = { unlocked: true, completed: true, attempts: 1 }; }); progresses["english-grade-1"].levels[listening.level.id] = { unlocked: true, completed: true, attempts: 5 };
    progresses["math-grade-1"].studyTime.studyTimeByDate["2026-10-12"] = 600; progresses["english-grade-1"].studyTime.studyTimeByDate["2026-10-14"] = 900;
    const report = buildWeeklyReport({ child: { id: "childA", name: "Minh" }, progresses, courses, englishCurriculum: curriculum, now });
    test("01 weekly-report module loads", typeof buildWeeklyReport === "function"); test("02 Monday start correct", range.start.getDay() === 1 && range.start.getHours() === 0); test("03 Sunday end correct", range.end.getDay() === 0 && range.end.getHours() === 23 && range.end.getMinutes() === 59); test("04 month boundary", getWeekRange(new Date(2026, 10, 1)).start.getMonth() === 9); test("05 year boundary", getWeekRange(new Date(2026, 11, 31)).end.getFullYear() === 2027);
    const childBReport = buildWeeklyReport({ child: { id: "childB", name: "Lan" }, progresses: {}, courses, englishCurriculum: curriculum, now });
    test("06 current child isolation", report.child.id === "childA" && report.result.lessonCount === 7 && childBReport.child.id === "childB" && childBReport.result.lessonCount === 0); test("07 course aggregation", report.courses.filter((item) => item.completedLessons > 0).length === 3); test("08 no Math to English contamination", report.english.skills.listening.attemptedTasks === 5); test("09 no activity empty state", !buildWeeklyReport({ progresses: {}, courses, now }).hasActivity); test("10 partial data state", buildWeeklyReport({ progresses: { "math-grade-1": progresses["math-grade-1"] }, courses, now }).hasActivity);
    test("11 study time aggregation", report.study.totalStudyMinutes === 25); test("12 study days", report.study.studyDays === 2); test("13 lessons aggregation", report.result.lessonCount === 7); test("14 accuracy threshold", report.result.sufficientSample && report.result.accuracy !== null); test("15 highlights max 3", report.highlights.length <= 3); test("16 practice areas max 3", report.practiceAreas.length <= 3); test("17 recommendations max 3", report.recommendations.length <= 3); test("18 no locked direct CTA", report.recommendations.every((item) => progresses[item.courseId]?.levels?.[item.levelId]?.unlocked));
    test("19 speaking accuracy null", report.english.skills.speaking.accuracy === null); test("20 English skill section", SKILL_IDS.every((id) => report.english.skills[id])); const previousData = JSON.parse(JSON.stringify(progresses)); previousData["math-grade-1"].studyTime.studyTimeByDate[localDateKey(getPreviousWeekRange(now).start)] = 300; test("21 previous week comparison", buildWeeklyReport({ progresses: previousData, courses, now }).comparison.available); const noCurrentData = buildWeeklyReport({ progresses: Object.fromEntries(COURSE_IDS.map((id) => [id, { history: [], studyTime: { studyTimeByDate: { [localDateKey(getPreviousWeekRange(now).start)]: 300 } } }])), courses, now }); test("22 missing period safe state", !report.comparison.available && !noCurrentData.comparison.available); test("23 history 50 support", summarizeWeeklyCourses({ "math-grade-1": { history: Array.from({ length: 50 }, () => ({ completedAt: "2026-09-01" })) } }, courses, range)[0].historyLimited); test("24 legacy progress support", buildWeeklyReport({ progresses: { "english-grade-1": { progressVersion: 2, levels: { "EN-20": { completed: true, unlocked: true } }, history: [] } }, courses, now }).english.skills.speaking.accuracy === null);
    const section = ensureSection(); renderWeeklyReport(report); test("25 report rendering", section.querySelector("#weekly-report-title")?.textContent.includes("Minh")); test("26 print button", Boolean(section.querySelector("[data-weekly-print]"))); const chartAccessible = section.querySelectorAll('.weekly-chart [role="img"][aria-label]').length === 7; let css = "", rules = "", script = ""; try { [css, rules, script] = await Promise.all([fetch("styles.css", { cache: "no-store" }).then((response) => response.text()), fetch("firestore.rules", { cache: "no-store" }).then((response) => response.text()), fetch("script.js", { cache: "no-store" }).then((response) => response.text())]); } catch {}
    renderWeeklyReport(childBReport); const childRenderChanged = section.querySelector("#weekly-report-title")?.textContent.includes("Lan") && section.textContent.includes("Tuần này chưa có hoạt động học tập");
    test("27 print CSS", css.includes("@media print") && css.includes(".weekly-report")); test("28 accessibility", chartAccessible); test("29 child switch refresh", childRenderChanged && script.includes("dashboardWasOpen") && script.includes("if (dashboardWasOpen) renderParentDashboard()")); test("30 report view no study time", !renderCurrentReport.toString().includes("addStudySeconds")); test("31 no Firestore report write", !rules.includes("weeklyReports") && !rules.includes("reports/{")); test("32 no runtime errors", report.range.label === "12/10 – 18/10"); section.replaceChildren();
    return { passed: results.every((item) => item.passed), results };
  }

  window.HocCungBeWeeklyReport = { COURSE_IDS, DAY_LABELS, getWeekRange, getPreviousWeekRange, summarizeWeeklyStudy, summarizeWeeklyCourses, summarizeWeeklyEnglishSkills, buildWeeklyRecommendations, compareWeeklyReports, buildWeeklyReport, buildCurrentReport, renderWeeklyReport, renderCurrentReport, formatMinutes };
  window.__hocCungBeWeeklyReportTests = { pending: true };
  runSelfTests().then((result) => { window.__hocCungBeWeeklyReportTests = result; }).catch((error) => { window.__hocCungBeWeeklyReportTests = { passed: false, results: [{ id: "runtime", passed: false, error: String(error?.stack || error) }] }; });
})();