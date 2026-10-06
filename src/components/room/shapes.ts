import * as THREE from 'three';

// Shared by the model build script (scripts/build-models.ts) and the app, so authored models and
// the parts generated at runtime line up exactly.

export const MIRROR_SIZE = { rx: 0.3, ry: 0.42, waves: 14, wobble: 0.035, border: 0.035 };

// Wavy-edged oval, like the original illustration's magic mirror
export const scallopedOval = (rx: number, ry: number, waves = MIRROR_SIZE.waves, wobble = MIRROR_SIZE.wobble, steps = 112) => {
    const shape = new THREE.Shape();
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const r = 1 + wobble * Math.sin(t * waves);
        const x = Math.cos(t) * rx * r, y = Math.sin(t) * ry * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    return shape;
};
