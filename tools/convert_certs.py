#!/usr/bin/env python3
"""Convert certificate PDFs into front/back JPGs for the Work page.

Drop the source PDFs into ./certs-src (or pass a folder as the first arg),
then run:  python3 tools/convert_certs.py
Outputs land in ./assets with the names work.html expects.
"""
import sys
from pathlib import Path

import fitz  # PyMuPDF

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "certs-src"
DPI = 200  # crisp on retina without huge files

# Each entry: output stem, keywords to match the source filename, pages to export.
# pages: "both" -> page 1 = -front, page 2 = -back; "first" -> page 1 only.
CERTS = [
    ("cert-data-r",        ["practical", "data", "researchers"], "both"),
    ("cert-doe",           ["design", "experiments", "nutshell"], "both"),
    ("cert-writing",       ["writing", "articles", "abstracts"], "both"),
    ("cert-info-literacy", ["information", "literacy", "reference"], "both"),
    ("cert-exploitation",  ["exploitation", "research", "knowledge"], "both"),
    ("cert-crm",           ["crm", "relationships"], "first"),
]


def find_pdf(keywords):
    pdfs = list(SRC.glob("*.pdf")) + list(SRC.glob("*.PDF"))
    for pdf in pdfs:
        name = pdf.name.lower()
        if all(k in name for k in keywords):
            return pdf
    return None


def save_page(doc, index, out_path):
    page = doc[index]
    pix = page.get_pixmap(dpi=DPI)
    pix.save(out_path, jpg_quality=88)
    print(f"  -> {out_path.name}  ({pix.width}x{pix.height})")


def main():
    if not SRC.exists():
        sys.exit(f"Source folder not found: {SRC}\nCreate it and drop the PDFs in.")
    ASSETS.mkdir(exist_ok=True)
    missing = []
    for stem, keywords, mode in CERTS:
        pdf = find_pdf(keywords)
        if not pdf:
            missing.append(stem)
            print(f"[skip] no PDF matched {keywords}")
            continue
        print(f"[{pdf.name}]")
        doc = fitz.open(pdf)
        if mode == "first":
            save_page(doc, 0, ASSETS / f"{stem}.jpg")
        else:
            save_page(doc, 0, ASSETS / f"{stem}-front.jpg")
            if doc.page_count > 1:
                save_page(doc, 1, ASSETS / f"{stem}-back.jpg")
            else:
                print("  (only one page — no back generated)")
        doc.close()
    if missing:
        print("\nUnmatched:", ", ".join(missing))
    else:
        print("\nAll certificates converted.")


if __name__ == "__main__":
    main()
