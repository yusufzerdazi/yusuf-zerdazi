import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const vertexShader = /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vReflected;
    void main() {
        vReflected = textureMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = /* glsl */ `
    uniform sampler2D reflection;
    uniform vec3 tint;
    uniform float tintStrength;
    varying vec4 vReflected;
    void main() {
        vec3 colour = texture2DProj(reflection, vReflected).rgb;
        gl_FragColor = vec4(mix(colour, tint, tintStrength), 1.0);
        #include <colorspace_fragment>
    }
`;

interface PlanarMirrorProps extends Omit<JSX.IntrinsicElements['mesh'], 'material'> {
    geometry: THREE.BufferGeometry;
    tint?: string;
    tintStrength?: number;
    resolution?: number;
}

// A flat mirror facing the mesh's local +Z. Each frame the scene is rendered from a viewer reflected across the
// mirror plane and projected back onto the glass (the same maths as three's Reflector), with everything behind the
// glass cut away by a clipping plane.
//
// The room's isometric camera is infinitely far away, so reflecting it directly gives a physically correct but
// odd-feeling mirror whose image drifts along with the room as the view moves. Instead the viewer is an imaginary
// person standing `eyeDistance` in front of the glass on the camera's line of sight, with a perspective eye, so
// the reflection shifts against the room as the view tilts, like a mirror seen up close.
export function PlanarMirror({ geometry, tint = '#DCE4EF', tintStrength = 0.22, resolution = 512, eyeDistance = 2, ...props }: PlanarMirrorProps & { eyeDistance?: number }) {
    const mesh = useRef<THREE.Mesh>(null);
    const state = useMemo(() => {
        const target = new THREE.WebGLRenderTarget(resolution, resolution, { samples: 2 });
        const textureMatrix = new THREE.Matrix4();
        return {
            target,
            textureMatrix,
            virtualCamera: new THREE.PerspectiveCamera(55, 1, 0.05, 30),
            clipPlane: new THREE.Plane(),
            material: new THREE.ShaderMaterial({
                uniforms: {
                    reflection: { value: target.texture },
                    textureMatrix: { value: textureMatrix },
                    tint: { value: new THREE.Color(tint) },
                    tintStrength: { value: tintStrength },
                },
                vertexShader,
                fragmentShader,
            }),
        };
    }, [resolution, tint, tintStrength]);
    useEffect(() => () => { state.target.dispose(); state.material.dispose(); }, [state]);

    const scratch = useMemo(() => ({
        mirrorPosition: new THREE.Vector3(), cameraPosition: new THREE.Vector3(), rotation: new THREE.Matrix4(),
        normal: new THREE.Vector3(), view: new THREE.Vector3(), lookAt: new THREE.Vector3(), target: new THREE.Vector3(),
    }), []);

    const frame = useRef(0);
    useFrame(({ gl, scene, camera }) => {
        const mirror = mesh.current;
        // Half rate is plenty for a reflection
        if (!mirror || frame.current++ % 2) return;
        const { mirrorPosition, cameraPosition, rotation, normal, view, lookAt, target } = scratch;
        const { virtualCamera, textureMatrix, clipPlane } = state;

        mirrorPosition.setFromMatrixPosition(mirror.matrixWorld);
        rotation.extractRotation(mirror.matrixWorld);
        normal.set(0, 0, 1).applyMatrix4(rotation);
        // The imaginary viewer: back along the camera's line of sight from the middle of the glass
        rotation.extractRotation(camera.matrixWorld);
        cameraPosition.set(0, 0, 1).applyMatrix4(rotation).multiplyScalar(eyeDistance).add(mirrorPosition);
        view.subVectors(mirrorPosition, cameraPosition);
        if (view.dot(normal) > 0) return; // looking at the back of the mirror

        // Reflect the camera position, its view target and its up vector across the mirror plane
        view.reflect(normal).negate().add(mirrorPosition);
        lookAt.set(0, 0, -1).applyMatrix4(rotation).add(cameraPosition);
        target.subVectors(mirrorPosition, lookAt).reflect(normal).negate().add(mirrorPosition);
        virtualCamera.position.copy(view);
        virtualCamera.up.set(0, 1, 0).applyMatrix4(rotation).reflect(normal);
        virtualCamera.lookAt(target);
        virtualCamera.updateMatrixWorld();

        textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
            .multiply(virtualCamera.projectionMatrix)
            .multiply(virtualCamera.matrixWorldInverse)
            .multiply(mirror.matrixWorld);

        // Render everything in front of the glass into the reflection texture
        clipPlane.setFromNormalAndCoplanarPoint(normal, mirrorPosition);
        const previous = { target: gl.getRenderTarget(), clipping: gl.clippingPlanes, shadows: gl.shadowMap.autoUpdate, needsUpdate: gl.shadowMap.needsUpdate };
        mirror.visible = false;
        gl.clippingPlanes = [clipPlane];
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = false;
        gl.setRenderTarget(state.target);
        gl.clear();
        gl.render(scene, virtualCamera);
        gl.setRenderTarget(previous.target);
        gl.clippingPlanes = previous.clipping;
        gl.shadowMap.autoUpdate = previous.shadows;
        gl.shadowMap.needsUpdate = previous.needsUpdate;
        mirror.visible = true;
    });

    return <mesh ref={mesh} geometry={geometry} material={state.material} userData={{ noSheen: true, noSupport: true }} {...props} />;
}
