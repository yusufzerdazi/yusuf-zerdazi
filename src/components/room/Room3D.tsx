import * as THREE from 'three';
import { RefObject, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import roomSvg from '../../assets/home.svg?raw';
import { Hotspot } from './Hotspot';
import { HoverController } from './HoverController';
import { CameraRig } from './CameraRig';
import { BALCONY, BASE_DEPTH, ROOM_SIZE, Vec3, WALL_HEIGHT, rightWallUnprojection } from './iso';
import { Shell, Window } from './models/Shell';
import { Rug } from './models/Rug';
import { Chair, Desk } from './models/Desk';
import { Sofa, TvConsole } from './models/Lounge';
import { Balcony, Ground, Trees } from './models/Outdoor';
import { LiteContext, SECTION_MODELS, sectionDelay } from './sections';

// Content the camera keeps in frame, in world space: wall tops, the slab corners and the balcony
// (plus the title above the wall on larger screens, where it's shown)
const TITLE_TOP: Vec3 = [0, 2.8, 0];
const FRAME_POINTS: Vec3[] = [
    [0, WALL_HEIGHT, 0], [ROOM_SIZE, WALL_HEIGHT, 0], [0, WALL_HEIGHT, ROOM_SIZE],
    [ROOM_SIZE, -BASE_DEPTH, ROOM_SIZE], [0, -BASE_DEPTH, ROOM_SIZE], [ROOM_SIZE, -BASE_DEPTH, 0],
    [BALCONY.x1, -BASE_DEPTH, 0], [BALCONY.x1, -BASE_DEPTH, BALCONY.z1], [BALCONY.x1, 1.03, 0],
];

// Isometric drawing coordinates (x right, y down), one unit per metre along each axis
const COS30 = Math.cos(Math.PI / 6);
const toDrawing = ([x, y, z]: Vec3) => [(x - z) * COS30, (x + z) / 2 - y];
// `centred` widens the frame symmetrically so the room's back corner sits in the middle of the screen
const framing = (points: Vec3[], centred = false) => {
    const projected = points.map(toDrawing);
    const xs = projected.map(p => p[0]), ys = projected.map(p => p[1]);
    let [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
    const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
    if (centred) [minX, maxX] = [-Math.max(-minX, maxX), Math.max(-minX, maxX)];
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    // The floor-level point that projects to the centre of the frame
    const diff = cx / COS30, sum = cy * 2;
    // An orthographic camera at the isometric angle shows one drawing unit as sqrt(2/3) camera units
    const toCamera = Math.sqrt(2 / 3);
    return {
        centre: new THREE.Vector3((sum + diff) / 2, 0, (sum - diff) / 2),
        width: (maxX - minX) * toCamera,
        height: (maxY - minY) * toCamera,
    };
};
const FRAME = framing([TITLE_TOP, ...FRAME_POINTS], true);
// Phones show just the room: no title on the wall, no balcony
const FRAME_MOBILE = framing(FRAME_POINTS.filter(([x]) => x <= ROOM_SIZE));

// The name and logo from the illustration, unprojected onto the right-hand wall
const TITLE_BOUNDS = { x0: 0, x1: 2.75, y0: 2.15, y1: 2.8 };
const TITLE_SCALE = 700;

const titleTextureUrl = (() => {
    const doc = new DOMParser().parseFromString(roomSvg, 'image/svg+xml');
    const style = doc.querySelector('style')?.textContent ?? '';
    const title = doc.getElementById('Title');
    const { x0, x1, y0, y1 } = TITLE_BOUNDS;
    const width = Math.round((x1 - x0) * TITLE_SCALE);
    const height = Math.round((y1 - y0) * TITLE_SCALE);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
        + `<style>${style}</style><g transform="${rightWallUnprojection(x0, y1, TITLE_SCALE)}">${title?.innerHTML ?? ''}</g></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
})();

function WallTitle() {
    const texture = useTexture(titleTextureUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    const { x0, x1, y0, y1 } = TITLE_BOUNDS;
    return (
        <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, 0.003]}>
            <planeGeometry args={[x1 - x0, y1 - y0]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
    );
}

interface Room3DProps {
    sectionIds: string[];
    hoveredId: string | null;
    painting: string;
    isMobile: boolean;
    className?: string;
    onHover: (id: string | null, event?: PointerEvent) => void;
    onSelect: (id: string) => void;
    // Stop rendering, e.g. while a modal covers the room
    paused?: boolean;
    // Called once every model has loaded
    onReady?: () => void;
}

// Models arrive asynchronously, so keep shadow flags in step with whatever is in the scene
function ShadowFlags() {
    const scene = useThree(state => state.scene);
    const frame = useRef(0);
    useFrame(() => {
        if (frame.current++ % 30) return;
        scene.traverse(object => {
            const mesh = object as THREE.Mesh;
            if (!mesh.isMesh) return;
            if (mesh.userData.noShadow) {
                mesh.castShadow = mesh.receiveShadow = false;
                return;
            }
            const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
            const unlit = (material as THREE.MeshBasicMaterial).isMeshBasicMaterial;
            mesh.castShadow = !unlit && !material.transparent;
            mesh.receiveShadow = !unlit;
        });
    });
    return null;
}

// Light target near the middle of the room and balcony
const LIGHT_TARGET = new THREE.Vector3(2.9, 0, 2.1);

// Phones: render on demand instead of every frame. The canvas scrolls natively with the page, so nothing needs
// redrawing as you scroll; a 30 fps tick keeps the animated bits (LED panel, monitor) going while the room is on
// screen, and rendering stops entirely once it has scrolled away.
function MobileFrames({ slot }: { slot: RefObject<HTMLElement> }) {
    const invalidate = useThree(state => state.invalidate);
    useEffect(() => {
        let visible = true;
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            invalidate();
        });
        if (slot.current) observer.observe(slot.current);
        const tick = window.setInterval(() => visible && invalidate(), 1000 / 30);
        return () => {
            observer.disconnect();
            window.clearInterval(tick);
        };
    }, [invalidate, slot]);
    return null;
}

function Lighting({ shadowMapSize }: { shadowMapSize: number }) {
    const target = useMemo(() => {
        const object = new THREE.Object3D();
        object.position.copy(LIGHT_TARGET);
        return object;
    }, []);
    // Calibrated so faces shade like the illustration: tops brightest, +X faces mid, +Z faces darkest.
    // The key light comes from the open front of the room, so shadows fall back towards the walls.
    const position = useMemo(() => LIGHT_TARGET.clone().add(new THREE.Vector3(0.493, 0.845, 0.211).multiplyScalar(10)), []);
    return (
        <>
            <primitive object={target} />
            <ambientLight intensity={0.4 * Math.PI} />
            <directionalLight
                position={position}
                target={target}
                intensity={0.71 * Math.PI}
                castShadow
                shadow-mapSize={[shadowMapSize, shadowMapSize]}
                shadow-bias={-0.0002}
                shadow-normalBias={0.012}
                shadow-radius={2.5}
            >
                <orthographicCamera attach="shadow-camera" args={[-5.5, 5.5, 5.5, -5.5, 0.1, 30]} />
            </directionalLight>
        </>
    );
}

// The scene is static apart from objects lifting on hover, so only redraw the shadow map for a moment after
// loading and after each hover change, instead of every frame
// (and when switching to the phone layout, which drops the balcony and trees)
function ShadowUpdates({ hoveredId, ready, isMobile }: { hoveredId: string | null; ready: boolean; isMobile: boolean }) {
    const gl = useThree(state => state.gl);
    const until = useRef(0);
    useEffect(() => {
        gl.shadowMap.autoUpdate = false;
        until.current = performance.now() + 2000;
    }, [gl, hoveredId, ready, isMobile]);
    useFrame(() => {
        if (performance.now() < until.current) gl.shadowMap.needsUpdate = true;
    });
    return null;
}

// Tells the page once every model in the room has loaded
function Ready({ onReady }: { onReady: () => void }) {
    useEffect(() => onReady(), [onReady]);
    return null;
}

// Development only: lets the automated UI checks find each object on screen (window.__room.screenPositions())
function TestHook() {
    const scene = useThree(state => state.scene);
    const camera = useThree(state => state.camera);
    const gl = useThree(state => state.gl);
    useEffect(() => {
        if (!import.meta.env.DEV) return;
        (window as unknown as { __room: unknown }).__room = {
            hitsAt: (x: number, y: number) => {
                const rect = gl.domElement.getBoundingClientRect();
                const raycaster = new THREE.Raycaster();
                raycaster.layers.enableAll();
                raycaster.setFromCamera(new THREE.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1), camera);
                return raycaster.intersectObjects(scene.children, true).slice(0, 8).map(h => {
                    let o: THREE.Object3D | null = h.object;
                    while (o && !o.userData.hotspot) o = o.parent;
                    return `${o?.userData.hotspot ?? '-'}${h.object.userData.hitBox ? '(box)' : ''} ${h.distance.toFixed(2)}`;
                });
            },
            screenPositions: () => {
                const rect = gl.domElement.getBoundingClientRect();
                const out: Record<string, [number, number]> = {};
                scene.traverse(object => {
                    if (!object.userData.hotspot) return;
                    // Find a point on screen where this object is the first thing the pointer would hit
                    const id = object.userData.hotspot as string;
                    const box = new THREE.Box3();
                    object.traverse(child => {
                        const mesh = child as THREE.Mesh;
                        if (mesh.isMesh && !mesh.userData.hitBox) box.expandByObject(mesh);
                    });
                    const corners = [0, 1, 2, 3, 4, 5, 6, 7].map(i => new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera));
                    const [x0, x1] = [Math.min(...corners.map(c => c.x)), Math.max(...corners.map(c => c.x))];
                    const [y0, y1] = [Math.min(...corners.map(c => c.y)), Math.max(...corners.map(c => c.y))];
                    const raycaster = new THREE.Raycaster();
                    const ndc = new THREE.Vector2();
                    let best: [number, number] | null = null, bestScore = Infinity;
                    for (let i = 1; i < 12; i++) for (let j = 1; j < 12; j++) {
                        ndc.set(x0 + (x1 - x0) * i / 12, y0 + (y1 - y0) * j / 12);
                        raycaster.setFromCamera(ndc, camera);
                        const hit = raycaster.intersectObjects(scene.children, true).find(h => h.object.visible && !h.object.userData.hitBox);
                        let owner: THREE.Object3D | null = hit?.object ?? null;
                        while (owner && !owner.userData.hotspot) owner = owner.parent;
                        if (owner?.userData.hotspot !== id) continue;
                        const score = Math.abs(i - 6) + Math.abs(j - 6);
                        if (score < bestScore) { bestScore = score; best = [ndc.x, ndc.y]; }
                    }
                    if (best) out[id] = [rect.left + (best[0] + 1) / 2 * rect.width, rect.top + (1 - best[1]) / 2 * rect.height];
                });
                return out;
            },
        };
    }, [scene, camera, gl]);
    return null;
}

function Room3D({ sectionIds, hoveredId, painting, isMobile, className, onHover, onSelect, paused = false, onReady }: Room3DProps) {
    const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
    const [ready, setReady] = useState(false);
    const [viewChanged, setViewChanged] = useState(false);
    const [resetSignal, setResetSignal] = useState(0);
    const markReady = useCallback(() => {
        setReady(true);
        onReady?.();
    }, [onReady]);
    const slot = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.cursor = hoveredId ? 'pointer' : '';
        return () => { document.body.style.cursor = ''; };
    }, [hoveredId]);

    return (
        <div ref={slot} className={className} style={isMobile ? { aspectRatio: `${FRAME_MOBILE.width} / ${FRAME_MOBILE.height * 1.06}`, pointerEvents: 'none' } : undefined}>
            <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} style={{ pointerEvents: isMobile ? 'none' : 'auto' }}>
                <Canvas
                    orthographic
                    frameloop={paused ? 'never' : isMobile ? 'demand' : 'always'}
                    flat
                    shadows
                    dpr={isMobile ? [1, 1.5] : [1, 2]}
                    camera={{ near: 0.1, far: 200, position: [20, 20, 20] }}
                    onCreated={({ gl }) => { gl.domElement.style.touchAction = 'pan-y'; }}
                    aria-label="Isometric 3D room. Click objects to explore projects. Scroll to zoom and drag to look around."
                >
                    <CameraRig
                        frame={isMobile ? FRAME_MOBILE : FRAME}
                        parallax={false}
                        interactive={!isMobile}
                        ready={ready || reducedMotion}
                        resetSignal={resetSignal}
                        onViewChange={setViewChanged}
                    />
                    <Lighting shadowMapSize={isMobile ? 1024 : 4096} />
                    {isMobile && <MobileFrames slot={slot} />}
                    <ShadowFlags />
                    <ShadowUpdates hoveredId={hoveredId} ready={ready} isMobile={isMobile} />
                    {/* Phones navigate with the section list below the room, so the room itself isn't interactive */}
                    {!isMobile && <HoverController hoveredId={hoveredId} onHover={onHover} onSelect={onSelect} />}
                    <TestHook />

                    <LiteContext.Provider value={isMobile}>
                    <Suspense fallback={null}>
                        {/* On phones the page's CSS grid shows through the transparent canvas instead */}
                        {!isMobile && <Ground />}
                        {!isMobile && <Trees />}
                        <Shell />
                        {!isMobile && <Balcony />}
                        <Rug />
                        <Window />
                        <Desk />
                        <Chair />
                        <Sofa />
                        <TvConsole />
                        {!isMobile && <WallTitle />}

                        {sectionIds.filter(id => SECTION_MODELS[id]).map(id => isMobile ? (
                            <group key={id}>{SECTION_MODELS[id].render(painting)}</group>
                        ) : (
                            <Hotspot
                                key={id}
                                id={id}
                                delay={sectionDelay(sectionIds, id)}
                                hovered={hoveredId === id}
                                showSheen={!reducedMotion}
                                lift={SECTION_MODELS[id].lift}
                            >
                                {SECTION_MODELS[id].render(painting)}
                            </Hotspot>
                        ))}
                        <Ready onReady={markReady} />
                    </Suspense>
                    </LiteContext.Provider>
                </Canvas>
            </div>

            {!ready && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4" role="status">
                    <div className="size-6 rotate-45 animate-spin rounded-[6px] border-2 border-slate-300 border-t-slate-600" />
                    <p className="font-display text-sm font-medium text-slate-500">Furnishing the room…</p>
                </div>
            )}

            {viewChanged && (
                <button
                    onClick={() => setResetSignal(signal => signal + 1)}
                    className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-fade-in rounded-full border border-white/70 bg-white/85 px-4 py-2 font-display text-sm font-semibold text-slate-700 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md transition hover:bg-white"
                >
                    Reset view
                </button>
            )}
        </div>
    );
}

export default Room3D;
