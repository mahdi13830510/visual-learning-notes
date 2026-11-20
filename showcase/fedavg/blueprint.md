# Federated Averaging (FedAvg): handwriting blueprint
Level: 2 (learning notes) · Pages: 4 · Total copy time: ~100 min
Mode: concept explorer (paper: McMahan, Moore, Ramage, Hampson, Agüera y Arcas, "Communication-Efficient Learning of Deep Networks from Decentralized Data", AISTATS 2017)

Notation, used on every page: K clients, client k holds index set P_k with n_k examples, n = Σ n_k, p_k = n_k/n. Global model w_t, client model after the round w^k_{t+1}, local iterate w^k_{t,s}, local steps per round u_k = E·n_k/B. Gray "§2 / Alg. 1 / Fig. 1" = where it is in the paper. Orange **+** = my explanation, not the paper's.

## Page 1: FedAvg: one round   (~24 min)
**Purpose:** see the whole protocol (who holds what, what travels, what each step computes) well enough to write the loop.
**Layout:** Pipeline strip. Architecture diagram across the full width (top ~40%), then algorithm left (~55%) | knobs right, one cause chain, key idea boxed at the bottom.

**Top**
- Title: "FedAvg: one round"
- Problem: "Train one model on data spread over K devices. Data can't leave them, and every communication round is expensive."
- Small gray line: "McMahan et al., AISTATS 2017 · gray refs = where in the paper · + = mine"

**Draw (full width)**
- Server box centred at the top, about 1/3 page wide: "server / holds global model w_t".
- Four client boxes in a row along the lower edge of the diagram, about 1/5 page wide each: "client 1 / D₁ : n₁ examples", "client 2 / D₂ : n₂ examples", "client 3 / not sampled" (gray, dashed outline, no arrows), "…", "client k / D_k : n_k examples".
- For clients 1, 2, k draw a pair of curved arrows bowing apart like a lens (so they never cross): solid blue arrow server → client labelled "w_t"; dashed green arrow client → server labelled "w¹_{t+1}", "w²_{t+1}", "w^k_{t+1}".
- Step labels with circled numbers: top-left "① sample S_t: m = max(C·K, 1) clients"; in the gap above client 3 "② down: w_t" (blue) and "④ up: w^k_{t+1}" (green); under clients 1–2 "③ ClientUpdate on local data only: E epochs of SGD, minibatch B, step η"; top-right in green "⑤ aggregate, weighted by data size: w_{t+1} = Σ_{k∈S_t} (n_k/n_S) w^k_{t+1}, n_S = Σ_{k∈S_t} n_k"; under clients 3–k in orange "raw data never leaves a client; only model weights travel".
- Drawing tip: boxes first, then the lens-shaped arrow pairs, then labels. Keep 1–2 cm between boxes so the arrow labels fit.

**Write (left): Algorithm 1**
```
Server: initialise w_0; for each round t = 0, 1, 2, …
    m ← max(C·K, 1);  S_t ← random set of m clients
    for k ∈ S_t in parallel:  w^k_{t+1} ← ClientUpdate(k, w_t)
    w_{t+1} ← Σ_{k∈S_t} (n_k / n_S) w^k_{t+1},   n_S = Σ_{k∈S_t} n_k
ClientUpdate(k, w):   — runs on device k
    split P_k into batches of size B
    for each local epoch 1…E: for each batch b:
        w ← w − η ∇ℓ(w; b)          (blue)
    return w to the server
```
- Margin note (orange +): "paper's Alg. 1 writes Σ_{k=1}^K n_k/n; with a sample S_t renormalise by n_S so weights sum to 1".

**Write (right): three knobs**
- Small table: `C` fraction of clients per round · `E` local epochs per round · `B` local minibatch (B = ∞: whole P_k).
- `u_k = E n_k / B`  "local steps per round".
- "FedSGD is the case E = 1, B = ∞: one full-batch gradient per client per round. The baseline. §2"

**Annotate**
- "What travels? w_t down, w^k_{t+1} up (and n_k). Never data."
- Orange "Important assumption: every client starts the round from the same w_t. Averaging nets trained from different inits fails (Fig. 1)."
- Chain across the page: "more local work (E↑, B↓) → more progress per round → fewer rounds (paper: 10–100× fewer than FedSGD in its experiments) → but on non-IID data, more local work = more drift (pp. 2–4)", the last link in red.

**Key idea (boxed, green):** "Trade cheap local computation for expensive communication: many local SGD steps, then one data-size-weighted average."

**Must not omit**
- Only weights (and n_k) travel; the data stays on the client.
- The server's average is weighted by n_k, renormalised over the sampled set.
- Every sampled client starts from the same w_t.
- u_k = E n_k / B, and FedSGD is the case E = 1, B = ∞.

