#!/usr/bin/env python3
"""Write native .excalidraw files (open them at excalidraw.com or in the Obsidian/VS Code plugins).

Use it for whiteboard-style concept diagrams: boxes, arrows, short labels. For plots, contours and
anything needing exact coordinates, use sketch.js / SVG instead.

As a library:
    import sys; sys.path.insert(0, "<skill>/scripts"); from excalidraw import Scene
    s = Scene()
    srv = s.box(300, 20, 160, 60, "server\\nw_t", color="blue")
    c1  = s.box(80, 200, 140, 60, "client 1")
    s.arrow(srv, c1, label="send w_t")           # arrows bind to the shapes they connect
    s.text(80, 280, "local SGD, E epochs", color="gray", size=16)
    s.save("fedavg.excalidraw")

From the command line, a JSON spec (list of {"op": "box"|"ellipse"|"diamond"|"text"|"arrow"|"line", ...}):
    python3 excalidraw.py spec.json out.excalidraw
    python3 excalidraw.py --check file.excalidraw    # validate structure (no browser needed)

Colours: ink, blue, red, green, orange, gray (or any hex). font: 5 = Excalifont (hand-drawn, default),
1 = Virgil (older hand-drawn), 2 = Helvetica, 3 = Cascadia (code).
"""
import json, math, random, sys, time

COLORS = {"ink": "#23262b", "blue": "#1f5fae", "red": "#c0392b", "green": "#2c7a3f",   # same palette as notes.css
          "orange": "#cc7414", "gray": "#8b9098"}
FILLS = {"blue": "#a5d8ff", "red": "#ffc9c9", "green": "#b2f2bb", "orange": "#ffec99", "gray": "#e9ecef"}


def _c(c):
    return COLORS.get(c, c or COLORS["ink"])


class Scene:
    def __init__(self, seed=1):
        self.elements = []
        self.rng = random.Random(seed)
        self._n = 0

    # ---- internals -------------------------------------------------------
    def _id(self, kind):
        self._n += 1
        return f"{kind}-{self._n}-{self.rng.randrange(16**6):06x}"

    def _base(self, kind, x, y, w, h, color="ink", fill=None, dashed=False, width=2, rough=1, rounded=True):
        e = {
            "id": self._id(kind), "type": kind, "x": float(x), "y": float(y),
            "width": float(w), "height": float(h), "angle": 0,
            "strokeColor": _c(color),
            "backgroundColor": FILLS.get(fill, fill) if fill else "transparent",
            "fillStyle": "hachure" if fill else "solid",
            "strokeWidth": width, "strokeStyle": "dashed" if dashed else "solid",
            "roughness": rough, "opacity": 100, "groupIds": [], "frameId": None,
            "roundness": {"type": 3} if rounded and kind in ("rectangle", "diamond") else (
                {"type": 2} if kind in ("arrow", "line") else None),
            "seed": self.rng.randrange(1, 2**31), "version": 1, "versionNonce": self.rng.randrange(1, 2**31),
            "isDeleted": False, "boundElements": [], "updated": int(time.time() * 1000),
            "link": None, "locked": False,
        }
        self.elements.append(e)
        return e

    @staticmethod
    def _measure(text, size):
        lines = text.split("\n")
        return max(len(l) for l in lines) * size * 0.55 + 4, len(lines) * size * 1.25

    def _text_el(self, x, y, text, size, color, align="left", container=None, font=5):
        w, h = self._measure(text, size)
        t = self._base("text", x, y, w, h, color=color)
        t["roundness"] = None
        t.update({"text": text, "originalText": text, "fontSize": size, "fontFamily": font,
                  "textAlign": align, "verticalAlign": "middle" if container else "top",
                  "containerId": container["id"] if container else None,
                  "autoResize": True, "lineHeight": 1.25})
        if container:
            container["boundElements"].append({"type": "text", "id": t["id"]})
            t["x"] = container["x"] + (container["width"] - w) / 2
            t["y"] = container["y"] + (container["height"] - h) / 2
        return t

    # ---- shapes ----------------------------------------------------------
    def box(self, x, y, w, h, label=None, color="ink", size=20, **kw):
        e = self._base("rectangle", x, y, w, h, color=color, **kw)
        if label:
            self._text_el(x, y, label, size, color, "center", container=e)
        return e

    def ellipse(self, x, y, w, h, label=None, color="ink", size=20, **kw):
        e = self._base("ellipse", x, y, w, h, color=color, **kw)
        if label:
            self._text_el(x, y, label, size, color, "center", container=e)
        return e

    def diamond(self, x, y, w, h, label=None, color="ink", size=18, **kw):
        e = self._base("diamond", x, y, w, h, color=color, **kw)
        if label:
            self._text_el(x, y, label, size, color, "center", container=e)
        return e

    def text(self, x, y, text, color="ink", size=20, align="left", font=5):
        return self._text_el(x, y, text, size, color, align, font=font)

    # ---- connectors ------------------------------------------------------
    @staticmethod
    def _center(e):
        return e["x"] + e["width"] / 2, e["y"] + e["height"] / 2

    @staticmethod
    def _edge_point(e, tx, ty, gap=6):
        """point on the bounding box of e in the direction of (tx, ty), pushed out by gap"""
        cx, cy = e["x"] + e["width"] / 2, e["y"] + e["height"] / 2
        dx, dy = tx - cx, ty - cy
        if dx == 0 and dy == 0:
            return cx, cy
        hw, hh = e["width"] / 2 + gap, e["height"] / 2 + gap
        s = min(hw / abs(dx) if dx else math.inf, hh / abs(dy) if dy else math.inf)
        return cx + dx * s, cy + dy * s

    def _connector(self, kind, a, b, label=None, color="ink", dashed=False, head="arrow",
                   tail=None, size=16, bend=0, width=2):
        """a, b: elements (bound) or (x, y) points."""
        pa = self._center(a) if isinstance(a, dict) else a
        pb = self._center(b) if isinstance(b, dict) else b
        if isinstance(a, dict):
            pa = self._edge_point(a, *pb)
        if isinstance(b, dict):
            pb = self._edge_point(b, *pa)
        x0, y0 = pa
        dx, dy = pb[0] - x0, pb[1] - y0
        pts = [[0.0, 0.0], [dx, dy]]
        if bend:
            L = math.hypot(dx, dy) or 1
            pts = [[0.0, 0.0], [dx / 2 - dy / L * bend, dy / 2 + dx / L * bend], [dx, dy]]
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        e = self._base(kind, x0, y0, max(xs) - min(xs), max(ys) - min(ys), color=color, dashed=dashed, width=width)
        e.update({"points": pts, "lastCommittedPoint": None,
                  "startBinding": None, "endBinding": None,
                  "startArrowhead": tail if kind == "arrow" else None,
                  "endArrowhead": head if kind == "arrow" else None})
        if kind == "arrow":
            e["elbowed"] = False
        for end, el in (("startBinding", a), ("endBinding", b)):
            if isinstance(el, dict) and kind == "arrow":
                e[end] = {"elementId": el["id"], "focus": 0, "gap": 6}
                el["boundElements"].append({"type": "arrow", "id": e["id"]})
        if label:
            self._text_el(x0, y0, label, size, color, "center", container=e)
        return e

    def arrow(self, a, b, label=None, **kw):
        return self._connector("arrow", a, b, label, **kw)

    def line(self, a, b, **kw):
        return self._connector("line", a, b, None, **kw)

    def group(self, *els):
        gid = self._id("group")
        for e in els:
            e["groupIds"].append(gid)
            for be in e.get("boundElements", []):
                if be["type"] == "text":
                    next(t for t in self.elements if t["id"] == be["id"])["groupIds"].append(gid)
        return gid

    # ---- output ----------------------------------------------------------
    def to_dict(self):
        return {"type": "excalidraw", "version": 2, "source": "https://excalidraw.com",
                "elements": self.elements,
                "appState": {"gridSize": 20, "viewBackgroundColor": "#ffffff"}, "files": {}}

    def save(self, path):
        problems = check(self.to_dict())
        if problems:
            raise ValueError("invalid scene: " + "; ".join(problems))
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(), f, indent=1)
        return path


