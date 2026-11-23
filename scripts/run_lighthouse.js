const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
process.env.CHROME_PATH = chromePath;

const reportsDir = path.join(__dirname, '..', 'lighthouse-reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const targets = [
  { name: 'home', url: 'http://localhost:3000/' },
  { name: 'news', url: 'http://localhost:3000/news' },
  { name: 'resources', url: 'http://localhost:3000/resources' },
];

const results = {};

for (const target of targets) {
  const jsonPath = path.join(reportsDir, `${target.name}.json`);
  const cmd = `npx lighthouse ${target.url} --only-categories=accessibility --output=json --output-path="${jsonPath}" --chrome-flags="--headless --disable-gpu --no-sandbox"`;
  console.log(`Auditing accessibility for ${target.name} (${target.url})...`);
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 60000 });
    const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const score = Math.round(report.categories.accessibility.score * 100);
    results[target.name] = score;
    console.log(`>>> ${target.name} Accessibility Score: ${score}/100`);
  } catch (err) {
    console.error(`Audit failed for ${target.name}:`, err.message);
  }
}

console.log('Final Accessibility Summary:', JSON.stringify(results, null, 2));
