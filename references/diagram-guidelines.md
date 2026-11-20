# Diagram guidelines

A diagram earns its place only if it makes an idea faster or more certain to grasp than words or an equation could. Decoration fails that test.

## The five-second test

Before drawing, finish this sentence: *"Looking at this for five seconds, the student sees that ___."* If you can't fill the blank with something specific ("the gradient is perpendicular to the contour", "V rotates, Σ stretches, U rotates again", "two clients pull the average away from both optima"), don't draw it.

## Choose the representation from the idea

| The idea is about… | Draw | Not |
|---|---|---|
| direction, steepness, optimisation | contour plot + point + arrows | a 3-D surface (hard to copy, hides direction) |
| a function's behaviour, a trade-off | small 2-D axes with 1–3 curves | a table of values |
| a transformation | before → after shapes (unit circle → ellipse; grid → sheared grid) | the matrix alone |
| an algorithm / protocol | numbered boxes and arrows, one round traced | prose steps |
| iteration over time | timeline / sequence of states (θ₀, θ₁, θ₂ …) | a single "after" picture |
| data flow / architecture | boxes = components, arrows = what flows (labelled with the variable) | icons of servers and phones |
| hierarchy | a tree | nested bullets |
| a dependency / cause chain | `A → B → C` written in-line, arrows labelled | five separate definitions |
| a comparison | two panels with the **same axes and scale** | two unrelated sketches |
| matrix shapes / dimensions | rectangles drawn to proportion (m×n tall or wide) with dimension labels | an entry-by-entry grid |
| one computation | the one entry being computed, highlighted (row · column) | the full product |
| probability | areas (a rectangle split into regions), or a density with a shaded region | Venn diagrams with icons |

## Drawing so it can be copied

- **Simple primitives**: lines, arrows, ellipses, rectangles, dots, braces, and short labels. If a student can't sketch it in under ~5 minutes with a pen, simplify it.
- **Few marks**: 3–4 contour lines, not 12. 2–3 data points, not 30. One traced path, not ten.
- **Proportions that carry meaning**: an elongated ellipse *means* ill-conditioned, so keep the ratio visible (about 3:1). A matrix drawn tall *means* m > n.
- **Labels on the drawing**: put the label next to the thing it names. No legends or keys unless you're comparing several curves.
- **Arrows always mean something**: direction, flow, causation, or transformation. Label any arrow whose meaning isn't obvious. No decorative arrows.
- **Dashed lines** are for approximations, projections, optional paths, or "would have gone here". Use them consistently.
- **Colour**: at most 3 colours per diagram besides ink and gray, with meaning set by `visual-design.md`. Every coloured element must still be identifiable in grayscale through its label, line style, or position.

## Honesty in pictures

- A 2-D picture of a high-dimensional fact must say so: "2-D cartoon: in 10⁶ dims, saddles ≫ minima".
- Never draw data or curves that pretend to be measured. Schematic curves are fine; label them as schematic when it matters ("schematic: not to scale").
- Exact facts should be drawn exactly. When the picture claims the ellipse's axes are σ₁ and σ₂, compute them. `sketch.js` uses real coordinates, so use real numbers.
- If the honest picture is too complex, draw the simple one and write its limitation next to it.

## Which tool for which diagram

Use the simplest tool that is correct. Never use a technology just to show it off.

| Diagram | Tool | Why |
|---|---|---|
| coordinate plots, contours, vectors, transformations, anything with real coordinates | **`sketch.js` in notes.html** (SVG + rough.js) | exact geometry with a hand-drawn line; KaTeX labels; prints as vectors |
| architecture, data flow, concept maps, protocols the student may want to edit or extend | **Excalidraw** (`scripts/excalidraw.py`) | native whiteboard file the student can open, edit, and reuse; authentic hand-drawn look |
| long sequential processes, state machines, message sequences | **Mermaid** (`look: handDrawn`) in the page, or a `sketch.js` box flow | auto-layout for many nodes; avoid for anything mathematical |
| a precise static figure needed outside the notes (e.g. for a report) | a plain SVG file, or matplotlib with `plt.xkcd()` only when the hand-drawn look is wanted | standalone asset |
| equations | **KaTeX** (inline `$…$`, display `$$…$$`) | correct typesetting; renders in HTML and PDF |

Excalidraw text can't render LaTeX, so use Unicode in Excalidraw labels (`wₜ`, `Δₖ`, `∇F`, `η`, `Σ`). If a diagram needs real math labels, draw it with `sketch.js`.

## Reusable figure recipes (sketch.js)

These recur constantly. Adapt them rather than inventing new pictures.

- **Optimisation step**: `contours(f, levels)`, `point(θt)`, `arrow(θt, θt + g, {color:'blue'})` for the gradient, and `arrow(θt, θt − ηg, {color:'green'})` for the step. Mark the minimum with a green dot.
- **Step size trio**: three small panels with the same 1-D parabola: tiny steps (many short arrows), good steps, and overshoot (arrows zig-zagging outward, in red).
- **Linear map**: unit circle and two basis vectors on the left, then an arrow labelled `A`, then the image ellipse with the stretched vectors on the right.
- **Matrix product shapes**: rectangles sized m×k · k×n = m×n, with one row and one column highlighted to show a single entry.
- **Server–client round**: a server box on top, K client boxes below, labelled arrows down (`w_t`) and up (`w_{t+1}^k`), and one equation under the server.
- **Drift**: two clients' local optima as two dots, the global optimum between them, local trajectories curving toward their own optimum, and the averaged point marked off the global optimum. Compute real paths. With equal-curvature quadratics the average lands *on* the optimum, so the picture would lie; use different curvatures.
- **Distribution**: a bell curve with the shaded tail and the threshold marked, with the area labelled.