## Page 2: Why averaging models optimises f   (~30 min)
**Purpose:** derive why a weighted average of client models is exactly a GD step on the global loss for one local step, and find the term that breaks it for more.
**Layout:** Picture | Math on top (figure left ~45%, derivation spine right), then FedAvg update left | implementation notes right, then a full-width 2nd-order expansion.

**Top**
- Title: "Why averaging models optimises f"
- Problem: "The server averages weights. When is that the same as descending the global loss?"

**Draw (left, ~45% width, ~6 cm tall)**
- Dot w_t near the bottom centre. Two blue arrows from it: up-left to w¹ (labelled −η∇F₁), right and less steep to w² (labelled −η∇F₂).
- Dashed gray segment w¹–w². Green dot w_{t+1} on it, **¾ of the way from w¹ to w²**. Green arrow w_t → w_{t+1}, labelled −η∇f.
- Two small gray braces above the segment: the long part w¹…w_{t+1} labelled "∝ n₂", the short part w_{t+1}…w² labelled "∝ n₁".
- Caption: "2 clients, n₁ : n₂ = 1 : 3. The average sits ¾ of the way to w²: the bigger client pulls harder."
- Under it: "Numbers: n₁ = 100, n₂ = 300, w¹ = 2, w² = 6 ⇒ w_{t+1} = ¼·2 + ¾·6 = 5 (plain mean: 4)", the last bracket in red.

**Write (right): derivation spine, reasons in the margin**
- `f(w) = (1/n) Σ_{i=1}^n f_i(w) = Σ_k (n_k/n) F_k(w)`, underbrace n_k/n as p_k  ← "group the n examples by client"
- `F_k(w) = (1/n_k) Σ_{i∈P_k} f_i(w)`  ← "client k's own average loss"
- `∇f(w_t) = Σ_k p_k ∇F_k(w_t)`  ← "∇ is linear"
- `w_{t+1} = w_t − η Σ_k p_k ∇F_k(w_t)`  ← "one GD step on f (FedSGD)"
- `  = Σ_k p_k (w_t − η∇F_k(w_t))`  ← "uses Σ_k p_k = 1"
- `  = Σ_k p_k w^k_{t+1}` (green)  ← "= average of one-step local models. Exact."

**Write (lower left): FedAvg, u_k local steps**
- `w^k_{t,s+1} = w^k_{t,s} − η g_k(w^k_{t,s}),  w^k_{t,0} = w_t`
- `w_{t+1} = w_t − η Σ_k p_k Σ_{s=0}^{u_k−1} g_k(w^k_{t,s})`; underbrace the inner sum "gradients along client k's own path"; write `w^k_{t,s}` in red.
- Note: "g_k: minibatch gradient of F_k. For s ≥ 1 the point w^k_{t,s} ≠ w_t, and it moves toward client k's optimum."
- Red: "→ only the first local step is a GD step on f. Small ηu_k: ≈ u_k steps on f; large: drift."

**Write (lower right): Implementing it**
- "flatten all parameters into one vector w"
- "or send updates Δ_k = w^k − w_t: then w_{t+1} = w_t + Σ_k p_k Δ_k"
- "clients must report n_k; server never sees P_k"
- "local optimiser: plain SGD, same η everywhere, restarted from w_t each round"
- "to test drift: split data by label (non-IID) vs shuffle (IID)"
- Red "Common mistake: uniform 1/|S_t| average minimises (1/K) Σ_k F_k: every client counts equally, not every example. Differs when n_k are unequal."

**Write (full width): 5 · Where the bias comes from (orange +)**
- `g_k(w^k_{t,s}) ≈ ∇F_k(w_t) + H_k (w^k_{t,s} − w_t),   w^k_{t,s} − w_t ≈ −η s ∇F_k(w_t)`  ← "Taylor, H_k = ∇²F_k(w_t); 1st-order path; full-batch"
- `Σ_k p_k Δ_k ≈ −ηu ∇f(w_t) + η² (u(u−1)/2) Σ_k p_k H_k ∇F_k(w_t)`; underbrace the first term "u GD steps on f", the second (red) "drift: each client's curvature × its own gradient"  ← "sum over s = 0…u−1, all u_k = u"
- Note: "at w*: ∇f = 0, but the red term ≠ 0 unless all H_k are equal or all ∇F_k(w*) = 0 → FedAvg steps away from w*. Check p. 4, u = 2: 0.01·(½·1·3 + ½·3·(−3)) = −0.03, so 3 → 2.97 ✓"

**Key idea (boxed, green):** "Weights p_k = n_k/n make the average exactly a GD step on f, but only for one local step. More steps evaluate gradients away from w_t."

