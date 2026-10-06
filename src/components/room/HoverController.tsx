import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { HIT_LAYER } from './iso';

interface HoverControllerProps {
    hoveredId: string | null;
    onHover: (id: string | null, event?: PointerEvent) => void;
    onSelect: (id: string) => void;
}

// A pointer that moves further than this between press and release was dragging the view, not clicking
const CLICK_SLOP = 6;

const hotspotOf = (object: THREE.Object3D | null): string | undefined => {
    for (let node = object; node; node = node.parent) if (node.userData.hotspot) return node.userData.hotspot;
    return undefined;
};

// Works out which interactive object is under the pointer, every frame.
//
// The frontmost object wins. While an object is hovered it lifts and shimmers, and its invisible hit box (which
// covers both its resting and lifted positions) keeps it hovered so it can't slip out from under a still pointer —
// but only while no other object is under the cursor, so moving straight onto a neighbour hands over at once.
// Picking every frame, rather than reacting to pointer events, means hovers also update when objects move.
export function HoverController({ hoveredId, onHover, onSelect }: HoverControllerProps) {
    const scene = useThree(state => state.scene);
    const camera = useThree(state => state.camera);
    const element = useThree(state => state.gl.domElement);
    const raycaster = useMemo(() => {
        const r = new THREE.Raycaster();
        r.layers.enable(HIT_LAYER);
        return r;
    }, []);
    const pointer = useRef<{ event: PointerEvent; inside: boolean } | null>(null);
    const current = useRef(hoveredId);
    current.current = hoveredId;

    const pick = useMemo(() => (clientX: number, clientY: number, keep: string | null) => {
        const rect = element.getBoundingClientRect();
        raycaster.setFromCamera(new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1), camera);
        let keepHit = false;
        for (const hit of raycaster.intersectObjects(scene.children, true)) {
            const id = hotspotOf(hit.object);
            if (!id) continue;
            if (hit.object.userData.hitBox) {
                if (id === keep) keepHit = true;
                continue;
            }
            return id;
        }
        return keepHit ? keep : null;
    }, [element, raycaster, camera, scene]);

    useEffect(() => {
        let down: { x: number; y: number } | null = null;
        const onMove = (event: PointerEvent) => {
            if (event.pointerType === 'mouse') pointer.current = { event, inside: true };
        };
        const onLeave = () => { pointer.current = null; onHover(null); };
        const onDown = (event: PointerEvent) => { down = { x: event.clientX, y: event.clientY }; };
        const onUp = (event: PointerEvent) => {
            if (!down || Math.hypot(event.clientX - down.x, event.clientY - down.y) > CLICK_SLOP) return;
            down = null;
            const id = pick(event.clientX, event.clientY, current.current);
            if (id) onSelect(id);
        };
        element.addEventListener('pointermove', onMove);
        element.addEventListener('pointerleave', onLeave);
        element.addEventListener('pointerdown', onDown);
        element.addEventListener('pointerup', onUp);
        return () => {
            element.removeEventListener('pointermove', onMove);
            element.removeEventListener('pointerleave', onLeave);
            element.removeEventListener('pointerdown', onDown);
            element.removeEventListener('pointerup', onUp);
        };
    }, [element, pick, onHover, onSelect]);

    const last = useRef<{ id: string | null; event: PointerEvent | null }>({ id: null, event: null });
    useFrame(() => {
        const state = pointer.current;
        if (!state) return;
        const id = pick(state.event.clientX, state.event.clientY, current.current);
        // Report changes of object, and pointer movement over the same object so the tooltip follows
        if (id !== last.current.id || (id && state.event !== last.current.event)) onHover(id, state.event);
        last.current = { id, event: state.event };
    });

    return null;
}
