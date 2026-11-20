/* sketch.js — hand-drawn diagrams and page marks for visual-learning-notes.
 *
 * Needs rough.js and KaTeX (loaded by notes.html). Everything is drawn into inline SVG,
 * so the result prints as vectors.
 *
 *   Sketch.draw(() => {                      // runs after fonts + KaTeX are ready
 *     const f = Sketch.fig('#landscape', {w: 300, h: 220, x: [-3, 3], y: [-2, 2]});
 *     f.axes({x: '\\theta_1', y: '\\theta_2'});
 *     f.contours((x, y) => x*x + 3*y*y, [0.5, 1.5, 3, 5]);
 *     f.arrow([1, 1], [1.6, 2.2], {color: 'blue', label: '\\nabla L', tex: true});
 *   });
 *
 * Coordinates are data units when the figure has x/y ranges, pixels otherwise
 * (pixel y grows downward). Colours: ink, blue, red, green, orange, gray (or any CSS colour).
 * Style options on every mark: color, width, dashed, rough (0 = ruler-straight), fill.
 *
 * Page marks (drawn over the text after layout): add class
 *   .box  → hand-drawn rectangle      .ul   → hand-drawn underline
 *   .circ → hand-drawn ellipse        data-color="red|blue|…" picks the colour.
 */
