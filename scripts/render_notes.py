#!/usr/bin/env python3
"""Render and check a visual-learning-notes page in headless Chromium.

Usage:
  python3 render_notes.py path/to/notes.html [--pdf out.pdf] [--png OUTDIR] [--dpi 110]

What it does
  1. Loads the page, waits for fonts, KaTeX and sketch.js, and reads the #vln-status report:
     JavaScript/TeX errors, KaTeX errors, content running past the bottom or right edge of an A4 page,
     and text/TeX labels that collide inside a figure.
  2. Prints the page to an A4 PDF (vector: text, math and diagrams stay sharp).
  3. Checks that the PDF has exactly one sheet per <section class="page"> (a spill means overflow).
  4. Rasterises each PDF page to PNG (needs pdftoppm) so you can LOOK at the result.

Exit code 0 = no problems found. Needs only a Chromium/Chrome binary (+ pdftoppm for PNGs).
"""
import argparse, glob, html, json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path


def find_browser():
    for name in ("chromium", "chromium-browser", "google-chrome", "google-chrome-stable", "chrome"):
        p = shutil.which(name)
        if p:
            return p
    for pat in ("~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome",
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                "/Applications/Chromium.app/Contents/MacOS/Chromium"):
        hits = sorted(glob.glob(os.path.expanduser(pat)))
        if hits:
            return hits[-1]
    return None


def chrome(browser, args, budget):
    prof = tempfile.mkdtemp(prefix="vln-")
    cmd = [browser, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
           f"--user-data-dir={prof}", f"--virtual-time-budget={budget}", "--run-all-compositor-stages-before-draw",
           *args]
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    finally:
        shutil.rmtree(prof, ignore_errors=True)


def pdf_pages(pdf: Path):
    if shutil.which("pdfinfo"):
        out = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        m = re.search(r"Pages:\s+(\d+)", out)
        if m:
            return int(m.group(1))
    data = pdf.read_bytes()
    return len(re.findall(rb"/Type\s*/Page[^s]", data))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("html")
    ap.add_argument("--pdf", help="output PDF (default: notes.pdf next to the HTML)")
    ap.add_argument("--png", help="directory for page PNGs (default: <html dir>/preview)")
    ap.add_argument("--dpi", type=int, default=110)
    ap.add_argument("--budget", type=int, default=20000, help="virtual time budget in ms")
    a = ap.parse_args()

    page = Path(a.html).resolve()
    if not page.exists():
        sys.exit(f"no such file: {page}")
    browser = find_browser()
    if not browser:
        sys.exit("No Chromium/Chrome found. Install one, or open the HTML and print to A4 PDF by hand "
                 "(margins: none, background graphics: on).")
    url = page.as_uri()
    problems = []

    # 1) layout / error report
    dom = chrome(browser, ["--dump-dom", url], a.budget).stdout
    m = re.search(r'id="vln-status"[^>]*>(.*?)</pre>', dom, re.S)
    if not m:
        problems.append("page never finished (no #vln-status): a script error before Sketch ran, "
                        "or CDN assets unreachable")
        status = {}
    else:
        status = json.loads(html.unescape(m.group(1)))
        for e in status.get("errors", []):
            problems.append("JS/TeX error: " + e.splitlines()[0])
        if status.get("katexErrors"):
            problems.append(f"{status['katexErrors']} KaTeX error(s) in page text (red source shown)")
        for o in status.get("overflow", []):
            where = "past the right margin" if str(o["element"]).startswith("too wide") else "past the bottom margin"
            problems.append(f"page {o['page']}: content runs {o['px']}px {where} ({o['element']})")
        for o in status.get("labelOverlaps", []):
            problems.append(f"page {o['page']}: labels overlap in figure #{o['figure']}: '{o['a']}' / '{o['b']}'")
        for o in status.get("figuresTooWide", []):
            problems.append(f"page {o['page']}: figure {o['figure']} sticks out of the page")
    n_sections = status.get("pages") or len(re.findall(r'<section[^>]*class="[^"]*\bpage\b', page.read_text()))

    # 2) PDF
    pdf = Path(a.pdf).resolve() if a.pdf else page.with_name("notes.pdf")
    r = chrome(browser, ["--no-pdf-header-footer", "--print-to-pdf-no-header",
                         f"--print-to-pdf={pdf}", url], a.budget)
    if not pdf.exists():
        problems.append("PDF was not written: " + (r.stderr or "")[-300:])
    else:
        n_pdf = pdf_pages(pdf)
        if n_sections and n_pdf != n_sections:
            problems.append(f"PDF has {n_pdf} sheets but the page has {n_sections} .page sections "
                            "(something overflowed onto an extra sheet)")

    # 3) PNG previews
    shots = []
    if pdf.exists() and shutil.which("pdftoppm"):
        outdir = Path(a.png) if a.png else page.parent / "preview"
        outdir.mkdir(parents=True, exist_ok=True)
        for old in outdir.glob("page-*.png"):
            old.unlink()
        subprocess.run(["pdftoppm", "-png", "-r", str(a.dpi), str(pdf), str(outdir / "page")], check=False)
        shots = sorted(outdir.glob("page-*.png"))
    elif pdf.exists():
        print("note: pdftoppm not found; open the PDF to inspect it visually")

    print(f"pages: {n_sections}   pdf: {pdf}")
    for s in shots:
        print(f"preview: {s}")
    if problems:
        print("\nPROBLEMS")
        for p in problems:
            print(" -", p)
        sys.exit(1)
    print("OK: no errors, no overflow. Now LOOK at every preview PNG before calling it done.")


if __name__ == "__main__":
    main()
