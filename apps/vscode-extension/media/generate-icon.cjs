const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegmentSquared(px, py, vx, vy, wx, wy) {
  const l2 = (vx - wx) * (vx - wx) + (vy - wy) * (vy - wy);
  if (l2 === 0) return (px - vx) * (px - vx) + (py - vy) * (py - vy);
  let t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
  t = Math.max(0, Math.min(1, t));
  const dx = px - (vx + t * (wx - vx));
  const dy = py - (vy + t * (wy - vy));
  return dx * dx + dy * dy;
}

function distToPolygon(px, py, poly) {
  let minD2 = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const d2 = distToSegmentSquared(px, py, poly[i][0], poly[i][1], poly[j][0], poly[j][1]);
    if (d2 < minD2) minD2 = d2;
  }
  return Math.sqrt(minD2);
}

function generateIcon() {
  const width = 256;
  const height = 256;

  // Lightning polygon coordinates
  const bolt = [
    [144, 52],
    [96, 132],
    [126, 132],
    [112, 204],
    [160, 120],
    [130, 120],
  ];

  const scanlineLength = 1 + width * 4;
  const raw = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    raw[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const idx = rowOffset + 1 + x * 4;

      // Rounded squircle container check
      const cx = x - 128;
      const cy = y - 128;
      const r = Math.pow(Math.abs(cx) / 112, 4) + Math.pow(Math.abs(cy) / 112, 4);

      if (r > 1.0) {
        // Transparent outside container
        raw[idx] = 0;
        raw[idx + 1] = 0;
        raw[idx + 2] = 0;
        raw[idx + 3] = 0;
        continue;
      }

      // Base AMOLED black with subtle specular border
      let red = 5;
      let green = 5;
      let blue = 9;
      let alpha = 255;

      // Squircle border highlight
      if (r > 0.88 && r <= 1.0) {
        const borderAlpha = (r - 0.88) / 0.12;
        red = Math.round(255 * borderAlpha * 0.15);
        green = Math.round(255 * borderAlpha * 0.15);
        blue = Math.round(255 * borderAlpha * 0.25);
      }

      // Lightning bolt distance & fill
      const inside = pointInPolygon(x, y, bolt);
      const dist = distToPolygon(x, y, bolt);

      // Glow effect around the bolt
      if (dist < 32) {
        const glowIntensity = Math.exp(-dist / 8.5) * 0.7;
        red = Math.min(255, red + Math.round(249 * glowIntensity));
        green = Math.min(255, green + Math.round(140 * glowIntensity));
        blue = Math.min(255, blue + Math.round(50 * glowIntensity));
      }

      // Inside the bolt: Pastel Orange to Yellow gradient
      if (inside) {
        const progress = Math.max(0, Math.min(1, (y - 52) / (204 - 52)));
        // Top: #f97316 (249, 115, 22), Bottom: #fef08a (254, 240, 138)
        red = Math.round(249 + (254 - 249) * progress);
        green = Math.round(115 + (240 - 115) * progress);
        blue = Math.round(22 + (138 - 22) * progress);
      }

      raw[idx] = red;
      raw[idx + 1] = green;
      raw[idx + 2] = blue;
      raw[idx + 3] = alpha;
    }
  }

  // Compress IDAT
  const idatData = zlib.deflateSync(raw, { level: 9 });

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);

  const outputDir = path.resolve(__dirname);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'icon.png');
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Generated extension icon at: ${outputPath} (${pngBuffer.length} bytes)`);
}

generateIcon();
