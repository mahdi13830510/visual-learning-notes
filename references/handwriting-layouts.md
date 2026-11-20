# Handwriting layouts and the blueprint

The student copies these pages into a notebook, so design for the pen. A page that looks fine digitally but takes 50 minutes to copy, or can't be drawn freehand, has failed.

## Page budget (A4 or letter notebook page)

| Element | Typical | Hard ceiling |
|---|---|---|
| Diagrams | 1–3 (0 is fine on a derivation page) | 4 small ones |
| Equations / expressions | 3–8 | ~12 for a derivation page |
| Short annotations | 5–15 | ~20 |
| Sentences longer than ~15 words | 0–2 | 3 |
| Time to copy | 15–25 min | 35 min |

A derivation page may run long on equations if it has fewer annotations and one diagram. Budgets are guides; a page that needs more should be split, not crammed.

**Filling the page.** Never pad a page to fill it. Some blank space is fine (a notebook has room for the student's own margin notes). But if a page is under ~60% full and the next one is crammed, move content to rebalance. If a page is under ~40% full, merge it with a neighbour unless it has a different purpose. Use leftover space for a bigger main diagram before adding new content.

**When the requested content won't fit.** First cut B-class material. Then convert prose to arrows and labels. Only then add a page, and only if the new page has a purpose of its own. Never shrink the text to make it fit.

**Total length.** A single concept is usually 2–3 pages (~40–60 min to copy). A full lecture, or a concept whose required parts don't fit (e.g. intuition + factor meanings + hand computation + applications), can be 4–5 pages. That's fine when each page has its own purpose. The diagram budget is per page *on average*: a derivation page may have zero diagrams, so don't add a weak figure to meet a number. Say the total copy time in the blueprint so the student can plan.

## Layout patterns

Pick one per page. Name it in the blueprint so the student can see the structure.

**1. Picture | Math** (the default for a concept)
```
┌───────────────────────────────────────────┐
│ Title        Problem: one line            │
├──────────────────────┬────────────────────┤
│  diagram             │  key equation      │
│  (the intuition)     │  ↳ annotations     │
│                      │  what each term    │
│                      │  does to the pic   │
├──────────────────────┴────────────────────┤
│  strip: behaviour / cases / example       │
│  Key idea (boxed, one sentence)           │
└───────────────────────────────────────────┘
```

**2. Derivation spine** (a page that derives something)
```
│ Title, goal: "show that …"                 │
│ start expression          ← why this start │
│   = step                  ← reason         │
│   = step                  ← reason         │
│   = result  (boxed)       ← what it means  │
│ small picture of the result │ assumptions  │
```
The left column holds the math and the right column the one-line reasons, written in the margin.

**3. Pipeline strip** (algorithms, protocols, training loops)
```
│ ① input → ② step → ③ step → ④ output      │  (boxes and arrows across the page)
│ under each box: the equation for that step │
│ below: timeline / one round traced         │
│ bottom: failure modes (red)                │
```

Panels of very different shapes (a circle next to a 4:1 ellipse) belong in one wide figure with a shared scale, not in equal grid columns.

**4. Compare columns** (two methods, two regimes, IID vs non-IID)
```
│      A        │       B        │
│   picture     │   picture      │   (same axes, same scale)
│   equation    │   equation     │
│  ─── what differs, in one row ─── │
```
Draw both pictures at the same scale, or the comparison misleads.

**5. Concept map** (Level 1)
Central node in the middle, at most 7 surrounding nodes, a label on every arrow, and the defining equation under each node.

**6. Before → after**: a transformation (a matrix acting on a circle, a normalisation, a data augmentation). Draw the two states side by side and label the arrow between them with the operation.

### Placement conventions

- Title top-left, with the central problem on the same line or the line below. No title page.
- Read order: top-left to bottom-right. The **key idea** box sits at the bottom of the page, or right after the thing it concludes.
- Annotations go *beside* what they explain, with a short arrow, never in a separate legend.
- *Test your understanding* and *Remember* go at the end of the last page (or on a half page).
- Leave whitespace. Cramped pages don't get re-read.

## The blueprint format (use exactly this structure)

```markdown
# <Topic>: handwriting blueprint
Level: 2 (learning notes) · Pages: 3 · Total copy time: ~55 min
Mode: concept explorer | lecture companion (source: …)
Notation: θ parameters · η step size · … (the symbols used on every page, once)

## Page 1: <title>   (~18 min)
**Purpose:** <the one thing this page makes you understand>
**Layout:** Picture | Math. Diagram left (~55% width), equations right, strip along the bottom.

**Top**
- Title: "<title>"
- Problem: "<one line>"

**Draw (left)**
- <diagram>: what to draw, how big, what to mark, which colours. Concrete: "3 nested ellipses, wider than tall (ratio about 3:1), min at centre; dot θ_t on the second ellipse at upper right; blue arrow perpendicular to the ellipse pointing outward, labelled ∇L; green arrow the opposite way, labelled −η∇L."

**Write (right)**
- `θ_{t+1} = θ_t − η ∇L(θ_t)`; underbrace −η∇L as "step: downhill, scaled by η"

**Annotate**
- "∇L ⟂ contour line" (next to the dot)
- …

**Must not omit**
- <the 2–4 things without which the page fails>

## Page 2: …

## Test your understanding
1. …
## Remember
- …

## Beyond the notes (optional)
<C-class material: one-line pointers, not content>
```

### Writing good blueprint instructions

- **Be concrete enough to draw without guessing**: shapes, the rough proportions, what sits where, colours, and the labels' exact text.
- **Say the size of each drawing** ("about a third of the page width").
- **Give hand-drawing tips** when a figure is tricky: "draw the unit circle first, then the ellipse through (3, 0) and (0, 1)". "Contours: draw the innermost ellipse, then 2–3 larger ones roughly evenly spaced."
- **Write equations exactly** in inline code or LaTeX, in the notation the page uses.
- **Must-not-omit lists ideas, not decorations**: "the arrow is ⟂ to the contour", not "the blue colour".

## Estimating copy time

Rough rates for a student writing neatly:

| Item | Minutes |
|---|---|
| Title + problem line | 1 |
| Simple diagram (axes, a curve, 2–3 labels) | 2–3 |
| Medium diagram (contours + 2 arrows + labels, or 4-box flow) | 4–6 |
| Complex diagram (two coordinated panels, a matrix picture) | 7–10 |
| Short equation | 0.5–1 |
| Annotated equation (underbraces) | 1.5–2 |
| Derivation, per line | 1 |
| Annotation (≤ 10 words) | 0.3 |
| Table row | 0.7 |

Add them up and round to the nearest few minutes. If a page goes over ~30 minutes, split it or cut something.
