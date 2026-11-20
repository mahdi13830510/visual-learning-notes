---
name: visual-learning-notes
description: Turns lectures, slides, PDFs, papers, or a bare topic into compact visual study notes of the kind a sharp student writes in an excellent lecture. Every page has one purpose, small meaningful diagrams, a few annotated equations with their derivation steps, and cause-and-effect arrows. It comes with a page-by-page handwriting blueprint (what to draw, write, and annotate, plus time to copy), and optional printable A4 PDFs with hand-drawn diagrams and native Excalidraw files. Strong on math, ML, optimization, linear algebra, probability, algorithms, systems, networks, and federated learning. Use when the user wants notes, lecture notes, study notes, a notebook page, a one-page summary, a cheat sheet, a revision sheet, a concept map, or exam notes for a topic, or shares lecture material and asks to turn it into notes. Not for long explanations or full lessons (that is teaching, not note-making).
---

# Visual Learning Notes

Make the notes a thoughtful graduate student would take in a great lecture: one or two pages per idea, from which the whole concept can be **rebuilt weeks later** without the textbook. The student will copy them by hand, so every page must be drawable in a notebook.

The governing rule: **every element earns its place.** If removing it costs no understanding, remove it. If a drawing would make an idea much easier, draw it.

## What you deliver

1. **The handwriting blueprint** (always). For each page: title, layout, what to draw, the equations, the annotations, the must-not-omit points, and a time to copy. Then *Test your understanding* (3–5 questions) and *Remember* (2–4 takeaways). Put it in chat and save it as `blueprint.md`. The format is in `references/handwriting-layouts.md`.
2. **Digital notes pages** (default when a browser is available): `notes.html` → A4 `notes.pdf`, built from `assets/template/`. Ink on dotted paper, hand-drawn diagrams (rough.js), KaTeX math. They are a clean reference for the same pages the student writes, not a replacement for writing them.
3. **Native `.excalidraw` files** only when a whiteboard diagram is central (an architecture, a pipeline, a concept map) or the user asks for one. Each file must pass Excalidraw's own renderer (`scripts/excalidraw_preview.mjs`). Never claim a file exists or opens unless that check passed.

If the user asks for only one of these, give only that one. Never make a format just to show off a tool.

## Modes

- **Lecture companion.** The user supplies slides, a PDF, screenshots, a transcript, or rough notes. Notes follow the *lecturer's* structure and notation. Sort the content into: what the lecturer explicitly explains, needed background, intuition the lecture skipped, what is worth writing, and what can be dropped. Your own additions are marked **+** (`class="added"`) and never attributed to the lecturer. Ten bullets on a slide may be one arrow on the page.
- **Concept explorer.** The user gives a topic, equation, algorithm, paper, or question. Build the concept's structure first, then the notes.

Details, including how to read slides and papers: `references/modes.md`.

## Density

| Level | Use for | Looks like |
|---|---|---|
| 1 · Concept map | "overview", "big picture", "how do these relate" | one page, ideas and labelled arrows, very few equations |
| **2 · Learning notes** (default) | anything else | intuition → picture → math → implications; derivations kept |
| 3 · Revision sheet | "cheat sheet", "exam tomorrow", "revision" | the essential equations, distinctions, assumptions, and traps only |

Never default to Level 3: understanding comes first. Revision sheets for material the user hasn't seen should say so.

## Workflow

1. **Understand the material.** Read every source. List the topic, prerequisites, core concepts, equations, algorithms, assumptions, examples, and the usual misunderstandings. For papers and lectures, keep the author's claims apart from your explanations.
2. **Build the conceptual model** before drawing anything: the central problem, why it exists, the mechanism, the key insight, the mathematical structure, how the ideas depend on each other, and the limitations. Write the model down as a short internal dependency chain, e.g. `non-IID data → different local optima → local steps drift → average ≠ global optimum`.
3. **Triage** every candidate item: **A essential** (on the page), **B supporting** (only if it buys understanding), **C supplementary** (off the page; it may go in a short "beyond the notes" line in chat). Most of the craft is deciding what *not* to write.
4. **Design the pages.** Give each page one intellectual purpose, and decide the page count from the content. Never cram a big subject onto one page. Pick a layout pattern and, for each idea, the representation that shows it best (`references/diagram-guidelines.md`). Give each important equation an annotation and a small picture (`references/mathematical-notes.md`).
5. **Generate the visuals and pages.** Copy `assets/template/` into the output folder and write `notes.html`. Draw figures with `sketch.js`, and write Excalidraw files with `scripts/excalidraw.py` when they are warranted. The API and the commands are in `references/tooling.md`.
6. **Write the handwriting blueprint**, page by page, with copy times.
7. **Render and look.** Run `python3 scripts/render_notes.py <dir>/notes.html`. Fix every reported error or overflow, then **open every preview PNG** and look at it the way a student would.
8. **Quality control.** Go through `references/quality-checklist.md`. If any important answer is "no", revise, re-render, and look again. Two passes is normal.

## Non-negotiables

- **Problem first, in one or two lines**: what we want, why it's hard or why the obvious approach fails. No motivational essays.
- **Intuition before abstraction.** Picture, then equation, then what the equation says about the picture. The drawing and the equation should explain each other.
- **Annotate what matters in an equation** (underbraces, arrows, colours), not every trivial symbol. Keep the intermediate steps of a derivation, with a short reason for each step.
- **Show relationships**: cause → effect chains, before/after, side-by-side comparisons, dependencies. Never a list of disconnected definitions.
- **Small examples you can check by hand.** One good worked number beats five toy mentions, and it must hit the real difficulty.
- **Keep assumptions, boundary conditions, and failure modes** on the page (orange for assumptions, red for failure).
- **Correctness over visual simplicity.** If a simple picture would mislead, draw the honest one or write the limitation next to it ("2-D picture; in high-D, saddle points dominate").
- **Colour encodes meaning** (blue = math objects, red = warnings, failure, wrong direction, green = conclusions, orange = assumptions). The page must survive grayscale printing, so meaning never relies on colour alone.
- **Handwriting budget per page** (a guide, not a quota): 3–8 equations, 1–3 diagrams, 5–15 short annotations, about 15–25 minutes to copy. No sentence longer than about 15 words, and no paragraphs.
- **No AI-infographic look**: no cards, icons, emoji, gradients, oversized headings, decorative arrows, or a summary that repeats the page. See `references/visual-design.md`.
- **Honesty**: no invented numbers, citations, or lecturer statements. Say what you could not verify.

## End of every topic

- **Test your understanding**: 3–5 questions that test understanding: why it works, what breaks when an assumption fails, what a parameter change does, how two concepts differ, "rebuild this equation from the picture". Keep them on the last page, and don't scatter quizzes across pages.
- **Remember**: 2–4 takeaways, each one sentence.

## References (read when needed)

| File | Read it when |
|---|---|
| `references/modes.md` | handling lecture material, papers, or Mode B topics; Level 1/3 specifics |
| `references/handwriting-layouts.md` | designing pages; **blueprint format**; time estimates |
| `references/diagram-guidelines.md` | choosing and drawing each figure; which tool for which figure |
| `references/mathematical-notes.md` | any equation, derivation, or worked example; subject checklists (math, ML, algorithms, systems, papers) |
| `references/visual-design.md` | page look, colour, type, annotation vocabulary, anti-AI-look rules |
| `references/tooling.md` | the template, the `sketch.js` API, rendering, Excalidraw, Mermaid, PDFs |
| `references/examples.md` | calibrating against finished notes (gradient descent, SVD, FedAvg) |
| `references/quality-checklist.md` | before delivering, every time |
