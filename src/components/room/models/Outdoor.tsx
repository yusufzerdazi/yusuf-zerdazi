import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { BALCONY, BASE_DEPTH, ROOM_SIZE as L } from '../iso';
import { Span } from '../primitives';
import { Model } from '../Model';
import { MODEL_URLS } from '../modelUrls';
import { Rest } from '../Rest';
import { flat, mat } from '../materials';

// ---------- Ground: the page's isometric grid, as real geometry ----------

const gridVertex = /* glsl */ `
    varying vec3 vWorld;
    void main() {
        vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
    }
`;

// Anti-aliased lines along the world axes, which the isometric camera turns into the familiar diamonds,
// fading out with distance so the grid dissolves into the page
const gridFragment = /* glsl */ `
    uniform vec3 uColor;
    uniform vec2 uCentre;
    uniform float uRadius;
    uniform float uSpacing;
    varying vec3 vWorld;
    void main() {
        vec2 coord = vWorld.xz / uSpacing;
        vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
        float line = 1.0 - min(min(grid.x, grid.y), 1.0);
        float fade = 1.0 - smoothstep(uRadius * 0.35, uRadius, distance(vWorld.xz, uCentre));
        gl_FragColor = vec4(uColor, line * fade);
        #include <colorspace_fragment>
    }
`;

export function Ground() {
    const grid = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color('#DADDD6') },
            uCentre: { value: new THREE.Vector2(L / 2 + 0.6, L / 2) },
            uRadius: { value: 60 },
            uSpacing: { value: 0.5 },
        },
        vertexShader: gridVertex,
        fragmentShader: gridFragment,
        transparent: true,
        depthWrite: false,
    }), []);
    useEffect(() => () => grid.dispose(), [grid]);

    return (
        <group position={[L / 2, -BASE_DEPTH, L / 2]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} material={grid} renderOrder={-1} userData={{ noSupport: true }}>
                <planeGeometry args={[400, 400]} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow userData={{ noSupport: true }}>
                <planeGeometry args={[16, 16]} />
                <shadowMaterial opacity={0.12} depthWrite={false} />
            </mesh>
        </group>
    );
}

// ---------- Balcony off the open side of the room ----------

const RAIL_HEIGHT = 1.0;
// Height of the authored bistro table's top surface (scripts/build-models.ts)
const TABLE_TOP = 0.7125;

