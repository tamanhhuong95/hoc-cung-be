"use strict";

// Derived, local-only English skill analytics. No network calls or stored analytics data.
(() => {
  const COURSE_ID = "english-grade-1";
  const SKILL_IDS = Object.freeze(["listening", "speaking", "reading", "writing"]);
  const SKILL_META = Object.freeze({
    listening: { icon: "🎧", label: "Nghe" },
    speaking: { icon: "🗣️", label: "Nói" },
    reading: { icon: "📖", label: "Đọc" },
    writing: { icon: "✍️", label: "Viết" },
  });
  const TREND_LABELS = Object.freeze({ improving: "Đang cải thiện", stable: "Ổn định", needs_practice: "Nên luyện thêm", insufficient_data: "Chưa đủ dữ liệu" });
  const safeNumber = (value, maximum = Number.MAX_SAFE_INTEGER) => Math.min(maximum, Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0));
  const validObject = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));
  const percent = (part, total) => total > 0 ? Math.round((part / total) * 100) : null;
  const normalizeSkill = (value) => value === "writing-letter-skills" ? "writing" : SKILL_IDS.includes(value) ? value : null;
  const explicitSkills = (item) => Array.isArray(item?.skills) ? [...new Set(item.skills.map(normalizeSkill).filter(Boolean))] : [];
  const hasListeningMedia = (question) => Boolean(question?.listening || question?.audio || question?.hideTranscript || question?.media?.type === "audio");

  function getQuestionSkills(question = {}) {
    const explicit = explicitSkills(question);
    if (explicit.length) return explicit;
    const type = String(question.type || "");
    if (type === "listen-choice") return ["listening"];
    if (type === "letter-order") return ["writing"];
    if (["word-to-image", "image-choice", "choice", "match", "true-false"].includes(type)) return ["reading"];
    if (type === "order") return ["reading"];
    if (type === "mini-dialogue-choice") return hasListeningMedia(question) ? ["reading", "listening"] : ["reading"];
    // Animation/video tasks require explicit metadata so visual media is not misclassified.
    if (["animation-choice", "video-choice", "video-based"].includes(type)) return [];
    return [];
  }

  function curriculumIndex(curriculum) {
    const levels = Array.isArray(curriculum?.levels) ? curriculum.levels : [];
    const levelById = new Map(); const questionById = new Map(); const available = Object.fromEntries(SKILL_IDS.map((id) => [id, new Set()]));
    levels.forEach((level) => {
      if (!level?.id) return;
      levelById.set(level.id, level);
      (Array.isArray(level.questions) ? level.questions : []).forEach((question) => {
        if (!question?.id) return;
        const skills = getQuestionSkills(question);
        questionById.set(question.id, { question, level, skills });
        skills.forEach((skill) => available[skill].add(question.id));
      });
      if (explicitSkills(level).includes("speaking")) available.speaking.add(level.id);
    });
    return { levels, levelById, questionById, available };
  }

  function timestampOf(entry) { return String(entry?.timestamp || entry?.completedAt || ""); }
  function distributedCorrect(index, count, correct) { return Math.floor(((index + 1) * correct) / count) > Math.floor((index * correct) / count); }

  function collectAttempts(progress, index) {
    const attempts = { listening: [], reading: [], writing: [] }; const attemptedIds = { listening: new Set(), reading: new Set(), writing: new Set() };
    const history = Array.isArray(progress?.history) ? progress.history.slice(-50) : [];
    history.forEach((entry, historyIndex) => {
      const direct = entry?.questionId ? index.questionById.get(entry.questionId) : null;
      if (direct && typeof entry.correct === "boolean") {
        direct.skills.filter((skill) => skill !== "speaking").forEach((skill) => {
          attempts[skill].push({ correct: entry.correct, timestamp: timestampOf(entry), topic: direct.level.topic || entry.topic || "", levelId: direct.level.id, questionId: direct.question.id, source: "question" });
          attemptedIds[skill].add(direct.question.id);
        });
        return;
      }
      const level = index.levelById.get(entry?.levelId);
      if (!level) return;
      const questions = (Array.isArray(level.questions) ? level.questions : []).map((question) => ({ question, skills: getQuestionSkills(question) })).filter((item) => item.skills.length);
      const denominator = safeNumber(entry.questionCount, 100) || questions.length;
      const ratio = denominator ? Math.min(1, safeNumber(entry.correct, denominator) / denominator) : 0;
      ["listening", "reading", "writing"].forEach((skill) => {
        const skillQuestions = questions.filter((item) => item.skills.includes(skill));
        const correct = Math.round(skillQuestions.length * ratio);
        skillQuestions.forEach((item, itemIndex) => {
          attempts[skill].push({ correct: distributedCorrect(itemIndex, skillQuestions.length, correct), timestamp: timestampOf(entry), topic: level.topic || entry.topic || "", levelId: level.id, questionId: item.question.id, source: "level-session", historyIndex });
          attemptedIds[skill].add(item.question.id);
        });
      });
    });
    Object.values(attempts).forEach((items) => items.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
    return { attempts, attemptedIds };
  }

  function getRecentSkillTrend(attempts = [], limit = 20) {
    const recent = attempts.slice(-limit);
    if (recent.length < 6) return "insufficient_data";
    const split = Math.floor(recent.length / 2); const first = recent.slice(0, split); const second = recent.slice(split);
    const firstRate = first.filter((item) => item.correct).length / first.length; const secondRate = second.filter((item) => item.correct).length / second.length;
    if (secondRate - firstRate >= 0.15) return "improving";
    if (firstRate - secondRate >= 0.15) return "needs_practice";
    return "stable";
  }

  function getSkillStatus(skillOrStats, maybeStats) {
    const skillId = typeof skillOrStats === "string" ? skillOrStats : "reading"; const stats = typeof skillOrStats === "string" ? maybeStats || {} : skillOrStats || {};
    if (skillId === "speaking") {
      if (safeNumber(stats.completedActivities) < 2) return "Chưa đủ dữ liệu";
      if (stats.participationRate >= 85) return "Rất tốt";
      if (stats.participationRate >= 70) return "Đang tiến bộ tốt";
      if (stats.participationRate >= 50) return "Cần luyện thêm";
      return "Nên ôn lại";
    }
    if (safeNumber(stats.attemptedTasks) < 5 || stats.accuracy === null) return "Chưa đủ dữ liệu";
    if (stats.accuracy >= 85) return "Rất tốt";
    if (stats.accuracy >= 70) return "Đang tiến bộ tốt";
    if (stats.accuracy >= 50) return "Cần luyện thêm";
    return "Nên ôn lại";
  }

  function studyTimeLast7Days(progress, now = new Date()) {
    const byDate = validObject(progress?.studyTime?.studyTimeByDate) ? progress.studyTime.studyTimeByDate : {}; let seconds = 0;
    for (let offset = 0; offset < 7; offset += 1) { const date = new Date(now); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() - offset); const zoneOffset = date.getTimezoneOffset() * 60000; const key = new Date(date.getTime() - zoneOffset).toISOString().slice(0, 10); seconds += safeNumber(byDate[key], 864000); }
    return seconds;
  }

  function analyzeErrorPatterns(allAttempts) {
    const counts = new Map();
    allAttempts.flat().slice(-40).filter((item) => !item.correct && item.topic).forEach((item) => counts.set(item.topic, (counts.get(item.topic) || 0) + 1));
    return [...counts.entries()].filter(([, count]) => count >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3).map(([topic, count]) => ({ topic, count }));
  }

  function analyzeEnglishSkills({ courseId = COURSE_ID, progress = {}, curriculum = window.HOC_CUNG_BE_ENGLISH_GRADE_1, now = new Date() } = {}) {
    if (courseId !== COURSE_ID || curriculum?.id !== COURSE_ID) return null;
    const index = curriculumIndex(curriculum); const collected = collectAttempts(progress, index); const skills = {};
    ["listening", "reading", "writing"].forEach((skillId) => {
      const items = collected.attempts[skillId]; const correctTasks = items.filter((item) => item.correct).length; const recent = items.slice(-10); const recentCorrect = recent.filter((item) => item.correct).length;
      skills[skillId] = { id: skillId, ...SKILL_META[skillId], attemptedTasks: items.length, correctTasks, accuracy: percent(correctTasks, items.length), recentAccuracy: percent(recentCorrect, recent.length), coverage: percent(collected.attemptedIds[skillId].size, index.available[skillId].size), trend: getRecentSkillTrend(items), attempts: items };
      skills[skillId].status = getSkillStatus(skillId, skills[skillId]);
    });
    const availableActivities = index.available.speaking.size; const completedIds = new Set();
    index.available.speaking.forEach((levelId) => { const item = progress?.levels?.[levelId]; if (item?.completed || safeNumber(item?.attempts) > 0) completedIds.add(levelId); });
    skills.speaking = { id: "speaking", ...SKILL_META.speaking, availableActivities, completedActivities: completedIds.size, participationRate: percent(completedIds.size, availableActivities), coverage: percent(completedIds.size, availableActivities), accuracy: null, trend: completedIds.size < 2 ? "insufficient_data" : "stable" };
    skills.speaking.status = getSkillStatus("speaking", skills.speaking);
    const hasData = ["listening", "reading", "writing"].some((id) => skills[id].attemptedTasks > 0) || skills.speaking.completedActivities > 0;
    const measured = ["listening", "reading", "writing"].filter((id) => skills[id].attemptedTasks >= 5);
    const strongestSkill = measured.slice().sort((a, b) => skills[b].accuracy - skills[a].accuracy)[0] || null;
    const practiceSkill = measured.slice().sort((a, b) => skills[a].accuracy - skills[b].accuracy)[0] || null;
    return { courseId, skills, hasData, strongestSkill, practiceSkill: practiceSkill === strongestSkill ? null : practiceSkill, errorPatterns: analyzeErrorPatterns([skills.listening.attempts, skills.reading.attempts, skills.writing.attempts]), studyTimeLast7Days: studyTimeLast7Days(progress, now), historyCount: Math.min(50, Array.isArray(progress?.history) ? progress.history.length : 0), recommendations: [], index };
  }

  function buildEnglishSkillRecommendations(analysis, { progress = {}, curriculum = window.HOC_CUNG_BE_ENGLISH_GRADE_1 } = {}) {
    if (!analysis) return [];
    const typePriority = { listening: ["listen-choice"], reading: ["word-to-image", "image-choice", "mini-dialogue-choice", "choice", "match"], writing: ["letter-order", "order"], speaking: [] };
    const candidates = []; const targetSkills = SKILL_IDS.slice().sort((a, b) => {
      const left = a === "speaking" ? analysis.skills[a].participationRate ?? 101 : analysis.skills[a].accuracy ?? 101; const right = b === "speaking" ? analysis.skills[b].participationRate ?? 101 : analysis.skills[b].accuracy ?? 101; return left - right;
    });
    targetSkills.forEach((skillId) => {
      const levels = (Array.isArray(curriculum?.levels) ? curriculum.levels : []).filter((level) => {
        if (skillId === "speaking") return explicitSkills(level).includes("speaking");
        return (level.questions || []).some((question) => getQuestionSkills(question).includes(skillId) && (!typePriority[skillId].length || typePriority[skillId].includes(question.type)));
      });
      const actionable = levels.filter((level) => progress?.levels?.[level.id]?.unlocked).sort((a, b) => Number(Boolean(progress?.levels?.[a.id]?.completed)) - Number(Boolean(progress?.levels?.[b.id]?.completed)) || a.order - b.order)[0];
      const meta = SKILL_META[skillId];
      candidates.push({ skillId, icon: meta.icon, text: actionable ? `${meta.icon} ${meta.label}: ${progress?.levels?.[actionable.id]?.completed ? "ôn lại" : "luyện"} ${actionable.title}.` : `${meta.icon} ${meta.label}: tiếp tục các hoạt động ${meta.label.toLowerCase()} đã mở gần đây.`, levelId: actionable?.id || null, directCta: Boolean(actionable) });
    });
    return candidates.slice(0, 3);
  }

  function formatMinutes(seconds) { const minutes = Math.round(safeNumber(seconds) / 60); return minutes < 60 ? `${minutes} phút` : `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`; }
  function renderEnglishSkillDashboard({ courseId = COURSE_ID, progress = {}, curriculum = window.HOC_CUNG_BE_ENGLISH_GRADE_1 } = {}) {
    let section = document.querySelector("#english-skill-analytics");
    if (!section) { section = document.createElement("section"); section.id = "english-skill-analytics"; section.className = "parent-section english-skill-analytics"; section.setAttribute("aria-labelledby", "english-skill-title"); document.querySelector("#parent-summary")?.insertAdjacentElement("afterend", section); }
    section.hidden = courseId !== COURSE_ID;
    if (section.hidden) { section.replaceChildren(); return null; }
    const analysis = analyzeEnglishSkills({ courseId, progress, curriculum }); const recommendations = buildEnglishSkillRecommendations(analysis, { progress, curriculum }); analysis.recommendations = recommendations;
    if (!analysis.hasData) { section.innerHTML = `<p class="eyebrow">Phân tích kết quả học tập</p><h2 id="english-skill-title">4 kỹ năng Tiếng Anh</h2><div class="english-skill-empty" role="status"><strong>Chưa đủ dữ liệu để phân tích.</strong><span>Bé hãy hoàn thành vài bài Tiếng Anh trước nhé.</span></div>`; return analysis; }
    const cards = SKILL_IDS.map((skillId) => {
      const skill = analysis.skills[skillId]; const speaking = skillId === "speaking"; const metric = speaking ? `${skill.completedActivities} / ${skill.availableActivities}` : skill.accuracy === null ? `Đã làm ${skill.attemptedTasks} hoạt động` : `${skill.accuracy}%`; const progressValue = speaking ? skill.participationRate ?? 0 : skill.accuracy ?? 0; const detail = speaking ? `Mức tham gia ${skill.participationRate ?? 0}% · không chấm phát âm` : `Đã làm ${skill.attemptedTasks} hoạt động · Gần đây ${skill.recentAccuracy === null ? "chưa đủ dữ liệu" : `${skill.recentAccuracy}%`}`; const recommendation = recommendations.find((item) => item.skillId === skillId)?.text || `${skill.icon} Tiếp tục luyện tập trong các bài đã mở.`;
      return `<article class="english-skill-card" data-skill="${skillId}"><div class="english-skill-card__heading"><span aria-hidden="true">${skill.icon}</span><h3>${skill.label}</h3></div><strong class="english-skill-card__metric">${metric}</strong><span class="english-skill-progress" role="progressbar" aria-label="${skill.label}: ${speaking ? "mức tham gia" : "độ chính xác"} ${progressValue}%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressValue}"><i style="width:${progressValue}%"></i></span><p>${detail}</p><strong class="english-skill-status">${skill.status}</strong><small>${TREND_LABELS[skill.trend]}</small><p class="english-skill-recommendation">${recommendation}</p></article>`;
    }).join("");
    const insight = analysis.strongestSkill ? `<div class="english-skill-insight"><div><span>Điểm mạnh hiện tại</span><strong>${SKILL_META[analysis.strongestSkill].icon} ${SKILL_META[analysis.strongestSkill].label}</strong></div>${analysis.practiceSkill ? `<div><span>Nên luyện thêm</span><strong>${SKILL_META[analysis.practiceSkill].icon} ${SKILL_META[analysis.practiceSkill].label}</strong></div>` : ""}</div>` : "";
    const patterns = analysis.errorPatterns.length ? `<p class="english-error-pattern"><strong>Trong các bài gần nhất nên ôn:</strong> ${analysis.errorPatterns.map((item) => item.topic).join(", ")}.</p>` : "";
    section.innerHTML = `<div class="parent-section__heading"><div><p class="eyebrow">Phân tích kết quả học tập</p><h2 id="english-skill-title">4 kỹ năng Tiếng Anh</h2><p>Dữ liệu gần đây từ tối đa 50 lượt học của riêng bé đang chọn.</p></div><strong class="english-study-time">Thời gian học Tiếng Anh 7 ngày gần đây: ${formatMinutes(analysis.studyTimeLast7Days)}</strong></div>${insight}<div class="english-skill-grid">${cards}</div>${patterns}`;
    return analysis;
  }

  function runSelfTests() {
    const curriculum = window.HOC_CUNG_BE_ENGLISH_GRADE_1; const results = []; const test = (id, passed) => results.push({ id, passed: Boolean(passed) }); const q = (type, extra = {}) => ({ id: `Q-${type}`, type, ...extra });
    test("1 module loads", true); test("2 four skill IDs", SKILL_IDS.join(",") === "listening,speaking,reading,writing"); test("3 listening mapping", getQuestionSkills(q("listen-choice"))[0] === "listening"); test("4 reading mapping", getQuestionSkills(q("word-to-image"))[0] === "reading"); test("5 writing mapping", getQuestionSkills(q("letter-order"))[0] === "writing"); test("6 speaking model", explicitSkills({ skills: ["speaking"] })[0] === "speaking");
    const speaking = analyzeEnglishSkills({ progress: {}, curriculum }).skills.speaking; test("7 no fake speaking accuracy", speaking.accuracy === null); test("8 empty state", analyzeEnglishSkills({ progress: {}, curriculum }).hasData === false);
    const firstListening = curriculum.levels.flatMap((level) => level.questions.map((question) => ({ level, question }))).find((item) => getQuestionSkills(item.question).includes("listening")); const lowProgress = { history: [0, 1].map((index) => ({ questionId: firstListening.question.id, levelId: firstListening.level.id, correct: true, timestamp: `2026-10-0${index + 1}T00:00:00Z` })) };
    const low = analyzeEnglishSkills({ progress: lowProgress, curriculum }); test("9 low sample", low.skills.listening.status === "Chưa đủ dữ liệu" && low.skills.listening.attemptedTasks === 2);
    const detailed = { history: [true, true, true, false, false, true, true, true, true, true].map((correct, index) => ({ questionId: firstListening.question.id, levelId: firstListening.level.id, correct, timestamp: `2026-10-${String(index + 1).padStart(2, "0")}T00:00:00Z` })) }; const detailAnalysis = analyzeEnglishSkills({ progress: detailed, curriculum });
    test("10 accuracy", detailAnalysis.skills.listening.accuracy === 80); test("11 recent accuracy", detailAnalysis.skills.listening.recentAccuracy === 80); test("12 trend improving", getRecentSkillTrend([false, false, false, true, true, true].map((correct) => ({ correct }))) === "improving"); test("13 trend stable", getRecentSkillTrend([true, false, true, true, false, true].map((correct) => ({ correct }))) === "stable"); test("14 trend insufficient", getRecentSkillTrend([{ correct: true }]) === "insufficient_data");
    const progress = { levels: Object.fromEntries(curriculum.levels.map((level, index) => [level.id, { unlocked: index < 3, completed: index === 0, attempts: index === 0 ? 1 : 0 }])) }; const recommendations = buildEnglishSkillRecommendations(detailAnalysis, { progress, curriculum }); test("15 recommendations", recommendations.length > 0); test("16 max 3 recommendations", recommendations.length <= 3); test("17 locked level not direct CTA", recommendations.every((item) => !item.levelId || progress.levels[item.levelId]?.unlocked));
    const childA = analyzeEnglishSkills({ progress: detailed, curriculum }); const childB = analyzeEnglishSkills({ progress: {}, curriculum }); test("18 child isolation", childA.hasData && !childB.hasData); test("19 course isolation", analyzeEnglishSkills({ courseId: "math-grade-1", progress: detailed, curriculum }) === null); test("20 legacy history lookup", analyzeEnglishSkills({ progress: { history: [{ levelId: firstListening.level.id, correct: 4, questionCount: 5, completedAt: "2026-10-01T00:00:00Z" }] }, curriculum }).skills.listening.attemptedTasks > 0); test("21 unknown history safe skip", !analyzeEnglishSkills({ progress: { history: [{ levelId: "EN-OLD", correct: 1, questionCount: 1 }] }, curriculum }).hasData); test("22 history 50", analyzeEnglishSkills({ progress: { history: Array.from({ length: 50 }, (_, index) => ({ questionId: firstListening.question.id, correct: true, timestamp: String(index) })) }, curriculum }).historyCount === 50);
    const section = document.createElement("section"); section.id = "english-skill-analytics"; document.body.append(section); renderEnglishSkillDashboard({ progress: detailed, curriculum }); test("23 English dashboard render", section.querySelectorAll(".english-skill-card").length === 4); renderEnglishSkillDashboard({ courseId: "math-grade-1", progress: {}, curriculum }); test("24 Math unchanged", section.hidden && section.childElementCount === 0); renderEnglishSkillDashboard({ courseId: "vietnamese-grade-1", progress: {}, curriculum }); test("25 Vietnamese unchanged", section.hidden); renderEnglishSkillDashboard({ progress: detailed, curriculum }); test("26 accessibility", section.querySelectorAll('[role="progressbar"][aria-valuenow]').length === 4); test("27 responsive skill cards", section.querySelector(".english-skill-grid") !== null); test("28 explicit metadata priority", getQuestionSkills(q("choice", { skills: ["writing"] }))[0] === "writing"); test("29 animation explicit only", getQuestionSkills(q("animation-choice")).length === 0); test("30 speaking participation", analyzeEnglishSkills({ progress: { levels: { [curriculum.levels[0].id]: { completed: true } } }, curriculum }).skills.speaking.completedActivities === 1);
    const firstReading = curriculum.levels.flatMap((level) => level.questions.map((question) => ({ level, question }))).find((item) => getQuestionSkills(item.question).includes("reading")); const firstWriting = curriculum.levels.flatMap((level) => level.questions.map((question) => ({ level, question }))).find((item) => getQuestionSkills(item.question).includes("writing"));
    const mixed = { history: [...Array.from({ length: 6 }, (_, index) => ({ questionId: firstListening.question.id, correct: true, timestamp: `L${index}` })), ...Array.from({ length: 6 }, (_, index) => ({ questionId: firstReading.question.id, correct: index < 2, timestamp: `R${index}` })), { questionId: firstWriting.question.id, correct: true, timestamp: "W1" }] }; const mixedAnalysis = analyzeEnglishSkills({ progress: mixed, curriculum });
    test("31 fixture mixed skills", mixedAnalysis.skills.listening.attemptedTasks === 6 && mixedAnalysis.skills.reading.attemptedTasks === 6 && mixedAnalysis.skills.writing.attemptedTasks === 1); test("32 strong listening weaker reading", mixedAnalysis.skills.listening.accuracy > mixedAnalysis.skills.reading.accuracy); test("33 writing practice", mixedAnalysis.skills.writing.correctTasks === 1); test("34 v29 progress", analyzeEnglishSkills({ progress: { progressVersion: 2, levels: { "EN-20": { completed: true, attempts: 1 } }, history: [] }, curriculum }).skills.speaking.completedActivities === 1); test("35 v30 progress", analyzeEnglishSkills({ progress: { progressVersion: 2, levels: { "EN-40": { completed: true, attempts: 1 } }, history: [] }, curriculum }).skills.speaking.completedActivities === 1);
    const repeatedErrors = { history: [0, 1].map((index) => ({ questionId: firstReading.question.id, correct: false, timestamp: `E${index}` })) }; test("36 error pattern needs repeated errors", analyzeEnglishSkills({ progress: repeatedErrors, curriculum }).errorPatterns[0]?.count === 2); test("37 one error is not a pattern", analyzeEnglishSkills({ progress: { history: repeatedErrors.history.slice(0, 1) }, curriculum }).errorPatterns.length === 0); section.remove();
    return { passed: results.every((item) => item.passed), results };
  }

  window.HocCungBeLearningAnalytics = { COURSE_ID, SKILL_IDS, SKILL_META, getQuestionSkills, analyzeEnglishSkills, buildEnglishSkillRecommendations, getSkillStatus, getRecentSkillTrend, renderEnglishSkillDashboard, studyTimeLast7Days };
  window.__hocCungBeLearningAnalyticsTests = runSelfTests();
})();