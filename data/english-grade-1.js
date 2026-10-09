"use strict";

// Original English Grade 1 foundation content for Học Cùng Bé.
// CEFR Pre-A1 and Pre A1 Starters are skill benchmarks only; this is not an
// official or certified Ministry/Cambridge curriculum.
(() => {
  const base = "assets/english-grade-1";
  const art = (name, alt) => ({ type: "image", src: `${base}/images/${name}.webp`, alt });
  const animation = (name, poster, ariaLabel) => ({ type: "animation", animation: name, poster: `${base}/posters/${poster}.webp`, ariaLabel, fallback: `${base}/images/${poster}.webp` });
  const video = (file, poster, animationFallback, ariaLabel, duration) => ({ type: "video", available: true, webm: `${base}/videos/${file}.webm`, mimeType: "video/webm", poster: `${base}/posters/${poster}.webp`, fallback: `${base}/images/${poster}.webp`, animationFallback, ariaLabel, duration });
  const q = (id, type, displayText, answer, options, extra = {}) => ({ id, type, displayText, prompt: displayText, answer, options, helper: extra.helper || "Quan sát hoặc lắng nghe thật kỹ nhé!", tip: extra.tip || "Bé có thể thử lại nếu chưa đúng.", ...extra });
  const standards = (focus) => ({
    vietnam: ["Làm quen Tiếng Anh lớp 1–2", "Ưu tiên nghe, nói, nhận biết và đọc/viết rất cơ bản", focus],
    cefr: ["CEFR Pre-A1: nhận biết từ và câu quen thuộc rất ngắn"],
    preA1Skill: ["Pre A1: nghe chọn thông tin cụ thể, đọc từ ngắn và trả lời đơn giản"],
  });
  const visual = {
    letters: { A: "🅰️", B: "🅱️", C: "🌙", D: "◖", E: "📧", F: "🏳️", G: "🌀", H: "♓", I: "ℹ️", J: "🪝", K: "🎋", L: "📐", M: "〽️", N: "📈", O: "⭕", P: "🅿️", Q: "🍳", R: "®️", S: "〰️", T: "🌴", U: "🧲", V: "✌️", W: "〰️", X: "❌", Y: "🍸", Z: "⚡" },
    words: {
      hello: "👋", hi: "🙂", goodbye: "👋", bye: "😊", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", ten: "🔟",
      red: "🔴", blue: "🔵", yellow: "🟡", green: "🟢", orange: "🟠", pink: "🌸", purple: "🟣", book: "📘", pen: "🖊️", pencil: "✏️", bag: "🎒", ruler: "📏",
      mother: "👩", father: "👨", sister: "👧", brother: "👦", baby: "👶", head: "🙂", eye: "👁️", ear: "👂", nose: "👃", mouth: "👄", hand: "✋",
      cat: "🐱", dog: "🐶", bird: "🐦", fish: "🐟", rabbit: "🐰", apple: "🍎", banana: "🍌", orangeFruit: "🍊", grape: "🍇", watermelon: "🍉",
      ball: "⚽", doll: "🪆", kite: "🪁", car: "🚗", "teddy bear": "🧸", run: "🏃", jump: "🤸", sit: "🪑", stand: "🧍", walk: "🚶",
    },
  };
  const iconFor = (word) => visual.words[word] || (word === "orange" ? "🟠" : "✨");
  const imageOptions = (words) => Object.fromEntries(words.map((word) => [word, iconFor(word)]));
  const level = (id, title, topic, targetVocabulary, targetExpressions, skills, media, questions, focus) => ({
    id, title, topic, order: Number(id.slice(3)), type: "english", questionCount: 5, unlockScore: 80, rewardStars: [60, 80, 100], speechLocale: "en-US",
    targetVocabulary, targetExpressions, skills, standards: standards(focus), media, questions,
  });
  const wordLevel = (id, title, topic, words, imageName, focus, mediaExtra = null) => {
    const [a, b, c, d, e = a, f = b, g = c] = words;
    const wordIcon = (word) => title === "Fruits" && word === "orange" ? "🍊" : iconFor(word);
    const wordImages = (items) => Object.fromEntries(items.map((word) => [word, wordIcon(word)]));
    const pool = [...new Set([...words, "book", "cat", "red", "one", "jump"])];
    const four = (answer, preferred = pool) => [answer, ...preferred.filter((item) => item !== answer)].slice(0, 4);
    const media = { learn: [art(imageName, `Tranh minh họa ${title}`)], featured: mediaExtra };
    return level(id, title, topic, words, [], ["listening", "speaking", "reading"], media, [
      q(`${id}-01`, id === "EN-19" ? "video-choice" : "image-choice", id === "EN-19" ? "Xem video và chọn hành động đúng." : "Chọn từ tiếng Anh đúng.", a, four(a, [b, c, d]), id === "EN-19" ? { video: { ...mediaExtra, clipStart: 3.2, clipEnd: 6.4, ariaLabel: "Video câu hỏi: nhân vật thực hiện một hành động" }, speechText: "What is the action?" } : { visual: wordIcon(a), optionVisuals: null, speechText: "Choose the correct English word." }),
      q(`${id}-02`, "listen-choice", "Nghe và chọn hình đúng.", b, four(b, [a, c, d]), { speechText: b, hideTranscript: true, optionVisuals: wordImages(four(b, [a, c, d])) }),
      q(`${id}-03`, "word-to-image", `Chọn hình đúng với từ: ${c}`, c, four(c, [a, b, d]), { optionVisuals: wordImages(four(c, [a, b, d])), speechText: "Choose the correct picture." }),
      q(`${id}-04`, "match", "Chọn cặp từ và hình khớp nhau.", `${d}|${wordIcon(d)}`, [`${d}|${wordIcon(d)}`, `${a}|${wordIcon(b)}`, `${b}|${wordIcon(c)}`, `${c}|${wordIcon(a)}`], { speechText: "Choose the matching pair." }),
      q(`${id}-05`, "true-false", `Hình này là “${e}”. Đúng hay sai?`, "Đúng", ["Đúng", "Sai"], { visual: wordIcon(e), speechText: "Is the word correct?", revealText: `${e} — từ cần nhớ` }),
    ], focus);
  };
  const letterLevel = (id, title, letters, imageName) => {
    const [a, b, c, d, e = a, f = b] = letters;
    return level(id, title, "english-letters", letters, [], ["listening", "speaking", "reading", "writing-letter-skills"], { learn: [art(imageName, `Các chữ ${letters.join(", ")}`)] }, [
      q(`${id}-01`, "choice", `Tìm chữ ${a}.`, a, [b, a, c, d], { speechText: `Find letter ${a}.` }),
      q(`${id}-02`, "listen-choice", "Nghe tên chữ cái và chọn đúng.", b, [a, c, b, d], { speechText: `Letter ${b}`, hideTranscript: true }),
      q(`${id}-03`, "image-choice", "Chọn chữ giống hình mẫu.", c, [d, b, a, c], { visual: visual.letters[c], speechText: "Choose the matching letter." }),
      q(`${id}-04`, "letter-order", "Chọn thứ tự chữ cái đúng.", `${a} ${b} ${c} ${d}`, [`${a} ${b} ${c} ${d}`, `${b} ${a} ${d} ${c}`, `${d} ${c} ${b} ${a}`, `${a} ${c} ${b} ${d}`], { speechText: "Choose the letters in alphabet order." }),
      q(`${id}-05`, "true-false", `${e} đứng trước ${f} trong bảng chữ cái.`, "Đúng", ["Đúng", "Sai"], { speechText: "Is this alphabet order correct?" }),
    ], "Nhận diện và nghe tên chữ cái Latin ở mức làm quen");
  };

  const levels = [
    letterLevel("EN-01", "Letters A, B, C, D", ["A", "B", "C", "D"], "letters-abcd"),
    letterLevel("EN-02", "Letters E, F, G, H", ["E", "F", "G", "H"], "letters-efgh"),
    letterLevel("EN-03", "Letters I, J, K, L", ["I", "J", "K", "L"], "letters-ijkl"),
    letterLevel("EN-04", "Letters M, N, O, P", ["M", "N", "O", "P"], "letters-mnop"),
    letterLevel("EN-05", "Letters Q, R, S, T", ["Q", "R", "S", "T"], "letters-qrst"),
    letterLevel("EN-06", "Letters U, V, W, X, Y, Z", ["U", "V", "W", "X", "Y", "Z"], "letters-uvwxyz"),
    level("EN-07", "Uppercase and lowercase", "english-letters", ["A/a", "B/b", "C/c", "D/d"], [], ["listening", "reading", "writing-letter-skills"], { learn: [art("uppercase-lowercase", "Chữ hoa và chữ thường") ] }, [
      q("EN-07-01", "match", "Chọn cặp chữ hoa và chữ thường.", "A|a", ["A|a", "A|b", "B|c", "C|d"], { speechText: "Match uppercase A with lowercase a." }),
      q("EN-07-02", "choice", "Chữ thường của B là chữ nào?", "b", ["d", "p", "b", "q"], { speechText: "Choose lowercase b." }),
      q("EN-07-03", "listen-choice", "Nghe và chọn cặp chữ đúng.", "C c", ["A a", "D d", "C c", "B b"], { speechText: "Uppercase C and lowercase c", hideTranscript: true }),
      q("EN-07-04", "letter-order", "Chọn thứ tự đúng.", "A a B b", ["A a B b", "a A b B", "B b A a", "A b B a"], { speechText: "Choose the correct uppercase and lowercase order." }),
      q("EN-07-05", "true-false", "D và d là cùng một chữ cái.", "Đúng", ["Đúng", "Sai"], { speechText: "Uppercase D and lowercase d are the same letter." }),
    ], "Ghép chữ hoa với chữ thường"),
    level("EN-08", "Hello and Goodbye", "english-communication", ["hello", "hi", "goodbye", "bye"], ["Hello!", "Hi!", "Goodbye!", "Bye!"], ["listening", "speaking", "reading"], { learn: [art("greetings", "Hai bạn nhỏ chào nhau")], featured: video("en-08-greetings", "greetings", "greetings-wave", "Video hai bạn chào và tạm biệt", 12) }, [
      q("EN-08-01", "listen-choice", "Nghe và chọn lời chào đúng.", "hello", ["hello", "goodbye", "bye", "book"], { speechText: "Hello!", hideTranscript: true }),
      q("EN-08-02", "mini-dialogue-choice", "A: Hello!\nB: ...", "Hi!", ["Hi!", "Goodbye!", "Red!", "One!"], { speechText: "A says hello. What should B say?" }),
      q("EN-08-03", "animation-choice", "Bạn nhỏ đang vẫy tay chào gặp mặt. Chọn từ đúng.", "hello", ["hello", "goodbye", "pencil", "cat"], { animation: "greetings-wave", speechText: "Choose the greeting." }),
      q("EN-08-04", "choice", "Chọn lời tạm biệt.", "goodbye", ["hello", "hi", "goodbye", "book"], { speechText: "Choose the word for saying goodbye." }),
      q("EN-08-05", "true-false", "“Bye!” là lời tạm biệt.", "Đúng", ["Đúng", "Sai"], { speechText: "Bye is a way to say goodbye." }),
    ], "Nghe, nói lời chào và tạm biệt rất ngắn"),
    level("EN-09", "My name", "english-communication", ["name"], ["My name is ...", "I am ..."], ["listening", "speaking", "reading"], { learn: [art("greetings", "Bạn nhỏ tự giới thiệu") ] }, [
      q("EN-09-01", "mini-dialogue-choice", "A: What is your name?\nB: ...", "My name is Lan.", ["My name is Lan.", "Goodbye.", "It is red.", "Three."], { speechText: "What is your name?" }),
      q("EN-09-02", "listen-choice", "Nghe và chọn câu giới thiệu tên.", "I am Nam.", ["I am Nam.", "Hi, cat.", "It is blue.", "Bye, book."], { speechText: "I am Nam.", hideTranscript: true }),
      q("EN-09-03", "order", "Chọn câu có thứ tự từ đúng.", "My name is Mai.", ["My name is Mai.", "Name my Mai is.", "Mai is my name is.", "Is Mai name my."], { speechText: "Choose the sentence in the correct order." }),
      q("EN-09-04", "true-false", "“My name is An.” dùng để giới thiệu tên.", "Đúng", ["Đúng", "Sai"], { speechText: "My name is An. Is this an introduction?" }),
      q("EN-09-05", "choice", "Chọn câu hoàn chỉnh.", "I am Hoa.", ["I am Hoa.", "Am Hoa I.", "I Hoa am.", "Hoa I am am."], { speechText: "Choose the complete introduction." }),
    ], "Nói/lặp lại mẫu tự giới thiệu ngắn, không học lý thuyết ngữ pháp"),
    wordLevel("EN-10", "Numbers 1–5", "english-numbers-colors", ["one", "two", "three", "four", "five"], "numbers", "Nghe và nhận biết số 1–5"),
    wordLevel("EN-11", "Numbers 6–10", "english-numbers-colors", ["six", "seven", "eight", "nine", "ten"], "numbers", "Nghe và nhận biết số 6–10"),
    wordLevel("EN-12", "Colors", "english-numbers-colors", ["red", "blue", "yellow", "green", "orange", "pink", "purple"], "colors", "Nhận biết và nói màu quen thuộc", video("en-12-colors", "colors", "colors-change", "Video đồ vật quen thuộc với các màu khác nhau", 14)),
    wordLevel("EN-13", "School things", "english-everyday", ["book", "pen", "pencil", "bag", "ruler"], "school-things", "Nhận biết đồ dùng học tập quen thuộc"),
    wordLevel("EN-14", "Family", "english-everyday", ["mother", "father", "sister", "brother", "baby"], "family", "Nghe và nhận biết người thân trong gia đình"),
    wordLevel("EN-15", "Body and face", "english-everyday", ["head", "eye", "ear", "nose", "mouth", "hand"], "body", "Nghe và làm quen từ chỉ bộ phận cơ thể"),
    wordLevel("EN-16", "Animals", "english-world", ["cat", "dog", "bird", "fish", "rabbit"], "animals", "Nhận biết con vật gần gũi"),
    wordLevel("EN-17", "Fruits", "english-world", ["apple", "banana", "orange", "grape", "watermelon"], "fruits", "Nhận biết hoa quả quen thuộc"),
    wordLevel("EN-18", "Toys", "english-world", ["ball", "doll", "kite", "car", "teddy bear"], "toys", "Nhận biết đồ chơi quen thuộc"),
    wordLevel("EN-19", "Actions", "english-world", ["jump", "run", "sit", "stand", "walk"], "actions", "Nghe và làm theo hướng dẫn hành động đơn giản", video("en-19-actions", "actions", "actions-move", "Video nhân vật chạy, nhảy, ngồi, đứng và đi bộ", 16)),
    level("EN-20", "Review 1", "english-review", ["A–Z", "numbers 1–10", "colors", "school things", "family", "animals", "fruits", "actions"], ["Hello!", "My name is ..."], ["listening", "speaking", "reading", "writing-letter-skills"], { learn: [art("review", "Ôn tập Tiếng Anh EN-01 đến EN-19")] }, [
      q("EN-20-01", "listen-choice", "Nghe và chọn hình đúng.", "cat", ["cat", "book", "apple", "jump"], { speechText: "cat", hideTranscript: true, optionVisuals: imageOptions(["cat", "book", "apple", "jump"]) }),
      q("EN-20-02", "image-choice", "Chọn từ tiếng Anh đúng.", "apple", ["apple", "banana", "dog", "book"], { visual: "🍎", speechText: "Choose the correct English word." }),
      q("EN-20-03", "letter-order", "Chọn thứ tự chữ để tạo từ CAT.", "C A T", ["C A T", "A C T", "T A C", "C T A"], { speechText: "Choose the letters that spell cat." }),
      q("EN-20-04", "match", "Chọn cặp khớp nhau.", "three|3️⃣", ["three|3️⃣", "red|🔵", "book|🐶", "run|🪑"], { speechText: "Choose the matching pair." }),
      q("EN-20-05", "animation-choice", "Nhân vật đang nhảy. Chọn hành động đúng.", "jump", ["run", "jump", "sit", "walk"], { animation: "actions-move", speechText: "Choose the action." }),
    ], "Ôn tập, củng cố nội dung đã học; không thêm lượng lớn kiến thức mới"),
  ];

  const topicRows = [
    ["english-letters", "Letters", "🔠", "Làm quen chữ cái, chữ hoa và chữ thường."],
    ["english-communication", "Hello and me", "👋", "Nghe, nói lời chào và giới thiệu tên."],
    ["english-numbers-colors", "Numbers and colors", "🌈", "Nghe và nhận biết số, màu sắc."],
    ["english-everyday", "My school and family", "🎒", "Đồ dùng, gia đình, cơ thể và khuôn mặt."],
    ["english-world", "Animals, fruits and actions", "🐾", "Từ quen thuộc trong thế giới quanh bé."],
    ["english-review", "Review 1", "🌟", "Ôn nội dung EN-01 đến EN-19."],
  ];
  const topics = Object.fromEntries(topicRows.map(([id, title, icon, description], index) => [id, { id, title, shortTitle: title, icon, description, colorTheme: ["blue", "orange", "purple", "green", "pink", "yellow"][index], sortOrder: index + 1 }]));
  window.HOC_CUNG_BE_ENGLISH_GRADE_1 = { id: "english-grade-1", name: "Tiếng Anh lớp 1", shortName: "Tiếng Anh", grade: "grade-1", icon: "🔠", speechLocale: "en-US", description: "Từ mới • Nghe nói • Làm quen tiếng Anh", topics, levels };
})();