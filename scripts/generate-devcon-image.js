import sharp from 'sharp';
import fs from 'fs';

async function generateDevconImage() {
  const width = 1200;
  const height = 700;

  // Exact Devcon SVG logo with 4-circle O
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#000000" />
    
    <!-- DEVCON text -->
    <g transform="translate(600, 350)" text-anchor="middle" dominant-baseline="central">
      <!-- We construct precise vector shapes for DEVCON to ensure 100% font independence -->
      <g transform="translate(-480, -95)">
        <!-- D -->
        <path d="M 0 0 L 75 0 C 135 0 170 35 170 95 C 170 155 135 190 75 190 L 0 190 Z M 48 40 L 48 150 L 72 150 C 105 150 122 130 122 95 C 122 60 105 40 72 40 Z" fill="#ffffff" />
        
        <!-- E -->
        <path d="M 195 0 L 335 0 L 335 42 L 243 42 L 243 74 L 325 74 L 325 116 L 243 116 L 243 148 L 338 148 L 338 190 L 195 190 Z" fill="#ffffff" />
        
        <!-- V -->
        <path d="M 350 0 L 400 0 L 448 135 L 496 0 L 546 0 L 474 190 L 422 190 Z" fill="#ffffff" />
        
        <!-- C -->
        <path d="M 685 45 C 665 15 635 0 595 0 C 530 0 485 45 485 95 C 485 145 530 190 595 190 C 635 190 665 175 685 145 L 648 120 C 636 138 618 148 595 148 C 558 148 533 125 533 95 C 533 65 558 42 595 42 C 618 42 636 52 648 70 Z" fill="#ffffff" />
        
        <!-- O (4 colored circles) -->
        <!-- Center of O is around X: 735, Y: 95 -->
        <!-- Radius of each circle: 38px, spacing center: +/- 36px -->
        <g transform="translate(735, 95)">
          <!-- Top Left: Yellow -->
          <circle cx="-35" cy="-35" r="39" fill="#f5b800" />
          <!-- Top Right: Orange -->
          <circle cx="35" cy="-35" r="39" fill="#e86328" />
          <!-- Bottom Left: Purple -->
          <circle cx="-35" cy="35" r="39" fill="#8e3be8" />
          <!-- Bottom Right: Green -->
          <circle cx="35" cy="35" r="39" fill="#76bc21" />
        </g>
        
        <!-- N -->
        <path d="M 830 0 L 878 0 L 938 118 L 938 0 L 984 0 L 984 190 L 936 190 L 876 72 L 876 190 L 830 190 Z" fill="#ffffff" />
      </g>
    </g>
  </svg>
  `;

  fs.writeFileSync('public/assets/img/devcon.svg', svg.trim());
  console.log('Saved SVG to public/assets/img/devcon.svg');

  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/assets/img/devcon.png');
  console.log('Saved PNG to public/assets/img/devcon.png');

  if (fs.existsSync('public/img')) {
    try {
      fs.copyFileSync('public/assets/img/devcon.png', 'public/img/devcon.png');
      fs.copyFileSync('public/assets/img/devcon.svg', 'public/img/devcon.svg');
    } catch (_) {}
  }
}

generateDevconImage().catch(console.error);
