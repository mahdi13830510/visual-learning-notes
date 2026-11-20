# Tooling

Check what is installed before promising anything:

```bash
command -v chromium chromium-browser google-chrome node pdftoppm python3
```

| Have | You can make |
|---|---|
| nothing (chat only, e.g. Claude.ai without code) | the blueprint, with ASCII layout sketches; offer the HTML file for the user to open and print |
| Python 3 | the blueprint, `notes.html`, and `.excalidraw` files (structurally checked) |
| + Chromium/Chrome | A4 PDF, layout/KaTeX checks, PNG previews (`render_notes.py`) |
| + Node 22+ and network | Excalidraw-rendered SVG/PNG of `.excalidraw` files (`excalidraw_preview.mjs`) |

The page loads KaTeX, rough.js, and fonts from pinned CDN URLs. Without network, vendor them next to `notes.html` or say the PDF couldn't be rendered. **Never** describe a PDF, PNG, or Excalidraw file as rendered unless the command succeeded.

## Output folder

```
<topic>-notes/
├── blueprint.md          handwriting blueprint (always)
├── notes.html            the pages (copied from assets/template/notes.html; name it index.html if it will be published on the web)
├── notes.css, sketch.js  copied from assets/template/
├── notes.pdf             rendered A4
├── preview/page-N.png    rendered previews (for your inspection)
└── *.excalidraw (+ .svg/.png previews)   only if made
```

Put it in the user's working directory unless they say otherwise.

## The page template

`assets/template/notes.html` shows the structure. Each `<section class="page">` is one A4 sheet. Building blocks:

| Markup | Gives |
|---|---|
| `<header><h1 class="ul">T</h1><p class="problem"><b>Problem:</b> …</p><span class="pno">1/3</span></header>` | title line |
| `<div class="row l">` / `.r` / `.c2` / `.c3` with `<div class="col">` children | grid rows (wide-left, wide-right, halves, thirds) |
| `<h2><span class="n">1</span>label</h2>` | small numbered section label |
| `<div class="fig" id="…"></div>` + `<span class="cap note">…</span>` | figure slot drawn by sketch.js; handwritten caption |
| `<div class="eq">$$…$$</div>`, `.eq.big` | display equation |
| `<div class="derive">` pairs of `<div>$$…$$</div><div class="why">…</div>` | derivation spine with margin reasons |
| `<p class="note">`, `<span class="tag">Why?</span>` | handwritten annotation (Caveat) |
| `.blue .red .green .orange .gray` | meaning colours on text |
| `class="box"` / `"ul"` / `"circ"` + `data-color="green"` | hand-drawn rectangle / underline / ellipse around any element |
| `<div class="key box" data-color="green">` | the boxed key idea |
| `<p class="chain">A <span class="to">→</span> B …</p>` | cause → effect chain |
| `<span class="added">…</span>` | **+** marker for additions (Mode A) |
| `<span class="srcref">slide 12</span>` | gray source reference |
| `<table class="cmp">` | comparison table (only when comparison is the point) |
| `<div class="bottom">` | pushes a block to the page bottom |

Math: `$…$` inline and `$$…$$` display, rendered by KaTeX auto-render. Keep TeX inside HTML free of `<` and `>` (write `\lt`, `\gt`).

## sketch.js API

All drawing goes inside `Sketch.draw(() => { … })`, which runs after fonts and KaTeX are ready.

```js
const f = Sketch.fig("#id", { w: 300, h: 210, x: [-3, 3], y: [-2, 2] });  // data coords
const e = Sketch.fig("#id3", { w: 300, x: [-2, 2], y: [-1, 1.5], equal: true }); // h computed: circles stay round, ⟂ looks ⟂
const g = Sketch.fig("#id2", { w: 520, h: 180 });                          // pixel coords (y down)
```

| Method | Draws |
|---|---|
| `f.axes({x: "\\theta_1", y: "\\theta_2", at: [0,0], xticks: [1, [10, "10"]], yticks: [...]})` | arrowed axes with TeX labels and optional ticks (`[value, "TeX label"]`) |
| `f.contours(fn, levels, opts)` | level curves of `fn(x, y)` (marching squares) |
| `f.fn(fn, a, b, opts)` | graph of `y = fn(x)` |
| `f.path([[x,y], …], {smooth:false})` | polyline / smooth curve |
| `f.line(p, q)`, `f.arrow(p, q, {label, tex, curve, both, labelAt:"mid"})` | segment / arrow (label placed left of travel direction; `labelOffset:[dx,dy]` px to adjust) |
| `f.point(p, {label, at:[dx,dy], tex})` | dot with label |
| `f.text(p, "str", {anchor, size, dx, dy, color})`, `f.tex(p, "\\Sigma", …)` | handwritten text / KaTeX label |
| `f.circle(c, rPx)`, `f.ellipse(c, rx, ry, {angle})`, `f.rect(p, q)`, `f.poly(pts)` | shapes (`fill: "blue"` → hachure fill) |
| `g.box(x, y, w, h, "label", opts)` | box with centred label (pixel figs) |
| `f.matrix(p, [["a","b"],["c","d"]])` | bracketed matrix (TeX) |
| `f.brace(p, q, {label})` | curly brace with label |

