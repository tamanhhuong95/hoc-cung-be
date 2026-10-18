"use strict";
(() => {
  const ITERATIONS = 250000;
  const DAY_MS = 86400000;
  const integer = (value, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= 0 && value <= max;
  const hex = bytes => [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
  const dayKey = (now = new Date()) => new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const identityKey = identity => identity?.uid && identity?.childId ? `${encodeURIComponent(identity.uid)}:${encodeURIComponent(identity.childId)}` : null;
  const defaults = () => ({ version: 1, revision: 0, enabled: true, dailyMinutes: 15, password: null });
  const validPassword = value => typeof value === "string" && value.length >= 4 && value.length <= 64 && value.trim().length >= 4;
  const validHash = value => !!value && value.algorithm === "PBKDF2-SHA256" && value.iterations === ITERATIONS && typeof value.salt === 'string' && typeof value.hash === 'string' && /^[0-9a-f]{32}$/.test(value.salt) && /^[0-9a-f]{64}$/.test(value.hash);
  const validPolicy = value => !!value && value.version === 1 && integer(value.revision) && typeof value.enabled === "boolean" && integer(value.dailyMinutes, 120) && value.dailyMinutes >= 1 && (value.password === null || validHash(value.password));
  function policy(raw) {
    if (raw === null) return defaults();
    let value; try { value = JSON.parse(raw); } catch { throw Error("Chưa đọc được cài đặt nông trại. Dữ liệu vẫn được giữ nguyên."); }
    if (!validPolicy(value)) throw Error("Cài đặt nông trại chưa hợp lệ. Nhờ phụ huynh kiểm tra giúp nhé.");
    return value;
  }
  function ledger(raw, now = new Date()) {
    const today = dayKey(now);
    if (raw === null) return { version: 1, day: today, usedMs: 0 };
    let value; try { value = JSON.parse(raw); } catch { throw Error("Chưa đọc được thời gian chơi. Nhờ phụ huynh kiểm tra giúp nhé."); }
    if (!value || value.version !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(value.day) || !integer(value.usedMs, DAY_MS)) throw Error("Chưa đọc được thời gian chơi. Dữ liệu vẫn được giữ nguyên.");
    if (value.day > today) throw Error("Ngày giờ thiết bị đã thay đổi. Nhờ phụ huynh kiểm tra để mở nông trại.");
    return value.day < today ? { version: 1, day: today, usedMs: 0 } : value;
  }
  const remaining = (settings, usage) => Math.max(0, settings.dailyMinutes * 60000 - usage.usedMs);
  function reserve(usage, milliseconds) {
    if (!integer(milliseconds, DAY_MS)) throw Error("Không tính được thời gian chơi.");
    return { ...usage, usedMs: Math.min(DAY_MS, usage.usedMs + milliseconds) };
  }
  async function derive(password, salt, cryptoApi = globalThis.crypto) {
    if (!cryptoApi?.subtle || !cryptoApi?.getRandomValues) throw Error("Trình duyệt cần hỗ trợ bảo mật để mở nông trại. Hãy dùng Chrome hoặc Edge mới.");
    const bytes = Uint8Array.from(salt.match(/../g), byte => parseInt(byte, 16));
    const key = await cryptoApi.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await cryptoApi.subtle.deriveBits({ name: "PBKDF2", salt: bytes, iterations: ITERATIONS, hash: "SHA-256" }, key, 256);
    return hex(new Uint8Array(bits));
  }
  async function passwordRecord(password, cryptoApi = globalThis.crypto) {
    if (!validPassword(password)) throw Error("Mật khẩu cần từ 4 đến 64 ký tự, không chỉ có khoảng trắng.");
    if (!cryptoApi?.getRandomValues) throw Error("Trình duyệt chưa hỗ trợ bảo mật mật khẩu.");
    const salt = hex(cryptoApi.getRandomValues(new Uint8Array(16)));
    return { algorithm: "PBKDF2-SHA256", iterations: ITERATIONS, salt, hash: await derive(password, salt, cryptoApi) };
  }
  async function verify(password, record, cryptoApi = globalThis.crypto) {
    if (!validPassword(password) || !validHash(record)) return false;
    const hash = await derive(password, record.salt, cryptoApi);
    let difference = 0; for (let i = 0; i < hash.length; i++) difference |= hash.charCodeAt(i) ^ record.hash.charCodeAt(i);
    return difference === 0;
  }
  globalThis.HocCungBeFarmAccessCore = Object.freeze({ defaults, dayKey, identityKey, validPassword, validHash, validPolicy, policy, ledger, remaining, reserve, passwordRecord, verify });
})();
