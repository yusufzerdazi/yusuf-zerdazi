import * as THREE from 'three';

// Shared flat matte materials, one per colour, shaded like the illustration
const lambertCache = new Map<string, THREE.MeshLambertMaterial>();
export const mat = (color: string) => {
    let material = lambertCache.get(color);
    if (!material) {
        material = new THREE.MeshLambertMaterial({ color });
        lambertCache.set(color, material);
    }
    return material;
};

// Unlit, untonemapped colour for screens and light sources
const basicCache = new Map<string, THREE.MeshBasicMaterial>();
export const flat = (color: string) => {
    let material = basicCache.get(color);
    if (!material) {
        material = new THREE.MeshBasicMaterial({ color, toneMapped: false });
        basicCache.set(color, material);
    }
    return material;
};

export const canvasTexture = (width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) draw(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
};

// Soft radial falloff used for halos and light spill
let glow: THREE.Texture | null = null;
export const glowTexture = () => {
    if (!glow) {
        glow = canvasTexture(128, 128, ctx => {
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.35, 'rgba(255,255,255,0.45)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
        });
    }
    return glow;
};

export const glowMaterial = (color: string, opacity: number) => new THREE.MeshBasicMaterial({
    map: glowTexture(),
    color,
    opacity,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
});
