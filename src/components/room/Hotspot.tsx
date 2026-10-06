import * as THREE from 'three';
import { ReactNode, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { HIT_LAYER, Vec3 } from './iso';

// A band of light that sweeps across an object, like the sheen on the original illustration.
// It's injected into the object's own materials, measured in world space along a direction that
// reads as a diagonal on screen, so every object shimmers the same way regardless of its shape.
interface Sheen {
    position: { value: number };
    width: { value: number };
    strength: { value: number };
    lift: { value: number };
    direction: { value: THREE.Vector3 };
}

const patchMaterial = (source: THREE.Material, sheen: Sheen) => {
    const material = source.clone();
    // Keep any shader changes the object already has (e.g. the cat's painted coat) and add the sheen on top
    const previous = source.onBeforeCompile.bind(source);
    material.onBeforeCompile = (shader, renderer) => {
        previous(shader, renderer);
        shader.uniforms.uSheenPosition = sheen.position;
        shader.uniforms.uSheenWidth = sheen.width;
        shader.uniforms.uSheenStrength = sheen.strength;
        shader.uniforms.uSheenLift = sheen.lift;
        shader.uniforms.uSheenDirection = sheen.direction;
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vSheenWorld;')
            .replace('#include <project_vertex>', `#include <project_vertex>
                vec4 sheenWorld = vec4(transformed, 1.0);
                #ifdef USE_INSTANCING
                    sheenWorld = instanceMatrix * sheenWorld;
                #endif
                vSheenWorld = (modelMatrix * sheenWorld).xyz;`);
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', `#include <common>
                varying vec3 vSheenWorld;
                uniform float uSheenPosition;
                uniform float uSheenWidth;
                uniform float uSheenStrength;
                uniform float uSheenLift;
                uniform vec3 uSheenDirection;`)
            .replace('#include <dithering_fragment>', `#include <dithering_fragment>
                float sheenDistance = abs(dot(vSheenWorld, uSheenDirection) - uSheenPosition);
                float sheen = 1.0 - smoothstep(0.0, uSheenWidth, sheenDistance);
                gl_FragColor.rgb += (sheen * sheen * uSheenStrength + uSheenLift) * (1.0 - gl_FragColor.rgb * 0.5);`);
    };
    material.customProgramCacheKey = () => `sheen-${source.customProgramCacheKey()}`;
    return material;
};

// Up-and-to-the-right on screen for the isometric camera: camera right (1, 0, -1) plus camera up
const SHEEN_DIRECTION = new THREE.Vector3(1, 0, -1).normalize().multiplyScalar(0.8)
    .add(new THREE.Vector3(-1, 2, -1).normalize()).normalize();


const IDLE_PERIOD = 7;
const HOVER_PERIOD = 1.1;

export interface HotspotProps {
    id: string;
    delay: number;
    hovered: boolean;
    showSheen: boolean;
    // Offset applied while hovered, pointing away from whatever the object rests on
    lift?: Vec3;
    children: ReactNode;
}

// The visual side of an interactive object: idle and hover shimmer, lifting on hover, and an invisible hit box
// covering where it rests and lifts to, which HoverController uses to keep hovers stable while it moves
export function Hotspot({ id, delay, hovered, showSheen, lift = [0, 0.05, 0], children }: HotspotProps) {
    const inner = useRef<THREE.Group>(null);
    const hitBox = useRef<THREE.Mesh>(null);
    const scene = useThree(state => state.scene);
    const sheen = useMemo<Sheen>(() => ({
        position: { value: -1000 },
        width: { value: 0.1 },
        strength: { value: 0 },
        lift: { value: 0 },
        direction: { value: SHEEN_DIRECTION },
    }), []);
    const range = useRef({ from: 0, to: 1 });
    const phase = useRef({ hoverStart: 0, wasHovered: false });

    // Give every mesh its own copy of its material with the sheen injected; skip flagged extras like glows
    useLayoutEffect(() => {
        const swapped: { mesh: THREE.Mesh; original: THREE.Material | THREE.Material[] }[] = [];
        const visit = (object: THREE.Object3D) => {
            if (object.userData.noSheen) return;
            const mesh = object as THREE.Mesh;
            if (mesh.isMesh) {
                swapped.push({ mesh, original: mesh.material });
                mesh.material = Array.isArray(mesh.material)
                    ? mesh.material.map(material => patchMaterial(material, sheen))
                    : patchMaterial(mesh.material, sheen);
            }
            object.children.forEach(visit);
        };
        if (inner.current) visit(inner.current);

        // Sweep across the object's extent along the sheen direction
        scene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(inner.current!);
        let from = Infinity, to = -Infinity;
        for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
            const d = SHEEN_DIRECTION.dot(new THREE.Vector3(x, y, z));
            from = Math.min(from, d);
            to = Math.max(to, d);
        }
        sheen.width.value = Math.max(0.06, (to - from) * 0.2);
        range.current = { from: from - sheen.width.value, to: to + sheen.width.value };

        // Hit box covering where the object rests and where it lifts to, so hovering stays stable while it moves
        if (hitBox.current) {
            box.union(box.clone().translate(new THREE.Vector3(...lift))).expandByScalar(0.02);
            hitBox.current.position.copy(box.getCenter(new THREE.Vector3()));
            hitBox.current.scale.copy(box.getSize(new THREE.Vector3()));
            hitBox.current.layers.set(HIT_LAYER);
        }

        return () => swapped.forEach(({ mesh, original }) => {
            (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => material.dispose());
            mesh.material = original;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene, sheen]);

    const liftVector = useMemo(() => new THREE.Vector3(...lift), [lift]);

    useFrame(({ clock }, delta) => {
        const t = clock.elapsedTime;
        if (hovered && !phase.current.wasHovered) phase.current.hoverStart = t;
        phase.current.wasHovered = hovered;

        // Hovered: quick repeating sweeps. Idle: one slow sweep every few seconds, staggered per object.
        const progress = hovered
            ? ((t - phase.current.hoverStart) % HOVER_PERIOD) / HOVER_PERIOD
            : (((t - delay) % IDLE_PERIOD) + IDLE_PERIOD) % IDLE_PERIOD / 1.4;
        const { from, to } = range.current;
        sheen.position.value = progress <= 1 ? THREE.MathUtils.lerp(from, to, progress) : -1000;
        sheen.strength.value = THREE.MathUtils.damp(sheen.strength.value, !showSheen ? 0 : hovered ? 0.85 : 0.45, 8, delta);
        sheen.lift.value = THREE.MathUtils.damp(sheen.lift.value, hovered ? 0.06 : 0, 10, delta);

        if (inner.current) {
            inner.current.position.lerp(hovered ? liftVector : ZERO, 1 - Math.exp(-delta * 14));
        }
    });

    return (
        <group
            name={id}
            userData={{ hotspot: id }}
        >
            <group ref={inner}>{children}</group>
            <mesh ref={hitBox} userData={{ noSheen: true, noSupport: true, noShadow: true, hitBox: true }}>
                <boxGeometry />
                <meshBasicMaterial visible={false} />
            </mesh>
        </group>
    );
}

const ZERO = new THREE.Vector3();
