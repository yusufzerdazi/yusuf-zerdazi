import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { Vec3 } from './iso';
import { mat } from './materials';

type MeshProps = Omit<ThreeElements['mesh'], 'args'>;
export type Surface = string | THREE.Material | THREE.Material[];

const resolve = (surface: Surface) => typeof surface === 'string' ? mat(surface) : surface;

// Box spanning two corners, handy for furniture laid out in room coordinates
export function Span({ from, to, color, ...props }: { from: Vec3; to: Vec3; color: Surface } & MeshProps) {
    const size: Vec3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
    const center: Vec3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
    return (
        <mesh position={center} material={resolve(color)} {...props}>
            <boxGeometry args={size} />
        </mesh>
    );
}

// Box by centre and size
export function Box({ size, color, ...props }: { size: Vec3; color: Surface } & MeshProps) {
    return (
        <mesh material={resolve(color)} {...props}>
            <boxGeometry args={size} />
        </mesh>
    );
}

// Softened box for upholstery, plastics and anything machined
export function Soft({ size, color, radius = 0.04, ...props }: { size: Vec3; color: Surface; radius?: number } & MeshProps) {
    return (
        <RoundedBox args={size} radius={Math.min(radius, ...size.map(s => s / 2 - 1e-4))} smoothness={3} material={resolve(color)} {...props} />
    );
}

export function Cylinder({ radius, height, color, segments = 24, radiusBottom, ...props }: { radius: number; height: number; color: Surface; segments?: number; radiusBottom?: number } & MeshProps) {
    return (
        <mesh material={resolve(color)} {...props}>
            <cylinderGeometry args={[radius, radiusBottom ?? radius, height, segments]} />
        </mesh>
    );
}

export function Sphere({ radius, color, segments = 20, ...props }: { radius: number; color: Surface; segments?: number } & MeshProps) {
    return (
        <mesh material={resolve(color)} {...props}>
            <sphereGeometry args={[radius, segments, Math.round(segments * 0.75)]} />
        </mesh>
    );
}