**Must not omit**
- Σ p_k = 1 is what turns "average of models" into "step on f".
- The FedAvg update sums gradients at the client's own iterates, not at w_t.
- The drift term is second order in η and needs heterogeneous H_k ∇F_k.
- n_k-weighting vs uniform weighting minimise different objectives.

## Page 3: Client data and client drift   (~20 min)
**Purpose:** see, on one picture with true geometry, that non-IID clients pull the averaged model off the path of f, while IID clients don't.
**Layout:** Compare columns (two panels at the same scale), then cause chain left | kinds of non-IID right, key idea at the bottom.

**Top**
- Title: "Client data and client drift"
- Problem: "We minimise f = Σ_k p_k F_k, but client k only ever sees F_k. If F_k ≠ f, its local steps head somewhere else."

**Draw (two panels side by side, each ~half width, ~6 cm tall, SAME axes w₁, w₂ and same scale, equal units on both axes)**
- Both panels: two gray circles around w* (green dot, upper right of centre; radii about 1 cm and 1.7 cm). Black dot w_t below w*, near the bottom. Gray dashed path from w_t almost straight up to a gray dot just short of w* = "5 GD steps on f".
- Left panel "IID split": two blue paths (one solid, one dashed) from w_t that hug the gray path and end next to its end. Green dot w_{t+1} on the gray end point, labelled with a short leader line from the lower left.
- Right panel "Non-IID split": small blue ellipse at the top-left corner around w₁* (wider than tall); small dashed blue ellipse at the lower right around w₂* (taller than wide).
  - Client 1 (solid blue): from w_t go **up first, then curve left** to w¹ (upper left, about halfway to w₁*).
  - Client 2 (dashed blue): from w_t go **almost flat to the right** to w², just below-left of w₂*.
  - Dotted gray line w¹–w²; red dot w_{t+1} at its midpoint, left of and below the gray end point. Short red segment from w_{t+1} to the gray end point, labelled "drift". Label w_{t+1} with a leader from the lower left.
- Drawing tip: draw w* and its circles first, then w_t and the gray path; place the red midpoint last by eye halfway along the dotted line.
- Under each panel: left `E_{P_k}[F_k(w)] = f(w)`; right `w_k* = argmin F_k ≠ w* = argmin f`.

**Annotate**
- Left: "every client sees a shuffled sample → F_k ≈ f → both paths follow f; w_{t+1} lands on the end of the gray path. §2"
- Right: "each path bends toward its own w_k*. The average misses (red) where u steps on f would go."
- Gray line under both: "Same f, same w_t, η = 0.1, u = 5 local GD steps; only the split differs. + 2-D quadratic cartoon: real losses are non-convex, the mechanism is the same."

**Write (lower left): Why drift happens (orange +)**
- Chain: "non-IID → ∇F_k(w) ≠ ∇f(w) → u_k steps follow F_k, curve toward w_k* → Δ_k biased → average lands off the path of f, even when started at w* (p. 4)", last link red.
- `ζ²(w) = Σ_k p_k ‖∇F_k(w) − ∇f(w)‖²`
- Note: "heterogeneity: how much clients disagree about the downhill direction. ζ = 0 at every w → no drift. Drift grows with ζ and with ηu_k."
- Gray: "'client drift' is the later name (Karimireddy et al. 2020, SCAFFOLD); the 2017 paper doesn't use it."

**Write (lower right): Kinds of non-IID**
- "label skew: client sees few classes. Paper's 'pathological' MNIST: sort by digit, 200 shards of 300, 2 shards per client. §3"
- "quantity skew: unbalanced n_k → weights p_k matter."
- "+ feature skew: same labels, different inputs (handwriting, cameras)."
- Orange "Notice: the paper reports FedAvg still trains well on its pathological split. Drift slows and biases it; it need not break it. Very large E can plateau or diverge; the authors suggest decaying local work. §3"

**Key idea (boxed, green):** "Drift = each client descends its own F_k for many steps; averaging the end points is not descending f."

**Must not omit**
- Both panels share f, w_t, η, u; only the data split differs.
- Non-IID paths curve toward each client's own optimum; the average misses the end of the f-path.
- Heterogeneity is a property of the gradients ∇F_k vs ∇f, not just of the labels.

## Page 4: Worked example: the average misses w*   (~25 min)
**Purpose:** check by hand that FedAvg with many local steps converges to the wrong point, and see exactly how the error depends on u.
**Layout:** Picture | Math on top (plot left ~55%, setup right), then one-round table left | fixed point right, "what changes", then Test and Remember side by side at the bottom.

**Top**
- Title: "Worked example: the average misses w*"
- Problem: "Two clients, different optima. Does FedAvg converge to the global optimum? +"

