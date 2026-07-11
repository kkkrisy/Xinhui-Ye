#!/usr/bin/env python3
"""Bake a subtle "© Xinhui Ye" corner badge into video files.

The companion tools/watermark.py marks the site's images; this does the same
for the served videos, so a downloaded .mp4 still carries the mark rather than
relying only on the page's download-hardening.

The badge geometry mirrors the "corner" overlay in tools/watermark.py: a small
"© Xinhui Ye" pinned to the bottom-right, white on a soft shadow, sized
relative to the frame.

Safety:
  * Every original is copied to assets/_originals/ before being touched.
  * Re-running is idempotent: a file already backed up is re-watermarked from
    its pristine backup, never stacking marks.

Requires ffmpeg. If it is not on PATH, the pip package `imageio-ffmpeg`
(which bundles a static build) is used automatically.

Usage:
  python3 tools/watermark_video.py                 # the four AI&U videos
  python3 tools/watermark_video.py assets/foo.mp4  # specific file(s)
"""
import os
import re
import sys
import shutil
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
BACKUP = os.path.join(ASSETS, "_originals")
TEXT = "© Xinhui Ye"

# The AI&U videos on the master-detail page (default target set).
DEFAULT_TARGETS = [
    "assets/ai&u-film.mp4",
    "assets/ai&u-film-2.mp4",
    "assets/webclipper.mp4",
    "assets/knowledge-graph.mp4",
]

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial.ttf",
]


def ffmpeg_bin():
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit("ffmpeg not found and imageio-ffmpeg is not installed.")


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def probe_size(ff, path):
    """Read width/height from `ffmpeg -i` output (no ffprobe dependency)."""
    out = subprocess.run(
        [ff, "-hide_banner", "-i", path],
        capture_output=True, text=True,
    ).stderr
    for m in re.finditer(r"Video:.*?,\s*(\d{2,5})x(\d{2,5})", out):
        return int(m.group(1)), int(m.group(2))
    sys.exit(f"Could not read dimensions for {path}")


def corner_overlay_png(size, dest):
    """Write a transparent PNG the size of the frame with the © badge
    pinned bottom-right — same geometry as watermark.py's corner mode."""
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
    overlay.save(dest)


def watermark_one(ff, rel_path):
    src = os.path.join(ROOT, rel_path)
    if not os.path.exists(src):
        print(f"  ! missing: {rel_path}")
        return False

    name = os.path.basename(src)
    backup = os.path.join(BACKUP, name)
    # Keep a pristine original; always encode from it so marks never stack.
    if not os.path.exists(backup):
        shutil.copy2(src, backup)
    work_from = backup

    w, h = probe_size(ff, work_from)
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, "wm.png")
        corner_overlay_png((w, h), png)
        out = os.path.join(tmp, "out.mp4")
        cmd = [
            ff, "-y", "-hide_banner", "-loglevel", "error",
            "-i", work_from, "-i", png,
            "-filter_complex", "[0:v][1:v]overlay=0:0:format=auto[v]",
            "-map", "[v]", "-map", "0:a?",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p",
            "-c:a", "copy",
            "-movflags", "+faststart",
            out,
        ]
        subprocess.run(cmd, check=True)
        shutil.copy2(out, src)
    return True


def main():
    os.makedirs(BACKUP, exist_ok=True)
    ff = ffmpeg_bin()
    targets = sys.argv[1:] or DEFAULT_TARGETS
    print(f"Watermarking {len(targets)} video(s). Originals → assets/_originals/\n")
    done = 0
    for rel in targets:
        if watermark_one(ff, rel):
            print(f"  ✓ {rel}")
            done += 1
    print(f"\nDone: {done}/{len(targets)} watermarked.")


if __name__ == "__main__":
    main()
