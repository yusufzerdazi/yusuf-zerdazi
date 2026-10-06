import { createNoise2D, createNoise3D } from 'simplex-noise';
import alea from 'alea';

const wallNoise3D = createNoise3D(alea('seed'));

// Fills an RGBA buffer with the carpet pattern (static) or the LED wall pattern (animated over time)
export const fillPattern = (data: Uint8Array, width: number, height: number, time: number = 0, isWall: boolean = false) => {
  const noise2D = isWall ? null : createNoise2D();

  // Increase pixel size for walls
  const pixelSize = isWall ? 2 : 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const distanceToEdge = Math.min(x, y, Math.abs(height-y), Math.abs(x-width));
      const edgeMultiplier = distanceToEdge < 5 ? 0 : 1;

      // For walls, use pixelated coordinates and time-based animation
      const pixelX = isWall ? Math.floor(x / pixelSize) * pixelSize : x;
      const pixelY = isWall ? Math.floor(y / pixelSize) * pixelSize : y;

      if (!noise2D) {
        data[idx] = Math.round(255 * Math.max(0, wallNoise3D((pixelX) / 30, pixelY / 30, time)));
        data[idx + 1] = Math.round(255 * Math.max(0, wallNoise3D((pixelX + 500) / 30, (pixelY + 500) / 30, time)));
        data[idx + 2] = Math.round(255 * Math.max(0, wallNoise3D((pixelX + 1000) / 30, (pixelY + 1000) / 30, time)));
        data[idx + 3] = 255; // Alpha
      } else {
        // Original carpet pattern
        data[idx] = 255 - edgeMultiplier * (50 * (Math.round(noise2D((x) / 100, (y) / 100)+1))/2);
        data[idx + 1] = 255 - edgeMultiplier * (40 * (Math.round(noise2D((x+500) / 50, (y+500) / 50)+1))/2);
        data[idx + 2] = 255 - edgeMultiplier * (30 * (Math.round(noise2D((x+1000) / 200, (y+1000) / 200)+1))/2);
        data[idx + 3] = 255;
      }
    }
  }

  return data;
}
