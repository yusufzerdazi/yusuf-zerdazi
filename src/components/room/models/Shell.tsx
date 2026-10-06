import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { BASE_DEPTH, ROOM_SIZE as L, WALL_HEIGHT as H, WALL_THICKNESS as T, WINDOW } from '../iso';
import { Span } from '../primitives';
import { flat } from '../materials';

// Box face order: +x, -x, +y, -y, +z, -z
const faces = (px: string, py: string, pz: string) => [flat(px), flat(px), flat(py), flat(py), flat(pz), flat(pz)];

// Invisible surface that only shows the shadows falling on it
function ShadowCatcher({ size, ...props }: { size: [number, number] } & JSX.IntrinsicElements['mesh']) {
    return (
        <mesh receiveShadow userData={{ noSheen: true, noSupport: true }} {...props}>
            <planeGeometry args={size} />
            <shadowMaterial opacity={0.18} depthWrite={false} />
        </mesh>
    );
}

// Left-hand wall outline, from the slab base to the top, with the window cut out
const leftWallShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -BASE_DEPTH);
    shape.lineTo(L, -BASE_DEPTH);
    shape.lineTo(L, H);
    shape.lineTo(0, H);
    shape.lineTo(0, -BASE_DEPTH);
    const { z0, z1, y0, y1 } = WINDOW;
    shape.holes.push(new THREE.Path([new THREE.Vector2(z0, y0), new THREE.Vector2(z0, y1), new THREE.Vector2(z1, y1), new THREE.Vector2(z1, y0), new THREE.Vector2(z0, y0)]));
    return shape;
};

// Walls and floor in the illustration's exact flat colours, with shadows laid over them
export function Shell() {
    const rightWall = useMemo(() => faces('#CDD3C7', '#EEF1EA', '#E0E5DA'), []);
    const floor = useMemo(() => faces('#E4E4E4', '#F9F9F9', '#EDEDED'), []);
    const { wall, wallShadow } = useMemo(() => {
        // Extruded along local +Z, then turned so the wall's face looks into the room (+X)
        const wallGeometry = new THREE.ExtrudeGeometry(leftWallShape(), { depth: T, bevelEnabled: false });
        return { wall: wallGeometry, wallShadow: new THREE.ShapeGeometry(leftWallShape()) };
    }, []);
    useEffect(() => () => { wall.dispose(); wallShadow.dispose(); }, [wall, wallShadow]);
    // Extrude groups: 0 = faces, 1 = edges (top, end and the window reveal)
    const leftWall = useMemo(() => [flat('#EBF5E4'), flat('#F4FAF0')], []);
    const shadowBothSides = useMemo(() => new THREE.ShadowMaterial({ opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }), []);
    useEffect(() => () => shadowBothSides.dispose(), [shadowBothSides]);

    return (
        <group>
            <mesh geometry={wall} material={leftWall} rotation={[0, -Math.PI / 2, 0]} />
            <mesh geometry={wallShadow} material={shadowBothSides} rotation={[0, -Math.PI / 2, 0]} position={[0.001, 0, 0]} receiveShadow userData={{ noSheen: true, noSupport: true }} />
            <Span from={[-T, -BASE_DEPTH, -T]} to={[L, H, 0]} color={rightWall} />
            <Span from={[0, -BASE_DEPTH, 0]} to={[L, 0, L]} color={floor} />
            <ShadowCatcher size={[L, L]} position={[L / 2, 0.014, L / 2]} rotation={[-Math.PI / 2, 0, 0]} />
            <ShadowCatcher size={[L, H]} position={[L / 2, H / 2, 0.001]} />
        </group>
    );
}

// Window frame and glazing; the opening is cut through the wall, so you can see outside
export function Window() {
    const { z0, z1, y0, y1 } = WINDOW;
    const zc = (z0 + z1) / 2;
    const frame = useMemo(() => faces('#FFFFFF', '#FFFFFF', '#D0D2D3'), []);
    const glass = useMemo(() => new THREE.MeshLambertMaterial({ color: '#CFE6F2', transparent: true, opacity: 0.22, depthWrite: false }), []);
    useEffect(() => () => glass.dispose(), [glass]);
    return (
        <group>
            {/* The frame laps a little into the opening so none of its faces sit flush with the wall's reveal */}
            <mesh position={[-T / 2, (y0 + y1) / 2, zc]} rotation={[0, Math.PI / 2, 0]} material={glass} renderOrder={2} userData={{ noSupport: true }}>
                <planeGeometry args={[z1 - z0 - 0.02, y1 - y0 - 0.02]} />
            </mesh>
            <Span from={[-T - 0.004, y1 - 0.012, z0 - 0.04]} to={[0.035, y1 + 0.04, z1 + 0.04]} color={frame} />
            <Span from={[-T - 0.004, y0 - 0.04, z0 - 0.04]} to={[0.035, y0 + 0.012, z1 + 0.04]} color={frame} />
            <Span from={[-T - 0.004, y0 + 0.012, z0 - 0.04]} to={[0.035, y1 - 0.012, z0 + 0.012]} color={frame} />
            <Span from={[-T - 0.004, y0 + 0.012, z1 - 0.012]} to={[0.035, y1 - 0.012, z1 + 0.04]} color={frame} />
            <Span from={[-T / 2 - 0.012, y0, zc - 0.012]} to={[-T / 2 + 0.012, y1, zc + 0.012]} color={frame} />
            <Span from={[-T, y0 - 0.06, z0 - 0.07]} to={[0.08, y0 - 0.035, z1 + 0.07]} color={frame} />
        </group>
    );
}
