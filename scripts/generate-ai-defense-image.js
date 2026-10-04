import sharp from 'sharp';
import fs from 'fs';

async function generateAIDefenseImage() {
  const width = 1000;
  const height = 1000;

  // Exact vector reproduction of the AI Defense Coach Shield Crest
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradient for outer metallic silver shield -->
      <linearGradient id="silverLeft" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#cbd5e1" />
        <stop offset="60%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>
      <linearGradient id="silverRight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#cbd5e1" />
        <stop offset="50%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#64748b" />
      </linearGradient>

      <!-- Gradient for dark navy frame -->
      <linearGradient id="navyBorder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e3a5f" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>

      <!-- Shield Inner Fill: subtle vertical crease -->
      <linearGradient id="innerLeft" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f1f5f9" />
        <stop offset="100%" stop-color="#ffffff" />
      </linearGradient>
      <linearGradient id="innerRight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#e2e8f0" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>

      <!-- Book gradient -->
      <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e3a5f" />
        <stop offset="100%" stop-color="#0f2038" />
      </linearGradient>

      <!-- Shadow -->
      <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.35" />
      </filter>
    </defs>

    <!-- Background card container with dark backdrop -->
    <rect width="${width}" height="${height}" rx="32" fill="#060c18" />

    <!-- Ambient glow behind shield -->
    <circle cx="500" cy="500" r="340" fill="url(#navyBorder)" opacity="0.3" filter="blur(60px)" />

    <!-- Outer Shield Crest Path with Drop Shadow -->
    <g filter="url(#shieldShadow)">
      <!-- Outer Beveled Silver Rim -->
      <!-- Left half of silver rim -->
      <path d="M 500 50 Q 300 100 130 180 Q 150 560 500 950 L 500 50 Z" fill="url(#silverLeft)" />
      <!-- Right half of silver rim -->
      <path d="M 500 50 Q 700 100 870 180 Q 850 560 500 950 L 500 50 Z" fill="url(#silverRight)" />

      <!-- Inner Navy Ridge -->
      <path d="M 500 85 Q 320 130 170 200 Q 185 540 500 900 Q 815 540 830 200 Q 680 130 500 85 Z" fill="#0f1f38" />

      <!-- Inner Shield Body: Left White / Right Off-White -->
      <path d="M 500 115 Q 338 156 198 220 Q 212 522 500 862 L 500 115 Z" fill="url(#innerLeft)" />
      <path d="M 500 115 Q 662 156 802 220 Q 788 522 500 862 L 500 115 Z" fill="url(#innerRight)" />

      <!-- Neural Network Background Constellation Lines inside Shield -->
      <g stroke="#64748b" stroke-width="6" stroke-linecap="round" opacity="0.85">
        <!-- Top left network -->
        <line x1="260" y1="300" x2="350" y2="240" />
        <line x1="260" y1="300" x2="260" y2="440" />
        <line x1="260" y1="300" x2="380" y2="380" />

        <!-- Top right network -->
        <line x1="740" y1="300" x2="650" y2="240" />
        <line x1="740" y1="300" x2="740" y2="440" />
        <line x1="740" y1="300" x2="620" y2="380" />

        <!-- Bottom network -->
        <line x1="400" y1="780" x2="500" y2="840" />
        <line x1="600" y1="780" x2="500" y2="840" />
        <line x1="400" y1="780" x2="500" y2="720" />
        <line x1="600" y1="780" x2="500" y2="720" />
      </g>

      <!-- Background Network Nodes -->
      <g fill="#475569">
        <circle cx="260" cy="300" r="18" />
        <circle cx="350" cy="240" r="14" />
        <circle cx="740" cy="300" r="18" />
        <circle cx="650" cy="240" r="14" />
        <circle cx="400" cy="780" r="16" />
        <circle cx="600" cy="780" r="16" />
        <circle cx="500" cy="840" r="18" />
      </g>

      <!-- Center Elements: Graduation Cap on top of Book -->
      <!-- 1. Graduation Cap (Mortarboard) -->
      <g id="gradCap">
        <!-- Diamond Board -->
        <polygon points="500,180 670,250 500,320 330,250" fill="#2d3748" />
        <polygon points="500,180 500,320 330,250" fill="#3a475d" opacity="0.4" />
        
        <!-- Cap Skull Base -->
        <path d="M 400 280 L 400 345 Q 500 380 600 345 L 600 280 Q 500 315 400 280 Z" fill="#1a202c" />

        <!-- Tassel and button -->
        <circle cx="500" cy="250" r="10" fill="#1a202c" />
        <path d="M 500 250 Q 600 270 635 320 L 635 350 L 648 350 L 648 320 Q 600 265 500 250 Z" fill="#2d3748" />
      </g>

      <!-- 2. Open Book -->
      <g id="openBook">
        <!-- Book Base / Outlines -->
        <!-- Navy outer backing of open book -->
        <path d="M 500 450 Q 650 380 735 410 L 735 690 Q 650 670 500 740 Q 350 670 265 690 L 265 410 Q 350 380 500 450 Z" fill="url(#bookCover)" />

        <!-- Spine 3D Bevel -->
        <path d="M 488 456 L 488 746 L 512 746 L 512 456 Z" fill="#0a1220" />

        <!-- Left Open Page (White / Light Slate) -->
        <path d="M 482 460 Q 355 400 285 425 L 285 675 Q 355 650 482 715 Z" fill="#ffffff" stroke="#1e293b" stroke-width="12" stroke-linejoin="round" />

        <!-- Right Open Page (White / Light Slate) -->
        <path d="M 518 460 Q 645 400 715 425 L 715 675 Q 645 650 518 715 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="12" stroke-linejoin="round" />

        <!-- Inner Bevel lines for pages thickness -->
        <path d="M 285 675 L 250 695 Q 355 675 482 745 L 482 715 Q 355 650 285 675 Z" fill="#94a3b8" />
        <path d="M 715 675 L 750 695 Q 645 675 518 745 L 518 715 Q 645 650 715 675 Z" fill="#64748b" />

        <!-- Left Page Neural Network Diagram with "AI" in center node -->
        <g stroke="#334155" stroke-width="5" stroke-linecap="round">
          <!-- Lines connecting nodes -->
          <line x1="330" y1="470" x2="435" y2="495" />
          <line x1="330" y1="470" x2="355" y2="585" />
          <line x1="435" y1="495" x2="395" y2="550" />
          <line x1="320" y1="535" x2="395" y2="550" />
          <line x1="355" y1="585" x2="395" y2="550" />
          <line x1="330" y1="625" x2="395" y2="550" />
          <line x1="355" y1="585" x2="430" y2="625" />
          <line x1="395" y1="550" x2="430" y2="625" />
        </g>
        <g fill="#475569">
          <circle cx="330" cy="470" r="14" />
          <circle cx="435" cy="495" r="15" />
          <circle cx="320" cy="535" r="14" />
          <circle cx="330" cy="625" r="15" />
          <circle cx="430" cy="625" r="14" />
        </g>
        <!-- Center AI Node -->
        <circle cx="395" cy="550" r="28" fill="#334155" stroke="#ffffff" stroke-width="2" />
        <text x="395" y="557" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20" fill="#ffffff" text-anchor="middle">AI</text>

        <!-- Right Page Neural Network Diagram -->
        <g stroke="#334155" stroke-width="5" stroke-linecap="round">
          <!-- Lines connecting nodes on right page -->
          <line x1="560" y1="485" x2="655" y2="455" />
          <line x1="560" y1="485" x2="605" y2="535" />
          <line x1="655" y1="455" x2="605" y2="535" />
          <line x1="675" y1="540" x2="605" y2="535" />
          <line x1="500" y1="580" x2="605" y2="535" />
          <line x1="605" y1="535" x2="560" y2="640" />
          <line x1="605" y1="535" x2="635" y2="600" />
          <line x1="560" y1="640" x2="635" y2="600" />
        </g>
        <g fill="#475569">
          <circle cx="560" cy="485" r="14" />
          <circle cx="655" cy="455" r="16" />
          <circle cx="675" cy="540" r="14" />
          <circle cx="560" cy="640" r="15" />
          <circle cx="635" cy="600" r="14" />
        </g>
        <!-- Large hub node on right page -->
        <circle cx="605" cy="535" r="26" fill="#334155" />
      </g>
    </g>
  </svg>
  `;

  fs.writeFileSync('public/assets/img/ai_defense_coach.svg', svg.trim());
  console.log('Saved SVG to public/assets/img/ai_defense_coach.svg');

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/assets/img/ai_defense_coach.png');
  console.log('Saved PNG to public/assets/img/ai_defense_coach.png');

  if (fs.existsSync('public/img')) {
    try {
      fs.copyFileSync('public/assets/img/ai_defense_coach.png', 'public/img/ai_defense_coach.png');
      fs.copyFileSync('public/assets/img/ai_defense_coach.svg', 'public/img/ai_defense_coach.svg');
    } catch (_) {}
  }
}

generateAIDefenseImage().catch(console.error);
