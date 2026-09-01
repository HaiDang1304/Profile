import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const [url = 'http://127.0.0.1:4173', outputDir = 'artifacts/audit', widthArg = '1440', heightArg = '900', progressArg = '0,20,45,55,70,78,85,100'] = process.argv.slice(2);
const width = Number(widthArg);
const height = Number(heightArg);
const progressPoints = progressArg.split(',').map(Number);
const port = 9333 + Math.floor(Math.random() * 500);
const browserPath = process.env.AUDIT_BROWSER || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = await mkdtemp(join(tmpdir(), 'portfolio-audit-'));
const targetDir = resolve(outputDir);

await mkdir(targetDir, { recursive: true });

const browser = spawn(browserPath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  `--window-size=${width},${height}`,
  'about:blank',
], { stdio: 'ignore' });

async function getJson(path) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`);
  if (!response.ok) throw new Error(`CDP HTTP ${response.status}`);
  return response.json();
}

let version;
for (let attempt = 0; attempt < 50; attempt += 1) {
  try {
    version = await getJson('/json/version');
    break;
  } catch {
    await delay(100);
  }
}
if (!version) throw new Error('Chrome DevTools endpoint did not start');

const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((accept, reject) => {
  socket.addEventListener('open', accept, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let commandId = 0;
const pending = new Map();
const runtimeErrors = [];
const checkpoints = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') {
    runtimeErrors.push(message.params.exceptionDetails.text);
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    runtimeErrors.push(message.params.entry.text);
  }
  if (!message.id || !pending.has(message.id)) return;
  const { accept, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else accept(message.result);
});

function command(method, params = {}) {
  commandId += 1;
  return new Promise((accept, reject) => {
    pending.set(commandId, { accept, reject });
    socket.send(JSON.stringify({ id: commandId, method, params }));
  });
}

await command('Page.enable');
await command('Runtime.enable');
await command('Log.enable');
await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 480 });
await command('Page.navigate', { url });
await delay(2200);

const metrics = await command('Runtime.evaluate', {
  expression: `JSON.stringify({
    scrollHeight: document.documentElement.scrollHeight,
    viewport: [innerWidth, innerHeight],
    bodyWidth: document.body.scrollWidth,
    htmlWidth: document.documentElement.scrollWidth,
    title: document.title,
    sections: Array.from(document.querySelectorAll('section[data-scene]')).map((section) => ({
      id: section.id,
      top: section.offsetTop,
      height: section.offsetHeight
    })),
    text: document.body.innerText.slice(0, 500)
  })`,
  returnByValue: true,
});

for (const progress of progressPoints) {
  await command('Runtime.evaluate', {
    expression: `window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * ${progress / 100}))`,
  });
  await delay(1400);
  const checkpoint = await command('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const visibleSections = Array.from(document.querySelectorAll('section[data-scene]')).filter((section) => {
        const anchor = section.parentElement?.parentElement;
        return anchor?.getAttribute('aria-hidden') === 'false' && Number(getComputedStyle(anchor).opacity) > 0.05;
      });
      return {
        progress: ${progress},
        activeNav: document.querySelector('[aria-current="page"]')?.getAttribute('aria-label') || null,
        visibleScenes: visibleSections.map((section) => section.dataset.scene),
        panels: visibleSections.map((section) => {
          const panel = section.querySelector('.scene-panel');
          const rect = panel?.getBoundingClientRect();
          const controls = panel ? Array.from(panel.querySelectorAll('a, button, input, textarea')) : [];
          return {
            scene: section.dataset.scene,
            rect: rect ? [Math.round(rect.left), Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom)] : null,
            fitsViewport: rect ? rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1 : false,
            horizontalOverflow: panel ? panel.scrollWidth > panel.clientWidth + 1 : false,
            clippedControls: controls.filter((control) => {
              const r = control.getBoundingClientRect();
              return r.left < -1 || r.right > innerWidth + 1;
            }).length,
          };
        }),
      };
    })())`,
    returnByValue: true,
  });
  checkpoints.push(JSON.parse(checkpoint.result.value));
  const shot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const filename = resolve(targetDir, `${width}x${height}-${String(progress).padStart(3, '0')}.png`);
  await import('node:fs/promises').then(({ writeFile }) => writeFile(filename, Buffer.from(shot.data, 'base64')));
}

process.stdout.write(`${JSON.stringify({ metrics: JSON.parse(metrics.result.value), checkpoints, runtimeErrors })}\n`);
socket.close();
browser.kill();
await Promise.race([
  new Promise((accept) => browser.once('exit', accept)),
  delay(1500),
]);
await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
