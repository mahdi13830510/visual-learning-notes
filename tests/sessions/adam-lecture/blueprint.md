# Momentum and Adam: handwriting blueprint
Level: 2 (learning notes) · Pages: 4 · Total copy time: ~78 min
Mode: lecture companion (source: CS 5xx Optimization for ML, Lecture 7 slides 1–11)

## Page 1: Momentum   (~22 min)
**Purpose:** see why summing past gradients kills the zig-zag across a ravine and speeds up travel along it.
**Layout:** Picture | Math. Ravine diagram left (~55% width), update rule right, two-column derivation strip below, key idea at the bottom.

**Top**
- Title: "Momentum"
- Problem: "in a ravine g points mostly across → SGD zig-zags, crawls along." (gray: slides 2, 4–5)

**Draw (left)**
- Ravine, about half the page width and 6 cm tall. Draw 4 nested ellipses about 4.5× wider than tall, centre right of middle; mark the centre with a green dot labelled "min". Under the figure, a gray arrow pointing right labelled "along valley: small g".
- Start dot ● at the far left, just above the valley floor (upper-left of the 3rd ellipse).
- SGD path (ink): 8 straight segments bouncing up and down across the valley, each bounce slightly smaller, moving right only slowly (ends about halfway to the min). Label "SGD" at the first upper corner.
- Momentum β = 0.5 path (green, thicker): first segment same as SGD (down), then a flatter path that wobbles gently and ends close to the min. Label "momentum β=0.5" under it.
- Momentum β = 0.9 path (red, dashed): wide square-ish swings that run *past* the min and end far to its right. Label "β=0.9" at its end and "overshoots" under it.
- Caption: "same α, 8 steps each, from ●". **+** "real runs, full gradients, α = 0.095, on f = ½(x² + 20y²)".
- Tip: draw the ellipses first, then SGD, then green, then the red dashed path last so it sits on top.

**Write (right)**
- Boxed in blue: `v_t = β v_{t−1} + g_t`, underbrace `β v_{t−1}` "memory"; `w_{t+1} = w_t − α v_t` (slide 4)
- "v_t = velocity: a decaying sum of past gradients. β ≈ 0.9."
- "Intuition: ball rolling downhill, keeps its speed."
- Chain: "across-valley g flips sign → terms cancel in v_t → oscillation damped" (last part green)
- Chain: "along-valley g same sign → terms add up → accelerates" (last part green)
- Red: "too much memory (β = 0.9 here) → overshoots" (slide 4)

**Strip: How big is the step? (slide 6)**
- Left, "constant g_t = g": derivation spine
  - `v_t = g(1 + β + … + β^{t−1})` ← "unroll the recursion, v₀ = 0"
  - `= g (1 − β^t)/(1 − β)` ← "geometric sum"
  - `→ g/(1 − β)` boxed ← "β^t → 0"
  - "effective lr = α/(1 − β); β = 0.9 → 10×" (10× in green)
  - gray check: "v = 1, 1.9, 2.71, 3.44, … → 10 (g = 1)"
- Right, **+** "alternating g_t = (−1)^t g":
  - `v_t = g(1 − β + β² − …)` ← "signs alternate"
  - `|v_t| → |g|/(1 + β)` boxed ← "geometric sum, ratio −β"
  - "β = 0.9: across-valley ×0.53 vs along-valley ×10"
  - "Notice: ratio (1+β)/(1−β) = 19: that is the whole trick."

**Bottom (green box)**
- "Key idea: momentum sums gradients, so consistent directions grow by 1/(1−β) and oscillating ones shrink."

**Must not omit**
- the two boxed limits g/(1−β) and |g|/(1+β): they *are* "cancel vs add up"
- effective lr α/(1−β) (slide 6)
- the overshoot path: momentum can overshoot (slide 4)

## Page 2: RMSProp   (~20 min)
**Purpose:** see how dividing by the running RMS gives every parameter a step of about α, whatever its gradient scale.
**Layout:** Picture | Math (math side wider). Small ravine left, update right, worked-number strip in two columns, limitation line, key idea at the bottom.

**Top**
- Title: "RMSProp"
- Problem: "one α for all parameters, but their gradient sizes differ a lot." (slide 7)

