# Visual design

The look to aim for is a careful student's notebook, or a researcher's own notes: ink on paper, a few colours that mean something, drawings next to the text they explain, and plenty of air. The page should feel intellectual, minimal, precise, and human-made.

## Colour carries meaning

| Colour | Means | Typical use |
|---|---|---|
| ink (near-black) | primary content | titles, text, most equations |
| gray | scaffolding | axes, contour lines, source references, page numbers |
| **blue** | mathematical objects and relationships | key variables, gradient vectors, the object being defined |
| **red** | warnings, limitations, wrong directions, failure | "diverges", overshooting arrows, common mistakes |
| **green** | conclusions, things that work, the correct direction | descent step, optimum, key-idea box |
| **orange** | assumptions, observations, additions | "assumes L-smooth", "Notice:", the **+** marker |

- Use at most four colours on a page besides ink and gray. Many pages need only two.
- Keep one meaning per colour across all pages of a set.
- The page must survive grayscale printing: a red "wrong" arrow is also labelled, dashed, or crossed out.
- No background fills on text blocks and no coloured cards. Emphasis comes from a hand-drawn box, an underline, a circle, or colour on the words themselves.

## Typography (in the digital pages)

- **Kalam** (legible handwriting) for the main text and titles, **Caveat** for margin annotations, and KaTeX for math. Two hands make a real-notes contrast between "what I wrote down" and "what I scribbled next to it".
- Titles stay small: a 27 px title, underlined by hand, never a banner. Section labels are 18 px, numbered in small gray circles.
- Put no text below ~13 px on an A4 page.

## Annotation vocabulary

Short handwritten cues let the eye find the type of statement:

| Cue | For |
|---|---|
| **Problem:** | the central problem (once, at the top) |
| **Key idea** | the one sentence to remember (boxed) |
| **Intuition:** | the plain-language picture of an equation |
| **Why?** | the reason a step or term exists |
| **Notice:** | something visible in the diagram the eye might miss |
| **This causes…** / `→` | consequences |
| **Important assumption** (orange) | conditions |
| **Common mistake** (red) | the classic misreading |
| **What changes?** | the effect of a parameter or a modification |
| **+** (orange) | an explanation not from the lecturer (Mode A) |

Use them where they help. A page full of labels is as noisy as a page full of cards.

## The page

- A4, dotted 5 mm grid on off-white paper, and generous margins (13–15 mm).
- Hand-drawn diagram lines (rough.js roughness ≈ 0.9: visibly drawn, not wobbly).
- Leave whitespace between blocks: about 3 mm minimum, more between ideas.
- Page number top-right in gray (`1/3`).
- Never a cover page, table of contents, "Introduction", or "Conclusion" heading.

## Anti-AI-look rules (check every page)

Remove on sight:

- coloured cards or boxes around every section, and boxes with tinted backgrounds
- emoji, icons, clip-art servers and phones, stock illustrations
- gradients, shadows inside the page, glassmorphism
- oversized headings and banner titles
- headings for everything ("Overview", "Key Concepts", "Summary", "Conclusion")
- a summary that repeats the page
- bullet lists where an arrow chain would show the relationship
- arrows that connect things without meaning
- symmetric 2×2 or 3×3 grids of equal boxes (real notes are asymmetric: the important thing is bigger)
- every sentence in bold, or the same colour everywhere

Signs it looks human-made, in a good way:

- the main diagram is big and the side annotations are small
- annotations sit next to their target with a short arrow
- one key idea is boxed, not five
- the reading order is obvious without any headings
- some asymmetry: a wide diagram with a narrow column of math, or a margin full of small reasons beside a derivation
