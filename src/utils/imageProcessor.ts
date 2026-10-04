/**
 * Utility for removing studio / checkerboard backgrounds and adding a crisp
 * sticker-style silhouette outline around portraits, preserving the person,
 * face, hair, and clothing, and filling the surrounding space with the signature
 * profile theme color (#4a76ff / var(--first-color)).
 */

export interface ProcessedImages {
  transparent: string;
  themeFilled: string;
}

export function processProfileImage(
  imageSrc: string,
  targetColor: { r: number; g: number; b: number } = { r: 74, g: 118, b: 255 },
  outlineWidth: number = 8
): Promise<ProcessedImages> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Step 1: Create Canvas for Transparent version
        const canvasTransparent = document.createElement('canvas');
        canvasTransparent.width = width;
        canvasTransparent.height = height;
        const ctxTrans = canvasTransparent.getContext('2d');
        if (!ctxTrans) throw new Error('Canvas 2D context not available');

        ctxTrans.drawImage(img, 0, 0, width, height);
        const imgDataTrans = ctxTrans.getImageData(0, 0, width, height);
        const dataTrans = imgDataTrans.data;

        // Step 2: Create Canvas for Theme-Filled version
        const canvasFilled = document.createElement('canvas');
        canvasFilled.width = width;
        canvasFilled.height = height;
        const ctxFilled = canvasFilled.getContext('2d');
        if (!ctxFilled) throw new Error('Canvas 2D context not available');

        ctxFilled.drawImage(img, 0, 0, width, height);
        const imgDataFilled = ctxFilled.getImageData(0, 0, width, height);
        const dataFilled = imgDataFilled.data;

        const totalPixels = width * height;

        // BFS flood fill starting from top & upper sides (protecting suit jacket & shirt at bottom)
        const visitedBg = new Uint8Array(totalPixels);
        const queue: number[] = [];

        const isBgColor = (r: number, g: number, b: number): boolean => {
          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);
          // Studio white, light gray, or checkerboard background
          return minVal > 195 && (maxVal - minVal) < 45;
        };

        // 1. Top border
        for (let x = 0; x < width; x++) {
          const p = x * 4;
          if (isBgColor(dataTrans[p], dataTrans[p + 1], dataTrans[p + 2])) {
            visitedBg[x] = 1;
            queue.push(x);
          }
        }

        // 2. Upper Left border (down until suit shoulder begins)
        for (let y = 1; y < height; y++) {
          const idx = y * width;
          const p = idx * 4;
          if (isBgColor(dataTrans[p], dataTrans[p + 1], dataTrans[p + 2])) {
            visitedBg[idx] = 1;
            queue.push(idx);
          } else {
            break;
          }
        }

        // 3. Upper Right border (down until suit shoulder begins)
        for (let y = 1; y < height; y++) {
          const idx = y * width + (width - 1);
          const p = idx * 4;
          if (isBgColor(dataTrans[p], dataTrans[p + 1], dataTrans[p + 2])) {
            visitedBg[idx] = 1;
            queue.push(idx);
          } else {
            break;
          }
        }

        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          const cx = curr % width;
          const cy = Math.floor(curr / width);

          const neighbors = [
            cx > 0 ? curr - 1 : -1,
            cx < width - 1 ? curr + 1 : -1,
            cy > 0 ? curr - width : -1,
            cy < height - 1 ? curr + width : -1,
          ];

          for (const n of neighbors) {
            if (n >= 0 && !visitedBg[n]) {
              const p = n * 4;
              if (isBgColor(dataTrans[p], dataTrans[p + 1], dataTrans[p + 2])) {
                visitedBg[n] = 1;
                queue.push(n);
              }
            }
          }
        }

        // Distance transform from person's silhouette to draw the outline
        const distToPerson = new Int16Array(totalPixels);
        distToPerson.fill(-1);

        const borderQueue: number[] = [];
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (visitedBg[idx]) {
              const hasFgNeighbor =
                (x > 0 && !visitedBg[idx - 1]) ||
                (x < width - 1 && !visitedBg[idx + 1]) ||
                (y > 0 && !visitedBg[idx - width]) ||
                (y < height - 1 && !visitedBg[idx + width]);

              if (hasFgNeighbor) {
                distToPerson[idx] = 1;
                borderQueue.push(idx);
              }
            } else {
              distToPerson[idx] = 0;
            }
          }
        }

        let bHead = 0;
        const maxOutlineRadius = Math.max(4, Math.round((width / 1792) * outlineWidth));
        while (bHead < borderQueue.length) {
          const curr = borderQueue[bHead++];
          const cDist = distToPerson[curr];
          if (cDist >= maxOutlineRadius + 2) continue;

          const cx = curr % width;
          const cy = Math.floor(curr / width);

          const neighbors = [
            cx > 0 ? curr - 1 : -1,
            cx < width - 1 ? curr + 1 : -1,
            cy > 0 ? curr - width : -1,
            cy < height - 1 ? curr + width : -1,
          ];

          for (const n of neighbors) {
            if (n >= 0 && visitedBg[n] && (distToPerson[n] === -1 || distToPerson[n] > cDist + 1)) {
              distToPerson[n] = cDist + 1;
              borderQueue.push(n);
            }
          }
        }

        const centerX = width * 0.5;
        const centerY = height * 0.38;
        const maxDist = Math.hypot(width * 0.5, height * 0.5);
        const edgeColor = { r: 15, g: 23, b: 42 };
        const outlineColor = { r: 255, g: 255, b: 255 };

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const p = idx * 4;
            const dist = distToPerson[idx];

            const distFromCenter = Math.hypot(x - centerX, y - centerY);
            const t = Math.min(1, Math.max(0, distFromCenter / maxDist));
            const fillR = Math.round(targetColor.r * (1 - t * 0.65) + edgeColor.r * (t * 0.65));
            const fillG = Math.round(targetColor.g * (1 - t * 0.65) + edgeColor.g * (t * 0.65));
            const fillB = Math.round(targetColor.b * (1 - t * 0.65) + edgeColor.b * (t * 0.65));

            if (dist === 0) {
              // Inside person
              dataTrans[p + 3] = 255;
            } else if (dist > 0 && dist <= maxOutlineRadius) {
              // Crisp white outline with smooth anti-aliased edge
              let alpha = 1.0;
              if (dist >= maxOutlineRadius - 1) {
                alpha = dist === maxOutlineRadius ? 0.65 : 0.85;
              }

              dataTrans[p] = outlineColor.r;
              dataTrans[p + 1] = outlineColor.g;
              dataTrans[p + 2] = outlineColor.b;
              dataTrans[p + 3] = Math.round(alpha * 255);

              dataFilled[p] = Math.round(outlineColor.r * alpha + fillR * (1 - alpha));
              dataFilled[p + 1] = Math.round(outlineColor.g * alpha + fillG * (1 - alpha));
              dataFilled[p + 2] = Math.round(outlineColor.b * alpha + fillB * (1 - alpha));
              dataFilled[p + 3] = 255;
            } else {
              // Outside outline (pure background)
              dataTrans[p + 3] = 0;

              dataFilled[p] = fillR;
              dataFilled[p + 1] = fillG;
              dataFilled[p + 2] = fillB;
              dataFilled[p + 3] = 255;
            }
          }
        }

        ctxTrans.putImageData(imgDataTrans, 0, 0);
        ctxFilled.putImageData(imgDataFilled, 0, 0);

        resolve({
          transparent: canvasTransparent.toDataURL('image/png'),
          themeFilled: canvasFilled.toDataURL('image/png'),
        });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });
}
