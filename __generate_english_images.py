from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT / "assets" / "english-grade-1" / "images"
POSTERS = ROOT / "assets" / "english-grade-1" / "posters"

SCENES = {
    "classroom": ("IN THE CLASSROOM", "desk  chair  board  door  window", "🏫", "#dff4ff"),
    "home-things": ("THINGS AT HOME", "table  bed  lamp  cup  spoon", "🏠", "#fff1dc"),
    "food-drinks": ("FOOD AND DRINKS", "rice  bread  milk  water  juice", "🥛", "#e9f8dc"),
    "favorite-food": ("MY FAVORITE FOOD", "chicken  cake  noodles  egg  soup", "🍰", "#ffe5ef"),
    "classroom-instructions": ("OPEN YOUR BOOK", "Listen, look, open and read.", "📖", "#e8edff"),
    "positions": ("WHERE IS IT?", "in  on  under  near", "⚽", "#fff4d7"),
    "places": ("PLACES AROUND ME", "library  playground  home  park", "📚", "#e0f7ec"),
    "transport": ("TRANSPORT", "bus  bike  car  boat  train", "🚌", "#e5efff"),
    "weather": ("WEATHER TODAY", "sunny  rainy  windy  cloudy", "🌦️", "#e5f6ff"),
    "clothes": ("CLOTHES", "shirt  dress  hat  shoes  coat", "🧢", "#f3e9ff"),
    "feelings": ("FEELINGS", "happy  sad  tired  hungry  fine", "😊", "#fff0d8"),
    "abilities": ("I CAN DO IT", "swim  sing  dance  draw  read", "⭐", "#e4f8ee"),
    "daily-routine": ("MY DAILY ROUTINE", "get up  wash  eat  school  sleep", "🌅", "#eaf1ff"),
    "times-of-day": ("TIMES OF DAY", "morning  afternoon  evening  night", "🌙", "#e8e8ff"),
    "meals": ("MEALS IN A DAY", "breakfast  lunch  dinner", "🍽️", "#fff0df"),
    "polite-words": ("POLITE WORDS", "please  thank you  sorry", "💛", "#fff4cf"),
    "ask-for-help": ("CAN YOU HELP ME?", "Yes, of course!", "🙋", "#e7f5ff"),
    "sequence": ("FIRST, NEXT, THEN", "Open the book. Read. Close the book.", "1  2  3", "#e9f7e3"),
    "little-story": ("A LITTLE STORY", "A girl flies a kite in the park.", "🪁", "#e8f7ff"),
    "review-2": ("REVIEW 2", "Listen  Speak  Read  Review", "★", "#fff0cf"),
}


def font(size, bold=False):
    names = ["arialbd.ttf", "Arial Bold.ttf"] if bold else ["arial.ttf", "Arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def centered(draw, xy, text, chosen_font, fill):
    box = draw.textbbox((0, 0), text, font=chosen_font)
    draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), text, font=chosen_font, fill=fill)


def render(path, title, words, symbol, background, poster=False):
    width, height = (960, 540) if poster else (800, 500)
    image = Image.new("RGB", (width, height), background)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((35, 30, width - 35, height - 30), radius=44, fill="#ffffff", outline="#bfd7eb", width=6)
    draw.ellipse((70, 95, 300, 325), fill="#dff2ff", outline="#8fc5e8", width=5)
    symbol_font = font(92, True)
    centered(draw, (185, 210), symbol, symbol_font, "#4a67a1")
    centered(draw, (width * .66, 150), title, font(36 if poster else 32, True), "#344b78")
    max_width = width * .54
    chunks, line = [], ""
    for word in words.split():
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=font(22, True)) > max_width and line:
            chunks.append(line)
            line = word
        else:
            line = trial
    if line:
        chunks.append(line)
    for index, chunk in enumerate(chunks[:3]):
        centered(draw, (width * .66, 235 + index * 48), chunk, font(22, True), "#536887")
    draw.rounded_rectangle((width * .48, height - 112, width - 75, height - 60), radius=24, fill="#ffdf78")
    centered(draw, (width * .73, height - 86), "LISTEN • SPEAK • PLAY", font(18, True), "#6b5220")
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=84, method=6)


for name, values in SCENES.items():
    render(IMAGES / f"{name}.webp", *values)

for name in ["classroom-instructions", "places", "weather", "ask-for-help"]:
    render(POSTERS / f"{name}.webp", *SCENES[name], poster=True)

print(f"generated_images={len(SCENES)}")
print("generated_posters=4")