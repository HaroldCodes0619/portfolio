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

  console.log(`Processing image ${w}x${h} to remove both white background AND suit...`);

  // Target theme color for the profile (hsl(224, 89%, 60%) / #4a76ff)
  const centerColor = { r: 74, g: 118, b: 255 }; // #4a76ff
  const edgeColor = { r: 15, g: 23, b: 42 };     // #0f172a (dark theme bg) / deep navy

  const imgTransparent = img.clone();
  const imgThemeFilled = img.clone();

  const dTrans = imgTransparent.bitmap.data;
  const dFilled = imgThemeFilled.bitmap.data;

  // 1. First, detect the white background via BFS from image borders
  const isBg = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let queueHead = 0;
  let queueTail = 0;

  const isWhiteBg = (r, g, b) => {
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    return minVal > 200 && (maxVal - minVal) < 40;
  };

  // Seed outer borders
  for (let x = 0; x < w; x++) {
    const pTop = x * 4;
    if (isWhiteBg(dTrans[pTop], dTrans[pTop + 1], dTrans[pTop + 2])) {
      isBg[x] = 1;
      queue[queueTail++] = x;
    }
    const bIdx = (h - 1) * w + x;
    const pBottom = bIdx * 4;
    if (isWhiteBg(dTrans[pBottom], dTrans[pBottom + 1], dTrans[pBottom + 2])) {
      isBg[bIdx] = 1;
      queue[queueTail++] = bIdx;
    }
  }

  for (let y = 0; y < h; y++) {
    const lIdx = y * w;
    const pLeft = lIdx * 4;
    if (!isBg[lIdx] && isWhiteBg(dTrans[pLeft], dTrans[pLeft + 1], dTrans[pLeft + 2])) {
      isBg[lIdx] = 1;
      queue[queueTail++] = lIdx;
    }
    const rIdx = y * w + (w - 1);
    const pRight = rIdx * 4;
    if (!isBg[rIdx] && isWhiteBg(dTrans[pRight], dTrans[pRight + 1], dTrans[pRight + 2])) {
      isBg[rIdx] = 1;
      queue[queueTail++] = rIdx;
    }
  }

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
        if (isWhiteBg(dTrans[p], dTrans[p + 1], dTrans[p + 2])) {
          isBg[n] = 1;
          queue[queueTail++] = n;
        }
      }
    }
  }

  console.log(`White background pixels: ${queueTail}`);

  // 2. Identify Suit Pixels:
  // - Chin ends around y = 1350
  // - Neck extends down to y = 1480-1520 in center (x between 720 and 1070)
  // - The suit jacket, shoulders, collar, bow tie, and shirt cover:
  //   * All pixels y >= 1530
  //   * Pixels between y = 1320 and 1530 where x < 740 or x > 1050 (shoulders)
  //   * Pixels in the neck area that are dark suit (bow tie/lapels) or white shirt collar
  const centerX = w * 0.5;
  const centerY = h * 0.38;
  const maxDist = Math.hypot(w * 0.5, h * 0.5);

  // Parabolic bottom neckline curve centered at x = 896
  const getNeckCutoff = (x) => {
    const dx = x - 896;
    // Elegant parabolic curve tapering down slightly at the sides
    return 1510 - 0.00055 * (dx * dx);
  };

  const isSuitPixel = (x, y, r, g, b) => {
    // Definitely below neck
    const cutoff = getNeckCutoff(x);
    if (y >= cutoff) return true;

    // Below chin level (y > 1320)
    if (y > 1320) {
      // Left shoulder area (outside neck)
      if (x < 740) return true;
      // Right shoulder area (outside neck)
      if (x > 1050) return true;

      // Dark suit lapel / bow tie pixels in collar area
      if (y > 1460 && r < 80 && g < 80 && b < 90) return true;

      // Crisp white shirt collar points
      if (y > 1470 && r > 210 && g > 210 && b > 210) return true;
    }

    return false;
  };

  // 3. Mark all pixels to be removed (white background OR suit)
  // We'll create an alpha weight map [0.0 to 1.0] where 1.0 = keep face/head, 0.0 = remove
  const keepWeight = new Float32Array(totalPixels);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p = idx * 4;
      const r = dTrans[p];
      const g = dTrans[p + 1];
      const b = dTrans[p + 2];

      if (isBg[idx]) {
        keepWeight[idx] = 0;
      } else if (isSuitPixel(x, y, r, g, b)) {
        keepWeight[idx] = 0;
      } else {
        // Pixel is part of face, hair, or neck
        // Smooth fade at the bottom edge of the neck
        const cutoff = getNeckCutoff(x);
        const distFromCutoff = cutoff - y;
        if (distFromCutoff < 30) {
          // Fade alpha smoothly between 0 and 30 pixels from the cutoff
          keepWeight[idx] = Math.max(0, Math.min(1, distFromCutoff / 30));
        } else {
          keepWeight[idx] = 1.0;
        }
      }
    }
  }

  // 4. Feather edges to remove any harsh boundary
  // Apply transformations:
  // For pixels with keepWeight < 1:
  // - Transparent image: alpha = keepWeight * 255
  // - Theme-filled image: lerp(targetColor, originalPixel, keepWeight)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p = idx * 4;
      const weight = keepWeight[idx];

      const r = dTrans[p];
      const g = dTrans[p + 1];
      const b = dTrans[p + 2];

      // Theme background fill color for this pixel
      const dist = Math.hypot(x - centerX, y - centerY);
      const t = Math.min(1, Math.max(0, dist / maxDist));
      const fillR = Math.round(centerColor.r * (1 - t * 0.65) + edgeColor.r * (t * 0.65));
      const fillG = Math.round(centerColor.g * (1 - t * 0.65) + edgeColor.g * (t * 0.65));
      const fillB = Math.round(centerColor.b * (1 - t * 0.65) + edgeColor.b * (t * 0.65));

      if (weight <= 0) {
        // 1. Transparent version: fully transparent
        dTrans[p + 3] = 0;

        // 2. Theme filled version: 100% theme color
        dFilled[p] = fillR;
        dFilled[p + 1] = fillG;
        dFilled[p + 2] = fillB;
        dFilled[p + 3] = 255;
      } else if (weight >= 1) {
        // Kept portrait pixel
        dTrans[p + 3] = 255;
        // dFilled already has original pixel
      } else {
        // Transition pixel (feathered / blended edge)
        dTrans[p + 3] = Math.round(weight * 255);

        dFilled[p] = Math.round(r * weight + fillR * (1 - weight));
        dFilled[p + 1] = Math.round(g * weight + fillG * (1 - weight));
        dFilled[p + 2] = Math.round(b * weight + fillB * (1 - weight));
        dFilled[p + 3] = 255;
      }
    }
  }

  // Save the updated files
  await imgTransparent.write('public/assets/img/perfil.png');
  console.log('Saved transparent face/head portrait (no suit, no white bg) to public/assets/img/perfil.png');

  await imgThemeFilled.write('public/assets/img/about.jpg');
  await imgThemeFilled.write('public/assets/img/about.png');
  console.log('Saved theme-filled portrait (no suit, no white bg) to public/assets/img/about.jpg');

  if (fs.existsSync('public/img')) {
    try {
      fs.copyFileSync('public/assets/img/perfil.png', 'public/img/perfil.png');
      fs.copyFileSync('public/assets/img/about.jpg', 'public/img/about.jpg');
    } catch (_) {}
  }

  console.log('Suit removal and background replacement completed successfully!');
}

main().catch(console.error);
