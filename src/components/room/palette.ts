import * as THREE from 'three';
import roomSvg from '../../assets/home.svg?raw';

// Every flat colour used in the original illustration, kept in sRGB for comparisons
const PALETTE = [...new Set([...roomSvg.matchAll(/fill:\s*(#[0-9A-Fa-f]{6})|fill="(#[0-9A-Fa-f]{6})"/g)].map(m => (m[1] ?? m[2]).toUpperCase()))]
    .map(hex => new THREE.Color(hex).convertLinearToSRGB());

// Close enough colours are pulled onto the illustration's palette so models share its look
const SNAP_DISTANCE = 0.12;
const srgb = new THREE.Color();

export const snapToPalette = (color: THREE.Color) => {
    srgb.copy(color).convertLinearToSRGB();
    let nearest: THREE.Color | null = null;
    let best = SNAP_DISTANCE;
    for (const candidate of PALETTE) {
        const distance = Math.hypot(candidate.r - srgb.r, candidate.g - srgb.g, candidate.b - srgb.b);
        if (distance < best) {
            best = distance;
            nearest = candidate;
        }
    }
    return nearest ? color.copy(nearest).convertSRGBToLinear() : color;
};
