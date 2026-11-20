# Singular value decomposition: handwriting blueprint
Level: 2 (learning notes) · Pages: 4 · Total copy time: ~90 min
Mode: concept explorer

Spine: object → decomposition → computation → interpretation/use.
Running example on every page: `A = [[2, 3], [0, 2]]`, with `σ₁ = 4, σ₂ = 1`, `v₁ = (1,2)/√5, v₂ = (−2,1)/√5`, `u₁ = (2,1)/√5, u₂ = (−1,2)/√5`. Its eigenvalues are 2, 2 with a single eigenvector `e₁`, so eigendecomposition fails but the SVD works.
Colours: blue = singular vectors and the main objects, gray = scaffolding and the tracked point e₁, red = warnings and failure, orange = assumptions, green = key idea and conclusions.

## Page 1: A matrix is a transformation   (~18 min)
**Purpose:** see that A maps the unit circle to an ellipse, and that the singular vectors and values are that ellipse's geometry.
**Layout:** Before → after. A full-width two-panel figure on top, then two columns (equations | extremes), then a two-line derivation strip and the key idea at the bottom.

**Top**
- Title: "A matrix is a transformation"
- Problem: "What does A do to space? Eigenvectors can't say in general: too few, not ⟂, none if m ≠ n."

**Draw (full width, about 4 cm tall)**
- Left panel: faint cross axes, unit circle with radius about 1 cm. Blue arrow `v₁` toward (0.45, 0.89), so about 63° from the x-axis. Blue arrow `v₂` toward (−0.89, 0.45), so 90° further on. Small right-angle mark between them. Gray dashed arrow `e₁` to (1, 0). Under it write "unit circle (inputs)".
- Middle: a curved arrow left → right, with `A = [2 3; 0 2]` written above it.
- Right panel, same scale (1 unit = 1 cm): ellipse with semi-axes 4 cm and 1 cm, long axis tilted about 27° up to the right. Drawing tip: draw the tilted long-axis line first (it goes through (2, 1)-ish per unit), mark ±4 cm along it and ±1 cm across it, then draw the ellipse through the four marks. It reaches x = ±3.6 and y = ±2.
- On the ellipse: blue arrow along the long semi-axis labelled `σ₁u₁ = Av₁`, blue arrow along the short semi-axis (up-left) labelled `σ₂u₂ = Av₂`, right-angle mark. Gray dashed arrow from the centre to (2, 0) labelled `Ae₁ = 2e₁`.
- Caption under the figure: "Notice: the ⟂ pair v₁, v₂ lands on the ⟂ axes. e₁ (A's only eigenvector) stays on its line but is no axis."

**Write (left column)**
- Boxed (blue): `A vᵢ = σᵢ uᵢ,  i = 1, 2`
- `vᵢ`: input directions, orthonormal (in ℝⁿ)
- `uᵢ`: axis directions of the ellipse, orthonormal (in ℝᵐ)
- `σᵢ ≥ 0`: semi-axis lengths = how much A stretches vᵢ
- gray: "here σ₁ = 4, σ₂ = 1 (p.3)"

**Write (right column)**
- `σ₁ = max_{‖x‖=1} ‖Ax‖`, attained at `x = v₁`
- `σ₂ = max_{‖x‖=1, x⊥v₁} ‖Ax‖`
- Intuition: "v₁ = direction A amplifies most; v₂ = best of what's left". "In 2-D, σ₂ is also the min stretch."

**Derivation strip**
- `A [v₁ v₂] = [u₁ u₂] diag(σ₁, σ₂)`, with underbraces V, U, Σ. Margin: "stack the two columns: AV = UΣ"
- Boxed: `A = U Σ Vᵀ`. Margin: "multiply by Vᵀ on the right; V orthogonal ⇒ VVᵀ = I" (the last part in orange)

**Annotate**
- Orange: "2-D cartoon. For A ∈ ℝ^{m×n}: unit sphere in ℝⁿ → ellipsoid in ℝᵐ with r = rank A non-zero axes."
- Green box at the bottom (key idea): "Every matrix turns the unit circle into an ellipse. The vᵢ are the ⟂ inputs that land on its ⟂ axes σᵢuᵢ."

**Must not omit**
- The two panels at the same scale, so the 4 : 1 stretch is visible.
- Right angles at both the v pair and the u pair.
- e₁ ↦ 2e₁ drawn and labelled as an eigenvector that is not an axis.
- The step AV = UΣ ⇒ A = UΣVᵀ, and that it needs V orthogonal.

