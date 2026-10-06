import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import { mat } from '../materials';

// A round abstract rug in the style of a painted "celestial" rug: an ivory field with grey washes and
// splashes of saturated colour, distressed at the edges like worn pile. 2.9 m across, with a bound edge.
const RUG = { x: 2.25, z: 2.3, radius: 1.45, pile: 0.012, binding: 0.012 };

const SPLASHES: { colour: string; threshold: number; scale: number }[] = [
    { colour: '#F3C93F', threshold: 0.58, scale: 1.0 },  // yellow
    { colour: '#F29A55', threshold: 0.61, scale: 1.2 },  // orange
    { colour: '#E8664F', threshold: 0.64, scale: 1.4 },  // coral red
    { colour: '#C9568E', threshold: 0.66, scale: 1.5 },   // magenta
    { colour: '#3FA2CB', threshold: 0.63, scale: 1.3 },  // teal blue
    { colour: '#6E9B4A', threshold: 0.71, scale: 1.7 },  // a little green
];

const paintRug = (size: number) => {
    const canvas = Object.assign(document.createElement('canvas'), { width: size, height: size });
    const ctx = canvas.getContext('2d')!;
    const image = ctx.createImageData(size, size);
    const random = alea('celestial');
    const noise = createNoise2D(random);
    // Smooth, cloudy field: a few octaves of noise in 0..1
    const fbm = (x: number, y: number, octaves = 4) => {
        let value = 0, amplitude = 0.5, frequency = 1;
        for (let i = 0; i < octaves; i++) {
            value += amplitude * noise(x * frequency, y * frequency);
            amplitude *= 0.5;
            frequency *= 2.1;
        }
        return value * 0.5 + 0.5;
    };
    const ivory = new THREE.Color('#F2EDE2'), grey = new THREE.Color('#BFBAB0');
    const splashes = SPLASHES.map((s, i) => ({ ...s, rgb: new THREE.Color(s.colour), offset: 37.1 * (i + 1) }));
    const colour = new THREE.Color();
    const srgb = { r: 0, g: 0, b: 0 };

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const u = x / size * 2.3, v = y / size * 2.3;
            // Fine grain decides which pixels take paint near a splash's edge, giving the worn, speckled look
            const grain = 0.5 + 0.5 * noise(x * 0.35, y * 0.35) * 0.6 + (random() - 0.5) * 0.35;
            colour.copy(ivory).lerp(grey, Math.min(1, Math.max(0, fbm(u * 1.3 + 9, v * 1.3 - 4) - 0.45) * 2.2) * (0.5 + grain * 0.5));
            for (const s of splashes) {
                const field = fbm(u * s.scale + s.offset, v * s.scale - s.offset);
                const coverage = THREE.MathUtils.smoothstep(field, s.threshold, s.threshold + 0.14);
                if (coverage > grain) colour.lerp(s.rgb, 0.55 + coverage * 0.45);
            }
            const i = (y * size + x) * 4;
            colour.getRGB(srgb, THREE.SRGBColorSpace);
            image.data[i] = srgb.r * 255;
            image.data[i + 1] = srgb.g * 255;
            image.data[i + 2] = srgb.b * 255;
            image.data[i + 3] = 255;
        }
    }
    ctx.putImageData(image, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
};

export function Rug() {
    const top = useMemo(() => new THREE.MeshBasicMaterial({ map: paintRug(512), toneMapped: false }), []);
    useEffect(() => () => { top.map?.dispose(); top.dispose(); }, [top]);
    const { radius, pile, binding } = RUG;

    return (
        <group position={[RUG.x, 0, RUG.z]}>
            {/* Cylinder groups: 0 = side, 1 = top, 2 = bottom */}
            <mesh position={[0, pile / 2, 0]} material={[mat('#E4DED2'), top, mat('#E4DED2')]}>
                <cylinderGeometry args={[radius, radius, pile, 128]} />
            </mesh>
            {/* Bound edge, slightly raised and a shade darker than the field */}
            <mesh position={[0, pile, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat('#D8D0C1')}>
                <torusGeometry args={[radius - binding * 0.4, binding, 8, 160]} />
            </mesh>
        </group>
    );
}
