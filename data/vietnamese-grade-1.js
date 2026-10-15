"use strict";

// Original, offline Vietnamese Grade 1 content. displayText and speechText are
// deliberately separate: a letter may be taught by its sound, not by spelling it.
(() => {
  const choice = (displayText, answer, choices, speechText, illustration = "") => ({ type: "choose", displayText, prompt: illustration ? `<span class="vietnamese-illustration">${illustration}</span><span>${displayText}</span>` : displayText, answer, options: choices, speechText, helper: "Nghe hoặc nhìn thật kỹ rồi chọn nhé!", tip: "Bình tĩnh quan sát từng đáp án.", illustration });
  const blend = (left, right, answer, choices, speechText) => ({ type: "blend", displayText: `${left} + ${right} = ?`, prompt: `<span class="vietnamese-blend"><b>${left}</b><i>+</i><b>${right}</b><i>=</i><strong>?</strong></span>`, answer, options: choices, speechText, helper: "Ghép hai phần lại thành một tiếng.", tip: "Đọc chậm từng phần rồi ghép lại nhé!" });
  const originalChoice = (...args) => ({ ...choice(...args), contentPilot: true, contentRelease: "v34" });
  const originalBlend = (...args) => ({ ...blend(...args), contentPilot: true, contentRelease: "v34" });
  const alphabet = [
    ["TV-01", "Nhận biết a, ă, â", "letters-a", "🔤", [["Đâu là chữ ă?", "ă", ["a", "ă", "â", "o"], "Hãy chọn chữ a ngắn có dấu râu: ă."], ["Đâu là chữ â?", "â", ["a", "ă", "â", "e"], "Hãy chọn chữ a có mũ: â."], ["Đâu là chữ a?", "a", ["ă", "â", "a", "o"], "Hãy quan sát kỹ rồi chọn chữ phù hợp."], ["Chữ nào có dấu râu?", "ă", ["â", "ă", "a", "ê"], "Hãy chọn chữ a ngắn có dấu râu."], ["Chữ nào có mũ?", "â", ["ă", "a", "â", "ơ"], "Hãy chọn chữ a có mũ."]]],
    ["TV-02", "Nhận biết b, c, d, đ", "letters-bcd", "🔤", [["Đâu là chữ đ?", "đ", ["d", "đ", "b", "c"], "Hãy chọn chữ đờ."], ["Đâu là chữ b?", "b", ["d", "c", "b", "đ"], "Hãy chọn chữ bê."], ["Đâu là chữ c?", "c", ["b", "đ", "c", "d"], "Hãy chọn chữ xê."], ["Đâu là chữ d?", "d", ["đ", "b", "d", "c"], "Hãy chọn chữ dê."], ["Chữ nào có nét ngang ở giữa?", "đ", ["d", "b", "c", "đ"], "Hãy chọn chữ đờ."]]],
    ["TV-03", "Nhận biết e, ê, g, h", "letters-egh", "🔤", [["Đâu là chữ ê?", "ê", ["e", "ê", "g", "h"], "Hãy chọn chữ e có mũ: ê."], ["Đâu là chữ h?", "h", ["g", "e", "h", "ê"], "Hãy chọn chữ hờ."], ["Đâu là chữ g?", "g", ["h", "ê", "e", "g"], "Hãy chọn chữ gờ."], ["Đâu là chữ e?", "e", ["ê", "g", "e", "h"], "Hãy nhìn các chữ rồi chọn chữ phù hợp."], ["Chữ nào có mũ?", "ê", ["g", "e", "h", "ê"], "Hãy chọn chữ e có mũ."]]],
    ["TV-04", "Nhận biết i, k, l, m, n", "letters-iklmn", "🔤", [["Đâu là chữ m?", "m", ["n", "m", "l", "i"], "Hãy chọn chữ mờ."], ["Đâu là chữ n?", "n", ["m", "k", "n", "l"], "Hãy chọn chữ nờ."], ["Đâu là chữ k?", "k", ["i", "l", "m", "k"], "Hãy chọn chữ ca."], ["Đâu là chữ l?", "l", ["n", "l", "i", "m"], "Hãy chọn chữ lờ."], ["Đâu là chữ i?", "i", ["k", "m", "i", "n"], "Hãy chọn chữ i."]]],
    ["TV-05", "Nhận biết o, ô, ơ", "letters-ooo", "🔤", [["Đâu là chữ ô?", "ô", ["o", "ô", "ơ", "a"], "Hãy chọn chữ o có mũ: ô."], ["Đâu là chữ ơ?", "ơ", ["o", "ô", "ơ", "e"], "Hãy chọn chữ o có dấu râu: ơ."], ["Đâu là chữ o?", "o", ["ô", "o", "ơ", "a"], "Hãy chọn chữ o."], ["Chữ nào có mũ?", "ô", ["ơ", "o", "ô", "ă"], "Hãy chọn chữ o có mũ."], ["Chữ nào có dấu râu?", "ơ", ["o", "ơ", "ô", "â"], "Hãy chọn chữ o có dấu râu."]]],
    ["TV-06", "p, q, r, s", "letters-pqrs", "🔊", [["Đâu là chữ p?", "p", ["q", "p", "r", "s"], "Hãy chọn chữ pờ."], ["Đâu là chữ q?", "q", ["p", "r", "q", "s"], "Hãy chọn chữ quy."], ["Đâu là chữ r?", "r", ["s", "q", "p", "r"], "Hãy quan sát kỹ rồi chọn chữ phù hợp."], ["Đâu là chữ s?", "s", ["r", "s", "p", "q"], "Hãy chọn chữ sờ."], ["Chữ nào có nét kéo xuống dưới?", "p", ["r", "s", "q", "p"], "Hãy chọn chữ pờ."]]],
    ["TV-07", "t, u, ư, v", "letters-tuuv", "🔊", [["Đâu là chữ ư?", "ư", ["u", "ư", "v", "t"], "Hãy chọn chữ ư."], ["Đâu là chữ u?", "u", ["ư", "v", "u", "t"], "Hãy chọn chữ u."], ["Đâu là chữ t?", "t", ["v", "t", "u", "ư"], "Hãy chọn chữ tờ."], ["Đâu là chữ v?", "v", ["t", "ư", "v", "u"], "Hãy chọn chữ vờ."], ["Chữ nào có dấu râu?", "ư", ["u", "v", "t", "ư"], "Hãy chọn chữ ư có dấu râu."]]],
    ["TV-08", "x, y", "letters-xy", "🔊", [["Đâu là chữ x?", "x", ["y", "x", "v", "s"], "Hãy chọn chữ xờ."], ["Đâu là chữ y?", "y", ["x", "v", "y", "i"], "Hãy chọn chữ i dài."], ["Chọn chữ x.", "x", ["s", "x", "y", "v"], "Hãy chọn chữ xờ."], ["Chọn chữ y.", "y", ["i", "y", "x", "v"], "Hãy chọn chữ i dài."], ["Chữ nào có nét kéo xuống?", "y", ["x", "v", "s", "y"], "Hãy chọn chữ i dài."]]],
    ["TV-09", "Phân biệt chữ dễ nhầm", "confusing", "🔎", [["Đâu là chữ đ?", "đ", ["d", "đ", "b", "p"], "Hãy chọn chữ đờ."], ["Đâu là chữ b?", "b", ["d", "p", "b", "q"], "Hãy chọn chữ bê."], ["Đâu là chữ p?", "p", ["q", "b", "d", "p"], "Hãy chọn chữ pờ."], ["Đâu là chữ ô?", "ô", ["o", "ô", "ơ", "a"], "Hãy chọn chữ o có mũ."], ["Đâu là chữ ă?", "ă", ["a", "â", "ă", "e"], "Hãy chọn chữ a có dấu râu."]]],
    ["TV-10", "Ôn bảng chữ cái cơ bản", "review", "🌟", [["Đâu là chữ ê?", "ê", ["e", "ê", "i", "y"], "Hãy chọn chữ e có mũ."], ["Đâu là chữ ơ?", "ơ", ["o", "ô", "ơ", "u"], "Hãy chọn chữ o có dấu râu."], ["Đâu là chữ đ?", "đ", ["d", "đ", "b", "p"], "Hãy chọn chữ đờ."], ["Đâu là chữ ư?", "ư", ["u", "ư", "v", "y"], "Hãy chọn chữ ư."], ["Đâu là chữ â?", "â", ["a", "ă", "â", "e"], "Hãy chọn chữ a có mũ."]]],
  ];
  const blends = [
    ["TV-11", "b + a = ba", "blend-ba", "🧩", [["b", "a", "ba", ["ba", "ca", "ma", "na"], "Ghép âm bờ với a, được tiếng ba."], ["b", "à", "bà", ["bá", "bà", "ba", "bạ"], "Ghép bờ với a huyền, được tiếng bà."], ["b", "á", "bá", ["bà", "bá", "ba", "bả"], "Ghép bờ với a sắc, được tiếng bá."], ["b", "a", "ba", ["ma", "ba", "ca", "na"], "Tiếng nào được ghép từ bờ và a?"], ["b", "ạ", "bạ", ["bạ", "bã", "bả", "bà"], "Ghép bờ với a nặng, được tiếng bạ."]]],
    ["TV-12", "c + a = ca", "blend-ca", "🧩", [["c", "a", "ca", ["ca", "ba", "ma", "na"], "Ghép cờ với a, được tiếng ca."], ["c", "á", "cá", ["cà", "cá", "ca", "cả"], "Ghép cờ với a sắc, được tiếng cá."], ["c", "à", "cà", ["ca", "cà", "cá", "cạ"], "Ghép cờ với a huyền, được tiếng cà."], ["c", "a", "ca", ["na", "ca", "ba", "ma"], "Tiếng nào được ghép từ cờ và a?"], ["c", "ạ", "cạ", ["cạ", "cã", "cả", "cà"], "Ghép cờ với a nặng, được tiếng cạ."]]],
    ["TV-13", "m + e = me", "blend-me", "🧩", [["m", "e", "me", ["me", "be", "ne", "le"], "Ghép mờ với e, được tiếng me."], ["m", "é", "mé", ["mè", "mé", "me", "mẹ"], "Ghép mờ với e sắc, được tiếng mé."], ["m", "è", "mè", ["me", "mè", "mé", "mẹ"], "Ghép mờ với e huyền, được tiếng mè."], ["m", "e", "me", ["be", "me", "ne", "le"], "Tiếng nào được ghép từ mờ và e?"], ["m", "ẹ", "mẹ", ["mẹ", "mẽ", "mẻ", "mè"], "Ghép mờ với e nặng, được tiếng mẹ."]]],
    ["TV-14", "n + o = no", "blend-no", "🧩", [["n", "o", "no", ["no", "bo", "mo", "co"], "Ghép nờ với o, được tiếng no."], ["n", "ó", "nó", ["nò", "nó", "no", "nọ"], "Ghép nờ với o sắc, được tiếng nó."], ["n", "ò", "nò", ["no", "nò", "nó", "nọ"], "Ghép nờ với o huyền, được tiếng nò."], ["n", "o", "no", ["mo", "no", "co", "bo"], "Tiếng nào được ghép từ nờ và o?"], ["n", "ọ", "nọ", ["nọ", "nõ", "nỏ", "nò"], "Ghép nờ với o nặng, được tiếng nọ."]]],
    ["TV-15", "Ghép phụ âm với nguyên âm", "blend-review", "🧩", [["b", "ê", "bê", ["bê", "be", "bơ", "bà"], "Ghép bờ với ê, được tiếng bê."], ["m", "ơ", "mơ", ["mô", "mơ", "me", "ma"], "Ghép mờ với ơ, được tiếng mơ."], ["c", "ô", "cô", ["co", "cô", "cơ", "ca"], "Ghép cờ với ô, được tiếng cô."], ["n", "ư", "nư", ["nư", "nu", "no", "ne"], "Ghép nờ với ư, được tiếng nư."], ["b", "ơ", "bơ", ["bo", "bơ", "bô", "ba"], "Ghép bờ với ơ, được tiếng bơ."]]],
  ];
  const readings = [
    ["TV-16", "Đọc ba, bà, bá", "reading-ba", "📖", [["Chọn tiếng ba.", "ba", ["bà", "bá", "ba", "bạ"], "Hãy chọn tiếng ba."], ["Chọn tiếng bà.", "bà", ["bá", "bà", "ba", "bả"], "Hãy chọn tiếng bà."], ["Chọn tiếng bá.", "bá", ["bà", "bá", "ba", "bạ"], "Hãy chọn tiếng bá."], ["Chọn tiếng bạ.", "bạ", ["bả", "bã", "bà", "bạ"], "Hãy chọn tiếng bạ."], ["Chọn tiếng bả.", "bả", ["bả", "bã", "bá", "ba"], "Hãy chọn tiếng bả."]]],
    ["TV-17", "Đọc ma, má, mà", "reading-ma", "📖", [["Chọn tiếng ma.", "ma", ["má", "mà", "ma", "mạ"], "Hãy chọn tiếng ma."], ["Chọn tiếng má.", "má", ["mà", "má", "ma", "mả"], "Hãy chọn tiếng má."], ["Chọn tiếng mà.", "mà", ["má", "mà", "ma", "mạ"], "Hãy chọn tiếng mà."], ["Chọn tiếng mạ.", "mạ", ["mả", "mã", "mà", "mạ"], "Hãy chọn tiếng mạ."], ["Chọn tiếng mã.", "mã", ["mã", "mả", "má", "ma"], "Hãy chọn tiếng mã."]]],
    ["TV-18", "Đọc ca, cá, cà", "reading-ca", "🐟", [["🐟 Chọn tiếng đúng cho hình.", "cá", ["ca", "cá", "cà", "cạ"], "Hình con cá. Hãy chọn tiếng cá."], ["Chọn tiếng ca.", "ca", ["cá", "cà", "ca", "cạ"], "Hãy chọn tiếng ca."], ["Chọn tiếng cá.", "cá", ["cà", "cá", "ca", "cả"], "Hãy chọn tiếng cá."], ["Chọn tiếng cà.", "cà", ["ca", "cà", "cá", "cạ"], "Hãy chọn tiếng cà."], ["Chọn tiếng cạ.", "cạ", ["cả", "cã", "cà", "cạ"], "Hãy chọn tiếng cạ."]]],
    ["TV-19", "Đọc be, bé, bè", "reading-be", "📖", [["Chọn tiếng be.", "be", ["bé", "bè", "be", "bẹ"], "Hãy chọn tiếng be."], ["Chọn tiếng bé.", "bé", ["bè", "bé", "be", "bẻ"], "Hãy chọn tiếng bé."], ["Chọn tiếng bè.", "bè", ["bé", "bè", "be", "bẹ"], "Hãy chọn tiếng bè."], ["Chọn tiếng bẹ.", "bẹ", ["bẻ", "bẽ", "bè", "bẹ"], "Hãy chọn tiếng bẹ."], ["Chọn tiếng bẻ.", "bẻ", ["bẻ", "bẽ", "bé", "be"], "Hãy chọn tiếng bẻ."]]],
    ["TV-20", "Ôn tiếng đơn giản có thanh", "reading-tones", "🌟", [["Chọn tiếng có dấu sắc.", "á", ["á", "à", "ả", "ã"], "Hãy chọn a sắc: á."], ["Chọn tiếng có dấu huyền.", "ầ", ["ấ", "ầ", "ẩ", "ẫ"], "Hãy chọn â huyền: ầ."], ["Chọn tiếng có dấu hỏi.", "ể", ["ế", "ề", "ể", "ệ"], "Hãy chọn ê hỏi: ể."], ["Chọn tiếng có dấu ngã.", "ỗ", ["ố", "ồ", "ổ", "ỗ"], "Hãy chọn ô ngã: ỗ."], ["Chọn tiếng có dấu nặng.", "ự", ["ứ", "ừ", "ử", "ự"], "Hãy chọn ư nặng: ự."]]],
  ];
  const extensions = [
    ["TV-21", "Thanh sắc", "tones-sac", "✦", [["Chọn tiếng có thanh sắc: ba / ?", "bá", ["bà", "ba", "bạ", "bá"], "Hãy chọn tiếng bá, có thanh sắc."], ["Chọn tiếng đúng cho hình 🐟.", "cá", ["cá", "ca", "cà", "cả"], "Hình con cá. Hãy chọn từ cá."], ["Tiếng nào viết là má?", "má", ["ma", "mà", "má", "mạ"], "Hãy chọn tiếng má, có thanh sắc."], ["Chọn tiếng có dấu sắc.", "bé", ["be", "bé", "bè", "bẻ"], "Hãy chọn tiếng bé, có thanh sắc."], ["Từ nào có thanh sắc?", "lá", ["la", "là", "lạ", "lá"], "Hãy chọn từ lá."]]],
    ["TV-22", "Thanh huyền", "tones-huyen", "〰", [["Chọn tiếng có thanh huyền: ba / ?", "bà", ["ba", "bá", "bà", "bạ"], "Hãy chọn tiếng bà, có thanh huyền."], ["Chọn từ đúng cho hình 👵.", "bà", ["bá", "bà", "bả", "bạ"], "Hình bà. Hãy chọn từ bà."], ["Tiếng nào viết là mà?", "mà", ["ma", "má", "mà", "mạ"], "Hãy chọn tiếng mà, có thanh huyền."], ["Chọn tiếng có dấu huyền.", "bè", ["be", "bé", "bè", "bẻ"], "Hãy chọn tiếng bè, có thanh huyền."], ["Từ nào có thanh huyền?", "cà", ["ca", "cá", "cà", "cạ"], "Hãy chọn từ cà."]]],
    ["TV-23", "Thanh hỏi", "tones-hoi", "❔", [["Chọn tiếng có thanh hỏi: ba / ?", "bả", ["ba", "bá", "bả", "bã"], "Hãy chọn tiếng bả, có thanh hỏi."], ["Tiếng nào có dấu hỏi?", "bẻ", ["be", "bé", "bẻ", "bẹ"], "Hãy chọn tiếng bẻ, có thanh hỏi."], ["Chọn tiếng đúng: mẹ bẻ lá.", "bẻ", ["bé", "bè", "bẻ", "bẽ"], "Trong câu mẹ bẻ lá, hãy chọn tiếng bẻ."], ["Từ nào có thanh hỏi?", "cỏ", ["có", "cò", "cỏ", "cọ"], "Hãy chọn từ cỏ."], ["Chọn tiếng có dấu hỏi.", "mở", ["mó", "mò", "mở", "mỡ"], "Hãy chọn tiếng mở."]]],
    ["TV-24", "Thanh ngã và thanh nặng", "tones-nga-nang", "⚫", [["Chọn tiếng có thanh ngã: ba / ?", "bã", ["ba", "bá", "bả", "bã"], "Hãy chọn tiếng bã, có thanh ngã."], ["Chọn tiếng có thanh nặng: ba / ?", "bạ", ["ba", "bá", "bã", "bạ"], "Hãy chọn tiếng bạ, có thanh nặng."], ["Tiếng nào có dấu ngã?", "mã", ["má", "mà", "mả", "mã"], "Hãy chọn tiếng mã, có thanh ngã."], ["Tiếng nào có dấu nặng?", "mạ", ["ma", "má", "mã", "mạ"], "Hãy chọn tiếng mạ, có thanh nặng."], ["Chọn tiếng có thanh nặng.", "cọ", ["có", "cò", "cõ", "cọ"], "Hãy chọn tiếng cọ, có thanh nặng."]]],
    ["TV-25", "Phân biệt các thanh", "tones-review", "🌈", [["Chọn tiếng không có thanh: ba / ?", "ba", ["ba", "bá", "bà", "bạ"], "Hãy chọn tiếng ba, không có thanh."], ["Chọn tiếng có thanh sắc.", "bá", ["ba", "bả", "bã", "bá"], "Hãy chọn tiếng bá."], ["Chọn tiếng có thanh huyền.", "bà", ["bá", "bả", "bạ", "bà"], "Hãy chọn tiếng bà."], ["Chọn tiếng có thanh hỏi.", "bả", ["bả", "ba", "bá", "bã"], "Hãy chọn tiếng bả."], ["Chọn tiếng có thanh ngã hoặc nặng.", "bạ", ["ba", "bá", "bả", "bạ"], "Hãy chọn tiếng bạ, có thanh nặng."]]],
    ["TV-26", "Chữ viết ph và th", "initial-ph-th", "🔤", [["Chọn từ đúng: ?ỏ", "thỏ", ["chỏ", "phỏ", "thỏ", "trỏ"], "Hãy chọn từ thỏ."], ["Chọn từ đúng: ?ở", "phở", ["phở", "thở", "chở", "trở"], "Hãy chọn từ phở."], ["Từ nào bắt đầu bằng ph?", "phố", ["thố", "chố", "trố", "phố"], "Hãy chọn từ phố."], ["Từ nào bắt đầu bằng th?", "thỏ", ["phỏ", "thỏ", "chỏ", "trỏ"], "Hãy chọn từ thỏ."], ["Chọn chữ viết đúng cho từ ?ở.", "phở", ["thở", "phở", "chở", "trở"], "Hãy chọn từ phở."]]],
    ["TV-27", "Chữ viết ch và tr", "initial-ch-tr", "🔤", [["Chọn từ đúng: ?ó", "chó", ["tró", "chó", "thó", "phó"], "Hãy chọn từ chó."], ["Chọn từ đúng: ?e", "tre", ["che", "tre", "the", "phe"], "Hãy chọn từ tre."], ["Từ nào bắt đầu bằng ch?", "chim", ["trim", "chim", "thim", "phim"], "Hãy chọn từ chim."], ["Từ nào bắt đầu bằng tr?", "trâu", ["châu", "trâu", "thâu", "phâu"], "Hãy chọn từ trâu."], ["Chọn từ đúng cho hình 🌳.", "tre", ["che", "tre", "the", "phe"], "Hình cây tre. Hãy chọn từ tre."]]],
    ["TV-28", "Chữ viết s và x", "initial-s-x", "🔤", [["Chọn từ đúng: ?ôi", "xôi", ["sôi", "xôi", "chôi", "trôi"], "Hãy chọn từ xôi."], ["Chọn từ đúng: ?ẻ", "sẻ", ["xẻ", "sẻ", "chẻ", "trẻ"], "Hãy chọn từ sẻ."], ["Từ nào bắt đầu bằng s?", "sáo", ["xáo", "sáo", "cháo", "tráo"], "Hãy chọn từ sáo."], ["Từ nào bắt đầu bằng x?", "xe", ["se", "xe", "che", "tre"], "Hãy chọn từ xe."], ["Chọn từ đúng cho hình 🚗.", "xe", ["se", "xe", "che", "tre"], "Hình chiếc xe. Hãy chọn từ xe."]]],
    ["TV-29", "Chữ viết r, d, gi", "initial-r-d-gi", "🔤", [["Chọn từ đúng: ?a", "ra", ["ra", "da", "gia", "xa"], "Hãy chọn từ ra."], ["Chọn từ đúng: ?a", "da", ["ra", "da", "gia", "xa"], "Hãy chọn từ da."], ["Chọn từ đúng: ?a đình", "gia đình", ["ra đình", "da đình", "gia đình", "xa đình"], "Hãy chọn từ gia đình."], ["Từ nào bắt đầu bằng r?", "rổ", ["dổ", "giổ", "rổ", "xổ"], "Hãy chọn từ rổ."], ["Chọn từ đúng cho hình 👨‍👩‍👧.", "gia đình", ["ra đình", "da đình", "gia đình", "xa đình"], "Hình gia đình. Hãy chọn từ gia đình."]]],
    ["TV-30", "Chữ viết c, k, q", "initial-c-k-q", "🔤", [["Chọn từ đúng: ?á", "cá", ["cá", "ká", "qá", "gá"], "Hãy chọn từ cá."], ["Chọn từ đúng: ?em", "kem", ["cem", "kem", "qem", "gem"], "Hãy chọn từ kem."], ["Chọn từ đúng: ?uả", "quả", ["cuả", "kuả", "quả", "guả"], "Hãy chọn từ quả."], ["Chọn từ đúng cho hình 🍦.", "kem", ["cem", "kem", "qem", "gem"], "Hình kem. Hãy chọn từ kem."], ["Chọn từ đúng cho hình 🍎.", "quả", ["cuả", "kuả", "quả", "guả"], "Hình quả. Hãy chọn từ quả."]]],
    ["TV-31", "Chữ ghép ng và ngh", "digraph-ng-ngh", "🧩", [["Chọn từ đúng: ?e", "nghe", ["nge", "nghe", "nghê", "nhe"], "Hãy chọn từ nghe."], ["Chọn từ đúng: ?ỉ", "nghỉ", ["ngỉ", "nghỉ", "nhỉ", "ghỉ"], "Hãy chọn từ nghỉ."], ["Chọn từ đúng: ?à", "ngà", ["ngà", "nghà", "nhà", "gà"], "Hãy chọn từ ngà."], ["Từ nào có chữ ghép ngh?", "nghé", ["ngé", "nghé", "nhé", "ghé"], "Hãy chọn từ nghé."], ["Chọn từ đúng: bé ?ỉ", "nghỉ", ["ngỉ", "nghỉ", "nhỉ", "ghỉ"], "Bé nghỉ. Hãy chọn từ nghỉ."]]],
    ["TV-32", "Chữ ghép g và gh", "digraph-g-gh", "🧩", [["Chọn từ đúng: ?ế", "ghế", ["kế", "ghế", "khế", "nghe"], "Hãy chọn từ ghế."], ["Chọn từ đúng: ?é", "ghé", ["bé", "ghé", "khé", "nghé"], "Hãy chọn từ ghé."], ["Chọn từ đúng: ?à", "gà", ["gà", "ngà", "khà", "già"], "Hãy chọn từ gà."], ["Từ nào có chữ gh?", "ghế", ["kế", "nghé", "ghế", "khế"], "Hãy tìm từ có chữ gh phù hợp."], ["Chọn từ đúng cho hình 🪑.", "ghế", ["kế", "ghế", "khế", "nghé"], "Hãy chọn từ phù hợp với hình."]]],
    ["TV-33", "Chọn c, k, q trong từ", "spelling-c-k-q", "✍️", [["Chọn từ đúng: ?á", "cá", ["cá", "ká", "qá", "gá"], "Hãy chọn từ cá."], ["Chọn từ đúng: ?e", "ke", ["ce", "ke", "qe", "ge"], "Hãy chọn từ ke."], ["Chọn từ đúng: ?uê", "quê", ["cuê", "kuê", "quê", "guê"], "Hãy chọn từ quê."], ["Chọn từ đúng: ?im", "kim", ["cim", "kim", "qim", "gim"], "Hãy chọn từ kim."], ["Chọn từ đúng: ?ua", "qua", ["cua", "kua", "qua", "gua"], "Hãy chọn từ qua."]]],
    ["TV-34", "Chữ ghép nh và kh", "digraph-nh-kh", "🧩", [["Chọn từ đúng: ?à", "nhà", ["nà", "nhà", "khà", "ngà"], "Hãy chọn từ nhà."], ["Chọn từ đúng: ?ỉ", "khỉ", ["kỉ", "khỉ", "nhỉ", "ngỉ"], "Hãy chọn từ khỉ."], ["Từ nào có chữ ghép nh?", "nhỏ", ["nỏ", "nhỏ", "khỏ", "ngỏ"], "Hãy chọn từ nhỏ."], ["Từ nào có chữ ghép kh?", "khăn", ["kăn", "khăn", "nhăn", "ngăn"], "Hãy chọn từ khăn."], ["Chọn từ đúng cho hình 🏠.", "nhà", ["nà", "nhà", "khà", "ngà"], "Hình ngôi nhà. Hãy chọn từ nhà."]]],
    ["TV-35", "Chữ ghép ph, th, ch", "digraph-ph-th-ch", "🧩", [["Chọn từ đúng: ?ở", "phở", ["phở", "thở", "chở", "trở"], "Hãy chọn từ phở."], ["Chọn từ đúng: ?ỏ", "thỏ", ["thỏ", "chỏ", "trỏ", "phỏ"], "Hãy chọn từ thỏ."], ["Chọn từ đúng: ?ó", "chó", ["phó", "thó", "chó", "tró"], "Hãy chọn từ chó."], ["Chọn từ đúng cho hình 🐰.", "thỏ", ["thỏ", "chỏ", "trỏ", "phỏ"], "Hình con thỏ. Hãy chọn từ thỏ."], ["Chọn từ đúng cho hình 🐶.", "chó", ["phó", "thó", "chó", "tró"], "Hình con chó. Hãy chọn từ chó."]]],
    ["TV-36", "Từ chỉ người và gia đình", "words-family", "👨‍👩‍👧", [["Chọn từ đúng cho hình 👨.", "ba", ["ba", "bà", "bé", "mẹ"], "Hình ba. Hãy chọn từ ba."], ["Chọn từ đúng cho hình 👩.", "mẹ", ["ba", "mẹ", "bé", "bà"], "Hình mẹ. Hãy chọn từ mẹ."], ["Chọn từ đúng cho hình 👶.", "bé", ["bà", "bé", "ba", "mẹ"], "Hình bé. Hãy chọn từ bé."], ["Chọn từ đúng cho hình 👵.", "bà", ["ba", "bà", "bé", "mẹ"], "Hình bà. Hãy chọn từ bà."], ["Ai trong gia đình là mẹ?", "mẹ", ["ba", "mẹ", "bé", "bà"], "Hãy chọn từ mẹ."]]],
    ["TV-37", "Từ chỉ con vật", "words-animals", "🐾", [["Chọn từ đúng cho hình 🐟.", "cá", ["cá", "gà", "mèo", "chó"], "Hình con cá. Hãy chọn từ cá."], ["Chọn từ đúng cho hình 🐔.", "gà", ["cá", "gà", "mèo", "chó"], "Hình con gà. Hãy chọn từ gà."], ["Chọn từ đúng cho hình 🐱.", "mèo", ["cá", "gà", "mèo", "chó"], "Hình con mèo. Hãy chọn từ mèo."], ["Chọn từ đúng cho hình 🐶.", "chó", ["cá", "gà", "mèo", "chó"], "Hình con chó. Hãy chọn từ chó."], ["Con vật nào kêu meo meo?", "mèo", ["cá", "gà", "mèo", "chó"], "Hãy chọn từ mèo."]]],
    ["TV-38", "Từ chỉ đồ vật", "words-objects", "🎒", [["Chọn từ đúng cho hình ✏️.", "bút", ["bút", "bàn", "ghế", "cặp"], "Hình cây bút. Hãy chọn từ bút."], ["Chọn từ đúng cho hình 🪑.", "ghế", ["bút", "bàn", "ghế", "cặp"], "Hình cái ghế. Hãy chọn từ ghế."], ["Chọn từ đúng cho hình 🎒.", "cặp", ["bút", "bàn", "ghế", "cặp"], "Hình cái cặp. Hãy chọn từ cặp."], ["Chọn đồ vật để ngồi học.", "ghế", ["bút", "bàn", "ghế", "cặp"], "Hãy chọn từ ghế."], ["Chọn đồ vật để viết.", "bút", ["bút", "bàn", "ghế", "cặp"], "Hãy chọn từ bút."]]],
    ["TV-39", "Từ chỉ hoạt động", "words-actions", "🏃", [["Chọn từ đúng cho hình 🚶.", "đi", ["đi", "ăn", "ngủ", "học"], "Hình bạn đang đi. Hãy chọn từ đi."], ["Chọn từ đúng cho hình 🍚.", "ăn", ["đi", "ăn", "ngủ", "học"], "Hình bạn đang ăn. Hãy chọn từ ăn."], ["Chọn từ đúng cho hình 😴.", "ngủ", ["đi", "ăn", "ngủ", "học"], "Hình bạn đang ngủ. Hãy chọn từ ngủ."], ["Chọn từ đúng cho hình 📚.", "học", ["đi", "ăn", "ngủ", "học"], "Hình bạn đang học. Hãy chọn từ học."], ["Buổi sáng bé đến trường để làm gì?", "học", ["đi", "ăn", "ngủ", "học"], "Bé đến trường để học. Hãy chọn từ học."]]],
    ["TV-40", "Ôn chữ, âm, thanh và từ", "review-words", "🌟", [["Chọn tiếng đúng cho hình 🐟.", "cá", ["ca", "cá", "cà", "cạ"], "Hình con cá. Hãy chọn từ cá."], ["Chọn từ đúng cho hình 🐶.", "chó", ["tró", "chó", "thó", "phó"], "Hình con chó. Hãy chọn từ chó."], ["Chọn tiếng có thanh huyền.", "bà", ["ba", "bá", "bà", "bả"], "Hãy chọn tiếng bà, có thanh huyền."], ["Chọn từ đúng cho hình 🪑.", "ghế", ["gế", "ghế", "khế", "ngế"], "Hình cái ghế. Hãy chọn từ ghế."], ["Chọn từ đúng cho hình 👨‍👩‍👧.", "gia đình", ["ra đình", "da đình", "gia đình", "xa đình"], "Hình gia đình. Hãy chọn từ gia đình."]]],
  ];
  const fromChoose = ([displayText, answer, options, speechText]) => choice(displayText, answer, options, speechText);
  const fromBlend = ([left, right, answer, options, speechText]) => blend(left, right, answer, options, speechText);
  const levelData = (id, title, topic, icon, questions, mapQuestion) => ({ id, title, topic, icon, type: "vietnamese", questionCount: 5, unlockScore: 80, rewardStars: [60, 80, 100], questions: questions.map(mapQuestion) });
  const levels = [...alphabet.map(([id, title, topic, icon, questions]) => levelData(id, title, topic, icon, questions, fromChoose)), ...blends.map(([id, title, topic, icon, questions]) => levelData(id, title, topic, icon, questions, fromBlend)), ...readings.map(([id, title, topic, icon, questions]) => levelData(id, title, topic, icon, questions, fromChoose)), ...extensions.map(([id, title, topic, icon, questions]) => levelData(id, title, topic, icon, questions, fromChoose))];
  const pilotQuestions = {
    "TV-01": [
      choice("Chọn chữ a có dấu râu.", "ă", ["a", "ă", "â", "o"], "Hãy chọn chữ a có dấu râu.", "🌿"),
      choice("Chọn chữ a có mũ.", "â", ["ă", "a", "â", "e"], "Hãy chọn chữ a có mũ.", "🎩"),
      choice("Chữ nào là chữ a thường?", "a", ["ă", "â", "a", "o"], "Hãy quan sát kỹ các chữ rồi chọn.", "🔤"),
      choice("Tìm chữ khác với a và â.", "ă", ["a", "â", "ă", "e"], "Hãy quan sát dấu trên mỗi chữ.", "🔎"),
      choice("Chọn chữ có chiếc mũ nhỏ.", "â", ["a", "ă", "â", "o"], "Hãy chọn chữ có chiếc mũ nhỏ.", "🎓"),
    ],
    "TV-09": [
      choice("Chữ nào có nét ngang ở giữa?", "đ", ["d", "đ", "b", "p"], "Hãy quan sát chữ có nét ngang.", "➖"),
      choice("Tìm chữ có bụng ở bên phải và nét đi xuống.", "p", ["b", "d", "p", "q"], "Hãy nhìn vị trí của nét kéo xuống.", "🔎"),
      choice("Tìm chữ có bụng ở bên trái và nét kéo xuống.", "q", ["p", "b", "q", "d"], "Hãy nhìn vị trí của nét kéo xuống.", "🔎"),
      choice("Chọn chữ o có mũ.", "ô", ["o", "ô", "ơ", "a"], "Hãy chọn chữ o có mũ.", "🎩"),
      choice("Chọn chữ a có dấu râu.", "ă", ["a", "â", "ă", "e"], "Hãy chọn chữ a có dấu râu.", "🌿"),
    ],
    "TV-11": [
      blend("b", "a", "ba", ["ba", "ca", "ma", "na"], "Ghép âm bờ với a. Hãy chọn tiếng đúng."),
      blend("b", "á", "bá", ["bá", "bà", "ba", "bạ"], "Ghép âm bờ với a sắc. Hãy chọn tiếng đúng."),
      blend("b", "à", "bà", ["ba", "bà", "bá", "bạ"], "Ghép âm bờ với a huyền. Hãy chọn tiếng đúng."),
      blend("b", "ạ", "bạ", ["bả", "bã", "bạ", "bà"], "Ghép âm bờ với a nặng. Hãy chọn tiếng đúng."),
      blend("b", "ả", "bả", ["bá", "bà", "bả", "bạ"], "Ghép âm bờ với a hỏi. Hãy chọn tiếng đúng."),
    ],
    "TV-18": [
      choice("Chọn tiếng đúng cho hình.", "cá", ["ca", "cá", "cà", "cạ"], "Nhìn hình rồi chọn tiếng đúng.", "🐟"),
      choice("Chọn tiếng không có dấu thanh.", "ca", ["ca", "cá", "cà", "cạ"], "Hãy chọn tiếng không có dấu thanh.", "🎵"),
      choice("Chọn tiếng có thanh huyền.", "cà", ["ca", "cá", "cà", "cạ"], "Hãy chọn tiếng có thanh huyền.", "〰️"),
      choice("Chọn tiếng có thanh sắc.", "cá", ["cạ", "cà", "cá", "ca"], "Hãy chọn tiếng có thanh sắc.", "✨"),
      choice("Chọn tiếng có thanh nặng.", "cạ", ["ca", "cá", "cà", "cạ"], "Hãy chọn tiếng có thanh nặng.", "⚫"),
    ],
    "TV-21": [
      choice("Tiếng nào có thanh sắc?", "lá", ["la", "là", "lạ", "lá"], "Hãy chọn tiếng có thanh sắc.", "🍃"),
      choice("Chọn tiếng có thanh sắc.", "bé", ["bé", "be", "bè", "bẹ"], "Hãy chọn tiếng có thanh sắc.", "🧒"),
      choice("Chọn tiếng có thanh sắc.", "má", ["ma", "mà", "má", "mạ"], "Hãy chọn tiếng có thanh sắc.", "👩"),
      choice("Chọn tiếng đúng cho hình.", "cá", ["ca", "cá", "cà", "cạ"], "Nhìn hình rồi chọn tiếng đúng.", "🐟"),
      choice("Tìm tiếng có thanh sắc.", "bá", ["ba", "bà", "bạ", "bá"], "Hãy chọn tiếng có thanh sắc.", "🔍"),
    ],
    "TV-26": [
      choice("Điền âm đầu còn thiếu: ?ỏ", "th", ["ph", "ch", "th", "tr"], "Chọn âm đầu để tạo từ đúng.", "🐰"),
      choice("Điền âm đầu còn thiếu: ?ở", "ph", ["ph", "th", "ch", "tr"], "Chọn âm đầu để tạo từ đúng.", "🍜"),
      choice("Từ nào bắt đầu bằng ph?", "phố", ["thố", "chố", "trố", "phố"], "Hãy chọn từ bắt đầu bằng ph.", "🏙️"),
      choice("Từ nào bắt đầu bằng th?", "thỏ", ["phỏ", "thỏ", "chỏ", "trỏ"], "Hãy chọn từ bắt đầu bằng th.", "🐰"),
      choice("Chọn từ đúng cho hình.", "thỏ", ["phỏ", "thỏ", "chỏ", "trỏ"], "Nhìn hình rồi chọn từ đúng.", "🐰"),
    ],
    "TV-27": [
      choice("Điền âm đầu còn thiếu: ?ó", "ch", ["ch", "tr", "th", "ph"], "Chọn âm đầu để tạo từ đúng.", "🐶"),
      choice("Điền âm đầu còn thiếu: ?e", "tr", ["ch", "tr", "th", "ph"], "Chọn âm đầu để tạo từ đúng.", "🌳"),
      choice("Từ nào bắt đầu bằng ch?", "chim", ["trim", "chim", "thim", "phim"], "Hãy chọn từ bắt đầu bằng ch.", "🐦"),
      choice("Từ nào bắt đầu bằng tr?", "trâu", ["châu", "trâu", "thâu", "phâu"], "Hãy chọn từ bắt đầu bằng tr.", "🐃"),
      choice("Chọn từ đúng cho hình.", "tre", ["che", "tre", "the", "phe"], "Nhìn hình rồi chọn từ đúng.", "🎋"),
    ],
    "TV-31": [
      choice("Điền âm đầu còn thiếu: ?à", "ng", ["ng", "ngh", "nh", "kh"], "Chọn âm đầu để tạo từ đúng.", "🦢"),
      choice("Điền âm đầu còn thiếu: ?ỉ", "ngh", ["ng", "ngh", "nh", "kh"], "Chọn âm đầu để tạo từ đúng.", "🛌"),
      choice("Từ nào có chữ ghép ng?", "ngô", ["nhô", "ngô", "khô", "ghô"], "Hãy chọn từ có chữ ghép ng.", "🌽"),
      choice("Từ nào có chữ ghép ngh?", "nghỉ", ["ngỉ", "nghỉ", "nhỉ", "khỉ"], "Hãy chọn từ có chữ ghép ngh.", "😴"),
      choice("Chọn từ đúng cho hình.", "ngựa", ["nhựa", "ngựa", "khựa", "ghựa"], "Nhìn hình rồi chọn từ đúng.", "🐴"),
    ],
    "TV-34": [
      choice("Điền âm đầu còn thiếu: ?à", "nh", ["ng", "nh", "kh", "gh"], "Chọn âm đầu để tạo từ đúng.", "🏠"),
      choice("Điền âm đầu còn thiếu: ?ỉ", "kh", ["ng", "nh", "kh", "gh"], "Chọn âm đầu để tạo từ đúng.", "🐒"),
      choice("Từ nào có chữ ghép nh?", "nhỏ", ["nỏ", "nhỏ", "khỏ", "ngỏ"], "Hãy chọn từ có chữ ghép nh.", "🐤"),
      choice("Từ nào có chữ ghép kh?", "khăn", ["kăn", "khăn", "nhăn", "ngăn"], "Hãy chọn từ có chữ ghép kh.", "🧣"),
      choice("Chọn từ đúng cho hình.", "nhà", ["nà", "nhà", "khà", "ngà"], "Nhìn hình rồi chọn từ đúng.", "🏠"),
    ],
    "TV-37": [
      choice("Chọn từ đúng cho hình.", "cá", ["cá", "gà", "mèo", "chó"], "Nhìn hình rồi chọn từ đúng.", "🐟"),
      choice("Chọn từ đúng cho hình.", "gà", ["cá", "gà", "mèo", "chó"], "Nhìn hình rồi chọn từ đúng.", "🐔"),
      choice("Chọn từ đúng cho hình.", "mèo", ["cá", "gà", "mèo", "chó"], "Nhìn hình rồi chọn từ đúng.", "🐱"),
      choice("Chọn từ đúng cho hình.", "chó", ["cá", "gà", "mèo", "chó"], "Nhìn hình rồi chọn từ đúng.", "🐶"),
      choice("Con vật nào kêu meo meo?", "mèo", ["cá", "gà", "mèo", "chó"], "Hãy chọn từ chỉ con vật kêu meo meo.", "🐾"),
    ],
    "TV-03": [
      originalChoice("Chọn chữ e có mũ.", "ê", ["e", "ê", "g", "h"], "Hãy tìm chữ e có mũ.", "🎩"),
      originalChoice("Chữ nào có nét thẳng đứng cao?", "h", ["e", "g", "h", "ê"], "Quan sát nét cao của các chữ.", "📏"),
      originalChoice("Tìm chữ có nét cong đi xuống dưới dòng.", "g", ["h", "ê", "e", "g"], "Hãy nhìn chữ có nét kéo xuống.", "🔎"),
      originalChoice("Chọn chữ e thường.", "e", ["ê", "g", "e", "h"], "Hãy quan sát kỹ các chữ rồi chọn.", "🔤"),
      originalChoice("Chữ nào khác với e, ê và g?", "h", ["e", "ê", "g", "h"], "Quan sát từng nét chữ.", "🧩"),
    ],
    "TV-06": [
      originalChoice("Chọn chữ có nét kéo xuống dưới dòng ở bên trái.", "p", ["q", "p", "r", "s"], "Hãy tìm chữ có nét dài ở bên trái.", "⬇️"),
      originalChoice("Chọn chữ có nét kéo xuống dưới dòng ở bên phải.", "q", ["p", "r", "q", "s"], "Hãy quan sát vị trí nét dài.", "🔎"),
      originalChoice("Chữ nào giống một vòng tròn có nét đi xuống?", "q", ["p", "q", "r", "s"], "Nhìn kỹ nét kéo xuống của chữ.", "⭕"),
      originalChoice("Chọn chữ có nét cong nhỏ ở trên.", "r", ["s", "p", "q", "r"], "Hãy tìm chữ r.", "🌈"),
      originalChoice("Chữ nào uốn cong như con rắn?", "s", ["p", "r", "s", "q"], "Hãy chọn chữ có nét uốn cong.", "🐍"),
    ],
    "TV-10": [
      originalChoice("Chọn chữ a có dấu râu.", "ă", ["ă", "a", "â", "e"], "Hãy tìm chữ a có dấu râu.", "🌿"),
      originalChoice("Chọn chữ o có mũ.", "ô", ["o", "ơ", "u", "ô"], "Hãy tìm chữ o có mũ.", "🎩"),
      originalChoice("Chọn chữ có nét ngang ở giữa.", "đ", ["d", "b", "p", "đ"], "Quan sát chữ có một nét ngang.", "➖"),
      originalChoice("Chọn chữ u có dấu râu.", "ư", ["ư", "u", "v", "y"], "Hãy tìm chữ u có dấu râu.", "🌿"),
      originalChoice("Chọn chữ e có mũ.", "ê", ["e", "ê", "i", "y"], "Hãy quan sát chiếc mũ nhỏ.", "🎓"),
    ],
    "TV-12": [
      originalBlend("c", "a", "ca", ["ca", "ba", "ma", "na"], "Ghép âm cờ với a."),
      originalBlend("c", "á", "cá", ["cà", "cá", "ca", "cả"], "Ghép âm cờ với a sắc."),
      originalBlend("c", "à", "cà", ["ca", "cà", "cá", "cạ"], "Ghép âm cờ với a huyền."),
      originalBlend("c", "ả", "cả", ["cạ", "cả", "cá", "cà"], "Ghép âm cờ với a hỏi."),
      originalBlend("c", "ạ", "cạ", ["cả", "cạ", "cã", "cà"], "Ghép âm cờ với a nặng."),
    ],
    "TV-14": [
      originalBlend("n", "o", "no", ["no", "bo", "mo", "co"], "Ghép âm nờ với o."),
      originalBlend("n", "ó", "nó", ["nò", "nó", "no", "nỏ"], "Ghép âm nờ với o sắc."),
      originalBlend("n", "ò", "nò", ["no", "nò", "nó", "nọ"], "Ghép âm nờ với o huyền."),
      originalBlend("n", "ỏ", "nỏ", ["nỏ", "nọ", "nò", "nó"], "Ghép âm nờ với o hỏi."),
      originalBlend("n", "ọ", "nọ", ["nò", "nọ", "nỏ", "nó"], "Ghép âm nờ với o nặng."),
    ],
    "TV-16": [
      originalChoice("Chọn tiếng có thanh ngang.", "ba", ["bà", "bá", "ba", "bạ"], "Hãy chọn tiếng không có dấu thanh.", "🎵"),
      originalChoice("Chọn tiếng có thanh huyền.", "mà", ["ma", "má", "mà", "mạ"], "Hãy chọn tiếng có dấu huyền.", "〰️"),
      originalChoice("Tìm tiếng mang dấu sắc.", "bé", ["be", "bé", "bè", "bẹ"], "Hãy chọn tiếng có dấu sắc.", "✨"),
      originalChoice("Chọn tiếng có thanh hỏi.", "cỏ", ["co", "có", "cỏ", "cọ"], "Hãy chọn tiếng có dấu hỏi.", "❔"),
      originalChoice("Chọn tiếng có thanh nặng.", "mẹ", ["me", "mé", "mè", "mẹ"], "Hãy chọn tiếng có dấu nặng.", "⚫"),
    ],
    "TV-20": [
      originalChoice("Chọn tiếng có thanh sắc.", "lá", ["la", "lá", "là", "lạ"], "Hãy tìm tiếng có dấu sắc.", "🍃"),
      originalChoice("Chọn tiếng có thanh huyền.", "cò", ["co", "có", "cò", "cọ"], "Hãy tìm tiếng có dấu huyền.", "🕊️"),
      originalChoice("Chọn tiếng có thanh hỏi.", "bẻ", ["be", "bé", "bẻ", "bẹ"], "Hãy tìm tiếng có dấu hỏi.", "🌿"),
      originalChoice("Chọn tiếng có thanh nặng.", "ngựa", ["ngưa", "ngứa", "ngựa", "ngừa"], "Hãy tìm tiếng có dấu nặng.", "🐴"),
      originalChoice("Chọn tiếng không có dấu thanh.", "ca", ["cá", "cà", "ca", "cạ"], "Hãy chọn tiếng thanh ngang.", "🎶"),
    ],
    "TV-23": [
      originalChoice("Tìm tiếng có dấu hỏi.", "kẻ", ["kẻ", "ke", "ké", "kẹ"], "Hãy chọn tiếng có dấu hỏi.", "🧍"),
      originalChoice("Chọn tiếng có thanh hỏi.", "nghỉ", ["nghí", "nghì", "nghị", "nghỉ"], "Hãy tìm dấu hỏi trên tiếng.", "🛌"),
      originalChoice("Chọn tiếng có thanh hỏi.", "mở", ["mơ", "mở", "mớ", "mợ"], "Hãy tìm tiếng có dấu hỏi.", "🚪"),
      originalChoice("Tìm tiếng có dấu hỏi.", "sẻ", ["se", "sé", "sẻ", "sẹ"], "Hãy chọn tiếng có dấu hỏi.", "🐦"),
      originalChoice("Chọn tiếng có thanh hỏi.", "vở", ["vơ", "vớ", "vợ", "vở"], "Hãy quan sát dấu hỏi.", "📒"),
    ],
    "TV-28": [
      originalChoice("Điền âm đầu còn thiếu: ?ẻ", "s", ["s", "x", "ch", "tr"], "Chọn âm đầu để tạo từ chỉ đồ vật.", "📖"),
      originalChoice("Điền âm đầu còn thiếu: ?e", "x", ["s", "x", "ch", "tr"], "Chọn âm đầu để tạo tên một phương tiện.", "🚗"),
      originalChoice("Từ nào bắt đầu bằng s?", "sáo", ["xáo", "sáo", "cháo", "tráo"], "Hãy chọn từ bắt đầu bằng s.", "🐦"),
      originalChoice("Từ nào bắt đầu bằng x?", "xe", ["se", "xe", "che", "tre"], "Hãy chọn từ bắt đầu bằng x.", "🚙"),
      originalChoice("Chọn từ đúng cho hình.", "sư tử", ["xư tử", "sư tử", "chư tử", "trư tử"], "Nhìn hình con vật rồi chọn từ đúng.", "🦁"),
    ],
    "TV-30": [
      originalChoice("Điền chữ còn thiếu: ?à", "g", ["g", "gh", "ng", "ngh"], "Chọn chữ đầu để tạo tên con vật.", "🐔"),
      originalChoice("Điền chữ còn thiếu: ?ế", "gh", ["g", "gh", "ng", "ngh"], "Chọn chữ đầu để tạo tên đồ vật.", "🪑"),
      originalChoice("Từ nào bắt đầu bằng g?", "gà", ["ghà", "gà", "ngà", "nghà"], "Hãy chọn từ bắt đầu bằng g.", "🐔"),
      originalChoice("Từ nào bắt đầu bằng gh?", "ghế", ["gế", "ghế", "ngế", "nghế"], "Hãy chọn từ bắt đầu bằng gh.", "🪑"),
      originalChoice("Chọn từ đúng cho hình.", "gấu", ["ghấu", "gấu", "ngấu", "nghấu"], "Nhìn hình con vật rồi chọn từ đúng.", "🐻"),
    ],
    "TV-32": [
      originalChoice("Chọn từ đúng: ?ế", "ghế", ["kế", "khế", "nghe", "ghế"], "Hãy quan sát chữ đầu của từng từ.", "🪑"),
      originalChoice("Chọn từ đúng: ?é", "ghé", ["bé", "khé", "nghé", "ghé"], "Hãy quan sát chữ đầu của từng từ.", "🚶"),
      originalChoice("Chọn từ đúng: ?à", "gà", ["gà", "ngà", "khà", "già"], "Hãy quan sát chữ đầu của từng từ.", "🐔"),
      originalChoice("Từ nào bắt đầu bằng g?", "gà", ["ngà", "gà", "già", "khà"], "Hãy quan sát chữ đầu của từng từ.", "🐔"),
      originalChoice("Từ nào có chữ gh?", "ghế", ["kế", "nghé", "ghế", "khế"], "Hãy quan sát các chữ đầu rồi chọn.", "🪑"),
    ],
    "TV-35": [
      originalChoice("Điền âm đầu còn thiếu: ?ó", "ch", ["ph", "th", "ch", "tr"], "Chọn âm đầu để tạo tên con vật.", "🐶"),
      originalChoice("Điền âm đầu còn thiếu: ?e", "tr", ["ph", "th", "ch", "tr"], "Chọn âm đầu để tạo tên một loại cây.", "🌳"),
      originalChoice("Từ nào bắt đầu bằng ph?", "phở", ["thở", "phở", "chở", "trở"], "Hãy chọn từ bắt đầu bằng ph.", "🍜"),
      originalChoice("Chọn từ bắt đầu bằng th.", "thuyền", ["chuyền", "truyền", "phuyền", "thuyền"], "Hãy chọn từ bắt đầu bằng th.", "⛵"),
      originalChoice("Chọn từ bắt đầu bằng tr.", "trống", ["chống", "thống", "phống", "trống"], "Hãy chọn từ bắt đầu bằng tr.", "🥁"),
    ],
    "TV-38": [
      originalChoice("Chọn từ đúng cho hình.", "bút", ["bàn", "bút", "cặp", "ghế"], "Nhìn hình đồ dùng học tập rồi chọn từ đúng.", "✏️"),
      originalChoice("Chọn từ đúng cho hình.", "bàn", ["ghế", "cặp", "bàn", "bút"], "Nhìn hình đồ vật rồi chọn từ đúng.", "🪑"),
      originalChoice("Đồ vật nào dùng để đựng sách?", "cặp", ["bút", "ghế", "cặp", "bàn"], "Hãy chọn đồ vật đựng sách vở.", "🎒"),
      originalChoice("Đồ vật nào dùng để ngồi?", "ghế", ["ghế", "bàn", "bút", "cặp"], "Hãy chọn đồ vật dùng để ngồi.", "🪑"),
      originalChoice("Đồ vật nào dùng để viết?", "bút", ["cặp", "bàn", "bút", "ghế"], "Hãy chọn đồ vật dùng để viết.", "✏️"),
    ],
    "TV-39": [
      originalChoice("Bạn nhỏ đang làm gì?", "đọc", ["ăn", "ngủ", "đọc", "đi"], "Nhìn hình và chọn hoạt động phù hợp.", "📖"),
      originalChoice("Bạn nhỏ đang làm gì?", "chạy", ["ngủ", "chạy", "ăn", "học"], "Nhìn hình và chọn hoạt động phù hợp.", "🏃"),
      originalChoice("Buổi tối bé thường làm gì để nghỉ ngơi?", "ngủ", ["đi", "ăn", "học", "ngủ"], "Hãy chọn hoạt động phù hợp vào buổi tối.", "🌙"),
      originalChoice("Đến trường, bé làm gì?", "học", ["học", "ngủ", "ăn", "chạy"], "Hãy chọn hoạt động phù hợp ở trường.", "🏫"),
      originalChoice("Khi đói, bé làm gì?", "ăn", ["ngủ", "đọc", "ăn", "đi"], "Hãy chọn hoạt động phù hợp khi đói.", "🍚"),
    ],
    "TV-40": [
      originalChoice("Tiếng nào gọi đúng con vật trong hình?", "cá", ["ca", "cà", "cạ", "cá"], "Nhìn hình rồi chọn tiếng đúng.", "🐟"),
      originalChoice("Chọn chữ có mũ.", "ê", ["e", "ê", "ă", "ơ"], "Hãy chọn chữ có chiếc mũ nhỏ.", "🎓"),
      originalChoice("Chọn tiếng có thanh huyền.", "bà", ["ba", "bá", "bà", "bạ"], "Hãy tìm tiếng có dấu huyền.", "👵"),
      originalChoice("Chọn từ đúng cho hình.", "ghế", ["gế", "ghế", "khế", "ngế"], "Nhìn hình đồ vật rồi chọn từ đúng.", "🪑"),
      originalChoice("Chọn từ chỉ một người trong gia đình.", "mẹ", ["mẹ", "mèo", "mé", "mẻ"], "Hãy chọn từ chỉ người thân trong gia đình.", "👩"),
    ],
  };
  Object.entries(pilotQuestions).forEach(([id, questions]) => { questions.forEach((question) => { question.contentPilot = true; question.contentRelease ||= "v33"; }); const item = levels.find((level) => level.id === id); if (item) item.questions = questions; });
  const topicTitles = [
    ["letters-a", "Làm quen chữ cái", "🔤", "Nhận biết chữ cái, mũ và dấu râu."], ["letters-bcd", "Làm quen chữ cái", "🔤", "Nhận biết các chữ cái cơ bản."], ["letters-egh", "Làm quen chữ cái", "🔤", "Quan sát nét chữ và dấu mũ."], ["letters-iklmn", "Làm quen chữ cái", "🔤", "Làm quen thêm các chữ cái."], ["letters-ooo", "Làm quen chữ cái", "🔤", "Phân biệt o, ô và ơ."],
    ["letters-pqrs", "Âm và chữ", "🔊", "Nhận biết chữ và âm đọc."], ["letters-tuuv", "Âm và chữ", "🔊", "Phân biệt u và ư."], ["letters-xy", "Âm và chữ", "🔊", "Nhận biết x và y."], ["confusing", "Âm và chữ", "🔎", "Phân biệt các chữ dễ nhầm."], ["review", "Âm và chữ", "🌟", "Ôn bảng chữ cái cơ bản."],
    ["blend-ba", "Ghép âm", "🧩", "Ghép phụ âm với nguyên âm."], ["blend-ca", "Ghép âm", "🧩", "Ghép phụ âm với nguyên âm."], ["blend-me", "Ghép âm", "🧩", "Ghép phụ âm với nguyên âm."], ["blend-no", "Ghép âm", "🧩", "Ghép phụ âm với nguyên âm."], ["blend-review", "Ghép âm", "🧩", "Ghép tiếng đơn giản."],
    ["reading-ba", "Đọc tiếng đơn giản", "📖", "Đọc tiếng có thanh."], ["reading-ma", "Đọc tiếng đơn giản", "📖", "Đọc tiếng có thanh."], ["reading-ca", "Đọc tiếng đơn giản", "🐟", "Đọc tiếng gắn với hình minh họa."], ["reading-be", "Đọc tiếng đơn giản", "📖", "Đọc tiếng có thanh."], ["reading-tones", "Đọc tiếng đơn giản", "🌟", "Ôn sắc, huyền, hỏi, ngã, nặng."],
    ["tones-sac", "Thanh điệu", "✦", "Nhận biết thanh sắc trong tiếng đơn giản."], ["tones-huyen", "Thanh điệu", "〰", "Nhận biết thanh huyền trong tiếng đơn giản."], ["tones-hoi", "Thanh điệu", "❔", "Nhận biết thanh hỏi trong tiếng đơn giản."], ["tones-nga-nang", "Thanh điệu", "⚫", "Phân biệt thanh ngã và thanh nặng."], ["tones-review", "Thanh điệu", "🌈", "Ôn các thanh trong tiếng đơn giản."],
    ["initial-ph-th", "Âm đầu", "🔤", "Nhận diện chữ viết ph và th."], ["initial-ch-tr", "Âm đầu", "🔤", "Nhận diện chữ viết ch và tr."], ["initial-s-x", "Âm đầu", "🔤", "Nhận diện chữ viết s và x."], ["initial-r-d-gi", "Âm đầu", "🔤", "Nhận diện chữ viết r, d và gi."], ["initial-c-k-q", "Âm đầu", "🔤", "Nhận diện chữ viết c, k và q."],
    ["digraph-ng-ngh", "Chữ ghép", "🧩", "Nhận biết ng và ngh trong từ đơn giản."], ["digraph-g-gh", "Chữ ghép", "🧩", "Nhận biết g và gh trong từ đơn giản."], ["spelling-c-k-q", "Chữ ghép", "✍️", "Chọn c, k, q trong từ đơn giản."], ["digraph-nh-kh", "Chữ ghép", "🧩", "Nhận biết nh và kh trong từ đơn giản."], ["digraph-ph-th-ch", "Chữ ghép", "🧩", "Nhận biết ph, th và ch trong từ đơn giản."],
    ["words-family", "Đọc từ đơn giản", "👨‍👩‍👧", "Đọc từ chỉ người và gia đình."], ["words-animals", "Đọc từ đơn giản", "🐾", "Đọc từ chỉ con vật."], ["words-objects", "Đọc từ đơn giản", "🎒", "Đọc từ chỉ đồ vật."], ["words-actions", "Đọc từ đơn giản", "🏃", "Đọc từ chỉ hoạt động."], ["review-words", "Đọc từ đơn giản", "🌟", "Ôn chữ, âm, thanh và từ."],
  ];
  const topics = Object.fromEntries(topicTitles.map(([id, title, icon, description], index) => [id, { id, title, shortTitle: title, icon, colorTheme: ["blue", "orange", "purple", "pink", "green"][index % 5], description, sortOrder: index + 1 }]));
  window.HOC_CUNG_BE_VIETNAMESE_GRADE_1 = { id: "vietnamese-grade-1", name: "Tiếng Việt lớp 1", grade: "grade-1", icon: "🔤", description: "Đọc hay • Viết đúng • Nói tự tin", topics, levels };
})();