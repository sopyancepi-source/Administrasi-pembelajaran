/**
 * Utility for exporting exam papers and worksheets to Microsoft Word (.doc)
 * with fully embedded raster images (MHTML / MIME multipart/related format).
 *
 * Why this is needed:
 * 1. Microsoft Word's HTML import filter completely ignores and strips raw <svg>...</svg> markup.
 * 2. Word Desktop for Windows ignores `data:image/...` URLs in standard HTML files.
 * 3. By converting vector SVGs and images into high-resolution PNGs and packaging them
 *    as an MHTML archive (RFC 2557) with `Content-Location` and `Content-ID`,
 *    Word, WPS Office, LibreOffice, and Word Online can display all diagrams and stimuli crisply.
 */

export interface WordEmbeddedImage {
  filename: string;
  contentType: string;
  base64: string;
  width: number;
  height: number;
  alt?: string;
}

/**
 * Split Base64 string into 76-character lines in compliance with MIME RFC 2045.
 */
export function chunkBase64(base64: string, lineLength = 76): string {
  if (!base64) return '';
  const clean = base64.replace(/\s+/g, '');
  const regex = new RegExp(`.{1,${lineLength}}`, 'g');
  const chunks = clean.match(regex);
  return chunks ? chunks.join('\r\n') : clean;
}

/**
 * Converts an SVG string into a sharp, high-resolution PNG base64 data string.
 * Renders onto an offscreen canvas with a solid white background (#ffffff)
 * to prevent transparent alpha channels from turning pitch black in older Word builds.
 */
export async function convertSvgToPngBase64(
  svgString: string,
  targetWidth?: number,
  targetHeight?: number
): Promise<{ base64: string; width: number; height: number } | null> {
  return new Promise((resolve) => {
    try {
      if (!svgString || typeof svgString !== 'string') {
        resolve(null);
        return;
      }

      let cleanSvg = svgString.trim();
      if (!cleanSvg.includes('xmlns=')) {
        cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      // Parse width, height, viewBox
      const widthMatch = cleanSvg.match(/width=["']([0-9.]+)(?:px)?["']/i);
      const heightMatch = cleanSvg.match(/height=["']([0-9.]+)(?:px)?["']/i);
      const vbMatch = cleanSvg.match(/viewBox=["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.]+)\s+([0-9.]+)\s*["']/i);

      let w = targetWidth || (widthMatch ? parseFloat(widthMatch[1]) : (vbMatch ? parseFloat(vbMatch[3]) : 240));
      let h = targetHeight || (heightMatch ? parseFloat(heightMatch[1]) : (vbMatch ? parseFloat(vbMatch[4]) : 180));

      if (!w || isNaN(w) || w <= 0) w = 240;
      if (!h || isNaN(h) || h <= 0) h = 180;

      // Ensure explicit width and height on root svg
      if (!cleanSvg.includes('width=')) {
        cleanSvg = cleanSvg.replace('<svg', `<svg width="${w}"`);
      }
      if (!cleanSvg.includes('height=')) {
        cleanSvg = cleanSvg.replace('<svg', `<svg height="${h}"`);
      }

      const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const timer = setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        resolve(null);
      }, 3500);

      img.onload = () => {
        clearTimeout(timer);
        try {
          // 2x supersampling for ultra-crisp print rendering in Word
          const scale = 2;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(w * scale);
          canvas.height = Math.round(h * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(blobUrl);
            resolve(null);
            return;
          }

          // Solid white background prevents black box artifacts on transparent SVGs
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw SVG
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(blobUrl);
          const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
          resolve({ base64, width: Math.round(w), height: Math.round(h) });
        } catch (err) {
          URL.revokeObjectURL(blobUrl);
          resolve(null);
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        URL.revokeObjectURL(blobUrl);
        resolve(null);
      };

      img.src = blobUrl;
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Converts a data URL or HTTP image URL to a clean PNG base64 string.
 */
export async function convertImageSrcToPngBase64(
  srcUrl: string
): Promise<{ base64: string; width: number; height: number } | null> {
  return new Promise((resolve) => {
    try {
      if (!srcUrl) {
        resolve(null);
        return;
      }

      // If already a base64 data URL
      if (srcUrl.startsWith('data:image/')) {
        const match = srcUrl.match(/^data:image\/[a-zA-Z+.-]+;base64,(.+)$/);
        if (match) {
          const rawBase64 = match[1];
          const img = new Image();
          img.onload = () => {
            resolve({
              base64: rawBase64,
              width: img.naturalWidth || 240,
              height: img.naturalHeight || 180,
            });
          };
          img.onerror = () => {
            resolve({
              base64: rawBase64,
              width: 240,
              height: 180,
            });
          };
          img.src = srcUrl;
          return;
        }
      }

      // External or local URL (/assets/...)
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const timer = setTimeout(() => {
        resolve(null);
      }, 3500);

      img.onload = () => {
        clearTimeout(timer);
        try {
          const w = img.naturalWidth || 240;
          const h = img.naturalHeight || 180;
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/png');
          const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
          resolve({ base64, width: w, height: h });
        } catch (e) {
          resolve(null);
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };

      img.src = srcUrl;
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Packages HTML and all rasterized images into an RFC 2557 MHTML single-file web archive (.doc).
 * Microsoft Word natively opens and displays embedded images from this format.
 */
export function buildWordMhtmlDocument(options: {
  html: string;
  images: WordEmbeddedImage[];
  boundary?: string;
}): string {
  const boundary = options.boundary || `----=_NextPart_SoalDoc_${Date.now()}`;
  const parts: string[] = [];

  // MHTML Header
  parts.push('MIME-Version: 1.0');
  parts.push(`Content-Type: multipart/related; boundary="${boundary}"; type="text/html"`);
  parts.push('');

  // Primary HTML Document Part
  parts.push(`--${boundary}`);
  parts.push('Content-Type: text/html; charset="utf-8"');
  parts.push('Content-Transfer-Encoding: 8bit');
  parts.push('');
  parts.push(options.html);
  parts.push('');

  // Embedded Image Parts
  for (const img of options.images) {
    if (!img.base64) continue;
    parts.push(`--${boundary}`);
    parts.push(`Content-Type: ${img.contentType || 'image/png'}`);
    parts.push('Content-Transfer-Encoding: base64');
    parts.push(`Content-ID: <${img.filename}>`);
    parts.push(`Content-Location: ${img.filename}`);
    parts.push('');
    parts.push(chunkBase64(img.base64));
    parts.push('');
  }

  // End boundary
  parts.push(`--${boundary}--`);
  parts.push('');

  return parts.join('\r\n');
}