**Draw (left)**
- About 40% page width, 5 cm tall. 3 nested ellipses about 4.5× wider than tall, min (green dot) near the right; label "min".
- Point w_t on the upper-left part of the middle ellipse.
- Ink arrow from w_t almost straight down (slightly right), labelled "−αg".
- Green thicker arrow from w_t diagonally down-right toward the min, labelled "RMSProp".
- Caption: "at w_t, g = (−2, 20): SGD goes almost straight across; RMSProp moves ≈ α in each coordinate". **+** "directions only, lengths not to scale".

**Write (right)**
- Boxed in blue: `s_t = ρ s_{t−1} + (1 − ρ) g_t²`, underbrace g_t² "elementwise"; `w_{t+1} = w_t − α g_t / (√s_t + ε)`, underbrace √s_t "≈ RMS of g"
- gray: "ρ ≈ 0.99, ε = 10⁻⁸"
- **+** "s_t = running average of g² over ≈ 1/(1−ρ) = 100 steps"
- **+** "ε: only stops division by 0"
- Chain: "large |g| → large √s → small effective lr α/√s"
- Chain: "small |g| → small √s → large effective lr"

**Strip: + Worked number**
- Left, "2 parameters, constant g = (2, 20)":
  - `s_t → g² = (4, 400)` ← "average of a constant"
  - `√s_t → (2, 20)`
  - `α g_t/√s_t → α(1, 1)` ← "= α · sign(g)"
  - "Notice: both coordinates move ≈ α: the scale of g drops out."
- Right, "first step, s₀ = 0":
  - `s₁ = 0.01 g²` ← "1 − ρ = 0.01"
  - `√s₁ = 0.1|g|`
  - `α g₁/√s₁ = 10 α · sign(g)` ← red "10× too big"
  - **+** "s starts at 0 → biased low early → fixed by Adam's bias correction (next page)"
- Red, full width: **+** "Limitation: scaling is per coordinate. A ravine at 45° to the axes is not made round."

**Bottom (green box)**
- "Key idea: divide each coordinate by its own gradient RMS, so every parameter steps about α."

**Must not omit**
- the step ≈ α·sign(g) result (gradient scale cancels)
- the 10× first step from s₀ = 0: it motivates bias correction
- the per-coordinate limitation

## Page 3: Adam = Momentum + RMSProp   (~22 min)
**Purpose:** assemble Adam from the two previous pages and understand bias correction.
**Layout:** Derivation spine. Update equations with margin reasons on top; bias-correction derivation left with a small plot right; worked-number table; key idea at the bottom.

**Top**
- Title: "Adam = Momentum + RMSProp"
- Problem: "want smoothed direction and per-parameter scale." (slides 8–9)

**Write: The update (slide 8)**, equations left, reasons in the right margin
- `m_t = β₁ m_{t−1} + (1 − β₁) g_t` ← blue "direction:" "average of g (momentum)"
- `v_t = β₂ v_{t−1} + (1 − β₂) g_t²` ← blue "scale:" "average of g² (RMSProp)"
- `m̂_t = m_t/(1 − β₁^t)`, `v̂_t = v_t/(1 − β₂^t)` (write the exponent t on β₂ in orange) ← "bias correction (t = step count, a power)"
- Boxed in blue: `w_{t+1} = w_t − α m̂_t/(√v̂_t + ε)` ← "≈ α per coordinate, sign from m̂"
- gray: "defaults: α = 10⁻³, β₁ = 0.9, β₂ = 0.999, ε = 10⁻⁸"
- Orange: **+** "slide 8 writes v̂_t = v_t/(1 − β₂); standard (Kingma & Ba) is 1 − β₂^t, matching m̂_t. Missing power → v̂ up to 1000× too big late in training."
- **+** "Notation: v_t here ≠ the velocity v_t of slide 4. With β = β₁: m_t = (1 − β₁)·(slide-4 velocity), same direction, rescaled."

**Write: Why bias correction? (slide 9)**, left ~55%
- `m_t = (1 − β₁) Σ_{i=1}^t β₁^{t−i} g_i` ← "unroll, m₀ = 0"
- `E[m_t] = E[g](1 − β₁) Σ_{i=1}^t β₁^{t−i}` ← orange "assume E[g_i] constant"
- `= E[g] · (1 − β₁^t)` with (1 − β₁^t) boxed ← "geometric sum"
- "→ m_t is shrunk toward 0 by (1 − β₁^t); dividing it out gives E[m̂_t] = E[g]. Same for v_t with g², β₂."

