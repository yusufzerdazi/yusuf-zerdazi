import * as THREE from 'three';
import { ReactNode, useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { usePreview } from './sections';

interface RestProps {
    children: ReactNode;
    // Drop onto whatever is underneath (floor, rug, desk, shelf, sofa...)
    drop?: boolean;
    // Push flush against a wall: the left-hand wall is the X = 0 plane, the right-hand wall Z = 0
    against?: 'left' | 'right';
    // Gap to leave against the wall
    gap?: number;
    // How far a soft thing settles into what it rests on (cushions, pillows)
    sink?: number;
}

const DOWN = new THREE.Vector3(0, -1, 0);
const UP = new THREE.Vector3(0, 1, 0);
const GRID = 9;

const isSolid = (mesh: THREE.Mesh) => {
    const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
    return mesh.visible && !material.transparent && !mesh.userData.noSupport;
};

// Raycasts only see front faces, and some models have flipped faces; treat everything as double-sided while measuring
const withDoubleSided = <T,>(meshes: THREE.Mesh[], measure: () => T): T => {
    const sides = new Map<THREE.Material, THREE.Side>();
    for (const mesh of meshes) {
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            if (!sides.has(material)) sides.set(material, material.side);
            material.side = THREE.DoubleSide;
        }
    }
    try {
        return measure();
    } finally {
        sides.forEach((side, material) => { material.side = side; });
    }
};

// Settles its children into the room once everything has loaded, so models sit on surfaces and
// against walls instead of relying on hand-tuned heights.
//
// Dropping works by contact: across a grid of columns under the object, it finds the object's own
// lowest point (ray up) and the support beneath that point (ray down), then moves the object so the
// first point of contact just touches. Tilted pillows, a cat with its tail over the edge and anything
// with feet all come to rest properly. Supports are the other solid meshes in the scene.
//
// On its own (modal turntable, thumbnails) there's nothing to rest on, so it leaves things as authored.
export function Rest({ children, drop = true, against, gap = 0.003, sink = 0 }: RestProps) {
    const group = useRef<THREE.Group>(null);
    const scene = useThree(state => state.scene);
    const preview = usePreview();

    useLayoutEffect(() => {
        const node = group.current;
        if (!node || preview) return;
        node.position.set(0, 0, 0);
        scene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(node);
        if (box.isEmpty()) return;

        // Rest is only used under unrotated, unscaled parents in the room, so world offsets are local offsets
        const move = (x: number, y: number, z: number) => {
            node.position.add(new THREE.Vector3(x, y, z));
            node.updateMatrixWorld(true);
        };
        if (against === 'left') move(gap - box.min.x, 0, 0);
        if (against === 'right') move(0, 0, gap - box.min.z);
        box.setFromObject(node);
        if (!drop) return;

        const own: THREE.Mesh[] = [];
        const ownSet = new Set<THREE.Object3D>();
        node.traverse(object => {
            ownSet.add(object);
            const mesh = object as THREE.Mesh;
            if (mesh.isMesh && isSolid(mesh)) own.push(mesh);
        });
        const supports: THREE.Mesh[] = [];
        scene.traverse(object => {
            const mesh = object as THREE.Mesh;
            if (mesh.isMesh && !ownSet.has(mesh) && isSolid(mesh)) supports.push(mesh);
        });

        const lift = withDoubleSided([...own, ...supports], () => {
            const raycaster = new THREE.Raycaster();
            const origin = new THREE.Vector3();
            let best = -Infinity;
            for (let i = 0; i < GRID; i++) {
                for (let j = 0; j < GRID; j++) {
                    const x = THREE.MathUtils.lerp(box.min.x, box.max.x, (i + 0.5) / GRID);
                    const z = THREE.MathUtils.lerp(box.min.z, box.max.z, (j + 0.5) / GRID);
                    raycaster.set(origin.set(x, box.min.y - 0.5, z), UP);
                    const bottom = raycaster.intersectObjects(own, false)[0];
                    if (!bottom) continue;
                    raycaster.set(origin.set(x, box.max.y, z), DOWN);
                    const surface = raycaster.intersectObjects(supports, false)[0];
                    if (surface) best = Math.max(best, surface.point.y - bottom.point.y);
                }
            }
            return best;
        });
        if (Number.isFinite(lift)) move(0, lift - sink, 0);
    }, [scene, preview, drop, against, gap, sink]);

    return <group ref={group}>{children}</group>;
}