def check(doc):
    """Structural validation of an .excalidraw document. Returns a list of problems."""
    p = []
    if doc.get("type") != "excalidraw" or doc.get("version") != 2:
        p.append("top level must have type 'excalidraw' and version 2")
    els = doc.get("elements")
    if not isinstance(els, list) or not els:
        return p + ["no elements"]
    ids = {e.get("id") for e in els}
    if len(ids) != len(els):
        p.append("duplicate element ids")
    need = ["id", "type", "x", "y", "width", "height", "strokeColor", "backgroundColor", "fillStyle",
            "strokeWidth", "strokeStyle", "roughness", "opacity", "seed", "version", "versionNonce",
            "isDeleted", "groupIds", "boundElements"]
    for e in els:
        miss = [k for k in need if k not in e]
        if miss:
            p.append(f"{e.get('id')}: missing {miss}")
        t = e.get("type")
        if t == "text":
            for k in ("text", "fontSize", "fontFamily", "textAlign", "verticalAlign"):
                if k not in e:
                    p.append(f"{e['id']}: text missing {k}")
            if e.get("containerId") and e["containerId"] not in ids:
                p.append(f"{e['id']}: containerId points nowhere")
        if t in ("arrow", "line"):
            pts = e.get("points")
            if not (isinstance(pts, list) and len(pts) >= 2 and list(pts[0]) == [0, 0]):
                p.append(f"{e['id']}: points must start at [0, 0]")
            for end in ("startBinding", "endBinding"):
                b = e.get(end)
                if b and b.get("elementId") not in ids:
                    p.append(f"{e['id']}: {end} points nowhere")
        for be in e.get("boundElements") or []:
            if be.get("id") not in ids:
                p.append(f"{e['id']}: boundElements references missing {be.get('id')}")
        for k in ("x", "y", "width", "height"):
            v = e.get(k)
            if not isinstance(v, (int, float)) or not math.isfinite(v):
                p.append(f"{e.get('id')}: {k} is not a finite number")
    return p


def from_spec(spec):
    s = Scene()
    named = {}
    for op in spec:
        kind = op.pop("op")
        name = op.pop("name", None)
        if kind in ("arrow", "line"):
            a, b = op.pop("from"), op.pop("to")
            a = named.get(a, a) if isinstance(a, str) else a
            b = named.get(b, b) if isinstance(b, str) else b
            e = getattr(s, kind)(a, b, **op)
        else:
            e = getattr(s, kind)(**op)
        if name:
            named[name] = e
    return s


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--check":
        probs = check(json.load(open(sys.argv[2], encoding="utf-8")))
        print("\n".join(probs) if probs else "OK: structurally valid .excalidraw")
        sys.exit(1 if probs else 0)
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    from_spec(json.load(open(sys.argv[1], encoding="utf-8"))).save(sys.argv[2])
    print("wrote", sys.argv[2])
