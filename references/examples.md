# Calibration examples

Finished notes made with this skill live in `showcase/`. Each folder has the pages (`index.html` → `notes.pdf`) and the handwriting blueprint (`blueprint.md`). Use them to calibrate density, tone, and layout, **not** as templates to copy: a new topic needs its own conceptual structure.

Below are the design decisions behind each example. The decisions transfer to new topics; the content does not.

## A. Gradient descent (`showcase/gradient-descent/`), 2 pages, ~45 min to copy

**Conceptual model:** we have only local information (∇L at θ) → first-order Taylor → the steepest-ascent direction is ∇L, and it is ⟂ to the contours → step against it → η must respect curvature (1-D: θₜ = (1 − ηa)ᵗθ₀) → in n-D the steepest direction caps η and the flattest sets the speed (κ).

**Triage**
- A (essential): the contour picture with ∇L ⟂ contour; the cos φ argument; the update annotated; one hand-checkable step; the 2/a threshold *derived*; three step-size panels; the κ zig-zag; ∇L = 0 ≠ minimum.
- B (supporting, kept small): the saddle picture; the L-smooth assumption line.
- C (pointer only): momentum/Adam, SGD noise, convergence rates.

**Decisions that made it work**
- The worked step uses a *non-isotropic* bowl (θ₁² + 3θ₂²), so the step visibly does **not** aim at the minimum. With a round bowl the example would hide the key difficulty.
- The step-size page derives `(1 − ηa)ᵗ`, and all four regimes fall out of that one line. Three same-scale panels then show them.
- Failure modes are tied to pictures (the saddle, the zig-zag), not listed.
- The quiz asks *why* and *what if* (rescaling θ₂, the one-step η in n-D), never "what is η".

## B. Singular value decomposition (`showcase/svd/`), 4 pages, ~90 min

*Written by a fresh agent that had only this skill (see `tests/evaluation.md`).*

**Conceptual model:** a matrix maps the unit circle to an ellipse → the ⟂ inputs that land on the ellipse's ⟂ axes are vᵢ, the axes are σᵢuᵢ → stacking gives AV = UΣ → A = UΣVᵀ (rotate, stretch, rotate) → AᵀA = V diag(σ²) Vᵀ computes it → the σ's give rank, norm, conditioning, and the best rank-k fit.

**Decisions that made it work**
- The running example is `A = [[2,3],[0,2]]`, found by searching small integer matrices for clean σ's (4, 1) with singular vectors **off** the axes. It is also *not diagonalisable* (eigenvalue 2 twice, one eigenvector), which makes "SVD exists when eigen-decomposition fails" visible.
- The picture shows e₁ (A's only eigenvector) landing *off* the ellipse's axes. That one dashed arrow separates eigenvectors from singular vectors.
- One point is tracked through Vᵀ → Σ → U, with all four panels at the same scale.
- The hand computation ends with three 30-second checks (σ₁σ₂ = |det A|, Σσ² = ‖A‖²_F, u₁ ⟂ u₂) and a rank-1 rebuild of A.
- Page 4 ties σ back to optimisation: the contours of ½‖Ax‖² and GD at the best fixed step (contraction 15/17 = (κ−1)/(κ+1) with κ = 16).

## C. Federated averaging (`showcase/fedavg/`), 4 pages, ~100 min

*Written by a fresh agent that had only this skill (see `tests/evaluation.md`).*

**Conceptual model:** data can't move and communication is expensive → do many local SGD steps, then average with weights p_k = n_k/n → with one local step, averaging is *exactly* a GD step on f → with u > 1 steps, client k's gradients are evaluated along its own path → under non-IID data that path bends toward w_k^* → the average is biased (client drift).

**Decisions that made it work**
- The architecture is a native Excalidraw diagram embedded as transparent SVG, with numbered steps on the arrows. The algorithm is written underneath as pseudo-code mirroring the paper's Alg. 1.
- Paper statements carry gray `§`/`Alg.`/`Fig.` references, and the agent's explanations carry **+**. "Client drift" is credited to SCAFFOLD (2020), not the 2017 paper.
- The derivation shows one local step + n_k/n average = one GD step on f (exact). A second-order expansion then isolates the drift term η²·u(u−1)/2·Σ p_k H_k ∇F_k.
- The worked example uses two 1-D quadratics with **different curvatures**. With equal curvatures the fixed point is unbiased and the example would have shown nothing. It gives w* = 3, one round from w* with u = 2 → 2.97, fixed points 2.91 / 2.68 / 2.39 for u = 2 / 5 / 10, and the limit 2.0 (the mean of the optima, curvature forgotten) as u → ∞.
- IID vs non-IID are drawn as two panels with the same f, the same start, and real GD paths at equal aspect.

## D. Lecture companion (`tests/sessions/adam-lecture/`), 4 pages

*Mode A test: 11 slides on momentum, RMSProp and Adam, with deliberate traps.*
- Dropped: logistics, the history slide, and the bullet-list recap (it became the problem line).
- Kept the lecturer's notation, including `v` used for both the velocity and the second moment, and flagged it with **+**.
- The slide typo `v̂_t = v_t/(1−β₂)` is corrected *visibly*: the + note quotes the slide's version, and a worked table shows the step shrinking to 0.04α at t = 1000.
- The lecturer's claim that "momentum is smoother" was redrawn from real runs: smooth at β = 0.5, overshooting at β = 0.9, which also illustrates the "can overshoot" bullet.

## Small patterns worth reusing

**An annotated update rule**
```latex
\theta_{t+1}=\theta_t\;\underbrace{-\;\eta}_{\text{how far}}\;\underbrace{\nabla L(\theta_t)}_{\text{uphill dir.}}
```
next to a picture where the green arrow *is* `−η∇L`.

**A cause chain instead of definitions**
`different curvatures → unequal gradient components → zig-zag path`

**A margin-reason derivation**
```
L(θ+Δ) ≈ L(θ) + ∇Lᵀ Δ            Taylor, small Δ
∇Lᵀ u = ‖∇L‖ cos φ                slope along unit u
Δ = −η∇L ⇒ L decreases by η‖∇L‖²  choose this step
```

**An honest picture caption**
"2-D cartoon: in high dimensions, saddles vastly outnumber minima."
