import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { Model } from '../Model';
import { MODEL_URLS } from '../modelUrls';
import { Rest } from '../Rest';
import { canvasTexture } from '../materials';

const LINEN = '#DAC4B3';
const HANDHELD_BOOST = 1.6;
// Upholstery is shaded smoothly across any edge gentler than this, hiding the low-poly facets
const SOFT_CREASE = Math.PI / 3;
// Pillows are all soft, so smooth across their bevelled edges too
const PILLOW_CREASE = Math.PI / 2;

// Soft-edged tortoiseshell-and-white coat, painted per pixel in the shader so patch edges are smooth curves rather
// than following the low-poly model's triangles. Positions are normalised to 0..1 across the model's bounds.
const coatMaterial = () => {
    const bounds = { min: { value: new THREE.Vector3() }, span: { value: new THREE.Vector3(1, 1, 1) } };
    const colours = {
        white: { value: new THREE.Color('#F9F9F9') },
        ginger: { value: new THREE.Color('#E79124') },
        black: { value: new THREE.Color('#2D333A') },
    };
    const material = new THREE.MeshLambertMaterial();
    material.userData.bounds = bounds;
    material.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, { uMin: bounds.min, uSpan: bounds.span, uWhite: colours.white, uGinger: colours.ginger, uBlack: colours.black });
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uMin;\nuniform vec3 uSpan;\nvarying vec3 vCoat;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCoat = (position - uMin) / uSpan;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uWhite;\nuniform vec3 uGinger;\nuniform vec3 uBlack;\nvarying vec3 vCoat;')
            .replace('#include <color_fragment>', `#include <color_fragment>
                vec3 p = vCoat;
                // Broad saddle and cap patches over the back and head; the belly and paws stay white
                float saddle = sin(p.x * 4.2 + 0.6) + sin(p.z * 3.6 + 1.1) + 0.6 * p.y;
                float cover = smoothstep(0.7, 0.85, saddle) * smoothstep(0.28, 0.4, p.y);
                // Tortoiseshell mottling of ginger and black within the patches
                float mottle = sin(p.x * 13.0 + p.z * 9.0) + sin(p.y * 15.0 - p.x * 7.0 + 1.7) + (saddle - 1.4) * 2.5;
                vec3 tortie = mix(uGinger, uBlack, smoothstep(0.3, 0.7, mottle));
                diffuseColor.rgb = mix(uWhite, tortie, cover);`);
    };
    return material;
};

// Soft woven upholstery: fine noise for the weave, plus fabric sheen that catches the light at grazing angles
const upholstery = (color: string) => {
    const weave = canvasTexture(128, 128, ctx => {
        const image = ctx.createImageData(128, 128);
        for (let i = 0; i < 128 * 128; i++) {
            const x = i % 128, y = Math.floor(i / 128);
            const thread = (x % 4 < 2) !== (y % 4 < 2) ? 10 : 0;
            const value = 236 + Math.floor(Math.random() * 19) - thread;
            image.data.set([value, value, value, 255], i * 4);
        }
        ctx.putImageData(image, 0, 0);
    });
    weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
    weave.repeat.set(4, 4);
    return new THREE.MeshPhysicalMaterial({ color, map: weave, roughness: 1, sheen: 1, sheenRoughness: 0.55, sheenColor: new THREE.Color('#FFF4E8') });
};

// A 2.6 m L-shaped sectional with its back to the right-hand wall and the chaise at the far end
export function Sofa() {
    const fabric = useMemo(() => upholstery(LINEN), []);
    useEffect(() => () => { fabric.map?.dispose(); fabric.dispose(); }, [fabric]);
    return (
        <group>
            <Rest drop={false} against="right" gap={0.03}>
                <Model url={MODEL_URLS.sofa} size={{ width: 2.6 }} position={[3.12, 0, 1.0]} material={fabric} smooth={SOFT_CREASE} />
            </Rest>
            <Rest sink={0.035}>
                <Model url={MODEL_URLS.pillow} size={{ width: 0.42 }} position={[2.3, 0.8, 0.72]} rotation={[-0.4, 0.25, 0.05]} recolor={{ carpet: '#E7B3B2' }} smooth={PILLOW_CREASE} />
            </Rest>
            <Rest sink={0.035}>
                <Model url={MODEL_URLS.pillow} size={{ width: 0.42 }} position={[4.0, 0.8, 0.72]} rotation={[-0.4, -0.25, -0.05]} recolor={{ carpet: '#83A1B5' }} smooth={PILLOW_CREASE} />
            </Rest>
        </group>
    );
}

// A white-and-tortoiseshell cat, loafed up asleep on the seat
export function Cat() {
    const coat = useMemo(coatMaterial, []);
    useEffect(() => () => coat.dispose(), [coat]);
    return (
        <Rest sink={0.012}>
            <Model url={MODEL_URLS.cat} size={{ width: 0.42 }} position={[3.05, 0.8, 0.72]} rotation={[0, 0.95, 0]} material={coat} smooth={SOFT_CREASE} />
        </Rest>
    );
}

// The Dream Tracker's dream journal, lying open on the chaise (authored in scripts/build-models.ts)
export function DreamJournal() {
    return (
        <Rest sink={0.01}>
            <Model url={MODEL_URLS.dreamJournal} position={[3.95, 0.8, 1.45]} rotation={[0, 0.45, 0]} />
        </Rest>
    );
}

// A game pad on the rug. Real pads are 15 cm across, which is barely visible at this distance,
// so small handheld things get a modest diorama-style boost
export function GameController() {
    return (
        <Rest>
            <Model url={MODEL_URLS.controller} size={{ width: 0.155 * HANDHELD_BOOST }} position={[2.85, 0.05, 2.15]} rotation={[0, 0.5, 0]} smooth={SOFT_CREASE} />
        </Rest>
    );
}

// Media cabinet with a 55" TV facing the sofa
export function TvConsole() {
    return (
        <group>
            <Rest drop={false}>
                <Model url={MODEL_URLS.tvCabinet} size={{ width: 1.5 }} position={[3.65, 0, 4.24]} rotation={[0, Math.PI, 0]} recolor={{ wood: '#E6E7E8' }} />
            </Rest>
            <Rest>
                <Model url={MODEL_URLS.tv} size={{ width: 1.23 }} position={[3.65, 0.6, 4.26]} rotation={[0, Math.PI, 0]} recolor={{ metalDark: '#3D474C', metal: '#505E63' }} />
            </Rest>
        </group>
    );
}
