# Gradient Descent: handwriting blueprint

Level: 2 (learning notes) · Pages: 2 · Total copy time: about 45 min
Mode: concept explorer. **Prompt:** *"Make me visual learning notes on gradient descent: loss landscape, gradient direction, descent direction, update equation, learning rate, and what happens when it is too large or too small."*

Digital version: [`notes.pdf`](notes.pdf) · [live page](https://mahdi13830510.github.io/visual-learning-notes/showcase/gradient-descent/)

---

## Page 1: Gradient Descent   (~24 min)

**Purpose:** see *why* the update rule is $\theta_{t+1}=\theta_t-\eta\nabla L(\theta_t)$, and that it is local and greedy.
**Layout:** Picture | Math. Contour picture on the left (~55% of the width), the "why −∇L" derivation and the boxed update on the right, a worked step across the middle, a saddle strip, and the key idea at the bottom.

**Top**
- Title: "Gradient Descent", underlined.
- Problem: "minimise L(θ), θ ∈ ℝⁿ. We can't see the landscape, only L and ∇L *where we stand*."

**Draw (left, ~9 cm wide)**
- Axes θ₁ (right) and θ₂ (up), crossing at the minimum.
- 4 nested ellipses, wider than tall (about 1.7 : 1, since L = θ₁² + 3θ₂²). Draw the innermost first, then space the others out evenly. Green dot at the centre, labelled "min".
- Point θₜ on the third ellipse, upper right of centre (at (2, 1)).
- A short gray dashed line through θₜ, *tangent* to its ellipse, labelled "tangent".
- **Blue** arrow from θₜ, perpendicular to that tangent and pointing outward, labelled ∇L(θₜ).
- **Green** arrow from θₜ the opposite way, shorter, labelled −η∇L, ending at θₜ₊₁ (1.6, 0.4).
- A faint dotted gray line from θₜ straight to the minimum, labelled "straight to min". It is visibly *not* the green arrow.
- Optional: 4 small green dots continuing the path, curving into the minimum along the θ₁-axis.
- Under the picture: "L = θ₁² + 3θ₂² · each ellipse = one value of L".

**Write (right)**
- `L(θ+Δ) ≈ L(θ) + ∇Lᵀ Δ`, margin: "Taylor, small Δ"
- `∇Lᵀ u = ‖∇L‖ cos φ`, margin: "slope along unit u"
- "φ = 0 → steepest ascent; φ = 90° → slope 0 = along contour (⇒ ⟂)"
- "choose Δ = −η∇L ⇒ L(θ+Δ) ≈ L(θ) − η‖∇L‖²", in green: "goes down if ∇L ≠ 0 and η small enough"
- **Boxed, in blue:** `θₜ₊₁ = θₜ − η ∇L(θₜ)`, with an underbrace under −η: "how far", and one under ∇L(θₜ): "uphill dir."

**Annotate**
- ∇L: direction + rate of fastest *increase*
- minus: go downhill (the green arrow)
- η: how far we trust a *local* slope
- stops when ∇L = 0 (in orange: min, max **or saddle**)
- Notice (blue, under the picture): "∇L ⟂ contour through θₜ, and it does **not** point at the minimum"

**One step by hand (middle strip)**
- `∇L = (2θ₁, 6θ₂)ᵀ, θₜ = (2, 1), η = 0.1`
- `∇L(θₜ) = (4, 6)`
- `θₜ₊₁ = (2, 1) − 0.1·(4, 6) = (1.6, 0.4)` (result in green)
- `L: 7 → 3.04 ✓`
- Notice (orange): "step dir (−4, −6) vs straight to min (−2, −1): the steep θ₂-direction gets a 3× bigger push"
- Chain: "different curvatures → unequal gradient components → curved / zig-zag path (p. 2)"

**Where it stops (bottom strip)**
- Small picture (~4 cm): the saddle L = θ₁² − θ₂². Two pairs of hyperbola-like contour curves (one pair opening left/right, one up/down), a dot at the origin labelled "∇L = 0", a gray arrow right labelled "up", and a red arrow up labelled "down".
- Next to it: "saddle: start exactly on the θ₁-axis and GD never leaves it; noise escapes" · "local min (non-convex L): GD stays, no global guarantee" · "plateau: ∇L ≈ 0 far from any min → tiny steps".
- Orange: "Important assumption for 'GD finds *the* min': L convex (+ suitable η)".

**Key idea (boxed, green, at the bottom)**
"−∇L is the fastest decrease *right here*. GD is greedy and local; it is **not** the shortest path to the minimum."

**Must not omit**
- ∇L ⟂ contour, and why (the cos φ argument)
- the update rule with the *minus sign* tied to the green arrow
- the worked step, showing L decreasing *and* the step not aiming at the minimum
- ∇L = 0 can be a saddle

---

## Page 2: Step size η & when GD struggles   (~21 min)

**Purpose:** know exactly which η works and why, and why badly scaled problems are slow.
**Layout:** a derivation spine at the top, three small panels in a row, then a picture | text row for the n-D case, and Remember and the quiz at the bottom.

**Top: 1-D derivation (left) + condition (right)**
- `L(θ) = (a/2)θ²,  L′(θ) = aθ`, margin: "curvature a > 0"
- `θₜ₊₁ = θₜ − ηaθₜ = (1 − ηa) θₜ`, margin: "plug into update"
- `θₜ = (1 − ηa)ᵗ θ₀`, margin: "unroll"
- Right, boxed in blue: "converges ⟺ |1 − ηa| < 1 ⟺ 0 < η < 2/a"
- Cases, as a short list: ηa < 1 monotone · ηa = 1 one step · 1 < ηa < 2 (orange) overshoots, but oscillates inward · ηa > 2 (red) overshoots more each step → diverges

**Draw (three panels, each ~5.5 cm wide, same parabola)**
- Panel 1 (orange): θ₀ high on the right branch; 6 short arrows creeping down the same side. Caption: "ηa = 0.15: too small → crawls".
- Panel 2 (green): θ₀ at the same place; one long arrow almost to the bottom, then a tiny one. Caption: "ηa = 0.7: good → fast".
- Panel 3 (red): θ₀ near the bottom on the right; arrows jumping across to the left branch, *higher* each time (factor −1.2). Caption: "ηa = 2.2: too large → |θ| grows ×1.2 per step".
- Tip: draw the three parabolas first, all the same size.

**n-D (picture left ~8 cm, text right)**
- Picture: 4 long thin ellipses (about 3 : 1), a green min at the right, a red zig-zag path from the upper left that bounces across the narrow direction and creeps along the long one. Red label on top: "steep θ₂: flips sign, ×(−0.8)"; gray label on the bottom: "flat θ₁: shrinks only ×0.82". Caption: L = ½(θ₁² + 10θ₂²), η = 0.18.
- Text: `L = ½ θᵀHθ`, eigenvalues λ_min … λ_max; "each eigen-direction is the 1-D case with a = λᵢ"; "stability needs η < 2/λ_max (steep dir.)"; "slowest factor: 1 − ηλ_min (flat dir.)".
- Blue "So:": speed is set by κ = λ_max/λ_min; big κ → zig-zag across the valley, crawl along it.
- Orange assumption: behind "η < 2/L" in general is L-smoothness (curvature ≤ L everywhere).
- Small gray line: fixes for big κ are momentum, Adam, and preconditioning (beyond these notes).

**Must not omit**
- θₜ = (1 − ηa)ᵗθ₀ and the 2/a threshold, *derived*, not just stated
- the three-panel picture
- the λ_max limits η, λ_min sets speed → κ

---

## Test your understanding
1. Why must the gradient be perpendicular to the contour line? Answer with the cos φ argument.
2. For L = (a/2)θ², which η reaches the minimum in one step? Why does that trick fail in n-D when λ_max ≠ λ_min?
3. You double the scale of θ₂ (a change of units). What happens to κ, the zig-zag, and the largest stable η?
4. GD stopped with ∇L = 0. Name three things this point could be, and say how you would tell them apart.

## Remember
- ∇L ⟂ contours; −∇L = steepest *local* descent.
- 1-D: θₜ = (1 − ηa)ᵗθ₀ → need η < 2/a.
- The steepest curvature caps η and the flattest sets the speed: κ matters.

## Beyond the notes
Stochastic gradients (noise helps escape saddles); momentum and Nesterov; Adam as diagonal preconditioning; line search; the convergence rate O((1 − 1/κ)ᵗ) for strongly convex L.
