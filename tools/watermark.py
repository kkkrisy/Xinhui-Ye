#!/usr/bin/env python3
"""Bake a subtle "© Xinhui Ye" corner badge into image files.

The site previously relied only on a CSS ::after overlay, so the actual files
in assets/ were unmarked — anyone could download/inspect a clean copy. This
script burns the mark into the pixels of the served images.

Safety:
  * Every original is copied to assets/_originals/ before being touched.
  * Re-running is idempotent: a file already backed up is re-watermarked from
    its pristine backup, never stacking marks.

Usage:
  python3 tools/watermark.py            # watermark images referenced in *.html
  python3 tools/watermark.py --all      # every image in assets/
"""
import os
import re
import sys
import shutil
from urllib.parse import unquote
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
BACKUP = os.path.join(ASSETS, "_originals")
TEXT = "© Xinhui Ye"
EXTS = (".jpg", ".jpeg", ".png")
# "tiled" survives any crop/screenshot; "corner" is a single croppable badge.
MODE = "corner" if "--corner" in sys.argv else "tiled"

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def referenced_images():
    pat = re.compile(r"assets/[^\"')]+\.(?:jpg|jpeg|png)", re.IGNORECASE)
    found = set()
    for name in os.listdir(ROOT):
        if not name.endswith(".html"):
            continue
        with open(os.path.join(ROOT, name), encoding="utf-8") as fh:
            for m in pat.finditer(fh.read()):
                found.add(unquote(m.group(0)))  # decode %20, %26, etc.
    return sorted(found)


def all_images():
    return sorted(
        f"assets/{n}" for n in os.listdir(ASSETS)
        if n.lower().endswith(EXTS) and os.path.isfile(os.path.join(ASSETS, n))
    )


def corner_overlay(size):
    """Single © badge in the bottom-right corner (croppable)."""
    w, h = size
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font = load_font(max(13, min(int(w * 0.020), 46)))
    bbox = draw.textbbox((0, 0), TEXT, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad = max(10, int(w * 0.012))
    x = w - tw - pad - bbox[0]
    y = h - th - pad - bbox[1]
    draw.text((x + 1, y + 1), TEXT, font=font, fill=(0, 0, 0, 110))
    draw.text((x, y), TEXT, font=font, fill=(255, 255, 255, 150))
    return overlay


def tiled_overlay(size):
    """Faint © repeated on a diagonal grid — visible under any crop."""
    w, h = size
    short = min(w, h)
    font = load_font(max(14, int(short * 0.030)))

    # Measure one label on a scratch surface.
    scratch = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    bbox = scratch.textbbox((0, 0), TEXT, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]

    # Build the mark on an oversized square so rotation never clips corners,
    # then rotate and centre-crop back to the image size.
    diag = int((w ** 2 + h ** 2) ** 0.5) + tw
    layer = Image.new("RGBA", (diag, diag), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    step_x = tw + int(tw * 0.9)        # horizontal gap between marks
    step_y = th + int(th * 4.5)        # generous vertical breathing room
    for row, y in enumerate(range(0, diag, step_y)):
        offset = (step_x // 2) if row % 2 else 0   # brick-stagger the rows
        for x in range(-step_x, diag, step_x):
            d.text((x + offset + 1, y + 1), TEXT, font=font, fill=(0, 0, 0, 70))
            d.text((x + offset, y), TEXT, font=font, fill=(255, 255, 255, 90))

    layer = layer.rotate(30, resample=Image.BICUBIC, expand=False)
    left = (diag - w) // 2
    top = (diag - h) // 2
    return layer.crop((left, top, left + w, top + h))


def watermark_one(rel_path):
    src = os.path.join(ROOT, rel_path)
    if not os.path.exists(src):
        print(f"  ! missing: {rel_path}")
        return False

    name = os.path.basename(src)
    backup = os.path.join(BACKUP, name)
    # Keep a pristine original; always work from it so marks never stack.
    if not os.path.exists(backup):
        shutil.copy2(src, backup)
    work_from = backup

    img = Image.open(work_from)
    fmt = img.format
    img = ImageOps.exif_transpose(img)  # bake in rotation, drop EXIF orient
    has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
    base = img.convert("RGBA")
    w, h = base.size
    overlay = tiled_overlay(base.size) if MODE == "tiled" else corner_overlay(base.size)
    out = Image.alpha_composite(base, overlay)

    save_kwargs = {}
    if fmt in ("JPEG", None) and not has_alpha:
        out = out.convert("RGB")
        fmt = fmt or "JPEG"
        save_kwargs = {"quality": 90, "subsampling": 0}
    elif fmt == "PNG":
        out = out if has_alpha else out.convert("RGB")
    else:
        out = out.convert("RGB")
        fmt = "JPEG"
        save_kwargs = {"quality": 90, "subsampling": 0}

    out.save(src, format=fmt, **save_kwargs)
    return True


def main():
    os.makedirs(BACKUP, exist_ok=True)
    targets = all_images() if "--all" in sys.argv else referenced_images()
    print(f"Watermarking {len(targets)} image(s) [{MODE}]. Originals → assets/_originals/\n")
    done = 0
    for rel in targets:
        if watermark_one(rel):
            print(f"  ✓ {rel}")
            done += 1
    print(f"\nDone: {done}/{len(targets)} watermarked.")


if __name__ == "__main__":
    main()