**Draw (right)**
- Small axes, about 6 cm × 4 cm. x-axis "log₁₀ t" with ticks 1, 10, 100, 1000; y-axis "1 − β^t" with a dashed gray line at 1.
- Blue S-curve "β₁ = 0.9": starts at 0.1 at t = 1, reaches ≈ 1 by about t = 40 (just before the "100" tick).
- Orange S-curve "β₂ = 0.999": starts at 0.001 (on the axis), half-way (0.5) near t ≈ 700, ≈ 0.95 at t = 3000.
- Caption: "at t = 1: 0.1 and 0.001. β₁ factor ≈ 1 after ~40 steps; β₂ factor needs ~3000"

**Table: + Worked number, constant g = 2**

| | m_t | v_t | m̂_t | v̂_t | step/α |
|---|---|---|---|---|---|
| t = 1, corrected | 0.2 | 0.004 | 2 | 4 | 1 (green) |
| t = 1, no correction | 0.2 | 0.004 | — | — | 3.16 (red) |
| t = 1000, slide-8 typo | 2.0 | 2.53 | 2 | 2529 | 0.04 (red) |

**Bottom (green box)**
- "Key idea: Adam steps along averaged g, scaled per coordinate; bias correction undoes the zero start."

**Must not omit**
- the exponent t on both corrections (and the + note about slide 8)
- the E[m_t] = E[g](1 − β₁^t) derivation and its assumption
- the β₂ curve: its correction matters for thousands of steps, not "a few"

## Page 4: Side by side & in practice   (~14 min)
**Purpose:** connect each mechanism to the SGD failure it fixes, and record the practical remarks.
**Layout:** Compare columns (as a table), then a short practice list, then Test / Remember side by side.

**Top**
- Title: "Side by side & in practice"
- Problem: "which mechanism fixes which failure of SGD?" (slides 10–11)

**Write: What each method tracks (slide 11)**

| | keeps | fixes | steady step, const. g | + extra memory |
|---|---|---|---|---|
| SGD | nothing | — | αg | 0 |
| Momentum | sum of g | direction (zig-zag) | αg/(1−β) | 1 vector |
| RMSProp | avg of g² | per-parameter scale | ≈ α sign(g) | 1 vector |
| Adam | both + bias corr. | both | ≈ α sign(g) | 2 vectors |

- "Notice:" **+** "momentum's step grows with |g|; RMSProp/Adam steps don't → α in Adam ≈ max step size per coordinate."

**Write: In practice (slide 10)**, dash list
- "works well out of the box; default for transformers"
- red: "sometimes generalizes worse than SGD + momentum" (gray: Wilson et al. 2017)
- "AdamW: decoupled weight decay" (gray: Loshchilov & Hutter 2019)
  - **+** "L2 added to g gets divided by √v̂ → AdamW instead subtracts αλw_t directly"
- "learning-rate warmup often used"
  - **+** "one common reason: early v̂_t averages few gradients → noisy scale"

**Bottom half:** Test your understanding (left), Remember (right). Copy from the sections below.

**Must not omit**
- the "steady step" column: it is the one-line summary of pages 1–3
- AdamW is about *where* weight decay enters, not a new optimizer

## Test your understanding
1. Gradient alternates +g, −g, +g, …. What does momentum's v_t tend to with β = 0.9? Why is that good?
2. Rebuild the steady state g/(1−β) from the recursion. What changes in Adam's m_t?
3. You scale the loss by 100. How does the step change for SGD, momentum, and Adam?
4. Remove bias correction. Is Adam's first step too big or too small, and by how much (β defaults)?
5. A ravine runs at 45° to the axes. Does RMSProp help? Does momentum?

## Remember
- Momentum: cancel what oscillates, add what is consistent (× 1/(1−β)).
- RMSProp: divide by gradient RMS → each parameter steps ≈ α.
- Adam = averaged direction ÷ RMS scale, both bias-corrected by 1 − β^t.
- Bias correction matters early: m₀ = v₀ = 0.

## Beyond the notes (optional)
- Slide 3 history (Polyak 1964 heavy ball, Nesterov 1983, AdaGrad 2011, RMSProp 2012, Adam 2015): left off the pages; Nesterov's look-ahead gradient is the natural next variant to learn.
- AdaGrad = RMSProp with a running *sum* instead of an average of g² (so its step only ever shrinks).
- Next lecture: learning-rate schedules (warmup fits there).
