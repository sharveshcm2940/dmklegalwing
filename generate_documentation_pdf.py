import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>DMK Legal Wing — Complete Platform Blueprint & Functional Architecture</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-right {
      content: "Page " counter(page);
      font-size: 8pt;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #777;
    }
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1A1A1A;
    background-color: #FFFFFF;
    line-height: 1.5;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }

  /* Page Break Utilities */
  .page-break {
    page-break-before: always;
  }
  .avoid-break {
    page-break-inside: avoid;
  }

  /* Cover Page */
  .cover-container {
    height: 94vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 3px solid #111111;
    padding: 35px;
    background-color: #FAF8F5;
    box-sizing: border-box;
    position: relative;
  }

  .cover-top-stripe {
    height: 8px;
    display: flex;
    width: 100%;
    margin-bottom: 25px;
  }
  .cover-stripe-red { width: 50%; background-color: #E31E24; }
  .cover-stripe-black { width: 50%; background-color: #111111; }

  .cover-badge {
    display: inline-block;
    background-color: #111111;
    color: #FFFFFF;
    font-size: 8pt;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 10px;
    margin-bottom: 12px;
  }

  .cover-title {
    font-size: 26pt;
    font-weight: 900;
    color: #111111;
    line-height: 1.15;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: -0.5px;
  }

  .cover-subtitle {
    font-size: 13pt;
    color: #E31E24;
    font-weight: 700;
    margin: 0 0 18px 0;
    border-bottom: 2px solid #111111;
    padding-bottom: 12px;
  }

  .cover-desc {
    font-size: 9.5pt;
    color: #444444;
    line-height: 1.6;
    max-width: 90%;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    background-color: #FFFFFF;
    border: 1px solid #D8D3CB;
    padding: 16px;
    margin-top: 30px;
  }

  .cover-meta-item strong {
    display: block;
    font-size: 7.5pt;
    color: #888888;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 3px;
  }
  .cover-meta-item span {
    font-size: 9.5pt;
    font-weight: bold;
    color: #111111;
  }

  .cover-footer {
    border-top: 1px solid #D8D3CB;
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #666666;
  }

  /* Headings */
  h1 {
    font-size: 17pt;
    font-weight: 900;
    color: #111111;
    text-transform: uppercase;
    margin: 20px 0 10px 0;
    border-bottom: 2.5px solid #111111;
    padding-bottom: 5px;
    letter-spacing: -0.3px;
  }
  h2 {
    font-size: 12.5pt;
    font-weight: 800;
    color: #E31E24;
    margin: 16px 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #111111;
    margin: 12px 0 4px 0;
  }

  /* Content Boxes */
  .callout-box {
    background-color: #FAF8F5;
    border-left: 4px solid #E31E24;
    border-top: 1px solid #E2DDD5;
    border-right: 1px solid #E2DDD5;
    border-bottom: 1px solid #E2DDD5;
    padding: 10px 14px;
    margin: 10px 0;
    font-size: 9pt;
  }

  .accent-box {
    background-color: #111111;
    color: #FFFFFF;
    padding: 12px 16px;
    margin: 12px 0;
  }
  .accent-box h3 { color: #FFD166; margin-top: 0; }
  .accent-box p { color: #E0E0E0; margin: 0; font-size: 8.5pt; }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 16px 0;
    font-size: 8pt;
  }
  th {
    background-color: #111111;
    color: #FFFFFF;
    text-align: left;
    padding: 6px 8px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 7.5pt;
    border: 1px solid #111111;
  }
  td {
    padding: 5.5px 8px;
    border: 1px solid #D8D3CB;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background-color: #FAF8F5;
  }

  /* Badges & Tags */
  .badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 7pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid #D8D3CB;
  }
  .badge-red { background-color: #E31E24; color: #FFFFFF; border-color: #E31E24; }
  .badge-black { background-color: #111111; color: #FFFFFF; border-color: #111111; }
  .badge-cream { background-color: #FAF8F5; color: #111111; }

  /* Feature Grid */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 10px 0;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin: 10px 0;
  }

  .card {
    border: 1px solid #D8D3CB;
    background-color: #FFFFFF;
    padding: 10px 12px;
  }
  .card h4 {
    margin: 0 0 4px 0;
    font-size: 9pt;
    color: #111111;
  }
  .card p {
    margin: 0;
    font-size: 8pt;
    color: #555555;
    line-height: 1.4;
  }

  ul, ol {
    margin: 6px 0 10px 18px;
    padding: 0;
    font-size: 8.5pt;
  }
  li {
    margin-bottom: 4px;
    line-height: 1.45;
  }

  .section-tag {
    font-size: 7.5pt;
    font-weight: bold;
    color: #E31E24;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    display: block;
    margin-bottom: 2px;
  }
</style>
</head>
<body>

<!-- ============================================================== -->
<!-- COVER PAGE                                                     -->
<!-- ============================================================== -->
<div class="cover-container">
  <div>
    <div class="cover-top-stripe">
      <div class="cover-stripe-red"></div>
      <div class="cover-stripe-black"></div>
    </div>
    
    <span class="cover-badge">Official Technical Dossier • 2026</span>
    
    <h1 class="cover-title">DMK Legal Wing<br>Platform Blueprint & System Architecture</h1>
    <h2 class="cover-subtitle">Complete Specification of Web Pages, Modules & Interactive Engine</h2>
    
    <p class="cover-desc">
      A comprehensive engineering, design, and functional manual detailing the institutional digital platform of the DMK Legal Wing (திமுக வழக்கறிஞர் அணி). Covering all 10 core public and administrative domains, real cartographic GIS mapping of 74 party units, executive command hierarchy tree, broadsheet editorial newsroom, full-stack REST API architecture, and persistent dual-database management.
    </p>

    <div class="cover-meta-grid">
      <div class="cover-meta-item">
        <strong>Publishing Authority</strong>
        <span>State Legal Secretariat, Anna Arivalayam, Chennai</span>
      </div>
      <div class="cover-meta-item">
        <strong>Technology Stack</strong>
        <span>Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4</span>
      </div>
      <div class="cover-meta-item">
        <strong>Data Infrastructure</strong>
        <span>Atomic File-based JSON Database Engine + 13 REST APIs</span>
      </div>
      <div class="cover-meta-item">
        <strong>Jurisdiction Scope</strong>
        <span>Tamil Nadu & Puducherry • 74 Party District Legal Units</span>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <span>Confidential & Official Document • DMK Legal Wing Digital Directorate</span>
    <span>Edition 2.4 • November 2026</span>
  </div>
</div>

<!-- ============================================================== -->
<!-- PAGE 2: TABLE OF CONTENTS & SYSTEM OVERVIEW                    -->
<!-- ============================================================== -->
<div class="page-break"></div>

<span class="section-tag">Executive Summary</span>
<h1>1. Platform Architecture & Tech Stack</h1>

<p>
  The DMK Legal Wing web application is designed as an institutional, authoritative, digital newsroom and administrative control hub. Built from the ground up to reject generic AI SaaS templates, it employs strict broadsheet editorial typography, hairlines, and authentic party colors (DMK Red <code>#E31E24</code>, Ink Black <code>#111111</code>, Warm Parchment <code>#FAF8F5</code>).
</p>

<div class="grid-3 avoid-break">
  <div class="card">
    <h4>Frontend Framework</h4>
    <p><strong>Next.js 16.4.6</strong> with React 19 & Turbopack. Fully SSR and Partial Prerendering (PPR) enabled across 28 routes.</p>
  </div>
  <div class="card">
    <h4>Styling & Aesthetics</h4>
    <p><strong>Tailwind CSS v4</strong> with bespoke broadsheet typography (Catamaran, Kavivanar, Helvetica Now Display).</p>
  </div>
  <div class="card">
    <h4>Persistence Layer</h4>
    <p><strong>File-based Atomic JSON DB</strong> located in <code>data/db/</code>. Thread-safe writes with zero external database dependencies.</p>
  </div>
</div>

<h2>Table of System Modules & URLs</h2>
<table>
  <thead>
    <tr>
      <th style="width: 14%;">Route Path</th>
      <th style="width: 22%;">Module Name</th>
      <th style="width: 38%;">Core Functionality</th>
      <th style="width: 26%;">Key Integration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/</code></td>
      <td><strong>Frontpage Portal</strong></td>
      <td>Lead editorial, metrics counter, photojournalism, real GIS district map</td>
      <td>DmkHeroSlider, TamilNaduMap</td>
    </tr>
    <tr>
      <td><code>/about</code></td>
      <td><strong>Historical Treatise</strong></td>
      <td>50-year constitutional litigation timeline, 4 ideological mentors, archives</td>
      <td>Historical Milestone Engine</td>
    </tr>
    <tr>
      <td><code>/ideology</code></td>
      <td><strong>Ideological Foundations</strong></td>
      <td>6 Core Doctrines (Social Justice, 69% Quota, Federalism, Tamil in Courts)</td>
      <td>Interactive Slide Engine & Treaty</td>
    </tr>
    <tr>
      <td><code>/structure</code></td>
      <td><strong>Organisational Chart</strong></td>
      <td>3-Tier executive command tree, officer credentials dossier modals</td>
      <td>OrgChart Component, Dossiers</td>
    </tr>
    <tr>
      <td><code>/districts</code></td>
      <td><strong>74 District Registry</strong></td>
      <td>Real SVG geographic Tamil Nadu map, zonal filtering, direct phone call deck</td>
      <td>Real GIS Paths, Direct Dial</td>
    </tr>
    <tr>
      <td><code>/news</code></td>
      <td><strong>Editorial Newsroom</strong></td>
      <td>Press bureau masthead, front-page lead story, Court Watch case tracker</td>
      <td>NewsroomMasthead, PressArchive</td>
    </tr>
    <tr>
      <td><code>/news/[id]</code></td>
      <td><strong>Article Reader</strong></td>
      <td>Individual news release, reading progress indicator, share/print actions</td>
      <td>Bilingual Content Dispatch</td>
    </tr>
    <tr>
      <td><code>/activities</code></td>
      <td><strong>Conferences & Events</strong></td>
      <td>State advocate conferences, seminars, legal aid camps, active filters</td>
      <td>Calendar Engine, Event API</td>
    </tr>
    <tr>
      <td><code>/resources</code></td>
      <td><strong>Legal Document Vault</strong></td>
      <td>Downloadable constitutional petitions, judgments, government orders</td>
      <td>Resource Filter, PDF Viewer</td>
    </tr>
    <tr>
      <td><code>/contact</code></td>
      <td><strong>Advocate Registration</strong></td>
      <td>Online Bar membership enrollment & Citizen legal grievance submission</td>
      <td>POST API, 74 Districts Sync</td>
    </tr>
    <tr>
      <td><code>/admin</code></td>
      <td><strong>State Control Console</strong></td>
      <td>8-domain master control hub, database sync heartbeat, role switching</td>
      <td>Full CRUD REST API Deck</td>
    </tr>
  </tbody>
</table>

<div class="callout-box avoid-break">
  <strong>Anti-AI Human Design Guarantee:</strong>
  The interface deliberately avoids floating gradients, generic pill cards, excessive rounded corners, and placeholder visuals. Instead, it features asymmetric multi-column newspaper layouts, official documentary imagery, and rigorous Tamil/English institutional typography.
</div>

<!-- ============================================================== -->
<!-- PAGE 3: HOME PAGE & CARTOGRAPHY MODULE                         -->
<!-- ============================================================== -->
<div class="page-break"></div>

<span class="section-tag">Public Experience</span>
<h1>2. Home Page & District Cartography</h1>

<p>
  The home page acts as the official state wire and legal collective gateway. It delivers live metrics, breaking executive statements, and cartographic visualization.
</p>

<h2>Home Page Sections Breakdown</h2>
<div class="grid-2 avoid-break">
  <div class="card">
    <h4>1. Editorial Hero Slider</h4>
    <p>Displays 4 prominent photographic announcements with bilingual headlines, auto-play ticker, pause controls, and direct article routing.</p>
  </div>
  <div class="card">
    <h4>2. Official Metrics Strip</h4>
    <p>Black & Red ribbon highlighting 3,500+ Registered Advocates, 74/74 District Jurisdictions, 50+ Years Jurisprudence, and 69% Reservation defense.</p>
  </div>
  <div class="card">
    <h4>3. Lead Editorial & 4 Mentors</h4>
    <p>Broadsheet dropcap dispatch with official photography of Periyar, Anna, Kalaignar, and Stalin, accompanied by the party slogan.</p>
  </div>
  <div class="card">
    <h4>4. Photojournalism & Dispatches</h4>
    <p>Two-column story layout highlighting upcoming and concluded legal workshops, moot courts, and press briefings.</p>
  </div>
</div>

<h2>District Structure & 74 Party Units Interactive Map</h2>
<p>
  Built in <code>src/components/TamilNaduMap.tsx</code> and powered by survey-accurate cartographic data in <code>src/data/tamilNaduMapData.ts</code>.
</p>

<div class="accent-box avoid-break">
  <h3>Real Geographic SVG Cartography Specifications</h3>
  <p>
    <strong>ViewBox Coordinates:</strong> <code>7623.34 -1356.27 411.3 548.63</code> (Accurate Tamil Nadu & Puducherry State Coastline).<br>
    <strong>District Coverage:</strong> 38 Real Administrative Boundaries dynamically mapped to 74 Party Organizational Jurisdictions.<br>
    <strong>Interactive Behavior:</strong> Clicking or hovering any district lights up the polygon in vibrant gold (<code>#F59E0B</code>), updates the zoomed district inset card, and renders that region's party secretariats.
  </p>
</div>

<h3>District Units Mapping Structure (Samples from 74 Districts Registry)</h3>
<table>
  <thead>
    <tr>
      <th style="width: 8%;">No.</th>
      <th style="width: 22%;">Party District</th>
      <th style="width: 20%;">Parent Admin Unit</th>
      <th style="width: 25%;">District Organiser</th>
      <th style="width: 25%;">Direct Contact Phone</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>01</td>
      <td><strong>Ariyalur</strong></td>
      <td>Ariyalur</td>
      <td>Adv. Selvam</td>
      <td><code>9786530179</code></td>
    </tr>
    <tr>
      <td>02-07</td>
      <td><strong>Chennai (East, North, West, NE, South, SW)</strong></td>
      <td>Chennai Metropolitan</td>
      <td>Duraikannan, Kanikkai Nadhan, Devendran, Lakshmikanthan, etc.</td>
      <td><code>9094772323</code>, <code>9940536979</code>, <code>9840060975</code></td>
    </tr>
    <tr>
      <td>08-10</td>
      <td><strong>Covai (City, North, South)</strong></td>
      <td>Coimbatore</td>
      <td>S. Anbuchezhiyan, Palanisami, Marutharaj</td>
      <td><code>9842295720</code>, <code>9787382526</code>, <code>9842285585</code></td>
    </tr>
    <tr>
      <td>40-42</td>
      <td><strong>Salem (Central, East, West)</strong></td>
      <td>Salem</td>
      <td>Ram Prakash, S. Arul, S. Sellappan</td>
      <td><code>9788321401</code>, <code>9894486668</code>, <code>9842735591</code></td>
    </tr>
    <tr>
      <td>55-56</td>
      <td><strong>Thiruvannamalai (North, South)</strong></td>
      <td>Tiruvannamalai</td>
      <td>Ashok. G, N.P. Karthikeyan</td>
      <td><code>9842312200</code>, <code>9443542842</code></td>
    </tr>
    <tr>
      <td>64-66</td>
      <td><strong>Trichy (North, South, Central)</strong></td>
      <td>Tiruchirappalli</td>
      <td>M.G. Rajan, KAV. Dinakaran, Karal Victor Veerasamiy</td>
      <td><code>9942464435</code>, <code>9345128847</code>, <code>7598210909</code></td>
    </tr>
    <tr>
      <td>73-74</td>
      <td><strong>Puducherry & Karaikal</strong></td>
      <td>Union Territory</td>
      <td>S. Parimalam, S.R. Vetriselvan</td>
      <td><code>9842382410</code>, <code>9443127007</code></td>
    </tr>
  </tbody>
</table>

<div class="callout-box avoid-break">
  <strong>Direct Dial & Modal Features:</strong>
  Each party district row features an inspection icon (opens full official dossier) and a direct call button (triggers smartphone dialer or VoIP). The yellow <strong>"View More ↗"</strong> pill launches a full-screen searchable gazette of all 74 districts.
</div>

<!-- ============================================================== -->
<!-- PAGE 4: EXECUTIVE ORGANISATIONAL HIERARCHY TREE                -->
<!-- ============================================================== -->
<div class="page-break"></div>

<span class="section-tag">State Command Structure</span>
<h1>3. Executive Organisational Chart</h1>

<p>
  Located at <code>/structure</code> and componentized in <code>src/components/OrgChart.tsx</code>, this module presents the 3-tier constitutional hierarchy connecting the President, Secretary, and three executive wings across Tamil Nadu.
</p>

<h2>3-Tier Hierarchy Specifications</h2>

<div class="card avoid-break" style="border-left: 4px solid #1E40AF; margin-bottom: 12px;">
  <span class="badge badge-black">Tier 1: Apex Leadership</span>
  <h3 style="color: #1E40AF; margin: 4px 0;">President: R. Viduthalai (Senior Advocate)</h3>
  <p>
    <strong>Station:</strong> Chennai • Supreme Court of India & Madras High Court.<br>
    <strong>Designation:</strong> President, DMK Legal Wing • Former Advocate General of Tamil Nadu.<br>
    <strong>Jurisdiction:</strong> Apex constitutional advisory, constitutional bench litigations, social justice defenses.
  </p>
</div>

<div class="card avoid-break" style="border-left: 4px solid #E31E24; margin-bottom: 12px;">
  <span class="badge badge-red">Tier 2: Executive Command</span>
  <h3 style="color: #E31E24; margin: 4px 0;">Secretary: N.R. Elango (Senior Advocate & M.P. Rajya Sabha)</h3>
  <p>
    <strong>Station:</strong> Chennai • Supreme Court of India & Madras High Court.<br>
    <strong>Designation:</strong> State Secretary, DMK Legal Wing • Member of Parliament.<br>
    <strong>Jurisdiction:</strong> Operational command of 74 district wings, legislative policy formulation, bar defense.
  </p>
</div>

<h2>Tier 3: Three Parallel Executive Branches</h2>
<div class="grid-3 avoid-break">
  <div class="card" style="border-top: 3px solid #E31E24;">
    <h4>Joint Secretaries (9)</h4>
    <p style="font-size: 7.5pt; color: #E31E24; font-weight: bold; margin-bottom: 6px;">Zonal Administration & Regional Bar Coordination</p>
    <ol style="font-size: 7.5pt; margin-left: 14px;">
      <li>I. Parandhaman • Chennai (MLA)</li>
      <li>K.S. Ravichandran • Chennai</li>
      <li>N. Maniraj • Karur</li>
      <li>K.M. Dhandapani • Coimbatore</li>
      <li>Radhakrishnan • Erode</li>
      <li>Arul Mozhi • Coimbatore</li>
      <li>R. Thamaraiselvan • Dharmapuri (Ex-MP)</li>
      <li>J. Pachaiyappan • Chennai</li>
      <li>Surya Vetrikondan • Chennai</li>
    </ol>
  </div>

  <div class="card" style="border-top: 3px solid #111111;">
    <h4>Deputy Secretaries (5)</h4>
    <p style="font-size: 7.5pt; color: #111111; font-weight: bold; margin-bottom: 6px;">Secretariat Administration & Training</p>
    <ol style="font-size: 7.5pt; margin-left: 14px;">
      <li>K. Chandru • Chennai</li>
      <li>Ragu • Chennai</li>
      <li>Dr. G. Chandrabose • Chennai</li>
      <li>Marudhu Ganesh • Chennai</li>
      <li>Raja Mohamed • Tirunelveli</li>
    </ol>
  </div>

  <div class="card" style="border-top: 3px solid #E31E24;">
    <h4>Head Office Advocates (9)</h4>
    <p style="font-size: 7.5pt; color: #E31E24; font-weight: bold; margin-bottom: 6px;">Anna Arivalayam Headquarters Chamber</p>
    <ol style="font-size: 7.5pt; margin-left: 14px;">
      <li>K.J. Saravanan • Chennai</li>
      <li>V. Kavi Ganesan • Chennai</li>
      <li>K. Maraimalai • Nagapattinam</li>
      <li>Suvai Suresh • Villupuram</li>
      <li>Manoj • Thoothukudi</li>
      <li>Dinesh • Nagapattinam</li>
      <li>M.S.P. Veeramani • Tiruchi</li>
      <li>Minjur Suresh • Thiruvallur</li>
      <li>Kalanidhi • Madurai North</li>
    </ol>
  </div>
</div>

<div class="callout-box avoid-break">
  <strong>Interactive Dossier Inspection:</strong>
  Clicking any of the 25 leadership boxes triggers a modal displaying the officer's Bar Council enrollment number, specific court affiliations, biography, and jurisdictional portfolio in both English and Tamil.
</div>

<!-- ============================================================== -->
<!-- PAGE 5: EDITORIAL NEWSROOM & PRESS BUREAU                      -->
<!-- ============================================================== -->
<div class="page-break"></div>

<span class="section-tag">Media & Legal Wire</span>
<h1>4. Editorial Newsroom & Press Bureau</h1>

<p>
  Located at <code>/news</code> and <code>/news/[id]</code>, the Editorial Newsroom combines the authority of a digital legal gazette with the timeliness of a modern press office.
</p>

<h2>Core Newsroom Sub-Modules</h2>
<div class="grid-2 avoid-break">
  <div class="card">
    <h4>Section A — Newsroom Masthead</h4>
    <p>Established broadsheet masthead with current date, Chennai location marker, live weather, court ticker, and compact category bar.</p>
  </div>
  <div class="card">
    <h4>Section B — Front-Page Lead Story</h4>
    <p>Asymmetrical 60/40 split with lead photographic visual, dropcap narrative, case citation badge, and "Read Full Statement →" action.</p>
  </div>
  <div class="card">
    <h4>Section C — Press Office News Feed</h4>
    <p>Categorized list of official press releases, resolutions, and gazette notifications with thin dividing lines and date stamps.</p>
  </div>
  <div class="card">
    <h4>Section D — Court Watch & Legal Developments</h4>
    <p>Tracked Supreme Court and High Court proceedings, constitutional bench arguments, writ petitions, and verified judgments.</p>
  </div>
</div>

<h2>News Filtering & Categorization Matrix</h2>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">Category Filter</th>
      <th style="width: 45%;">Content Scope</th>
      <th style="width: 30%;">Issuing Authority</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Press Releases</strong></td>
      <td>Official statements on government legislation, judicial reforms, and state legal conventions</td>
      <td>Headquarters Press Bureau</td>
    </tr>
    <tr>
      <td><strong>Official Statements</strong></td>
      <td>Legal analyses released by President or Secretary on constitutional crises or Governor actions</td>
      <td>President / Secretary Chamber</td>
    </tr>
    <tr>
      <td><strong>Court Watch</strong></td>
      <td>Direct reports from Madras High Court Principal & Madurai Benches, and Supreme Court matters</td>
      <td>Senior Standing Counsel Desk</td>
    </tr>
    <tr>
      <td><strong>Resolutions</strong></td>
      <td>Formal resolutions adopted at State Advocate Conferences and All-District meetings</td>
      <td>General Cadre Council</td>
    </tr>
    <tr>
      <td><strong>Gazette Notifications</strong></td>
      <td>Statutory announcements, appointment rosters, and advocate fellowship circulars</td>
      <td>Legal Secretariat Registrar</td>
    </tr>
  </tbody>
</table>

<div class="callout-box avoid-break">
  <strong>Dynamic Lead Story Switching:</strong>
  Administrators can toggle any story to become the front-page lead story via the admin console, immediately updating both the home page and newsroom spotlight without code rebuilds.
</div>

<!-- ============================================================== -->
<!-- PAGE 6: REGISTRATION, GRIEVANCE & DIGITAL LIBRARY              -->
<!-- ============================================================== -->
<div class="page-break"></div>

<span class="section-tag">Public Services & Vault</span>
<h1>5. Advocate Enrollment & Citizen Desk</h1>

<p>
  Located at <code>/contact</code>, this dual-purpose portal serves both advocate cadre enrollment and citizen pro-bono assistance requests.
</p>

<h2>Portal Form Workflows</h2>
<div class="grid-2 avoid-break">
  <div class="card" style="border-left: 4px solid #E31E24;">
    <h4>Advocate Membership Registration</h4>
    <p style="margin-bottom: 6px;">Enrolls practicing advocates into the DMK Legal Wing cadre database.</p>
    <ul style="font-size: 7.5pt;">
      <li><strong>Full Name & Tamil Name:</strong> Bilingual identity logging</li>
      <li><strong>Bar Council Enrollment No.:</strong> Mandatory (e.g. <code>MS/1234/2018</code>)</li>
      <li><strong>Jurisdiction Unit:</strong> Dropdown populated with all 74 party districts</li>
      <li><strong>Practice Domain:</strong> Constitutional, Criminal, Civil, Labor, Corporate</li>
      <li><strong>Experience Tier:</strong> Junior (0-5y), Mid (5-15y), Senior (15y+)</li>
    </ul>
  </div>

  <div class="card" style="border-left: 4px solid #111111;">
    <h4>Citizen Legal Grievance Desk</h4>
    <p style="margin-bottom: 6px;">Receives requests for pro-bono legal counsel and constitutional defense.</p>
    <ul style="font-size: 7.5pt;">
      <li><strong>Petitioner Details:</strong> Name, phone, email, and address</li>
      <li><strong>Grievance Category:</strong> Land rights, Police excesses, Civil rights, Labor</li>
      <li><strong>Urgency Level:</strong> Normal, High, Critical / Urgent Habeas Corpus</li>
      <li><strong>Automatic Dispatch:</strong> Assigned to respective District Organiser</li>
      <li><strong>Tracking ID:</strong> Generated for petition reference</li>
    </ul>
  </div>
</div>

<h2>Digital Legal Vault (`/resources`)</h2>
<p>
  Houses crucial historical and legal documents with direct download links and metadata tags.
</p>
<table>
  <thead>
    <tr>
      <th style="width: 30%;">Document Title</th>
      <th style="width: 20%;">Category</th>
      <th style="width: 25%;">Constitutional Significance</th>
      <th style="width: 25%;">File Specs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Rajamannar Committee Report</strong></td>
      <td>State Autonomy</td>
      <td>Foundational treatise on Indian federal devolution & Article 356 limits</td>
      <td>PDF • 4.2 MB • Bilingual</td>
    </tr>
    <tr>
      <td><strong>69% Reservation Ninth Schedule Defense</strong></td>
      <td>Social Justice</td>
      <td>Tamil Nadu Act 45/1994 Supreme Court protective submissions</td>
      <td>PDF • 8.1 MB • Tamil/English</td>
    </tr>
    <tr>
      <td><strong>Article 200 Governor Assent Submissions</strong></td>
      <td>Constitutional Law</td>
      <td>Supreme Court petitions challenging indefinite delays on legislative bills</td>
      <td>PDF • 2.8 MB • English</td>
    </tr>
    <tr>
      <td><strong>Self-Respect Marriage Act (Sec 7A) Compendium</strong></td>
      <td>Statutory Reform</td>
      <td>Historic 1967 amendment legalizing priestless marriages with case law</td>
      <td>PDF • 1.9 MB • Bilingual</td>
    </tr>
  </tbody>
</table>

<!-- ============================================================== -->
<!-- PAGE 7: STATE SECRETARIAT ADMIN CONTROL CONSOLE                -->
<!-- ============================================================== -->
<div class="page-break"></div>

<span class="section-tag">Back-Office Command</span>
<h1>6. State Secretariat Control Console (`/admin`)</h1>

<p>
  Designed as an institutional high-security control center, the Admin Console empowers the State Legal Secretariat to monitor, verify, and publish data across the entire organization.
</p>

<div class="accent-box avoid-break">
  <h3>Operational Status & Security Guard</h3>
  <p>
    <strong>Access Guard:</strong> Institutional credential authentication with session locking.<br>
    <strong>Live Backend Status:</strong> Real-time HTTP heartbeat checking <code>/api/registrations</code> and database integrity.<br>
    <strong>Role Switcher:</strong> Instantly toggles UI between <code>SUPER ADMIN</code>, <code>EDITORIAL</code>, and <code>LEGAL DESK</code>.
  </p>
</div>

<h2>The 8 Command Domains</h2>
<table>
  <thead>
    <tr>
      <th style="width: 6%;">#</th>
      <th style="width: 24%;">Command Domain</th>
      <th style="width: 45%;">Operational Scope & Workflows</th>
      <th style="width: 25%;">Backend Entity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>01</td>
      <td><strong>Telemetry & Overview</strong></td>
      <td>Live database counters, unverified application alerts, unresolved grievances queue, quick dispatch deck</td>
      <td>System Telemetry</td>
    </tr>
    <tr>
      <td>02</td>
      <td><strong>Advocate Applications</strong></td>
      <td>Verify Bar Council numbers, approve/reject members, filter by status, inspect candidate dossiers</td>
      <td><code>data/db/registrations.json</code></td>
    </tr>
    <tr>
      <td>03</td>
      <td><strong>Citizen Legal Desk</strong></td>
      <td>Manage public grievances, update status (Pending, Under Review, Resolved), export dispatches</td>
      <td><code>data/db/enquiries.json</code></td>
    </tr>
    <tr>
      <td>04</td>
      <td><strong>Editorial Newsroom</strong></td>
      <td>Create/edit bilingual news articles, set front-page Lead Story flag, track case references</td>
      <td><code>data/db/news.json</code></td>
    </tr>
    <tr>
      <td>05</td>
      <td><strong>74 District Registry</strong></td>
      <td>Search all 74 party units, update organiser names, contact numbers, court complex addresses</td>
      <td><code>data/db/districts.json</code></td>
    </tr>
    <tr>
      <td>06</td>
      <td><strong>Legal Dossiers & Vault</strong></td>
      <td>Upload/publish constitutional treaties, categorize by law domain, manage file downloads</td>
      <td><code>data/db/resources.json</code></td>
    </tr>
    <tr>
      <td>07</td>
      <td><strong>Press Photojournalism</strong></td>
      <td>Manage photographic archive, event tags, high-resolution imagery, and album classifications</td>
      <td><code>data/db/gallery.json</code></td>
    </tr>
    <tr>
      <td>08</td>
      <td><strong>State Conferences</strong></td>
      <td>Publish legal conventions, venue details, speaker rosters, date schedules, and registration links</td>
      <td><code>data/db/events.json</code></td>
    </tr>
  </tbody>
</table>

<div class="callout-box avoid-break">
  <strong>Atomic File Persistence:</strong>
  All changes made in the admin portal write synchronously to disk via <code>src/lib/serverDb.ts</code> using atomic temp-file swaps, eliminating database corruption risk while ensuring immediate reflection across all public pages.
</div>

<!-- ============================================================== -->
<!-- PAGE 8: TECHNICAL API SPECIFICATION & DATABASE SCHEMAS         -->
<!-- ============================================================== -->
<div class="page-break"></div>

<span class="section-tag">API & Data Layer</span>
<h1>7. REST API Engine & Data Specifications</h1>

<p>
  The backend consists of 13 REST API endpoints implemented via Next.js App Router route handlers in <code>src/app/api/</code>.
</p>

<h2>REST API Endpoints Specification</h2>
<table>
  <thead>
    <tr>
      <th style="width: 10%;">Method</th>
      <th style="width: 25%;">Endpoint URL</th>
      <th style="width: 40%;">Description & Payload</th>
      <th style="width: 25%;">Response Codes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/registrations</code></td>
      <td>Retrieves list of registered advocates with optional status query</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/registrations</code></td>
      <td>Submits new advocate enrollment application with validation</td>
      <td>201 Created, 400 Bad Request</td>
    </tr>
    <tr>
      <td><code>PATCH</code></td>
      <td><code>/api/registrations/[id]</code></td>
      <td>Updates candidate status (<code>pending</code>, <code>verified</code>, <code>approved</code>, <code>rejected</code>)</td>
      <td>200 OK, 404 Not Found</td>
    </tr>
    <tr>
      <td><code>DELETE</code></td>
      <td><code>/api/registrations/[id]</code></td>
      <td>Permanently deletes application record from database</td>
      <td>200 OK, 404 Not Found</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/enquiries</code></td>
      <td>Fetches citizen grievances with status/urgency filtering</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/enquiries</code></td>
      <td>Submits citizen grievance with automatic timestamp & ID generation</td>
      <td>201 Created</td>
    </tr>
    <tr>
      <td><code>PATCH</code></td>
      <td><code>/api/enquiries/[id]</code></td>
      <td>Updates enquiry status (<code>new</code>, <code>in-progress</code>, <code>resolved</code>) and notes</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/news</code></td>
      <td>Fetches news feed; supports <code>category</code> filter and lead story priority</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/news</code></td>
      <td>Publishes bilingual news item with optional <code>isLeadStory</code> toggle</td>
      <td>201 Created</td>
    </tr>
    <tr>
      <td><code>PATCH</code></td>
      <td><code>/api/news/[id]</code></td>
      <td>Edits article content or toggles lead story status</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/districts</code></td>
      <td>Returns all 74 verified party districts with phone numbers & courts</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/resources</code></td>
      <td>Lists downloadable legal documents with category tags</td>
      <td>200 OK</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/events</code></td>
      <td>Returns upcoming and past state conferences and seminars</td>
      <td>200 OK</td>
    </tr>
  </tbody>
</table>

<h2>Bilingual Language System Architecture</h2>
<p>
  Implemented in <code>src/context/LanguageContext.tsx</code> and <code>src/data/translations.ts</code>.
</p>
<div class="grid-2 avoid-break">
  <div class="card">
    <h4>Persistent Preference</h4>
    <p>User language preference (<code>ta</code> or <code>en</code>) is stored in browser <code>localStorage</code> and synced across sessions without page reloads.</p>
  </div>
  <div class="card">
    <h4>Dual-Script Type Schema</h4>
    <p>All database records maintain parallel bilingual fields: <code>name: { en: string, ta: string }</code>, ensuring full accessibility in Tamil and English.</p>
  </div>
</div>

<div class="callout-box avoid-break" style="margin-top: 20px;">
  <strong>Document Verification & Certification:</strong><br>
  This technical blueprint reflects the complete, live codebase of the DMK Legal Wing web portal. All routes, endpoints, components, and data structures have been built, compiled, and verified for production deployment.
</div>

</body>
</html>
"""

# Save html file
html_file = os.path.abspath("platform_documentation.html")
pdf_file = os.path.abspath("DMK_Legal_Wing_Platform_Documentation.pdf")

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML documentation generated at: {html_file}")

# Convert to PDF using Edge headless
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_file}",
    f"file:///{html_file.replace(os.sep, '/')}"
]

print("Executing PDF generation...")
result = subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(pdf_file):
    size_kb = os.path.getsize(pdf_file) / 1024
    print(f"SUCCESS: Generated PDF at '{pdf_file}' ({size_kb:.1f} KB)")
else:
    print("FAILED to generate PDF:", result.stderr)
