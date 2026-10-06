import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Model } from '../Model';
import { MODEL_URLS } from '../modelUrls';
import { Rest } from '../Rest';
import { Soft, Sphere } from '../primitives';
import { mat } from '../materials';

// A 1.4 × 0.7 m desk at sitting height, its long side against the left-hand wall
const DESK_TOP = 0.74;

export function Desk() {
    return (
        <Rest drop={false} against="left" gap={0.05}>
            <Model url={MODEL_URLS.desk} size={{ width: 1.4, height: DESK_TOP, depth: 0.7 }} stretch position={[0.4, 0, 0.85]} rotation={[0, Math.PI / 2, 0]} recolor={{ MetalStandingDesk1: '#F9F9F9' }} />
        </Rest>
    );
}

export function Chair() {
    return (
        <Rest drop={false}>
            <Model url={MODEL_URLS.chair} size={{ height: 1.15 }} position={[1.08, 0, 0.88]} rotation={[0, -Math.PI / 2, 0]} recolor={{ LeatherExecutiveChair1: "#323E44" }} />
        </Rest>
    );
}

// Keeps an <img> in the document so the browser keeps animating the GIF, and copies frames into a texture
function useAnimatedImageTexture(src: string, width: number, height: number) {
    const resources = useMemo(() => {
        const image = document.createElement('img');
        image.src = src;
        image.alt = '';
        Object.assign(image.style, { position: 'fixed', left: '0', bottom: '0', width: '1px', height: '1px', opacity: '0.01', pointerEvents: 'none' });
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return { image, context: canvas.getContext('2d'), texture };
    }, [src, width, height]);

    useEffect(() => {
        document.body.appendChild(resources.image);
        return () => {
            resources.image.remove();
            resources.texture.dispose();
        };
    }, [resources]);

    const frame = useRef(0);
    useFrame(() => {
        const { image, context, texture } = resources;
        // A third of the display rate is plenty for a GIF
        if (frame.current++ % 3 !== 0 || !context || !image.complete || !image.naturalWidth) return;
        context.drawImage(image, 0, 0, width, height);
        texture.needsUpdate = true;
    });

    return resources.texture;
}

// Display area of the authored 27" monitor (scripts/build-models.ts), in its own frame facing +Z
const SCREEN = { width: 0.596, height: 0.335, y: 0.284, z: 0.0128 };

export function Computer() {
    const texture = useAnimatedImageTexture('/pc.gif', 320, 240);
    const screen = useMemo(() => new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }), [texture]);
    useEffect(() => () => screen.dispose(), [screen]);

    // RGB glow from inside the case, cycling through hues
    const glow = useRef<THREE.PointLight>(null);
    useFrame(({ clock }) => glow.current?.color.setHSL((clock.elapsedTime * 0.05) % 1, 0.9, 0.55));

    return (
        <group>
            <Rest>
                <group position={[0.24, DESK_TOP, 0.85]} rotation={[0, Math.PI / 2, 0]}>
                    <Model url={MODEL_URLS.monitor} center={false} />
                    <mesh position={[0, SCREEN.y, SCREEN.z]} material={screen} userData={{ noSheen: true, noSupport: true }}>
                        <planeGeometry args={[SCREEN.width, SCREEN.height]} />
                    </mesh>
                </group>
            </Rest>

            {/* Mid-tower (authored in scripts/build-models.ts): fans towards the chair, glass side towards the room */}
            <Rest>
                <Model url={MODEL_URLS.pc} position={[0.32, DESK_TOP, 0.33]} rotation={[0, Math.PI / 2, 0]} />
            </Rest>
            <pointLight ref={glow} position={[0.32, DESK_TOP + 0.22, 0.5]} intensity={0.25} distance={0.7} decay={2} />

            <Rest>
                <Soft size={[0.3, 0.004, 0.8]} radius={0.002} position={[0.58, DESK_TOP, 0.85]} color={mat('#2D333A')} />
            </Rest>
            <Rest>
                <Model url={MODEL_URLS.keyboard} size={{ width: 0.44 }} position={[0.57, DESK_TOP + 0.01, 0.9]} rotation={[0, Math.PI / 2, 0]} />
            </Rest>
            <Rest>
                <Sphere radius={1} scale={[0.06, 0.022, 0.033]} position={[0.58, DESK_TOP + 0.03, 0.55]} color={mat('#444444')} />
            </Rest>
        </group>
    );
}

// ---------- TicketSlick tickets ----------

const TICKET = { width: 0.22, height: 0.085, stub: 0.052 };

const ticketShape = () => {
    const { width, height, stub } = TICKET;
    const r = 0.01, notch = 0.011;
    const x0 = -width / 2, x1 = width / 2, y0 = -height / 2, y1 = height / 2, nx = x1 - stub;
    const shape = new THREE.Shape();
    shape.moveTo(x0 + r, y0);
    shape.lineTo(nx - notch, y0);
    shape.absarc(nx, y0, notch, Math.PI, 0, true);
    shape.lineTo(x1 - r, y0);
    shape.quadraticCurveTo(x1, y0, x1, y0 + r);
    shape.lineTo(x1, y1 - r);
    shape.quadraticCurveTo(x1, y1, x1 - r, y1);
    shape.lineTo(nx + notch, y1);
    shape.absarc(nx, y1, notch, 0, Math.PI, true);
    shape.lineTo(x0 + r, y1);
    shape.quadraticCurveTo(x0, y1, x0, y1 - r);
    shape.lineTo(x0, y0 + r);
    shape.quadraticCurveTo(x0, y0, x0 + r, y0);
    return shape;
};

// Two concert tickets in the original blue and orange, about 15 cm long
function Ticket({ color, ...props }: { color: string } & Omit<JSX.IntrinsicElements['group'], 'children'>) {
    const geometry = useMemo(() => new THREE.ExtrudeGeometry(ticketShape(), { depth: 0.002, bevelEnabled: false }), []);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return (
        <group {...props}>
            <mesh geometry={geometry} material={mat(color)} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
    );
}

export function Tickets() {
    return (
        <Rest>
            {/* A fanned stack in the clear space behind the mat, boosted past real ticket size so it reads at this distance */}
            <group position={[0.2, DESK_TOP + 0.01, 1.36]} rotation={[0, -Math.PI / 2, 0]} scale={1.4}>
                <Ticket color="#E0D06A" rotation={[0, 0.75, 0]} position={[-0.02, 0, -0.02]} />
                <Ticket color="#2A8ABE" rotation={[0, 0.45, 0]} position={[0, 0.0025, 0]} />
                <Ticket color="#E79124" rotation={[0, 0.15, 0]} position={[0.025, 0.005, 0.03]} />
            </group>
        </Rest>
    );
}
