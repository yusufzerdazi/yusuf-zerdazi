import { createNoise2D, createNoise3D } from 'simplex-noise';
import { PNG } from 'pngjs/browser';
import alea from 'alea';

export const generateCarpet = (width: number, height: number, time: number = 0, isWall: boolean = false) => {
  const png = new PNG({ width, height });
  const prng = alea('seed');
  const noise2D = createNoise2D();
  const noise3D = createNoise3D(prng);
  
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
      
      if (isWall) {
        const r = Math.round(255 * Math.max(0, noise3D((pixelX) / 30, pixelY / 30, time)));
        const g = Math.round(255 * Math.max(0, noise3D((pixelX + 500) / 30, (pixelY + 500) / 30, time)));
        const b = Math.round(255 * Math.max(0, noise3D((pixelX + 1000) / 30, (pixelY + 1000) / 30, time)));
        
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = 255; // Alpha
      } else {
        // Original carpet pattern
        png.data[idx] = 255 - edgeMultiplier * (50 * (Math.round(noise2D((x) / 100, (y) / 100)+1))/2); 
        png.data[idx + 1] = 255 - edgeMultiplier * (40 * (Math.round(noise2D((x+500) / 50, (y+500) / 50)+1))/2);	 
        png.data[idx + 2] = 255 - edgeMultiplier * (30 * (Math.round(noise2D((x+1000) / 200, (y+1000) / 200)+1))/2);		 
        png.data[idx + 3] = 255;
      }
    }
  }

  return PNG.sync.write(png).toString('base64');
}
