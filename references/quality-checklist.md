# Quality checklist

Run this after rendering, **looking at the preview PNGs** rather than the source. Answer each question honestly. If an important answer is "no", fix the problem, re-render, and check again.

## A. Understanding

1. **Is the central concept clear from the page alone?** Cover the blueprint and read only the page. Is the problem stated? Is the key idea boxed?
2. **Could the student rebuild the explanation in three weeks?** Trace it: problem → picture → equation → behaviour → limits. Every link must be on the page, even as one arrow or one line.
3. **Does intuition come before abstraction?** For each important equation, is its picture or plain-language meaning next to it?
4. **Are relationships shown, not just listed?** There should be at least one cause → effect chain or comparison per page wherever the topic has one.
5. **Is the example real?** It can be checked by hand and it hits the actual difficulty (overshoot, non-axis-aligned singular vectors, heterogeneous clients).

## B. Correctness

6. **Is every equation right?** Check signs, indices, transposes, dimensions, and the 1/n versus n_k/n weights. Recompute every number shown.
7. **Is the intuition accurate, not just appealing?** No false simplifications ("gradient descent finds the global minimum").
8. **Are the assumptions and boundary conditions on the page?** Convexity, smoothness, step-size bounds, IID, full rank, whatever the result needs.
9. **Do the pictures tell the truth?** Real coordinates where exactness is claimed, and limitations labelled.
10. **In Mode A: are your additions marked +, and is nothing attributed to the lecturer that they didn't say?**

## C. Economy

11. **Does every diagram pass the five-second test?** Name what it shows. If you can't, cut it.
12. **Is there anything removable?** Look for repeated statements, an annotation that restates the diagram, a summary repeating the page, definitions nobody uses later, and trivial symbol explanations.
13. **Is it within budget?** Each page has one purpose, takes ≤ ~30 min to copy, and has no sentence over ~15 words and no paragraphs.

## D. Handwriting

14. **Can each diagram be drawn freehand in ≤ 5 minutes?**
15. **Is the blueprint concrete enough to follow without seeing the PDF?** It gives sizes, positions, exact labels, and drawing order for the tricky figures.
16. **Do the copy times add up** (see the table in `handwriting-layouts.md`)?

## E. Look

17. **Does it look like intelligent human notes rather than an AI infographic?** Go through the anti-AI-look list in `visual-design.md`: no cards, icons, emoji, giant headings, or symmetric grids of boxes.
18. **Does colour mean something, and does the page survive grayscale?**
19. **Are the mechanics clean?** No overlapping labels, no text running into figures, no content cut off at the page bottom, no red KaTeX errors, and the page count matches.
20. **Is there whitespace?** A cramped page means it should be split.

## Typical failures and fixes

| Symptom | Fix |
|---|---|
| a page reads like a textbook | turn sentences into arrows, labels, and margin notes; keep only the reasons |
| the equations float with no meaning | add underbraces and point them to the figure ("the green arrow") |
| the diagram is pretty but says nothing | replace it with one that shows the mechanism (see the representation table) |
| everything gets one page | split by purpose: what/why, math, behaviour/failure |
| the example is trivial (identity matrix, IID clients) | choose one that exhibits the difficulty |
| too many colours | go back to ink + one or two meaning colours |
| labels overlap after rendering | move them with `at`/`dx`/`labelOffset`, or enlarge the figure |
| it overflows the page | shorten text, reduce a figure's height, or split the page |
| quiz questions ask for recall ("what is η?") | rewrite them as why / what-if / compare / rebuild |
