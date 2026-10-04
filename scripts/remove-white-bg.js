import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function main() {
  const sourcePath = 'public/assets/img/perfil.png';
  const backupPath = 'public/assets/img/profile_original.png';

  // Backup original if not already backed up
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(sourcePath, backupPath);
    console.log('Original backed up to', backupPath);
  }

  const img = await Jimp.read(backupPath);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const totalPixels = w * h;

  console.log(`Processing image ${w}x${h} (${totalPixels} pixels)...`);

  // Target theme color for the profile (hsl(224, 89%, 60%) / #4a76ff)
  // Center color (vibrant theme blue) and edge color (deep royal navy)
  const centerColor = { r: 74, g: 118, b: 255 }; // #4a76ff
  const edgeColor = { r: 15, g: 23, b: 42 };     // #0f172a (dark theme bg) / deep navy

  // Two copies: one transparent (for home blob) and one filled with theme color (for about card)
  const imgTransparent = img.clone();
  const imgThemeFilled = img.clone();

  const dTrans = imgTransparent.bitmap.data;
  const dFilled = imgThemeFilled.bitmap.data;

  // Background detection via BFS
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let queueHead = 0;
  let queueTail = 0;

  const isWhiteBg = (r, g, b) => {
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    return minVal > 205 && (maxVal - minVal) < 35;
  };

  // Seed top and bottom borders
  for (let x = 0; x < w; x++) {
    // Top
    const pTop = x * 4;
    if (isWhiteBg(dTrans[pTop], dTrans[pTop + 1], dTrans[pTop + 2])) {
      visited[x] = 1;
      queue[queueTail++] = x;
    }
    // Bottom
    const bIdx = (h - 1) * w + x;
    const pBottom = bIdx * 4;
    if (isWhiteBg(dTrans[pBottom], dTrans[pBottom + 1], dTrans[pBottom + 2])) {
      visited[bIdx] = 1;
      queue[queueTail++] = bIdx;
    }
  }

  // Seed left and right borders
  for (let y = 0; y < h; y++) {
    const lIdx = y * w;
    const pLeft = lIdx * 4;
    if (!visited[lIdx] && isWhiteBg(dTrans[pLeft], dTrans[pLeft + 1], dTrans[pLeft + 2])) {
      visited[lIdx] = 1;
      queue[queueTail++] = lIdx;
    }

    const rIdx = y * w + (w - 1);
    const pRight = rIdx * 4;
    if (!visited[rIdx] && isWhiteBg(dTrans[pRight], dTrans[pRight + 1], dTrans[pRight + 2])) {
      visited[rIdx] = 1;
      queue[queueTail++] = rIdx;
    }
  }

  console.log(`Starting BFS with ${queueTail} seed pixels...`);

  while (queueHead < queueTail) {
    const curr = queue[queueHead++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    // 4-way neighbors
    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < w - 1 ? curr + 1 : -1,
      cy > 0 ? curr - w : -1,
      cy < h - 1 ? curr + w : -1,
    ];

    for (const n of neighbors) {
      if (n >= 0 && !visited[n]) {
        const p = n * 4;
        if (isWhiteBg(dTrans[p], dTrans[p + 1], dTrans[p + 2])) {
          visited[n] = 1;
          queue[queueTail++] = n;
        }
      }
    }
  }

  console.log(`BFS identified ${queueTail} background pixels (${((queueTail / totalPixels) * 100).toFixed(1)}% of image)`);

  // Max distance from portrait center for radial vignette
  const centerX = w * 0.5;
  const centerY = h * 0.38;
  const maxDist = Math.hypot(w * 0.5, h * 0.5);

  // Apply transformations
  for (let i = 0; i < totalPixels; i++) {
    if (visited[i]) {
      const p = i * 4;
      const x = i % w;
      const y = Math.floor(i / w);

      // Radial gradient between centerColor and edgeColor
      const dist = Math.hypot(x - centerX, y - centerY);
      const t = Math.min(1, Math.max(0, dist / maxDist));
      const fillR = Math.round(centerColor.r * (1 - t * 0.7) + edgeColor.r * (t * 0.7));
      const fillG = Math.round(centerColor.g * (1 - t * 0.7) + edgeColor.g * (t * 0.7));
      const fillB = Math.round(centerColor.b * (1 - t * 0.7) + edgeColor.b * (t * 0.7));

      // 1. Transparent version (Home blob)
      dTrans[p + 3] = 0; // alpha = 0

      // 2. Theme filled version (About card)
      dFilled[p] = fillR;
      dFilled[p + 1] = fillG;
      dFilled[p + 2] = fillB;
      dFilled[p + 3] = 255;
    }
  }

  // Feather edge transition (anti-aliasing)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (!visited[idx]) {
        // Has visited neighbor
        if (visited[idx - 1] || visited[idx + 1] || visited[idx - w] || visited[idx + w]) {
          const p = idx * 4;
          const r = dTrans[p];
          const g = dTrans[p + 1];
          const b = dTrans[p + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (lum > 185) {
            const factor = Math.max(0, Math.min(1, (255 - lum) / 70));
            dTrans[p + 3] = Math.round(factor * 255);

            const dist = Math.hypot(x - centerX, y - centerY);
            const t = Math.min(1, Math.max(0, dist / maxDist));
            const fillR = Math.round(centerColor.r * (1 - t * 0.7) + edgeColor.r * (t * 0.7));
            const fillG = Math.round(centerColor.g * (1 - t * 0.7) + edgeColor.g * (t * 0.7));
            const fillB = Math.round(centerColor.b * (1 - t * 0.7) + edgeColor.b * (t * 0.7));

            dFilled[p] = Math.round(r * factor + fillR * (1 - factor));
            dFilled[p + 1] = Math.round(g * factor + fillG * (1 - factor));
            dFilled[p + 2] = Math.round(b * factor + fillB * (1 - factor));
          }
        }
      }
    }
  }

  // Save transparent PNG to perfil.png
  await imgTransparent.write('public/assets/img/perfil.png');
  console.log('Saved transparent version to public/assets/img/perfil.png');

  // Save theme-filled JPG and PNG to about.jpg and about.png
  await imgThemeFilled.write('public/assets/img/about.jpg');
  await imgThemeFilled.write('public/assets/img/about.png');
  console.log('Saved theme-filled version to public/assets/img/about.jpg and about.png');

  // Also sync to public/img if it exists
  if (fs.existsSync('public/img')) {
    try {
      fs.copyFileSync('public/assets/img/perfil.png', 'public/img/perfil.png');
      fs.copyFileSync('public/assets/img/about.jpg', 'public/img/about.jpg');
    } catch (_) {}
  }

  console.log('Background removal and color filling completed successfully!');
}

main().catch(console.error);
