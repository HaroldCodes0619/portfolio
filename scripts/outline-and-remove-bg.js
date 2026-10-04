import { Jimp } from 'jimp';
import fs from 'fs';

async function main() {
  const sourcePath = 'public/assets/img/profile_original.png';
  if (!fs.existsSync(sourcePath)) {
    console.error('Source file not found:', sourcePath);
    return;
  }

  const img = await Jimp.read(sourcePath);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const totalPixels = w * h;

  console.log(`Processing image ${w}x${h} to remove background and add crisp silhouette outline (preserving suit & shirt)...`);

  const centerColor = { r: 74, g: 118, b: 255 }; // #4a76ff
  const edgeColor = { r: 15, g: 23, b: 42 };     // #0f172a deep navy

  // Outline width: 12px on 1792px wide image
  const outlineRadius = 12;
  const outlineColor = { r: 255, g: 255, b: 255 }; // Pure white sticker outline

  const imgTransparent = img.clone();
  const imgThemeFilled = img.clone();

  const dTrans = imgTransparent.bitmap.data;
  const dFilled = imgThemeFilled.bitmap.data;

  // Step 1: Detect background via BFS
  // Seed ONLY from top edge and upper side edges where background is guaranteed
  const isBg = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let queueHead = 0;
  let queueTail = 0;

  const isBgColor = (r, g, b) => {
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    // Background in studio and checkerboard images: bright and near-neutral
    return minVal > 195 && (maxVal - minVal) < 45;
  };

  // 1. Top border (y = 0)
  for (let x = 0; x < w; x++) {
    const p = x * 4;
    if (isBgColor(dTrans[p], dTrans[p + 1], dTrans[p + 2])) {
      isBg[x] = 1;
      queue[queueTail++] = x;
    }
  }

  // 2. Left border (from top down until suit shoulder begins)
  for (let y = 1; y < h; y++) {
    const idx = y * w;
    const p = idx * 4;
    if (isBgColor(dTrans[p], dTrans[p + 1], dTrans[p + 2])) {
      isBg[idx] = 1;
      queue[queueTail++] = idx;
    } else {
      break; // Hit dark suit shoulder
    }
  }

  // 3. Right border (from top down until suit shoulder begins)
  for (let y = 1; y < h; y++) {
    const idx = y * w + (w - 1);
    const p = idx * 4;
    if (isBgColor(dTrans[p], dTrans[p + 1], dTrans[p + 2])) {
      isBg[idx] = 1;
      queue[queueTail++] = idx;
    } else {
      break; // Hit dark suit shoulder
    }
  }

  console.log(`Starting BFS with ${queueTail} seeds (protected suit jacket and shirt)...`);

  while (queueHead < queueTail) {
    const curr = queue[queueHead++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < w - 1 ? curr + 1 : -1,
      cy > 0 ? curr - w : -1,
      cy < h - 1 ? curr + w : -1,
    ];

    for (const n of neighbors) {
      if (n >= 0 && !isBg[n]) {
        const p = n * 4;
        if (isBgColor(dTrans[p], dTrans[p + 1], dTrans[p + 2])) {
          isBg[n] = 1;
          queue[queueTail++] = n;
        }
      }
    }
  }

  console.log(`Identified ${queueTail} background pixels (${((queueTail / totalPixels) * 100).toFixed(1)}%).`);

  // Step 2: Compute distance transform from foreground to background to draw the outline
  const distToPerson = new Int16Array(totalPixels);
  distToPerson.fill(-1);

  const borderQueue = new Int32Array(totalPixels);
  let bHead = 0;
  let bTail = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (isBg[idx]) {
        const hasFgNeighbor =
          (x > 0 && !isBg[idx - 1]) ||
          (x < w - 1 && !isBg[idx + 1]) ||
          (y > 0 && !isBg[idx - w]) ||
          (y < h - 1 && !isBg[idx + w]);

        if (hasFgNeighbor) {
          distToPerson[idx] = 1;
          borderQueue[bTail++] = idx;
        }
      } else {
        distToPerson[idx] = 0; // inside person
      }
    }
  }

  console.log(`Seeded outline boundary with ${bTail} border pixels...`);

  while (bHead < bTail) {
    const curr = borderQueue[bHead++];
    const cDist = distToPerson[curr];
    if (cDist >= outlineRadius + 2) continue;

    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < w - 1 ? curr + 1 : -1,
      cy > 0 ? curr - w : -1,
      cy < h - 1 ? curr + w : -1,
    ];

    for (const n of neighbors) {
      if (n >= 0 && isBg[n] && (distToPerson[n] === -1 || distToPerson[n] > cDist + 1)) {
        distToPerson[n] = cDist + 1;
        borderQueue[bTail++] = n;
      }
    }
  }

  const centerX = w * 0.5;
  const centerY = h * 0.38;
  const maxDist = Math.hypot(w * 0.5, h * 0.5);

  // Step 3: Render outline & background
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p = idx * 4;
      const dist = distToPerson[idx];

      // Theme background fill color for this pixel
      const distFromCenter = Math.hypot(x - centerX, y - centerY);
      const t = Math.min(1, Math.max(0, distFromCenter / maxDist));
      const fillR = Math.round(centerColor.r * (1 - t * 0.65) + edgeColor.r * (t * 0.65));
      const fillG = Math.round(centerColor.g * (1 - t * 0.65) + edgeColor.g * (t * 0.65));
      const fillB = Math.round(centerColor.b * (1 - t * 0.65) + edgeColor.b * (t * 0.65));

      if (dist === 0) {
        // Inside person (face, hair, ears, tuxedo suit jacket, white shirt, bow tie)
        dTrans[p + 3] = 255;
        // dFilled already has original pixel
      } else if (dist > 0 && dist <= outlineRadius) {
        // Crisp white sticker outline
        let outlineAlpha = 1.0;
        if (dist >= outlineRadius - 1) {
          outlineAlpha = dist === outlineRadius ? 0.6 : 0.85;
        }

        // Transparent version: white outline
        dTrans[p] = outlineColor.r;
        dTrans[p + 1] = outlineColor.g;
        dTrans[p + 2] = outlineColor.b;
        dTrans[p + 3] = Math.round(outlineAlpha * 255);

        // Theme filled version: white outline blended over theme background
        dFilled[p] = Math.round(outlineColor.r * outlineAlpha + fillR * (1 - outlineAlpha));
        dFilled[p + 1] = Math.round(outlineColor.g * outlineAlpha + fillG * (1 - outlineAlpha));
        dFilled[p + 2] = Math.round(outlineColor.b * outlineAlpha + fillB * (1 - outlineAlpha));
        dFilled[p + 3] = 255;
      } else {
        // Outer background
        dTrans[p + 3] = 0;

        dFilled[p] = fillR;
        dFilled[p + 1] = fillG;
        dFilled[p + 2] = fillB;
        dFilled[p + 3] = 255;
      }
    }
  }

  // Save the updated assets
  await imgTransparent.write('public/assets/img/perfil.png');
  console.log('Saved transparent outlined portrait to public/assets/img/perfil.png');

  await imgThemeFilled.write('public/assets/img/about.jpg');
  await imgThemeFilled.write('public/assets/img/about.png');
  console.log('Saved theme-filled outlined portrait to public/assets/img/about.jpg');

  if (fs.existsSync('public/img')) {
    try {
      fs.copyFileSync('public/assets/img/perfil.png', 'public/img/perfil.png');
      fs.copyFileSync('public/assets/img/about.jpg', 'public/img/about.jpg');
    } catch (_) {}
  }

  console.log('Outline and background removal completed successfully!');
}

main().catch(console.error);
