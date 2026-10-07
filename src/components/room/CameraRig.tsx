import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ISO_ELEVATION } from './iso';

export interface Framing {
    centre: THREE.Vector3;
    width: number;
    height: number;
}

interface CameraRigProps {
    frame: Framing;
    // Lean the view slightly towards the pointer
    parallax: boolean;
    // Scroll to zoom, drag to pan, double-click to reset
    interactive: boolean;
    // Plays the intro move once the room has loaded
    ready: boolean;
    // Bump to animate back to the default view
    resetSignal: number;
    onViewChange: (changed: boolean) => void;
}

const MAX_ZOOM = 3.5;
const MAX_PAN = 4;
const DRAG_THRESHOLD = 4;
// Far enough back that the ground stays in front of the camera even when the room is scrolled up the page
const DISTANCE = 60;

// Isometric camera framed on the room, with parallax, zoom towards the cursor and drag to pan.
// Changes ease towards their targets so the view always moves smoothly.
export function CameraRig({ frame, parallax, interactive, ready, resetSignal, onViewChange }: CameraRigProps) {
    const camera = useThree(state => state.camera) as THREE.OrthographicCamera;
    const size = useThree(state => state.size);
    const element = useThree(state => state.gl.domElement);

    const view = useRef({
        zoom: 1, zoomTarget: 1,
        pan: new THREE.Vector3(), panTarget: new THREE.Vector3(),
        azimuth: 0, elevation: 0,
        intro: 0,
        changed: false,
    });
    const basis = useRef({ right: new THREE.Vector3(), up: new THREE.Vector3() });
    const fitZoom = () => Math.min(size.width / frame.width, size.height / frame.height) * 0.94;

    useEffect(() => {
        if (resetSignal === 0) return;
        view.current.zoomTarget = 1;
        view.current.panTarget.set(0, 0, 0);
    }, [resetSignal]);

    useEffect(() => {
        if (!interactive) return;
        const v = view.current;
        // World-space offset of a screen point from the view centre, at a given zoom factor
        const offsetAt = (clientX: number, clientY: number, zoomFactor: number) => {
            const rect = element.getBoundingClientRect();
            const scale = fitZoom() * zoomFactor;
            const { right, up } = basis.current;
            return right.clone().multiplyScalar((clientX - rect.left - rect.width / 2) / scale)
                .addScaledVector(up, (rect.height / 2 - (clientY - rect.top)) / scale);
        };
        const clampPan = () => v.panTarget.clampLength(0, MAX_PAN);

        const onWheel = (event: WheelEvent) => {
            event.preventDefault();
            const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.0015));
            const next = THREE.MathUtils.clamp(v.zoomTarget * factor, 1, MAX_ZOOM);
            // Keep the point under the cursor fixed while zooming
            v.panTarget.add(offsetAt(event.clientX, event.clientY, v.zoomTarget)).sub(offsetAt(event.clientX, event.clientY, next));
            v.zoomTarget = next;
            if (next === 1) v.panTarget.multiplyScalar(0.5);
            clampPan();
        };

        let drag: { x: number; y: number; moved: boolean } | null = null;
        const onDown = (event: PointerEvent) => {
            if (event.button !== 0) return;
            drag = { x: event.clientX, y: event.clientY, moved: false };
        };
        const onMove = (event: PointerEvent) => {
            if (!drag) return;
            const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
            if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
            drag.moved = true;
            element.style.cursor = 'grabbing';
            const scale = fitZoom() * v.zoomTarget;
            const { right, up } = basis.current;
            v.panTarget.addScaledVector(right, -dx / scale).addScaledVector(up, dy / scale);
            clampPan();
            // Pan instantly while dragging so the room sticks to the pointer
            v.pan.copy(v.panTarget);
            drag.x = event.clientX;
            drag.y = event.clientY;
        };
        const onUp = () => {
            if (drag?.moved) element.style.cursor = '';
            drag = null;
        };
        const onDoubleClick = () => {
            v.zoomTarget = 1;
            v.panTarget.set(0, 0, 0);
        };

        element.addEventListener('wheel', onWheel, { passive: false });
        element.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        element.addEventListener('dblclick', onDoubleClick);
        return () => {
            element.removeEventListener('wheel', onWheel);
            element.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            element.removeEventListener('dblclick', onDoubleClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactive, element, size.width, size.height]);

    useFrame(({ pointer }, delta) => {
        const v = view.current;
        const ease = (rate: number) => 1 - Math.exp(-delta * rate);

        // Intro: settle in from slightly further out and turned, once everything has loaded
        if (ready) v.intro = Math.min(1, v.intro + delta / 1.6);
        const intro = 1 - Math.pow(1 - v.intro, 3);

        v.azimuth += ((parallax ? pointer.x * 0.08 : 0) - v.azimuth) * ease(3);
        v.elevation += ((parallax ? pointer.y * 0.04 : 0) - v.elevation) * ease(3);
        v.zoom += (v.zoomTarget - v.zoom) * ease(9);
        v.pan.lerp(v.panTarget, ease(9));

        const azimuth = Math.PI / 4 + v.azimuth - (1 - intro) * 0.35;
        const elevation = ISO_ELEVATION - v.elevation + (1 - intro) * 0.12;
        const centre = frame.centre.clone().add(v.pan);
        const fit = fitZoom();
        camera.position.set(
            centre.x + DISTANCE * Math.cos(elevation) * Math.sin(azimuth),
            centre.y + DISTANCE * Math.sin(elevation),
            centre.z + DISTANCE * Math.cos(elevation) * Math.cos(azimuth),
        );
        camera.lookAt(centre);
        camera.updateMatrixWorld();
        basis.current.right.setFromMatrixColumn(camera.matrixWorld, 0);
        basis.current.up.setFromMatrixColumn(camera.matrixWorld, 1);

        const zoom = fit * v.zoom * (0.82 + 0.18 * intro);
        if (Math.abs(camera.zoom - zoom) > 1e-4) {
            camera.zoom = zoom;
            camera.updateProjectionMatrix();
        }

        const changed = v.zoomTarget > 1.01 || v.panTarget.length() > 0.02;
        if (changed !== v.changed) {
            v.changed = changed;
            onViewChange(changed);
        }
    });

    return null;
}
