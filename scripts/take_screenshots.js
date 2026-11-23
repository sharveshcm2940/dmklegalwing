const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pages = [
  { name: 'home', url: 'http://localhost:3000/' },
  { name: 'news', url: 'http://localhost:3000/news' },
  { name: 'resources', url: 'http://localhost:3000/resources' },
];

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
];

for (const page of pages) {
  for (const vp of viewports) {
    const outFile = path.join(outDir, `${page.name}-${vp.width}.png`);
    const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=${vp.width},${vp.height} --screenshot="${outFile}" "${page.url}"`;
    console.log(`Capturing ${page.name} at ${vp.width}px...`);
    try {
      execSync(cmd, { stdio: 'ignore', timeout: 20000 });
      console.log(`Saved: ${outFile} (${fs.statSync(outFile).size} bytes)`);
    } catch (err) {
      console.error(`Failed to capture ${page.name} at ${vp.width}px:`, err.message);
    }
  }
}
console.log('Screenshots complete.');