(function () {
  "use strict";
  const C = { ink: "#23262b", soft: "#4a4f57", blue: "#1f5fae", red: "#c0392b", green: "#2c7a3f",
              orange: "#cc7414", gray: "#8b9098", faint: "#c9ced6" };
  const col = (c) => C[c] || c || C.ink;
  const NS = "http://www.w3.org/2000/svg";
  const HAND = "'Caveat', 'Kalam', cursive";
  let seed = 7;
  const queue = [];
  const errors = [];

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  class Fig {
    constructor(sel, o = {}) {
      this.host = typeof sel === "string" ? document.querySelector(sel) : sel;
      if (!this.host) throw new Error("Sketch.fig: no element " + sel);
      this.w = o.w || 300; this.h = o.h || 200;
      this.pad = o.pad ?? (o.x ? 22 : 0);
      if (o.equal && o.x && o.y)   // equal aspect: 1 data unit is the same length on both axes (circles stay round)
        this.h = Math.round((this.w - 2 * this.pad) * (o.y[1] - o.y[0]) / (o.x[1] - o.x[0]) + 2 * this.pad);
      this.xr = o.x; this.yr = o.y;
      this.svg = el("svg", { viewBox: `0 0 ${this.w} ${this.h}`, width: this.w, height: this.h,
                             class: "sketch", role: "img" });
      if (o.label) this.svg.setAttribute("aria-label", o.label);
      this.host.appendChild(this.svg);
      this.rc = rough.svg(this.svg);
      this.rough = o.rough ?? 0.9;
    }
    // data → pixel
    X(x) { return this.xr ? this.pad + (x - this.xr[0]) / (this.xr[1] - this.xr[0]) * (this.w - 2 * this.pad) : x; }
    Y(y) { return this.yr ? this.h - this.pad - (y - this.yr[0]) / (this.yr[1] - this.yr[0]) * (this.h - 2 * this.pad) : y; }
    P(p) { return [this.X(p[0]), this.Y(p[1])]; }
    // pixel lengths → data lengths (for sizes given in px on data figures)
    opts(o = {}) {
      const r = {
        stroke: col(o.color), strokeWidth: o.width ?? 1.4, roughness: o.rough ?? this.rough,
        bowing: o.bowing ?? 0.6, seed: seed++, disableMultiStroke: o.single ?? false,
      };
      if (o.dashed) r.strokeLineDash = Array.isArray(o.dashed) ? o.dashed : [5, 4];
      if (o.fill) { r.fill = col(o.fill); r.fillStyle = o.fillStyle || "hachure";
                    r.hachureGap = o.gap || 5; r.fillWeight = o.fillWeight || 0.8; }
      return r;
    }
    add(node) { this.svg.appendChild(node); return node; }

    line(p, q, o = {}) { const [a, b] = this.P(p), [c, d] = this.P(q);
      return this.add(this.rc.line(a, b, c, d, this.opts(o))); }

    /** arrow p → q. o.label (text) placed near the head; o.tex renders the label as math;
        o.head: size in px; o.both: double-headed; o.curve: bend in px (+ left, − right). */
    arrow(p, q, o = {}) {
      const [x1, y1] = this.P(p), [x2, y2] = this.P(q);
      const g = el("g", {}, this.svg);
      let tx = x2 - x1, ty = y2 - y1;
      if (o.curve) {
        const mx = (x1 + x2) / 2 - ty * o.curve / Math.hypot(tx, ty),
              my = (y1 + y2) / 2 + tx * o.curve / Math.hypot(tx, ty);
        g.appendChild(this.rc.curve([[x1, y1], [mx, my], [x2, y2]], this.opts(o)));
        tx = x2 - mx; ty = y2 - my;
      } else {
        g.appendChild(this.rc.line(x1, y1, x2, y2, this.opts(o)));
      }
      const head = (x, y, dx, dy) => {
        const L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = o.head || 8;
        const a = [x - s * ux + s * 0.5 * uy, y - s * uy - s * 0.5 * ux];
        const b = [x - s * ux - s * 0.5 * uy, y - s * uy + s * 0.5 * ux];
        g.appendChild(this.rc.linearPath([a, [x, y], b], this.opts({ ...o, dashed: false, rough: 0.4 })));
      };
      head(x2, y2, tx, ty);
      if (o.both) head(x1, y1, x1 - x2, y1 - y2);
      if (o.label) {
        const L = Math.hypot(tx, ty) || 1;
        const off = o.labelOffset || [ty / L * 12, -tx / L * 12];   // left of the direction of travel
        const at = o.labelAt === "mid" ? [(x1 + x2) / 2, (y1 + y2) / 2] : [x2, y2];
        this._label(at[0] + off[0], at[1] + off[1], o.label, { anchor: "middle", ...o });
      }
      return g;
    }

    path(pts, o = {}) {
      const P = pts.map((p) => this.P(p));
      return this.add(o.smooth === false ? this.rc.linearPath(P, this.opts(o)) : this.rc.curve(P, this.opts(o)));
    }
    /** polyline through function values, x ∈ [a, b] */
    fn(f, a, b, o = {}) {
      const n = o.n || 60, pts = [];
      for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x);
        if (Number.isFinite(y)) pts.push([x, y]); }
      return this.path(pts, { rough: 0.4, ...o });
    }
    poly(pts, o = {}) { return this.add(this.rc.polygon(pts.map((p) => this.P(p)), this.opts(o))); }
    rect(p, q, o = {}) {        // corners p and q (data or px)
      const [a, b] = this.P(p), [c, d] = this.P(q);
      return this.add(this.rc.rectangle(Math.min(a, c), Math.min(b, d), Math.abs(c - a), Math.abs(d - b), this.opts(o)));
    }
    /** box in pixel space with centred text label (for architecture / flow diagrams) */
    box(x, y, w, h, label, o = {}) {
      this.add(this.rc.rectangle(x, y, w, h, this.opts(o)));
      if (label) this._label(x + w / 2, y + h / 2, label, { anchor: "middle", base: "middle", ...o, color: o.textColor || o.color });
    }
    circle(c, r, o = {}) { const [x, y] = this.P(c); return this.add(this.rc.circle(x, y, 2 * r, this.opts(o))); }
    ellipse(c, rx, ry, o = {}) {   // radii in data units on data figures
      const [x, y] = this.P(c);
      const sx = this.xr ? Math.abs(this.X(rx) - this.X(0)) : rx, sy = this.yr ? Math.abs(this.Y(ry) - this.Y(0)) : ry;
      if (o.angle) {               // rotated ellipse: sample points
        const t = o.angle, pts = [];
        for (let i = 0; i < 48; i++) { const s = (i / 48) * 2 * Math.PI;
          const ex = rx * Math.cos(s), ey = ry * Math.sin(s);
          pts.push([c[0] + ex * Math.cos(t) - ey * Math.sin(t), c[1] + ex * Math.sin(t) + ey * Math.cos(t)]); }
        pts.push(pts[0]);
        return this.path(pts, { rough: 0.4, single: true, ...o });
      }
      return this.add(this.rc.ellipse(x, y, 2 * sx, 2 * sy, this.opts(o)));
    }
    /** a dot with optional label; o.r radius px, o.at label offset [dx, dy] px */
    point(p, o = {}) {
      const [x, y] = this.P(p);
      el("circle", { cx: x, cy: y, r: o.r || 3, fill: col(o.color), stroke: "none" }, this.svg);
      if (o.label) { const [dx, dy] = o.at || [7, -7];
        this._label(x + dx, y + dy, o.label, { anchor: dx < 0 ? "end" : "start", ...o }); }
    }
    /** handwritten text at data/pixel point. o.anchor start|middle|end, o.size px, o.dx/dy px */
    text(p, s, o = {}) { const [x, y] = this.P(p); return this._label(x + (o.dx || 0), y + (o.dy || 0), s, o); }
    /** KaTeX label at a point (rendered via foreignObject). Same options as text. */
    tex(p, s, o = {}) { return this.text(p, s, { ...o, tex: true }); }

    _label(x, y, s, o = {}) {
      const anchor = o.anchor || "start", size = o.size || (o.tex ? 13 : 17);
      if (o.tex) {
        const fo = el("foreignObject", { x: 0, y: 0, width: 1, height: 1, overflow: "visible" }, this.svg);
        const div = document.createElement("div");
        div.style.cssText = `position:absolute;white-space:nowrap;font-size:${size}px;color:${col(o.color)};line-height:1`;
        fo.appendChild(div);
        try { katex.render(s, div, { throwOnError: true }); }
        catch (e) { errors.push("tex: " + s + " — " + e.message); div.textContent = s; div.style.color = "red"; }
        const r = div.getBoundingClientRect(), sc = this.svg.getBoundingClientRect().width / this.w || 1;
        const w = r.width / sc, h = r.height / sc;
        const ax = anchor === "middle" ? w / 2 : anchor === "end" ? w : 0;
        const ay = o.base === "top" ? 0 : o.base === "bottom" ? h : h / 2;
        fo.setAttribute("x", x - ax); fo.setAttribute("y", y - ay);
        fo.setAttribute("width", Math.ceil(w) + 2); fo.setAttribute("height", Math.ceil(h) + 2);
        div.style.position = "static";
        return fo;
      }
      if (/\\[a-zA-Z]/.test(String(s))) errors.push(`label "${s}" contains TeX but was drawn as plain text: pass tex: true`);
      const t = el("text", { x, y, "text-anchor": anchor, fill: col(o.color),
        "dominant-baseline": o.base === "top" ? "hanging" : o.base === "middle" ? "central" : "auto",
        style: `font-family:${o.font || HAND};font-size:${size}px;font-weight:${o.bold ? 700 : 500}` }, this.svg);
      const lines = String(s).split("\n");
      lines.forEach((ln, i) => { const ts = el("tspan", { x, dy: i ? size * 1.05 : (o.base === "middle" ? -(lines.length - 1) * size * 0.52 : 0) }, t); ts.textContent = ln; });
      return t;
    }

    /** axes through the origin of the data range (or at o.at). o.x/o.y axis labels (TeX). */
    axes(o = {}) {
      const [x0, x1] = this.xr, [y0, y1] = this.yr;
      const ox = o.at ? o.at[0] : Math.min(Math.max(0, x0), x1), oy = o.at ? o.at[1] : Math.min(Math.max(0, y0), y1);
      const st = { color: o.color || "gray", width: 1.1, rough: 0.5, head: 6 };
      this.arrow([x0, oy], [x1, oy], st);
      this.arrow([ox, y0], [ox, y1], st);
      // ticks: xticks / yticks = [value, …] or [[value, "label"], …]; the axis label sits beyond the arrow tip
      const tk = (v) => (Array.isArray(v) ? v : [v, String(v)]);
      (o.xticks || []).map(tk).forEach(([v, s]) => { const X = this.X(v), Y = this.Y(oy);
        el("line", { x1: X, y1: Y - 3, x2: X, y2: Y + 3, stroke: col("gray"), "stroke-width": 1 }, this.svg);
        this._label(X, Y + 6, s, { anchor: "middle", base: "top", size: 11, color: "gray", tex: true }); });
      (o.yticks || []).map(tk).forEach(([v, s]) => { const X = this.X(ox), Y = this.Y(v);
        el("line", { x1: X - 3, y1: Y, x2: X + 3, y2: Y, stroke: col("gray"), "stroke-width": 1 }, this.svg);
        this._label(X - 6, Y, s, { anchor: "end", base: "middle", size: 11, color: "gray", tex: true }); });
      const below = (o.xticks || []).length ? 26 : 13;
      if (o.x) this.tex([x1, oy], o.x, { anchor: "end", dy: below, color: "gray", size: 12 });
      if (o.y) this.tex([ox, y1], o.y, { anchor: "start", dx: 6, dy: 4, color: "gray", size: 12 });
    }

    /** level sets of f(x, y) by marching squares, chained into smooth curves. */
    contours(f, levels, o = {}) {
      const n = o.grid || 70, [x0, x1] = this.xr, [y0, y1] = this.yr;
      const dx = (x1 - x0) / n, dy = (y1 - y0) / n, V = [];
      for (let i = 0; i <= n; i++) { V[i] = []; for (let j = 0; j <= n; j++) V[i][j] = f(x0 + i * dx, y0 + j * dy); }
      const out = [];
      for (const L of levels) {
        const segs = [];
        const interp = (xa, ya, va, xb, yb, vb) => { const t = (L - va) / (vb - va); return [xa + t * (xb - xa), ya + t * (yb - ya)]; };
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const xa = x0 + i * dx, ya = y0 + j * dy, xb = xa + dx, yb = ya + dy;
          const a = V[i][j], b = V[i + 1][j], c = V[i + 1][j + 1], d = V[i][j + 1];
          const pts = [];
          if ((a < L) !== (b < L)) pts.push(interp(xa, ya, a, xb, ya, b));
          if ((b < L) !== (c < L)) pts.push(interp(xb, ya, b, xb, yb, c));
          if ((c < L) !== (d < L)) pts.push(interp(xb, yb, c, xa, yb, d));
          if ((d < L) !== (a < L)) pts.push(interp(xa, yb, d, xa, ya, a));
          if (pts.length === 2) segs.push(pts);
          else if (pts.length === 4) { segs.push([pts[0], pts[1]]); segs.push([pts[2], pts[3]]); }
        }
        // chain segments into polylines
        const key = (p) => p[0].toFixed(6) + "," + p[1].toFixed(6);
        const ends = new Map();
        segs.forEach((s, k) => { for (const p of s) { const kk = key(p); (ends.get(kk) || ends.set(kk, []).get(kk)).push(k); } });
        const used = new Set();
        for (let k = 0; k < segs.length; k++) {
          if (used.has(k)) continue;
          used.add(k);
          const chain = [...segs[k]];
          for (const dir of [1, 0]) {
            for (;;) {
              const tip = dir ? chain[chain.length - 1] : chain[0];
              const nxt = (ends.get(key(tip)) || []).find((m) => !used.has(m));
              if (nxt === undefined) break;
              used.add(nxt);
              const s = segs[nxt], other = key(s[0]) === key(tip) ? s[1] : s[0];
              dir ? chain.push(other) : chain.unshift(other);
            }
          }
          const thin = chain.filter((_, i) => i % 3 === 0 || i === chain.length - 1);
          if (thin.length > 2) out.push(this.path(thin, { color: "gray", width: 1, rough: 0.6, single: true, ...o }));
        }
      }
      return out;
    }

    /** matrix drawn as [ entries ] at pixel/data point p (top-left). rows: array of arrays of TeX strings. */
    matrix(p, rows, o = {}) {
      const tex = "\\begin{bmatrix}" + rows.map((r) => r.join(" & ")).join(" \\\\ ") + "\\end{bmatrix}";
      return this.tex(p, tex, o);
    }
    /** curly brace from p to q (px or data), bulging to the left of p→q, with optional label */
    brace(p, q, o = {}) {
      const [x1, y1] = this.P(p), [x2, y2] = this.P(q);
      const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = uy, ny = -ux, d = o.depth || 7;
      const at = (t, s) => [x1 + ux * L * t + nx * d * s, y1 + uy * L * t + ny * d * s];
      const pts = [at(0, 0), at(0.05, 0.8), at(0.45, 1), at(0.5, 2), at(0.55, 1), at(0.95, 0.8), at(1, 0)];
      this.add(this.rc.curve(pts, this.opts({ rough: 0.4, ...o })));
      if (o.label) { const m = at(0.5, 2); this._label(m[0] + nx * 6, m[1] + ny * 6,
        o.label, { anchor: Math.abs(nx) > 0.5 ? (nx > 0 ? "start" : "end") : "middle", base: "middle", ...o }); }
    }
  }

  // ----- page marks (.box / .ul / .circ) -----
  function pageMarks() {
    document.querySelectorAll(".page").forEach((page) => {
      const old = page.querySelector(":scope > svg.marks"); if (old) old.remove();
      const pr = page.getBoundingClientRect();
      const sc = pr.width / page.offsetWidth || 1;
      const svg = el("svg", { class: "marks", width: page.offsetWidth, height: page.offsetHeight });
      page.appendChild(svg);
      const rc = rough.svg(svg);
      page.querySelectorAll(".box, .ul, .circ").forEach((e) => {
        const r = e.getBoundingClientRect();
        const x = (r.left - pr.left) / sc, y = (r.top - pr.top) / sc, w = r.width / sc, h = r.height / sc;
        const o = { stroke: col(e.dataset.color), strokeWidth: 1.3, roughness: 1, bowing: 0.8, seed: seed++ };
        if (e.classList.contains("box")) svg.appendChild(rc.rectangle(x - 4, y - 3, w + 8, h + 6, o));
        if (e.classList.contains("ul")) svg.appendChild(rc.line(x, y + h + 1, x + w, y + h - 1, { ...o, roughness: 1.4 }));
        if (e.classList.contains("circ")) svg.appendChild(rc.ellipse(x + w / 2, y + h / 2, w + 14, h + 8, o));
      });
    });
  }

  // ----- layout checks, reported in #vln-status for scripts/render_notes.py -----
  function check() {
    const report = { pages: 0, overflow: [], errors: errors.slice(), katexErrors: 0, figuresTooWide: [] };
    document.querySelectorAll(".page").forEach((page, i) => {
      report.pages++;
      const pr = page.getBoundingClientRect(), sc = pr.width / page.offsetWidth || 1;
      const limit = pr.bottom - parseFloat(getComputedStyle(page).paddingBottom) * sc * 0.5;
      let worst = 0, who = "";
      page.querySelectorAll(".flow > *, .sheet > *, .col > *, .fig, .eq, p, li").forEach((e) => {
        const b = e.getBoundingClientRect().bottom; if (b > limit + 1 && b - limit > worst) { worst = b - limit; who = e.className || e.tagName; }
      });
      if (worst > 0) report.overflow.push({ page: i + 1, px: Math.round(worst / sc), element: String(who) });
      const right = pr.right - parseFloat(getComputedStyle(page).paddingRight) * sc * 0.6;
      page.querySelectorAll(".katex-display > .katex, .eq, .derive > div, .fig, p, li, h1, h2, td").forEach((e) => {
        const r = e.getBoundingClientRect();
        if (r.width && r.right > right + 1) report.overflow.push({ page: i + 1, px: Math.round((r.right - right) / sc),
          element: "too wide → " + (e.className || e.tagName) + ": " + (e.textContent || "").trim().slice(0, 40) });
      });
      page.querySelectorAll("svg.sketch").forEach((s) => {
        const sr = s.getBoundingClientRect(), hr = s.parentElement.getBoundingClientRect();
        if (sr.right > pr.right - 2) report.figuresTooWide.push({ page: i + 1, figure: s.parentElement.id || "?" });
        void hr;
      });
    });
    // labels colliding inside a figure (text / TeX labels only; lines crossing labels are not checked)
    report.labelOverlaps = [];
    document.querySelectorAll(".page").forEach((page, i) => {
      page.querySelectorAll("svg.sketch").forEach((svg) => {
        const boxes = [...svg.querySelectorAll("text, foreignObject")].map((e) => {
          const r = (e.tagName === "foreignObject" ? e.firstChild : e).getBoundingClientRect();
          const ann = e.querySelector && e.querySelector("annotation");
          return { r, s: ((ann || e).textContent || "").trim().slice(0, 24) };
        }).filter((b) => b.r.width > 0);
        for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
          const A = boxes[a].r, B = boxes[b].r;
          const w = Math.min(A.right, B.right) - Math.max(A.left, B.left), h = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
          if (w > 2 && h > 2 && w * h > 0.15 * Math.min(A.width * A.height, B.width * B.height))
            report.labelOverlaps.push({ page: i + 1, figure: svg.parentElement.id || "?", a: boxes[a].s, b: boxes[b].s });
        }
      });
    });
    report.katexErrors = document.querySelectorAll(".katex-error").length;
    let pre = document.getElementById("vln-status");
    if (!pre) { pre = document.createElement("pre"); pre.id = "vln-status"; pre.hidden = true; document.body.appendChild(pre); }
    pre.textContent = JSON.stringify(report);
    if (report.overflow.length || report.errors.length || report.katexErrors || report.labelOverlaps.length) console.warn("[vln]", report);
  }

  function fitScreen() {   // scale A4 pages to the viewport on screens narrower than a page
    const page = document.querySelector(".page"); if (!page) return;
    const avail = document.documentElement.clientWidth - 32;
    document.documentElement.style.setProperty("--zoom", Math.min(1, avail / page.offsetWidth).toFixed(3));
  }

  async function run() {
    if (window.renderMathInElement) renderMathInElement(document.body, {
      delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\[", right: "\\]", display: true },
                   { left: "$", right: "$", display: false }, { left: "\\(", right: "\\)", display: false }],
      throwOnError: false, ignoredClasses: ["nomath"] });
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    fitScreen();
    for (const fn of queue) { try { fn(); } catch (e) { errors.push(String(e && e.stack || e)); console.error(e); } }
    pageMarks();
    check();
    document.documentElement.classList.add("vln-ready");
  }

  window.Sketch = {
    colors: C,
    fig: (sel, o) => new Fig(sel, o),
    draw: (fn) => queue.push(fn),
  };
  window.addEventListener("load", () => { run(); });
  window.addEventListener("resize", () => { fitScreen(); pageMarks(); });
})();
