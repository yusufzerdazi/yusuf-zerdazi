import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Model } from '../Model';
import { MODEL_URLS } from '../modelUrls';
import { Soft } from '../primitives';
import { Rest } from '../Rest';
import { useLite, usePreview } from '../sections';
import { MIRROR_SIZE, scallopedOval } from '../shapes';
import { PlanarMirror } from '../PlanarMirror';
import { canvasTexture, glowMaterial, mat } from '../materials';
import { fillPattern } from '../../../Utils';

// ---------- LED matrix ----------

const LED_COLUMNS = 40, LED_ROWS = 30, LED_PITCH = 10;

// Infinity mirror: the LED matrix seen again and again in the gap between a mirror and a half-silvered front,
// each reflection smaller, dimmer and shifted along the viewing angle, so the panel looks like a deep tunnel
const infinityVertex = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const infinityFragment = /* glsl */ `
    uniform sampler2D map;
    uniform vec2 shift;
    varying vec2 vUv;
    void main() {
        vec3 colour = vec3(0.0);
        float weight = 1.0;
        // Nearest reflection first; each deeper one only shows where nothing nearer covers it
        bool covered = false;
        for (int i = 0; i < 12; i++) {
            float depth = float(i);
            float scale = pow(0.86, depth);
            vec2 uv = (vUv - 0.5 - shift * depth) / scale + 0.5;
            if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) break;
            // The panel edge in each reflection reads as a dark frame, which sells the depth
            vec2 edge = min(uv, 1.0 - uv);
            float frame = smoothstep(0.0, 0.035, min(edge.x, edge.y));
            colour += texture2D(map, uv).rgb * weight * frame;
            weight *= 0.62;
        }
        gl_FragColor = vec4(min(colour, vec3(1.0)), 1.0);
        #include <colorspace_fragment>
    }
`;

const LED_SIZE = { width: 0.95, height: 0.717 };
const REFLECTION_DEPTH = 0.06;

// Each pixel of the generated pattern drawn as a discrete LED, with the average colour spilling onto the wall
export function LedPanel() {
    const { texture, ctx, pixels } = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = LED_COLUMNS * LED_PITCH;
        canvas.height = LED_ROWS * LED_PITCH;
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        return { texture: tex, ctx: canvas.getContext('2d'), pixels: new Uint8Array(LED_COLUMNS * LED_ROWS * 4) };
    }, []);
    const preview = usePreview();
    const spill = useMemo(() => glowMaterial('#ffffff', 0.45), []);
    const infinity = useMemo(() => new THREE.ShaderMaterial({
        uniforms: { map: { value: texture }, shift: { value: new THREE.Vector2() } },
        vertexShader: infinityVertex,
        fragmentShader: infinityFragment,
    }), [texture]);
    useEffect(() => () => { texture.dispose(); spill.dispose(); infinity.dispose(); }, [texture, spill, infinity]);
    const screen = useRef<THREE.Mesh>(null);
    const view = useMemo(() => ({ direction: new THREE.Vector3(), centre: new THREE.Vector3(), inverse: new THREE.Matrix3() }), []);

    const frame = useRef(0);
    useFrame(({ clock, camera }) => {
        // Reflections recede along the line of sight, so shift each one by the viewing angle in the panel's own frame
        if (screen.current) {
            screen.current.getWorldPosition(view.centre);
            view.direction.subVectors(view.centre, camera.position).normalize();
            view.inverse.setFromMatrix4(screen.current.matrixWorld).invert();
            const local = view.direction.applyMatrix3(view.inverse).normalize();
            const depth = Math.max(0.2, -local.z);
            infinity.uniforms.shift.value.set(
                -(local.x / depth) * REFLECTION_DEPTH / LED_SIZE.width,
                -(local.y / depth) * REFLECTION_DEPTH / LED_SIZE.height,
            );
        }
        if (!ctx || frame.current++ % 2) return;
        // Same drift speed as the original per-frame increment of 0.001 at 60fps
        fillPattern(pixels, LED_COLUMNS, LED_ROWS, clock.elapsedTime * 0.06, true);
        ctx.fillStyle = '#060607';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let r = 0, g = 0, b = 0;
        for (let y = 0; y < LED_ROWS; y++) {
            for (let x = 0; x < LED_COLUMNS; x++) {
                const i = (y * LED_COLUMNS + x) * 4;
                r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2];
                ctx.fillStyle = `rgb(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]})`;
                ctx.fillRect(x * LED_PITCH + 1.5, y * LED_PITCH + 1.5, LED_PITCH - 3, LED_PITCH - 3);
            }
        }
        texture.needsUpdate = true;
        const count = LED_COLUMNS * LED_ROWS * 255;
        spill.color.setRGB(r / count, g / count, b / count).multiplyScalar(1.6);
    });

    return (
        <group>
            {!preview && (
                <mesh position={[0.004, 1.67, 3.709]} rotation={[0, Math.PI / 2, 0]} material={spill} userData={{ noSheen: true }}>
                    <planeGeometry args={[1.7, 1.35]} />
                </mesh>
            )}
            <Soft size={[0.07, 0.77, 1.0]} radius={0.008} position={[0.035, 1.67, 3.709]} color={mat('#252E33')} />
            <mesh ref={screen} position={[0.0705, 1.67, 3.709]} rotation={[0, Math.PI / 2, 0]} material={infinity} userData={{ noSheen: true }}>
                <planeGeometry args={[LED_SIZE.width, LED_SIZE.height]} />
            </mesh>
        </group>
    );
}

