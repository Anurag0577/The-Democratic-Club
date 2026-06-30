// utils/colorExtractor.js

// Cache results so we don't re-process the same image on every re-render
const colorCache = new Map();

/**
 * Loads an image, samples its pixels on a small canvas, and returns
 * the most common "vibrant" color as a hex string.
 * Falls back gracefully on load failure or CORS issues.
 */
export function extractAccentColor(imageUrl, fallback = '#C9A961') {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve(fallback);
      return;
    }

    if (colorCache.has(imageUrl)) {
      resolve(colorCache.get(imageUrl));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous'; // required to read pixel data from a remote image

    img.onload = () => {
      try {
        const size = 50; // downscale — we don't need full resolution to find a dominant color
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);

        const { data } = ctx.getImageData(0, 0, size, size);
        const buckets = new Map();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 200) continue; // skip transparent pixels

          const brightness = (r + g + b) / 3;
          if (brightness < 20 || brightness > 235) continue; // skip near-black/near-white (usually borders)

          // Quantize so close colors group together instead of fragmenting
          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;
          const key = `${qr},${qg},${qb}`;

          const existing = buckets.get(key);
          if (existing) existing.count += 1;
          else buckets.set(key, { r: qr, g: qg, b: qb, count: 1 });
        }

        if (buckets.size === 0) {
          resolve(fallback);
          return;
        }

        // Prefer colors that are both frequent AND saturated (avoids picking a dull gray)
        let best = null;
        let bestScore = -1;

        for (const color of buckets.values()) {
          const { r, g, b, count } = color;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          const score = count * (0.4 + saturation);

          if (score > bestScore) {
            bestScore = score;
            best = color;
          }
        }

        const hex = rgbToHex(best.r, best.g, best.b);
        colorCache.set(imageUrl, hex);
        resolve(hex);
      } catch (err) {
        // Tainted canvas (CORS) or other failure — fail silently to fallback
        console.warn('[colorExtractor] Could not extract color:', err);
        resolve(fallback);
      }
    };

    img.onerror = () => resolve(fallback);
    img.src = imageUrl;
  });
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
      .join('')
  );
}