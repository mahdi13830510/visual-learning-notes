# CS 5xx Optimization for ML · Lecture 7: Momentum and Adam
*(Slide text exported from the lecturer's deck. Used as Mode A test input.)*

---
**Slide 1: Lecture 7: Momentum and Adam**
- Instructor office hours moved to Thursday 14:00
- HW3 due next Friday
- Today: momentum, RMSProp, Adam

---
**Slide 2: Recap: SGD**
- Update: w_{t+1} = w_t − α g_t, where g_t = ∇f_i(w_t) is a stochastic gradient
- Cheap per step
- Noisy
- Sensitive to the learning rate α
- Slow on ill-conditioned problems
- Zig-zags in ravines

---
**Slide 3: A bit of history**
- Polyak 1964: heavy ball method
- Nesterov 1983: accelerated gradient
- Duchi et al. 2011: AdaGrad
- Hinton 2012 (Coursera lecture): RMSProp
- Kingma & Ba 2015: Adam
- Adam has 100k+ citations

---
**Slide 4: Momentum**
- Idea: accumulate a velocity
- v_t = β v_{t−1} + g_t
- w_{t+1} = w_t − α v_t
- β typically 0.9
- Physical analogy: ball rolling down a hill
- Dampens oscillations
- Accelerates along consistent directions
- Can overshoot

---
**Slide 5: Why momentum helps (picture)**
- [figure: elongated contour plot; SGD path zig-zags across the valley; momentum path is smoother and moves further along the valley floor]
- Oscillating components cancel in the sum
- Consistent components add up

---
**Slide 6: Momentum: effective step**
- If g_t = g is constant: v_t → g / (1 − β)
- So effective learning rate is α / (1 − β)
- β = 0.9 → 10× larger steps in consistent directions

---
**Slide 7: RMSProp**
- Different parameters need different step sizes
- s_t = ρ s_{t−1} + (1 − ρ) g_t²   (elementwise)
- w_{t+1} = w_t − α g_t / (√s_t + ε)
- ρ typically 0.99, ε = 1e−8
- Divides by running RMS of gradient
- Large gradients → smaller steps; small gradients → larger steps

---
**Slide 8: Adam = Momentum + RMSProp**
- m_t = β₁ m_{t−1} + (1 − β₁) g_t
- v_t = β₂ v_{t−1} + (1 − β₂) g_t²
- m̂_t = m_t / (1 − β₁^t)
- v̂_t = v_t / (1 − β₂)
- w_{t+1} = w_t − α m̂_t / (√v̂_t + ε)
- Defaults: α = 1e−3, β₁ = 0.9, β₂ = 0.999, ε = 1e−8

---
**Slide 9: Bias correction**
- m_0 = v_0 = 0
- Early estimates are biased toward zero
- Bias correction fixes this
- Important in the first few steps

---
**Slide 10: Adam in practice**
- Works well out of the box
- Default for transformers
- Sometimes generalizes worse than SGD+momentum (Wilson et al. 2017)
- AdamW: decoupled weight decay (Loshchilov & Hutter 2019)
- Learning-rate warmup often used

---
**Slide 11: Summary**
- Momentum: smooths direction
- RMSProp: per-parameter scale
- Adam: both + bias correction
- Next lecture: learning-rate schedules
