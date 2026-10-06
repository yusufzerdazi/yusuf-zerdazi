import * as THREE from 'three';
import { ReactNode, RefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, ContactShadows, PresentationControls } from '@react-three/drei';
import { PreviewContext, SECTION_MODELS } from './sections';

// Same calibrated flat lighting as the room, so objects look identical on their own
function StageLighting() {
    return (
        <>
            <ambientLight intensity={0.4 * Math.PI} />
            <directionalLight position={[4.93, 8.45, 2.11]} intensity={0.71 * Math.PI} />
        </>
    );
}

// Isolates one section's object, centred with its base at y = 0
function Subject({ id, painting }: { id: string; painting: string }) {
    const model = SECTION_MODELS[id];
    if (!model) return null;
    return (
        <PreviewContext.Provider value={true}>
            <Center top>{model.render(painting)}</Center>
        </PreviewContext.Provider>
    );
}

// The stage looks at objects exactly as the room does: an orthographic camera along the isometric diagonal
const VIEW_DIRECTION = new THREE.Vector3(1, 1, 1).normalize();
const STAGE_CAMERA = { position: [10, 10, 10] as [number, number, number], zoom: 100, near: 0.1, far: 100 };

// Frames the subject: centres it and sets the zoom so its on-screen outline fits with a margin. It re-fits for
// the first couple of seconds while models and textures arrive, then holds still so the sway doesn't breathe.
function Fit({ subject, margin }: { subject: RefObject<THREE.Object3D>; margin: number }) {
    const camera = useThree(state => state.camera) as THREE.OrthographicCamera;
    const size = useThree(state => state.size);
    const frame = useRef(0);
    const scratch = useMemo(() => ({ box: new THREE.Box3(), centre: new THREE.Vector3(), corner: new THREE.Vector3() }), []);
    useEffect(() => { frame.current = 0; }, [size.width, size.height]);
    useFrame(() => {
        const object = subject.current;
        if (!object || frame.current > 120 || frame.current++ % 6) return;
        const { box, centre, corner } = scratch;
        box.setFromObject(object);
        if (box.isEmpty()) return;
        box.getCenter(centre);
        camera.position.copy(centre).addScaledVector(VIEW_DIRECTION, 20);
        camera.lookAt(centre);
        camera.updateMatrixWorld();
        // Extent of the box corners across the camera's view
        const inverse = camera.matrixWorldInverse;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < 8; i++) {
            corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).applyMatrix4(inverse);
            minX = Math.min(minX, corner.x); maxX = Math.max(maxX, corner.x);
            minY = Math.min(minY, corner.y); maxY = Math.max(maxY, corner.y);
        }
        camera.zoom = Math.min(size.width / (maxX - minX), size.height / (maxY - minY)) / margin;
        camera.updateProjectionMatrix();
    });
    return null;
}

// Sways the object gently either side of its room orientation, so its form reads in 3D
function Sway({ children, paused }: { children: ReactNode; paused: boolean }) {
    const group = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (group.current) group.current.rotation.y = paused ? 0 : Math.sin(clock.elapsedTime * 0.6) * 0.3;
    });
    return <group ref={group}>{children}</group>;
}

// The section's object, seen from the room's angle and gently swaying; drag to spin it
export function SectionStage({ id, painting, className }: { id: string; painting: string; className?: string }) {
    const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
    const subject = useRef<THREE.Group>(null);
    return (
        <div className={className}>
            <Canvas flat orthographic dpr={[1, 2]} camera={STAGE_CAMERA} aria-label="3D view of this section's object. Drag to rotate.">
                <StageLighting />
                <Suspense fallback={null}>
                    <PresentationControls global snap rotation={[0, 0, 0]} polar={[-0.2, 0.3]} azimuth={[-Infinity, Infinity]}>
                        <Sway paused={reducedMotion}>
                            <group ref={subject}>
                                <Subject id={id} painting={painting} />
                            </group>
                        </Sway>
                    </PresentationControls>
                    <Fit subject={subject} margin={1.45} />
                    <ContactShadows position={[0, -0.001, 0]} opacity={0.35} scale={4} blur={2.2} far={2} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ---------- Thumbnails ----------

// Waits a few frames for textures to settle, then grabs the canvas
function Capture({ onCapture }: { onCapture: (url: string) => void }) {
    const gl = useThree(state => state.gl);
    const frames = useRef(0);
    const done = useRef(false);
    useFrame(() => {
        if (done.current || ++frames.current < 24) return;
        done.current = true;
        onCapture(gl.domElement.toDataURL('image/png'));
    });
    return null;
}

// Renders each section's object once in an off-screen canvas and hands back still images,
// so lists of sections (the mobile grid) can show the real 3D objects without a live canvas each
export function ThumbnailStudio({ ids, painting, onThumbnail }: { ids: string[]; painting: string; onThumbnail: (id: string, url: string) => void }) {
    const [index, setIndex] = useState(0);
    const subject = useRef<THREE.Group>(null);
    const id = ids[index];
    useEffect(() => setIndex(0), [ids]);
    if (!id) return null;
    return (
        <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0, width: 320, height: 320, pointerEvents: 'none' }}>
            <Canvas flat orthographic dpr={1} gl={{ preserveDrawingBuffer: true, alpha: true }} camera={STAGE_CAMERA}>
                <StageLighting />
                <Suspense fallback={null}>
                    <group key={id} ref={subject}>
                        <Subject id={id} painting={painting} />
                    </group>
                    <Fit key={`fit-${id}`} subject={subject} margin={1.12} />
                    <Capture key={`capture-${id}`} onCapture={url => { onThumbnail(id, url); setIndex(i => i + 1); }} />
                </Suspense>
            </Canvas>
        </div>
    );
}
