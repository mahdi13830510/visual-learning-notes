# Modes and densities

## Mode A: Lecture companion

The user brings lecture material: slides, a PDF chapter, screenshots, a transcript, handwritten notes, or a mix. The notes serve *this* lecture. They keep its order, its notation, and its emphasis, and add only what the student needs to understand it.

### Reading the material

1. Read everything before writing anything. Slides often build an idea over 5–10 slides, and the idea is only visible at the end.
2. Use the source's **notation** even when you'd choose differently (if the lecturer writes `w` for parameters, don't switch to `θ`). If two sources disagree, use the lecturer's and note the other in one line.
3. For each slide or section, sort the content:

| Class | Example | On the page? |
|---|---|---|
| **Explained by the lecturer** | the FedAvg update, derived on slides 8–10 | yes, in the lecturer's form |
| **Background the lecture assumes** | what a gradient is, Jensen's inequality | one line or one tiny picture, marked **+** |
| **Missing intuition** | *why* local steps drift under non-IID data, which the slides only state | yes, marked **+**, short |
| **Worth writing down** | the update rule, the assumption list, the one plot that shows the phenomenon | yes |
| **Safe to omit** | course logistics, history slides, a restatement of the previous slide, decorative stock images, the fifth example of the same thing | no |

4. **Compress the structure, not the ideas.** A slide with ten bullets usually says one thing ten ways. Find that thing and draw it. A slide with one equation the lecturer spent 20 minutes on deserves half a page.
5. **Mark additions.** Anything not from the lecture gets the **+** marker (`<span class="added">…</span>` in HTML, "**+**" in the blueprint). If you correct the lecture (a typo in an equation, an inconsistent index), write it as `+ slide 14 has η/2; standard form is η, same thing up to rescaling` and never fix it silently.
6. **Cite the source location** in small gray text where it helps the student find the original: `slides 8–10`, `§3.2`, `eq. (4)`.
7. **When the lecturer's picture or claim is wrong or misleading** (e.g. "momentum is smoother" drawn at a β where a real run overshoots), draw the honest version, keep the lecturer's point where it holds, and add one **+** line saying when it holds and when it doesn't. Don't silently redraw it, and don't keep a false picture.
8. When the material is images (screenshots, photos of a board), transcribe the equations carefully and flag anything illegible instead of guessing.

### Research papers (as source in Mode A, or as the topic in Mode B)

Separate four kinds of statement and never blur them:

- **Theorem / proven result**: give the assumptions on the page.
- **Empirical claim**: say on what data and against which baselines ("+3.1% on CIFAR-10, Dirichlet α = 0.1"). Only write numbers the paper actually reports.
- **Author interpretation**: "the authors argue…"
- **Your explanation**: marked **+**.

A paper's notes usually need: problem and prior gap (1–2 lines), the core mechanism as a diagram, the key equation(s) annotated, the assumptions, what the experiments actually show, the limitations, and "what I'd need to implement it". The last one matters to this user: list the exact pieces, such as the loss, the update, the hyperparameters, and the data split.

## Mode B: Concept explorer

The user gives a topic, equation, algorithm, paper title, or question with no material.

1. **Build the structure first.** Ask: what problem does this concept solve? What is the naive approach, and why does it fail? What is the mechanism? What is the key insight, in one sentence? What are the assumptions? Where does it break? What does it connect to?
2. **Pick the spine.** Most topics have one of these shapes, and the shape decides the pages:
   - *Problem → mechanism → consequences* (gradient descent, attention, TCP congestion control)
   - *Object → decomposition → interpretation → use* (SVD, eigen-decomposition, Fourier)
   - *System → protocol → math → failure modes* (federated learning, Paxos, MapReduce)
   - *Definition → properties → theorem → counterexample* (convexity, measure, continuity)
   - *Data → model → objective → optimization → behaviour* (any ML model)
3. **Choose the level of rigour** from the subject and the user. For this user (CS grad student: ML, optimization, FL), assume calculus, linear algebra, and probability, and include derivations. Don't assume that knowing a term means understanding its math: if the notes use the KL divergence, one annotation must say what it measures.
4. If the topic is a specific paper or method from one (e.g. "FedAvg, McMahan et al. 2017"), apply the four-way claim separation from *Research papers* above: gray `§`/`Alg.` references for the paper's statements, **+** for yours, and later terms or results credited to their own sources.
5. If the request is ambiguous in scope ("notes on transformers"), choose a sensible scope, say what you chose in one line, and offer the next part. Ask a question only when the answer would change the pages a lot (for example, exam revision versus first-time learning).

## Density levels

### Level 1: Concept map (one page, sometimes two)

- The purpose is to see the structure: the main ideas, how they depend on each other, and where each one comes from.
- It's mostly nodes and labelled arrows. **Label every arrow with the relationship** ("generalizes", "needs", "fails when", "approximates"). An unlabelled arrow says nothing.
- Use at most ~5 equations, each the defining one for its node.
- Good tool: an Excalidraw file, or a `sketch.js` box diagram on one page.
- The blueprint is shorter: node list, arrow list, placement.

### Level 2: Learning notes (default)

Everything in SKILL.md. Usually 2–3 pages for one concept, and up to 4–5 for a dense paper or a long chapter. Split by intellectual purpose: "what and why", then "the math", then "behaviour and failure modes".

### Level 3: Revision sheet

- One page per topic, sometimes two for a whole course unit.
- Keep only what you'd need to rebuild the topic: the key equations (still with one-word meanings), the critical distinctions as a table or side-by-side, the assumptions, **common mistakes** (red), and one micro-diagram per idea at most.
- Drop the motivation and long derivations. Keep "derivation in one line" hints (`complete the square → Gaussian`).
- If the user has never studied the topic, warn them that a revision sheet is no way to learn it, and offer Level 2.