## Page 2: A = UΣVᵀ: rotate, stretch, rotate   (~26 min)
**Purpose:** know what each factor does geometrically and as shapes, and which singular vectors span which subspace.
**Layout:** Pipeline strip on top, then Picture | Math (equations left, shape diagram right), a two-column assumptions/caveats row, four cause chains, and the key idea.

**Top**
- Title: "A = UΣVᵀ: rotate, stretch, rotate"
- Problem: "Any A is three simple moves. Which factor does what?"

**Draw (full-width strip, about 3.5 cm tall, all panels at the same scale, 1 unit ≈ 0.6 cm)**
1. Unit circle with blue `v₁`, `v₂` (as on p.1) and a gray dot at (1, 0). Under it: "inputs x".
2. Arrow labelled `Vᵀ` → the same circle with blue arrows now on the axes, labelled `e₁`, `e₂`. Gray dot at (0.45, −0.89). Under it: "v's now on the axes".
3. Arrow labelled `Σ` → axis-aligned ellipse, 4 wide and 1 tall (semi-axes). Blue `σ₁e₁` to (4, 0), `σ₂e₂` to (0, 1). Gray dot at (1.79, −0.89). Under it: "stretched ×4 and ×1".
4. Arrow labelled `U` → the tilted ellipse from p.1 with `σ₁u₁`, `σ₂u₂`. Gray dot at (2, 0), labelled `Ax`. Under it: "turned onto the u's".
- Caption: "same scale in all panels · gray dot x = e₁ ends at (2, 0) = first column of A ✓"
- Tip: draw the four centres first, evenly spaced, leaving the third panel the widest (8 units).

**Write (left)**
- `Ax = U Σ Vᵀx` with underbraces: U = "write along uᵢ", Σ = "scale by σᵢ", Vᵀx = "read along vᵢ"
- Why?: "row i of Vᵀ is vᵢᵀ, so (Vᵀx)ᵢ = vᵢᵀx"
- Boxed (blue): `A = Σᵢ₌₁ʳ σᵢ uᵢ vᵢᵀ`,  `Ax = Σᵢ σᵢ uᵢ (vᵢᵀx)`
- Note: "each term: read x along vᵢ → scale by σᵢ → write along uᵢ"

**Draw (right, about 6 cm wide): shapes for a tall A (m > n)**
- Rectangles to proportion: A (narrow, tall, m×n) = U (square m×m, first n columns hatched blue, labelled "first n cols") · Σ (m×n: a blue diagonal in the top n×n square, dashed line, "0" below) · Vᵀ (small square n×n). Write dimensions in gray under each one.
- Notes: "Σ is m×n: diagonal on top, zeros below." "Thin SVD: zero rows kill all but n columns of U → keep Uₙ ∈ ℝ^{m×n}."

**Two-column row**
- Orange, "Important assumptions": `UᵀU = I_m, VᵀV = I_n` (orthogonal: rotations or reflections); `σ₁ ≥ σ₂ ≥ … ≥ σ_r > 0`, rest 0; exists for **every** matrix.
- Red, "Watch out (not unique)": `(uᵢ, vᵢ) → (−uᵢ, −vᵢ)` is also valid; equal σ's fix only their span (A = I: any V); `det A < 0` ⇒ U or V contains a reflection.

**Chains (section 4, "Rank r: the singular vectors split both spaces")**
- `v₁…v_r` → stretched by σᵢ > 0 → span the row space
- `v_{r+1}…v_n` → σ = 0, crushed to 0 → span N(A)
- `u₁…u_r` → axes of the image ellipsoid → span the column space
- `u_{r+1}…u_m` → never reached by any Ax → span N(Aᵀ)
- Note: "Ax = b solvable iff b ⊥ u_{r+1}, …, u_m; adding any mix of v_{r+1..n} to x gives the same Ax."

**Annotate**
- Green key idea: "Vᵀ reads x in the input axes vᵢ, Σ scales each reading on its own, U writes the results along the output axes uᵢ."

