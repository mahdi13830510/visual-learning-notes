# Evaluation

The skill was tested on four note sets: one written while building it, and three written by fresh Claude agents that had **only the skill files** (no access to the other examples). The three test agents were asked to follow the full workflow (render, look at every page, run the quality checklist) and then to critique the instructions. Each critique led to changes in the skill, listed below.

## Results

Each set was scored with the 16-criterion [rubric](rubric.md) (max 32) after reading the rendered pages, and every number on every page was re-checked.

| Set | Mode | Author | Pages | Copy time | Score | Notes |
|---|---|---|---|---|---|---|
| [Gradient descent](../showcase/gradient-descent/) | concept explorer | written during development | 2 | ~45 min | 30 / 32 | Strongest economy. The step-size page derives the 2/a threshold from one line. Lost points: page 1 is slightly dense, and the third step-size panel's start label sits close to an arrow. |
| [SVD](../showcase/svd/) | concept explorer | fresh agent | 4 | ~90 min | 30 / 32 | Excellent example choice (non-diagonalisable A with clean σ's and off-axis singular vectors). Every number verified. Lost points: 4 pages is long, and page 2's subspace list is text-heavy. |
| [FedAvg](../showcase/fedavg/) | concept explorer | fresh agent | 4 | ~100 min | 29 / 32 | Paper claims separated from explanations. An exact derivation of FedSGD = averaging, a second-order drift term, and a worked two-client fixed point. Lost points: two pages near the 30-min ceiling, and the algorithm block is dense. |
| [Momentum & Adam lecture](sessions/adam-lecture/) | lecture companion | fresh agent | 4 | ~78 min | 30 / 32 | Caught the planted typo in slide 8 and corrected it visibly, flagged the overloaded `v`, dropped logistics and history, and redrew a misleading slide claim from real runs. Lost points: page 1's ravine figure carries three paths and is busy. |

All four render with zero JavaScript or KaTeX errors, no overflow, no label collisions, and a PDF sheet count that matches the page count (`scripts/render_notes.py`). The Excalidraw file in the FedAvg set was opened and exported by Excalidraw's own renderer (`scripts/excalidraw_preview.mjs`).

## Mathematical spot checks (re-done independently)

- **GD:** ∇L(2, 1) = (4, 6); θ₁ = (1.6, 0.4); L: 7 → 3.04. The zig-zag factors on ½(θ₁² + 10θ₂²) with η = 0.18 are 0.82 and −0.8.
- **SVD:** AᵀA = [[4, 6], [6, 13]], λ = 16, 1. Av₁ = (8, 4)/√5 = 4u₁, Av₂ = (−1, 2)/√5. A₁ = [[1.6, 3.2], [0.8, 1.6]], and ‖A − A₁‖₂ = 1.
- **FedAvg:** f′ = 2w − 6, so w* = 3. One round from 3 with u = 2 gives ½(2.43 + 3.51) = 2.97. The fixed point at u = 2 is (0.51·4)/(0.19 + 0.51) = 2.914, and the limit as u → ∞ is 2.
- **Adam:** with constant g = 2, the uncorrected first step is m/√v = 0.2/√0.004 ≈ 3.16 (versus 1 corrected). The slide-8 typo shrinks the step at t = 1000 to 0.04α.

## What the test agents found, and what changed

| Finding | Change |
|---|---|
| display math in derivations was centred and widely spaced | `.derive` left-aligns, tightens display math, and uses no-wrap math cells |
| a long problem line pushed the page number to its own line | page number positioned absolutely |
| no axis ticks; the x-label collided with tick labels | `axes({xticks, yticks})`, with the axis label moved below the ticks |
| `fn()` curves looked jittery; rotated ellipses looked wobbly | lower default roughness for function graphs and rotated ellipses |
| overlapping labels were only caught by eye | the renderer now reports text/TeX labels that collide inside a figure (lines through labels still need eyes) |
| content running past the right edge wasn't detected | the renderer reports horizontal overflow |
| TeX in a plain-text label rendered literally, silently | reported as an error ("pass tex: true") |
| `soft` colour missing in sketch.js | added |
| circles drawn as ellipses unless ranges were hand-tuned | `fig({equal: true})` computes the height for equal aspect |
| Excalidraw SVG had an opaque white background; the palette differed from the notes | transparent export, and `excalidraw.py` uses the notes palette |
| Excalidraw text became tiny when embedded | sizing guidance (text ≥ 20, scene ~750 px), and opposite bends for arrows in both directions |
| **the drift recipe would mislead with equal-curvature quadratics** (no bias) | the worked-number rules now require checking that the parameters *produce* the effect; the drift recipe says to use different curvatures |
| no rule for a lecturer's picture that is false at the given parameters | Mode A rule: draw the honest version, keep the point where it holds, add a + line |
| paper-claim separation only described under Mode A | applies to Mode B paper topics too |
| no slot for shared notation in the blueprint | `Notation:` line added to the blueprint header |
| unclear when 4 pages is fine, when to pad, when to split | page-filling and total-length rules; a cut-first order before adding pages; 0 diagrams allowed on derivation pages |
| label placement semantics undocumented | label-placement section in `tooling.md` |
| output named `notes.html` vs `index.html` when published | documented |

## Known limitations

- The renderer can't see a label sitting on a line or curve. The skill tells the model to look at every preview for this.
- The digital pages need network access for KaTeX, rough.js, and the fonts (pinned CDN versions), unless they are vendored.
- Excalidraw verification needs Node 22+ and network access (esm.sh). Without them, `excalidraw.py --check` still validates the structure.
- Copy-time estimates are rules of thumb, not measured.