**Label placement.** Labels are positioned in pixels relative to their anchor point:
- `point(p, {label, at:[dx,dy]})`: offset from the dot; dx < 0 right-aligns the label.
- `text/tex(p, s, {anchor, base, dx, dy})`: `anchor` is horizontal (start|middle|end) and `base` vertical (top|middle|bottom).
- `arrow(p, q, {label, labelOffset:[dx,dy]})`: the label is centred at the head (or the middle with `labelAt:"mid"`), 12 px to the left of the direction of travel by default. `labelOffset` replaces that default.
- A label containing TeX (`\\…`) must use `tex: true`; otherwise the renderer reports an error.

Common options: `color` (`ink soft gray faint blue red green orange` or hex), `width`, `dashed: true`, `rough` (0 = straight, default 0.9), `fill`, `size`, `anchor` (`start|middle|end`), `base` (`top|middle|bottom`, for TeX labels).

Tips:
- Use real coordinates: compute the actual singular vectors, the actual gradient, the actual update.
- Make figures 240–360 px wide in a half-page column and up to ~640 px across a full page. The A4 content width is ~690 px.
- If labels collide, move them with `at`, `dx`, `dy`, or `labelOffset`, and re-render. Never ship overlapping labels.
- Keep figures copyable: few marks, clear labels.
- `fn()` curves default to a low roughness (smooth functions look jittery otherwise). For sketchier lines, pass `rough: 0.9`.

## Rendering and checking

```bash
python3 <skill>/scripts/render_notes.py <dir>/notes.html          # → notes.pdf + preview/page-N.png
```

It reports JS/TeX errors, KaTeX errors, content running past the bottom or right edge of a page, labels colliding inside a figure, and PDF sheets that don't match the page count. It does not catch a label sitting on a line or curve, so look for those yourself. Exit 0 means no mechanical problems. **Then read every PNG** and judge it with `quality-checklist.md`. Typical fixes: shorten text, shrink a figure's `h`, split the page, or move a label.

## Excalidraw

```python
import sys; sys.path.insert(0, "<skill>/scripts")
from excalidraw import Scene
s = Scene()
server = s.box(260, 20, 200, 70, "server\nwₜ", color="blue")
c1 = s.box(40, 220, 170, 64, "client 1\nD₁")
s.arrow(server, c1, label="wₜ")                 # binds to both shapes
s.arrow(c1, server, label="w₁ᵗ⁺¹", color="green", dashed=True, bend=-30)
s.text(40, 300, "E local epochs of SGD", color="gray", size=16)
s.save("fedavg-round.excalidraw")               # raises if structurally invalid
```

Also `ellipse`, `diamond`, `line`, `group`, and the JSON-spec CLI (`python3 excalidraw.py spec.json out.excalidraw`). Then prove it opens:

```bash
node <skill>/scripts/excalidraw_preview.mjs fedavg-round.excalidraw   # → .svg + .png via Excalidraw's own exporter
```

Look at the PNG. Bound text is auto-centred by Excalidraw, so give boxes room (≈ 11 px per character at size 20).

Sizing for embedding: an Excalidraw scene ~750 px wide shown at full page width (~690 px) keeps text close to its nominal size. Use text size **≥ 20** for labels and ≥ 16 for side notes; smaller text becomes unreadable once it's scaled into the page. The exported SVG is transparent, so it sits on the dotted paper without a white card.

Arrows: two arrows between the same pair of boxes (down and up) need opposite bends (`bend=30` and `bend=-30`) or they cross. To show the diagram in the notes pages, embed the exported SVG with `<div class="fig"><img src="fedavg-round.svg" style="width:100%"></div>`. The fonts are embedded in the SVG.

Use Unicode for math in Excalidraw (`θ η ∇ Σ ∈ ≈ →`, subscripts `ₜ ₖ ᵢ`, superscripts `ᵗ ⁺¹`).

## Mermaid (only for long flows / sequences)

```html
<div class="fig"><pre class="mermaid">
sequenceDiagram
  Server->>Client k: w_t
  Client k->>Client k: E epochs SGD on D_k
  Client k-->>Server: w_k^{t+1}
</pre></div>
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs";
  mermaid.initialize({ startOnLoad: true, look: "handDrawn", theme: "neutral", fontFamily: "Kalam" });
</script>
```

Mermaid renders asynchronously, so give `render_notes.py` a larger `--budget` and check the preview. Use it for sequences with five or more steps or for state machines, never for math.

## PDF details

- A4 portrait, zero browser margins (the page has its own), backgrounds on, vector text and diagrams.
- Ship one PDF per notes set. The blueprint stays Markdown.
- Check the page count: it must equal the number of `.page` sections. `render_notes.py` verifies it.
