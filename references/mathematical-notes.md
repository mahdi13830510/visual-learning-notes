# Mathematics in notes

Notes are not a textbook, but they must stay correct and make the math *readable*. An equation on the page is there to be understood, not just recorded.

## The equation protocol

For each **important** equation (not every expression):

1. **Picture first** where one exists: the diagram the equation describes is on the page, next to it.
2. **Write it cleanly** in the page's notation, with the most important part visually distinct (blue for the object, or a box for the final result).
3. **Annotate the parts that carry the idea**, using underbraces or margin arrows:
   ```latex
   \theta_{t+1} = \theta_t \;\underbrace{-\;\eta}_{\text{step size}}\;
                  \underbrace{\nabla L(\theta_t)}_{\text{steepest ascent}}
   ```
   Explain *what the term does*, not what its name is. "η: how far we trust the local slope" beats "η: learning rate".
4. **Link it back to the picture**: "the minus sign is the green arrow".
5. **State the conditions**: when it holds, its domain, its assumptions (orange).

Don't annotate the trivial: `t` as "iteration index" is noise once the reader knows the update rule.

## Derivations

- **Keep the intermediate steps that carry ideas.** Skip only pure algebra, and say what was done ("expand, cancel the cross terms").
- Use the **derivation spine** layout: math on the left, one-line reasons in the margin. HTML: `<div class="derive">` with pairs of `<div>$$…$$</div><div class="why">reason</div>`.
- Put a **box** around the result and say what it means in words underneath.
- Mark the step where an assumption is used: `← uses L-smoothness`.
- If a derivation is too long for the page, keep the skeleton (start, the 2–3 pivotal moves, the end) and say where the full version is.

## Worked numbers

- Choose numbers the student can **check by hand** in under a minute: small integers, a 2×2 matrix with clean singular values, a 1-D quadratic.
- The example must hit the **real difficulty**. For gradient descent, show one step that overshoots, not just one that works. For SVD, use a matrix whose singular vectors are *not* the standard axes, or the point is lost.
- Show the arithmetic once, inline: `θ₁ = 3 − 0.1·(2·3) = 2.4`.
- **Check that your parameters actually produce the effect you claim.** Toy settings often cancel it exactly. For example, FedAvg on quadratic clients with *equal* curvature has no fixed-point bias at all, so a drift example needs different curvatures (or non-quadratic losses). Momentum "smoothing" can turn into overshoot at β = 0.9. Run the numbers before you draw the picture.
- Verify every number you write. Compute it (mentally, or with a quick Python check) before it goes on the page.

## Notation hygiene

- Use one symbol per thing across all pages. Never reuse `k` for both client index and iteration.
- Give dimensions for the main objects once: `A ∈ ℝ^{m×n}`, `U ∈ ℝ^{m×m}`.
- Vectors in bold or with arrows, consistently. Matrices in capitals.
- Distinguish `:=` (definition) from `=` when it helps, and `≈` (approximation) always.

## Subject checklists

What must survive the compression, by subject. These are checklists for *your triage*, not sections to write.

**Pure math / linear algebra / calculus**
- definitions with their quantifiers (∀/∃ matter)
- assumptions and boundary conditions (continuity? square? full rank?)
- the key property and its geometric meaning
- the derivation of the main result (skeleton at least)
- one counterexample showing why an assumption is needed

**Probability & statistics**
- what is random and what is fixed (state it explicitly)
- distributions with parameters and support
- the estimator / test and what it assumes (independence, normality, n large)
- a picture of the density / area, not just the formula
- the classic misreading (p-value ≠ P(H₀ | data); correlation ≠ causation; Bayes base-rate)

**Optimisation**
- the objective, variables, constraints
- the update rule annotated
- conditions for convergence (convexity, smoothness L, step size bound η < 2/L)
- what happens outside them (divergence, oscillation, saddle points)
- rate (when relevant) and what it depends on (condition number κ)

**Machine learning / deep learning**
- data assumptions (IID? labels clean? distribution shift?)
- the model and its parameters (with shapes)
- the objective / loss and *why this loss*
- the training procedure and important hyperparameters
- the training dynamics that matter (what moves first, what overfits)
- failure modes and how they show up (curves, symptoms)

**Algorithms & data structures**
- input / output contract
- the core operation and the invariant it maintains
- the execution trace on one small input
- complexity (time and space), and *why* (which loop, which recurrence)
- the worst case and the failure case

**Distributed systems / networks / FL**
- the components and what flows between them (a diagram, always)
- the protocol round by round
- what each party knows and doesn't know
- the failure / adversary / heterogeneity model
- communication vs computation cost
- what breaks when assumptions fail (stragglers, partitions, non-IID data, Byzantine clients)

**Computer architecture**
- the data path / pipeline diagram
- what limits throughput (the bottleneck) and latency
- a worked timing example (cycles)

**Research papers**: see `modes.md`. Keep claims, theorems, evidence, and your additions apart.

## LaTeX / KaTeX notes

- Inline `$…$`, display `$$…$$`. KaTeX doesn't support every LaTeX package. Avoid `\begin{align}`; use `\begin{aligned}` inside `$$`.
- Use `\underbrace{…}_{\text{…}}` and `\overbrace` for annotations, `\color{#1f5fae}{…}` for blue (use the palette hexes), and `\boxed{…}` for results (or the page's `.box` class).
- `\tag{}` is not supported in inline mode. Avoid equation numbers; notes rarely need them.
- `scripts/render_notes.py` reports every KaTeX error. A red equation in the PDF is a bug.