**Draw (left, ~55% width, ~7 cm tall)**
- Horizontal w-axis with marks c₁ = 0, 2, 3, c₂ = 4 (spacing ~1.2 cm per unit, axis from −1 to 6).
- F₁ = ½w² (solid blue, wide parabola, min at 0). F₂ = (3/2)(w − 4)² (dashed blue, narrow, min at 4). f = ½F₁ + ½F₂ (black, thicker, min at w = 3, height 3).
- Green dot on f at (3, 3), dashed green drop line to the axis, label "w* = 3".
- Red dot on f at (2, 4), dashed red drop line, label "mean of optima = 2" to its left.
- Under the axis from the point 3: solid blue arrow left labelled "client 1", dashed blue arrow right labelled "client 2", gray "pull at w*" under the start.
- Drawing tip: mark the axis first, then the three minima; draw F₂ about 3× narrower than F₁.
- Caption: "at w*: F₁′(3) = +3, F₂′(3) = −3. They cancel only in the average; each client alone still wants to move."

**Write (right): Setup (n₁ = n₂, so p_k = ½)**
- `F₁ = ½ w²,  F₂ = (3/2)(w − 4)²`; note "optima c = (0, 4), curvatures a = (1, 3)"
- `f′(w) = ½w + (3/2)(w − 4) = 2w − 6`; green "w* = 3, f(3) = 3. The steep client pulls w* toward 4."
- `w^k = c_k + ρ_k^u (w_t − c_k),  ρ_k = 1 − η a_k`; note "each local GD step shrinks the gap to c_k by ρ_k. η = 0.1: ρ = (0.9, 0.7)"

**Write (lower left): One round, starting at w_t = w* = 3**
| u | w¹ = 0.9^u·3 | w² = 4 − 0.7^u | w_{t+1} |
|---|---|---|---|
| 1 | 2.7 | 3.3 | 3.0 stays (green) |
| 2 | 2.43 | 3.51 | 2.97 leaves (red) |
| ∞ | 0 | 4 | 2.0 (red) |
- Note: "u → ∞: f(2) = 4 > f(3), and f′(2) = −2 ≠ 0: not even stationary."

**Write (lower right): Where it settles (derivation spine)**
- `w̄ = Σ_k p_k [c_k + ρ_k^u (w̄ − c_k)]`  ← "set w_{t+1} = w_t"
- boxed (blue): `w̄ = Σ_k p_k (1 − ρ_k^u) c_k / Σ_k p_k (1 − ρ_k^u)`  ← "vs w* = Σ p_k a_k c_k / Σ p_k a_k"
- "u = 1: 1 − ρ_k = η a_k → w̄ = w* = 3 ✓"
- "u = 2: 0.51·4 / (0.19 + 0.51) = 2.91 · u = 5: 2.68 · u = 10: 2.39"
- "u → ∞: w̄ → Σ_k p_k c_k = 2 (curvature forgotten)" (last bracket red)

**Annotate**
- "What changes? E↑ or B↓ → u↑ → fewer rounds, but w̄ slides from w* toward Σ_k p_k c_k. η↓ → drift term ∝ η² shrinks faster than progress ∝ η → less bias, slower."
- Orange "Assumes full-batch local GD, quadratic F_k, η a_k < 2. In this toy the bias needs different curvatures: with a₁ = a₂ it vanishes."

**Must not omit**
- Starting exactly at w*, one round with u = 2 already leaves it (3 → 2.97).
- The fixed-point formula and its two limits (u = 1 gives w*, u → ∞ gives the plain mean of local optima).
- The assumptions of the toy (full-batch, quadratic, different curvatures).

## Test your understanding
1. With E = 1, B = ∞, show FedAvg is one GD step on f. Which property of p_k did you use?
2. Set a₁ = a₂ in the example. Where is w̄ for every u, and why?
3. You average with 1/|S_t| instead of n_k/n_S. Which objective do you minimise? When is it f?
4. Why does raising E save rounds on IID data but bias the result under label skew? Use u → ∞.

## Remember
- FedAvg: sampled clients run E epochs of SGD from w_t; the server takes the n_k-weighted average.
- One local step + averaging is exactly GD on f; more local steps buy fewer rounds with bias.
- Non-IID data → clients descend different F_k → the average drifts off w*, more with larger ηu and heterogeneity.

## Beyond the notes (optional)
- SCAFFOLD (Karimireddy et al. 2020): control variates that cancel the drift term.
- FedProx (Li et al. 2020): proximal term μ/2‖w − w_t‖² keeps local iterates near w_t.
- Unequal u_k reweights clients (objective inconsistency; FedNova, Wang et al. 2020).
- Convergence of FedAvg on non-IID data needs a decaying learning rate (Li et al., ICLR 2020).
- Server-side momentum / adaptive server optimisers (FedAvgM, FedAdam).
