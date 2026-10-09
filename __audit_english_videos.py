import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
manifest = json.loads((ROOT / "assets/english-grade-1/media-manifest.json").read_text(encoding="utf-8"))
results = []

def check(name, condition, detail=""):
    results.append({"name": name, "passed": bool(condition), "detail": "" if condition else detail})

total = 0
for clip in manifest["clips"]:
    path = ROOT / clip["webm"]
    exists = path.is_file()
    size = path.stat().st_size if exists else 0
    total += size
    signature = path.read_bytes()[:4].hex() if exists else ""
    check(f"{clip['levelId']} file exists", exists, str(path))
    check(f"{clip['levelId']} EBML signature", signature == "1a45dfa3", signature)
    check(f"{clip['levelId']} size budget", 0 < size < 2 * 1024 * 1024, str(size))
    check(f"{clip['levelId']} manifest available", clip["available"] is exists, f"available={clip['available']} exists={exists}")
    check(f"{clip['levelId']} MIME", clip.get("mimeType") == "video/webm", str(clip.get("mimeType")))
    check(f"{clip['levelId']} poster", (ROOT / clip["poster"]).is_file(), clip["poster"])
    check(f"{clip['levelId']} fallback image", (ROOT / clip["fallbackImage"]).is_file(), clip["fallbackImage"])
    check(f"{clip['levelId']} animation fallback", bool(clip.get("animationFallback")), str(clip.get("animationFallback")))

check("Combined video budget", total < 4 * 1024 * 1024, str(total))
source = (ROOT / "data/english-grade-1.js").read_text(encoding="utf-8")
check("Exactly 20 English levels", len(re.findall(r'(?:level|wordLevel|letterLevel)\("EN-\d\d"', source)) == 20)
check("EN-19 video quiz", 'id === "EN-19" ? "video-choice"' in source and 'answerSafe' not in source)
check("No remote English media", not re.search(r'https?://', source + json.dumps(manifest)))
service_worker = (ROOT / "service-worker.js").read_text(encoding="utf-8")
check("Cache remains v29", 'const CACHE_NAME = "hoc-cung-be-v29"' in service_worker)
check("Runtime video cache", 'request.destination === "video"' in service_worker and "cacheMediaRange" in service_worker)
rules = (ROOT / "firestore.rules").read_text(encoding="utf-8")
whitelist = "['math-grade-1', 'vietnamese-grade-1', 'english-grade-1']"
check("Firestore three-course whitelist", rules.count(whitelist) == 3, str(rules.count(whitelist)))
secret_pattern = re.compile(r'(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35}|sk-[0-9A-Za-z]{20,})')
secret_hits = []
for path in ROOT.rglob("*"):
    relative = path.relative_to(ROOT)
    if not path.is_file() or path.name == "firebase-config.js" or any(part.startswith("__") for part in relative.parts) or ".git" in path.parts or path.suffix.lower() not in {".js", ".html", ".css", ".json", ".md", ".py", ".rules", ".webmanifest"}:
        continue
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    if secret_pattern.search(text):
        secret_hits.append(str(path.relative_to(ROOT)))
check("Secret scan", not secret_hits, ", ".join(secret_hits))

report = {"passed": all(item["passed"] for item in results), "totalBytes": total, "checks": results}
(ROOT / "__video_audit_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(0 if report["passed"] else 1)