export function Balcony() {
    const glass = useMemo(() => new THREE.MeshLambertMaterial({ color: '#CFE6F2', transparent: true, opacity: 0.3, depthWrite: false }), []);
    useEffect(() => () => glass.dispose(), [glass]);
    const { x0, x1, z0, z1 } = BALCONY;
    const post = mat('#D0D2D3');
    const rail = mat('#FFFFFF');
    const deckTop = -0.004;

    // Deck boards run out from the room, alternating two warm tones, sitting just below the room's floor level
    const boards = useMemo(() => {
        const list: { z: number; tone: string }[] = [];
        for (let z = z0, i = 0; z < z1 - 0.01; z += 0.13, i++) list.push({ z, tone: i % 2 ? '#D6C3B2' : '#DAC4B3' });
        return list;
    }, [z0, z1]);

    const outerPosts: [number, number][] = [];
    for (let i = 0; i <= 3; i++) outerPosts.push([x1 - 0.025, z0 + 0.03 + ((z1 - z0 - 0.055) * i) / 3]);
    outerPosts.push([x0 + 0.5, z1 - 0.025], [x0 + 1.0, z1 - 0.025], [x0 + 0.5, z0 + 0.025], [x0 + 1.0, z0 + 0.025]);

    return (
        <group>
            {/* Slab continuing the room's, with the same edge colours so the two read as one */}
            <Span from={[x0, -BASE_DEPTH, z0]} to={[x1, deckTop - 0.02, z1]} color={[flat('#E4E4E4'), flat('#E4E4E4'), flat('#F9F9F9'), flat('#F9F9F9'), flat('#EDEDED'), flat('#EDEDED')]} />
            {boards.map(({ z, tone }) => (
                <Span key={z} from={[x0, deckTop - 0.02, z + 0.005]} to={[x1, deckTop, Math.min(z + 0.125, z1)]} color={mat(tone)} />
            ))}
            {/* Aluminium threshold where the room floor meets the deck */}
            <Span from={[x0 - 0.04, -0.01, z0]} to={[x0 + 0.04, 0.006, z1]} color={mat('#D0D2D3')} />

            {/* Glass balustrade on all three sides; the back run is fixed to the end of the room's wall */}
            <Span from={[x0, deckTop, z0]} to={[x0 + 0.03, RAIL_HEIGHT + 0.03, z0 + 0.05]} color={post} />
            <Span from={[x0, RAIL_HEIGHT, z0]} to={[x1, RAIL_HEIGHT + 0.03, z0 + 0.05]} color={rail} />
            <mesh position={[(x0 + x1) / 2, RAIL_HEIGHT / 2, z0 + 0.025]} material={glass} userData={{ noSupport: true }}>
                <planeGeometry args={[x1 - x0, RAIL_HEIGHT - 0.06]} />
            </mesh>
            {outerPosts.map(([x, z]) => (
                <Span key={`${x}${z}`} from={[x - 0.02, deckTop, z - 0.02]} to={[x + 0.02, RAIL_HEIGHT, z + 0.02]} color={post} />
            ))}
            <Span from={[x1 - 0.05, RAIL_HEIGHT, z0]} to={[x1, RAIL_HEIGHT + 0.03, z1]} color={rail} />
            <Span from={[x0, RAIL_HEIGHT, z1 - 0.05]} to={[x1, RAIL_HEIGHT + 0.03, z1]} color={rail} />
            <mesh position={[x1 - 0.025, RAIL_HEIGHT / 2, (z0 + z1) / 2]} rotation={[0, Math.PI / 2, 0]} material={glass} userData={{ noSupport: true }}>
                <planeGeometry args={[z1 - z0, RAIL_HEIGHT - 0.06]} />
            </mesh>
            <mesh position={[(x0 + x1) / 2, RAIL_HEIGHT / 2, z1 - 0.025]} material={glass} userData={{ noSupport: true }}>
                <planeGeometry args={[x1 - x0, RAIL_HEIGHT - 0.06]} />
            </mesh>

            {/* A deck chair looking out, a café table and a little plant */}
            <Rest>
                <Model url={MODEL_URLS.deckChair} position={[x0 + 0.75, 0.05, 0.95]} rotation={[0, Math.PI / 2 + 0.35, 0]} />
            </Rest>
            {/* Table and plant settle as one, so the plant can't miss the tabletop if the models load out of order */}
            <Rest>
                <group position={[x0 + 0.8, 0.05, 1.85]}>
                    <Model url={MODEL_URLS.bistroTable} />
                    <Model url={MODEL_URLS.plantSmall} size={{ height: 0.25 }} position={[0, TABLE_TOP, 0]} />
                </group>
            </Rest>
        </group>
    );
}

// ---------- Trees on the ground around the room ----------

// Trees from Kenney's Nature Kit, one family of shapes recoloured to the illustration's greens. Gentle smoothing
// rounds the canopies while keeping the kit's chunky low-poly character.
const TREE_COLOURS = { leafsGreen: '#6F9C0D', _defaultMat: '#5A770B', woodBark: '#71675D' };
const TREE_CREASE = Math.PI / 4;

function Tree({ url, height, position, turn }: { url: string; height: number; position: [number, number]; turn: number }) {
    return <Model url={url} size={{ height }} position={[position[0], -BASE_DEPTH, position[1]]} rotation={[0, turn, 0]} recolor={TREE_COLOURS} smooth={TREE_CREASE} />;
}

export function Trees() {
    return (
        <group>
            <Tree url={MODEL_URLS.treeOak} height={2.6} position={[-1.1, 0.6]} turn={0.6} />
            <Tree url={MODEL_URLS.treeDetailed} height={2.1} position={[-1.2, 3.6]} turn={2.2} />
            {/* Front-left, balancing the balcony on the other side */}
            <Tree url={MODEL_URLS.treeFat} height={1.8} position={[0.6, L + 1.3]} turn={3.1} />
            <Tree url={MODEL_URLS.treeDefault} height={2.2} position={[L + 0.1, -0.9]} turn={1.0} />
        </group>
    );
}