**Must not omit**
- The right-to-left order (Vᵀ acts first).
- The tracked point ending at (2, 0): the check that the pipeline really is A.
- Σ is m×n, not square, and the thin SVD.
- Non-uniqueness (signs, equal σ's).

## Page 3: Computing the SVD by hand   (~22 min)
**Purpose:** derive why V and Σ come from AᵀA, then compute the running example completely and check it.
**Layout:** Derivation spine (math left, reasons in the margin), a second spine for the example, then a check column beside a small grid figure, the rank-1 rebuild, a red warning, and the key idea.

**Top**
- Title: "Computing the SVD by hand"
- Problem: "Two unknown rotations at once. Trick: form AᵀA, which makes U cancel."

**Write: derivation spine (section 1, "Remove U")**
- `AᵀA = (UΣVᵀ)ᵀ(UΣVᵀ)`. Margin: "start from the factorisation"
- `= V Σᵀ (UᵀU) Σ Vᵀ`, underbrace UᵀU = I. Margin: "(XY)ᵀ = YᵀXᵀ; U orthogonal" (orange)
- `= V diag(σᵢ²) Vᵀ`. Margin: "an eigendecomposition of the symmetric PSD AᵀA"
- Boxed: `AᵀA vᵢ = σᵢ² vᵢ,  uᵢ = Avᵢ / σᵢ`. Margin: "vᵢ = eigenvectors, σᵢ = √λᵢ; uᵢ from p.1 (σᵢ > 0)"

**Write: worked example (section 2), A = [2 3; 0 2]**
- `AᵀA = [4 6; 6 13]`. Margin: "column dot products: 4+0, 6+0, 9+4"
- `λ² − 17λ + 16 = 0 ⇒ λ = 16, 1`. Margin: "trace 17, det 52 − 36 = 16"
- `σ₁ = 4, σ₂ = 1`
- `[−12 6; 6 −3] v₁ = 0 ⇒ v₁ = (1,2)/√5, v₂ = (−2,1)/√5` (blue). Margin: "AᵀA − 16I; v₂ = v₁ turned 90°"
- `u₁ = ¼ · (8,4)/√5 = (2,1)/√5,  u₂ = (−1,2)/√5` (blue). Margin: "uᵢ = Avᵢ/σᵢ, so the signs match"

**Check it (section 3, left)**
- `σ₁σ₂ = 4 = |det A| = |2·2 − 3·0|` ✓
- `σ₁² + σ₂² = 17 = 2² + 3² + 0² + 2²` ✓
- `u₁ ⊥ u₂: 2·(−1) + 1·2 = 0` ✓
- Red Notice: "eigenvalues of A are 2, 2 with one eigenvector e₁: not diagonalisable, yet the SVD exists. And σ ≠ |λ|."

**Draw (right, about 6 × 3.5 cm)**
- Integer grid, 1 square = 0.5 cm, from x = −2 to 8 and y = 0 to 4. Gray dashed arrows (1, 2) and (−2, 1). Blue arrows (8, 4), labelled "(8,4) = 4·(2,1)", and (−1, 2).
- Caption: "all ×√5. Gray = √5 vᵢ, blue = √5 Avᵢ: 4× longer, same length, still ⟂"

**Write: rebuild (section 4)**
- `4·(1/5)[2 4; 1 2] + 1·(1/5)[2 −1; −4 2] = (1/5)[10 15; 0 10] = [2 3; 0 2]` ✓, with underbraces σ₁u₁v₁ᵀ and σ₂u₂v₂ᵀ
- Note: "u₁v₁ᵀ = column (2,1) times row (1,2), divided by √5·√5 = 5"

**Annotate**
- Red, Common mistake: "taking uᵢ as eigenvectors of AAᵀ separately → signs can disagree and UΣVᵀ ≠ A. Use uᵢ = Avᵢ/σᵢ."
- Green key idea: "AᵀA forgets the output rotation: its eigenvectors are the vᵢ and its eigenvalues are σᵢ². Then A itself hands you each uᵢ."

**Must not omit**
- The cancellation UᵀU = I (it is the whole trick).
- The three hand checks (det, Frobenius, orthogonality).
- The rebuild to the original A.
- A is not diagonalisable, yet it has an SVD.

## Page 4: What the singular values tell you   (~24 min)
**Purpose:** read rank, norm, conditioning, and compressibility off the σ's, and tie σ to optimisation (GD speed) and ML (low rank).
**Layout:** Picture | Math (contour figure left, σ table right), then Eckart–Young (equation left, small figure right), a failure chain, and Test + Remember side by side at the bottom.

**Top**
- Title: "What the singular values tell you"
- Problem: "Which numbers of A decide its rank, size, stability and compressibility?"

**Draw (left, about 6 × 5 cm): contours of f(x) = ½‖Ax‖²**
- Gray axes. Five nested ellipses centred at the origin, long axis along v₂ (up-left, about 153°), short axis along v₁. The width ratio is 4 : 1, because the half-widths are ∝ 1/σᵢ. Tip: draw the v₂ line first, then the innermost ellipse, then the larger ones evenly spaced.
- Short blue arrows from the origin: `v₂ (σ₂ = 1)` along the valley, `v₁ (σ₁ = 4)` across it. Labels outside the contours.
- Green dot at the minimum (origin).
- Red zig-zag: about 6 GD steps starting at x₀ in the lower right on the outer contour, bouncing across the valley toward the origin.
- Caption: "contours of ½‖Ax‖² for our A; GD with the best fixed step η = 2/17"

**Write (right): the σ dictionary (table: quantity | in σ's | our A)**
- rank | #{σᵢ > 0} | 2
- ‖A‖₂ (max stretch) | σ₁ | 4
- ‖A‖_F² | Σσᵢ² | 17
- |det A| (square) | Πσᵢ | 4
- κ(A) | σ₁/σₙ | 4
- Hessian AᵀA of f | eigenvalues σᵢ², κ = κ(A)² | 16
- Note: "contour axes lie along the vᵢ; half-widths ∝ 1/σᵢ"
- Chain: `σ₂ ≪ σ₁ → long valley along v₂, κ = 16 → GD zig-zags; error shrinks only ×(κ−1)/(κ+1) = 15/17 per step` (last part in red)

**Write (section 3, Eckart–Young)**
- Boxed (blue): `A_k = Σᵢ₌₁ᵏ σᵢuᵢvᵢᵀ,  ‖A − A_k‖₂ = σ_{k+1}`
- "no rank-k matrix is closer (Frobenius: error² = Σ_{i>k} σᵢ²)"
- "ours: A₁ = [1.6 3.2; 0.8 1.6], error = σ₂ = 1"
- Chain: "fast σ decay → few terms suffice → PCA, low-rank weights, LoRA-style compression"

**Draw (right of section 3, about 5 × 3 cm)**
- Gray dashed tilted ellipse (as on p.1). A thick green segment along its long axis from −4u₁ to +4u₁, labelled "A₁: segment". A red dashed arrow from the centre along u₂ of length 1, labelled "σ₂u₂ lost".
- Caption: "A₁ squashes the ellipse onto its long axis; what's lost is σ₂u₂"

**Annotate**
- Red failure chain (full width): "A⁻¹ = VΣ⁻¹Uᵀ → noise along uₙ is multiplied by 1/σₙ → tiny σₙ blows up solutions → truncate or regularise"

**Must not omit**
- The contour long axis lies along v₂ (the small σ), not along v₁.
- κ(AᵀA) = κ(A)²: squaring is why normal equations and GD on least squares suffer.
- Eckart–Young with its error = σ_{k+1}.

## Test your understanding
1. What are the singular values of 3A, Aᵀ and A⁻¹? Where do the uᵢ and vᵢ go?
2. Why is e₁, the eigenvector of A, not an axis of the ellipse? When do eigenvectors and singular vectors coincide?
3. Let σ₂ → 0. What happens to the ellipse, the rank, κ, and GD on f?
4. From the circle → ellipse picture alone, rebuild A = UΣVᵀ. Which step needs V orthogonal?

## Remember
- A maps the unit sphere to an ellipsoid; the vᵢ land on its axes σᵢuᵢ.
- UΣVᵀ = rotate, stretch along the axes, rotate; it exists for every matrix.
- The σ's are A's honest sizes: ‖A‖₂ = σ₁, rank = #σ > 0, κ = σ₁/σₙ.
- Truncating the sum gives the best rank-k fit, with error σ_{k+1}.

## Beyond the notes (optional)
- Pseudoinverse A⁺ = VΣ⁺Uᵀ and least squares; ridge as the filter σ/(σ² + λ).
- PCA = SVD of the centred data matrix; the vᵢ are the principal directions.
- Numerically, SVD is computed without forming AᵀA (Golub–Kahan bidiagonalisation), because AᵀA squares κ.
- Polar decomposition A = (UVᵀ)(VΣVᵀ).
