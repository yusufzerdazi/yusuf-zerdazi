import { createNoise2D } from 'simplex-noise';
import { PNG } from 'pngjs/browser';

export const generateCarpet = () => {
  const width = 500;
  const height = 500;
  const png = new PNG({ width, height });
  const noise2D = createNoise2D();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const distanceToEdge = Math.min(x, y, Math.abs(height-y), Math.abs(x-width));
      const edgeMultiplier = distanceToEdge < 5 ? 0 : 1;
      png.data[idx] = 255 - edgeMultiplier * (50 * (Math.round(noise2D((x) / 100, (y) / 100)+1))/2 + 0 * Math.random()); 
      png.data[idx + 1] = 255 - edgeMultiplier * (40 * (Math.round(noise2D((x+500) / 50, (y+500) / 50)+1))/2 + 0 * Math.random());	 
      png.data[idx + 2] = 255 - edgeMultiplier * (30 * (Math.round(noise2D((x+1000) / 200, (y+1000) / 200)+1))/2 + 0 * Math.random());		 
      png.data[idx + 3] = 255;        // Alpha channel (fully opaque)
    }
  }

  return PNG.sync.write(png).toString('base64');
}