// ---------- Magic mirror ----------

// The authored scalloped frame with real reflective glass (see PlanarMirror), tinted the original's pale blue
export function MagicMirror() {
    // On its own there's no room to reflect (and on phones a live reflection costs a second render of the room),
    // so show pale glass with a soft diagonal sheen instead
    const preview = usePreview();
    const lite = useLite();
    const staticGlass = preview || lite;
    const previewGlass = useMemo(() => new THREE.MeshBasicMaterial({
        map: Object.assign(canvasTexture(128, 128, ctx => {
            const gradient = ctx.createLinearGradient(0, 0, 128, 128);
            gradient.addColorStop(0, '#EEF3F9');
            gradient.addColorStop(0.45, '#DCE4EF');
            gradient.addColorStop(0.5, '#F7FAFD');
            gradient.addColorStop(0.58, '#D3DCE8');
            gradient.addColorStop(1, '#C4CFDD');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
        }), {
            // The glass outline is in metres centred on zero; fit the sheen across it
            repeat: new THREE.Vector2(1 / (2 * MIRROR_SIZE.rx), 1 / (2 * MIRROR_SIZE.ry)),
            offset: new THREE.Vector2(0.5, 0.5),
        }),
        toneMapped: false,
    }), []);
    useEffect(() => () => { previewGlass.map?.dispose(); previewGlass.dispose(); }, [previewGlass]);
    const glass = useMemo(() => new THREE.ShapeGeometry(scallopedOval(MIRROR_SIZE.rx + 0.004, MIRROR_SIZE.ry + 0.004)), []);
    useEffect(() => () => glass.dispose(), [glass]);

    // The frame model is re-centred on load; these match its glass opening (see scripts/build-models.ts)
    const centreY = MIRROR_SIZE.ry + MIRROR_SIZE.border + 0.006;
    return (
        <group>
            <group position={[0.022, 1.05, 2.33]} rotation={[0, Math.PI / 2, 0]}>
                <Model url={MODEL_URLS.mirrorFrame} />
                {staticGlass
                    ? <mesh geometry={glass} material={previewGlass} position={[0, centreY, -0.006]} userData={{ noSheen: true }} />
                    : <PlanarMirror geometry={glass} position={[0, centreY, -0.006]} />}
            </group>
        </group>
    );
}

// ---------- Painting ----------

// A 75 cm frame on the right-hand wall above the sofa
const PAINTING = { x: 3.15, y: 1.55, frame: 0.75, canvas: 0.62, depth: 0.035 };

function PaintingImage({ src }: { src: string }) {
    const texture = useTexture(encodeURI(src));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return (
        <mesh position={[PAINTING.x, PAINTING.y, PAINTING.depth + 0.004]} userData={{ noSheen: true }}>
            <planeGeometry args={[PAINTING.canvas, PAINTING.canvas]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
}

// Some paintings are large, so the image loads separately from the frame
export function Painting({ src }: { src: string }) {
    const { x, y, frame, canvas, depth } = PAINTING;
    return (
        <group>
            <Model url={MODEL_URLS.frame} size={{ width: frame, height: frame, depth }} stretch position={[x, y - frame / 2, depth / 2 + 0.002]} rotation={[0, Math.PI, 0]}
                recolor={{ mat23: '#FFFFFF', mat21: '#D0D2D3', mat15: '#BBBDBF' }} />
            <Suspense fallback={(
                <mesh position={[x, y, depth + 0.004]} material={mat('#F9F9F9')} userData={{ noSheen: true }}>
                    <planeGeometry args={[canvas, canvas]} />
                </mesh>
            )}>
                <PaintingImage src={src} />
            </Suspense>
        </group>
    );
}

// ---------- Security camera ----------

// A compact CCTV camera with its mounting plate flat against the right-hand wall, looking out into the room
export function SecurityCamera() {
    return (
        <Rest drop={false} against="right" gap={0}>
            <Model url={MODEL_URLS.camera} size={{ height: 0.16 }} position={[4.05, 1.8, 0.2]} rotation={[0, Math.PI / 2, 0]}
                recolor={{ Cream: '#FFFFFF', LightGray: '#D0D2D3', DarkGray: '#505E63', Black: '#252E33' }} />
        </Rest>
    );
}
