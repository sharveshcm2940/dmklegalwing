const fs = require('fs');
const path = require('path');

const pageMap = {
  'Home (/)': ['src/app/page.tsx', 'src/components/DmkHeroSlider.tsx'],
  'News (/news)': ['src/app/news/page.tsx', 'src/components/news/'],
  'Article (/news/[id])': ['src/app/news/[id]/page.tsx', 'src/app/news/[id]/ArticleView.tsx', 'src/components/news/ReadingProgress.tsx'],
  'About (/about)': ['src/app/about/page.tsx'],
  'Ideology (/ideology)': ['src/app/ideology/page.tsx'],
  'Structure (/structure)': ['src/app/structure/page.tsx', 'src/components/OrgChart.tsx'],
  'Districts (/districts)': ['src/app/districts/page.tsx', 'src/components/TamilNaduMap.tsx'],
  'Activities (/activities)': ['src/app/activities/page.tsx'],
  'Resources (/resources)': ['src/app/resources/page.tsx'],
  'Contact (/contact)': ['src/app/contact/page.tsx'],
  'Enrol (/enrol, /enrol/done)': ['src/app/enrol/page.tsx', 'src/app/enrol/done/page.tsx'],
  'Citizen Desk (/citizen-desk, /citizen-desk/done)': ['src/app/citizen-desk/page.tsx', 'src/app/citizen-desk/done/page.tsx'],
  'Confirmation (/confirmation)': ['src/app/confirmation/page.tsx'],
  'Track (/track)': ['src/app/track/page.tsx'],
  'Admin (/admin)': ['src/app/admin/page.tsx'],
  'Leadership (/leadership)': ['src/app/leadership/page.tsx'],
  'Shell (Header, Footer, Layout, CSS)': ['src/app/layout.tsx', 'src/app/globals.css', 'src/components/Header.tsx', 'src/components/Footer.tsx', 'src/components/PageTitleBand.tsx', 'src/components/Icons.tsx']
};

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const details = {};

  // Default Tailwind colors
  const colors = content.match(/\b(bg|text|border|fill|stroke|ring)-(amber|yellow|slate|gray|zinc|blue|indigo|purple)-\d+\b/g);
  if (colors) details['Default Tailwind colors'] = Array.from(new Set(colors));

  // Amber hex
  const amberHex = content.match(/#F59E0B|#f59e0b|#d97706|#b45309/g);
  if (amberHex) details['Amber hex colors (#F59E0B)'] = Array.from(new Set(amberHex));

  // Gradients
  const gradients = content.match(/\b(bg-gradient-[a-z0-9-]+|linear-gradient\([^)]+\)|radial-gradient\([^)]+\)|from-[a-z0-9#-]+|to-[a-z0-9#-]+|via-[a-z0-9#-]+)\b/g);
  if (gradients) details['Gradients'] = Array.from(new Set(gradients));

  // Blur / glass
  const blur = content.match(/\b(backdrop-blur[a-z0-9-]*|blur-[a-z0-9-]*)\b/g);
  if (blur) details['Blur / Glass'] = Array.from(new Set(blur));

  // Shadows
  const shadows = content.match(/\bshadow-(sm|md|lg|xl|2xl|inner)\b|shadow-\[0[^\]]+\]/g);
  if (shadows) details['Drop shadows / Glow shadows'] = Array.from(new Set(shadows));

  // Rounded corners
  const rounded = content.match(/\brounded-(full|lg|xl|2xl|3xl|md)\b/g);
  if (rounded) details['Rounded corners (>2px / pill)'] = Array.from(new Set(rounded));

  // Icon libraries
  const iconLibs = content.match(/from\s+['"](lucide-react|react-icons|@heroicons\/react[^'"]*)/g);
  if (iconLibs) details['Icon library imports'] = Array.from(new Set(iconLibs));

  // Animation libraries
  const animLibs = content.match(/from\s+['"](framer-motion|gsap|aos)[^'"]*/g);
  if (animLibs) details['Animation library imports'] = Array.from(new Set(animLibs));

  // Auto-play / slider
  if (/slider|carousel/i.test(content) && /interval|autoplay|auto-play/i.test(content)) {
    details['Auto-playing carousel / slider'] = ['Found timer/autoplay slider logic'];
  }

  // Floating / glowing effects
  const glow = content.match(/\b(animate-pulse|animate-ping|animate-bounce)\b/g);
  if (glow) details['Floating / glowing effects'] = Array.from(new Set(glow));

  // Weather widget
  if (/weather/i.test(content)) {
    details['Weather widget'] = ['Weather widget references'];
  }

  // Letter spaced uppercase
  const letterSpace = content.match(/\b(tracking-wider|tracking-widest|tracking-\[[^\]]+\])\b[^\n\r"']*?\buppercase\b/g);
  if (letterSpace) details['Small uppercase letter-spaced labels'] = Array.from(new Set(letterSpace));

  // Meta text about AI
  const aiText = content.match(/(?:strictly|avoid|no)\s+AI[- ](?:design|style|templates)/gi);
  if (aiText) details['Text claiming avoidance of AI design'] = Array.from(new Set(aiText));

  return Object.keys(details).length > 0 ? details : null;
}

const report = {};

for (const [pageName, files] of Object.entries(pageMap)) {
  report[pageName] = {};
  for (const f of files) {
    if (f.endsWith('/')) {
      // dir
      if (fs.existsSync(f)) {
        fs.readdirSync(f).forEach(sub => {
          const subPath = path.join(f, sub);
          const r = checkFile(subPath);
          if (r) report[pageName][subPath.replace(/\\/g, '/')] = r;
        });
      }
    } else {
      const r = checkFile(f);
      if (r) report[pageName][f] = r;
    }
  }
}

console.log(JSON.stringify(report, null, 2));
