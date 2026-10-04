import React, { useEffect, useRef } from 'react';

interface WaveBackgroundCanvasProps {
  isDarkMode?: boolean;
}

/**
 * Minimalist Expansive Abstract Environment with Polished Dark Reflective Ground
 * - Solid deep black background with polished obsidian/dark glass floor
 * - Mid-air large, smooth, sweeping ribbon-like wave forms
 * - Soft gradient: deep magenta on the left -> violet-blue on the right
 * - Soft, baked-in reflections mirrored onto the polished floor surface
 * - Very slow, gentle horizontal drifting motion (60fps, continuous loop)
 * - Solid, smooth vector forms with soft feathered edges (no dense wireframe lines)
 * - Adapts cleanly to dark mode and light mode
 * - Strictly background-only
 */
export const WaveBackgroundCanvas: React.FC<WaveBackgroundCanvasProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef<boolean>(true);

  // Initialize and track theme preference
  useEffect(() => {
    if (typeof isDarkMode === 'boolean') {
      isDarkRef.current = isDarkMode;
    } else {
      const isDocDark = document.body.classList.contains('dark-theme');
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDarkRef.current = isDocDark || isSystemDark;
    }
  }, [isDarkMode]);

  // Listen to OS prefers-color-scheme dynamically
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleOSChange = (e: MediaQueryListEvent) => {
      if (typeof isDarkMode !== 'boolean') {
        isDarkRef.current = e.matches;
      }
    };
    mediaQuery.addEventListener?.('change', handleOSChange);
    return () => mediaQuery.removeEventListener?.('change', handleOSChange);
  }, [isDarkMode]);

  // Observe body class changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (typeof isDarkMode !== 'boolean') {
        isDarkRef.current = document.body.classList.contains('dark-theme');
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [isDarkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Smooth theme interpolation: 0 = light mode, 1 = dark mode
    let themeProgress = isDarkRef.current ? 1 : 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Definition of the large, smooth sweeping ribbon wave forms
    const RIBBONS = [
      {
        baseY: 0.38,
        amplitude: 65,
        thickness: 75,
        freq: 1.4,
        speed: 0.0032,
        phase: 0,
        swellSpeed: 0.002,
        swellAmp: 18,
      },
      {
        baseY: 0.46,
        amplitude: 85,
        thickness: 90,
        freq: 1.1,
        speed: -0.0025,
        phase: Math.PI * 0.65,
        swellSpeed: 0.0028,
        swellAmp: 22,
      },
      {
        baseY: 0.32,
        amplitude: 50,
        thickness: 60,
        freq: 1.8,
        speed: 0.0038,
        phase: Math.PI * 1.3,
        swellSpeed: 0.0018,
        swellAmp: 14,
      },
    ];

    // Helper: sample ribbon upper and lower points across the screen
    const sampleRibbon = (
      ribbon: typeof RIBBONS[0],
      count: number,
      t: number
    ) => {
      const topPoints: { x: number; y: number }[] = [];
      const bottomPoints: { x: number; y: number }[] = [];
      const step = width / count;

      const centerY = height * ribbon.baseY;
      const drift = t * ribbon.speed;
      const breathing = Math.sin(t * ribbon.swellSpeed) * ribbon.swellAmp;

      for (let i = 0; i <= count; i++) {
        const x = i * step;
        const u = x / width; // 0 to 1

        // Smooth sinusoidal sweeping curves
        const wave1 = Math.sin(u * Math.PI * ribbon.freq + drift + ribbon.phase);
        const wave2 = Math.cos(u * Math.PI * (ribbon.freq * 0.6) - drift * 0.8 + 1.2) * 0.35;
        const curveY = centerY + (wave1 + wave2) * ribbon.amplitude;

        // Tapered thickness envelope across screen
        const taper = 0.55 + 0.45 * Math.sin(u * Math.PI);
        const currentThickness = (ribbon.thickness + breathing) * taper;

        topPoints.push({ x, y: curveY - currentThickness * 0.5 });
        bottomPoints.push({ x, y: curveY + currentThickness * 0.5 });
      }

      return { topPoints, bottomPoints };
    };

    // Helper: draw smooth bezier path for a ribbon
    const buildRibbonPath = (
      topPoints: { x: number; y: number }[],
      bottomPoints: { x: number; y: number }[]
    ) => {
      const path = new Path2D();
      if (topPoints.length === 0) return path;

      // Forward along top edge with smooth quadratic curves
      path.moveTo(topPoints[0].x, topPoints[0].y);
      for (let i = 1; i < topPoints.length - 1; i++) {
        const xc = (topPoints[i].x + topPoints[i + 1].x) / 2;
        const yc = (topPoints[i].y + topPoints[i + 1].y) / 2;
        path.quadraticCurveTo(topPoints[i].x, topPoints[i].y, xc, yc);
      }
      const lastTop = topPoints[topPoints.length - 1];
      path.lineTo(lastTop.x, lastTop.y);

      // Connect to bottom edge
      const lastBottom = bottomPoints[bottomPoints.length - 1];
      path.lineTo(lastBottom.x, lastBottom.y);

      // Backward along bottom edge
      for (let i = bottomPoints.length - 2; i > 0; i--) {
        const xc = (bottomPoints[i].x + bottomPoints[i - 1].x) / 2;
        const yc = (bottomPoints[i].y + bottomPoints[i - 1].y) / 2;
        path.quadraticCurveTo(bottomPoints[i].x, bottomPoints[i].y, xc, yc);
      }
      path.lineTo(bottomPoints[0].x, bottomPoints[0].y);
      path.closePath();

      return path;
    };

    const render = () => {
      time += 1;

      // Smoothly track dark/light theme
      const targetProgress = isDarkRef.current ? 1 : 0;
      themeProgress += (targetProgress - themeProgress) * 0.08;

      // Horizon line separating mid-air atmosphere from polished reflective ground
      const horizonY = height * 0.62;

      // 1. Fill base background: Solid deep void black (Dark) vs. Pale pristine canvas (Light)
      const bgR = Math.round(248 + (3 - 248) * themeProgress);
      const bgG = Math.round(249 + (2 - 249) * themeProgress);
      const bgB = Math.round(253 + (6 - 253) * themeProgress);

      ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
      ctx.fillRect(0, 0, width, height);

      // Subtle expansive atmospheric gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      if (themeProgress > 0.5) {
        skyGrad.addColorStop(0, '#020106');
        skyGrad.addColorStop(1, '#06040d');
      } else {
        skyGrad.addColorStop(0, '#fafbfe');
        skyGrad.addColorStop(1, '#edf1f9');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // 2. Pre-calculate the Ribbon Wave Form geometries
      const sampleCount = 48; // Smooth, low-polygon vector accuracy
      const sampledRibbons = RIBBONS.map((r) => sampleRibbon(r, sampleCount, time));

      // 3. Create the precise color gradient: Neon violet-blue on left -> blue-purple on right
      const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
      if (themeProgress >= 0.5) {
        // Dark Mode: Neon violet-blue to blue-purple
        waveGrad.addColorStop(0.00, 'rgba(88, 70, 255, 0.92)');  // Neon violet-blue
        waveGrad.addColorStop(0.32, 'rgba(74, 98, 255, 0.88)');  // Electric royal blue-violet
        waveGrad.addColorStop(0.68, 'rgba(105, 58, 250, 0.88)'); // Luminous blue-purple
        waveGrad.addColorStop(1.00, 'rgba(147, 51, 234, 0.92)'); // Rich vibrant blue-purple
      } else {
        // Light Mode: High-contrast neon violet-blue to blue-purple
        waveGrad.addColorStop(0.00, 'rgba(75, 55, 245, 0.90)');  // Neon violet-blue
        waveGrad.addColorStop(0.32, 'rgba(60, 85, 245, 0.86)');  // Deep electric blue-violet
        waveGrad.addColorStop(0.68, 'rgba(95, 48, 235, 0.86)');  // Deep royal blue-purple
        waveGrad.addColorStop(1.00, 'rgba(135, 40, 225, 0.90)'); // Vivid blue-purple
      }

      // 4. DRAW MID-AIR WAVE FORMS (Smooth vector ribbons with feathered edges)
      // Save state for mid-air rendering
      ctx.save();
      for (let i = 0; i < sampledRibbons.length; i++) {
        const { topPoints, bottomPoints } = sampledRibbons[i];
        const path = buildRibbonPath(topPoints, bottomPoints);

        // Feathered soft edge pass (outer halo)
        ctx.save();
        if ('filter' in ctx) {
          ctx.filter = 'blur(14px)';
        }
        ctx.fillStyle = waveGrad;
        ctx.globalAlpha = (themeProgress > 0.5 ? 0.35 : 0.25);
        ctx.fill(path);
        ctx.restore();

        // Core solid smooth vector pass
        ctx.save();
        if ('filter' in ctx) {
          ctx.filter = 'blur(3px)';
        }
        ctx.fillStyle = waveGrad;
        ctx.globalAlpha = (themeProgress > 0.5 ? 0.82 : 0.78);
        ctx.fill(path);
        ctx.restore();
      }
      ctx.restore();

      // 5. DRAW POLISHED OBSIDIAN / DARK GLASS REFLECTIVE GROUND SURFACE
      // The ground spans from horizonY to the bottom of the viewport
      ctx.save();

      // Ground Base Fill (Obsidian Glass gradient)
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      if (themeProgress > 0.5) {
        // Dark Mode: Polished obsidian / dark mirror glass
        floorGrad.addColorStop(0, 'rgba(8, 6, 15, 0.96)');
        floorGrad.addColorStop(0.25, 'rgba(5, 3, 10, 0.98)');
        floorGrad.addColorStop(1.0, 'rgba(2, 1, 5, 1.0)');
      } else {
        // Light Mode: Polished white glass / crystalline reflective surface
        floorGrad.addColorStop(0, 'rgba(235, 240, 250, 0.94)');
        floorGrad.addColorStop(0.3, 'rgba(242, 245, 252, 0.97)');
        floorGrad.addColorStop(1.0, 'rgba(250, 251, 255, 1.0)');
      }
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // 6. BAKED-IN REFLECTIONS INTEGRATED ONTO THE POLISHED GROUND SURFACE
      // Clip to ground area to ensure reflections only appear on the polished floor
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonY, width, height - horizonY);
      ctx.clip();

      // Draw the vertically mirrored reflections of the ribbons
      for (let i = 0; i < sampledRibbons.length; i++) {
        const { topPoints, bottomPoints } = sampledRibbons[i];

        // Vertically mirror points across the horizon line with realistic ground perspective compression
        const compression = 0.52; // Ground perspective angle compression
        const reflectTop = topPoints.map((p) => ({
          x: p.x,
          y: horizonY + (horizonY - p.y) * compression,
        }));
        const reflectBottom = bottomPoints.map((p) => ({
          x: p.x,
          y: horizonY + (horizonY - p.y) * compression,
        }));

        const reflectPath = buildRibbonPath(reflectTop, reflectBottom);

        // Soft, diffused reflection (feathered reflection mirroring obsidian gloss)
        ctx.save();
        if ('filter' in ctx) {
          ctx.filter = 'blur(16px)';
        }
        ctx.fillStyle = waveGrad;
        // Moderate reflection intensity without harsh glow
        ctx.globalAlpha = themeProgress > 0.5 ? 0.38 : 0.28;
        ctx.fill(reflectPath);
        ctx.restore();

        // Secondary subtle inner reflection body
        ctx.save();
        if ('filter' in ctx) {
          ctx.filter = 'blur(6px)';
        }
        ctx.fillStyle = waveGrad;
        ctx.globalAlpha = themeProgress > 0.5 ? 0.22 : 0.16;
        ctx.fill(reflectPath);
        ctx.restore();
      }

      // Glossy Fresnel Reflection Attenuation:
      // Real polished obsidian and glass reflect clearest near the horizon and fade gently forward
      const fresnelMask = ctx.createLinearGradient(0, horizonY, 0, height);
      if (themeProgress > 0.5) {
        fresnelMask.addColorStop(0, 'rgba(8, 6, 15, 0.15)');
        fresnelMask.addColorStop(0.45, 'rgba(5, 3, 10, 0.55)');
        fresnelMask.addColorStop(1.0, 'rgba(2, 1, 5, 0.92)');
      } else {
        fresnelMask.addColorStop(0, 'rgba(235, 240, 250, 0.18)');
        fresnelMask.addColorStop(0.5, 'rgba(242, 245, 252, 0.60)');
        fresnelMask.addColorStop(1.0, 'rgba(250, 251, 255, 0.92)');
      }
      ctx.fillStyle = fresnelMask;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      ctx.restore(); // Unclip ground

      // 7. Polished Horizon Seam (Ultra-fine specular edge line defining the reflective glass plane)
      const horizonLine = ctx.createLinearGradient(0, 0, width, 0);
      if (themeProgress > 0.5) {
        horizonLine.addColorStop(0.0, 'rgba(88, 70, 255, 0.20)');
        horizonLine.addColorStop(0.3, 'rgba(255, 255, 255, 0.28)');
        horizonLine.addColorStop(0.7, 'rgba(255, 255, 255, 0.32)');
        horizonLine.addColorStop(1.0, 'rgba(147, 51, 234, 0.20)');
      } else {
        horizonLine.addColorStop(0.0, 'rgba(75, 55, 245, 0.16)');
        horizonLine.addColorStop(0.3, 'rgba(200, 210, 235, 0.45)');
        horizonLine.addColorStop(0.7, 'rgba(180, 200, 240, 0.45)');
        horizonLine.addColorStop(1.0, 'rgba(135, 40, 225, 0.16)');
      }

      ctx.strokeStyle = horizonLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      ctx.restore(); // Restore global context

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="procedural-wave-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};
