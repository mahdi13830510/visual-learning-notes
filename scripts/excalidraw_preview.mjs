#!/usr/bin/env node
// Render a .excalidraw file with Excalidraw's own exporter (headless Chromium), to prove it opens
// and to get an SVG (for embedding in notes.html) and a PNG (to look at).
//
//   node excalidraw_preview.mjs diagram.excalidraw [out-basename]
//     → out-basename.svg and out-basename.png   (default: next to the input)
//
// Needs: Node 22+ (built-in fetch/WebSocket), Chromium or Chrome, network access to esm.sh.
// Exit code 0 only if Excalidraw itself loaded the scene and exported it.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [input, outArg] = process.argv.slice(2);
if (!input) { console.error("usage: node excalidraw_preview.mjs file.excalidraw [out-basename]"); process.exit(2); }
const out = outArg || input.replace(/\.excalidraw(\.json)?$/, "");
const doc = JSON.parse(fs.readFileSync(input, "utf8"));

const browsers = ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable", "chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
const which = (b) => b.startsWith("/") ? (fs.existsSync(b) ? b : null)
  : (process.env.PATH || "").split(path.delimiter).map((d) => path.join(d, b)).find((p) => fs.existsSync(p));
const browser = browsers.map(which).find(Boolean);
if (!browser) { console.error("no Chromium/Chrome found"); process.exit(2); }

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "vln-exc-"));
const page = path.join(dir, "render.html");
fs.writeFileSync(page, `<!doctype html><html><body style="margin:0;background:#fff">
<div id="host"></div><pre id="out">pending</pre>
<script type="module">
const out = document.getElementById("out");
try {
  const m = await import("https://esm.sh/@excalidraw/excalidraw@0.18.0?bundle-deps");
  const doc = ${JSON.stringify(doc)};
  const svg = await m.exportToSvg({ elements: doc.elements, files: doc.files || {},
    appState: { ...(doc.appState || {}), exportBackground: false, exportPadding: 16 } });   // transparent: sits on the dotted paper
  document.getElementById("host").appendChild(svg);
  out.textContent = "OK";
} catch (e) { out.textContent = "ERR " + (e && e.stack || e); }
</script></body></html>`);

const ch = spawn(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--remote-debugging-port=0",
  `--user-data-dir=${dir}/profile`, "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const done = (code, msg) => { if (msg) console[code ? "error" : "log"](msg); try { ch.kill(); } catch {}
  fs.rmSync(dir, { recursive: true, force: true }); process.exit(code); };

let port;
for (let i = 0; i < 150 && !port; i++) {
  await sleep(100);
  try { port = fs.readFileSync(path.join(dir, "profile", "DevToolsActivePort"), "utf8").split("\n")[0]; } catch {}
}
if (!port) done(1, "browser did not start");
const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d.result); delete pend[d.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true }))?.result?.value;

await send("Page.navigate", { url: "file://" + page });
let status = "pending";
for (const t0 = Date.now(); Date.now() - t0 < 150000 && status === "pending"; ) {
  await sleep(1000);
  status = (await evalJs("document.getElementById('out')?.textContent")) || "pending";
}
if (status !== "OK") done(1, "Excalidraw could not render this file: " + status.slice(0, 400));

const svg = await evalJs("document.querySelector('#host svg').outerHTML");
fs.writeFileSync(out + ".svg", svg);
const box = await evalJs("(() => { const r = document.querySelector('#host svg').getBoundingClientRect(); return [r.width, r.height]; })()");
await send("Emulation.setDeviceMetricsOverride", { width: Math.ceil(box[0]), height: Math.ceil(box[1]), deviceScaleFactor: 2, mobile: false });
await evalJs("document.getElementById('out').remove()");
await sleep(300);
const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: box[0], height: box[1], scale: 1 } });
fs.writeFileSync(out + ".png", Buffer.from(shot.data, "base64"));
done(0, `OK: Excalidraw rendered ${doc.elements.length} elements → ${out}.svg, ${out}.png`);
